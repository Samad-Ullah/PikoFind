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

  // Voice channel — a single reused player, source swapped per instruction.
  private voicePlayer: AudioPlayer | null = null;
  private voiceStatusSub: Subscription | null = null;
  private voiceResolve: (() => void) | null = null;

  // Music channel — a single looping player.
  private musicPlayer: AudioPlayer | null = null;
  private musicKey: MusicKey | null = null;
  private loadedMusicKey: MusicKey | null = null;

  // Feedback sounds — kept loaded, one player per key.
  private sfxPlayers = new Map<SfxKey, AudioPlayer>();

  // Background/resume bookkeeping.
  private voiceWasPlaying = false;

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
  }

  /** Release every native player. Rarely needed — mainly for tests/teardown. */
  teardown(): void {
    this.settingsUnsub?.();
    this.appStateSub?.remove();
    this.voiceStatusSub?.remove();
    this.settleVoice();
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
   * Speak one instruction. Resolves when it finishes (or immediately if it is
   * interrupted by another voice, disabled in settings, or not yet recorded).
   */
  playVoice(key: VoiceKey): Promise<void> {
    // Interrupting an in-flight instruction counts as finishing it: settle the
    // previous awaiter first so nothing is left hanging.
    this.settleVoice();

    const { soundOn, voiceOn } = useSettings.getState();
    if (!soundOn || !voiceOn) return Promise.resolve();

    const source = resolveVoice(key);
    if (source == null) {
      this.warnMissing('voice', key);
      return Promise.resolve();
    }

    const player = this.ensureVoicePlayer();
    player.replace(source); // stops the old clip and loads the new at position 0
    player.volume = VOICE_VOLUME;
    player.play();
    this.duckMusic(true);

    return new Promise<void>((resolve) => {
      this.voiceResolve = resolve;
    });
  }

  /** Replay the current instruction from the start. */
  replayVoice(): void {
    if (!this.voicePlayer) return;
    const { soundOn, voiceOn } = useSettings.getState();
    if (!soundOn || !voiceOn) return;
    void this.voicePlayer.seekTo(0);
    this.voicePlayer.play();
    this.duckMusic(true);
  }

  /** Stop the current instruction and settle its awaiter. */
  stopVoice(): void {
    this.voicePlayer?.pause();
    this.settleVoice();
  }

  private ensureVoicePlayer(): AudioPlayer {
    if (this.voicePlayer) return this.voicePlayer;
    const player = createAudioPlayer(null);
    this.voiceStatusSub = player.addListener('playbackStatusUpdate', (status: AudioStatus) => {
      if (status.didJustFinish) this.settleVoice();
    });
    this.voicePlayer = player;
    return player;
  }

  /** Resolve the pending voice promise (if any) and restore music volume. */
  private settleVoice(): void {
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
    if ((!soundOn || !voiceOn) && this.voicePlayer?.playing) {
      this.stopVoice();
    }
    this.reconcileMusic();
  }

  private onAppStateChange(next: AppStateStatus): void {
    if (next === 'active') {
      const { soundOn, voiceOn } = useSettings.getState();
      if (this.voiceWasPlaying && soundOn && voiceOn) this.voicePlayer?.play();
      this.voiceWasPlaying = false;
      this.reconcileMusic();
      return;
    }
    // Backgrounded or inactive: remember what was playing, then pause.
    this.voiceWasPlaying = this.voicePlayer?.playing ?? false;
    this.voicePlayer?.pause();
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
