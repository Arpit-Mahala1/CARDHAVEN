export const GAME_CONSTANTS = {
  STARTING_HEALTH: 60,
  STARTING_ENERGY: 3,
  STARTING_HAND_SIZE: 5,
  STARTING_SHARDS: 50,

  HEALTH_PER_FLOOR: 2,
  MAX_FLOORS: 30,
  BOSS_FLOOR: 10,

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
  POINTS_PER_BOSS_KILL: 1000,
  POINTS_PER_ENEMY_KILL: 25,

  REST_HEAL_AMOUNT: 15,
  REST_HEAL_PERCENT: 0.25,
} as const;

export const STATUS_EFFECTS = {
  poison: {
    icon: '☠',
    name: 'Poison',
    description: 'Take {stacks} damage at end of each turn',
    damagePerStack: 1,
    color: '#4a7a4d',
  },
  vulnerable: {
    icon: '💢',
    name: 'Vulnerable',
    description: 'Take 50% more damage',
    multiplier: 1.5,
    color: '#c73e1d',
  },
  strength: {
    icon: '💪',
    name: 'Strength',
    description: 'Attacks deal {stacks}×2 more damage',
    damagePerStack: 2,
    color: '#d4a017',
  },
  weak: {
    icon: '😵',
    name: 'Weak',
    description: 'Attacks deal 25% less damage',
    damageMultiplier: 0.75,
    color: '#7a6a4a',
  },
  frail: {
    icon: '🩹',
    name: 'Frail',
    description: 'Gain 25% less block',
    blockMultiplier: 0.75,
    color: '#8a7a6a',
  },
  dexterity: {
    icon: '🌀',
    name: 'Dexterity',
    description: 'Gain {stacks} more block',
    blockPerStack: 1,
    color: '#4a8ac7',
  },
  bleed: {
    icon: '🩸',
    name: 'Bleed',
    description: 'Take {stacks} damage when attacking. Stacks decrease by 1.',
    damagePerStack: 1,
    color: '#8a1a1a',
  },
  stun: {
    icon: '⚡',
    name: 'Stun',
    description: 'Skip next action. Removed after triggering.',
    color: '#e6c847',
  },
  regen: {
    icon: '💚',
    name: 'Regeneration',
    description: 'Heal {stacks} HP at start of turn. Decreases by 1.',
    color: '#3d8a45',
  },
  thorns: {
    icon: '🌹',
    name: 'Thorns',
    description: 'Deal {stacks} damage to attackers.',
    color: '#6a3d3d',
  },
  ritual: {
    icon: '🕯️',
    name: 'Ritual',
    description: 'Gain {stacks} Strength at the start of each turn.',
    color: '#7a3d8a',
  },
  doom: {
    icon: '💀',
    name: 'Doom',
    description: 'Take {stacks} damage at end of turn. Increases by 1 each turn.',
    color: '#2a1a2a',
  },
} as const;

export const RARITY_COLORS = {
  common: '#a09880',
  uncommon: '#3d5a45',
  rare: '#1b2d3c',
  legendary: '#c5a059',
} as const;

export const CARD_TYPE_COLORS = {
  attack: '#4a0e0e',
  defense: '#1b2d3c',
  draw: '#2d1b3c',
  utility: '#3d5a45',
  power: '#c5a059',
} as const;

export const EVENTS = [
  {
    id: 'mysterious_shrine',
    title: 'Mysterious Shrine',
    description: 'A crumbling altar pulses with dark energy. Ancient runes glow along its surface, offering power at a price.',
    icon: '⛩️',
    choices: [
      { text: 'Pray at the shrine (+3 Max HP, +15 Shards)', effect: { maxHealth: 3, shards: 15 } },
      { text: 'Smash the shrine (+30 Shards, -5 HP)', effect: { shards: 30, health: -5 } },
      { text: 'Walk away', effect: {} }
    ]
  },
  {
    id: 'wandering_merchant',
    title: 'Wandering Merchant',
    description: 'A cloaked figure emerges from the shadows, offering a deal too good to be true.',
    icon: '🧙',
    choices: [
      { text: 'Trade HP for power (-8 HP, gain random rare card)', effect: { health: -8, addCard: 'random_rare' } },
      { text: 'Pay for healing (-20 Shards, +12 HP)', effect: { shards: -20, health: 12 } },
      { text: 'Refuse the offer', effect: {} }
    ]
  },
  {
    id: 'cursed_painting',
    title: 'The Cursed Painting',
    description: 'A portrait on the wall moves. Its eyes follow you. Its mouth begins to open...',
    icon: '🖼️',
    choices: [
      { text: 'Reach into the painting (+5 Max HP, gain Doom 1)', effect: { maxHealth: 5, addStatusEffect: { type: 'doom', stacks: 1 } } },
      { text: 'Slash the canvas (Remove a random card from deck)', effect: { removeRandomCard: true } },
      { text: 'Avert your gaze', effect: {} }
    ]
  },
  {
    id: 'fountain_of_blood',
    title: 'Fountain of Blood',
    description: 'A fountain gurgles with crimson liquid. The scent is metallic, intoxicating.',
    icon: '⛲',
    choices: [
      { text: 'Drink deeply (Heal to full HP, gain 2 Weak)', effect: { health: 999, addStatusEffect: { type: 'weak', stacks: 2 } } },
      { text: 'Wash your weapons (+2 Strength for next battle)', effect: { addStatusEffect: { type: 'strength', stacks: 2 } } },
      { text: 'Leave the fountain', effect: {} }
    ]
  },
  {
    id: 'ancient_library',
    title: 'The Forgotten Library',
    description: 'Shelves of rotting tomes stretch endlessly. Knowledge lingers in the dust.',
    icon: '📚',
    choices: [
      { text: 'Study the forbidden texts (Draw +1 card per turn permanently)', effect: { maxHealth: -3 } },
      { text: 'Burn the books (+25 Shards)', effect: { shards: 25 } },
      { text: 'Browse casually', effect: { shards: 10 } }
    ]
  }
] as const;
