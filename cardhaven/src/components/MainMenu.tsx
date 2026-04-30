import React, { useState } from 'react';
import { User } from 'firebase/auth';

interface MainMenuProps {
  user: User | null;
  onStartGame: (characterClass: 'warrior' | 'mage' | 'rogue') => void;
  onLeaderboard: () => void;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export default function MainMenu({
  user,
  onStartGame,
  onLeaderboard,
  onLoginClick,
  onLogoutClick
}: MainMenuProps) {
  const [selectedClass, setSelectedClass] = useState<'warrior' | 'mage' | 'rogue'>('warrior');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden animate-fade-in">
      
      {/* Background Particles (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] animate-float" />

      {/* Auth Status Bar */}
      <div className="absolute top-4 right-6 flex items-center gap-4 z-20">
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gold font-mono">{user.displayName || user.email || 'Guest Player'}</span>
            {onLogoutClick && (
              <button onClick={onLogoutClick} className="text-xs text-text-secondary hover:text-white transition-colors">
                Disconnect
              </button>
            )}
          </div>
        ) : (
          onLoginClick && (
            <button onClick={onLoginClick} className="btn-secondary text-sm py-1.5 px-4">
              Sign In
            </button>
          )
        )}
      </div>

      {/* Hero Title */}
      <div className="text-center mb-12 z-10 relative">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-light to-[#8a7223] drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] tracking-wide">
          CARDHAVEN
        </h1>
        <p className="mt-4 text-xl text-text-secondary italic font-serif">
          Enter the Haven. Build your legend.
        </p>
      </div>

      {/* Class Selection */}
      <div className="z-10 flex flex-col items-center w-full max-w-4xl">
        <h3 className="text-sm uppercase tracking-[0.2em] text-text-muted mb-6 font-bold">Select Your Champion</h3>
        
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {/* Warrior */}
          <div 
            onClick={() => setSelectedClass('warrior')}
            className={`cursor-pointer transition-all duration-300 w-48 h-64 rounded-xl glass-panel flex flex-col items-center justify-center gap-4 border-2 
              ${selectedClass === 'warrior' ? 'border-gold shadow-gold scale-105 -translate-y-4' : 'border-white border-opacity-10 hover:border-opacity-30 hover:-translate-y-2'}`}
          >
            <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(199,62,29,0.5)]">⚔️</span>
            <div className="text-center">
              <h3 className="font-serif font-bold text-xl text-danger">Warrior</h3>
              <p className="text-xs text-text-secondary mt-2 px-4">High health, powerful strikes, strong blocking.</p>
            </div>
          </div>

          {/* Mage */}
          <div 
            onClick={() => setSelectedClass('mage')}
            className={`cursor-pointer transition-all duration-300 w-48 h-64 rounded-xl glass-panel flex flex-col items-center justify-center gap-4 border-2 
              ${selectedClass === 'mage' ? 'border-gold shadow-gold scale-105 -translate-y-4' : 'border-white border-opacity-10 hover:border-opacity-30 hover:-translate-y-2'}`}
          >
            <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(155,89,182,0.5)]">✨</span>
            <div className="text-center">
              <h3 className="font-serif font-bold text-xl text-accent-purple">Mage</h3>
              <p className="text-xs text-text-secondary mt-2 px-4">Card draw, status effects, and explosive spells.</p>
            </div>
          </div>

          {/* Rogue */}
          <div 
            onClick={() => setSelectedClass('rogue')}
            className={`cursor-pointer transition-all duration-300 w-48 h-64 rounded-xl glass-panel flex flex-col items-center justify-center gap-4 border-2 
              ${selectedClass === 'rogue' ? 'border-gold shadow-gold scale-105 -translate-y-4' : 'border-white border-opacity-10 hover:border-opacity-30 hover:-translate-y-2'}`}
          >
            <span className="text-5xl filter drop-shadow-[0_0_10px_rgba(107,157,122,0.5)]">🗡️</span>
            <div className="text-center">
              <h3 className="font-serif font-bold text-xl text-accent-green">Rogue</h3>
              <p className="text-xs text-text-secondary mt-2 px-4">Multi-hits, poison, and tactical maneuvers.</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
          <button 
            onClick={() => onStartGame(selectedClass)}
            className="btn-primary w-full text-lg py-4 shadow-gold animate-pulse-gold hover:animate-none"
          >
            Begin Run
          </button>
          
          <button 
            onClick={onLeaderboard}
            className="btn-secondary w-full"
          >
            Hall of Legends
          </button>
        </div>
      </div>
    </div>
  );
}
