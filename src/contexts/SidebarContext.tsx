'use client';

import { createContext, useCallback, useContext, useState } from 'react';

export const SIDEBAR_COLLAPSED_W = 64;
export const SIDEBAR_EXPANDED_W  = 252;
export const HEADER_H            = 60;

interface SidebarContextValue {
  expanded: boolean;
  setHovered: (v: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue>({
  expanded: false,
  setHovered: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [hovered, setHoveredState] = useState(false);

  const setHovered = useCallback((v: boolean) => {
    setHoveredState(v);
  }, []);

  return (
    <SidebarContext.Provider value={{ expanded: hovered, setHovered }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
