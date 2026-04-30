import React from 'react';
import { GameState } from '../types';
import BattleScreen from '../components/BattleScreen';
import RewardScreen from '../components/RewardScreen';
import GameOverScreen from '../components/GameOverScreen';
import { User } from 'firebase/auth';

interface GamePageProps {
  gameState: GameState;
  user: User | null;
  onPlayCard: (index: number, x?: number, y?: number) => boolean;
  onEndTurn: () => void;
  onPickRewardCard: (card: any) => void;
  onSkipReward: () => void;
  onMainMenu: () => void;
}

export default function GamePage({
  gameState,
  user,
  onPlayCard,
  onEndTurn,
  onPickRewardCard,
  onSkipReward,
  onMainMenu,
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
