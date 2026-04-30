import { GameState, Card, Enemy, StatusEffect, StatusEffectType, Intent } from '../types';
import { GAME_CONSTANTS } from './balanceData';
import { generateEnemyEncounter } from './enemyGenerator';

export class BattleEngine {
  private state: GameState;

  constructor(initialState: GameState) {
    this.state = { ...initialState };
  }

  getState(): GameState {
    return { ...this.state };
  }

  // ─── Card Play ────────────────────────────────────────────────
  playCard(cardIndex: number, targetX?: number, targetY?: number): boolean {
    if (!this.state.isPlayerTurn) return false;

    const card = this.state.hand[cardIndex];
    if (!card) return false;
    if (this.state.energy < card.cost) return false;

    // Determine targets based on targetType
    let targets: Enemy[] = [];
    if (card.targetType === 'cell' && targetX !== undefined && targetY !== undefined) {
      const enemy = this.state.enemies.find(e => e.boardX === targetX && e.boardY === targetY && e.health > 0);
      if (enemy) targets = [enemy];
      // Even if no enemy, we allow playing the card if it's targeted at an empty cell?
      // Typically roguelikes require a valid target. Let's require a target for 'cell' unless it doesn't do damage.
      if (card.effect.damage && targets.length === 0) return false;
    } else if (card.targetType === 'row' && targetY !== undefined) {
      targets = this.state.enemies.filter(e => e.boardY === targetY && e.health > 0);
    } else if (card.targetType === 'column' && targetX !== undefined) {
      targets = this.state.enemies.filter(e => e.boardX === targetX && e.health > 0);
    } else if (card.targetType === 'none') {
      // no targets needed
    } else if (!card.targetType) {
      // Default to cell targeting logic if missing
      const enemy = this.state.enemies.find(e => e.boardX === targetX && e.boardY === targetY && e.health > 0);
      if (enemy) targets = [enemy];
      if (card.effect.damage && targets.length === 0) return false;
    }

    // Deduct energy
    this.state = { ...this.state, energy: this.state.energy - card.cost };

    // Remove card from hand
    const newHand = [...this.state.hand];
    newHand.splice(cardIndex, 1);
    this.state = { ...this.state, hand: newHand };

    // Apply effect
    this.applyCardEffect(card, targets);

    // Move to discard
    this.state = {
      ...this.state,
      discard: [...this.state.discard, card],
    };

    return true;
  }

  private applyCardEffect(card: Card, targets: Enemy[]): void {
    const effect = card.effect;
    const hits = effect.hits ?? 1;

    // Strength bonus
    const strengthEffect = this.getPlayerStatusEffect('strength');
    const strengthBonus = strengthEffect ? strengthEffect.stacks * 2 : 0;

    // Damage
    if (effect.damage && targets.length > 0) {
      // Apply relic bonuses
      let bonusFromRelics = 0;
      if (this.state.relics.some(r => r.id === 'molten_egg')) bonusFromRelics += 1;
      if (this.state.relics.some(r => r.id === 'sword_of_strength')) bonusFromRelics += 2;

      let baseDamage = effect.damage + strengthBonus + bonusFromRelics;

      // Weak reduces player damage
      const weakEffect = this.getPlayerStatusEffect('weak');
      if (weakEffect) baseDamage = Math.floor(baseDamage * 0.75);

      for (let h = 0; h < hits; h++) {
        for (const target of targets) {
          const targetId = target.id;
          const currentTarget = this.state.enemies.find(e => e.id === targetId);
          if (!currentTarget || currentTarget.health <= 0) continue;

          let damage = baseDamage;

          // Vulnerable on target amplifies damage
          const vulnEffect = currentTarget.statusEffects.find(s => s.type === 'vulnerable');
          if (vulnEffect) damage = Math.floor(damage * 1.5);

          // Apply block first
          const absorbed = Math.min(currentTarget.block, damage);
          const remaining = damage - absorbed;

          const updatedEnemies = this.state.enemies.map(e =>
            e.id === targetId
              ? { ...e, block: e.block - absorbed, health: Math.max(0, e.health - remaining) }
              : e
          );
          this.state = { ...this.state, enemies: updatedEnemies };
        }
      }
    }

    // Block
    if (effect.block) {
      let blockAmount = effect.block;

      // Dexterity bonus
      const dexEffect = this.getPlayerStatusEffect('dexterity');
      if (dexEffect) blockAmount += dexEffect.stacks;

      // Frail reduces block
      const frailEffect = this.getPlayerStatusEffect('frail');
      if (frailEffect) blockAmount = Math.floor(blockAmount * 0.75);

      this.state = { ...this.state, block: this.state.block + blockAmount };
    }

    // Draw
    if (effect.draw) {
      this.drawCards(effect.draw);
    }

    // Heal
    if (effect.heal) {
      this.state = {
        ...this.state,
        health: Math.min(this.state.health + effect.heal, this.state.maxHealth),
      };
    }

    // Status effects
    if (effect.statusEffects) {
      effect.statusEffects.forEach(se => {
        if (effect.applyToSelf) {
          this.addPlayerStatusEffect(se.type, se.stacks);
        } else {
          targets.forEach(target => {
            this.addEnemyStatusEffect(target.id, se.type, se.stacks);
          });
        }
      });
    }
  }

  // ─── End Player Turn & Enemy Phases ──────────────────────────
  endPlayerTurn(): void {
    if (!this.state.isPlayerTurn) return;

    // Send hand to discard
    this.state = {
      ...this.state,
      isPlayerTurn: false,
      turnsPlayed: this.state.turnsPlayed + 1,
      discard: [...this.state.discard, ...this.state.hand],
      hand: [],
    };

    // Apply player poison
    this.applyPlayerPoison();

    // 1. Enemies perform their stationary actions (buffs, blocks)
    this.state.enemies.forEach(enemy => {
      if (enemy.health > 0) this.executeEnemyTurn(enemy);
    });

    // 2. Enemies move down the grid
    this.advanceEnemies();

    // 3. Spawn new enemies
    this.spawnEnemies();

    // Check player death
    if (this.state.health <= 0) {
      this.state = { ...this.state, phase: 'gameover' };
      return;
    }

    // Start new turn
    this.startNewPlayerTurn();
  }

  private executeEnemyTurn(enemy: Enemy): void {
    const actionIndex = enemy.currentActionIndex % enemy.actions.length;
    const action = enemy.actions[actionIndex];

    // Update enemy action index
    const updatedEnemies = this.state.enemies.map(e =>
      e.id === enemy.id
        ? { ...e, currentActionIndex: e.currentActionIndex + 1 }
        : e
    );
    this.state = { ...this.state, enemies: updatedEnemies };

    // Enemy block
    if (action.block) {
      this.state = {
        ...this.state,
        enemies: this.state.enemies.map(e =>
          e.id === enemy.id ? { ...e, block: e.block + action.block! } : e
        ),
      };
    }

    // Enemy applies status effects to player
    if (action.statusEffects) {
      action.statusEffects.forEach(se => {
        this.addPlayerStatusEffect(se.type, se.stacks);
      });
    }
  }

  private advanceEnemies(): void {
    let damageToPlayer = 0;
    
    const updatedEnemies = this.state.enemies.filter(e => e.health > 0).map(enemy => {
      // Check if enemy is blocked by another enemy below it
      const enemyBelow = this.state.enemies.find(other => other.boardX === enemy.boardX && other.boardY === enemy.boardY + 1 && other.health > 0);
      
      if (!enemyBelow) {
        enemy = { ...enemy, boardY: enemy.boardY + 1 };
      }

      if (enemy.boardY >= 5) {
        // Enemy reached the bottom
        const action = enemy.actions[enemy.currentActionIndex % enemy.actions.length];
        const atkDamage = action.damage || Math.floor(enemy.maxHealth * 0.5) || 1;
        damageToPlayer += atkDamage;
        return null; // Remove enemy
      }
      return enemy;
    }).filter(Boolean) as Enemy[];

    this.state = { ...this.state, enemies: updatedEnemies };

    if (damageToPlayer > 0) {
      const weakEffect = this.state.statusEffects.find(s => s.type === 'weak');
      // Player block absorbs damage
      const absorbed = Math.min(this.state.block, damageToPlayer);
      const remaining = damageToPlayer - absorbed;

      this.state = {
        ...this.state,
        block: Math.max(0, this.state.block - absorbed),
        health: Math.max(0, this.state.health - remaining),
      };
    }
  }

  private spawnEnemies(): void {
    // Only spawn if we haven't reached a cap (e.g., max 10 enemies on board)
    if (this.state.enemies.length >= 10) return;

    // Find empty columns in top row
    const occupiedColumns = this.state.enemies.filter(e => e.boardY === 0).map(e => e.boardX);
    const freeColumns = [0, 1, 2, 3].filter(col => !occupiedColumns.includes(col));

    if (freeColumns.length === 0) return;

    // Spawn 1-2 new enemies depending on floor
    const spawnCount = Math.min(this.state.floor >= 5 ? 2 : 1, freeColumns.length);
    const selectedColumns = this.shuffle(freeColumns).slice(0, spawnCount);

    const newEnemies = generateEnemyEncounter(this.state.floor).slice(0, spawnCount);
    
    newEnemies.forEach((enemy, i) => {
      enemy.boardX = selectedColumns[i];
      enemy.boardY = 0;
      enemy.id = `enemy-spawn-${Date.now()}-${i}`;
    });

    this.state = {
      ...this.state,
      enemies: [...this.state.enemies, ...newEnemies]
    };
  }

  private startNewPlayerTurn(): void {
    // Block now persists across turns (acts like Armor)
    this.state = {
      ...this.state,
      isPlayerTurn: true,
      energy: this.state.maxEnergy,
    };

    // Apply relic: energy_ring
    if (this.state.relics.some(r => r.id === 'energy_ring')) {
      this.state = { ...this.state, energy: this.state.energy + 1 };
    }

    // Apply relic: philosophers_stone (start of turn strength)
    if (this.state.relics.some(r => r.id === 'philosophers_stone')) {
      this.addPlayerStatusEffect('strength', 1);
    }

    // Reset enemy block
    const updatedEnemies = this.state.enemies.map(e => ({ ...e, block: 0 }));
    this.state = { ...this.state, enemies: updatedEnemies };

    // Decay player status effects
    this.decayPlayerStatusEffects();

    // Decay enemy status effects
    this.decayAllEnemyStatusEffects();

    // Update enemy intents
    this.updateEnemyIntents();

    // Draw hand
    this.drawCards(GAME_CONSTANTS.STARTING_HAND_SIZE);
  }

  // ─── Drawing ─────────────────────────────────────────────────
  drawCards(count: number): void {
    let drawn = 0;
    let deck = [...this.state.deck];
    let discard = [...this.state.discard];
    const hand = [...this.state.hand];

    while (drawn < count && hand.length < GAME_CONSTANTS.MAX_HAND_SIZE) {
      if (deck.length === 0) {
        if (discard.length === 0) break;
        deck = this.shuffle([...discard]);
        discard = [];
      }
      const card = deck.pop()!;
      hand.push(card);
      drawn++;
    }

    this.state = { ...this.state, hand, deck, discard };
  }

  // ─── Status Effects ───────────────────────────────────────────
  private applyPlayerPoison(): void {
    const poison = this.getPlayerStatusEffect('poison');
    if (poison && poison.stacks > 0) {
      this.state = {
        ...this.state,
        health: Math.max(0, this.state.health - poison.stacks),
      };
      // Reduce poison stacks by 1
      this.state = {
        ...this.state,
        statusEffects: this.state.statusEffects.map(se =>
          se.type === 'poison' ? { ...se, stacks: Math.max(0, se.stacks - 1) } : se
        ),
      };
    }
  }

  private decayPlayerStatusEffects(): void {
    this.state = {
      ...this.state,
      statusEffects: this.state.statusEffects
        .map(se => ({ ...se, turnsRemaining: se.turnsRemaining - 1 }))
        .filter(se => se.turnsRemaining > 0 && se.stacks > 0),
    };
  }

  private decayAllEnemyStatusEffects(): void {
    const updatedEnemies = this.state.enemies.map(enemy => ({
      ...enemy,
      statusEffects: enemy.statusEffects
        .map(se => ({ ...se, turnsRemaining: se.turnsRemaining - 1 }))
        .filter(se => se.turnsRemaining > 0 && se.stacks > 0),
    }));
    this.state = { ...this.state, enemies: updatedEnemies };
  }

  private addPlayerStatusEffect(type: StatusEffectType, stacks: number): void {
    const existing = this.state.statusEffects.find(se => se.type === type);
    if (existing) {
      this.state = {
        ...this.state,
        statusEffects: this.state.statusEffects.map(se =>
          se.type === type ? { ...se, stacks: se.stacks + stacks } : se
        ),
      };
    } else {
      this.state = {
        ...this.state,
        statusEffects: [
          ...this.state.statusEffects,
          { type, stacks, turnsRemaining: 99 },
        ],
      };
    }
  }

  private addEnemyStatusEffect(enemyId: string, type: StatusEffectType, stacks: number): void {
    const updatedEnemies = this.state.enemies.map(e => {
      if (e.id !== enemyId) return e;
      const existing = e.statusEffects.find(se => se.type === type);
      if (existing) {
        return {
          ...e,
          statusEffects: e.statusEffects.map(se =>
            se.type === type ? { ...se, stacks: se.stacks + stacks } : se
          ),
        };
      }
      return {
        ...e,
        statusEffects: [...e.statusEffects, { type, stacks, turnsRemaining: 99 }],
      };
    });
    this.state = { ...this.state, enemies: updatedEnemies };
  }

  private getPlayerStatusEffect(type: string): StatusEffect | undefined {
    return this.state.statusEffects.find(se => se.type === type);
  }

  // ─── Utilities ────────────────────────────────────────────────
  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  private updateEnemyIntents(): void {
    const updatedEnemies = this.state.enemies.map(e => ({
      ...e,
      intents: generateIntentsForEnemy(e),
    }));
    this.state = { ...this.state, enemies: updatedEnemies };
  }

  // ─── Battle End ───────────────────────────────────────────────
  checkBattleEnd(): 'won' | 'lost' | 'ongoing' {
    if (this.state.health <= 0) return 'lost';
    // If the board is empty, battle is won
    if (this.state.enemies.every(e => e.health <= 0) && this.state.enemies.length === 0) return 'won';
    // Actually, in an endless lane game, do you ever win?
    // Let's say you win the floor after surviving X turns, OR killing Y enemies.
    // For now, if board is empty, you win.
    if (this.state.enemies.filter(e => e.health > 0).length === 0) return 'won';
    return 'ongoing';
  }

  advanceToReward(): void {
    const floorPoints = this.state.floor * GAME_CONSTANTS.POINTS_PER_FLOOR;
    const healthPoints = this.state.health * GAME_CONSTANTS.POINTS_PER_HEALTH_REMAINING;
    const score = this.state.score + floorPoints + healthPoints;

    this.state = {
      ...this.state,
      phase: 'reward',
      roomsCleared: this.state.roomsCleared + 1,
      score,
    };
  }

  addCardToDeck(card: Card): void {
    const shuffledDeck = this.shuffle([...this.state.deck, ...this.state.discard, card]);
    this.state = {
      ...this.state,
      deck: shuffledDeck,
      discard: [],
      cardsAdded: [...this.state.cardsAdded, card.id],
    };
  }

  advanceToNextFloor(): void {
    const nextFloor = this.state.floor + 1;
    const isVictory = nextFloor > GAME_CONSTANTS.MAX_FLOORS;

    if (isVictory) {
      this.state = {
        ...this.state,
        phase: 'victory',
        score: this.state.score + GAME_CONSTANTS.POINTS_PER_VICTORY,
      };
      return;
    }

    // Generate new enemies
    const newEnemies = generateEnemyEncounter(nextFloor);

    this.state = {
      ...this.state,
      floor: nextFloor,
      phase: 'battle',
      enemies: newEnemies,
      block: 0,
      energy: this.state.maxEnergy,
      hand: [],
    };

    // Draw initial hand
    this.drawCards(GAME_CONSTANTS.STARTING_HAND_SIZE);
  }
}

function generateIntentsForEnemy(enemy: Enemy): Intent[] {
  const actionIndex = enemy.currentActionIndex % enemy.actions.length;
  const action = enemy.actions[actionIndex];
  const intents: Intent[] = [];

  // In the new system, damage happens when they hit the bottom.
  // We can show their attack value as an intent anyway.
  const atkDamage = action.damage || Math.floor(enemy.maxHealth * 0.5) || 1;
  intents.push({ type: 'attack', amount: atkDamage, icon: '⚔' });

  if (action.block) {
    intents.push({ type: 'defend', amount: action.block, icon: '🛡' });
  }
  if (action.statusEffects) {
    action.statusEffects.forEach(se => {
      if (se.type === 'poison') intents.push({ type: 'debuff', amount: se.stacks, icon: '☠' });
      if (se.type === 'vulnerable') intents.push({ type: 'debuff', amount: se.stacks, icon: '💢' });
      if (se.type === 'weak') intents.push({ type: 'debuff', amount: se.stacks, icon: '😵' });
      if (se.type === 'strength') intents.push({ type: 'buff', amount: se.stacks, icon: '💪' });
    });
  }

  return intents;
}
