import { Banknote } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const rows = [
  { college: 'AIIMS New Delhi',       type: 'Central', fee: 1390,    bond: 'None',      stipend: '₹17,500/mo' },
  { college: 'PGIMER Chandigarh',     type: 'Central', fee: 1390,    bond: 'None',      stipend: '₹15,600/mo' },
  { college: 'JIPMER Puducherry',     type: 'Central', fee: 1390,    bond: 'None',      stipend: '₹15,600/mo' },
  { college: 'Maulana Azad Medical',  type: 'State',   fee: 12450,   bond: 'None',      stipend: '₹13,500/mo' },
  { college: 'Kasturba Medical',      type: 'Private', fee: 1300000, bond: '₹20 L/yr',  stipend: '—'           },
  { college: 'Sri Ramachandra',       type: 'Deemed',  fee: 1750000, bond: '₹25 L/yr',  stipend: '—'           },
];

const typeCls: Record<string, string> = {
  Central: 'bg-primary-light text-primary',
  State:   'bg-success-light text-success',
  Private: 'bg-warning-light text-warning',
  Deemed:  'bg-error-light text-error',
};

export default function FeesPage() {
  return (
    <PageShell title="Fees, Bond & Stipend" description="Annual tuition fees, bond requirements, and PG stipends" icon={Banknote} accent="#0ea5e9">
      <div className="bg-surface border border-border rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted">
              <th className="text-left px-5 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">College</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">Type</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">Annual Fee</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">Bond</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-foreground-subtle uppercase tracking-wide">PG Stipend</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.college} className={`hover:bg-hover transition-colors ${i < rows.length - 1 ? 'border-b border-border' : ''}`}>
                <td className="px-5 py-3.5 font-semibold text-foreground">{r.college}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeCls[r.type]}`}>{r.type}</span>
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-foreground">
                  {r.fee < 100000 ? `₹${r.fee.toLocaleString()}` : `₹${(r.fee / 100000).toFixed(1)}L`}
                </td>
                <td className="px-4 py-3.5 text-center text-foreground-muted">{r.bond}</td>
                <td className="px-4 py-3.5 text-center text-foreground-muted">{r.stipend}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-3 border-t border-border bg-muted">
          <p className="text-xs text-foreground-subtle">Fees are approximate · Verify with official prospectus · PG stipend for post-graduate residents</p>
        </div>
      </div>
    </PageShell>
  );
}
