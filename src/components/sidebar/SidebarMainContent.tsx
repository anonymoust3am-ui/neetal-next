'use client';

import { useSidebar, SIDEBAR_COLLAPSED_W, SIDEBAR_EXPANDED_W, HEADER_H } from '@/contexts/SidebarContext';

export function SidebarMainContent({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();
  const sidebarW = expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <div
      style={{
        paddingLeft: sidebarW,
        paddingTop: HEADER_H,
        transition: 'padding-left 240ms cubic-bezier(0.4,0,0.2,1)',
      }}
      className="min-h-screen"
    >
      {children}
    </div>
  );
}
