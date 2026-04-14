'use client';

import { useEffect, useState } from 'react';

// ─── ECG pulse strip ─────────────────────────────────────────────────────────
function EcgLine() {
  return (
    <div className="w-full overflow-hidden" style={{ height: 32 }} aria-hidden>
      <svg viewBox="0 0 320 32" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="ld-ecg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(13,148,136,0)" />
            <stop offset="40%"  stopColor="rgba(13,148,136,0.8)" />
            <stop offset="60%"  stopColor="rgba(124,58,237,0.8)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
        </defs>
        <path
          className="ld-ecg-path"
          d="M0,16 L40,16 L52,4 L60,28 L68,4 L76,16 L120,16 L132,4 L140,28 L148,4 L156,16 L200,16 L212,4 L220,28 L228,4 L236,16 L280,16 L292,4 L300,28 L308,4 L316,16 L320,16"
          fill="none"
          stroke="url(#ld-ecg)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── animated logo mark ──────────────────────────────────────────────────────
function LogoMark() {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 64, height: 64 }}>
      {/* outer spinning ring */}
      <div
        className="absolute inset-0 rounded-full ld-ring-outer"
        style={{ border: '2px solid transparent', borderTopColor: '#0d9488', borderRightColor: '#7c3aed' }}
      />
      {/* inner spinning ring */}
      <div
        className="absolute rounded-full ld-ring-inner"
        style={{ inset: 8, border: '1.5px solid transparent', borderBottomColor: '#0ea5e9', borderLeftColor: '#14b8a6' }}
      />
      {/* pulse dot */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full"
        style={{ background: 'linear-gradient(135deg, #0d9488, #7c3aed)' }}>
        <span className="absolute inset-0 rounded-full ld-pulse-ring"
          style={{ border: '1.5px solid rgba(13,148,136,0.5)' }} />
        {/* medical cross */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="5.5" y="1" width="3" height="12" rx="1.5" fill="white" fillOpacity="0.9" />
          <rect x="1"   y="5.5" width="12" height="3" rx="1.5" fill="white" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}

// ─── shimmer skeleton bar ────────────────────────────────────────────────────
function Shimmer({ w, h = 8, delay = 0, rounded = 99 }: { w: number | string; h?: number; delay?: number; rounded?: number }) {
  return (
    <div
      className="ld-shimmer"
      style={{ width: w, height: h, borderRadius: rounded, animationDelay: `${delay}s` }}
    />
  );
}

// ─── progress bar ────────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: 'rgba(13,148,136,0.12)' }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #0d9488, #7c3aed, #0ea5e9)',
          transition: 'width 0.4s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: '0 0 8px rgba(13,148,136,0.5)',
        }}
      />
    </div>
  );
}

// ─── skeleton page preview ───────────────────────────────────────────────────
function SkeletonPreview() {
  return (
    <div className="w-full rounded-2xl border border-border overflow-hidden" style={{ background: 'var(--color-bg-secondary)' }}>
      {/* fake header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ background: 'var(--color-bg-muted)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg ld-shimmer" style={{ animationDelay: '0s' }} />
          <Shimmer w={80} h={8} delay={0.1} />
        </div>
        <div className="flex gap-2">
          <Shimmer w={48} h={6} delay={0.15} />
          <Shimmer w={28} h={6} delay={0.2} />
        </div>
      </div>
      {/* fake stat cards */}
      <div className="grid grid-cols-3 gap-2 p-3">
        {[0.05, 0.1, 0.15].map((d, i) => (
          <div key={i} className="rounded-xl p-3 border border-border" style={{ background: 'var(--color-bg-muted)' }}>
            <Shimmer w="50%" h={6} delay={d} />
            <div className="mt-2"><Shimmer w="80%" h={14} rounded={6} delay={d + 0.05} /></div>
            <div className="mt-1"><Shimmer w="60%" h={5} delay={d + 0.08} /></div>
          </div>
        ))}
      </div>
      {/* fake list rows */}
      <div className="px-3 pb-3 space-y-2">
        {[0.2, 0.25, 0.3].map((d, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5 border border-border" style={{ background: 'var(--color-bg-muted)' }}>
            <div className="w-8 h-8 rounded-lg ld-shimmer shrink-0" style={{ animationDelay: `${d}s` }} />
            <div className="flex-1 space-y-1.5">
              <Shimmer w={`${55 + i * 10}%`} h={7} delay={d + 0.05} />
              <Shimmer w={`${35 + i * 8}%`}  h={5} delay={d + 0.1} />
            </div>
            <Shimmer w={36} h={20} rounded={8} delay={d + 0.12} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────
const STEPS = ['Connecting…', 'Loading data…', 'Preparing UI…', 'Almost there…'];

export default function Loading() {
  const [progress, setProgress]   = useState(4);
  const [stepIdx,  setStepIdx]    = useState(0);
  const [mounted,  setMounted]    = useState(false);

  useEffect(() => {
    setMounted(true);

    // progress simulation
    const intervals = [
      { target: 35,  delay: 0,   step: 0 },
      { target: 65,  delay: 500, step: 1 },
      { target: 85,  delay: 900, step: 2 },
      { target: 96,  delay: 1400, step: 3 },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];

    intervals.forEach(({ target, delay, step }) => {
      timers.push(setTimeout(() => {
        setProgress(target);
        setStepIdx(step);
      }, delay));
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      style={{ background: 'var(--color-bg-primary)' }}
    >
      {/* ── dot grid bg ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.14) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
        }}
      />

      {/* ── aurora glow ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="ld-aurora ld-a1" />
        <div className="ld-aurora ld-a2" />
      </div>

      {/* ── main content ── */}
      <div
        className={`relative z-10 flex flex-col items-center w-full max-w-sm px-6 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* logo mark */}
        <div style={{ animation: mounted ? 'ld-pop 0.5s ease both' : 'none' }}>
          <LogoMark />
        </div>

        {/* brand + status */}
        <div
          className="mt-5 mb-1 text-center"
          style={{ animation: mounted ? 'ld-up 0.5s 0.15s ease both' : 'none' }}
        >
          <p className="text-base font-bold text-foreground tracking-tight">NeEtal</p>
          <p className="text-xs text-foreground-subtle mt-0.5 font-mono">{STEPS[stepIdx]}</p>
        </div>

        {/* ECG line */}
        <div
          className="w-full mt-3 mb-4"
          style={{ animation: mounted ? 'ld-up 0.5s 0.25s ease both' : 'none' }}
        >
          <EcgLine />
        </div>

        {/* progress bar */}
        <div
          className="w-full mb-2"
          style={{ animation: mounted ? 'ld-up 0.5s 0.3s ease both' : 'none' }}
        >
          <ProgressBar progress={progress} />
        </div>

        {/* percent */}
        <p
          className="text-[10px] font-mono text-foreground-subtle mb-8 self-end"
          style={{ animation: mounted ? 'ld-up 0.5s 0.35s ease both' : 'none' }}
        >
          <span className="text-primary font-bold">{progress}</span>%
        </p>

        {/* skeleton preview */}
        <div
          className="w-full"
          style={{ animation: mounted ? 'ld-up 0.6s 0.4s ease both' : 'none' }}
        >
          <SkeletonPreview />
        </div>

        {/* bottom dots */}
        <div
          className="flex gap-1.5 mt-6"
          style={{ animation: mounted ? 'ld-up 0.5s 0.5s ease both' : 'none' }}
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full ld-dot"
              style={{
                animationDelay: `${i * 0.18}s`,
                background: i === 0 ? '#0d9488' : i === 1 ? '#7c3aed' : '#0ea5e9',
              }}
            />
          ))}
        </div>
      </div>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes ld-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes ld-pop {
          from { opacity: 0; transform: scale(0.7); }
          to   { opacity: 1; transform: scale(1);   }
        }
        @keyframes ld-spin-cw  { to { transform: rotate(360deg);  } }
        @keyframes ld-spin-ccw { to { transform: rotate(-360deg); } }
        @keyframes ld-pulse-ring {
          0%   { transform: scale(1);    opacity: 0.7; }
          100% { transform: scale(1.9);  opacity: 0;   }
        }
        @keyframes ld-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        @keyframes ld-dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1;   }
        }
        @keyframes ld-ecg-draw {
          from { stroke-dashoffset: 800; opacity: 0; }
          10%  { opacity: 1; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes ld-ecg-loop {
          0%   { stroke-dashoffset: 0;   opacity: 0.6; }
          50%  { opacity: 1; }
          100% { stroke-dashoffset: -800; opacity: 0.6; }
        }
        @keyframes ld-aurora-1 {
          0%, 100% { transform: translate(0, 0)   scale(1);    }
          50%       { transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes ld-aurora-2 {
          0%, 100% { transform: translate(0, 0)    scale(1);    }
          50%       { transform: translate(-50px, 30px) scale(1.15); }
        }

        .ld-ring-outer {
          animation: ld-spin-cw 1.4s linear infinite;
        }
        .ld-ring-inner {
          animation: ld-spin-ccw 1s linear infinite;
        }
        .ld-pulse-ring {
          animation: ld-pulse-ring 1.4s ease-out infinite;
        }
        .ld-shimmer {
          background: linear-gradient(
            90deg,
            var(--color-bg-muted)  0%,
            var(--color-skeleton) 40%,
            var(--color-bg-muted)  80%
          );
          background-size: 200% 100%;
          animation: ld-shimmer 1.6s ease-in-out infinite;
        }
        .ld-dot {
          animation: ld-dot-bounce 1.2s ease-in-out infinite;
        }

        .ld-ecg-path {
          stroke-dasharray: 800;
          animation: ld-ecg-draw 1.2s 0.3s ease forwards,
                     ld-ecg-loop 1.8s 1.5s linear infinite;
        }

        .ld-aurora {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }
        .ld-a1 {
          width: 400px; height: 400px;
          top: -120px; right: -100px;
          background: radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%);
          animation: ld-aurora-1 10s ease-in-out infinite;
        }
        .ld-a2 {
          width: 360px; height: 360px;
          bottom: -100px; left: -80px;
          background: radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%);
          animation: ld-aurora-2 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
