/**
 * Runtime settings store (Zustand), persisted to SQLite. `hydrate()` loads saved
 * values on launch; every setter writes through to the `settings` table so
 * choices survive an app restart. `soundOn` is the master audio switch;
 * music/voice/effects are the finer parent-area controls.
 */
import { create } from 'zustand';

import { getBoolSetting, setBoolSetting } from '@/db/settings';

type BoolKey = 'soundOn' | 'musicOn' | 'voiceOn' | 'effectsOn';

export interface SettingsState {
  soundOn: boolean;
  musicOn: boolean;
  voiceOn: boolean;
  effectsOn: boolean;
  /** True once values have been loaded from the database. */
  hydrated: boolean;
  toggleSound: () => void;
  setMusic: (value: boolean) => void;
  setVoice: (value: boolean) => void;
  setEffects: (value: boolean) => void;
  hydrate: () => Promise<void>;
}

/** Fire-and-forget persist; store updates stay synchronous for the UI. */
function persist(key: BoolKey, value: boolean) {
  void setBoolSetting(key, value);
}

export const useSettings = create<SettingsState>((set, get) => ({
  soundOn: true,
  musicOn: true,
  voiceOn: true,
  effectsOn: true,
  hydrated: false,

  toggleSound: () => {
    const next = !get().soundOn;
    set({ soundOn: next });
    persist('soundOn', next);
  },
  setMusic: (value) => {
    set({ musicOn: value });
    persist('musicOn', value);
  },
  setVoice: (value) => {
    set({ voiceOn: value });
    persist('voiceOn', value);
  },
  setEffects: (value) => {
    set({ effectsOn: value });
    persist('effectsOn', value);
  },

  hydrate: async () => {
    const keys: BoolKey[] = ['soundOn', 'musicOn', 'voiceOn', 'effectsOn'];
    const entries = await Promise.all(keys.map(async (k) => [k, await getBoolSetting(k)] as const));
    const patch: Partial<Record<BoolKey, boolean>> = {};
    for (const [k, v] of entries) {
      if (v !== null) patch[k] = v;
    }
    set({ ...patch, hydrated: true });
  },
}));
