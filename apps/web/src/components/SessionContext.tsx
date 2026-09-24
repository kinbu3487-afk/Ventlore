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

export function SessionProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<DemoPersona>('guest');
  const [session, setSession] = useState<UserSessionDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
