/**
 * Local SQLite database (expo-sqlite). Stores only small structured data — never
 * personal information (master plan §18/§24). This slice creates the `settings`
 * key/value table; the fuller schema (progress, stickers, entitlements) plus a
 * migration system arrive in Phase 6.
 */
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'pikofind.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/** Opens (once) and initialises the database. */
export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME).then(async (db) => {
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY NOT NULL,
          value TEXT NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);
      return db;
    });
  }
  return dbPromise;
}
