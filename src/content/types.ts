/**
 * Content model. A **Challenge** is a single "find the …" question (one scene of
 * objects with one correct target). A **Level** is a group of challenges
 * (Duolingo-style); levels live per World and unlock in order. Objects are
 * coloured-shape placeholders until real artwork lands; Piko speaks each
 * instruction via device TTS until recordings exist.
 */
import type { VoiceKey } from '@/features/audio';

import type { WorldId } from './worlds';

export type ObjectCategory = 'animal' | 'toy' | 'shape' | 'food' | 'school' | 'nature';

/** Placeholder visual until real artwork lands (Phase 5). */
export type PlaceholderShape = 'circle' | 'square' | 'rounded' | 'triangle' | 'star';

export interface SceneObject {
  id: string;
  /** Human name — accessibility label. */
  label: string;
  category: ObjectCategory;
  shape: PlaceholderShape;
  color: string;
  /** Normalized centre (0..1) within the scene. */
  x: number;
  y: number;
  /** Normalized width (0..1 of scene width); the shape is square. */
  width: number;
}

export interface AssistanceRule {
  /** Gently highlight the correct object after this many wrong taps. */
  highlightAfterAttempts: number;
  /** Repeat the spoken instruction after this many wrong taps. */
  repeatAfterAttempts: number;
}

/** A single find-it question. */
export interface Challenge {
  id: string;
  worldId: WorldId;
  /** On-screen text (parents / older children); the child relies on the audio. */
  instructionText: string;
  instructionAudioKey: VoiceKey;
  objects: SceneObject[];
  /** Object id(s) that count as a correct find. */
  targetObjectIds: string[];
  assistance: AssistanceRule;
}

export const DEFAULT_ASSISTANCE: AssistanceRule = {
  highlightAfterAttempts: 2,
  repeatAfterAttempts: 2,
};

/** How many questions each level contains. */
export const QUESTIONS_PER_LEVEL = 10;
