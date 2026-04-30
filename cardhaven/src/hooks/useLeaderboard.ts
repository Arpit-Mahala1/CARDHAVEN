import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';
import { firestore } from '../firebase';

export function useLeaderboard(limitCount = 100) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }

    setLoading(true);

    (async () => {
      try {
        const { collection, query, orderBy, limit, onSnapshot } = await import('firebase/firestore');
        const q = query(
          collection(firestore!, 'leaderboard'),
          orderBy('score', 'desc'),
          limit(limitCount)
        );

        const unsubscribe = onSnapshot(q, snapshot => {
          const data: LeaderboardEntry[] = snapshot.docs.map(doc => doc.data() as LeaderboardEntry);
          setEntries(data);
          setLoading(false);
        });

        return unsubscribe;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
        setLoading(false);
      }
    })();
  }, [limitCount]);

  const submitScore = async (entry: LeaderboardEntry): Promise<void> => {
    if (!firestore) return;
    try {
      const { collection, doc, setDoc, serverTimestamp } = await import('firebase/firestore');
      await setDoc(doc(collection(firestore, 'leaderboard'), entry.runId), {
        ...entry,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('[Cardhaven] Failed to submit score:', err);
    }
  };

  return { entries, loading, error, submitScore };
}
