import { TrendingDown } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const rows = [
  { college: 'AIIMS New Delhi',       course: 'MBBS', y2024: 49,   y2023: 52,   y2022: 61,   y2021: 57,   trend: 'down' },
  { college: 'AIIMS Mumbai',          course: 'MBBS', y2024: 312,  y2023: 298,  y2022: 335,  y2021: 309,  trend: 'up'   },
  { college: 'PGIMER Chandigarh',     course: 'MBBS', y2024: 389,  y2023: 401,  y2022: 420,  y2021: 398,  trend: 'down' },
  { college: 'JIPMER Puducherry',     course: 'MBBS', y2024: 512,  y2023: 489,  y2022: 530,  y2021: 501,  trend: 'up'   },
  { college: 'Maulana Azad Medical',  course: 'MBBS', y2024: 1240, y2023: 1189, y2022: 1312, y2021: 1201, trend: 'up'   },
  { college: 'VMMC Safdarjung',       course: 'MBBS', y2024: 865,  y2023: 902,  y2022: 944,  y2021: 878,  trend: 'down' },
];

export default function CutoffsPage() {
  return (
    <PageShell title="Cutoff Trends" description="Closing rank history across top medical colleges" icon={TrendingDown} accent="#0ea5e9">
      <div className="bg-surface border border-border rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-5 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">College</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">2024</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">2023</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">2022</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">2021</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">Trend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.college} className={`hover:bg-hover transition-colors ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-foreground">{r.college}</p>
                  <p className="text-xs text-foreground-subtle">{r.course}</p>
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-foreground">{r.y2024.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-center text-foreground-muted">{r.y2023.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-center text-foreground-muted">{r.y2022.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-center text-foreground-muted">{r.y2021.toLocaleString()}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`text-sm font-bold ${r.trend === 'down' ? 'text-success' : 'text-error'}`}>
                    {r.trend === 'down' ? '↓' : '↑'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-border bg-muted">
          <p className="text-xs text-foreground-subtle">↓ rank dropped = easier to get in · ↑ rank rose = harder · General category, AIQ</p>
        </div>
      </div>
    </PageShell>
  );
}
