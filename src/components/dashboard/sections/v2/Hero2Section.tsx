'use client';

import { useState } from 'react';
import {
  Globe, UserPlus, BookOpen, PieChart,
  MapPin, ExternalLink, X, Info,
} from 'lucide-react';
import ChoiceListPanel from './ChoiceListPanel';
import { useCounselling } from '@/contexts/CounsellingContext';
import type { CounsellingQuota } from '@/lib/api';

/* ── Quota Modal ──────────────────────────────────────────────────── */
function QuotaModal({ quotas, onClose }: { quotas: CounsellingQuota[]; onClose: () => void }) {
  const [tooltip, setTooltip] = useState<CounsellingQuota | null>(null);

  /* group by master_quota */
  const groups = quotas.reduce<Record<string, CounsellingQuota[]>>((acc, q) => {
    (acc[q.master_quota] ??= []).push(q);
    return acc;
  }, {});

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* panel */}
      <div
        className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
              <PieChart size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">Quota Details</p>
              <p className="text-[10px] text-[var(--color-text-muted)]">{quotas.length} quotas across {Object.keys(groups).length} categories</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-[var(--color-bg-hover)] flex items-center justify-center text-[var(--color-icon-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* body — scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-5" style={{ scrollbarWidth: 'thin' }}>
          {Object.entries(groups).map(([master, qs]) => (
            <div key={master}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-2">
                {master}
              </p>
              <div className="space-y-1.5">
                {qs.map(q => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] hover:bg-[var(--color-bg-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="shrink-0 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md font-mono">
                        {q.short_name}
                      </span>
                      <span className="text-sm text-[var(--color-text-primary)] truncate">{q.name}</span>
                    </div>
                    {q.tooltip_content && (
                      <button
                        onClick={() => setTooltip(q)}
                        className="shrink-0 text-[var(--color-icon-muted)] hover:text-primary transition-colors"
                        title="Eligibility info"
                      >
                        <Info size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility detail overlay */}
      {tooltip && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center p-4"
          onClick={() => setTooltip(null)}
        >
          <div
            className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] shrink-0">
              <div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">{tooltip.name}</p>
                <p className="text-[10px] text-primary font-mono">{tooltip.short_name}</p>
              </div>
              <button
                onClick={() => setTooltip(null)}
                className="w-7 h-7 rounded-lg hover:bg-[var(--color-bg-hover)] flex items-center justify-center text-[var(--color-icon-muted)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div
              className="overflow-y-auto flex-1 px-5 py-4 text-sm text-[var(--color-text-secondary)] leading-relaxed prose prose-sm max-w-none"
              style={{ scrollbarWidth: 'thin' }}
              dangerouslySetInnerHTML={{ __html: tooltip.tooltip_content_html ?? tooltip.tooltip_content ?? '' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────────────── */
function HeroSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-8">
      <div className="space-y-3 text-center">
        <div className="h-9 bg-skeleton rounded-xl w-80 mx-auto" />
        <div className="h-5 bg-skeleton rounded-lg w-56 mx-auto" />
        <div className="h-4 bg-skeleton rounded w-full max-w-lg mx-auto" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-9 w-36 bg-skeleton rounded-full" />)}
      </div>
    </div>
  );
}

/* ── Main ─────────────────────────────────────────────────────────── */
export function Hero2Section() {
  const { selection } = useCounselling();
  const [quotaOpen, setQuotaOpen] = useState(false);

  const body = selection?.body ?? null;
  const opt  = selection?.counselling ?? null;

  const resources = body ? [
    body.website_goto         && { label: 'Official Website', icon: Globe,    href: body.website_goto,         color: 'text-blue-500',   isButton: false },
    body.website_registration && { label: 'Registration',     icon: UserPlus, href: body.website_registration, color: 'text-emerald-500', isButton: false },
    body.website_prospectus   && { label: 'Prospectus',       icon: BookOpen, href: body.website_prospectus,   color: 'text-orange-500', isButton: false },
    body.quotas.length > 0    && { label: 'Quota Details',    icon: PieChart, href: '#',                       color: 'text-purple-500', isButton: true  },
  ].filter(Boolean) as { label: string; icon: React.ElementType; href: string; color: string; isButton: boolean }[] : [];

  return (
    <>
      <div className="grid lg:grid-cols-[3fr_1fr] gap-5 items-start">

        {/* LEFT PANEL */}
        <div className="relative bg-surface border border-primary/20 rounded-2xl p-8 shadow-s flex flex-col items-center justify-center h-full overflow-hidden">

          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />

          {!selection ? <HeroSkeleton /> : (
            <>
              {/* Title block */}
              <div className="text-center relative z-10 max-w-2xl mx-auto mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  {opt?.label}
                </p>
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 leading-tight tracking-tight">
                  {body?.name}
                </h1>
                <div className="flex items-center justify-center gap-2 flex-wrap mb-3">
                  {body?.state && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-muted text-foreground-muted px-2.5 py-1 rounded-full border border-border">
                      <MapPin size={10} /> {body.state}
                    </span>
                  )}
                  {body?.counselling_type && (
                    <span className="text-[11px] font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full">
                      {body.counselling_type}
                    </span>
                  )}
                </div>
                {opt?.desc && (
                  <p className="text-sm text-foreground-muted leading-relaxed max-w-xl mx-auto">
                    {opt.desc}
                  </p>
                )}
              </div>

              {/* Resource links */}
              {resources.length > 0 && (
                <div className="flex flex-wrap justify-center gap-3 relative z-10">
                  {resources.map((item) =>
                    item.isButton ? (
                      <button
                        key={item.label}
                        onClick={() => setQuotaOpen(true)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/40 hover:bg-surface transition-all shadow-sm group"
                      >
                        <item.icon size={14} className={`${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors uppercase tracking-wide">
                          {item.label}
                        </span>
                      </button>
                    ) : (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/40 hover:bg-surface transition-all shadow-sm group"
                      >
                        <item.icon size={14} className={`${item.color} group-hover:scale-110 transition-transform`} />
                        <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors uppercase tracking-wide">
                          {item.label}
                        </span>
                        <ExternalLink size={10} className="text-foreground-subtle group-hover:text-primary transition-colors" />
                      </a>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[320px]">
            <ChoiceListPanel />
          </div>
        </div>

      </div>

      {/* Quota Modal */}
      {quotaOpen && body && (
        <QuotaModal quotas={body.quotas} onClose={() => setQuotaOpen(false)} />
      )}
    </>
  );
}
