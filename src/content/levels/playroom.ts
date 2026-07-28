/**
 * Placeholder Playroom levels — one five-challenge session (master plan §3.4).
 * Objects are labelled coloured shapes standing in for real artwork; the spoken
 * instruction keys (e.g. `playroom.l1.instruction`) resolve to silence until the
 * recordings land, so the game is fully playable now for logic + layout testing.
 *
 * Placement uses normalized 0..1 coordinates within the 16:9 scene. Targets sit
 * clear of the top-left instruction bubble; hitboxes are generous (wide objects).
 */
import { colors } from '@/theme';

import { DEFAULT_ASSISTANCE, type Level } from '../types';

export const PLAYROOM_LEVELS: Level[] = [
  {
    id: 'playroom.l1',
    worldId: 'playroom',
    difficulty: 1,
    instructionText: 'Find the red ball!',
    instructionAudioKey: 'playroom.l1.instruction',
    stars: 1,
    assistance: DEFAULT_ASSISTANCE,
    targetObjectIds: ['ball-red'],
    objects: [
      { id: 'ball-red', label: 'Red ball', category: 'toy', shape: 'circle', color: colors.coral, x: 0.34, y: 0.6, width: 0.16 },
      { id: 'block-blue', label: 'Blue block', category: 'toy', shape: 'square', color: colors.skyBlue, x: 0.62, y: 0.42, width: 0.15 },
      { id: 'block-green', label: 'Green block', category: 'toy', shape: 'square', color: colors.mintGreen, x: 0.82, y: 0.66, width: 0.15 },
    ],
  },
  {
    id: 'playroom.l2',
    worldId: 'playroom',
    difficulty: 1,
    instructionText: 'Find the yellow star!',
    instructionAudioKey: 'playroom.l2.instruction',
    stars: 1,
    assistance: DEFAULT_ASSISTANCE,
    targetObjectIds: ['star-yellow'],
    objects: [
      { id: 'star-yellow', label: 'Yellow star', category: 'shape', shape: 'triangle', color: colors.sunshineYellow, x: 0.7, y: 0.35, width: 0.16 },
      { id: 'ball-purple', label: 'Purple ball', category: 'toy', shape: 'circle', color: colors.playfulPurple, x: 0.4, y: 0.62, width: 0.16 },
      { id: 'block-sky', label: 'Blue block', category: 'toy', shape: 'square', color: colors.skyBlue, x: 0.84, y: 0.68, width: 0.14 },
      { id: 'ball-mint', label: 'Green ball', category: 'toy', shape: 'circle', color: colors.mintGreen, x: 0.56, y: 0.8, width: 0.14 },
    ],
  },
  {
    id: 'playroom.l3',
    worldId: 'playroom',
    difficulty: 2,
    instructionText: 'Find the green square!',
    instructionAudioKey: 'playroom.l3.instruction',
    stars: 1,
    assistance: DEFAULT_ASSISTANCE,
    targetObjectIds: ['square-green'],
    objects: [
      { id: 'square-green', label: 'Green square', category: 'shape', shape: 'square', color: colors.mintGreen, x: 0.5, y: 0.5, width: 0.15 },
      { id: 'circle-coral', label: 'Red circle', category: 'shape', shape: 'circle', color: colors.coral, x: 0.3, y: 0.72, width: 0.15 },
      { id: 'circle-sky', label: 'Blue circle', category: 'shape', shape: 'circle', color: colors.skyBlue, x: 0.72, y: 0.4, width: 0.15 },
      { id: 'triangle-purple', label: 'Purple triangle', category: 'shape', shape: 'triangle', color: colors.playfulPurple, x: 0.84, y: 0.72, width: 0.15 },
      { id: 'square-yellow', label: 'Yellow square', category: 'shape', shape: 'square', color: colors.sunshineYellow, x: 0.62, y: 0.82, width: 0.14 },
    ],
  },
  {
    id: 'playroom.l4',
    worldId: 'playroom',
    difficulty: 2,
    instructionText: 'Find the purple ball!',
    instructionAudioKey: 'playroom.l4.instruction',
    stars: 1,
    assistance: DEFAULT_ASSISTANCE,
    targetObjectIds: ['ball-purple-2'],
    objects: [
      { id: 'ball-purple-2', label: 'Purple ball', category: 'toy', shape: 'circle', color: colors.playfulPurple, x: 0.78, y: 0.58, width: 0.15 },
      { id: 'ball-coral-2', label: 'Red ball', category: 'toy', shape: 'circle', color: colors.coral, x: 0.36, y: 0.44, width: 0.15 },
      { id: 'ball-sky-2', label: 'Blue ball', category: 'toy', shape: 'circle', color: colors.skyBlue, x: 0.52, y: 0.7, width: 0.15 },
      { id: 'ball-yellow-2', label: 'Yellow ball', category: 'toy', shape: 'circle', color: colors.sunshineYellow, x: 0.3, y: 0.74, width: 0.14 },
      { id: 'ball-mint-2', label: 'Green ball', category: 'toy', shape: 'circle', color: colors.mintGreen, x: 0.64, y: 0.4, width: 0.14 },
    ],
  },
  {
    id: 'playroom.l5',
    worldId: 'playroom',
    difficulty: 3,
    instructionText: 'Find the blue triangle!',
    instructionAudioKey: 'playroom.l5.instruction',
    stars: 1,
    assistance: DEFAULT_ASSISTANCE,
    targetObjectIds: ['triangle-sky'],
    objects: [
      { id: 'triangle-sky', label: 'Blue triangle', category: 'shape', shape: 'triangle', color: colors.skyBlue, x: 0.58, y: 0.46, width: 0.15 },
      { id: 'triangle-coral', label: 'Red triangle', category: 'shape', shape: 'triangle', color: colors.coral, x: 0.32, y: 0.6, width: 0.15 },
      { id: 'triangle-mint', label: 'Green triangle', category: 'shape', shape: 'triangle', color: colors.mintGreen, x: 0.8, y: 0.44, width: 0.15 },
      { id: 'circle-yellow-3', label: 'Yellow circle', category: 'shape', shape: 'circle', color: colors.sunshineYellow, x: 0.7, y: 0.76, width: 0.14 },
      { id: 'square-purple-3', label: 'Purple square', category: 'shape', shape: 'square', color: colors.playfulPurple, x: 0.44, y: 0.8, width: 0.14 },
      { id: 'circle-sky-3', label: 'Blue circle', category: 'shape', shape: 'circle', color: colors.skyBlue, x: 0.9, y: 0.72, width: 0.13 },
    ],
  },
];
