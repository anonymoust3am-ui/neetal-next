import { Bookmark, Trash2 } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const items = [
  { name: 'AIIMS New Delhi',       course: 'MBBS', seats: 107, rank: 49   },
  { name: 'PGIMER Chandigarh',     course: 'MBBS', seats: 60,  rank: 298  },
  { name: 'JIPMER Puducherry',     course: 'MBBS', seats: 150, rank: 512  },
  { name: 'AIIMS Bhopal',          course: 'MBBS', seats: 100, rank: 890  },
  { name: 'Maulana Azad Medical',  course: 'MBBS', seats: 250, rank: 1240 },
];

export default function ShortlistPage() {
  return (
    <PageShell title="My Shortlist" description={`${items.length} colleges saved`} icon={Bookmark} accent="#7c3aed">
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {items.map((c, i) => (
          <div key={c.name} className={`flex items-center gap-4 px-5 py-4 hover:bg-hover transition-colors ${i < items.length - 1 ? 'border-b border-border' : ''}`}>
            <div className="w-9 h-9 rounded-xl bg-primary-light flex items-center justify-center shrink-0 text-xs font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{c.name}</p>
              <p className="text-xs text-foreground-subtle">{c.course} · {c.seats} seats · Closing rank {c.rank}</p>
            </div>
            <button disabled className="p-2 rounded-lg hover:bg-error-light text-foreground-subtle hover:text-error transition-colors cursor-not-allowed">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <div className="px-5 py-3 border-t border-border bg-muted">
          <p className="text-xs text-foreground-subtle">Drag to reorder · Max 20 colleges</p>
        </div>
      </div>
    </PageShell>
  );
}
