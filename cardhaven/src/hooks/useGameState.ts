import { useState, useCallback, useRef } from 'react';
import { GameState, Card } from '../types';
import { BattleEngine } from '../utils/battleEngine';
import { generateEnemyEncounter } from '../utils/enemyGenerator';
import cardsData from '../data/cards.json';
import { GAME_CONSTANTS } from '../utils/balanceData';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const engineRef = useRef<BattleEngine | null>(null);

  const startNewRun = useCallback((
    playerId: string,
    characterClass: 'warrior' | 'mage' | 'rogue'
  ) => {
    const runId = `run-${Date.now()}`;
    const starterDeck = getStarterDeck(characterClass);
    const shuffled = shuffleArray([...starterDeck]);

    const initialState: GameState = {
      playerId,
      runId,
      characterClass,
      hand: [],
      deck: shuffled,
      discard: [],
      exhausted: [],
      health: GAME_CONSTANTS.STARTING_HEALTH,
      maxHealth: GAME_CONSTANTS.STARTING_HEALTH,
      block: 0,
      energy: GAME_CONSTANTS.STARTING_ENERGY,
      maxEnergy: GAME_CONSTANTS.STARTING_ENERGY,
      floor: 1,
      shards: GAME_CONSTANTS.STARTING_SHARDS,
      statusEffects: [],
      relics: [],
      enemies: generateEnemyEncounter(1),
      isPlayerTurn: true,
      turnsPlayed: 0,
      roomsCleared: 0,
      cardsAdded: [],
      seed: Math.random().toString(36).slice(2),
      startTime: Date.now(),
      phase: 'battle',
      score: 0,
    };

    const engine = new BattleEngine(initialState);
    // Draw opening hand
    engine.drawCards(GAME_CONSTANTS.STARTING_HAND_SIZE);
    engineRef.current = engine;
    setGameState(engine.getState());
  }, []);

  const playCard = useCallback((cardIndex: number, targetX?: number, targetY?: number): boolean => {
    const engine = engineRef.current;
    if (!engine) return false;

    const success = engine.playCard(cardIndex, targetX, targetY);
    if (success) {
      const newState = engine.getState();
      setGameState(newState);

      // Check if battle is won
      if (engine.checkBattleEnd() === 'won') {
        engine.advanceToReward();
        setGameState(engine.getState());
      }
    }
    return success;
  }, []);

  const endTurn = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.endPlayerTurn();
    const newState = engine.getState();
    setGameState(newState);

    // Check battle end after enemy turn
    if (newState.phase !== 'gameover' && engine.checkBattleEnd() === 'won') {
      engine.advanceToReward();
      setGameState(engine.getState());
    }
  }, []);

  const pickRewardCard = useCallback((card: Card) => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.addCardToDeck(card);
    engine.advanceToNextFloor();
    setGameState(engine.getState());
  }, []);

  const skipReward = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.advanceToNextFloor();
    setGameState(engine.getState());
  }, []);

  const buyCard = useCallback((index: number, cost: number) => {
    const engine = engineRef.current;
    if (engine && engine.buyCard(index, cost)) {
      setGameState(engine.getState());
    }
  }, []);

  const buyRelic = useCallback((index: number, cost: number) => {
    const engine = engineRef.current;
    if (engine && engine.buyRelic(index, cost)) {
      setGameState(engine.getState());
    }
  }, []);

  const removeCard = useCallback((index: number, cost: number) => {
    const engine = engineRef.current;
    if (engine && engine.removeCardFromDeck(index, cost)) {
      setGameState(engine.getState());
    }
  }, []);

  const leaveShop = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.leaveShop();
      setGameState(engine.getState());
    }
  }, []);

  return {
    gameState,
    startNewRun,
    playCard,
    endTurn,
    pickRewardCard,
    skipReward,
    buyCard,
    buyRelic,
    removeCard,
    leaveShop,
  };
}

function getStarterDeck(characterClass: string): Card[] {
  const allCards = (cardsData as { cards: Card[] }).cards;
  const commons = allCards.filter(c => c.rarity === 'common');

  // Give 4x Strike + 4x Defend + 2 class-specific cards
  const strike = allCards.find(c => c.id === 'strike')!;
  const defend = allCards.find(c => c.id === 'defend')!;

  let classBonusId = 'bash';
  if (characterClass === 'mage') classBonusId = 'poison_gas';
  if (characterClass === 'rogue') classBonusId = 'pummel';

  const classCard = allCards.find(c => c.id === classBonusId) ?? commons[0];

  return [
    strike, strike, strike, strike,
    defend, defend, defend, defend,
    classCard, classCard,
  ];
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
