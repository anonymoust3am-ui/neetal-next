'use client';

import { createContext, useContext, useState } from 'react';

interface BottomNavContextValue {
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

const BottomNavContext = createContext<BottomNavContextValue>({
  activeKey: null,
  setActiveKey: () => {},
});

export function BottomNavProvider({ children }: { children: React.ReactNode }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);

  return (
    <BottomNavContext.Provider value={{ activeKey, setActiveKey }}>
      {children}
    </BottomNavContext.Provider>
  );
}

export const useBottomNav = () => useContext(BottomNavContext);