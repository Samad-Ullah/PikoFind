/**
 * Level plan per world — an ordered list of named levels that unlock in turn
 * (Duolingo-style). Each level has a KIND (what it teaches) and an option count;
 * its 10 questions come from the generator. Names describe what the level is
 * about so the map reads clearly.
 */
import { makeLevelChallenges, type QuestionKind } from '../generate';
import type { Challenge } from '../types';
import type { WorldId } from '../worlds';

interface LevelPlan {
  name: string;
  kind: QuestionKind;
  options: number;
}

/** Shared progression for every world (from very basic to trickier). */
const PLAN: LevelPlan[] = [
  { name: 'First Colours', kind: 'color', options: 3 },
  { name: 'Colour Hunt', kind: 'color', options: 4 },
  { name: 'Rainbow Colours', kind: 'color', options: 5 },
  { name: 'Simple Shapes', kind: 'shape', options: 3 },
  { name: 'Shape Hunt', kind: 'shape', options: 4 },
  { name: 'Shape Explorer', kind: 'shape', options: 4 },
  { name: 'Colours & Shapes', kind: 'colorShape', options: 4 },
  { name: 'Mix It Up', kind: 'colorShape', options: 4 },
  { name: 'Tricky Finder', kind: 'colorShape', options: 5 },
  { name: 'Piko Challenge', kind: 'colorShape', options: 5 },
];

export interface LevelInfo {
  level: number;
  name: string;
}

/** How many levels a world has. */
export function getLevelCount(_worldId: WorldId): number {
  return PLAN.length;
}

/** Display name for a level (1-based). */
export function getLevelName(_worldId: WorldId, level: number): string {
  return PLAN[level - 1]?.name ?? `Level ${level}`;
}

/** All levels' display info, in order. */
export function getLevelInfos(_worldId: WorldId): LevelInfo[] {
  return PLAN.map((p, i) => ({ level: i + 1, name: p.name }));
}

/** The 10 challenges for a given level (1-based). */
export function getChallenges(worldId: WorldId, level: number): Challenge[] {
  const plan = PLAN[level - 1];
  if (!plan) return [];
  return makeLevelChallenges(worldId, level, plan.kind, plan.options);
}
