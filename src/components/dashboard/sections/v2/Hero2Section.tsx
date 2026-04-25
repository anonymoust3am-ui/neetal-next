'use client';

import Link from 'next/link';
import { 
  Globe, PieChart, UserPlus, BookOpen, 
  Award, BarChart3, Layers, ArrowRight 
} from 'lucide-react';
import ChoiceListPanel from './ChoiceListPanel';

const RESOURCES = [
  { label: 'Official Website', icon: Globe, href: '#', color: 'text-blue-500' },
  { label: 'Quota Details', icon: PieChart, href: '#', color: 'text-purple-500' },
  { label: 'Registration', icon: UserPlus, href: '#', color: 'text-emerald-500' },
  { label: 'Prospectus', icon: BookOpen, href: '#', color: 'text-orange-500' },
];

const QUICK_ACTIONS = [
  { label: 'Allotment Results', icon: Award, href: '#', isPrimary: true },
  { label: 'Closing Ranks', icon: BarChart3, href: '#', isPrimary: false },
  { label: 'Seat Matrix', icon: Layers, href: '#', isPrimary: false },
];

export function Hero2Section() {
  return (
    <div className="grid lg:grid-cols-[3fr_1fr] gap-5 items-start">
      
      {/* LEFT PANEL — Hero Focus Section */}
      <div className="relative bg-surface border border-primary/20 rounded-2xl p-8 shadow-s flex flex-col items-center justify-center h-full overflow-hidden">
        
        {/* Dynamic Hero Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Top Center Title & Subtitle */}
        <div className="text-center relative z-10 max-w-2xl mx-auto mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight tracking-tight">
            Medical Counselling Central
          </h1>
          <h2 className="text-base md:text-lg font-bold text-foreground mb-2">
            Counselling Details & Resources
          </h2>
          <p className="text-sm text-foreground-muted leading-relaxed max-w-xl mx-auto">
            Manage your AIQ and State quota admissions. Access official portals, analyze historical cutoffs, and track available seat matrices in real-time to make informed choices.
          </p>
        </div>

        {/* Small Resource Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 relative z-10">
          {RESOURCES.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:border-primary/40 hover:bg-surface transition-all shadow-sm group"
            >
              <item.icon size={14} className={`${item.color} group-hover:scale-110 transition-transform`} />
              <span className="text-[11px] font-semibold text-foreground group-hover:text-primary transition-colors uppercase tracking-wide">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Quick Actions (Centered CTAs) */}
        {/* <div className="mt-auto relative z-10 flex flex-col items-center w-full">
          <h3 className="text-[11px] font-bold uppercase tracking-widest text-foreground-subtle mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {QUICK_ACTIONS.map((action, idx) => (
              <Link 
                key={idx} 
                href={action.href}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md active:scale-95 group ${
                  action.isPrimary 
                    ? 'bg-primary text-white hover:bg-primary/90' 
                    : 'bg-card border border-border text-foreground hover:border-primary/50 hover:bg-primary/5'
                }`}
              >
                <action.icon size={16} className={action.isPrimary ? 'text-white/80' : 'text-primary'} />
                {action.label}
                <ArrowRight size={14} className={`transition-transform group-hover:translate-x-1 ${action.isPrimary ? 'text-white/80' : 'text-foreground-subtle'}`} />
              </Link>
            ))}
          </div>
        </div> */}

      </div>

      {/* RIGHT PANEL — Choice List Only */}
      <div className="w-full flex justify-center lg:justify-end">
        <div className="w-full max-w-[320px]">
          <ChoiceListPanel />
        </div>
      </div>

    </div>
  );
}