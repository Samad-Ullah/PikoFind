/**
 * Deterministic question generator. Each level has a KIND that sets what it
 * teaches:
 *   'color'      → "Find the red one!"   (same shape, different colours)
 *   'shape'      → "Find the star!"       (same colour, different shapes)
 *   'colorShape' → "Find the red star!"   (colour + shape together)
 *
 * The per-level kind + option count come from the level plan (see
 * content/levels), so difficulty ramps from the very basics. Deterministic
 * (seeded, no `Math.random`) so a level looks the same each replay.
 *
 * Audio keys are REUSABLE (`find.color.red`, `find.shape.star`,
 * `find.red.star`) — the whole game needs only ~35 short clips, so real recorded
 * voice can drop into the registry later with no code change; until then Piko
 * speaks via device TTS.
 */
import { colors } from '@/theme';

import { QUESTIONS_PER_LEVEL, DEFAULT_ASSISTANCE, type Challenge, type PlaceholderShape, type SceneObject } from './types';
import type { WorldId } from './worlds';

export type QuestionKind = 'color' | 'shape' | 'colorShape';

const PALETTE: { color: string; name: string }[] = [
  { color: colors.coral, name: 'red' },
  { color: colors.skyBlue, name: 'blue' },
  { color: colors.mintGreen, name: 'green' },
  { color: colors.sunshineYellow, name: 'yellow' },
  { color: colors.playfulPurple, name: 'purple' },
];

const SHAPES: { shape: PlaceholderShape; name: string }[] = [
  { shape: 'circle', name: 'circle' },
  { shape: 'square', name: 'square' },
  { shape: 'triangle', name: 'triangle' },
  { shape: 'star', name: 'star' },
];

function lcg(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function shuffled<T>(arr: T[], seed: number): T[] {
  const rand = lcg(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function widthFor(count: number): number {
  if (count <= 3) return 0.19;
  if (count === 4) return 0.17;
  return 0.15;
}

interface Combo {
  ci: number;
  si: number;
}

/** Pick `count` distinct indices from `size`, starting at `start`. */
function pickIndices(size: number, start: number, count: number): number[] {
  const out: number[] = [];
  for (let step = 0; out.length < count && step < size * 2; step++) {
    const v = (start + step) % size;
    if (!out.includes(v)) out.push(v);
  }
  return out;
}

function buildChallenge(worldId: WorldId, level: number, q: number, kind: QuestionKind, count: number): Challenge {
  const seed = level * 1000 + q * 7 + 13;

  let combos: Combo[];
  let target: Combo;
  let instructionText: string;
  let audioKey: string;

  if (kind === 'color') {
    const fixedShape = 0; // circle — the most basic shape
    const cis = pickIndices(PALETTE.length, level + q, count);
    combos = cis.map((ci) => ({ ci, si: fixedShape }));
    target = combos[q % combos.length];
    instructionText = `Find the ${PALETTE[target.ci].name} one!`;
    audioKey = `find.color.${PALETTE[target.ci].name}`;
  } else if (kind === 'shape') {
    const fixedColor = (level + q) % PALETTE.length; // one colour for the whole question
    const sis = pickIndices(SHAPES.length, level + q, Math.min(count, SHAPES.length));
    combos = sis.map((si) => ({ ci: fixedColor, si }));
    target = combos[q % combos.length];
    instructionText = `Find the ${SHAPES[target.si].name}!`;
    audioKey = `find.shape.${SHAPES[target.si].name}`;
  } else {
    const tColor = (level * 3 + q * 2) % PALETTE.length;
    const tShape = (level + q) % SHAPES.length;
    target = { ci: tColor, si: tShape };
    const seen = new Set<string>([`${tColor}-${tShape}`]);
    combos = [target];
    for (let step = 1; combos.length < count && step < 40; step++) {
      const cand: Combo = { ci: (tColor + step) % PALETTE.length, si: (tShape + Math.ceil(step / 2)) % SHAPES.length };
      const key = `${cand.ci}-${cand.si}`;
      if (!seen.has(key)) {
        seen.add(key);
        combos.push(cand);
      }
    }
    instructionText = `Find the ${PALETTE[tColor].name} ${SHAPES[tShape].name}!`;
    audioKey = `find.${PALETTE[tColor].name}.${SHAPES[tShape].name}`;
  }

  const ordered = shuffled(combos, seed);
  const width = widthFor(ordered.length);
  const first = 0.5 * width + 0.05;
  const last = 1 - first;
  const stepX = ordered.length > 1 ? (last - first) / (ordered.length - 1) : 0;

  let targetId = '';
  const objects: SceneObject[] = ordered.map((c, k) => {
    const p = PALETTE[c.ci];
    const s = SHAPES[c.si];
    const id = `l${level}-q${q}-o${k}`;
    if (c.ci === target.ci && c.si === target.si && targetId === '') targetId = id;
    return {
      id,
      label: `${p.name} ${s.name}`,
      category: 'shape',
      shape: s.shape,
      color: p.color,
      x: ordered.length > 1 ? first + k * stepX : 0.5,
      y: k % 2 === 0 ? 0.5 : 0.56,
      width,
    };
  });

  return {
    id: `${worldId}.l${level}.q${q}`,
    worldId,
    instructionText,
    instructionAudioKey: audioKey,
    objects,
    targetObjectIds: [targetId || objects[0].id],
    assistance: DEFAULT_ASSISTANCE,
  };
}

/** The 10 questions for one level of a world. */
export function makeLevelChallenges(worldId: WorldId, level: number, kind: QuestionKind, options: number): Challenge[] {
  return Array.from({ length: QUESTIONS_PER_LEVEL }, (_, q) => buildChallenge(worldId, level, q, kind, options));
}
