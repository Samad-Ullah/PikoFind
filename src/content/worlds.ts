/**
 * World summaries for the app shell (selection + intro screens). This is the
 * lightweight list the shell needs; the full authored level content arrives in
 * Phase 7 (validated with Zod). Ground colours stand in for the final WebP scene
 * backgrounds.
 */
import { colors } from '@/theme';

export type WorldId = 'playroom' | 'garden' | 'classroom';

export interface WorldSummary {
  id: WorldId;
  title: string;
  blurb: string;
  /** Free (first world) vs premium (behind the parent gate + purchase). */
  premium: boolean;
  /** Placeholder scene ground colour. */
  ground: string;
  accent: string;
}

export const WORLDS: WorldSummary[] = [
  {
    id: 'playroom',
    title: "Piko's Playroom",
    blurb: 'Colours, shapes and favourite toys.',
    premium: false,
    ground: '#E8F8FC',
    accent: colors.skyBlue,
  },
  {
    id: 'garden',
    title: "Piko's Garden",
    blurb: 'Animals, plants and sunny surprises.',
    premium: true,
    ground: '#DFF6EA',
    accent: colors.mintGreen,
  },
  {
    id: 'classroom',
    title: "Piko's Classroom",
    blurb: 'School things and clever finding games.',
    premium: true,
    ground: '#EFE9FA',
    accent: colors.playfulPurple,
  },
];

export function getWorld(id: string | undefined): WorldSummary | undefined {
  return WORLDS.find((w) => w.id === id);
}
