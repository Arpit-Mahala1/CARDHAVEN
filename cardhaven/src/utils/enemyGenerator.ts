import { Enemy, EnemyTemplate, Intent, DailyModifier } from '../types';
import enemyData from '../data/enemies.json';

class SeededRNG {
  private seed: number;
  constructor(seedStr: string) {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
      hash |= 0;
    }
    this.seed = Math.abs(hash);
  }
  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

export function generateEnemyEncounter(floor: number, seed: string = Math.random().toString(), modifiers: DailyModifier[] = []): Enemy[] {
  const rng = new SeededRNG(seed + floor);
  const templates = (enemyData as { enemies: EnemyTemplate[] }).enemies.filter(e => !e.isBoss);

  // More enemies on higher floors
  let count = 1;
  if (floor >= 5) count = 2;
  if (floor >= 15) count = 3;

  // Pick enemies appropriate to floor
  const availableTemplates = templates.filter((_, i) => {
    if (floor < 5) return i < 4;    // goblin, skeleton, weaver, witch
    if (floor < 10) return i < 7;   // + knight, whisperer, ink_wraith
    if (floor < 15) return i < 9;   // + hollow_priest, crawling_horror
    return true;                     // all non-boss enemies
  });

  const enemies: Enemy[] = [];
  const columns = [0, 1, 2, 3].sort(() => 0.5 - rng.next());

  for (let i = 0; i < count; i++) {
    const template = availableTemplates[Math.floor(rng.next() * availableTemplates.length)];
    const boardX = columns[i];
    const enemy = createEnemyInstance(template, floor, i, boardX, 0);
    
    // Apply Daily Modifiers
    if (modifiers.some(m => m.id === 'bleed_start')) {
      enemy.statusEffects.push({ type: 'bleed', stacks: 2, turnsRemaining: 99 });
    }
    
    enemies.push(enemy);
  }

  return enemies;
}

export function generateBossEncounter(floor: number): Enemy[] {
  const templates = (enemyData as { enemies: EnemyTemplate[] }).enemies;
  const bossTemplate = templates.find(e => e.isBoss);
  
  if (!bossTemplate) {
    // Fallback: generate a hard regular encounter
    return generateEnemyEncounter(floor);
  }

  const boss = createEnemyInstance(bossTemplate, floor, 0, 1, 0);
  boss.isBoss = true;
  
  // Boss starts in center of grid
  boss.boardX = 1;
  boss.boardY = 1;

  return [boss];
}

function createEnemyInstance(template: EnemyTemplate, floor: number, index: number, boardX: number, boardY: number): Enemy {
  const scaling = 1 + (floor - 1) * 0.12;
  const health = Math.round(template.baseHealth * scaling);
  const startIndex = 0;

  const intents = generateInitialIntents(template, startIndex);

  return {
    id: `enemy-${template.id}-${Date.now()}-${index}`,
    templateId: template.id,
    name: template.name,
    boardX,
    boardY,
    maxHealth: health,
    health,
    block: 0,
    intents,
    actions: template.actions,
    statusEffects: [],
    currentActionIndex: startIndex,
    isBoss: template.isBoss,
  };
}

function generateInitialIntents(template: EnemyTemplate, actionIndex: number): Intent[] {
  const action = template.actions[actionIndex % template.actions.length];
  const intents: Intent[] = [];

  if (action.damage) intents.push({ type: 'attack', amount: action.damage, icon: '⚔' });
  if (action.block) intents.push({ type: 'defend', amount: action.block, icon: '🛡' });
  if (action.heal) intents.push({ type: 'heal', amount: action.heal, icon: '💚' });
  if (action.summon) intents.push({ type: 'summon', amount: 0, icon: '📢' });
  if (action.statusEffects) {
    action.statusEffects.forEach(se => {
      if (se.type === 'poison') intents.push({ type: 'debuff', amount: se.stacks, icon: '☠' });
      else if (se.type === 'bleed') intents.push({ type: 'debuff', amount: se.stacks, icon: '🩸' });
      else if (se.type === 'doom') intents.push({ type: 'debuff', amount: se.stacks, icon: '💀' });
      else if (se.type === 'strength') intents.push({ type: 'buff', amount: se.stacks, icon: '💪' });
      else intents.push({ type: 'debuff', amount: se.stacks, icon: '💢' });
    });
  }

  return intents;
}
