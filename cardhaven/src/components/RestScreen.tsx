import React from 'react';

interface RestScreenProps {
  health: number;
  maxHealth: number;
  floor: number;
  onRest: (choice: 'heal' | 'upgrade') => void;
}

export default function RestScreen({ health, maxHealth, floor, onRest }: RestScreenProps) {
  const healAmount = Math.floor(maxHealth * 0.25);
  const healthAfterHeal = Math.min(health + healAmount, maxHealth);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 z-50 animate-fade-in bg-bg-primary bg-opacity-95 backdrop-blur-lg absolute inset-0">
      
      {/* Campfire */}
      <div className="text-8xl mb-6 animate-pulse filter drop-shadow-[0_0_40px_rgba(197,100,30,0.4)]">
        🔥
      </div>

      <h2 className="text-4xl font-serif text-accent-gold tracking-widest mb-2 text-center">
        REST SITE
      </h2>
      <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted mb-4">Gallery Depth {floor}</p>
      <p className="text-text-secondary font-serif italic mb-12 text-center max-w-md">
        The darkness recedes momentarily. A flickering flame offers brief respite from the gallery's hunger.
      </p>

      {/* Health display */}
      <div className="glass-panel px-8 py-4 mb-12 flex items-center gap-4 border-opacity-20">
        <span className="text-accent-red text-xl">🩸</span>
        <div className="flex flex-col">
          <span className="text-[9px] uppercase tracking-widest text-text-muted">Vitality</span>
          <span className="font-mono font-bold text-text-primary text-lg">{health} / {maxHealth}</span>
        </div>
      </div>

      {/* Choices */}
      <div className="flex gap-8">
        {/* Heal */}
        <button
          onClick={() => onRest('heal')}
          className="glass-panel p-8 w-64 flex flex-col items-center gap-4 border-opacity-10 hover:border-opacity-40 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-gold group"
        >
          <span className="text-5xl group-hover:scale-110 transition-transform">💚</span>
          <h3 className="font-serif text-xl text-text-primary tracking-widest uppercase">Rest</h3>
          <div className="h-px w-12 bg-accent-gold opacity-20" />
          <p className="text-xs text-text-secondary text-center font-serif italic">
            Heal <span className="text-accent-gold font-bold">{healAmount} HP</span>
            <br />
            <span className="text-text-muted">({health} → {healthAfterHeal})</span>
          </p>
        </button>

        {/* Meditate (Upgrade) */}
        <button
          onClick={() => onRest('upgrade')}
          className="glass-panel p-8 w-64 flex flex-col items-center gap-4 border-opacity-10 hover:border-opacity-40 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-gold group"
        >
          <span className="text-5xl group-hover:scale-110 transition-transform">🕯️</span>
          <h3 className="font-serif text-xl text-text-primary tracking-widest uppercase">Meditate</h3>
          <div className="h-px w-12 bg-accent-gold opacity-20" />
          <p className="text-xs text-text-secondary text-center font-serif italic">
            Gain <span className="text-accent-gold font-bold">1 Strength</span>
            <br />
            <span className="text-text-muted">Heal 5 HP</span>
          </p>
        </button>
      </div>
    </div>
  );
}
