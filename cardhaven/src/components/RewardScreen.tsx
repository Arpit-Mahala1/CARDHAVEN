import React, { useState, useEffect } from 'react';
import { Card as CardType } from '../types';
import Card from './Card';
import { useGameContent } from '../hooks/useGameContent';

interface RewardScreenProps {
  onPickCard: (card: CardType) => void;
  onSkip: () => void;
  floor: number;
}

export default function RewardScreen({ onPickCard, onSkip, floor }: RewardScreenProps) {
  const [choices, setChoices] = useState<CardType[]>([]);
  const { getRandomCard } = useGameContent();

  useEffect(() => {
    // Generate 3 random cards for reward
    const newChoices: CardType[] = [];
    for (let i = 0; i < 3; i++) {
      newChoices.push(getRandomCard(Math.random));
    }
    setChoices(newChoices);
  }, [getRandomCard]);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999 }} className="flex flex-col items-center justify-center p-4 animate-fade-in bg-bg-primary bg-opacity-95 backdrop-blur-md">
      
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-gold drop-shadow-md">Victory</h2>
        <p className="text-text-secondary mt-2">Floor {floor} cleared. Choose your reward.</p>
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
        Skip
      </button>

    </div>
  );
}
