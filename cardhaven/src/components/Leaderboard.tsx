import React from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

export default function Leaderboard() {
  const { entries, loading, error } = useLeaderboard(100);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 glass-panel border-danger text-danger">
        <p>Failed to load the Hall of Legends.</p>
        <p className="text-sm mt-2 opacity-80">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-serif text-gold drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">
          HALL OF LEGENDS
        </h2>
        <p className="text-text-secondary mt-2">The greatest runs recorded in the history of the Haven</p>
      </div>

      <div className="glass-panel overflow-hidden shadow-gold">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black bg-opacity-40 text-text-secondary text-sm uppercase tracking-wider font-mono">
                <th className="p-4 border-b border-white border-opacity-10 font-medium">Rank</th>
                <th className="p-4 border-b border-white border-opacity-10 font-medium">Legend</th>
                <th className="p-4 border-b border-white border-opacity-10 font-medium text-right">Score</th>
                <th className="p-4 border-b border-white border-opacity-10 font-medium text-center">Floor</th>
                <th className="p-4 border-b border-white border-opacity-10 font-medium text-center">Class</th>
                <th className="p-4 border-b border-white border-opacity-10 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-5">
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary italic">
                    The Hall is empty. Will you be the first to enter?
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => {
                  const isTop3 = index < 3;
                  const rankColor = index === 0 ? 'text-gold' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-[#cd7f32]' : 'text-text-secondary';
                  
                  return (
                    <tr 
                      key={entry.runId} 
                      className={`transition-colors hover:bg-white hover:bg-opacity-5 ${isTop3 ? 'bg-white bg-opacity-5' : ''}`}
                    >
                      <td className={`p-4 font-bold font-mono ${rankColor}`}>
                        #{index + 1}
                      </td>
                      <td className="p-4 font-bold text-text-primary">
                        {entry.playerName}
                      </td>
                      <td className="p-4 text-right font-mono text-gold font-bold">
                        {entry.score.toLocaleString()}
                      </td>
                      <td className="p-4 text-center font-mono">
                        {entry.floor}
                      </td>
                      <td className="p-4 text-center capitalize">
                        {entry.characterClass === 'warrior' && '⚔️ '}
                        {entry.characterClass === 'mage' && '✨ '}
                        {entry.characterClass === 'rogue' && '🗡️ '}
                        {entry.characterClass}
                      </td>
                      <td className="p-4 text-right text-sm text-text-secondary font-mono">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
