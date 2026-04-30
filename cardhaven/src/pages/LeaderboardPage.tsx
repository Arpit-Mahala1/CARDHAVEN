import React from 'react';
import Leaderboard from '../components/Leaderboard';

interface LeaderboardPageProps {
  onBack: () => void;
}

export default function LeaderboardPage({ onBack }: LeaderboardPageProps) {
  return (
    <div className="min-h-screen bg-bg-primary p-8 relative overflow-y-auto">
      
      {/* Background Particles (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] animate-float" />

      <button 
        onClick={onBack}
        className="btn-ghost absolute top-8 left-8 flex items-center gap-2 text-text-secondary hover:text-white"
      >
        <span>←</span> Return to Haven
      </button>

      <div className="pt-16 pb-12">
        <Leaderboard />
      </div>

    </div>
  );
}
