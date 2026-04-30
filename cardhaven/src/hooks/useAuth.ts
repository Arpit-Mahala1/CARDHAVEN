import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock user login for local-only play
    const mockUser = {
      uid: 'guest-player',
      displayName: 'Local Hero',
      isAnonymous: true
    };
    setUser(mockUser);
    setLoading(false);
  }, []);

  const loginAnonymously = async () => {
    // Already mocked
  };

  const logout = async () => {
    setUser(null);
  };

  return { user, loading, loginAnonymously, logout };
}
