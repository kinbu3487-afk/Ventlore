'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockApiClient, UserSessionDTO, DemoPersona } from '@ventlore/api-client';

interface SessionContextType {
  persona: DemoPersona;
  session: UserSessionDTO | null;
  isLoading: boolean;
  setPersona: (persona: DemoPersona) => void;
}

const SessionContext = createContext<SessionContextType>({
  persona: 'guest',
  session: null,
  isLoading: true,
  setPersona: () => {},
});

const VALID_PERSONAS: DemoPersona[] = ['guest', 'member', 'vip', 'author', 'expert'];

export function SessionProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<DemoPersona>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('ventlore_persona') as DemoPersona;
        if (saved && VALID_PERSONAS.includes(saved)) {
          mockApiClient.setPersona(saved);
          return saved;
        }
      } catch {}
    }
    return 'guest';
  });

  const [session, setSession] = useState<UserSessionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync session whenever persona changes
  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      mockApiClient.setPersona(persona);
      const sess = await mockApiClient.getSession();
      if (mounted) {
        setSession(sess);
        setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [persona]);

  const setPersona = (p: DemoPersona) => {
    // Synchronously update mockApiClient state FIRST before triggering React state update
    mockApiClient.setPersona(p);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ventlore_persona', p);
      } catch {}
    }
    setPersonaState(p);
  };

  return (
    <SessionContext.Provider value={{ persona, session, isLoading, setPersona }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
