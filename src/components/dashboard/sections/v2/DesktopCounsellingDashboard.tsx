import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { done: true,  active: false, label: 'Round 1 Registration',  date: 'Mar 10 – Mar 18', sub: 'Verification & payment completed'       },
  { done: true,  active: false, label: 'Round 1 Allotment',     date: 'Mar 22',          sub: 'Results published on MCC portal'        },
  { done: false, active: true,  label: 'Round 2 Registration',  date: 'Apr 15 – Apr 18', sub: 'Open now — complete before deadline'    },
  { done: false, active: false, label: 'Round 2 Allotment',     date: 'Apr 22',          sub: 'Seat allotment letter download'         },
  { done: false, active: false, label: 'Stray Vacancy',         date: 'May 20 – May 24', sub: 'Final round for remaining seats'        },
];

export default function DesktopCounsellingDashboard() {
  return (
    <div className="min-h-auto bg-background pb-8">
      
      {/* Main Content Area */}
      <main className="max-w-[1500px] mx-auto pt-8">
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-8 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-5 sm:mb-10">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-primary sm:hidden">
                Live schedule
              </p>
              <h2 className="text-sm font-bold text-foreground sm:text-base">Counselling Timeline</h2>
            </div>
            <span className="sm:hidden shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary">
              Round 2
            </span>
          </div>

          {/* Mobile Timeline */}
          <div className="sm:hidden">
            <div className="relative space-y-2">
              <div className="absolute left-[14px] top-4 bottom-4 w-px bg-border" />
              {STEPS.map((step, idx) => {
                const status = step.done ? 'Done' : step.active ? 'Now' : 'Next';
                const shortLabel = step.label
                  .replace('Registration', 'Reg.')
                  .replace('Allotment', 'Allot.')
                  .replace('Stray Vacancy', 'Stray');
                return (
                  <div
                    key={idx}
                    className={`relative flex gap-2.5 rounded-xl border px-2.5 py-2.5 transition-colors ${
                      step.active
                        ? 'border-primary/40 bg-primary/5 shadow-sm'
                        : 'border-border bg-background/60'
                    }`}
                  >
                    <div
                      className={`relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        step.done
                          ? 'border-success bg-success text-white'
                          : step.active
                          ? 'border-primary bg-primary text-white shadow-[0_0_0_3px_rgba(13,148,136,0.14)]'
                          : 'border-border bg-surface text-foreground-subtle'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 size={14} />
                      ) : step.active ? (
                        <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                      ) : (
                        <Circle size={13} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-bold leading-tight ${
                              step.active
                                ? 'text-primary'
                                : step.done
                                ? 'text-foreground'
                                : 'text-foreground-muted'
                            }`}
                          >
                            {shortLabel}
                          </p>
                          <p className="mt-0.5 text-[10px] font-medium text-foreground-muted">
                            {step.date}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                            step.done
                              ? 'bg-success-light text-success'
                              : step.active
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-foreground-subtle'
                          }`}
                        >
                          {status}
                        </span>
                      </div>
                      {step.active && (
                        <p className="mt-1 text-[10px] leading-snug text-foreground-subtle">
                          {step.sub}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop Timeline */}
          <div className="hidden sm:block overflow-x-auto no-scrollbar">
            <div className="flex items-start w-full min-w-[1000px]">
              {STEPS.map((step, idx) => {
                const isLast = idx === STEPS.length - 1;
                return (
                  <div key={idx} className="relative flex flex-col items-center flex-1">
                    
                    {/* Connecting Line (spans exactly 50% from current center to next center) */}
                    {!isLast && (
                      <div
                        className={`absolute top-[13px] left-[50%] w-full h-[2px] z-0 ${
                          step.done && STEPS[idx + 1]?.done ? 'bg-success' : 'bg-border'
                        }`}
                      />
                    )}

                    {/* Step Icon */}
                    <div
                      className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                        step.done
                          ? 'bg-success border-success'
                          : step.active
                          ? 'bg-primary border-primary scale-110 shadow-[0_0_0_4px_rgba(13,148,136,0.15)]'
                          : 'bg-muted border-border'
                      }`}
                    >
                      {step.done ? (
                        <CheckCircle2 size={14} className="text-white" />
                      ) : step.active ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                      ) : (
                        <Circle size={14} className="text-foreground-subtle" />
                      )}
                    </div>

                    {/* Step Text Content */}
                    <div className="mt-5 flex flex-col items-center text-center px-2">
                      <p
                        className={`text-sm font-semibold ${
                          step.active
                            ? 'text-primary'
                            : step.done
                            ? 'text-foreground'
                            : 'text-foreground-muted'
                        }`}
                      >
                        {step.label}
                      </p>
                      
                      {/* {step.active && (
                        <span className="mt-1.5 text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full">
                          NOW
                        </span>
                      )} */}
                      
                      <p
                        className={`text-xs mt-1.5 ${
                          step.active ? 'text-foreground-muted' : 'text-foreground-subtle'
                        }`}
                      >
                        {step.date}
                      </p>
                      
                      <p className="text-[11px] text-foreground-subtle mt-1 leading-snug max-w-[130px]">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      
    </div>
  );
}
