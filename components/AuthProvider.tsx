'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  token: string;
  displayName: string;
  email: string;
  nicename: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'stichyx-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as AuthUser);
    } catch {
      // ignore corrupted storage
    }
    setLoading(false);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    const persist = (next: AuthUser | null) => {
      setUser(next);
      try {
        if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        else localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore quota errors
      }
    };

    const login: AuthContextValue['login'] = async (username, password) => {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });
        const data = (await res.json()) as {
          ok: boolean;
          token?: string;
          displayName?: string;
          email?: string;
          nicename?: string;
          error?: string;
        };

        if (!data.ok || !data.token) {
          return { ok: false, error: data.error ?? 'Login failed' };
        }

        persist({
          token: data.token,
          displayName: data.displayName ?? username,
          email: data.email ?? '',
          nicename: data.nicename ?? '',
        });
        return { ok: true };
      } catch {
        return { ok: false, error: 'Could not reach the login service.' };
      }
    };

    const logout = () => persist(null);

    return { user, loading, login, logout };
  }, [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
