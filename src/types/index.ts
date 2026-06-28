export interface Character {
  id: string;
  name: string;
  race?: string;     // Race (e.g. Nord, Breton, etc.)
  class?: string;    // Custom archetype/class description
  createdAt: number;
  perksRedeemed: number; // Counter for manually redeemed perk points
}

export type MeritCategory = 'combate' | 'exploracao' | 'missoes' | 'conhecimento' | 'influencia';

export interface AchievementLog {
  id: string;
  characterId: string;
  description: string;
  category: MeritCategory;
  merits: number; // positive for achievements, negative for penalties/choices
  timestamp: number;
}
