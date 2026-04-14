import { Map } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const guides = [
  { title: 'Complete MCC Counselling Guide 2025',    category: 'Counselling', pages: 24, level: 'Beginner',     updated: 'Apr 10' },
  { title: 'How to Fill Choice List Strategically',  category: 'Strategy',   pages: 18, level: 'Intermediate',  updated: 'Apr 8'  },
  { title: 'State Quota — State by State Breakdown', category: 'State',      pages: 32, level: 'Intermediate',  updated: 'Apr 5'  },
  { title: 'Deemed Universities — Full Guide',        category: 'Private',    pages: 20, level: 'Beginner',     updated: 'Apr 3'  },
  { title: 'NRI & OCI Quota Explained',              category: 'Quota',      pages: 12, level: 'Beginner',     updated: 'Mar 30' },
  { title: 'Document Checklist for Reporting',       category: 'Docs',       pages: 8,  level: 'All levels',   updated: 'Mar 28' },
  { title: 'PwD Category Rights & Process',          category: 'Quota',      pages: 14, level: 'Intermediate',  updated: 'Mar 25' },
  { title: 'AIQ vs State: Decision Framework',       category: 'Strategy',   pages: 16, level: 'Advanced',     updated: 'Mar 22' },
];

const levelCls: Record<string, string> = {
  'Beginner':     'bg-success-light text-success',
  'Intermediate': 'bg-warning-light text-warning',
  'Advanced':     'bg-error-light text-error',
  'All levels':   'bg-primary-light text-primary',
};

const catCls: Record<string, string> = {
  Counselling: 'bg-primary-light text-primary',
  Strategy:    'bg-secondary-light text-secondary',
  State:       'bg-success-light text-success',
  Private:     'bg-warning-light text-warning',
  Quota:       'bg-error-light text-error',
  Docs:        'bg-muted text-foreground-muted',
};

export default function GuidesPage() {
  return (
    <PageShell title="Guides" description="Step-by-step guides for every stage of NEET counselling" icon={Map} accent="#0ea5e9">
      <div className="grid gap-3 sm:grid-cols-2">
        {guides.map(g => (
          <div key={g.title} className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:border-primary hover:shadow-md transition-all cursor-default">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 text-lg font-black text-foreground-subtle">
                {g.pages}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-snug">{g.title}</p>
                <p className="text-xs text-foreground-subtle mt-0.5">Updated {g.updated} · {g.pages} pages</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catCls[g.category] ?? 'bg-muted text-foreground-muted'}`}>{g.category}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${levelCls[g.level]}`}>{g.level}</span>
              <button disabled className="ml-auto text-xs font-medium text-primary cursor-not-allowed">Read →</button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
