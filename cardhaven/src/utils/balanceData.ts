export const GAME_CONSTANTS = {
  STARTING_HEALTH: 60,
  STARTING_ENERGY: 3,
  STARTING_HAND_SIZE: 5,
  STARTING_SHARDS: 0,

  HEALTH_PER_FLOOR: 2,
  MAX_FLOORS: 30,
  BOSS_FLOOR: 25,

  ENEMY_HEALTH_SCALE: 1.12,
  ENEMY_DAMAGE_SCALE: 1.08,

  CARDS_TO_PICK: 1,
  CARDS_PER_REWARD: 3,
  STARTING_DECK_SIZE: 10,
  MAX_DECK_SIZE: 60,
  MAX_HAND_SIZE: 10,

  POINTS_PER_FLOOR: 150,
  POINTS_PER_VICTORY: 500,
  POINTS_PER_HEALTH_REMAINING: 2,
  POINTS_PER_TURN_EFFICIENCY: 5,
} as const;

export const STATUS_EFFECTS = {
  poison: {
    icon: '☠',
    description: 'Take {stacks} damage at end of each turn',
    damagePerStack: 1,
  },
  vulnerable: {
    icon: '💢',
    description: 'Take 50% more damage',
    multiplier: 1.5,
  },
  strength: {
    icon: '💪',
    description: 'Attacks deal {stacks} more damage',
    damagePerStack: 2,
  },
  weak: {
    icon: '😵',
    description: 'Attacks deal 25% less damage',
    damageMultiplier: 0.75,
  },
  frail: {
    icon: '🩹',
    description: 'Gain 25% less block',
    blockMultiplier: 0.75,
  },
  dexterity: {
    icon: '🌀',
    description: 'Gain {stacks} more block',
    blockPerStack: 1,
  },
} as const;

export const RARITY_COLORS = {
  common: '#a0a0a0',
  uncommon: '#6b9d7a',
  rare: '#5b8dd9',
  legendary: '#d4af37',
} as const;

export const CARD_TYPE_COLORS = {
  attack: '#c73e1d',
  defense: '#5b8dd9',
  draw: '#9b59b6',
  utility: '#6b9d7a',
  power: '#d4af37',
} as const;
