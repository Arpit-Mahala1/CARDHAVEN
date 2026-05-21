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
  targetType?: 'cell' | 'row' | 'column' | 'none' | 'all';
  effect: CardEffect;
  upgrades?: string[];
  /** If true, card is removed from deck after playing (exhaust) */
  exhaust?: boolean;
  applyToSelf?: boolean;
  /** Lore flavor text */
  lore?: string;
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
  ignoreBlock?: boolean;
  blockFromMissingHealthPercent?: number;
  /** Damage to self (risk/reward cards) */
  selfDamage?: number;
  /** Energy gain */
  energyGain?: number;
  /** Percentage of current health as damage */
  healthPercentDamage?: number;
}

export interface StatusEffectApplication {
  type: StatusEffectType;
  stacks: number;
}

export type StatusEffectType =
  | 'poison'
  | 'vulnerable'
  | 'weak'
  | 'frail'
  | 'strength'
  | 'dexterity'
  | 'bleed'
  | 'stun'
  | 'regen'
  | 'thorns'
  | 'ritual'       // Gain strength each turn
  | 'doom';        // Take increasing damage each turn

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
  isBoss?: boolean;
  /** For enemies that summon minions */
  summonId?: string;
}

export interface EnemyTemplate {
  id: string;
  name: string;
  baseHealth: number;
  actions: EnemyAction[];
  scalingFactor: number;
  movementPattern?: 'straight' | 'weaver' | 'healer' | 'lurker' | 'charger';
  isBoss?: boolean;
  /** Flavor text shown in battle */
  lore?: string;
}

export interface EnemyAction {
  id: string;
  name: string;
  damage?: number;
  block?: number;
  statusEffects?: StatusEffectApplication[];
  priority?: number;
  /** Heal amount (for healer-type enemies) */
  heal?: number;
  /** Summon an enemy by template ID */
  summon?: string;
}

export interface Intent {
  type: 'attack' | 'defend' | 'buff' | 'debuff' | 'heal' | 'summon';
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
  /** Icon emoji for display */
  icon?: string;
}

/**
 * EVENT SYSTEM
 */
export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  icon: string;
}

export interface EventChoice {
  text: string;
  effect: EventEffect;
  requirement?: string;
}

export interface EventEffect {
  health?: number;
  maxHealth?: number;
  shards?: number;
  addCard?: string;
  removeRandomCard?: boolean;
  addRelic?: string;
  addStatusEffect?: StatusEffectApplication;
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

  phase: 'battle' | 'reward' | 'shop' | 'gameover' | 'victory' | 'event' | 'rest';
  score: number;
  shopState?: ShopState;
  
  /** Current event for event rooms */
  currentEvent?: GameEvent;
  
  /** Whether this is a daily run */
  isDailyRun?: boolean;
  
  /** Boss defeated flags */
  bossesDefeated?: string[];
  
  /** Total enemies killed this run */
  enemiesKilled: number;
  
  /** Damage dealt this run */
  totalDamageDealt: number;

  /** Active daily modifiers */
  modifiers?: DailyModifier[];
}

export interface DailyModifier {
  id: string;
  name: string;
  description: string;
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
  isDailyRun?: boolean;
}

export interface LeaderboardEntry {
  runId: string;
  playerName: string;
  score: number;
  floor: number;
  characterClass: string;
  timestamp: number;
  playerId: string;
  isDailyRun?: boolean;
  seasonId?: string;
}

/**
 * UI STATE
 */
export type Screen = 'menu' | 'game' | 'leaderboard' | 'profile' | 'settings' | 'daily';

/**
 * SETTINGS
 */
export interface GameSettings {
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  reducedMotion: boolean;
  showDamageNumbers: boolean;
  autoEndTurn: boolean;
}

/**
 * TUTORIAL
 */
export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  highlightSelector?: string;
  position: 'center' | 'top' | 'bottom' | 'left' | 'right';
}

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
  enemiesKilled: number;
  cardsPlayed: number;
  dailyRunsCompleted: number;
}

/**
 * DAILY RUN
 */
export interface DailyRunInfo {
  seed: string;
  date: string;
  characterClass: 'warrior' | 'mage' | 'rogue';
  modifiers: DailyModifier[];
}

export interface DailyModifier {
  id: string;
  name: string;
  description: string;
  icon: string;
}
