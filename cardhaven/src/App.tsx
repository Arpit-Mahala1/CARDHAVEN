import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGameState } from './hooks/useGameState';
import MainMenu from './components/MainMenu';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import { Screen } from './types';
import './styles/globals.css';

function App() {
  const { user, loading: authLoading, loginAnonymously, logout } = useAuth();
  const { 
    gameState, startNewRun, playCard, endTurn, 
    pickRewardCard, skipReward, 
    buyCard, buyRelic, removeCard, leaveShop 
  } = useGameState();
  const [screen, setScreen] = useState<Screen>('menu');

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-bg-primary">
        <div className="animate-pulse-gold p-8 border border-gold rounded-full shadow-gold">
          <span className="text-4xl">🎴</span>
        </div>
      </div>
    );
  }

  const handleStartGame = (characterClass: 'warrior' | 'mage' | 'rogue') => {
    // Generate an anonymous ID if not logged in so they can still play
    const playerId = user?.uid || `guest-${Date.now()}`;
    startNewRun(playerId, characterClass);
    setScreen('game');
  };

  return (
    <div className="app font-sans text-text-primary selection:bg-gold selection:text-bg-primary">
      {screen === 'menu' && (
        <MainMenu
          user={user}
          onStartGame={handleStartGame}
          onLeaderboard={() => setScreen('leaderboard')}
          onLoginClick={!user ? loginAnonymously : undefined}
          onLogoutClick={user ? logout : undefined}
        />
      )}
      
      {screen === 'game' && gameState && (
        <GamePage
          gameState={gameState}
          user={user}
          onPlayCard={playCard}
          onEndTurn={endTurn}
          onPickRewardCard={pickRewardCard}
          onSkipReward={skipReward}
          onBuyCard={buyCard}
          onBuyRelic={buyRelic}
          onRemoveCard={removeCard}
          onLeaveShop={leaveShop}
          onExit={() => setScreen('menu')}
          onMainMenu={() => setScreen('menu')}
        />
      )}
      
      {screen === 'leaderboard' && (
        <LeaderboardPage onBack={() => setScreen('menu')} />
      )}
    </div>
  );
}

export default App;
