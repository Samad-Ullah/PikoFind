/**
 * AudioManager — the single audio engine for PikoFind (master plan §17).
 *
 * Design rules it enforces:
 *  - ONE voice at a time. Starting a new instruction replaces the previous
 *    source on the same player, so voice never overlaps voice however fast a
 *    child taps. `playVoice` returns a promise that resolves when the clip ends
 *    (or immediately if interrupted / disabled / not yet recorded), so gameplay
 *    can `await` an instruction without ever hanging.
 *  - At most one quiet music loop. It sits below the voice and DUCKS further
 *    while an instruction is speaking, then restores.
 *  - Short feedback sounds (correct / wrong / tap / star / sticker) stay loaded
 *    because they repeat every challenge.
 *  - Every channel obeys the persisted settings — `soundOn` is the master
 *    switch; `voiceOn` / `musicOn` / `effectsOn` are the finer parent controls.
 *    Toggling a setting takes effect immediately (a subscription reconciles).
 *  - Audio pauses when the app goes to the background and resumes on return.
 *
 * The engine is framework-free (no hooks) so any code — including future game
 * logic — can call it directly. Call `audio.init()` once from the root layout.
 */
import {
  createAudioPlayer,
  setAudioModeAsync,
  type AudioPlayer,
  type AudioStatus,
} from 'expo-audio';
import * as Speech from 'expo-speech';
import { AppState, type AppStateStatus } from 'react-native';

import { useSettings } from '@/store/useSettings';

import { resolveMusic, resolveSfx, resolveVoice, type MusicKey, type SfxKey, type VoiceKey } from './sources';

/** Voice at full level; music deliberately quiet and quieter still under voice. */
const VOICE_VOLUME = 1;
const MUSIC_VOLUME = 0.35;
const MUSIC_DUCKED = 0.12;
const SFX_VOLUME = 0.9;

type Subscription = { remove: () => void };

class AudioManager {
  private initialized = false;
  private settingsUnsub: (() => void) | null = null;
  private appStateSub: Subscription | null = null;

  // Voice channel — a single reused player (for recordings) + a device-TTS
  // fallback so Piko talks before any audio is recorded. Only one voice is ever
  // audible; a token makes stale async callbacks (TTS / playback) no-ops.
  private voicePlayer: AudioPlayer | null = null;
  private voiceStatusSub: Subscription | null = null;
  private voiceResolve: (() => void) | null = null;
  private voiceToken = 0;
  private playerToken = 0;

  // Music channel — a single looping player.
  private musicPlayer: AudioPlayer | null = null;
  private musicKey: MusicKey | null = null;
  private loadedMusicKey: MusicKey | null = null;

  // Feedback sounds — kept loaded, one player per key.
  private sfxPlayers = new Map<SfxKey, AudioPlayer>();

  // Best available device TTS voice (chosen once at init); undefined = default.
  private ttsVoice: string | undefined;

  private warnedMissing = new Set<string>();

  // --- Lifecycle -------------------------------------------------------------

  init(): void {
    if (this.initialized) return;
    this.initialized = true;

    // Respect the device's silent switch (no sudden loud audio), do not keep
    // playing in the background, and duck other apps' audio rather than cutting
    // it. Fire-and-forget; playback tolerates the mode still being applied.
    void setAudioModeAsync({
      playsInSilentMode: false,
      shouldPlayInBackground: false,
      interruptionMode: 'duckOthers',
    });

    this.settingsUnsub = useSettings.subscribe(() => this.onSettingsChange());
    this.appStateSub = AppState.addEventListener('change', (s) => this.onAppStateChange(s));
    void this.pickVoice();
  }

  /** Choose the nicest English voice the device offers (enhanced if available). */
  private async pickVoice(): Promise<void> {
    try {
      const voices = await Speech.getAvailableVoicesAsync();
      const en = voices.filter((v) => v.language?.toLowerCase().startsWith('en'));
      const best =
        en.find((v) => v.quality === Speech.VoiceQuality.Enhanced && v.language?.toLowerCase() === 'en-us') ??
        en.find((v) => v.quality === Speech.VoiceQuality.Enhanced) ??
        en.find((v) => v.language?.toLowerCase() === 'en-us') ??
        en[0];
      this.ttsVoice = best?.identifier;
    } catch {
      this.ttsVoice = undefined; // fall back to the platform default voice
    }
  }

  /** Release every native player. Rarely needed — mainly for tests/teardown. */
  teardown(): void {
    this.settingsUnsub?.();
    this.appStateSub?.remove();
    this.voiceStatusSub?.remove();
    this.stopVoice();
    this.voicePlayer?.remove();
    this.musicPlayer?.remove();
    this.sfxPlayers.forEach((p) => p.remove());
    this.sfxPlayers.clear();
    this.voicePlayer = null;
    this.musicPlayer = null;
    this.loadedMusicKey = null;
    this.musicKey = null;
    this.initialized = false;
  }

  // --- Voice -----------------------------------------------------------------

  /**
   * Say one line. If a recording exists for `key` it plays; otherwise, when
   * `fallbackText` is given, the device's text-to-speech says it — so Piko talks
   * even before any audio is recorded. Resolves when the line finishes, or
   * immediately if interrupted, disabled, or there's nothing to say.
   */
  playVoice(key: VoiceKey, fallbackText?: string): Promise<void> {
    if (!this.beginVoice()) return Promise.resolve();

    const source = resolveVoice(key);
    if (source != null) {
      const token = this.voiceToken;
      const player = this.ensureVoicePlayer();
      this.playerToken = token;
      player.replace(source); // stops the old clip and loads the new at position 0
      player.volume = VOICE_VOLUME;
      player.play();
      this.duckMusic(true);
      return new Promise<void>((resolve) => {
        this.voiceResolve = resolve;
      });
    }

    if (fallbackText != null && fallbackText.length > 0) {
      return this.speakText(fallbackText);
    }
    this.warnMissing('voice', key);
    return Promise.resolve();
  }

  /** Speak arbitrary text via device TTS — e.g. a reaction like "Yahoo!". */
  speak(text: string): Promise<void> {
    if (!this.beginVoice()) return Promise.resolve();
    return this.speakText(text);
  }

  /** Stop the current voice (recording or TTS) and settle its awaiter. */
  stopVoice(): void {
    this.voiceToken += 1;
    this.voicePlayer?.pause();
    Speech.stop();
    this.endVoice();
  }

  private ensureVoicePlayer(): AudioPlayer {
    if (this.voicePlayer) return this.voicePlayer;
    const player = createAudioPlayer(null);
    this.voiceStatusSub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (status.didJustFinish && this.playerToken === this.voiceToken) this.endVoice();
    });
    this.voicePlayer = player;
    return player;
  }

  /** Speak via device TTS with a cheerful, kid-friendly voice. */
  private speakText(text: string): Promise<void> {
    const token = this.voiceToken;
    this.duckMusic(true);
    return new Promise<void>((resolve) => {
      this.voiceResolve = resolve;
      const done = () => {
        if (token === this.voiceToken) this.endVoice();
      };
      Speech.speak(text, {
        language: 'en-US',
        voice: this.ttsVoice,
        pitch: 1.15,
        rate: 0.94,
        onDone: done,
        onStopped: done,
        onError: done,
      });
    });
  }

  /**
   * Interrupt any current voice: bump the token so stale callbacks are ignored,
   * stop the player + TTS, resolve the previous awaiter. Returns whether voice
   * is currently enabled in settings.
   */
  private beginVoice(): boolean {
    this.voiceToken += 1;
    this.voicePlayer?.pause();
    Speech.stop();
    this.endVoice();
    const { soundOn, voiceOn } = useSettings.getState();
    return soundOn && voiceOn;
  }

  /** Resolve the pending voice promise (if any) and restore music volume. */
  private endVoice(): void {
    const resolve = this.voiceResolve;
    this.voiceResolve = null;
    this.duckMusic(false);
    resolve?.();
  }

  private voiceActive(): boolean {
    return this.voiceResolve != null;
  }

  // --- Music -----------------------------------------------------------------

  /** Start (or switch to) the quiet loop for a world. */
  playMusic(key: MusicKey): void {
    this.musicKey = key;
    this.reconcileMusic();
  }

  /** Stop the world loop (e.g. on leaving a world). */
  stopMusic(): void {
    this.musicKey = null;
    this.musicPlayer?.pause();
  }

  private ensureMusicPlayer(): AudioPlayer {
    if (this.musicPlayer) return this.musicPlayer;
    this.musicPlayer = createAudioPlayer(null);
    return this.musicPlayer;
  }

  /** Apply the desired music state derived from settings + the current key. */
  private reconcileMusic(): void {
    const { soundOn, musicOn } = useSettings.getState();
    const key = this.musicKey;
    const shouldPlay = soundOn && musicOn && key != null;

    if (!shouldPlay) {
      if (this.musicPlayer?.playing) this.musicPlayer.pause();
      return;
    }

    const source = resolveMusic(key);
    if (source == null) {
      this.warnMissing('music', key);
      return;
    }

    const player = this.ensureMusicPlayer();
    if (this.loadedMusicKey !== key) {
      player.replace(source);
      player.loop = true;
      this.loadedMusicKey = key;
    }
    player.volume = this.voiceActive() ? MUSIC_DUCKED : MUSIC_VOLUME;
    if (!player.playing) player.play();
  }

  private duckMusic(underVoice: boolean): void {
    if (this.musicPlayer?.playing) {
      this.musicPlayer.volume = underVoice ? MUSIC_DUCKED : MUSIC_VOLUME;
    }
  }

  // --- Feedback sounds -------------------------------------------------------

  playSfx(key: SfxKey): void {
    const { soundOn, effectsOn } = useSettings.getState();
    if (!soundOn || !effectsOn) return;

    const source = resolveSfx(key);
    if (source == null) {
      this.warnMissing('sfx', key);
      return;
    }

    let player = this.sfxPlayers.get(key);
    if (!player) {
      player = createAudioPlayer(source);
      player.volume = SFX_VOLUME;
      this.sfxPlayers.set(key, player);
    } else {
      void player.seekTo(0);
    }
    player.play();
  }

  // --- Settings + background handling ----------------------------------------

  private onSettingsChange(): void {
    const { soundOn, voiceOn } = useSettings.getState();
    if ((!soundOn || !voiceOn) && this.voiceActive()) this.stopVoice();
    this.reconcileMusic();
  }

  private onAppStateChange(next: AppStateStatus): void {
    if (next === 'active') {
      this.reconcileMusic();
      return;
    }
    // Backgrounded or inactive: stop voice and pause music.
    this.stopVoice();
    this.musicPlayer?.pause();
  }

  private warnMissing(channel: string, key: string): void {
    if (!__DEV__) return;
    const tag = `${channel}:${key}`;
    if (this.warnedMissing.has(tag)) return;
    this.warnedMissing.add(tag);
    console.warn(`[audio] no recording yet for ${channel} key "${key}" — playing silently.`);
  }
}

/** App-wide singleton. Call `audio.init()` once from the root layout. */
export const audio = new AudioManager();
