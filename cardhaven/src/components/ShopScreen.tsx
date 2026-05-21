import React, { useState } from 'react';
import { GameState, Card as CardType, Relic as RelicType } from '../types';
import Card from './Card';
import { RARITY_COLORS } from '../utils/balanceData';

interface ShopScreenProps {
  gameState: GameState;
  onBuyCard: (index: number, cost: number) => void;
  onBuyRelic: (index: number, cost: number) => void;
  onRemoveCard: (index: number, cost: number) => void;
  onLeave: () => void;
}

export default function ShopScreen({
  gameState,
  onBuyCard,
  onBuyRelic,
  onRemoveCard,
  onLeave
}: ShopScreenProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const shop = gameState.shopState;

  if (!shop) return null;

  const cardCosts = [50, 75, 125, 250]; // Based on rarity or just fixed? Let's use simple costs.
  const getCardCost = (rarity: string) => {
    let base = 25;
    switch(rarity) {
      case 'common': base = 25; break;
      case 'uncommon': base = 50; break;
      case 'rare': base = 100; break;
      case 'legendary': base = 200; break;
      default: base = 25;
    }
    
    if (gameState.modifiers?.some(m => m.id === 'thrifty')) {
      return Math.floor(base * 0.5);
    }
    return base;
  };

  const isThrifty = gameState.modifiers?.some(m => m.id === 'thrifty');
  const relicCost = isThrifty ? 50 : 100;
  const removalCost = isThrifty ? Math.floor(shop.removalCost * 0.5) : shop.removalCost;

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full bg-bg-primary p-8 animate-fade-in relative pb-32">
      {/* Merchant Title */}
      <div className="text-center mb-12">
        <span className="text-5xl mb-4 block">🕯️</span>
        <h2 className="text-4xl font-serif text-gold tracking-widest drop-shadow-gold">THE SILENT MERCHANT</h2>
        <p className="text-text-secondary mt-2 italic">"Soul Shards for survival... a fair trade, no?"</p>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-8 mb-12 glass-panel px-8 py-4 border-gold border-opacity-30">
        <div className="flex flex-col items-center">
          <span className="text-xs text-text-muted uppercase font-bold tracking-tighter">Your Wealth</span>
          <span className="text-2xl font-mono text-gold font-bold">💎 {gameState.shards}</span>
        </div>
      </div>

      <div className="flex flex-col gap-12 w-full max-w-6xl">
        {/* Cards Row */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm uppercase tracking-widest text-text-muted font-bold border-b border-white border-opacity-10 pb-2">Ancient Manuscripts</h3>
          <div className="flex justify-center gap-8">
            {shop.cards.map((card, i) => {
              const cost = getCardCost(card.rarity);
              const canAfford = gameState.shards >= cost;
              return (
                <div key={i} className="flex flex-col items-center gap-4 group">
                  <div className={`transition-transform duration-300 ${canAfford ? 'hover:scale-105' : 'opacity-60'}`}>
                    <Card card={card} index={i} selected={false} playable={false} onClick={() => {}} />
                  </div>
                  <button 
                    disabled={!canAfford}
                    onClick={() => onBuyCard(i, cost)}
                    className={`btn-secondary py-2 px-6 flex items-center gap-2 ${!canAfford ? 'opacity-50 cursor-not-allowed' : 'border-gold text-gold hover:bg-gold hover:text-bg-primary'}`}
                  >
                    <span>💎</span> {cost}
                  </button>
                </div>
              );
            })}
            {shop.cards.length === 0 && <span className="text-text-secondary italic p-12">Sold out.</span>}
          </div>
        </div>

        {/* Lower Row: Relics & Removal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Relics */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm uppercase tracking-widest text-text-muted font-bold border-b border-white border-opacity-10 pb-2">Sacred Relics</h3>
            <div className="flex gap-6">
              {shop.relics.map((relic, i) => {
                const cost = relicCost;
                const canAfford = gameState.shards >= cost;
                return (
                  <div key={i} className="flex items-center gap-6 glass-panel p-4 border-opacity-20 flex-1">
                    <div className="w-16 h-16 bg-gold bg-opacity-10 rounded border border-gold flex items-center justify-center text-3xl shadow-gold">🏺</div>
                    <div className="flex flex-col flex-1">
                      <span className="font-serif text-lg text-gold">{relic.name}</span>
                      <p className="text-xs text-text-secondary line-clamp-2 mb-2">{relic.description}</p>
                      <button 
                        disabled={!canAfford}
                        onClick={() => onBuyRelic(i, cost)}
                        className={`btn-secondary text-xs py-1 px-3 self-start ${!canAfford ? 'opacity-50' : 'border-gold text-gold hover:bg-gold hover:text-bg-primary'}`}
                      >
                        💎 {cost}
                      </button>
                    </div>
                  </div>
                );
              })}
              {shop.relics.length === 0 && <span className="text-text-secondary italic">Nothing left.</span>}
            </div>
          </div>

          {/* Card Removal */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm uppercase tracking-widest text-text-muted font-bold border-b border-white border-opacity-10 pb-2">Deck Purge</h3>
            <div className="glass-panel p-6 border-opacity-20 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="font-serif text-lg text-text-primary">Burn a Memory</span>
                <p className="text-xs text-text-secondary">Permanently remove a card from your deck.</p>
              </div>
              <button 
                onClick={() => setIsRemoving(true)}
                disabled={gameState.shards < removalCost}
                className="btn-secondary border-danger text-danger hover:bg-danger hover:text-white py-2 px-6"
              >
                💎 {removalCost}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center py-4 bg-bg-primary/95 backdrop-blur-md border-t border-white border-opacity-10">
        <button onClick={onLeave} className="btn-primary py-4 px-12 text-xl shadow-gold">
          CONTINUE TO HAVEN
        </button>
      </div>

      {/* Card Removal Overlay */}
      {isRemoving && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center p-12 overflow-y-auto backdrop-blur-md">
          <h2 className="text-3xl font-serif text-gold mb-8">WHICH MEMORY SHALL WE BURN?</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {gameState.deck.map((card, i) => (
              <div key={i} className="hover:scale-105 transition-transform cursor-pointer" onClick={() => {
                onRemoveCard(i, removalCost);
                setIsRemoving(false);
              }}>
                <Card card={card} index={i} selected={false} playable={false} onClick={() => {}} />
              </div>
            ))}
          </div>
          <button onClick={() => setIsRemoving(false)} className="btn-secondary px-8 py-3">CANCEL</button>
        </div>
      )}
    </div>
  );
}
