/**
 * CARD SYSTEM
 */
export interface Card {
  id: string;
  name: string;
  description: string;
  cost: number;
  cardType: 'attack' | 'defense' | 'draw' | 'utility' | 'power';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  targetType?: 'cell' | 'row' | 'column' | 'none';
  effect: CardEffect;
  upgrades?: string[];
}

export interface CardEffect {
  damage?: number;
  block?: number;
  draw?: number;
  heal?: number;
  statusEffects?: StatusEffectApplication[];
  applyToSelf?: boolean;
  hits?: number;
  knockback?: number;
  area?: '2x2' | 'cross' | 'row' | 'column';
}

export interface StatusEffectApplication {
  type: StatusEffectType;
  stacks: number;
}

export type StatusEffectType = 'poison' | 'vulnerable' | 'weak' | 'frail' | 'strength' | 'dexterity';

export interface StatusEffect {
  type: StatusEffectType;
  stacks: number;
  turnsRemaining: number;
}

/**
 * ENEMY SYSTEM
 */
export interface Enemy {
  id: string;
  templateId: string;
  name: string;
  boardX: number;
  boardY: number;
  maxHealth: number;
  health: number;
  block: number;
  intents: Intent[];
  actions: EnemyAction[];
  statusEffects: StatusEffect[];
  currentActionIndex: number;
}

export interface EnemyTemplate {
  id: string;
  name: string;
  baseHealth: number;
  actions: EnemyAction[];
  scalingFactor: number;
  movementPattern?: 'straight' | 'weaver' | 'healer';
}

export interface EnemyAction {
  id: string;
  name: string;
  damage?: number;
  block?: number;
  statusEffects?: StatusEffectApplication[];
  priority?: number;
}

export interface Intent {
  type: 'attack' | 'defend' | 'buff' | 'debuff' | 'heal';
  amount: number;
  icon?: string;
}

/**
 * RELICS
 */
export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  passive: boolean;
  activationCondition?: string;
}

/**
 * GAME STATE
 */
export interface GameState {
  playerId: string;
  runId: string;
  characterClass: 'warrior' | 'mage' | 'rogue';

  hand: Card[];
  deck: Card[];
  discard: Card[];
  exhausted: Card[];

  health: number;
  maxHealth: number;
  block: number;
  energy: number;
  maxEnergy: number;
  floor: number;
  shards: number;

  statusEffects: StatusEffect[];
  relics: Relic[];

  enemies: Enemy[];
  isPlayerTurn: boolean;
  turnsPlayed: number;

  roomsCleared: number;
  cardsAdded: string[];
  seed: string;
  startTime: number;

  phase: 'battle' | 'reward' | 'shop' | 'gameover' | 'victory';
  score: number;
  shopState?: ShopState;
}

export interface ShopState {
  cards: Card[];
  relics: Relic[];
  removalCost: number;
}

export interface GameRun {
  runId: string;
  playerId: string;
  playerName: string;
  characterClass: 'warrior' | 'mage' | 'rogue';
  finalFloor: number;
  finalScore: number;
  finalHealth: number;
  won: boolean;
  timestamp: number;
  duration: number;
  seed: string;
  decklist: string[];
  relicsFound: string[];
}

export interface LeaderboardEntry {
  runId: string;
  playerName: string;
  score: number;
  floor: number;
  characterClass: string;
  timestamp: number;
  playerId: string;
}

/**
 * UI STATE
 */
export type Screen = 'menu' | 'game' | 'leaderboard' | 'profile';

/**
 * USER PROFILE
 */
export interface UserProfile {
  uid: string;
  email?: string;
  displayName?: string;
  createdAt: number;
  totalRuns: number;
  totalWins: number;
  bestScore: number;
  playTime: number;
}
