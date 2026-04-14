import { ClipboardCheck } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const rounds = [
  { round: 'Round 1', opens: 'Mar 10', closes: 'Mar 18', result: 'Mar 22', status: 'Completed',  statusCls: 'bg-success-light text-success' },
  { round: 'Round 2', opens: 'Apr 01', closes: 'Apr 09', result: 'Apr 13', status: 'In Progress', statusCls: 'bg-primary-light text-primary' },
  { round: 'Round 3', opens: 'Apr 25', closes: 'May 02', result: 'May 06', status: 'Upcoming',   statusCls: 'bg-warning-light text-warning' },
  { round: 'Stray',   opens: 'May 20', closes: 'May 24', result: 'May 27', status: 'Upcoming',   statusCls: 'bg-warning-light text-warning' },
];

const allotments = [
  { rank: 49,   college: 'AIIMS New Delhi',      course: 'MBBS', category: 'UR', round: 'R1' },
  { rank: 312,  college: 'AIIMS Mumbai',         course: 'MBBS', category: 'UR', round: 'R1' },
  { rank: 512,  college: 'JIPMER Puducherry',    course: 'MBBS', category: 'UR', round: 'R2' },
  { rank: 1240, college: 'Maulana Azad Medical', course: 'MBBS', category: 'OBC', round: 'R2' },
];

export default function AllotmentPage() {
  return (
    <PageShell title="Allotment Results" description="Round-wise seat allotment data for MCC counselling" icon={ClipboardCheck} accent="#0ea5e9">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {rounds.map(r => (
            <div key={r.round} className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-foreground">{r.round}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.statusCls}`}>{r.status}</span>
              </div>
              <div className="space-y-1 text-xs text-foreground-muted">
                <p>Opens: <span className="text-foreground font-medium">{r.opens}</span></p>
                <p>Closes: <span className="text-foreground font-medium">{r.closes}</span></p>
                <p>Result: <span className="text-foreground font-medium">{r.result}</span></p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-border bg-muted">
            <p className="text-xs font-semibold text-foreground-subtle uppercase tracking-wide">Sample Allotment Data</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-xs font-semibold text-foreground-subtle">Rank</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-foreground-subtle">College</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle">Course</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle">Category</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle">Round</th>
              </tr>
            </thead>
            <tbody>
              {allotments.map((a, i) => (
                <tr key={i} className={`hover:bg-hover transition-colors ${i < allotments.length - 1 ? 'border-b border-border' : ''}`}>
                  <td className="px-5 py-3.5 font-mono font-bold text-foreground">{a.rank}</td>
                  <td className="px-5 py-3.5 font-medium text-foreground">{a.college}</td>
                  <td className="px-4 py-3.5 text-center text-foreground-muted">{a.course}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span className="text-[10px] font-bold bg-primary-light text-primary px-2 py-0.5 rounded-full">{a.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-center text-foreground-muted">{a.round}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
