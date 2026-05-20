import { useMemo } from 'react';
import { Card, Enemy } from '../types';
import cardsData from '../data/cards.json';
import enemiesData from '../data/enemies.json';

/**
 * Hook to provide game content (cards and enemies) and utility functions.
 * The JSON files are imported as static assets; this hook memoizes the parsed data
 * and supplies functions for rarity‑weighted random selection.
 */
export function useGameContent() {
  // Memoize raw arrays for performance; the JSON imports are objects with a "cards" / "enemies" key.
  const cards: Card[] = useMemo(() => (cardsData as { cards: Card[] }).cards, []);
  const enemies: Enemy[] = useMemo(() => (enemiesData as { enemies: Enemy[] }).enemies, []);

  // Define rarity weights (must sum to 1). Adjust as needed.
  const rarityWeights: Record<Card['rarity'], number> = {
    common: 0.6,
    uncommon: 0.25,
    rare: 0.1,
    legendary: 0.05,
  };

  /** Helper: pick a rarity based on cumulative distribution */
  const pickRarity = (rng: () => number): Card['rarity'] => {
    const roll = rng();
    let cumulative = 0;
    for (const [rarity, weight] of Object.entries(rarityWeights) as [Card['rarity'], number][]) {
      cumulative += weight;
      if (roll <= cumulative) return rarity;
    }
    // Fallback – should never happen if weights sum to 1
    return 'common';
  };

  /** Returns a random card, respecting rarity weights. */
  const getRandomCard = (rng: () => number = Math.random): Card => {
    const rarity = pickRarity(rng);
    const pool = cards.filter((c) => c.rarity === rarity);
    if (pool.length === 0) return cards[Math.floor(rng() * cards.length)];
    return pool[Math.floor(rng() * pool.length)];
  };

  /** Returns a random enemy (simple uniform distribution). */
  const getRandomEnemy = (rng: () => number = Math.random): Enemy => {
    return enemies[Math.floor(rng() * enemies.length)];
  };

  const getStarterDeck = (characterClass: string): Card[] => {
    // For now, just grab a basic set of cards
    const attacks = cards.filter(c => c.cardType === 'attack').slice(0, 4);
    const defends = cards.filter(c => c.cardType === 'defense').slice(0, 4);
    const extras = cards.slice(0, 2);
    
    // Fallback if not enough cards are loaded
    if (attacks.length < 4 || defends.length < 4) {
      return [...cards.slice(0, 10)];
    }
    
    return [...attacks, ...defends, ...extras];
  };

  return {
    cards,
    enemies,
    getRandomCard,
    getStarterDeck
  };
}
