import React, { useState } from 'react';
import { GameState } from '../types';
import Card from './Card';
import Enemy from './Enemy';
import { STATUS_EFFECTS } from '../utils/balanceData';

interface BattleScreenProps {
  gameState: GameState;
  onPlayCard: (cardIndex: number, targetX?: number, targetY?: number) => boolean;
  onEndTurn: () => void;
}

export default function BattleScreen({
  gameState,
  onPlayCard,
  onEndTurn,
}: BattleScreenProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (!gameState.isPlayerTurn) return;
    if (selectedCard === index) {
      setSelectedCard(null);
    } else {
      setSelectedCard(index);
    }
  };

  const handleGridCellClick = (x: number, y: number) => {
    if (selectedCard === null) return;
    const card = gameState.hand[selectedCard];
    
    // Play card targeting this cell
    const success = onPlayCard(selectedCard, x, y);
    if (success) {
      setSelectedCard(null);
    }
  };

  // Auto-play cards that don't need a specific cell target
  const handleCardPlayableClick = (index: number) => {
    if (selectedCard === index) {
      const card = gameState.hand[index];
      if (card.targetType === 'none') {
        const success = onPlayCard(index);
        if (success) setSelectedCard(null);
      }
    } else {
      handleCardClick(index);
    }
  };

  const healthPercent = Math.max(0, Math.min(100, (gameState.health / gameState.maxHealth) * 100));
  const energyPercent = Math.max(0, Math.min(100, (gameState.energy / gameState.maxEnergy) * 100));

  // Generate grid cells (4 columns, 5 rows)
  const gridCells = [];
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 4; x++) {
      const enemy = gameState.enemies.find(e => e.boardX === x && e.boardY === y && e.health > 0);
      gridCells.push(
        <div 
          key={`${x}-${y}`} 
          onClick={() => handleGridCellClick(x, y)}
          className={`w-full h-24 border border-white border-opacity-10 rounded-xl bg-black bg-opacity-20 flex items-center justify-center transition-colors
            ${selectedCard !== null ? 'hover:bg-white hover:bg-opacity-10 cursor-pointer border-opacity-30' : ''}
          `}
        >
          {enemy && (
            <Enemy
              enemy={enemy}
              selected={selectedCard !== null}
              onClick={() => {}} // Click handled by parent cell
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden animate-fade-in">
      {/* Background Particles (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] animate-shimmer" />

      <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 py-4 gap-8 h-full">
        
        {/* Left Side: Stats & Info */}
        <div className="flex flex-col gap-4 w-1/4 pt-8">
          <div className="glass-panel p-6 shadow-gold flex flex-col gap-6">
            {/* Class & Floor */}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-bold text-gold uppercase tracking-widest flex items-center gap-2">
                Floor {gameState.floor}
                {gameState.floor % 5 === 0 && <span className="animate-pulse">🔥</span>}
              </span>
              <span className="text-xl font-serif text-text-primary capitalize">
                {gameState.characterClass}
              </span>
            </div>

            {/* Health */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end text-sm">
                <span className="font-mono text-text-secondary flex items-center gap-2">
                  <span className="text-danger">❤️</span> HP
                </span>
                <span className="font-mono font-bold">{gameState.health}/{gameState.maxHealth}</span>
              </div>
              <div className="stat-bar-track h-4 bg-opacity-30">
                <div className={`stat-bar-fill health ${healthPercent > 50 ? 'high' : ''}`} style={{ width: `${healthPercent}%` }} />
              </div>
            </div>

            {/* Block */}
            <div className="flex justify-between items-center bg-accent-blue bg-opacity-20 p-2 rounded border border-accent-blue border-opacity-30">
              <span className="font-mono text-text-secondary flex items-center gap-2">
                🛡️ Block
              </span>
              <span className="font-mono font-bold text-accent-blue text-lg">{gameState.block}</span>
            </div>

            {/* Energy */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white border-opacity-10">
              <div className="flex justify-between items-end text-sm">
                <span className="font-mono text-text-secondary flex items-center gap-2">
                  <span className="text-gold">⚡</span> Energy
                </span>
                <span className="font-mono font-bold text-gold">{gameState.energy}/{gameState.maxEnergy}</span>
              </div>
              <div className="stat-bar-track h-4 bg-opacity-30">
                <div className="stat-bar-fill energy shadow-gold" style={{ width: `${energyPercent}%` }} />
              </div>
            </div>
            
            {/* End Turn */}
            <button 
              onClick={onEndTurn}
              disabled={!gameState.isPlayerTurn}
              className="btn-primary w-full py-4 mt-4 text-lg shadow-gold animate-pulse-gold hover:animate-none"
            >
              End Turn
            </button>
          </div>

          {/* Status Effects & Relics */}
          <div className="glass-panel p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Status Effects</span>
              <div className="flex gap-2 flex-wrap">
                {gameState.statusEffects.length === 0 && <span className="text-xs text-text-secondary italic">None</span>}
                {gameState.statusEffects.map((effect, i) => {
                  const data = STATUS_EFFECTS[effect.type];
                  return (
                    <div key={i} className="flex items-center gap-1 bg-bg-secondary px-2 py-1 rounded border border-white border-opacity-10 shadow-sm" title={data?.description.replace('{stacks}', effect.stacks.toString())}>
                      <span>{data?.icon}</span>
                      <span className="text-xs font-bold">{effect.stacks}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 border-t border-white border-opacity-10 pt-4">
              <span className="text-xs text-text-muted uppercase font-bold tracking-wider">Relics</span>
              <div className="flex gap-2 flex-wrap">
                {gameState.relics.length === 0 && <span className="text-xs text-text-secondary italic">None</span>}
                {gameState.relics.map((relic, i) => (
                  <div key={i} className="w-8 h-8 bg-gold bg-opacity-20 rounded border border-gold flex items-center justify-center text-sm shadow-md hover:bg-opacity-30 transition-colors cursor-help" title={relic.description}>
                    🏺
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Grid */}
        <div className="flex-1 flex justify-center items-center py-4 z-10 h-[60vh] max-h-[600px] mt-4">
          <div className="grid grid-cols-4 grid-rows-5 gap-3 w-full max-w-2xl h-full p-6 glass-panel-dark shadow-xl relative">
            
            {/* Defensive Line Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-danger bg-opacity-50 shadow-[0_0_15px_rgba(199,62,29,0.8)] z-0 rounded-b-xl" />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-[10px] text-danger font-mono font-bold tracking-widest opacity-50 z-0">
              DEFENSE LINE
            </div>

            {gridCells}
          </div>
        </div>
      </div>

      {/* Bottom: Hand & Deck Info */}
      <div className="absolute bottom-0 left-0 right-0 h-64 w-full flex items-end justify-center pb-8 z-20 pointer-events-none">
        
        {/* Draw Pile */}
        <div className="absolute left-8 bottom-8 flex flex-col items-center gap-2 pointer-events-auto">
          <div className="w-16 h-24 glass-panel-dark flex items-center justify-center border-opacity-20 shadow-md">
            <span className="text-2xl opacity-50">🎴</span>
          </div>
          <span className="text-xs font-mono text-text-secondary">{gameState.deck.length} Deck</span>
        </div>

        {/* Hand */}
        <div className="flex justify-center gap-[-20px] max-w-3xl animate-slide-up relative z-30 pointer-events-auto" style={{ perspective: '1000px' }}>
          {gameState.hand.map((card, i) => {
            const offset = i - (gameState.hand.length - 1) / 2;
            const rotation = offset * 4;
            const translateY = Math.abs(offset) * 5;
            
            return (
              <div 
                key={`${card.id}-${i}`} 
                className="transition-transform duration-300 -ml-4 first:ml-0"
                style={{ 
                  transform: selectedCard !== i ? `rotate(${rotation}deg) translateY(${translateY}px)` : 'none',
                  zIndex: selectedCard === i ? 50 : i
                }}
              >
                <Card
                  card={card}
                  index={i}
                  selected={selectedCard === i}
                  playable={gameState.energy >= card.cost && gameState.isPlayerTurn}
                  onClick={() => handleCardPlayableClick(i)}
                />
              </div>
            );
          })}
        </div>

        {/* Discard */}
        <div className="absolute right-8 bottom-8 flex flex-col items-center gap-2 pointer-events-auto">
          <div className="w-16 h-24 glass-panel-dark flex items-center justify-center border-opacity-20 opacity-70">
            <span className="text-2xl opacity-30">🗑️</span>
          </div>
          <span className="text-xs font-mono text-text-secondary">{gameState.discard.length} Discard</span>
        </div>
      </div>
    </div>
  );
}
