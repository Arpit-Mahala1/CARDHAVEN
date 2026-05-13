import { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry } from '../types';

export function useLeaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const localData = localStorage.getItem('cardhaven_leaderboard');
    if (localData) {
      setEntries(JSON.parse(localData));
    }
    setLoading(false);
  }, []);

  const submitScore = async (entry: LeaderboardEntry) => {
    // Sanitize incoming entry to avoid blank names or non-numeric scores
    const sanitized: LeaderboardEntry = {
      ...entry,
      playerName: (entry.playerName || '').toString().trim() || 'Unknown Hero',
      score: Number(entry.score) || 0,
    };

    const localData = localStorage.getItem('cardhaven_leaderboard');
    const currentEntries = localData ? JSON.parse(localData) : [];
    const newEntries = [...currentEntries, sanitized].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('cardhaven_leaderboard', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, submitScore, fetchEntries };
}
