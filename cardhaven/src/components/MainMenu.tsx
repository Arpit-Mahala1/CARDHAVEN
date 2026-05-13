import React, { useState } from 'react';
import { DailyModifier } from '../types';
import { getDailyRunData } from '../utils/dailyRun';

interface MainMenuProps {
  user: any;
  onStartGame: (characterClass: 'warrior' | 'mage' | 'rogue', seed?: string, modifiers?: DailyModifier[]) => void;
  onResumeRun: () => void;
  onLeaderboard: () => void;
  onSettings: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export default function MainMenu({
  user,
  onStartGame,
  onResumeRun,
  onLeaderboard,
  onSettings,
  onLoginClick,
  onLogoutClick
}: MainMenuProps) {
  const [selectedClass, setSelectedClass] = useState<'warrior' | 'mage' | 'rogue'>('warrior');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden animate-fade-in bg-black">
      
      {/* Auth Status Bar */}
      <div className="absolute top-6 right-8 flex items-center gap-6 z-20">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-accent-gold font-mono tracking-widest">{user.displayName || user.email || 'The Unnamed Soul'}</span>
            {onLogoutClick && (
              <button onClick={onLogoutClick} className="text-[10px] uppercase tracking-widest text-text-muted hover:text-accent-gold transition-colors">
                Depart
              </button>
            )}
          </div>
        ) : (
          onLoginClick && (
            <button onClick={onLoginClick} className="btn-secondary text-[10px] uppercase tracking-widest py-2 px-6">
              Enter Covenant
            </button>
          )
        )}
      </div>
      
      {/* Hero Title */}
      <div className="text-center mb-16 z-10 relative">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-text-primary tracking-[0.2em] opacity-90 drop-shadow-[0_10px_20px_rgba(0,0,0,1)]">
          CARDHAVEN
        </h1>
        <div className="h-px w-24 bg-accent-gold mx-auto mt-4 opacity-30" />
        <p className="mt-6 text-sm md:text-base text-text-secondary uppercase tracking-[0.4em] font-serif opacity-70">
          The Gloom-bound Gallery
        </p>
      </div>

      {/* Class Selection */}
      <div className="z-10 flex flex-col items-center w-full max-w-5xl">
        <h3 className="text-[10px] uppercase tracking-[0.5em] text-text-muted mb-10 font-bold opacity-60">Choose Your Vessel</h3>
        
        <div className="flex justify-center gap-8 mb-16 flex-wrap">
          {/* Warrior */}
          <div 
            onClick={() => setSelectedClass('warrior')}
            className={`cursor-pointer transition-all duration-500 w-52 h-72 rounded-sm glass-panel flex flex-col items-center justify-center gap-6 border 
              ${selectedClass === 'warrior' ? 'border-accent-gold shadow-gold-lg scale-105 -translate-y-4' : 'border-white border-opacity-5 hover:border-opacity-20 hover:-translate-y-2'}`}
          >
            <span className="text-5xl opacity-80 filter grayscale-[0.2]">🩸</span>
            <div className="text-center px-4">
              <h3 className="font-serif font-bold text-xl text-text-primary tracking-widest uppercase">The Sunderer</h3>
              <div className="h-px w-8 bg-accent-red mx-auto my-3 opacity-40" />
              <p className="text-[10px] text-text-secondary leading-relaxed font-serif italic">A brute forged in blood. Endures the coming dark with iron and resolve.</p>
            </div>
          </div>

          {/* Mage */}
          <div 
            onClick={() => setSelectedClass('mage')}
            className={`cursor-pointer transition-all duration-500 w-52 h-72 rounded-sm glass-panel flex flex-col items-center justify-center gap-6 border 
              ${selectedClass === 'mage' ? 'border-accent-gold shadow-gold-lg scale-105 -translate-y-4' : 'border-white border-opacity-5 hover:border-opacity-20 hover:-translate-y-2'}`}
          >
            <span className="text-5xl opacity-80 filter grayscale-[0.2]">👁️</span>
            <div className="text-center px-4">
              <h3 className="font-serif font-bold text-xl text-text-primary tracking-widest uppercase">The Archivist</h3>
              <div className="h-px w-8 bg-accent-purple mx-auto my-3 opacity-40" />
              <p className="text-[10px] text-text-secondary leading-relaxed font-serif italic">Seeks truths that bleed. Channels the void to rewrite the tapestry of fate.</p>
            </div>
          </div>

          {/* Rogue */}
          <div 
            onClick={() => setSelectedClass('rogue')}
            className={`cursor-pointer transition-all duration-500 w-52 h-72 rounded-sm glass-panel flex flex-col items-center justify-center gap-6 border 
              ${selectedClass === 'rogue' ? 'border-accent-gold shadow-gold-lg scale-105 -translate-y-4' : 'border-white border-opacity-5 hover:border-opacity-20 hover:-translate-y-2'}`}
          >
            <span className="text-5xl opacity-80 filter grayscale-[0.2]">🎭</span>
            <div className="text-center px-4">
              <h3 className="font-serif font-bold text-xl text-text-primary tracking-widest uppercase">The Shadow</h3>
              <div className="h-px w-8 bg-accent-blue mx-auto my-3 opacity-40" />
              <p className="text-[10px] text-text-secondary leading-relaxed font-serif italic">A whisper in the halls. Deals in venom and the silence between heartbeats.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-6 w-full max-w-xs">
          {localStorage.getItem('cardhaven_run') && (
            <button 
              onClick={onResumeRun}
              className="w-full bg-accent-gold text-black text-xs uppercase tracking-[0.3em] py-5 shadow-gold hover:tracking-[0.4em] transition-all mb-4"
            >
              Continue Descent
            </button>
          )}

          <button 
            onClick={() => onStartGame(selectedClass)}
            className="btn-primary w-full text-xs uppercase tracking-[0.3em] py-5 shadow-gold hover:tracking-[0.4em] transition-all"
          >
            New Threshold
          </button>

          <button 
            onClick={() => {
              const daily = getDailyRunData();
              onStartGame(selectedClass, daily.seed, daily.modifiers);
            }}
            className="w-full glass-panel border-accent-gold border-opacity-30 text-[10px] uppercase tracking-[0.3em] py-4 hover:bg-accent-gold hover:text-black transition-all"
          >
            Daily Descent
          </button>
          
          <button 
            onClick={onLeaderboard}
            className="text-[10px] uppercase tracking-[0.3em] text-text-muted hover:text-accent-gold transition-colors"
          >
            Tomb of Legends
          </button>
          
          <button 
            onClick={onSettings}
            className="text-[10px] uppercase tracking-[0.3em] text-text-muted hover:text-accent-gold transition-colors"
          >
            ⚙ Inscriptions
          </button>
        </div>
      </div>
    </div>
  );
}
