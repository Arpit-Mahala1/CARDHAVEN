import React, { useState } from 'react';
import { GameState } from '../types';
import Card from './Card';
import Enemy from './Enemy';
import { STATUS_EFFECTS } from '../utils/balanceData';
import { audioManager } from '../utils/audioManager';

interface BattleScreenProps {
  gameState: GameState;
  onPlayCard: (cardIndex: number, targetX?: number, targetY?: number) => boolean;
  onEndTurn: () => void;
  onExit: () => void;
}

export default function BattleScreen({
  gameState,
  onPlayCard,
  onEndTurn,
  onExit,
}: BattleScreenProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    if (!gameState.isPlayerTurn) return;
    audioManager.playSFX('click');
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
      audioManager.playSFX('card');
      setSelectedCard(null);
    }
  };

  // Auto-play cards that don't need a specific cell target
  const handleCardPlayableClick = (index: number) => {
    if (selectedCard === index) {
      const card = gameState.hand[index];
      if (card.targetType === 'none') {
        const success = onPlayCard(index);
        if (success) {
          audioManager.playSFX('card');
          setSelectedCard(null);
        }
      }
    } else {
      handleCardClick(index);
    }
  };

  const healthPercent = Math.max(0, Math.min(100, (gameState.health / gameState.maxHealth) * 100));
  const energyPercent = Math.max(0, Math.min(100, (gameState.energy / gameState.maxEnergy) * 100));

  // Generate grid cells (5 columns, 4 rows)
  const gridCells = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 5; x++) {
      const enemy = gameState.enemies.find(e => e.boardX === x && e.boardY === y && e.health > 0);
      gridCells.push(
        <div 
          key={`${x}-${y}`} 
          onClick={() => handleGridCellClick(x, y)}
          className={`w-full h-full min-h-[112px] border border-white border-opacity-8 rounded-xl bg-black bg-opacity-20 flex items-center justify-center transition-colors
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
    <div className="flex flex-col h-screen w-full relative overflow-hidden animate-fade-in bg-black">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-40 pointer-events-none" />
      
      {/* Exit Button */}
      <button 
        onClick={() => {
          if (window.confirm("Abandon this descent? All progress will be lost to the gloom.")) {
            onExit();
          }
        }}
        className="absolute top-6 left-8 z-50 p-2 glass-panel border-accent-red border-opacity-20 hover:border-opacity-60 text-text-muted hover:text-accent-red transition-all group flex items-center gap-3 bg-black bg-opacity-40"
        title="Abandon Run"
      >
        <span className="text-lg">🕯️</span>
        <span className="transition-opacity text-[9px] uppercase tracking-[0.3em] font-bold">Abandon</span>
      </button>

      {/* Main Content Area */}
      <div className="flex flex-1 w-full max-w-[1400px] mx-auto px-8 py-4 gap-8 overflow-hidden">
        
        {/* Left Side: Stats & Info (Scrollable if needed) */}
        <div className="flex flex-col gap-4 w-72 h-[78vh] overflow-y-auto no-scrollbar mt-16">
          <div className="glass-panel p-6 flex flex-col gap-6 border-opacity-10">
            {/* Class & Floor */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-accent-gold uppercase tracking-[0.4em] flex items-center gap-2 opacity-60">
                Gallery Depth {gameState.floor}
                {gameState.floor % 5 === 0 && <span className="animate-pulse">👁️</span>}
              </span>
              <h2 className="text-xl font-serif text-text-primary uppercase tracking-widest">
                {gameState.characterClass === 'warrior' ? 'The Sunderer' : gameState.characterClass === 'mage' ? 'The Archivist' : 'The Shadow'}
              </h2>
            </div>

            {/* Health */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end text-[9px] uppercase tracking-widest">
                <span className="text-text-secondary flex items-center gap-2">
                  <span className="text-accent-red">🩸</span> Vitality
                </span>
                <span className="font-mono font-bold text-text-primary">{gameState.health}/{gameState.maxHealth}</span>
              </div>
              <div className="stat-bar-track h-1.5 bg-black">
                <div className="stat-bar-fill health shadow-[0_0_10px_rgba(74,14,14,0.5)]" style={{ width: `${healthPercent}%` }} />
              </div>
            </div>

            {/* Block & Shards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 p-2 bg-black bg-opacity-40 border border-white border-opacity-5 rounded-sm">
                <span className="text-[8px] uppercase tracking-widest text-text-muted">Bulwark</span>
                <span className="font-serif font-bold text-accent-blue text-lg">{gameState.block}</span>
              </div>
              <div className="flex flex-col gap-1 p-2 bg-black bg-opacity-40 border border-white border-opacity-5 rounded-sm">
                <span className="text-[8px] uppercase tracking-widest text-text-muted">Essence</span>
                <span className="font-serif font-bold text-accent-gold text-lg">{gameState.shards}</span>
              </div>
            </div>

            {/* Energy */}
            <div className="flex flex-col gap-2 pt-4 border-t border-white border-opacity-5">
              <div className="flex justify-between items-end text-[9px] uppercase tracking-widest">
                <span className="text-text-secondary flex items-center gap-2">
                  <span className="text-accent-gold">🌑</span> Will
                </span>
                <span className="font-mono font-bold text-accent-gold">{gameState.energy}/{gameState.maxEnergy}</span>
              </div>
              <div className="stat-bar-track h-1.5 bg-black">
                <div className="stat-bar-fill energy shadow-[0_0_10px_rgba(197,160,89,0.3)]" style={{ width: `${energyPercent}%` }} />
              </div>
            </div>
            
            {/* End Turn */}
            <button 
              onClick={() => {
                audioManager.playSFX('click');
                onEndTurn();
              }}
              disabled={!gameState.isPlayerTurn}
              className="btn-primary w-full py-4 mt-2 text-[9px] uppercase tracking-[0.3em] group hover:tracking-[0.4em]"
            >
              Cede Turn
            </button>
          </div>

          {/* Status Effects & Relics */}
          <div className="glass-panel p-5 flex flex-col gap-5 border-opacity-10">
            <div className="flex flex-col gap-2">
              <span className="text-[8px] text-text-muted uppercase font-bold tracking-[0.3em] opacity-60">Afflictions</span>
              <div className="flex gap-2 flex-wrap">
                {gameState.statusEffects.length === 0 && <span className="text-[9px] text-text-muted italic font-serif">Untouched</span>}
                {gameState.statusEffects.map((effect, i) => {
                  const data = STATUS_EFFECTS[effect.type];
                  return (
                    <div key={i} className="flex items-center gap-1.5 bg-black bg-opacity-40 px-2 py-0.5 border border-white border-opacity-5" title={data?.description.replace('{stacks}', effect.stacks.toString())}>
                      <span className="text-xs">{data?.icon}</span>
                      <span className="text-[9px] font-bold text-text-primary">{effect.stacks}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex flex-col gap-2 border-t border-white border-opacity-5 pt-4">
              <span className="text-[8px] text-text-muted uppercase font-bold tracking-[0.3em] opacity-60">Curios</span>
              <div className="flex gap-2 flex-wrap">
                {gameState.relics.length === 0 && <span className="text-[9px] text-text-muted italic font-serif">Barren</span>}
                {gameState.relics.map((relic, i) => (
                  <div key={i} className="w-8 h-8 bg-black bg-opacity-40 border border-accent-gold border-opacity-10 flex items-center justify-center text-base hover:border-opacity-40 transition-colors cursor-help shadow-inner" title={relic.description}>
                    💀
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center: The Grid */}
        <div className="flex-1 flex justify-center items-center py-2 z-10 min-h-0">
          <div className="grid grid-cols-5 grid-rows-4 gap-4 w-full h-[72vh] p-8 glass-panel-dark shadow-2xl relative border-opacity-5">
            {/* Defensive Line Indicator */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-accent-red bg-opacity-20 shadow-[0_-10px_30px_rgba(74,14,14,0.4)] z-0" />
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-[8px] text-accent-red font-serif font-bold tracking-[0.6em] opacity-40 z-0 whitespace-nowrap">
              THE THRESHOLD
            </div>

            {gridCells}
          </div>
        </div>

      </div>

      {/* Bottom: Hand & Deck Info (Non-absolute for layout stability) */}
      <div className="h-64 w-full flex items-end justify-center pb-8 z-20 relative bg-gradient-to-t from-black to-transparent">
        
        {/* Draw Pile */}
        <div className="absolute left-12 bottom-8 flex flex-col items-center gap-2">
          <div className="w-14 h-20 glass-panel-dark flex items-center justify-center border-opacity-20 shadow-md">
            <span className="text-xl opacity-50">🎴</span>
          </div>
          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">{gameState.deck.length} Deck</span>
        </div>

        {/* Hand */}
        <div className="flex justify-center gap-[-30px] max-w-4xl relative z-30 mb-2" style={{ perspective: '1000px' }}>
          {gameState.hand.map((card, i) => {
            const offset = i - (gameState.hand.length - 1) / 2;
            const rotation = offset * 4;
            const translateY = Math.abs(offset) * 8;
            
            return (
              <div 
                key={`${card.id}-${i}`} 
                className="transition-transform duration-300 -ml-12 first:ml-0 cursor-pointer"
                style={{ 
                  transform: selectedCard !== i ? `rotate(${rotation}deg) translateY(${translateY}px)` : 'translateY(-40px) scale(1.1)',
                  zIndex: selectedCard === i ? 100 : i
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
        <div className="absolute right-12 bottom-8 flex flex-col items-center gap-2">
          <div className="w-14 h-20 glass-panel-dark flex items-center justify-center border-opacity-20 opacity-70">
            <span className="text-xl opacity-30">🗑️</span>
          </div>
          <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">{gameState.discard.length} Discard</span>
        </div>
      </div>
    </div>
  );
}
