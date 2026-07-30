/**
 * Level-progress store (Zustand) backed by SQLite. Holds the per-world results
 * so the level map and results screen stay in sync, and writes through on every
 * completed level. Unlock rule: level 1 is always open; level N opens once level
 * N-1 is completed.
 */
import { create } from 'zustand';

import { getWorldProgress, saveLevelResult, type LevelResult } from '@/db/progress';
import type { WorldId } from '@/content/worlds';

interface ProgressState {
  byWorld: Partial<Record<WorldId, Record<number, LevelResult>>>;
  hydrateWorld: (world: WorldId) => Promise<void>;
  recordResult: (world: WorldId, level: number, stars: number) => Promise<void>;
}

export const useProgress = create<ProgressState>((set, get) => ({
  byWorld: {},

  hydrateWorld: async (world) => {
    const results = await getWorldProgress(world);
    set((s) => ({ byWorld: { ...s.byWorld, [world]: results } }));
  },

  recordResult: async (world, level, stars) => {
    await saveLevelResult(world, level, stars);
    const current = get().byWorld[world] ?? {};
    const prevStars = current[level]?.stars ?? 0;
    const next: Record<number, LevelResult> = {
      ...current,
      [level]: { level, stars: Math.max(prevStars, stars), completed: true },
    };
    set((s) => ({ byWorld: { ...s.byWorld, [world]: next } }));
  },
}));

/** A level is unlocked if it's the first or the previous level is completed. */
export function isLevelUnlocked(results: Record<number, LevelResult> | undefined, level: number): boolean {
  if (level <= 1) return true;
  return results?.[level - 1]?.completed === true;
}
