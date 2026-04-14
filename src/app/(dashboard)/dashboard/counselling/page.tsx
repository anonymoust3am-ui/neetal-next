import { Users } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const types = [
  { name: 'MCC Counselling',      body: 'Medical Counselling Committee', seats: '15% AIQ + Central',  status: 'Round 1 Closed', statusCls: 'bg-error-light text-error' },
  { name: 'State Quota',          body: 'State Medical Authority',       seats: '85% State Quota',    status: 'Upcoming',       statusCls: 'bg-warning-light text-warning' },
  { name: 'Deemed Universities',  body: 'Individual Universities',       seats: 'All Seats',          status: 'Open',           statusCls: 'bg-success-light text-success' },
  { name: 'AIIMS Counselling',    body: 'AIIMS New Delhi',               seats: 'All AIIMS Seats',    status: 'Round 2 Open',   statusCls: 'bg-primary-light text-primary' },
];

export default function CounsellingPage() {
  return (
    <PageShell title="Counselling" description="Overview of all NEET UG counselling authorities" icon={Users} accent="#0ea5e9">
      <div className="grid gap-3 sm:grid-cols-2">
        {types.map(t => (
          <div key={t.name} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <p className="text-base font-bold text-foreground">{t.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${t.statusCls}`}>{t.status}</span>
            </div>
            <p className="text-xs text-foreground-subtle">{t.body}</p>
            <p className="text-sm text-foreground-muted mt-2">Covers: <span className="font-medium text-foreground">{t.seats}</span></p>
            <button disabled className="mt-3 w-full h-8 rounded-xl bg-muted border border-border text-xs font-medium text-foreground-muted cursor-not-allowed">View Schedule</button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
