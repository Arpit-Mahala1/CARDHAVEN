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
      className={`relative w-36 h-52 p-3 rounded-xl flex flex-col gap-2 cursor-pointer transition-all duration-300
        ${playable ? 'hover:animate-card-hover hover:z-10' : 'opacity-50 cursor-not-allowed grayscale-[50%]'}
        ${selected ? 'scale-105 shadow-gold-lg border-2 z-20 -translate-y-4' : 'shadow-card border border-opacity-30'}
        bg-gradient-to-br from-card-dark to-bg-secondary
      `}
    >
      {/* Background glow effect for rare/legendary */}
      {(card.rarity === 'rare' || card.rarity === 'legendary') && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--card-glow)] to-transparent opacity-10 rounded-xl pointer-events-none" />
      )}

      {/* Header: Name and Cost */}
      <div className="flex justify-between items-start z-10 relative">
        <h3 className="font-serif font-bold text-sm leading-tight pr-1 line-clamp-2 drop-shadow-md">
          {card.name}
        </h3>
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-gold to-gold-light text-bg-primary font-bold font-mono text-xs flex items-center justify-center shadow-md">
          {card.cost}
        </div>
      </div>

      {/* Art Area */}
      <div className="flex-1 flex items-center justify-center bg-black bg-opacity-30 rounded-lg border border-white border-opacity-10 my-1">
        <span className="text-3xl drop-shadow-md filter brightness-125" style={{ color: CARD_TYPE_COLORS[card.cardType] }}>
          {getCardIcon(card.cardType)}
        </span>
      </div>

      {/* Description */}
      <div className="h-14 overflow-y-auto scrollbar-hide">
        <p className="text-xs text-text-secondary leading-snug">
          {card.description}
        </p>
      </div>

      {/* Rarity */}
      <div className="text-[10px] uppercase font-bold tracking-wider text-center pt-1 border-t border-white border-opacity-10" style={{ color: RARITY_COLORS[card.rarity] }}>
        {card.rarity}
      </div>
    </div>
  );
}
