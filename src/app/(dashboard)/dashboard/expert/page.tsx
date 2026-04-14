import { CalendarCheck } from 'lucide-react';
import { PageShell } from '@/components/dashboard/PageShell';

const experts = [
  { name: 'Dr. Ramesh Gupta',    role: 'MCC Counselling Specialist', exp: '14 yrs', rating: 4.9, sessions: 1240, available: true  },
  { name: 'Dr. Priya Sharma',   role: 'AIIMS Alumni & Mentor',       exp: '8 yrs',  rating: 4.8, sessions: 876,  available: true  },
  { name: 'Dr. Anil Mehta',     role: 'State Quota Expert — MH/KA',  exp: '11 yrs', rating: 4.7, sessions: 980,  available: false },
  { name: 'Dr. Kavya Reddy',    role: 'Deemed Univ. Counsellor',     exp: '6 yrs',  rating: 4.8, sessions: 640,  available: true  },
  { name: 'Dr. Suresh Nair',    role: 'JIPMER & South India Expert', exp: '9 yrs',  rating: 4.9, sessions: 1100, available: false },
  { name: 'Dr. Meena Joshi',    role: 'Choice List Strategy Coach',  exp: '7 yrs',  rating: 4.6, sessions: 720,  available: true  },
];

export default function ExpertPage() {
  return (
    <PageShell title="Book an Expert" description="1-on-1 sessions with experienced NEET counselling mentors" icon={CalendarCheck} accent="#7c3aed">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {experts.map(e => (
          <div key={e.name} className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-primary-light flex items-center justify-center shrink-0 text-sm font-black text-primary">
                {e.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground">{e.name}</p>
                <p className="text-xs text-foreground-subtle leading-snug">{e.role}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${e.available ? 'bg-success-light text-success' : 'bg-muted text-foreground-muted'}`}>
                {e.available ? 'Available' : 'Busy'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              {[['⭐ ' + e.rating, 'Rating'], [e.exp, 'Experience'], [e.sessions.toLocaleString(), 'Sessions']].map(([v, l]) => (
                <div key={l} className="bg-muted rounded-xl py-2">
                  <p className="text-sm font-bold text-foreground">{v}</p>
                  <p className="text-[10px] text-foreground-subtle">{l}</p>
                </div>
              ))}
            </div>

            <button
              disabled={!e.available}
              className={`w-full h-9 rounded-xl text-xs font-semibold transition-colors ${
                e.available
                  ? 'bg-primary text-white cursor-not-allowed opacity-80'
                  : 'bg-muted text-foreground-muted border border-border cursor-not-allowed'
              }`}
            >
              {e.available ? 'Book Session' : 'Join Waitlist'}
            </button>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
