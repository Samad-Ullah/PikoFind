/**
 * Game-session state machine (master plan §16), as a Zustand store.
 *
 *   loading → instruction → waiting → correct  ─┐
 *                                  ↘ incorrect ─┘→ (waiting, with assistance)
 *                          correct → next level → … → complete
 *
 * It holds NO audio or timers — the screen reacts to `phase` to play sounds and
 * schedule the feedback pauses, then calls `resolveCorrect` / `resolveIncorrect`
 * / `instructionDone`. Keeping it pure makes the guarantees testable:
 *  - a tap is only honoured in `waiting`, and immediately leaves `waiting`, so
 *    rapid multi-taps can't double-process or double-reward;
 *  - stars are added exactly once, on the transition into `correct`.
 */
import { create } from 'zustand';

import type { Level } from '@/content/types';
import type { WorldId } from '@/content/worlds';

export type GamePhase = 'loading' | 'instruction' | 'waiting' | 'correct' | 'incorrect' | 'complete';

export interface GameSessionState {
  worldId: WorldId | null;
  levels: Level[];
  index: number;
  phase: GamePhase;

  /** Wrong taps on the current level. */
  attempts: number;
  /** Last object tapped incorrectly — the screen wiggles it. */
  lastWrongId: string | null;
  /** Assistance: gently highlight the correct object after enough wrong taps. */
  highlightTarget: boolean;
  /** Bumped to ask the screen to replay the instruction (auto-repeat). */
  repeatToken: number;

  starsEarned: number;
  correctCount: number;
  totalAttempts: number;

  start: (worldId: WorldId, levels: Level[]) => void;
  instructionDone: () => void;
  tap: (objectId: string) => void;
  resolveCorrect: () => void;
  resolveIncorrect: () => void;
  reset: () => void;
}

const INITIAL = {
  worldId: null as WorldId | null,
  levels: [] as Level[],
  index: 0,
  phase: 'loading' as GamePhase,
  attempts: 0,
  lastWrongId: null as string | null,
  highlightTarget: false,
  repeatToken: 0,
  starsEarned: 0,
  correctCount: 0,
  totalAttempts: 0,
};

/** Per-level reset (keeps session totals). */
const levelReset = { phase: 'instruction' as GamePhase, attempts: 0, lastWrongId: null, highlightTarget: false };

export const useGameSession = create<GameSessionState>((set, get) => ({
  ...INITIAL,

  start: (worldId, levels) => {
    set({ ...INITIAL, worldId, levels, index: 0, phase: levels.length > 0 ? 'instruction' : 'complete' });
  },

  instructionDone: () => {
    if (get().phase === 'instruction') set({ phase: 'waiting' });
  },

  tap: (objectId) => {
    const state = get();
    if (state.phase !== 'waiting') return; // ignore taps during instruction/feedback
    const level = state.levels[state.index];
    if (!level) return;

    if (level.targetObjectIds.includes(objectId)) {
      set({
        phase: 'correct',
        starsEarned: state.starsEarned + level.stars,
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
      highlightTarget: state.highlightTarget || attempts >= level.assistance.highlightAfterAttempts,
    });
  },

  resolveCorrect: () => {
    const state = get();
    if (state.phase !== 'correct') return;
    if (state.index >= state.levels.length - 1) {
      set({ phase: 'complete' });
    } else {
      set({ ...levelReset, index: state.index + 1 });
    }
  },

  resolveIncorrect: () => {
    const state = get();
    if (state.phase !== 'incorrect') return;
    const level = state.levels[state.index];
    const repeat = level != null && state.attempts >= level.assistance.repeatAfterAttempts;
    set({ phase: 'waiting', repeatToken: repeat ? state.repeatToken + 1 : state.repeatToken });
  },

  reset: () => set({ ...INITIAL }),
}));

/** Current level, or null between sessions. */
export function currentLevel(state: GameSessionState): Level | null {
  return state.levels[state.index] ?? null;
}
