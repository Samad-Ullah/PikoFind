/**
 * Game-session state machine (master plan §16) for ONE level's run of questions,
 * as a Zustand store.
 *
 *   loading → instruction → waiting → correct  ─┐
 *                                  ↘ incorrect ─┘→ (waiting, with assistance)
 *                          correct → next question → … → complete
 *
 * It holds NO audio or timers — the screen reacts to `phase` to play sounds and
 * schedule the feedback pauses, then calls `resolveCorrect` / `resolveIncorrect`
 * / `instructionDone`. Keeping it pure makes the guarantees testable:
 *  - a tap is only honoured in `waiting`, and immediately leaves `waiting`, so
 *    rapid multi-taps can't double-process or double-count;
 *  - `correctCount` only ever increments on the transition into `correct`.
 */
import { create } from 'zustand';

import type { Challenge } from '@/content/types';
import type { WorldId } from '@/content/worlds';

export type GamePhase = 'loading' | 'instruction' | 'waiting' | 'correct' | 'incorrect' | 'complete';

export interface GameSessionState {
  worldId: WorldId | null;
  level: number;
  challenges: Challenge[];
  index: number;
  phase: GamePhase;

  /** Wrong taps on the current question. */
  attempts: number;
  /** Last object tapped incorrectly — the screen wiggles it. */
  lastWrongId: string | null;
  /** Assistance: gently highlight the correct object after enough wrong taps. */
  highlightTarget: boolean;
  /** Bumped to ask the screen to replay the instruction (auto-repeat). */
  repeatToken: number;

  correctCount: number;
  totalAttempts: number;

  start: (worldId: WorldId, level: number, challenges: Challenge[]) => void;
  instructionDone: () => void;
  tap: (objectId: string) => void;
  resolveCorrect: () => void;
  resolveIncorrect: () => void;
  reset: () => void;
}

const INITIAL = {
  worldId: null as WorldId | null,
  level: 1,
  challenges: [] as Challenge[],
  index: 0,
  phase: 'loading' as GamePhase,
  attempts: 0,
  lastWrongId: null as string | null,
  highlightTarget: false,
  repeatToken: 0,
  correctCount: 0,
  totalAttempts: 0,
};

/** Per-question reset (keeps session totals). */
const questionReset = { phase: 'instruction' as GamePhase, attempts: 0, lastWrongId: null, highlightTarget: false };

export const useGameSession = create<GameSessionState>((set, get) => ({
  ...INITIAL,

  start: (worldId, level, challenges) => {
    set({ ...INITIAL, worldId, level, challenges, index: 0, phase: challenges.length > 0 ? 'instruction' : 'complete' });
  },

  instructionDone: () => {
    if (get().phase === 'instruction') set({ phase: 'waiting' });
  },

  tap: (objectId) => {
    const state = get();
    if (state.phase !== 'waiting') return; // ignore taps during instruction/feedback
    const challenge = state.challenges[state.index];
    if (!challenge) return;

    if (challenge.targetObjectIds.includes(objectId)) {
      set({
        phase: 'correct',
        correctCount: state.correctCount + 1,
        totalAttempts: state.totalAttempts + 1,
      });
      return;
    }

    const attempts = state.attempts + 1;
    set({
      phase: 'incorrect',
      attempts,
      lastWrongId: objectId,
      totalAttempts: state.totalAttempts + 1,
      highlightTarget: state.highlightTarget || attempts >= challenge.assistance.highlightAfterAttempts,
    });
  },

  resolveCorrect: () => {
    const state = get();
    if (state.phase !== 'correct') return;
    if (state.index >= state.challenges.length - 1) {
      set({ phase: 'complete' });
    } else {
      set({ ...questionReset, index: state.index + 1 });
    }
  },

  resolveIncorrect: () => {
    const state = get();
    if (state.phase !== 'incorrect') return;
    const challenge = state.challenges[state.index];
    const repeat = challenge != null && state.attempts >= challenge.assistance.repeatAfterAttempts;
    set({ phase: 'waiting', repeatToken: repeat ? state.repeatToken + 1 : state.repeatToken });
  },

  reset: () => set({ ...INITIAL }),
}));

/** Current question, or null between sessions. */
export function currentChallenge(state: GameSessionState): Challenge | null {
  return state.challenges[state.index] ?? null;
}

/**
 * Star rating (1–3) for a finished level, from accuracy. 3 = flawless, 2 = a few
 * misses, 1 = completed with help. Always at least 1 for finishing.
 */
export function computeStars(correctCount: number, totalAttempts: number): number {
  const misses = totalAttempts - correctCount;
  if (misses <= 0) return 3;
  if (misses <= correctCount) return 2;
  return 1;
}
