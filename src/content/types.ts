/**
 * Level content model (master plan §15), trimmed to what the placeholder game
 * needs now and named so Phase 7 can extend it without churn. Real scene art and
 * recorded instructions arrive in the vertical-slice / content phases; until then
 * objects render as labelled coloured shapes and audio keys resolve to silence.
 */
import type { VoiceKey } from '@/features/audio';

import type { WorldId } from './worlds';

export type ObjectCategory = 'animal' | 'toy' | 'shape' | 'food' | 'school' | 'nature';

/** Placeholder visual until real artwork lands (Phase 5). */
export type PlaceholderShape = 'circle' | 'square' | 'rounded' | 'triangle';

export interface SceneObject {
  id: string;
  /** Human name — accessibility label and the dev placeholder caption. */
  label: string;
  category: ObjectCategory;
  shape: PlaceholderShape;
  color: string;
  /** Normalized centre (0..1) within the 16:9 scene. */
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

export interface Level {
  id: string;
  worldId: WorldId;
  difficulty: 1 | 2 | 3;
  /** On-screen text (parents / older children); the child relies on the audio. */
  instructionText: string;
  instructionAudioKey: VoiceKey;
  objects: SceneObject[];
  /** Object id(s) that count as a correct find. */
  targetObjectIds: string[];
  /** Stars awarded for finding the target. */
  stars: number;
  assistance: AssistanceRule;
}

export const DEFAULT_ASSISTANCE: AssistanceRule = {
  highlightAfterAttempts: 2,
  repeatAfterAttempts: 2,
};
