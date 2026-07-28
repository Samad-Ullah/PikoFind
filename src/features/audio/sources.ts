/**
 * Audio asset registry — maps stable string keys to bundled audio sources.
 *
 * We record a warm human voice (master plan §17), not device TTS, so the real
 * files land in `assets/audio/{en,music,sfx}/` during the vertical slice and
 * content phases. Until then these maps are intentionally EMPTY: the engine
 * treats an unknown key as a silent no-op (a voice call still resolves), so the
 * game flow can be built and awaited before a single recording exists. Add a
 * `require('../../../assets/audio/…')` entry here the moment a file arrives — no
 * engine change needed.
 */
import type { AudioSource } from 'expo-audio';

import type { WorldId } from '@/content/worlds';

/** Reused feedback sounds — kept loaded because they play on every challenge. */
export type SfxKey = 'correct' | 'wrong' | 'tap' | 'star' | 'sticker';

/** One quiet, non-vocal background loop per world. */
export type MusicKey = WorldId;

/**
 * Spoken content: world introductions, level instructions, celebration and
 * encouragement phrases. Keys are content-driven (they come from the level
 * definitions in Phase 7), so this is an open string type rather than a union.
 */
export type VoiceKey = string;

// --- Registries (populated as recordings are produced) -----------------------

export const voiceSources: Record<VoiceKey, AudioSource> = {};

export const musicSources: Partial<Record<MusicKey, AudioSource>> = {};

export const sfxSources: Partial<Record<SfxKey, AudioSource>> = {};

// --- Resolution --------------------------------------------------------------

export function resolveVoice(key: VoiceKey): AudioSource | null {
  return voiceSources[key] ?? null;
}

export function resolveMusic(key: MusicKey): AudioSource | null {
  return musicSources[key] ?? null;
}

export function resolveSfx(key: SfxKey): AudioSource | null {
  return sfxSources[key] ?? null;
}
