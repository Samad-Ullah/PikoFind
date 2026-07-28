/**
 * Settings key/value repository over the `settings` table. Values are stored as
 * TEXT; helpers convert to/from booleans. Used to persist parent-area toggles and
 * the first-launch flag so they survive an app restart.
 */
import { getDb } from './database';

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?', key);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    value,
    Date.now(),
  );
}

export async function getBoolSetting(key: string): Promise<boolean | null> {
  const raw = await getSetting(key);
  return raw === null ? null : raw === '1';
}

export function setBoolSetting(key: string, value: boolean): Promise<void> {
  return setSetting(key, value ? '1' : '0');
}
