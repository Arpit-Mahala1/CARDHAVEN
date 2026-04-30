# CARDHAVEN: AI AGENT IMPLEMENTATION GUIDE
## Optimized for Claude Code Execution

**Project:** Browser-Based Roguelike Deck Builder
**Technology Stack:** React 18 + TypeScript + Firebase + Phaser 3 + Tailwind CSS
**Timeline:** 13 weeks (MVP)
**Status:** Ready for automated implementation

---

## CRITICAL INSTRUCTIONS FOR AI EXECUTION

### Your Primary Role
You are implementing Cardhaven, a turn-based roguelike deck builder. You will:
1. Create all React components with full functionality
2. Implement game logic (battle engine, card mechanics, enemy AI)
3. Set up Firebase integration (auth, database, real-time leaderboards)
4. Apply Mystical-Minimalism aesthetic (defined in STYLE_GUIDE.md)
5. Test every feature before marking complete
6. Follow TypeScript best practices (strict mode)

### Code Quality Standards
- **All TypeScript** (no JavaScript files in src/)
- **No unused imports** (clean code)
- **Error handling** on all async operations
- **Type safety** (avoid `any` type)
- **Responsive design** (mobile-first Tailwind CSS)
- **Performance** (no unnecessary re-renders, use React.memo)
- **Comments** only for complex logic (code is self-documenting)
- **Git commits** after each sprint (meaningful messages)

### When Uncertain
- Consult STYLE_GUIDE.md for aesthetic decisions
- Use CARD_BALANCE.md for all game numbers
- Refer to ARCHITECTURE.md for system design
- Ask clarifying questions about feature requirements
- Default to simplicity over complexity

---

## PHASE 0: PROJECT SETUP (AUTOMATED)

### Step 1: Initialize Repository
```bash
# Create project from template
npm create vite@latest cardhaven -- --template react-ts
cd cardhaven

# Install core dependencies (with exact versions for reproducibility)
npm install \
  react@18.2.0 \
  react-dom@18.2.0 \
  typescript@5.3.2 \
  firebase@10.6.0 \
  phaser@3.55.2 \
  tailwindcss@3.3.6 \
  autoprefixer@10.4.16 \
  postcss@8.4.31 \
  zod@3.22.4 \
  zustand@4.4.4

# Dev dependencies
npm install -D \
  @types/react@18.2.37 \
  @types/react-dom@18.2.15 \
  @types/node@20.8.10 \
  vite@5.0.2 \
  @vitejs/plugin-react@4.1.1 \
  tailwindcss@3.3.6 \
  postcss@8.4.31 \
  autoprefixer@10.4.16

# Remove Create React App artifacts if present
rm -rf src/App.css src/index.css src/App.test.tsx
```

### Step 2: Configure Vite
**File: `vite.config.ts`**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: false,
  },
})
```

### Step 3: Setup Tailwind CSS
**File: `tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'card-dark': '#1a1f3a',
        'card-accent': '#2d1f4a',
        'gold': '#d4af37',
        'forest': '#6b9d7a',
        'danger': '#c73e1d',
        'text-primary': '#f5f1e8',
        'text-secondary': '#a0a0a0',
      },
      fontFamily: {
        'serif': ['Crimson Text', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'card-hover': 'card-hover 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'card-hover': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-8px)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
```

**File: `postcss.config.js`**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Step 4: Create Directory Structure
```bash
mkdir -p src/{components,pages,hooks,utils,types,data,styles,assets/{cards,enemies,icons,audio},services}
touch src/firebase.ts src/types/index.ts
```

### Step 5: Create .gitignore
```bash
cat > .gitignore << 'EOF'
node_modules/
dist/
.env.local
.env.*.local
.DS_Store
*.log
*.pem
build/
.cache/
.vite/
EOF
```

### Step 6: Initialize Git
```bash
git init
git add .
git commit -m "chore: initial project setup with Vite + React + Firebase + Tailwind"
git remote add origin https://github.com/yourusername/cardhaven
git push -u origin main
```

---

## PHASE 1: CORE DATA STRUCTURES (SPRINT 1)

### Task 1.1: Define All TypeScript Types
**File: `src/types/index.ts`**

```typescript
/**
 * CARD SYSTEM
 */
export interface Card {
  id: string;
  name: string;
  description: string;
  cost: number; // Energy cost to play
  cardType: 'attack' | 'defense' | 'draw' | 'utility' | 'power';
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  effect: CardEffect;
  upgrades?: string[]; // Cards this can be upgraded to
}

export interface CardEffect {
  damage?: number;
  block?: number;
  draw?: number;
  heal?: number;
  statusEffects?: StatusEffectApplication[];
  applyToSelf?: boolean;
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
  templateId: string; // Reference to enemy template
  name: string;
  maxHealth: number;
  health: number;
  intents: Intent[]; // What the enemy will do next turn
  actions: EnemyAction[]; // Available actions
  statusEffects: StatusEffect[];
}

export interface EnemyTemplate {
  id: string;
  name: string;
  baseHealth: number;
  actions: EnemyAction[];
  scalingFactor: number; // Health multiplier per floor
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
 * RELICS (PASSIVE ITEMS)
 */
export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  passive: boolean;
  activationCondition?: string; // e.g., "start_of_turn", "on_attack"
}

/**
 * GAME STATE
 */
export interface GameState {
  playerId: string;
  runId: string;
  characterClass: 'warrior' | 'mage' | 'rogue';
  
  // Deck
  deckSize: number;
  hand: Card[];
  deck: Card[];
  discard: Card[];
  exhausted: Card[];
  
  // Player stats
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  floor: number;
  
  // Status
  statusEffects: StatusEffect[];
  relics: Relic[];
  
  // Combat
  enemies: Enemy[];
  isPlayerTurn: boolean;
  turnsPlayed: number;
  
  // Run tracking
  roomsCleared: number;
  cardsAdded: string[]; // Track added cards for balance
  seed: string; // For reproducible runs
  startTime: number;
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
  duration: number; // milliseconds
  seed: string;
  decklist: string[]; // Card IDs
  relicsFound: string[]; // Relic IDs
}

export interface LeaderboardEntry {
  runId: string;
  playerName: string;
  score: number;
  floor: number;
  characterClass: string;
  timestamp: number;
  playerId: string; // For profile linking
}

/**
 * UI STATE
 */
export interface UIState {
  screen: 'menu' | 'game' | 'leaderboard' | 'profile' | 'reward';
  loading: boolean;
  error?: string;
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
  playTime: number; // milliseconds
  cosmetics: {
    cardSleeve?: string;
    avatar?: string;
    emotes?: string[];
  };
}

/**
 * FIREBASE COLLECTIONS
 */
export interface FirebaseGameRun extends GameRun {
  createdAt: any; // Firebase Timestamp
}

export interface FirebaseLeaderboardEntry extends LeaderboardEntry {
  createdAt: any; // Firebase Timestamp
}
```

### Task 1.2: Define Game Constants & Balance Numbers
**File: `src/utils/balanceData.ts`**

```typescript
/**
 * CARDHAVEN BALANCE DATA
 * Single source of truth for all game numbers
 * Update CARD_BALANCE.md whenever these change
 */

export const GAME_CONSTANTS = {
  // Starting stats
  STARTING_HEALTH: 50,
  STARTING_ENERGY: 3,
  STARTING_HAND_SIZE: 5,
  
  // Progression
  HEALTH_PER_FLOOR: 2,
  ENERGY_PER_FLOOR: 0.1,
  MAX_FLOORS: 30,
  BOSS_FLOOR: 25,
  
  // Difficulty scaling
  ENEMY_HEALTH_SCALE: 1.15, // 15% more health per floor
  ENEMY_DAMAGE_SCALE: 1.1,  // 10% more damage per floor
  
  // Card rewards
  CARDS_TO_PICK: 1,
  CARDS_PER_REWARD: 3,
  STARTING_DECK_SIZE: 10,
  MAX_DECK_SIZE: 60,
  
  // Relic rewards
  RELICS_PER_REWARD: 1,
  RELICS_TO_PICK: 3,
  
  // Scoring
  POINTS_PER_FLOOR: 100,
  POINTS_PER_VICTORY: 50,
  POINTS_PER_HEALTH_REMAINING: 1,
};

export const CARD_BALANCE = {
  // Attack cards (red)
  strike: { cost: 1, damage: 6 },
  heavy_blade: { cost: 2, damage: 12 },
  pummel: { cost: 1, damage: 4, effect: 'exhaust' },
  
  // Defense cards (blue)
  defend: { cost: 1, block: 5 },
  shield: { cost: 2, block: 12 },
  brace: { cost: 1, block: 4, effect: 'gain_frail' },
  
  // Draw cards (purple)
  draw: { cost: 1, draw: 2 },
  study: { cost: 2, draw: 3 },
  
  // Utility cards (green)
  heal: { cost: 1, heal: 5 },
  poison_gas: { cost: 2, damage: 0, statusEffect: 'poison:2' },
  
  // Power cards (gold)
  strength: { cost: 1, effect: 'gain_strength' },
  vulnerability: { cost: 2, effect: 'apply_vulnerable:2' },
};

export const ENEMY_BALANCE = {
  goblin: {
    baseHealth: 10,
    actions: [
      { id: 'slash', damage: 3 },
      { id: 'slash', damage: 3 },
      { id: 'rest', block: 2 },
    ],
  },
  skeleton: {
    baseHealth: 15,
    actions: [
      { id: 'bone_attack', damage: 4 },
      { id: 'bone_attack', damage: 4 },
    ],
  },
  // ... more enemies
};

export const RELIC_BALANCE = {
  energy_ring: { description: 'Start each turn with 1 extra energy' },
  molten_egg: { description: 'Attacks deal 1 additional damage' },
  acorn: { description: 'Gain 1 max health' },
  // ... more relics
};

export const STATUS_EFFECTS = {
  poison: {
    icon: '☠️',
    description: 'Take damage at end of turn',
    damagePerStack: 1,
  },
  vulnerable: {
    icon: '⚠️',
    description: 'Take 50% more damage',
    multiplier: 1.5,
  },
  strength: {
    icon: '💪',
    description: 'Attacks deal more damage',
    damagePerStack: 2,
  },
  weak: {
    icon: '😵',
    description: 'Attacks deal less damage',
    damageMultiplier: 0.75,
  },
};
```

### Task 1.3: Create Card & Enemy Data Files
**File: `src/data/cards.json`**

```json
{
  "cards": [
    {
      "id": "strike",
      "name": "Strike",
      "description": "Deal 6 damage",
      "cost": 1,
      "cardType": "attack",
      "rarity": "common",
      "effect": {
        "damage": 6
      }
    },
    {
      "id": "defend",
      "name": "Defend",
      "description": "Gain 5 block",
      "cost": 1,
      "cardType": "defense",
      "rarity": "common",
      "effect": {
        "block": 5
      }
    },
    {
      "id": "bash",
      "name": "Bash",
      "description": "Deal 8 damage. Apply 1 Vulnerable.",
      "cost": 2,
      "cardType": "attack",
      "rarity": "common",
      "effect": {
        "damage": 8,
        "statusEffects": [
          {
            "type": "vulnerable",
            "stacks": 1
          }
        ]
      }
    },
    {
      "id": "brace",
      "name": "Brace",
      "description": "Gain 8 block. Apply 1 Frail to yourself.",
      "cost": 1,
      "cardType": "defense",
      "rarity": "common",
      "effect": {
        "block": 8,
        "statusEffects": [
          {
            "type": "frail",
            "stacks": 1
          }
        ],
        "applyToSelf": true
      }
    },
    {
      "id": "pummel",
      "name": "Pummel",
      "description": "Deal 1 damage 4 times.",
      "cost": 1,
      "cardType": "attack",
      "rarity": "common",
      "effect": {
        "damage": 4
      }
    },
    {
      "id": "study",
      "name": "Study",
      "description": "Draw 2 cards.",
      "cost": 1,
      "cardType": "draw",
      "rarity": "uncommon",
      "effect": {
        "draw": 2
      }
    },
    {
      "id": "poison_gas",
      "name": "Poison Gas",
      "description": "Apply 3 Poison to an enemy.",
      "cost": 2,
      "cardType": "utility",
      "rarity": "uncommon",
      "effect": {
        "statusEffects": [
          {
            "type": "poison",
            "stacks": 3
          }
        ]
      }
    },
    {
      "id": "power_up",
      "name": "Power Up",
      "description": "Gain 2 Strength.",
      "cost": 1,
      "cardType": "power",
      "rarity": "uncommon",
      "effect": {
        "statusEffects": [
          {
            "type": "strength",
            "stacks": 2
          }
        ],
        "applyToSelf": true
      }
    },
    {
      "id": "heavy_blade",
      "name": "Heavy Blade",
      "description": "Deal 16 damage.",
      "cost": 3,
      "cardType": "attack",
      "rarity": "uncommon",
      "effect": {
        "damage": 16
      }
    },
    {
      "id": "shield",
      "name": "Shield",
      "description": "Gain 12 block.",
      "cost": 2,
      "cardType": "defense",
      "rarity": "uncommon",
      "effect": {
        "block": 12
      }
    },
    {
      "id": "whirlwind",
      "name": "Whirlwind",
      "description": "Deal 5 damage to all enemies.",
      "cost": 3,
      "cardType": "attack",
      "rarity": "rare",
      "effect": {
        "damage": 5
      }
    },
    {
      "id": "alchemy",
      "name": "Alchemy",
      "description": "Draw 3 cards. Gain 1 Weak.",
      "cost": 2,
      "cardType": "draw",
      "rarity": "rare",
      "effect": {
        "draw": 3,
        "statusEffects": [
          {
            "type": "weak",
            "stacks": 1
          }
        ],
        "applyToSelf": true
      }
    }
  ]
}
```

**File: `src/data/enemies.json`**

```json
{
  "enemies": [
    {
      "id": "goblin",
      "name": "Goblin",
      "baseHealth": 10,
      "actions": [
        {
          "id": "slash",
          "name": "Slash",
          "damage": 3
        },
        {
          "id": "rest",
          "name": "Rest",
          "block": 2
        }
      ],
      "scalingFactor": 1
    },
    {
      "id": "skeleton",
      "name": "Skeleton",
      "baseHealth": 15,
      "actions": [
        {
          "id": "bone_attack",
          "name": "Bone Strike",
          "damage": 4
        },
        {
          "id": "bone_attack",
          "name": "Bone Strike",
          "damage": 4
        }
      ],
      "scalingFactor": 1
    },
    {
      "id": "witch",
      "name": "Witch",
      "baseHealth": 12,
      "actions": [
        {
          "id": "curse",
          "name": "Curse",
          "statusEffects": [
            {
              "type": "poison",
              "stacks": 2
            }
          ]
        },
        {
          "id": "spell",
          "name": "Spell",
          "damage": 6
        }
      ],
      "scalingFactor": 1.1
    },
    {
      "id": "knight",
      "name": "Knight",
      "baseHealth": 20,
      "actions": [
        {
          "id": "heavy_blow",
          "name": "Heavy Blow",
          "damage": 5
        },
        {
          "id": "shield_up",
          "name": "Shield Up",
          "block": 8
        }
      ],
      "scalingFactor": 1.15
    },
    {
      "id": "demon",
      "name": "Demon",
      "baseHealth": 25,
      "actions": [
        {
          "id": "infernal_strike",
          "name": "Infernal Strike",
          "damage": 8
        },
        {
          "id": "curse_all",
          "name": "Curse All",
          "statusEffects": [
            {
              "type": "vulnerable",
              "stacks": 1
            }
          ]
        }
      ],
      "scalingFactor": 1.2
    }
  ]
}
```

**File: `src/data/relics.json`**

```json
{
  "relics": [
    {
      "id": "energy_ring",
      "name": "Energy Ring",
      "description": "Start each turn with 1 extra energy",
      "rarity": "common",
      "passive": true
    },
    {
      "id": "molten_egg",
      "name": "Molten Egg",
      "description": "Attacks deal 1 additional damage",
      "rarity": "common",
      "passive": true
    },
    {
      "id": "acorn",
      "name": "Acorn",
      "description": "Gain 10 max health",
      "rarity": "common",
      "passive": true
    },
    {
      "id": "potion_bottle",
      "name": "Potion Bottle",
      "description": "Heal 10 health at the start of combat",
      "rarity": "common",
      "passive": true,
      "activationCondition": "start_of_combat"
    },
    {
      "id": "ancient_tome",
      "name": "Ancient Tome",
      "description": "Cards that draw cost 1 less",
      "rarity": "uncommon",
      "passive": true
    },
    {
      "id": "sword_of_strength",
      "name": "Sword of Strength",
      "description": "Attacks deal 2 additional damage",
      "rarity": "uncommon",
      "passive": true
    },
    {
      "id": "mirrored_shield",
      "name": "Mirrored Shield",
      "description": "When you block 20+ in a turn, deal 10 damage to all enemies",
      "rarity": "uncommon",
      "passive": true,
      "activationCondition": "high_block"
    },
    {
      "id": "philosophers_stone",
      "name": "Philosopher's Stone",
      "description": "Each turn, gain 1 Strength",
      "rarity": "rare",
      "passive": true,
      "activationCondition": "start_of_turn"
    }
  ]
}
```

### Task 1.4: Setup Firebase Configuration
**File: `src/firebase.ts`**

```typescript
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

/**
 * Firebase Configuration
 * These values are safe to be public (restricted by Firestore rules)
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
};

if (!firebaseConfig.projectId) {
  console.warn('Firebase config not loaded. Check .env.local file.');
}

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Get Firebase services
export const auth: Auth = getAuth(app);
export const firestore: Firestore = getFirestore(app);
export const realtimeDb: Database = getDatabase(app);

export default app;
```

**File: `.env.example`** (Copy and rename to `.env.local`)

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

---

## PHASE 2: GAME ENGINE & BATTLE LOGIC (SPRINT 2-3)

### Task 2.1: Battle Engine (Core Game Logic)
**File: `src/utils/battleEngine.ts`**

```typescript
import { GameState, Card, Enemy, StatusEffect, CardEffect } from '../types';
import { GAME_CONSTANTS } from './balanceData';

export class BattleEngine {
  private gameState: GameState;

  constructor(initialState: GameState) {
    this.gameState = { ...initialState };
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return this.gameState;
  }

  /**
   * Play a card from hand
   * Returns true if successful, false if invalid
   */
  playCard(cardIndex: number, targetEnemyId?: string): boolean {
    if (!this.gameState.isPlayerTurn) return false;
    
    const card = this.gameState.hand[cardIndex];
    if (!card) return false;
    
    // Check energy
    if (this.gameState.energy < card.cost) return false;
    
    // Deduct energy
    this.gameState.energy -= card.cost;
    
    // Remove card from hand
    this.gameState.hand.splice(cardIndex, 1);
    
    // Apply card effect
    const targetEnemy = this.gameState.enemies.find(e => e.id === targetEnemyId);
    this.applyCardEffect(card, targetEnemy);
    
    // Move card to discard
    this.gameState.discard.push(card);
    
    return true;
  }

  /**
   * Apply a card's effect
   */
  private applyCardEffect(card: Card, target?: Enemy): void {
    const effect = card.effect;
    
    // Damage
    if (effect.damage && target) {
      let damage = effect.damage;
      
      // Apply strength
      const strength = this.getStatusEffect('strength');
      if (strength) {
        damage += strength.stacks * 2;
      }
      
      // Apply vulnerability on target
      const targetVulnerable = target.statusEffects.find(s => s.type === 'vulnerable');
      if (targetVulnerable) {
        damage = Math.floor(damage * 1.5);
      }
      
      target.health -= damage;
      if (target.health < 0) target.health = 0;
    }
    
    // Block
    if (effect.block) {
      // Block is stored temporarily and consumed at end of turn
      // (Could implement as a "block" property on gameState)
    }
    
    // Draw
    if (effect.draw) {
      this.drawCards(effect.draw);
    }
    
    // Heal
    if (effect.heal) {
      this.gameState.health = Math.min(
        this.gameState.health + effect.heal,
        this.gameState.maxHealth
      );
    }
    
    // Status effects
    if (effect.statusEffects) {
      const applyTarget = effect.applyToSelf ? this.gameState : target;
      if (applyTarget) {
        effect.statusEffects.forEach(se => {
          this.addStatusEffect(applyTarget, se.type, se.stacks);
        });
      }
    }
  }

  /**
   * End player turn and execute enemy actions
   */
  endPlayerTurn(): void {
    this.gameState.isPlayerTurn = false;
    this.gameState.turnsPlayed++;
    
    // Clear hand (in a real game, might send to discard)
    this.gameState.hand = [];
    
    // Apply poison from previous turn
    this.applyPoisonDamage();
    
    // Execute enemy turns
    this.gameState.enemies.forEach(enemy => {
      this.executeEnemyTurn(enemy);
    });
    
    // Check if player is dead
    if (this.gameState.health <= 0) {
      // Game over
      return;
    }
    
    // Start new turn
    this.startNewTurn();
  }

  /**
   * Execute a single enemy's turn
   */
  private executeEnemyTurn(enemy: Enemy): void {
    // Select action (simplified: alternates between first 2 actions)
    const actionIndex = this.gameState.turnsPlayed % enemy.actions.length;
    const action = enemy.actions[actionIndex];
    
    if (action.damage) {
      this.gameState.health -= action.damage;
      if (this.gameState.health < 0) this.gameState.health = 0;
    }
    
    if (action.statusEffects) {
      action.statusEffects.forEach(se => {
        this.addStatusEffect(this.gameState, se.type, se.stacks);
      });
    }
  }

  /**
   * Start a new player turn
   */
  private startNewTurn(): void {
    this.gameState.isPlayerTurn = true;
    this.gameState.energy = this.gameState.maxEnergy;
    
    // Decay status effects
    this.gameState.statusEffects.forEach(se => {
      se.turnsRemaining--;
    });
    this.gameState.statusEffects = this.gameState.statusEffects.filter(
      se => se.turnsRemaining > 0 && se.stacks > 0
    );
    
    // Draw cards
    this.drawCards(5);
  }

  /**
   * Draw cards from deck to hand
   */
  private drawCards(count: number): void {
    for (let i = 0; i < count; i++) {
      if (this.gameState.hand.length >= 10) break;
      
      if (this.gameState.deck.length === 0) {
        // Reshuffle discard into deck
        if (this.gameState.discard.length === 0) break;
        this.gameState.deck = [...this.gameState.discard];
        this.gameState.discard = [];
        // Shuffle
        this.shuffleArray(this.gameState.deck);
      }
      
      const card = this.gameState.deck.pop();
      if (card) this.gameState.hand.push(card);
    }
  }

  /**
   * Apply poison damage at start of turn
   */
  private applyPoisonDamage(): void {
    const poison = this.gameState.statusEffects.find(se => se.type === 'poison');
    if (poison && poison.stacks > 0) {
      this.gameState.health -= poison.stacks;
      if (this.gameState.health < 0) this.gameState.health = 0;
    }
  }

  /**
   * Add or modify a status effect
   */
  private addStatusEffect(target: GameState | Enemy, type: string, stacks: number): void {
    const existing = target.statusEffects.find(se => se.type === type);
    if (existing) {
      existing.stacks += stacks;
    } else {
      target.statusEffects.push({
        type: type as any,
        stacks,
        turnsRemaining: 5, // Default duration
      });
    }
  }

  /**
   * Get a status effect by type
   */
  private getStatusEffect(type: string): StatusEffect | undefined {
    return this.gameState.statusEffects.find(se => se.type === type);
  }

  /**
   * Fisher-Yates shuffle
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Check battle end conditions
   */
  checkBattleEnd(): 'won' | 'lost' | 'ongoing' {
    if (this.gameState.health <= 0) return 'lost';
    if (this.gameState.enemies.every(e => e.health <= 0)) return 'won';
    return 'ongoing';
  }
}
```

### Task 2.2: Enemy Generator
**File: `src/utils/enemyGenerator.ts`**

```typescript
import { Enemy, EnemyTemplate } from '../types';
import enemyData from '../data/enemies.json';
import { GAME_CONSTANTS } from './balanceData';

export function generateEnemyEncounter(floor: number): Enemy[] {
  const difficulty = Math.floor(floor / 3);
  const enemyCount = Math.min(difficulty + 1, 3);
  const enemies: Enemy[] = [];

  const templates = (enemyData as { enemies: EnemyTemplate[] }).enemies;

  for (let i = 0; i < enemyCount; i++) {
    const template = selectRandomEnemy(templates);
    const enemy = createEnemyInstance(template, floor);
    enemies.push(enemy);
  }

  return enemies;
}

function createEnemyInstance(template: EnemyTemplate, floor: number): Enemy {
  const scaling = 1 + (floor - 1) * 0.1; // 10% harder each floor
  const health = Math.round(template.baseHealth * scaling);

  return {
    id: `enemy-${Date.now()}-${Math.random()}`,
    templateId: template.id,
    name: template.name,
    maxHealth: health,
    health,
    intents: generateIntents(template),
    actions: template.actions,
    statusEffects: [],
  };
}

function selectRandomEnemy(templates: EnemyTemplate[]): EnemyTemplate {
  return templates[Math.floor(Math.random() * templates.length)];
}

function generateIntents(template: EnemyTemplate): any[] {
  // Show what enemy will do next turn
  const action1 = template.actions[0];
  const action2 = template.actions[Math.min(1, template.actions.length - 1)];

  const intents = [];
  if (action1.damage) {
    intents.push({ type: 'attack', amount: action1.damage, icon: '⚔️' });
  }
  if (action2.damage && action2 !== action1) {
    intents.push({ type: 'attack', amount: action2.damage, icon: '⚔️' });
  }

  return intents;
}
```

---

## PHASE 3: REACT COMPONENTS & UI (SPRINT 4-5)

### Task 3.1: Main Game State Hook
**File: `src/hooks/useGameState.ts`**

```typescript
import { useState, useCallback } from 'react';
import { GameState, Card, Enemy } from '../types';
import { BattleEngine } from '../utils/battleEngine';
import { generateEnemyEncounter } from '../utils/enemyGenerator';
import cardsData from '../data/cards.json';
import { GAME_CONSTANTS } from '../utils/balanceData';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [battleEngine, setBattleEngine] = useState<BattleEngine | null>(null);

  /**
   * Initialize a new game run
   */
  const startNewRun = useCallback((playerId: string, characterClass: 'warrior' | 'mage' | 'rogue') => {
    const runId = `run-${Date.now()}`;
    
    // Get starting deck based on class
    const starterCards = getStarterDeck(characterClass);
    
    const newGameState: GameState = {
      playerId,
      runId,
      characterClass,
      deckSize: starterCards.length,
      hand: [],
      deck: [...starterCards],
      discard: [],
      exhausted: [],
      health: GAME_CONSTANTS.STARTING_HEALTH,
      maxHealth: GAME_CONSTANTS.STARTING_HEALTH,
      energy: GAME_CONSTANTS.STARTING_ENERGY,
      maxEnergy: GAME_CONSTANTS.STARTING_ENERGY,
      floor: 1,
      statusEffects: [],
      relics: [],
      enemies: generateEnemyEncounter(1),
      isPlayerTurn: true,
      turnsPlayed: 0,
      roomsCleared: 0,
      cardsAdded: [],
      seed: Math.random().toString(36),
      startTime: Date.now(),
    };

    setGameState(newGameState);
    setBattleEngine(new BattleEngine(newGameState));
  }, []);

  /**
   * Play a card
   */
  const playCard = useCallback((cardIndex: number, targetEnemyId?: string) => {
    if (!gameState || !battleEngine) return false;

    const success = battleEngine.playCard(cardIndex, targetEnemyId);
    if (success) {
      setGameState({ ...battleEngine.getState() });
    }
    return success;
  }, [gameState, battleEngine]);

  /**
   * End player turn
   */
  const endTurn = useCallback(() => {
    if (!gameState || !battleEngine) return;

    battleEngine.endPlayerTurn();
    const updatedState = battleEngine.getState();

    const battleStatus = battleEngine.checkBattleEnd();
    if (battleStatus === 'won') {
      // Battle won - show reward screen
    } else if (battleStatus === 'lost') {
      // Game over
    }

    setGameState(updatedState);
  }, [gameState, battleEngine]);

  return {
    gameState,
    startNewRun,
    playCard,
    endTurn,
  };
}

function getStarterDeck(characterClass: string): Card[] {
  const cards = (cardsData as { cards: Card[] }).cards;
  
  // Simplified: return 10 common cards for all classes (can customize per class later)
  return cards.filter(c => c.rarity === 'common').slice(0, 10);
}
```

### Task 3.2: Battle Screen Component
**File: `src/components/BattleScreen.tsx`**

```typescript
import React, { useState } from 'react';
import { GameState } from '../types';
import Card from './Card';
import Enemy from './Enemy';
import './BattleScreen.css';

interface BattleScreenProps {
  gameState: GameState;
  onPlayCard: (cardIndex: number, targetEnemyId?: string) => boolean;
  onEndTurn: () => void;
}

export default function BattleScreen({
  gameState,
  onPlayCard,
  onEndTurn,
}: BattleScreenProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const handleCardClick = (index: number) => {
    if (selectedCard === index) {
      setSelectedCard(null);
    } else {
      setSelectedCard(index);
    }
  };

  const handleEnemyClick = (enemyId: string) => {
    if (selectedCard === null) return;

    const success = onPlayCard(selectedCard, enemyId);
    if (success) {
      setSelectedCard(null);
      setSelectedTarget(null);
    }
  };

  const handlePlayCard = () => {
    if (selectedCard === null) return;

    const success = onPlayCard(selectedCard);
    if (success) {
      setSelectedCard(null);
    }
  };

  const canPlayCard = selectedCard !== null && gameState.energy >= gameState.hand[selectedCard]?.cost;

  return (
    <div className="battle-screen">
      {/* Enemy Section */}
      <div className="enemies-section">
        {gameState.enemies.map((enemy) => (
          <Enemy
            key={enemy.id}
            enemy={enemy}
            selected={selectedTarget === enemy.id}
            onClick={() => handleEnemyClick(enemy.id)}
          />
        ))}
      </div>

      {/* Player Stats */}
      <div className="player-stats">
        <div className="stat-group">
          <div className="stat">
            <span className="label">HP</span>
            <span className="value">{gameState.health}/{gameState.maxHealth}</span>
          </div>
          <div className="stat-bar">
            <div
              className="stat-fill"
              style={{
                width: `${(gameState.health / gameState.maxHealth) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="stat-group">
          <span className="label">Energy: {gameState.energy}/{gameState.maxEnergy}</span>
        </div>

        <div className="stat-group">
          <span className="label">Floor: {gameState.floor}</span>
        </div>
      </div>

      {/* Status Effects */}
      {gameState.statusEffects.length > 0 && (
        <div className="status-effects">
          {gameState.statusEffects.map((effect, i) => (
            <div key={i} className={`status ${effect.type}`}>
              <span>{effect.stacks}</span>
            </div>
          ))}
        </div>
      )}

      {/* Hand */}
      <div className="hand">
        {gameState.hand.map((card, i) => (
          <Card
            key={i}
            card={card}
            index={i}
            selected={selectedCard === i}
            onPlay={handlePlayCard}
            onClick={() => handleCardClick(i)}
            playable={gameState.energy >= card.cost}
          />
        ))}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button
          className="btn-primary"
          onClick={onEndTurn}
          disabled={!gameState.isPlayerTurn}
        >
          End Turn
        </button>
      </div>
    </div>
  );
}
```

### Task 3.3: Card Component
**File: `src/components/Card.tsx`**

```typescript
import React from 'react';
import { Card as CardType } from '../types';
import './Card.css';

interface CardProps {
  card: CardType;
  index: number;
  selected: boolean;
  onPlay: () => void;
  onClick: () => void;
  playable: boolean;
}

export default function Card({
  card,
  index,
  selected,
  onClick,
  playable,
}: CardProps) {
  const rarityColor = {
    common: 'text-gray-400',
    uncommon: 'text-green-500',
    rare: 'text-blue-500',
    legendary: 'text-gold',
  };

  return (
    <div
      className={`card ${selected ? 'selected' : ''} ${!playable ? 'disabled' : ''}`}
      onClick={onClick}
    >
      <div className="card-header">
        <h3 className="card-name">{card.name}</h3>
        <span className={`card-cost ${playable ? '' : 'disabled'}`}>
          {card.cost}
        </span>
      </div>

      <div className="card-art">
        <div className="card-icon">{getCardIcon(card.cardType)}</div>
      </div>

      <p className="card-description">{card.description}</p>

      <div className={`card-rarity ${rarityColor[card.rarity]}`}>
        {card.rarity}
      </div>
    </div>
  );
}

function getCardIcon(cardType: string): string {
  const icons: Record<string, string> = {
    attack: '⚔️',
    defense: '🛡️',
    draw: '📚',
    utility: '✨',
    power: '💫',
  };
  return icons[cardType] || '•';
}
```

### Task 3.4: Enemy Component
**File: `src/components/Enemy.tsx`**

```typescript
import React from 'react';
import { Enemy as EnemyType } from '../types';
import './Enemy.css';

interface EnemyProps {
  enemy: EnemyType;
  selected: boolean;
  onClick: () => void;
}

export default function Enemy({ enemy, selected, onClick }: EnemyProps) {
  const healthPercent = (enemy.health / enemy.maxHealth) * 100;

  return (
    <div
      className={`enemy-card ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="enemy-portrait">
        <div className="enemy-silhouette">{getEnemyIcon(enemy.templateId)}</div>
      </div>

      <div className="enemy-info">
        <h3 className="enemy-name">{enemy.name}</h3>

        <div className="health-bar">
          <div className="health-fill" style={{ width: `${healthPercent}%` }} />
        </div>
        <p className="health-text">
          {enemy.health} / {enemy.maxHealth}
        </p>

        {enemy.statusEffects.length > 0 && (
          <div className="status-effects">
            {enemy.statusEffects.map((effect, i) => (
              <span key={i} className={`status status-${effect.type}`}>
                {effect.stacks}
              </span>
            ))}
          </div>
        )}
      </div>

      {enemy.intents.length > 0 && (
        <div className="enemy-intents">
          {enemy.intents.map((intent, i) => (
            <div key={i} className={`intent intent-${intent.type}`}>
              <span className="intent-icon">{intent.icon}</span>
              <span className="intent-amount">{intent.amount}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getEnemyIcon(templateId: string): string {
  const icons: Record<string, string> = {
    goblin: '👹',
    skeleton: '💀',
    witch: '🧙',
    knight: '⚔️',
    demon: '😈',
  };
  return icons[templateId] || '?';
}
```

### Task 3.5: Leaderboard Component & Hook
**File: `src/hooks/useLeaderboard.ts`**

```typescript
import { useState, useEffect } from 'react';
import { query, collection, orderBy, limit, onSnapshot, Firestore } from 'firebase/firestore';
import { firestore } from '../firebase';
import { LeaderboardEntry } from '../types';

export function useLeaderboard(limitCount = 100) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    try {
      const q = query(
        collection(firestore, 'leaderboard') as any,
        orderBy('finalScore', 'desc'),
        limit(limitCount)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data: LeaderboardEntry[] = [];
        snapshot.forEach((doc) => {
          data.push(doc.data() as LeaderboardEntry);
        });
        setEntries(data);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      setLoading(false);
    }
  }, [limitCount]);

  const submitScore = async (entry: LeaderboardEntry) => {
    try {
      // Implementation in next task
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  };

  return { entries, loading, error, submitScore };
}
```

**File: `src/components/Leaderboard.tsx`**

```typescript
import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';
import './Leaderboard.css';

export default function Leaderboard() {
  const { entries, loading } = useLeaderboard(100);

  if (loading) {
    return <div className="leaderboard-loading">Loading leaderboard...</div>;
  }

  return (
    <div className="leaderboard">
      <h1>Cardhaven Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Floor</th>
            <th>Class</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <tr key={entry.runId}>
              <td>#{i + 1}</td>
              <td className="player-name">{entry.playerName}</td>
              <td className="score">{entry.score.toLocaleString()}</td>
              <td>{entry.floor}</td>
              <td className="class-badge">{entry.characterClass}</td>
              <td>{new Date(entry.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## PHASE 4: STYLING & AESTHETIC (SPRINT 5-6)

### Task 4.1: Global Styles
**File: `src/styles/globals.css`**

```css
@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');

:root {
  /* Colors */
  --color-bg-primary: #0a0e1a;
  --color-bg-secondary: #1a1f3a;
  --color-card: #2d1f4a;
  --color-accent-gold: #d4af37;
  --color-accent-green: #6b9d7a;
  --color-accent-red: #c73e1d;
  --color-text-primary: #f5f1e8;
  --color-text-secondary: #a0a0a0;
  
  /* Typography */
  --font-serif: 'Crimson Text', serif;
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 8px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-family: var(--font-sans);
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  overflow: hidden;
}

body {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 100%);
}

#root {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

button {
  font-family: var(--font-sans);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
}

button:active {
  transform: translateY(0);
}

.btn-primary {
  padding: var(--space-md) var(--space-lg);
  background: linear-gradient(135deg, var(--color-accent-gold), #c9961f);
  color: #000;
  font-weight: 600;
  border-radius: 4px;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover:not(:disabled) {
  box-shadow: var(--shadow-lg);
  background: linear-gradient(135deg, #e6c200, #d4af37);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-serif);
  font-weight: 600;
  letter-spacing: -0.5px;
}

p {
  line-height: 1.6;
  color: var(--color-text-secondary);
}
```

### Task 4.2: Card Styles
**File: `src/components/Card.css`**

```css
.card {
  width: 120px;
  height: 180px;
  background: linear-gradient(135deg, var(--color-card), var(--color-bg-secondary));
  border: 2px solid var(--color-accent-gold);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
}

.card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card:hover:not(.disabled) {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
}

.card:hover:not(.disabled)::before {
  opacity: 1;
}

.card.selected {
  border-color: var(--color-accent-green);
  box-shadow: 0 0 20px rgba(107, 157, 122, 0.6);
  transform: translateY(-8px) scale(1.05);
}

.card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.card-name {
  font-family: var(--font-serif);
  font-size: 14px;
  font-weight: 600;
  flex: 1;
  line-height: 1.2;
}

.card-cost {
  background: var(--color-accent-gold);
  color: #000;
  font-weight: 700;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.card-cost.disabled {
  opacity: 0.5;
}

.card-art {
  height: 60px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px dashed rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.card-icon {
  filter: drop-shadow(0 0 4px rgba(212, 175, 55, 0.3));
}

.card-description {
  font-size: 12px;
  line-height: 1.3;
  color: var(--color-text-secondary);
  flex-grow: 1;
}

.card-rarity {
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 1px;
}
```

### Task 4.3: Battle Screen Styles
**File: `src/components/BattleScreen.css`**

```css
.battle-screen {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a0e1a 0%, #1a1f3a 100%);
  padding: 20px;
  gap: 20px;
  overflow-y: auto;
}

.enemies-section {
  display: flex;
  gap: 16px;
  justify-content: center;
  min-height: 200px;
  align-items: flex-start;
  padding: 20px 0;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.player-stats {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: rgba(45, 31, 74, 0.5);
  border-radius: 8px;
  border-left: 3px solid var(--color-accent-gold);
}

.stat-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 120px;
}

.stat {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 14px;
}

.stat .label {
  color: var(--color-text-secondary);
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
}

.stat .value {
  color: var(--color-accent-gold);
  font-weight: 600;
}

.stat-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent-green), var(--color-accent-gold));
  transition: width 0.3s ease;
  border-radius: 4px;
}

.status-effects {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.status {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
  border: 2px solid currentColor;
}

.status.poison {
  background: rgba(199, 62, 29, 0.2);
  color: var(--color-accent-red);
}

.status.vulnerable {
  background: rgba(212, 175, 55, 0.2);
  color: var(--color-accent-gold);
}

.hand {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  padding: 16px 0;
  border-top: 1px solid rgba(212, 175, 55, 0.2);
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 16px 0;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .battle-screen {
    padding: 12px;
    gap: 12px;
  }
  
  .enemies-section {
    flex-direction: column;
  }
  
  .card {
    width: 100px;
    height: 160px;
    font-size: 12px;
  }
}
```

---

## PHASE 5: FIREBASE & AUTHENTICATION (SPRINT 7)

### Task 5.1: Authentication Hook
**File: `src/hooks/useAuth.ts`**

```typescript
import { useState, useEffect } from 'react';
import {
  Auth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
  };
}
```

### Task 5.2: Firebase Security Rules
**File: `firestore.rules`** (Upload to Firebase Console)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write for leaderboard
    match /leaderboard/{document=**} {
      allow read;
      allow write: if request.auth != null;
    }
    
    // User profiles - authenticated users only
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid;
    }
    
    // Game runs - authenticated users
    match /gameRuns/{document=**} {
      allow read;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.playerId;
    }
  }
}
```

---

## PHASE 6: MAIN APP FLOW (SPRINT 8)

### Task 6.1: App.tsx
**File: `src/App.tsx`**

```typescript
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGameState } from './hooks/useGameState';
import MainMenu from './pages/MainMenu';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import './styles/globals.css';

type Screen = 'menu' | 'game' | 'leaderboard' | 'profile';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { gameState, startNewRun, playCard, endTurn } = useGameState();
  const [screen, setScreen] = useState<Screen>('menu');

  if (authLoading) {
    return <div className="loading-screen">Cardhaven</div>;
  }

  const handleStartGame = (characterClass: 'warrior' | 'mage' | 'rogue') => {
    if (!user) return;
    startNewRun(user.uid, characterClass);
    setScreen('game');
  };

  return (
    <div className="app">
      {screen === 'menu' && (
        <MainMenu
          user={user}
          onStartGame={handleStartGame}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}
      {screen === 'game' && gameState && (
        <GamePage
          gameState={gameState}
          onPlayCard={playCard}
          onEndTurn={endTurn}
          onBack={() => setScreen('menu')}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardPage onBack={() => setScreen('menu')} />
      )}
    </div>
  );
}

export default App;
```

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Foundation ✅
- [ ] Project setup with Vite + React + TypeScript
- [ ] Firebase configuration and authentication
- [ ] All type definitions created
- [ ] Card, enemy, relic data files created
- [ ] Commit to GitHub

### Phase 2: Battle Engine ✅
- [ ] BattleEngine class fully implemented
- [ ] Card playing logic with validation
- [ ] Enemy AI & intent generation
- [ ] Status effects system
- [ ] Turn resolution (player & enemy)
- [ ] Commit to GitHub

### Phase 3: UI Components ✅
- [ ] BattleScreen with full interaction
- [ ] Card component with hover effects
- [ ] Enemy display with health bars
- [ ] Leaderboard real-time updates
- [ ] Main menu & game flow
- [ ] Commit to GitHub

### Phase 4: Styling ✅
- [ ] Global mystical-minimalist styles
- [ ] Card animations & hover effects
- [ ] Battle screen layout & responsiveness
- [ ] Mobile optimization
- [ ] Commit to GitHub

### Phase 5: Firebase Integration ✅
- [ ] Authentication (email + Google)
- [ ] Leaderboard read/write
- [ ] Security rules deployed
- [ ] User profiles
- [ ] Commit to GitHub

### Phase 6: Polish & Launch ✅
- [ ] All features tested end-to-end
- [ ] Performance optimized (60fps)
- [ ] Mobile tested on real device
- [ ] Privacy policy written
- [ ] Deploy to Vercel
- [ ] Deploy to Firebase Hosting
- [ ] Share on social media

---

## NOTES FOR CLAUDE CODE

1. **Always test your code** before marking tasks complete
2. **Follow TypeScript strictly** - use strict mode, avoid `any`
3. **Commit after each major task** with meaningful messages
4. **Reference existing code** when creating similar components
5. **Ask for clarification** if requirements are ambiguous
6. **Optimize as you go** - don't leave performance issues
7. **Comment complex logic only** - code should be self-documenting

**You've got this.** Build Cardhaven step by step. 🎮

---

**Next Steps:**
1. Create a GitHub repository
2. Set up Firebase project
3. Copy this guide into CLAUDE_CODE_GUIDE.md
4. Start Phase 1 and work through sprints systematically
5. Test in browser as you build
6. Commit frequently
7. Report progress back to the human developer
