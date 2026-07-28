/**
 * Level lookup by world. Only the free Playroom has authored (placeholder)
 * levels so far; the premium worlds return an empty session until Phase 7.
 */
import type { WorldId } from '../worlds';
import type { Level } from '../types';

import { PLAYROOM_LEVELS } from './playroom';

const LEVELS_BY_WORLD: Record<WorldId, Level[]> = {
  playroom: PLAYROOM_LEVELS,
  garden: [],
  classroom: [],
};

/** The five-challenge session for a world (empty if content isn't authored yet). */
export function getLevels(worldId: WorldId): Level[] {
  return LEVELS_BY_WORLD[worldId] ?? [];
}
