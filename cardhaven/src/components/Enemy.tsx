import React from 'react';
import { Enemy as EnemyType } from '../types';
import { STATUS_EFFECTS } from '../utils/balanceData';

interface EnemyProps {
  enemy: EnemyType;
  selected: boolean;
  onClick: () => void;
}

export default function Enemy({ enemy, selected, onClick }: EnemyProps) {
  const getEnemyIcon = (id: string) => {
    switch (id) {
      case 'goblin': return '🌑';
      case 'skeleton': return '💀';
      case 'skeleton_weaver': return '🕷️';
      case 'witch': return '🧙';
      case 'knight': return '⚔️';
      case 'demon': return '👹';
      case 'whisperer': return '👁️';
      case 'ink_wraith': return '🖤';
      case 'hollow_priest': return '⛪';
      case 'crawling_horror': return '🐙';
      case 'gallery_phantom': return '👻';
      case 'ink_stained_eye': return '🔮';
      default: return '🌑';
    }
  };

  const healthPercent = Math.max(0, Math.min(100, (enemy.health / enemy.maxHealth) * 100));
  const isDead = enemy.health <= 0;

  return (
    <div
      onClick={!isDead ? onClick : undefined}
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 transition-all duration-700
        ${isDead ? 'opacity-0 scale-50 rotate-12 pointer-events-none' : 'opacity-100'}
        ${selected ? 'filter drop-shadow-[0_0_15px_rgba(197,160,89,0.3)]' : ''}
        ${!isDead && 'cursor-pointer group'}
      `}
    >
      {/* Enemy Portrait (Ink Blot Style) */}
      <div className="relative w-16 h-16 flex items-center justify-center mb-2">
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full blur-xl scale-75 group-hover:scale-90 transition-transform" />
        <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] z-10 animate-float opacity-80 group-hover:opacity-100 transition-opacity">
          {getEnemyIcon(enemy.templateId)}
        </span>
      </div>

      {/* Enemy Info */}
      <div className="w-full text-center z-10">
        {/* Health Bar */}
        <div className="flex flex-col gap-1 w-full px-2">
          <div className="stat-bar-track h-1 bg-black bg-opacity-60 overflow-hidden rounded-none border-x border-white border-opacity-5">
            <div 
              className="stat-bar-fill health shadow-[0_0_8px_rgba(74,14,14,0.6)]" 
              style={{ 
                width: `${healthPercent}%`,
                background: 'linear-gradient(90deg, #4a0e0e, #6a1e1e)' 
              }} 
            />
          </div>
          <span className="text-[8px] font-mono font-bold text-text-muted opacity-60 tracking-widest">{enemy.health}/{enemy.maxHealth}</span>
        </div>

        {/* Block */}
        {enemy.block > 0 && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-accent-blue font-bold tracking-widest animate-pulse">
            🛡️ {enemy.block}
          </div>
        )}
      </div>

      {/* Intents */}
      {enemy.intents.length > 0 && !isDead && (
        <div className="absolute -top-1 -right-1 flex flex-col gap-1 z-20">
          {enemy.intents.map((intent, i) => (
            <div key={i} className="bg-bg-primary border border-white border-opacity-10 rounded-sm p-1 flex items-center gap-1 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
              <span className="text-xs">{intent.icon}</span>
              {intent.amount > 0 && (
                <span className={`text-[8px] font-bold ${intent.type === 'attack' ? 'text-accent-red' : 'text-accent-gold'}`}>
                  {intent.amount}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Status Effects */}
      {enemy.statusEffects.length > 0 && !isDead && (
        <div className="absolute -bottom-1 flex gap-1 justify-center w-full z-20">
          {enemy.statusEffects.map((effect, i) => {
            const effectData = STATUS_EFFECTS[effect.type];
            return (
              <div
                key={i}
                className="w-5 h-5 bg-bg-primary border border-white border-opacity-5 flex items-center justify-center text-[9px] font-bold shadow-xl relative group/effect"
                title={effectData?.description.replace('{stacks}', effect.stacks.toString())}
              >
                <span className="relative z-10 opacity-80">{effectData?.icon}</span>
                <span className="absolute -top-1 -right-1 text-[7px] bg-accent-gold text-bg-primary font-bold px-0.5 rounded-sm min-w-[10px] text-center">
                  {effect.stacks}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
