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
      case 'goblin': return '👹';
      case 'skeleton': return '💀';
      case 'witch': return '🧙‍♀️';
      case 'knight': return '⚔️';
      case 'demon': return '👿';
      default: return '👾';
    }
  };

  const healthPercent = Math.max(0, Math.min(100, (enemy.health / enemy.maxHealth) * 100));
  const isDead = enemy.health <= 0;

  return (
    <div
      onClick={!isDead ? onClick : undefined}
      className={`relative w-full h-full flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300
        ${isDead ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}
        ${selected ? 'shadow-enemy border border-danger scale-105' : 'glass-panel'}
        ${!isDead && 'cursor-pointer hover:shadow-enemy'}
      `}
    >
      {/* Enemy Portrait */}
      <div className="relative w-12 h-12 bg-bg-primary rounded-full flex items-center justify-center border border-white border-opacity-10 overflow-hidden shadow-inner mb-1">
        <span className="text-2xl filter drop-shadow-md">{getEnemyIcon(enemy.templateId)}</span>
      </div>

      {/* Enemy Info */}
      <div className="w-full text-center">
        {/* Health Bar */}
        <div className="flex flex-col gap-1 w-full px-1">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-mono font-bold text-danger">{enemy.health}/{enemy.maxHealth}</span>
          </div>
          <div className="stat-bar-track h-1.5">
            <div className="stat-bar-fill health" style={{ width: `${healthPercent}%` }} />
          </div>
        </div>

        {/* Block */}
        {enemy.block > 0 && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-accent-blue font-bold">
            🛡️ {enemy.block}
          </div>
        )}
      </div>

      {/* Intents */}
      {enemy.intents.length > 0 && !isDead && (
        <div className="absolute -top-2 -right-2 flex flex-col gap-1">
          {enemy.intents.filter(i => i.type === 'attack').map((intent, i) => (
            <div key={i} className="bg-bg-secondary border border-gold rounded-full px-1 py-0.5 flex items-center gap-0.5 shadow-lg text-[9px] font-bold animate-pulse-gold">
              <span>{intent.icon}</span>
              <span className="text-danger">
                {intent.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Status Effects */}
      {enemy.statusEffects.length > 0 && !isDead && (
        <div className="absolute -bottom-2 flex gap-1 justify-center w-full">
          {enemy.statusEffects.map((effect, i) => {
            const effectData = STATUS_EFFECTS[effect.type];
            return (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-bg-secondary border border-white border-opacity-20 flex items-center justify-center text-[8px] font-bold shadow-md relative"
                title={effectData?.description.replace('{stacks}', effect.stacks.toString())}
              >
                <span className="relative z-10">{effectData?.icon}</span>
                <span className="absolute -bottom-1 -right-1 text-[7px] bg-bg-primary rounded-full w-2.5 h-2.5 flex items-center justify-center border border-white border-opacity-20">
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
