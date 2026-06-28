import type { MeritCategory } from '../types';

export interface TitleInfo {
  name: string;
  lore: string;
  minMerits: number;
  maxMerits: number;
  rankIndex: number;
}

export const TITLES: TitleInfo[] = [
  {
    name: 'Forasteiro',
    lore: 'Um aventureiro desconhecido começando sua jornada.',
    minMerits: 0,
    maxMerits: 19,
    rankIndex: 0,
  },
  {
    name: 'Aventureiro Experiente',
    lore: 'Já enfrentou perigos que muitos evitariam.',
    minMerits: 20,
    maxMerits: 49,
    rankIndex: 1,
  },
  {
    name: 'Herói de Skyrim',
    lore: 'Seu nome começa a ser reconhecido pelas terras.',
    minMerits: 50,
    maxMerits: 99,
    rankIndex: 2,
  },
  {
    name: 'Campeão do Norte',
    lore: 'Grandes feitos acompanham sua história.',
    minMerits: 100,
    maxMerits: 199,
    rankIndex: 3,
  },
  {
    name: 'Lenda Viva',
    lore: 'As histórias sobre você já fazem parte da história de Skyrim.',
    minMerits: 200,
    maxMerits: Infinity,
    rankIndex: 4,
  },
];

export const getTitleInfo = (totalHistoricalMerits: number): TitleInfo => {
  // We clamp totalHistoricalMerits to 0 just in case there are negative net scores
  const score = Math.max(0, totalHistoricalMerits);
  const title = TITLES.find(t => score >= t.minMerits && score <= t.maxMerits);
  return title || TITLES[0];
};

export interface PerkProgressInfo {
  currentMerits: number;
  perksRedeemed: number;
  progressToNext: number; // 0 to 9
  nextPerkCost: number;   // 10
  canRedeem: boolean;     // currentMerits >= 10
  percentToNext: number;  // 0 to 100
}

export const getPerkInfo = (totalHistoricalMerits: number, perksRedeemed: number): PerkProgressInfo => {
  const currentMerits = Math.max(0, totalHistoricalMerits - perksRedeemed * 10);
  const nextPerkCost = 10;
  const progressToNext = currentMerits % 10;
  const canRedeem = currentMerits >= nextPerkCost;
  const percentToNext = (progressToNext / nextPerkCost) * 100;

  return {
    currentMerits,
    perksRedeemed,
    progressToNext,
    nextPerkCost,
    canRedeem,
    percentToNext,
  };
};

export interface CategoryMeta {
  key: MeritCategory;
  label: string;
  emoji: string;
  colorClass: string;
  iconBgColor: string;
}

export const CATEGORIES: Record<MeritCategory, CategoryMeta> = {
  combate: {
    key: 'combate',
    label: 'Combate',
    emoji: '⚔️',
    colorClass: 'text-red-800',
    iconBgColor: 'bg-red-100',
  },
  exploracao: {
    key: 'exploracao',
    label: 'Exploração',
    emoji: '🗺️',
    colorClass: 'text-blue-800',
    iconBgColor: 'bg-blue-100',
  },
  missoes: {
    key: 'missoes',
    label: 'Missões',
    emoji: '📜',
    colorClass: 'text-amber-800',
    iconBgColor: 'bg-amber-100',
  },
  conhecimento: {
    key: 'conhecimento',
    label: 'Conhecimento',
    emoji: '📚',
    colorClass: 'text-purple-800',
    iconBgColor: 'bg-purple-100',
  },
  influencia: {
    key: 'influencia',
    label: 'Influência',
    emoji: '🤝',
    colorClass: 'text-green-800',
    iconBgColor: 'bg-green-100',
  },
};
