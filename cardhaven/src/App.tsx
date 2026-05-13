import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useGameState } from './hooks/useGameState';
import { useSettings } from './hooks/useSettings';
import MainMenu from './components/MainMenu';
import GamePage from './pages/GamePage';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsScreen from './components/SettingsScreen';
import TutorialSystem from './components/TutorialSystem';
import { Screen } from './types';
import './styles/globals.css';

function App() {
  const { user, loading: authLoading, loginAnonymously, logout } = useAuth();
  const { settings } = useSettings();
  const { 
    gameState, startNewRun, playCard, endTurn, 
    pickRewardCard, skipReward, 
    buyCard, buyRelic, removeCard, leaveShop,
    applyEventChoice, rest
  } = useGameState(settings.autoEndTurn);
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

  const handleStartGame = (characterClass: 'warrior' | 'mage' | 'rogue', seed?: string, modifiers?: any[]) => {
    localStorage.removeItem('cardhaven_run'); // Clear old run if starting fresh
    const playerId = user?.uid || `guest-${Date.now()}`;
    startNewRun(playerId, characterClass, seed, modifiers);
    setScreen('game');
  };

  return (
    <div className="app min-h-screen text-text-primary selection:bg-accent-gold selection:text-bg-primary overflow-hidden relative">
      <div className="vignette" />
      <div className="film-grain" />
      
      {screen === 'menu' && (
        <MainMenu
          user={user}
          onStartGame={handleStartGame}
          onResumeRun={() => setScreen('game')}
          onLeaderboard={() => setScreen('leaderboard')}
          onSettings={() => setScreen('settings')}
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
          onEventChoice={applyEventChoice}
          onRest={rest}
        />
      )}
      
      {screen === 'leaderboard' && (
        <LeaderboardPage onBack={() => setScreen('menu')} />
      )}

      {screen === 'settings' && (
        <SettingsScreen onBack={() => setScreen('menu')} />
      )}

      <TutorialSystem />
    </div>
  );
}

export default App;
