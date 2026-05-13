import React from 'react';
import { Card as CardType } from '../types';
import { CARD_TYPE_COLORS, RARITY_COLORS } from '../utils/balanceData';

interface CardProps {
  card: CardType;
  index: number;
  selected: boolean;
  playable: boolean;
  onClick: () => void;
}

export default function Card({ card, selected, playable, onClick }: CardProps) {
  const getCardIcon = (type: string) => {
    switch (type) {
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'draw': return '📚';
      case 'utility': return '✨';
      case 'power': return '💫';
      default: return '🃏';
    }
  };

  const cardStyle = {
    '--card-glow': RARITY_COLORS[card.rarity] || RARITY_COLORS.common,
    borderColor: selected ? 'var(--color-accent-green)' : RARITY_COLORS[card.rarity],
  } as React.CSSProperties;

  return (
    <div
      onClick={onClick}
      style={cardStyle}
      className={`relative w-40 h-60 p-4 flex flex-col gap-2 cursor-pointer transition-all duration-500
        ${playable ? 'hover:scale-[1.03] hover:-translate-y-2' : 'opacity-40 cursor-not-allowed grayscale'}
        ${selected ? 'scale-105 shadow-gold-lg border-2 z-20 -translate-y-4' : 'shadow-card border border-white border-opacity-5'}
        bg-card overflow-hidden group
      `}
    >
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Rarity Glow */}
      {(card.rarity === 'rare' || card.rarity === 'legendary') && (
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none blur-xl animate-pulse"
          style={{ background: `radial-gradient(circle at center, ${RARITY_COLORS[card.rarity]}, transparent)` }} 
        />
      )}

      {/* Header: Name and Cost */}
      <div className="flex justify-between items-start z-10 relative">
        <h3 className="font-serif font-bold text-base leading-tight text-text-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {card.name}
        </h3>
        <div className="flex-shrink-0 w-7 h-7 rounded-sm rotate-45 border border-accent-gold border-opacity-40 bg-bg-primary flex items-center justify-center shadow-lg group-hover:border-opacity-100 transition-opacity">
          <span className="-rotate-45 font-mono font-bold text-xs text-accent-gold">{card.cost}</span>
        </div>
      </div>

      {/* Art Area (Atmospheric) */}
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-40 border-y border-white border-opacity-5 my-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
        <span className="text-4xl z-10 drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ color: CARD_TYPE_COLORS[card.cardType] }}>
          {getCardIcon(card.cardType)}
        </span>
      </div>

      {/* Description */}
      <div className="h-16 z-10 relative">
        <p className="text-xs text-text-secondary leading-relaxed italic font-serif opacity-90">
          {card.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-center pt-2 border-t border-white border-opacity-10 z-10 relative">
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold opacity-40 text-text-muted">
          {card.cardType}
        </span>
        <span className="text-[9px] uppercase tracking-widest font-bold" style={{ color: RARITY_COLORS[card.rarity] }}>
          {card.rarity}
        </span>
      </div>

      {/* Ink Bleed Border Simulation */}
      <div className="absolute inset-0 border border-black border-opacity-20 pointer-events-none" />
    </div>
  );
}
