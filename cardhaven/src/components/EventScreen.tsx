import React from 'react';
import { GameEvent } from '../types';

interface EventScreenProps {
  event: GameEvent;
  floor: number;
  health: number;
  maxHealth: number;
  shards: number;
  onChoice: (index: number) => void;
}

export default function EventScreen({ event, floor, health, maxHealth, shards, onChoice }: EventScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 z-50 animate-fade-in bg-bg-primary bg-opacity-95 backdrop-blur-lg absolute inset-0">
      
      {/* Event Icon */}
      <div className="text-8xl mb-8 animate-pulse-gold filter drop-shadow-[0_0_30px_rgba(197,160,89,0.3)]">
        {event.icon}
      </div>

      {/* Title */}
      <h2 className="text-4xl font-serif text-accent-gold tracking-widest mb-4 text-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
        {event.title}
      </h2>
      
      <p className="text-[10px] uppercase tracking-[0.4em] text-text-muted mb-8">Gallery Depth {floor}</p>

      {/* Description */}
      <div className="glass-panel p-8 max-w-lg mb-12 border-opacity-20">
        <p className="text-text-secondary text-center font-serif italic leading-relaxed text-lg">
          "{event.description}"
        </p>
      </div>

      {/* Stats reminder */}
      <div className="flex gap-6 mb-10">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent-red">🩸</span>
          <span className="font-mono text-text-primary">{health}/{maxHealth}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent-gold">💎</span>
          <span className="font-mono text-text-primary">{shards}</span>
        </div>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-4 w-full max-w-lg">
        {event.choices.map((choice, i) => (
          <button
            key={i}
            onClick={() => onChoice(i)}
            className="glass-panel p-5 border-opacity-10 hover:border-opacity-40 transition-all duration-300 text-left group cursor-pointer hover:scale-[1.02] hover:shadow-gold active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-accent-gold bg-opacity-10 border border-accent-gold border-opacity-30 flex items-center justify-center font-mono font-bold text-accent-gold text-sm flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-text-primary font-serif text-base group-hover:text-accent-gold transition-colors">
                {choice.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
