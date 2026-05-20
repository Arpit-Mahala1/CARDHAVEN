const fs = require('fs');

const originalScript = fs.readFileSync('scripts/generate_data.js', 'utf8');

// The original script has constants 'cards' and 'enemies' defined. We will evaluate it without writing.
// We remove all fs.writeFileSync lines from the original script
const modifiedScript = originalScript.replace(/fs\.writeFileSync[^;]+;/g, '');

eval(modifiedScript);

// Now 'cards' and 'enemies' are available.
const existingCards = JSON.parse(fs.readFileSync('./src/data/cards.json', 'utf8')).cards;
const existingCardIds = new Set(existingCards.map(c => c.id));
const newCards = [...existingCards, ...cards.filter(c => !existingCardIds.has(c.id))];

const existingEnemies = JSON.parse(fs.readFileSync('./src/data/enemies.json', 'utf8')).enemies;
const existingEnemyIds = new Set(existingEnemies.map(e => e.id));
const newEnemies = [...existingEnemies, ...enemies.filter(e => !existingEnemyIds.has(e.id))];

fs.writeFileSync('./src/data/cards.json', JSON.stringify({ cards: newCards }, null, 2));
fs.writeFileSync('./src/data/enemies.json', JSON.stringify({ enemies: newEnemies }, null, 2));

console.log(`Added ${newCards.length - existingCards.length} new cards.`);
console.log(`Added ${newEnemies.length - existingEnemies.length} new enemies.`);
