import React, { useState, useEffect } from 'react';
import { Card as CardType } from '../types';
import Card from './Card';
import cardsData from '../data/cards.json';

interface RewardScreenProps {
  onPickCard: (card: CardType) => void;
  onSkip: () => void;
  floor: number;
}

export default function RewardScreen({ onPickCard, onSkip, floor }: RewardScreenProps) {
  const [choices, setChoices] = useState<CardType[]>([]);

  useEffect(() => {
    // Generate 3 random cards for reward
    const allCards = (cardsData as { cards: CardType[] }).cards;
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    setChoices(shuffled.slice(0, 3));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 relative z-50 animate-fade-in bg-bg-primary bg-opacity-90 backdrop-blur-md absolute inset-0">
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-gold drop-shadow-md">VICTORY</h2>
        <p className="text-text-secondary mt-2">Floor {floor} Cleared. Choose your reward.</p>
      </div>

      <div className="flex justify-center gap-8 mb-16">
        {choices.map((card, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 150}ms` }}>
            <Card
              card={card}
              index={i}
              selected={false}
              playable={true}
              onClick={() => onPickCard(card)}
            />
          </div>
        ))}
      </div>

      <button 
        onClick={onSkip}
        className="btn-ghost px-8 py-3 border border-white border-opacity-20 hover:border-opacity-50"
      >
        Skip Reward
      </button>

    </div>
  );
}
