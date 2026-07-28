/**
 * Runtime settings store (Zustand). In-memory for now — the next slice backs it
 * with SQLite (expo-sqlite) so choices survive an app restart, and hydrates it on
 * launch. `soundOn` is the master audio switch; music/voice/effects are the
 * finer parent-area controls.
 */
import { create } from 'zustand';

export interface SettingsState {
  soundOn: boolean;
  musicOn: boolean;
  voiceOn: boolean;
  effectsOn: boolean;
  toggleSound: () => void;
  setMusic: (value: boolean) => void;
  setVoice: (value: boolean) => void;
  setEffects: (value: boolean) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  soundOn: true,
  musicOn: true,
  voiceOn: true,
  effectsOn: true,
  toggleSound: () => set((state) => ({ soundOn: !state.soundOn })),
  setMusic: (value) => set({ musicOn: value }),
  setVoice: (value) => set({ voiceOn: value }),
  setEffects: (value) => set({ effectsOn: value }),
}));
