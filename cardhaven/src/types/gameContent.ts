// src/types/gameContent.ts
export type CardEffect = {
  /** Effect type, e.g., 'draw', 'damage', 'buff', 'debuff' */
  type: string;
  /** Numeric value associated with the effect */
  amount?: number;
  /** Optional target selector, e.g., 'enemy', 'self', 'all' */
  target?: string;
  /** Optional custom script name for complex behavior */
  script?: string;
};

export interface Card {
  id: string;
  name: string;
  description: string;
  cost: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  /** List of effects applied when the card is played */
  effects: CardEffect[];
  /** Path to card art image */
  image?: string;
}

export type EnemyAbility = {
  name: string;
  description: string;
  /** Simple stat change or script */
  type: 'damage' | 'heal' | 'buff' | 'debuff' | 'script';
  amount?: number;
  script?: string;
};

export interface Enemy {
  id: string;
  name: string;
  health: number;
  attack: number;
  defense: number;
  abilities: EnemyAbility[];
  /** Path to enemy art image */
  image?: string;
}
