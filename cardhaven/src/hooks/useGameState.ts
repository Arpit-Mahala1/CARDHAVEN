import { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, Card, DailyModifier } from '../types';
import { BattleEngine } from '../utils/battleEngine';
import { generateEnemyEncounter } from '../utils/enemyGenerator';
import cardsData from '../data/cards.json';
import { GAME_CONSTANTS } from '../utils/balanceData';
import { useGameContent } from './useGameContent';

export function useGameState(autoEndTurn: boolean = false) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const engineRef = useRef<BattleEngine | null>(null);
  const { getStarterDeck } = useGameContent();

  const endTurn = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.endPlayerTurn();
    const newState = engine.getState();
    setGameState(newState);
    try { console.log('[useGameState] endTurn -> setGameState', newState.phase); } catch(e) {}

    if (newState.phase !== 'gameover' && engine.checkBattleEnd() === 'won') {
      engine.advanceToReward();
      setGameState(engine.getState());
    }
  }, []);

  const startNewRun = useCallback((
    playerId: string,
    characterClass: 'warrior' | 'mage' | 'rogue',
    seed: string = Math.random().toString(36).slice(2),
    modifiers: DailyModifier[] = []
  ) => {
    const runId = `run-${Date.now()}`;
    const starterDeck = getStarterDeck(characterClass);
    const shuffled = shuffleArray([...starterDeck]);

    let health: number = GAME_CONSTANTS.STARTING_HEALTH;
    let maxHealth: number = GAME_CONSTANTS.STARTING_HEALTH;

    if (modifiers.some(m => m.id === 'bleed_start')) {
      maxHealth = Math.round(maxHealth * 0.8);
      health = maxHealth;
    }

    const initialState: GameState = {
      playerId,
      runId,
      characterClass,
      hand: [],
      deck: shuffled,
      discard: [],
      exhausted: [],
      health,
      maxHealth,
      block: 0,
      energy: GAME_CONSTANTS.STARTING_ENERGY,
      maxEnergy: GAME_CONSTANTS.STARTING_ENERGY,
      floor: 1,
      shards: GAME_CONSTANTS.STARTING_SHARDS,
      statusEffects: [],
      relics: [],
      enemies: generateEnemyEncounter(1, seed, modifiers),
      isPlayerTurn: true,
      turnsPlayed: 0,
      roomsCleared: 0,
      cardsAdded: [],
      seed: seed,
      modifiers: modifiers,
      startTime: Date.now(),
      phase: 'battle',
      score: 0,
      enemiesKilled: 0,
      totalDamageDealt: 0,
      bossesDefeated: [],
    };

    const engine = new BattleEngine(initialState);
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
      try { console.log('[useGameState] playCard -> setGameState', newState.phase); } catch(e) {}

      if (engine.checkBattleEnd() === 'won') {
        engine.advanceToReward();
        setGameState(engine.getState());
        try { console.log('[useGameState] playCard -> forced advanceToReward -> setGameState', engine.getState().phase); } catch(e) {}
      }
    }
    return success;
  }, []);

  // Robust Auto End Turn Logic
  useEffect(() => {
    if (!autoEndTurn || !gameState || !gameState.isPlayerTurn || gameState.phase !== 'battle') return;

    const hasAliveEnemies = gameState.enemies.some(enemy => enemy.health > 0);
    const hasPlayableCards = gameState.hand.some(card => {
      if (card.cost > gameState.energy) return false;

      const targetType = card.targetType || 'none';
      if (targetType === 'none') return true;
      if (targetType === 'all') return hasAliveEnemies;
      return hasAliveEnemies;
    });

    if (!hasPlayableCards || gameState.energy <= 0) {
      const timer = setTimeout(() => {
        endTurn();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [gameState, autoEndTurn, endTurn]);

  const pickRewardCard = useCallback((card: Card) => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.addCardToDeck(card);
    engine.advanceToNextFloor();
    setGameState(engine.getState());
    try { console.log('[useGameState] pickRewardCard -> advanceToNextFloor -> setGameState', engine.getState().phase); } catch(e) {}
  }, []);

  const skipReward = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.advanceToNextFloor();
    setGameState(engine.getState());
    try { console.log('[useGameState] skipReward -> advanceToNextFloor -> setGameState', engine.getState().phase); } catch(e) {}
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

  const applyEventChoice = useCallback((choiceIndex: number) => {
    const engine = engineRef.current;
    if (engine) {
      engine.applyEventChoice(choiceIndex);
      setGameState(engine.getState());
    }
  }, []);

  const rest = useCallback((choice: 'heal' | 'upgrade') => {
    const engine = engineRef.current;
    if (engine) {
      engine.rest(choice);
      setGameState(engine.getState());
    }
  }, []);

  const abandonRun = useCallback(() => {
    localStorage.removeItem('cardhaven_run');
    setGameState(null);
    engineRef.current = null;
  }, []);

  // Persistence: Save
  useEffect(() => {
    if (gameState && gameState.phase !== 'gameover') {
      localStorage.setItem('cardhaven_run', JSON.stringify(gameState));
    } else if (gameState?.phase === 'gameover') {
      localStorage.removeItem('cardhaven_run');
    }
  }, [gameState]);

  // Persistence: Load
  useEffect(() => {
    const saved = localStorage.getItem('cardhaven_run');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const engine = new BattleEngine(parsed);
        engineRef.current = engine;
        setGameState(engine.getState());
      } catch (e) {
        console.error('Failed to load saved run', e);
      }
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
    applyEventChoice,
    rest,
    abandonRun,
  };
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
