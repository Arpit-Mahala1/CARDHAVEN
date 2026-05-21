import React, { useState } from 'react';
import { GameState, LeaderboardEntry } from '../types';
import { useLeaderboard } from '../hooks/useLeaderboard';
// import { User } from 'firebase/auth';

interface GameOverScreenProps {
  gameState: GameState;
  user: any; // User type replaced with any
  onMainMenu: () => void;
}

export default function GameOverScreen({ gameState, user, onMainMenu }: GameOverScreenProps) {
  const { submitScore } = useLeaderboard();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isVictory = gameState.phase === 'victory';

  const handleSubmitScore = async () => {
    if (!user || submitted) return;
    setSubmitting(true);
    
    const entry: LeaderboardEntry = {
      runId: gameState.runId,
      playerId: user.uid,
      playerName: (user.displayName?.trim() || user.email?.split('@')[0] || 'Unknown Hero'),
      score: gameState.score,
      floor: gameState.floor,
      characterClass: gameState.characterClass,
      timestamp: Date.now(),
    };

    await submitScore(entry);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 z-50 animate-fade-in bg-bg-primary bg-opacity-95 backdrop-blur-lg absolute inset-0">
      
      <div className="text-center mb-12">
        <h2 className={`text-6xl font-serif drop-shadow-md mb-2 ${isVictory ? 'text-gold' : 'text-danger'}`}>
          {isVictory ? 'Victory' : 'Defeated'}
        </h2>
        <p className="text-text-secondary text-lg">
          {isVictory ? 'You cleared the floor.' : 'Your run has ended.'}
        </p>
      </div>

      <div className="glass-panel w-full max-w-md p-8 flex flex-col gap-6 mb-8 shadow-gold">
        <h3 className="text-xl font-bold text-center border-b border-white border-opacity-10 pb-4">Run Summary</h3>
        
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Class</span>
          <span className="font-bold capitalize">{gameState.characterClass}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Floors Cleared</span>
          <span className="font-bold font-mono">{gameState.floor - (isVictory ? 0 : 1)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-text-secondary">Cards Added</span>
          <span className="font-bold font-mono">{gameState.cardsAdded.length}</span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-white border-opacity-10">
          <span className="text-gold font-bold">Final Score</span>
          <span className="text-2xl text-gold font-bold font-mono">{gameState.score.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-md">
        {user ? (
          <button 
            onClick={handleSubmitScore}
            disabled={submitting || submitted}
            className={`btn-primary w-full py-3 ${submitted ? 'opacity-50' : ''}`}
          >
            {submitting ? 'Submitting score...' : submitted ? 'Score recorded' : 'Submit score'}
          </button>
        ) : (
          <p className="text-center text-text-secondary text-sm mb-2 italic">
            Sign in before starting a run to save your score on the leaderboard.
          </p>
        )}
        
        <button 
          onClick={onMainMenu}
          className="btn-secondary w-full py-3"
        >
          Back to menu
        </button>
      </div>

    </div>
  );
}
