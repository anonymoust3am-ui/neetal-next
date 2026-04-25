'use client';

export function BottomNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-15">
      {children}
    </div>
  );
}