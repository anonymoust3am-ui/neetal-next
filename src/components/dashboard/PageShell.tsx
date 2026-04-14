import type { LucideIcon } from 'lucide-react';

interface PageShellProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  accent?: string;
  badge?: string;
  children: React.ReactNode;
}

export function PageShell({ title, description, icon: Icon, accent = '#0d9488', badge, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="border-b border-border bg-surface px-7 py-5">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          {Icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: accent + '18' }}
            >
              <Icon size={20} style={{ color: accent }} strokeWidth={2} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-foreground leading-tight">{title}</h1>
              {badge && (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary-light text-primary">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-foreground-muted mt-0.5">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Page content */}
      <div className="px-7 py-6 max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
}

/* Shared placeholder card ---------------------------------------- */
export function PlaceholderCard({ label, rows = 3 }: { label: string; rows?: number }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
      <div className="h-4 w-32 bg-skeleton rounded-md animate-pulse mb-4" />
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-3 bg-skeleton rounded-md animate-pulse" style={{ width: `${70 + i * 8}%` }} />
        ))}
      </div>
      <p className="text-xs text-foreground-subtle mt-4">{label}</p>
    </div>
  );
}

/* Shared empty state -------------------------------------------- */
export function EmptyState({ icon: Icon, title, sub }: { icon: LucideIcon; title: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon size={24} className="text-foreground-subtle" strokeWidth={1.5} />
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="text-sm text-foreground-muted mt-1 max-w-xs">{sub}</p>
    </div>
  );
}
