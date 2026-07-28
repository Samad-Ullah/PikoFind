/**
 * Public audio API. Import the singleton and the key types from here:
 *
 *   import { audio } from '@/features/audio';
 *   await audio.playVoice('playroom.intro');
 *   audio.playMusic('playroom');
 *   audio.playSfx('correct');
 */
export { audio } from './AudioManager';
export type { MusicKey, SfxKey, VoiceKey } from './sources';
