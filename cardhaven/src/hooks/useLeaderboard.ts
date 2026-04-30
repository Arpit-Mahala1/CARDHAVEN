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
    const localData = localStorage.getItem('cardhaven_leaderboard');
    const currentEntries = localData ? JSON.parse(localData) : [];
    const newEntries = [...currentEntries, entry].sort((a, b) => b.score - a.score).slice(0, 10);
    localStorage.setItem('cardhaven_leaderboard', JSON.stringify(newEntries));
    setEntries(newEntries);
  };

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return { entries, loading, submitScore, fetchEntries };
}
