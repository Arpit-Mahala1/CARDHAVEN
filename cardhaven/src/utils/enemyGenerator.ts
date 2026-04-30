import { Enemy, EnemyTemplate, Intent } from '../types';
import enemyData from '../data/enemies.json';

export function generateEnemyEncounter(floor: number): Enemy[] {
  const templates = (enemyData as { enemies: EnemyTemplate[] }).enemies;

  // More enemies on higher floors
  let count = 1;
  if (floor >= 5) count = 2;
  if (floor >= 15) count = 3;

  // Pick enemies appropriate to floor
  const availableTemplates = templates.filter((_, i) => {
    if (floor < 5) return i < 2; // goblin, skeleton only
    if (floor < 10) return i < 4; // + witch, knight
    return true; // all including demon
  });

  const enemies: Enemy[] = [];
  const columns = [0, 1, 2, 3].sort(() => 0.5 - Math.random()); // Shuffle 4 columns

  for (let i = 0; i < count; i++) {
    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    const boardX = columns[i];
    enemies.push(createEnemyInstance(template, floor, i, boardX, 0));
  }

  return enemies;
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
  };
}

function generateInitialIntents(template: EnemyTemplate, actionIndex: number): Intent[] {
  const action = template.actions[actionIndex % template.actions.length];
  const intents: Intent[] = [];

  if (action.damage) intents.push({ type: 'attack', amount: action.damage, icon: '⚔' });
  if (action.block) intents.push({ type: 'defend', amount: action.block, icon: '🛡' });
  if (action.statusEffects) {
    action.statusEffects.forEach(se => {
      if (se.type === 'poison') intents.push({ type: 'debuff', amount: se.stacks, icon: '☠' });
      else intents.push({ type: 'debuff', amount: se.stacks, icon: '💢' });
    });
  }

  return intents;
}
