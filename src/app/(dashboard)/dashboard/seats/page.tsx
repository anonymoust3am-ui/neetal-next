import { Grid3X3 } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const matrix = [
  { college: 'AIIMS New Delhi',       ur: 54,  obc: 29, sc: 16, st: 8  },
  { college: 'AIIMS Mumbai',          ur: 50,  obc: 27, sc: 15, st: 8  },
  { college: 'PGIMER Chandigarh',     ur: 30,  obc: 16, sc: 9,  st: 5  },
  { college: 'JIPMER Puducherry',     ur: 75,  obc: 41, sc: 23, st: 11 },
  { college: 'Maulana Azad Medical',  ur: 125, obc: 68, sc: 38, st: 19 },
  { college: 'VMMC Safdarjung',       ur: 100, obc: 54, sc: 30, st: 15 },
];

const cats = [
  { key: 'ur',  label: 'UR',  cls: 'bg-primary-light text-primary' },
  { key: 'obc', label: 'OBC', cls: 'bg-warning-light text-warning' },
  { key: 'sc',  label: 'SC',  cls: 'bg-success-light text-success' },
  { key: 'st',  label: 'ST',  cls: 'bg-error-light text-error' },
];

export default function SeatsPage() {
  return (
    <PageShell title="Seat Matrix" description="Category-wise seat distribution across colleges" icon={Grid3X3} accent="#0ea5e9">
      <div className="space-y-4">
        <div className="flex gap-3 flex-wrap">
          {cats.map(c => (
            <div key={c.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${c.cls}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              {c.label}
            </div>
          ))}
        </div>
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto shadow-sm">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted">
                <th className="text-left px-5 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">College</th>
                {cats.map(c => (
                  <th key={c.key} className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">{c.label}</th>
                ))}
                <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">Total</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((r, i) => {
                const total = r.ur + r.obc + r.sc + r.st;
                return (
                  <tr key={r.college} className={`hover:bg-hover transition-colors ${i < matrix.length - 1 ? 'border-b border-border' : ''}`}>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{r.college}</td>
                    <td className="px-4 py-3.5 text-center text-foreground">{r.ur}</td>
                    <td className="px-4 py-3.5 text-center text-foreground">{r.obc}</td>
                    <td className="px-4 py-3.5 text-center text-foreground">{r.sc}</td>
                    <td className="px-4 py-3.5 text-center text-foreground">{r.st}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-foreground">{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="px-5 py-3 border-t border-border bg-muted">
            <p className="text-xs text-foreground-subtle">AIQ seats only · PwD (5% horizontal) not shown separately</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
