import { useMemo, useCallback } from 'react';
import { Card, EnemyTemplate } from '../types';
import cardsData from '../data/cards.json';
import enemiesData from '../data/enemies.json';

/**
 * Hook to provide game content (cards and enemies) and utility functions.
 * The JSON files are imported as static assets; this hook memoizes the parsed data
 * and supplies functions for rarity‑weighted random selection.
 */
export function useGameContent() {
  // Memoize raw arrays for performance; the JSON imports are objects with a "cards" / "enemies" key.
  const cards: Card[] = useMemo(() => (cardsData as unknown as { cards: Card[] }).cards, []);
  const enemies: EnemyTemplate[] = useMemo(() => (enemiesData as unknown as { enemies: EnemyTemplate[] }).enemies, []);

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
  const getRandomCard = useCallback((rng: () => number = Math.random): Card => {
    const rarity = pickRarity(rng);
    const pool = cards.filter((c) => c.rarity === rarity);
    if (pool.length === 0) return cards[Math.floor(rng() * cards.length)];
    return pool[Math.floor(rng() * pool.length)];
  }, [cards]);

  /** Returns a random enemy (simple uniform distribution). */
  const getRandomEnemy = useCallback((rng: () => number = Math.random): EnemyTemplate => {
    return enemies[Math.floor(rng() * enemies.length)];
  }, [enemies]);

  const getStarterDeck = useCallback((characterClass: string): Card[] => {
    const strike = cards.find(c => c.id === 'strike') || cards.find(c => c.id === 'c_strike') || cards[0];
    const defend = cards.find(c => c.id === 'defend') || cards.find(c => c.id === 'c_defend') || cards[1];
    
    let classBonusId = 'bash';
    if (characterClass === 'mage') classBonusId = 'poison_gas';
    if (characterClass === 'rogue') classBonusId = 'pummel';

    const classCard = cards.find(c => c.id === classBonusId) ?? (cards.find(c => c.rarity === 'common') || cards[2]);

    return [
      strike, strike, strike, strike,
      defend, defend, defend, defend,
      classCard, classCard,
    ];
  }, [cards]);

  return { cards, enemies, getRandomCard, getRandomEnemy, getStarterDeck };
}
