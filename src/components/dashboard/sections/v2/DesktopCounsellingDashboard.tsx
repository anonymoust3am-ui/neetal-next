import { CheckCircle2, Circle, Home, Settings, FileText, Bell } from 'lucide-react';

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
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm overflow-x-auto">
          <h2 className="text-base font-bold text-foreground mb-10">Counselling Timeline</h2>

          {/* Horizontal Timeline Container */}
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
      </main>
      
    </div>
  );
}