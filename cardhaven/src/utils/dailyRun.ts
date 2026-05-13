import { Card, DailyModifier } from '../types';

export interface DailyRunData {
  seed: string;
  date: string;
  modifiers: DailyModifier[];
}

const MODIFIERS: DailyModifier[] = [
  { id: 'bleed_start', name: 'Bleeding Edge', description: 'All enemies start with 2 Bleed, but you start with 20% less Max HP.' },
  { id: 'glass_cannon', name: 'Glass Cannon', description: 'Deal 50% more damage, but take 50% more damage.' },
  { id: 'thrifty', name: 'Thrifty', description: 'Everything in the shop costs 50% less.' },
  { id: 'eldritch_curse', name: 'Eldritch Curse', description: 'Start the run with a random Eldritch card, but 1 random status effect every turn.' },
];

export function getDailyRunData(): DailyRunData {
  const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const seed = hashString(date);
  
  // Pick 2 modifiers based on the seed
  const mod1 = MODIFIERS[parseInt(seed.slice(0, 2), 16) % MODIFIERS.length];
  const mod2 = MODIFIERS[parseInt(seed.slice(2, 4), 16) % MODIFIERS.length];
  
  return {
    seed,
    date,
    modifiers: mod1.id === mod2.id ? [mod1] : [mod1, mod2]
  };
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16);
}
