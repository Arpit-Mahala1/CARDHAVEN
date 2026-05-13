import React from 'react';
import { GameState } from '../types';
import BattleScreen from '../components/BattleScreen';
import RewardScreen from '../components/RewardScreen';
import GameOverScreen from '../components/GameOverScreen';
import ShopScreen from '../components/ShopScreen';
import EventScreen from '../components/EventScreen';
import RestScreen from '../components/RestScreen';

interface GamePageProps {
  gameState: GameState;
  user: any;
  onPlayCard: (index: number, x?: number, y?: number) => boolean;
  onEndTurn: () => void;
  onPickRewardCard: (card: any) => void;
  onSkipReward: () => void;
  onBuyCard: (index: number, cost: number) => void;
  onBuyRelic: (index: number, cost: number) => void;
  onRemoveCard: (index: number, cost: number) => void;
  onLeaveShop: () => void;
  onExit: () => void;
  onMainMenu: () => void;
  onEventChoice: (index: number) => void;
  onRest: (choice: 'heal' | 'upgrade') => void;
}

export default function GamePage({
  gameState,
  user,
  onPlayCard,
  onEndTurn,
  onPickRewardCard,
  onSkipReward,
  onBuyCard,
  onBuyRelic,
  onRemoveCard,
  onLeaveShop,
  onExit,
  onMainMenu,
  onEventChoice,
  onRest,
}: GamePageProps) {
  
  return (
    <div className="w-full h-screen bg-bg-primary overflow-hidden relative">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary opacity-50 pointer-events-none z-0" />
      
      {/* Main Battle UI */}
      {(gameState.phase === 'battle' || gameState.phase === 'reward' || gameState.phase === 'gameover' || gameState.phase === 'victory') && (
        <BattleScreen 
          gameState={gameState}
          onPlayCard={onPlayCard}
          onEndTurn={onEndTurn}
          onExit={onExit}
        />
      )}

      {/* Overlays based on phase */}
      {gameState.phase === 'reward' && (
        <RewardScreen
          floor={gameState.floor}
          onPickCard={onPickRewardCard}
          onSkip={onSkipReward}
        />
      )}

      {gameState.phase === 'shop' && (
        <ShopScreen
          gameState={gameState}
          onBuyCard={onBuyCard}
          onBuyRelic={onBuyRelic}
          onRemoveCard={onRemoveCard}
          onLeave={onLeaveShop}
        />
      )}

      {gameState.phase === 'event' && gameState.currentEvent && (
        <EventScreen
          event={gameState.currentEvent}
          floor={gameState.floor}
          health={gameState.health}
          maxHealth={gameState.maxHealth}
          shards={gameState.shards}
          onChoice={onEventChoice}
        />
      )}

      {gameState.phase === 'rest' && (
        <RestScreen
          health={gameState.health}
          maxHealth={gameState.maxHealth}
          floor={gameState.floor}
          onRest={onRest}
        />
      )}

      {(gameState.phase === 'gameover' || gameState.phase === 'victory') && (
        <GameOverScreen
          gameState={gameState}
          user={user}
          onMainMenu={onMainMenu}
        />
      )}

    </div>
  );
}
