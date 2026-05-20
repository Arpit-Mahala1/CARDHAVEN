const fs = require('fs');

// Fix cards.json
const cardsData = JSON.parse(fs.readFileSync('./src/data/cards.json', 'utf8'));

const updatedCards = cardsData.cards.map(c => {
  const cardType = c.type === 'skill' ? 'utility' : (c.type || 'attack');
  
  let effect = {};
  if (c.effects) {
    if (c.effects.damage) effect.damage = c.effects.damage;
    if (c.effects.damageAll) effect.damage = c.effects.damageAll; // Approximation
    if (c.effects.gainBlock) effect.block = c.effects.gainBlock;
    if (c.effects.draw) effect.draw = c.effects.draw;
    
    if (c.effects.applyStatus) {
      effect.statusEffects = c.effects.applyStatus.map(s => ({
        type: s.status,
        stacks: s.stacks || 1
      }));
    }
  }

  return {
    id: c.id,
    name: c.name,
    description: c.description,
    cost: c.cost,
    cardType: cardType,
    rarity: c.rarity,
    effect: effect,
    image: c.image
  };
});

fs.writeFileSync('./src/data/cards.json', JSON.stringify({ cards: updatedCards }, null, 2));

// Fix enemies.json
const enemiesData = JSON.parse(fs.readFileSync('./src/data/enemies.json', 'utf8'));
const enemiesList = enemiesData.enemies.enemies || enemiesData.enemies;

const updatedEnemies = enemiesList.map(e => {
  const actions = (e.abilities || []).map((a, i) => {
    let action = {
      id: `act_${i}`,
      name: a.name || 'Action',
    };
    if (a.type === 'damage' || a.amount) {
      action.damage = a.amount;
    }
    if (a.status) {
      action.statusEffects = [{ type: a.status, stacks: a.amount || 1 }];
    }
    if (a.type === 'summon' || a.script?.includes('summon')) {
      action.summon = 'e_shade'; // dummy
    }
    return action;
  });

  return {
    id: e.id,
    name: e.name,
    baseHealth: e.hp || 30,
    actions: actions,
    scalingFactor: 1.2,
    isBoss: e.isBoss || false,
    lore: e.description || "A terrifying foe."
  };
});

fs.writeFileSync('./src/data/enemies.json', JSON.stringify({ enemies: updatedEnemies }, null, 2));
console.log('Fixed cards.json and enemies.json');
