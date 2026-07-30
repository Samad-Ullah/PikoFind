/**
 * Level-progress repository (Duolingo-style): which levels are completed and the
 * best star rating for each, per world. Stored locally in SQLite — small
 * structured data only, never anything personal.
 */
import { getDb } from './database';

export interface LevelResult {
  level: number;
  stars: number;
  completed: boolean;
}

/** All recorded results for a world, keyed by level number. */
export async function getWorldProgress(world: string): Promise<Record<number, LevelResult>> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ level: number; stars: number; completed: number }>(
    'SELECT level, stars, completed FROM level_progress WHERE world = ?',
    world,
  );
  const out: Record<number, LevelResult> = {};
  for (const r of rows) {
    out[r.level] = { level: r.level, stars: r.stars, completed: r.completed === 1 };
  }
  return out;
}

/** Record a completed level, keeping the best star rating seen. */
export async function saveLevelResult(world: string, level: number, stars: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO level_progress (world, level, stars, completed, updated_at)
     VALUES (?, ?, ?, 1, ?)
     ON CONFLICT(world, level) DO UPDATE SET
       stars = MAX(stars, excluded.stars),
       completed = 1,
       updated_at = excluded.updated_at`,
    world,
    level,
    stars,
    Date.now(),
  );
}
