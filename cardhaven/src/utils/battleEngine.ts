import { 
  Card, Enemy, GameState, GameEvent, Intent, 
  StatusEffectType, Relic, ShopState, StatusEffect, EnemyAction
} from '../types';
import cardData from '../data/cards.json';
import enemyData from '../data/enemies.json';
import relicData from '../data/relics.json';
import { GAME_CONSTANTS, STATUS_EFFECTS, EVENTS } from './balanceData';
import { generateEnemyEncounter, generateBossEncounter } from './enemyGenerator';

export class BattleEngine {
  private state: GameState;
  private rngSeed: number = 1;

  constructor(initialState: GameState) {
    this.state = { ...initialState };
    this.initRNG(this.state.seed);
  }

  private initRNG(seedStr: string = '') {
    const str = seedStr || Math.random().toString();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    this.rngSeed = Math.abs(hash) || 1;
  }

  private nextRandom(): number {
    this.rngSeed = (this.rngSeed * 16807) % 2147483647;
    return (this.rngSeed - 1) / 2147483646;
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
    if (card.targetType === 'all') {
      targets = this.state.enemies.filter(e => e.health > 0);
    } else if ((card.targetType === 'cell' || !card.targetType) && targetX !== undefined && targetY !== undefined) {
      if (card.effect.area === '2x2') {
        targets = this.state.enemies.filter(e => 
          e.boardX >= targetX && e.boardX <= targetX + 1 && 
          e.boardY >= targetY && e.boardY <= targetY + 1 && 
          e.health > 0
        );
      } else if (card.effect.area === 'cross') {
        targets = this.state.enemies.filter(e => 
          ((e.boardX === targetX && Math.abs(e.boardY - targetY) <= 1) ||
           (e.boardY === targetY && Math.abs(e.boardX - targetX) <= 1)) && 
          e.health > 0
        );
      } else {
        const enemy = this.state.enemies.find(e => e.boardX === targetX && e.boardY === targetY && e.health > 0);
        if (enemy) targets = [enemy];
      }
      
      if (card.effect.damage && targets.length === 0 && !card.effect.knockback) return false;
    } else if (card.targetType === 'row' && targetY !== undefined) {
      targets = this.state.enemies.filter(e => e.boardY === targetY && e.health > 0);
    } else if (card.targetType === 'column' && targetX !== undefined) {
      targets = this.state.enemies.filter(e => e.boardX === targetX && e.health > 0);
    } else if (card.targetType === 'none') {
      // no targets needed
    }

    // Deduct energy
    this.state = { ...this.state, energy: this.state.energy - card.cost };

    // Remove card from hand
    const newHand = [...this.state.hand];
    newHand.splice(cardIndex, 1);
    this.state = { ...this.state, hand: newHand };

    // Apply effect
    this.applyCardEffect(card, targets);

    // Move to discard or exhaust
    if (card.exhaust) {
      this.state = {
        ...this.state,
        exhausted: [...this.state.exhausted, card],
      };
    } else {
      this.state = {
        ...this.state,
        discard: [...this.state.discard, card],
      };
    }

    return true;
  }

  private applyCardEffect(card: Card, targets: Enemy[]): void {
    const effect = card.effect;

    // 0. Special: "Last Stand" — damage = missing HP
    let effectiveDamage = effect.damage ?? 0;
    if (card.id === 'last_stand') {
      effectiveDamage = this.state.maxHealth - this.state.health;
    }

    // 0b. Special: healthPercentDamage
    // Applied per-target below

    // 1. Calculate Damage
    const hits = effect.hits ?? 1;

    // Strength bonus
    const strengthEffect = this.getPlayerStatusEffect('strength');
    const strengthBonus = strengthEffect ? strengthEffect.stacks * 2 : 0;

    // Damage
    if ((effectiveDamage > 0 || effect.healthPercentDamage) && targets.length > 0) {
      // Apply relic bonuses
      let bonusFromRelics = 0;
      if (this.state.relics.some(r => r.id === 'molten_egg')) bonusFromRelics += 1;
      if (this.state.relics.some(r => r.id === 'sword_of_strength')) bonusFromRelics += 2;

      let baseDamage = effectiveDamage + strengthBonus + bonusFromRelics;
      if (card.cost === 0 && this.state.relics.some(r => r.id === 'inkwell')) baseDamage += 3;

      // glass_cannon modifier (Player deals +50% damage)
      if (this.state.modifiers?.some(m => m.id === 'glass_cannon')) {
        baseDamage = Math.floor(baseDamage * 1.5);
      }

      // Weak reduces player damage
      const weakEffect = this.getPlayerStatusEffect('weak');
      if (weakEffect) baseDamage = Math.floor(baseDamage * 0.75);

      for (let h = 0; h < hits; h++) {
        for (const target of targets) {
          const targetId = target.id;
          const currentTarget = this.state.enemies.find(e => e.id === targetId);
          if (!currentTarget || currentTarget.health <= 0) continue;

          let damage = baseDamage;

          // healthPercentDamage override
          if (effect.healthPercentDamage) {
            damage = Math.floor(currentTarget.health * (effect.healthPercentDamage / 100));
          }

          // Vulnerable on target amplifies damage
          const vulnEffect = currentTarget.statusEffects.find(s => s.type === 'vulnerable');
          if (vulnEffect) damage = Math.floor(damage * 1.5);

          // Apply block first
          const absorbed = Math.min(currentTarget.block, damage);
          const remaining = damage - absorbed;

          let shardsGained = 0;
          let killsThisHit = 0;
          let damageThisHit = remaining + absorbed;

          const updatedEnemies = this.state.enemies.map(e => {
            if (e.id === targetId) {
              const newHealth = Math.max(0, e.health - remaining);
              if (e.health > 0 && newHealth === 0) {
                shardsGained += Math.max(5, Math.floor(e.maxHealth / 2));
                killsThisHit++;
              }
              
              let finalY = e.boardY;
              if (effect.knockback && newHealth > 0) {
                finalY = Math.max(0, e.boardY - effect.knockback);
                const isOccupied = this.state.enemies.some(oe => oe.id !== e.id && oe.boardX === e.boardX && oe.boardY === finalY && oe.health > 0);
                if (isOccupied) finalY = e.boardY; 
              }

              return { 
                ...e, 
                block: e.block - absorbed, 
                health: newHealth,
                boardY: finalY
              };
            }
            return e;
          });

          this.state = { 
            ...this.state, 
            enemies: updatedEnemies,
            shards: this.state.shards + shardsGained,
            totalDamageDealt: this.state.totalDamageDealt + damageThisHit,
            enemiesKilled: this.state.enemiesKilled + killsThisHit,
            score: this.state.score + (damageThisHit * 1) + (killsThisHit * 50)
          };
        }
      }
    }

    // 2. Block
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

    // 3. Draw
    if (effect.draw) {
      this.drawCards(effect.draw);
    }

    // 4. Heal
    if (effect.heal) {
      this.state = {
        ...this.state,
        health: Math.min(this.state.health + effect.heal, this.state.maxHealth),
      };
    }

    // 5. Self Damage (risk/reward cards)
    if (effect.selfDamage) {
      this.state = {
        ...this.state,
        health: Math.max(1, this.state.health - effect.selfDamage),
      };
    }

    // 6. Energy Gain
    if (effect.energyGain) {
      this.state = {
        ...this.state,
        energy: this.state.energy + effect.energyGain,
      };
    }

    // 7. Status effects (Applied AFTER damage)
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

    // Apply player doom
    this.applyPlayerDoom();

    // 1. Enemies perform their stationary actions (buffs, blocks)
    this.state.enemies.forEach(enemy => {
      if (enemy.health > 0) {
        // Stun check: stunned enemies skip their turn
        const stunEffect = enemy.statusEffects.find(s => s.type === 'stun');
        if (stunEffect) {
          // Remove stun, skip action
          this.state = {
            ...this.state,
            enemies: this.state.enemies.map(e =>
              e.id === enemy.id ? { ...e, statusEffects: e.statusEffects.filter(s => s.type !== 'stun') } : e
            ),
          };
        } else {
          this.executeEnemyTurn(enemy);
        }
      }
    });

    // 2. Enemies move down the grid
    this.advanceEnemies();

    // If all enemies are defeated after movement, transition to reward rather
    // than continuing the current floor with an empty board.
    if (this.checkBattleEnd() === 'won') {
      this.advanceToReward();
      return;
    }

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
      // 1. Horizontal Movement (for Weaver type enemies)
      // Note: We check ID or a hypothetical property. For now, let's look at templateId.
      if (enemy.templateId === 'weaver' || enemy.templateId === 'skeleton_weaver') {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const newX = enemy.boardX + direction;
        if (newX >= 0 && newX < 5) {
          const isOccupied = this.state.enemies.some(oe => oe.id !== enemy.id && oe.boardX === newX && oe.boardY === enemy.boardY && oe.health > 0);
          if (!isOccupied) {
            enemy = { ...enemy, boardX: newX };
          }
        }
      }

      // 2. Vertical Movement
      // Check if enemy is blocked by another enemy below it
      const enemyBelow = this.state.enemies.find(other => other.boardX === enemy.boardX && other.boardY === enemy.boardY + 1 && other.health > 0);
      
      if (!enemyBelow) {
        enemy = { ...enemy, boardY: enemy.boardY + 1 };
      }

      if (enemy.boardY >= 4) {
        // Enemy reached the bottom
        const action = enemy.actions[enemy.currentActionIndex % enemy.actions.length];
        let atkDamage = action.damage || Math.floor(enemy.maxHealth * 0.5) || 1;

        // Apply enemy status effects
        const enemyWeak = enemy.statusEffects.find(s => s.type === 'weak');
        if (enemyWeak) atkDamage = Math.floor(atkDamage * 0.75);

        // Apply player status effects
        const playerVuln = this.state.statusEffects.find(s => s.type === 'vulnerable');
        if (playerVuln) atkDamage = Math.floor(atkDamage * 1.5);

        // glass_cannon modifier (Player takes +50% damage)
        if (this.state.modifiers?.some(m => m.id === 'glass_cannon')) {
          atkDamage = Math.floor(atkDamage * 1.5);
        }

        damageToPlayer += atkDamage;
        return null; // Remove enemy
      }
      return enemy;
    }).filter(Boolean) as Enemy[];

    this.state = { ...this.state, enemies: updatedEnemies };

    if (damageToPlayer > 0) {
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
    const freeColumns = [0, 1, 2, 3, 4].filter(col => !occupiedColumns.includes(col));

    if (freeColumns.length === 0) return;

    // Spawn 1-2 new enemies depending on floor
    const spawnCount = Math.min(this.state.floor >= 5 ? 2 : 1, freeColumns.length);
    const selectedColumns = this.shuffle(freeColumns).slice(0, spawnCount);

    const newEnemies = generateEnemyEncounter(this.state.floor, this.state.seed, this.state.modifiers).slice(0, spawnCount);
    
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

    // Apply relic: blood_chalice
    if (this.state.relics.some(r => r.id === 'blood_chalice')) {
      this.state = { ...this.state, energy: this.state.energy + 1, health: Math.max(1, this.state.health - 3) };
    }

    // Apply relic: philosophers_stone (start of turn strength)
    if (this.state.relics.some(r => r.id === 'philosophers_stone')) {
      this.addPlayerStatusEffect('strength', 1);
    }

    // Apply player regen
    this.applyPlayerRegen();

    // Apply ritual (gain strength each turn)
    const ritualEffect = this.getPlayerStatusEffect('ritual');
    if (ritualEffect) {
      this.addPlayerStatusEffect('strength', ritualEffect.stacks);
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
    let drawCount: number = GAME_CONSTANTS.STARTING_HAND_SIZE;
    if (this.state.relics.some(r => r.id === 'ancient_tome')) drawCount += 1;
    if (this.state.relics.some(r => r.id === 'cursed_eye')) drawCount += 1;
    this.drawCards(drawCount);
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

  private applyPlayerRegen(): void {
    const regen = this.getPlayerStatusEffect('regen');
    if (regen && regen.stacks > 0) {
      this.state = {
        ...this.state,
        health: Math.min(this.state.health + regen.stacks, this.state.maxHealth),
        statusEffects: this.state.statusEffects.map(se =>
          se.type === 'regen' ? { ...se, stacks: Math.max(0, se.stacks - 1) } : se
        ),
      };
    }
  }

  private applyPlayerDoom(): void {
    const doom = this.getPlayerStatusEffect('doom');
    if (doom && doom.stacks > 0) {
      this.state = {
        ...this.state,
        health: Math.max(0, this.state.health - doom.stacks),
        statusEffects: this.state.statusEffects.map(se =>
          se.type === 'doom' ? { ...se, stacks: se.stacks + 1 } : se
        ),
      };
    }
  }

  private decayPlayerStatusEffects(): void {
    this.state = {
      ...this.state,
      statusEffects: this.state.statusEffects
        .map(se => {
          if (['weak', 'vulnerable', 'frail', 'bleed', 'thorns'].includes(se.type)) {
            return { ...se, stacks: se.stacks - 1 };
          }
          return se;
        })
        .filter(se => se.stacks > 0),
    };
  }

  private decayAllEnemyStatusEffects(): void {
    const updatedEnemies = this.state.enemies.map(enemy => ({
      ...enemy,
      statusEffects: enemy.statusEffects
        .map(se => {
          if (['weak', 'vulnerable', 'frail', 'poison'].includes(se.type)) {
            // Note: Poison usually decays after dealing damage. 
            // In this game, let's just make it decay at turn start.
            return { ...se, stacks: se.stacks - 1 };
          }
          return se;
        })
        .filter(se => se.stacks > 0),
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

    // Boss floor
    if (nextFloor === GAME_CONSTANTS.BOSS_FLOOR) {
      const bossEnemies = generateBossEncounter(nextFloor);
      this.state = {
        ...this.state,
        floor: nextFloor,
        phase: 'battle',
        enemies: bossEnemies,
        block: 0,
        energy: this.state.maxEnergy,
        hand: [],
      };
      this.drawCards(GAME_CONSTANTS.STARTING_HAND_SIZE);
      return;
    }

    // Event rooms every 3rd floor (3, 6, 9, etc.) but not boss floor
    if (nextFloor % 3 === 0 && nextFloor !== GAME_CONSTANTS.BOSS_FLOOR) {
      const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      this.state = {
        ...this.state,
        floor: nextFloor,
        phase: 'event',
        currentEvent: { ...randomEvent, choices: [...randomEvent.choices] } as any,
        hand: [],
      };
      return;
    }

    // Rest rooms every 5th floor
    if (nextFloor % 5 === 0 && nextFloor !== GAME_CONSTANTS.BOSS_FLOOR) {
      this.state = {
        ...this.state,
        floor: nextFloor,
        phase: 'rest',
        hand: [],
      };
      return;
    }

    // Shop every even floor (but not event/rest/boss)
    if (nextFloor % 2 === 0) {
      this.state = {
        ...this.state,
        floor: nextFloor,
        phase: 'shop',
        shopState: this.generateShopState(),
        block: 0,
        energy: this.state.maxEnergy,
        hand: [],
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

  private generateShopState() {
    // Pick 3 random cards
    const allCards = (cardData as { cards: Card[] }).cards;
    const shopCards = [...allCards].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    // Pick 1 random relic
    const allRelics = (relicData as { relics: Relic[] }).relics;
    const shopRelics = [...allRelics].sort(() => 0.5 - Math.random()).slice(0, 1);

    return {
      cards: shopCards,
      relics: shopRelics,
      removalCost: 25
    };
  }

  buyCard(cardIndex: number, cost: number): boolean {
    if (this.state.shards < cost || !this.state.shopState) return false;
    
    const card = this.state.shopState.cards[cardIndex];
    this.addCardToDeck(card);
    
    const newShopCards = [...this.state.shopState.cards];
    newShopCards.splice(cardIndex, 1);
    
    this.state = {
      ...this.state,
      shards: this.state.shards - cost,
      shopState: { ...this.state.shopState, cards: newShopCards }
    };
    return true;
  }

  buyRelic(relicIndex: number, cost: number): boolean {
    if (this.state.shards < cost || !this.state.shopState) return false;
    
    const relic = this.state.shopState.relics[relicIndex];
    
    const newShopRelics = [...this.state.shopState.relics];
    newShopRelics.splice(relicIndex, 1);
    
    this.state = {
      ...this.state,
      shards: this.state.shards - cost,
      relics: [...this.state.relics, relic],
      shopState: { ...this.state.shopState, relics: newShopRelics }
    };
    return true;
  }

  removeCardFromDeck(cardIndex: number, cost: number): boolean {
    if (this.state.shards < cost) return false;
    
    const newDeck = [...this.state.deck];
    newDeck.splice(cardIndex, 1);
    
    this.state = {
      ...this.state,
      shards: this.state.shards - cost,
      deck: newDeck
    };
    return true;
  }

  leaveShop(): void {
    const newEnemies = generateEnemyEncounter(this.state.floor);
    this.state = {
      ...this.state,
      phase: 'battle',
      enemies: newEnemies,
      shopState: undefined
    };
    this.drawCards(GAME_CONSTANTS.STARTING_HAND_SIZE);
  }

  // ─── Event System ────────────────────────────────────────────
  applyEventChoice(choiceIndex: number): void {
    const event = this.state.currentEvent;
    if (!event) return;

    const choice = event.choices[choiceIndex];
    if (!choice) return;

    const eff = choice.effect;

    if (eff.health) {
      if (eff.health === 999) {
        this.state = { ...this.state, health: this.state.maxHealth };
      } else {
        this.state = {
          ...this.state,
          health: Math.max(1, Math.min(this.state.health + eff.health, this.state.maxHealth)),
        };
      }
    }
    if (eff.maxHealth) {
      this.state = {
        ...this.state,
        maxHealth: this.state.maxHealth + eff.maxHealth,
        health: eff.maxHealth > 0 ? this.state.health + eff.maxHealth : this.state.health,
      };
    }
    if (eff.shards) {
      this.state = { ...this.state, shards: Math.max(0, this.state.shards + eff.shards) };
    }
    if (eff.addStatusEffect) {
      this.addPlayerStatusEffect(eff.addStatusEffect.type, eff.addStatusEffect.stacks);
    }
    if (eff.removeRandomCard && this.state.deck.length > 0) {
      const idx = Math.floor(Math.random() * this.state.deck.length);
      const newDeck = [...this.state.deck];
      newDeck.splice(idx, 1);
      this.state = { ...this.state, deck: newDeck };
    }

    // After event, advance to next battle
    this.state = { ...this.state, currentEvent: undefined };
    this.advanceToNextFloor();
  }

  // ─── Rest System ─────────────────────────────────────────────
  rest(choice: 'heal' | 'upgrade'): void {
    if (choice === 'heal') {
      const healAmount = Math.floor(this.state.maxHealth * GAME_CONSTANTS.REST_HEAL_PERCENT);
      this.state = {
        ...this.state,
        health: Math.min(this.state.health + healAmount, this.state.maxHealth),
      };
    }
    // upgrade: could upgrade a random card — for now just heal less
    if (choice === 'upgrade') {
      this.state = {
        ...this.state,
        health: Math.min(this.state.health + 5, this.state.maxHealth),
        maxEnergy: this.state.maxEnergy, // Could add energy upgrade in future
      };
      this.addPlayerStatusEffect('strength', 1);
    }
    this.advanceToNextFloor();
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
