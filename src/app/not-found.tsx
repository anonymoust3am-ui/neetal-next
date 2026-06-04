'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Stethoscope, BookOpen, BarChart2, Map } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Canvas — Dynamic particle background using system properties
// ─────────────────────────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // Using unified system token strings instead of hardcoded raw hex colors
    const BRAND = ['rgba(13,148,136,0.6)', 'rgba(124,58,237,0.6)', 'rgba(14,165,233,0.6)'];
    const COUNT = 50;
    const CONNECT = 120;

    interface P { x: number; y: number; vx: number; vy: number; r: number; color: string; }

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.8,
      color: BRAND[Math.floor(Math.random() * BRAND.length)],
    }));

    let raf: number;

    function tick() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < CONNECT) {
            const alpha = (1 - d / CONNECT) * 0.15;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(148,163,184,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      raf = requestAnimationFrame(tick);
    }

    tick();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.5 }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ECG Heartbeat Strip
// ─────────────────────────────────────────────────────────────────────────────
function EcgStrip() {
  return (
    <div className="absolute bottom-14 left-0 right-0 h-14 pointer-events-none overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1400 56" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="ecg-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(13,148,136,0)" />
            <stop offset="20%" stopColor="rgba(13,148,136,0.3)" />
            <stop offset="50%" stopColor="rgba(124,58,237,0.4)" />
            <stop offset="80%" stopColor="rgba(14,165,233,0.3)" />
            <stop offset="100%" stopColor="rgba(14,165,233,0)" />
          </linearGradient>
        </defs>
        <path
          className="ecg-path"
          d="M0,28 L100,28 L120,28 L132,6  L144,50 L156,8  L168,28 L190,28
             L290,28 L310,28 L322,6  L334,50 L346,8  L358,28 L380,28
             L480,28 L500,28 L512,6  L524,50 L536,8  L548,28 L570,28
             L670,28 L690,28 L702,6  L714,50 L726,8  L738,28 L760,28
             L860,28 L880,28 L892,6  L904,50 L916,8  L928,28 L950,28
             L1050,28 L1070,28 L1082,6 L1094,50 L1106,8 L1118,28 L1140,28
             L1240,28 L1260,28 L1272,6 L1284,50 L1296,8 L1308,28 L1400,28"
          fill="none" stroke="url(#ecg-g)" strokeWidth="1.5"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Interactive Custom Effects Hooks
// ─────────────────────────────────────────────────────────────────────────────
const GCHARS = '!<>-_\\/[]{}=+*^?#@$%&~|';

function useGlitch(target: string, period = 4000) {
  const [text, setText] = useState(target);
  const [shift, setShift] = useState(false);

  useEffect(() => {
    let frame = 0; let raf: number; let tout: ReturnType<typeof setTimeout>;
    const run = () => {
      frame++;
      if (frame < 18) {
        setShift(frame % 4 < 2);
        setText(target.split('').map((c, i) =>
          i < frame / 3 ? c : GCHARS[Math.floor(Math.random() * GCHARS.length)]
        ).join(''));
        raf = requestAnimationFrame(run);
      } else {
        setShift(false); setText(target);
        tout = setTimeout(() => { frame = 0; raf = requestAnimationFrame(run); }, period);
      }
    };
    raf = requestAnimationFrame(run);
    return () => { cancelAnimationFrame(raf); clearTimeout(tout); };
  }, [target, period]);

  return { text, shift };
}

function useTypewriter(full: string, startDelay = 500, charDelay = 25) {
  const [out, setOut] = useState('');
  useEffect(() => {
    let i = 0; let timer: ReturnType<typeof setTimeout>;
    const start = setTimeout(() => {
      const type = () => {
        setOut(full.slice(0, i));
        i++;
        if (i <= full.length) timer = setTimeout(type, charDelay);
      };
      type();
    }, startDelay);
    return () => { clearTimeout(start); clearTimeout(timer); };
  }, [full, startDelay, charDelay]);
  return out;
}

function useCountUp(target: number, ms = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null; let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / ms, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

function useParallax(str = 10) {
  const [off, setOff] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      setOff({ x: ((e.clientX - cx) / cx) * str, y: ((e.clientY - cy) / cy) * str });
    };
    window.addEventListener('mousemove', fn);
    return () => window.removeEventListener('mousemove', fn);
  }, [str]);
  return off;
}

function useTilt(el: React.RefObject<HTMLDivElement | null>, max = 5) {
  const [t, setT] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const node = el.current; if (!node) return;
    const move = (e: MouseEvent) => {
      const r = node.getBoundingClientRect();
      setT({
        x: ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -max,
        y: ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  max,
      });
    };
    const reset = () => setT({ x: 0, y: 0 });
    node.addEventListener('mousemove', move);
    node.addEventListener('mouseleave', reset);
    return () => { node.removeEventListener('mousemove', move); node.removeEventListener('mouseleave', reset); };
  }, [el, max]);
  return t;
}

// ─────────────────────────────────────────────────────────────────────────────
// Asset Arrays
// ─────────────────────────────────────────────────────────────────────────────
const FLOATERS = [
  { s: '+', x:  8, y: 15, d: 0,   sz: 16, o: 0.1,  c: 'var(--color-primary)' },
  { s: '⊕', x: 88, y: 20, d: 0.6, sz: 20, o: 0.08, c: 'var(--color-secondary)' },
  { s: '+', x: 12, y: 75, d: 1.1, sz: 14, o: 0.12, c: 'var(--color-accent)' },
  { s: '⊕', x: 84, y: 80, d: 1.7, sz: 18, o: 0.07, c: 'var(--color-primary)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Page Layout Render Engine
// ─────────────────────────────────────────────────────────────────────────────
export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [focused, setFocused] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const { text: glitch, shift } = useGlitch('404');
  const typed = useTypewriter("This page doesn't exist — or was moved. Let's get you back on track.");
  const counted = useCountUp(404, 1200);
  const par = useParallax(8);
  const tilt = useTilt(cardRef);

  useEffect(() => { setMounted(true); }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/dashboard?search=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center px-6 py-16 font-sans select-none">

      {/* Canvas Layer Integration */}
      {mounted && <ParticleCanvas />}

      {/* Decorative Aura Nodes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="n-aurora n-a1" />
        <div className="n-aurora n-a2" />
      </div>

      {/* Radial Grid Pattern Mask Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, var(--color-border-strong) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 50%, transparent 100%)',
        }}
      />

      {/* Float Symbols Layer */}
      {mounted && FLOATERS.map((f, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute pointer-events-none font-medium n-floater"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            fontSize: f.sz, opacity: f.o, color: f.c,
            animationDelay: `${f.d}s`,
          }}
        >{f.s}</span>
      ))}

      {/* Line Draw Pulse Section */}
      <EcgStrip />

      {/* Concentric Circle Geometry Layout */}
      <div aria-hidden className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none n-ring-cw border border-border/40" />
      <div aria-hidden className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none n-ring-ccw border border-border/30" />

      {/* Core Display Card Body Block */}
      <div
        ref={cardRef}
        className={`relative z-10 flex flex-col items-center text-center max-w-md w-full transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.15s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >

        {/* Identity Context Pill Indicator */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface/80 backdrop-blur-md shadow-sm">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-semibold text-foreground-muted tracking-wide">Neetell · Page not found</span>
          <span className="text-[10px] font-mono font-medium text-foreground-subtle bg-muted px-1.5 py-0.5 rounded-md border border-border">HTTP 404</span>
        </div>

        {/* Digital Hologram Indicator Section */}
        <div
          className="relative mb-2"
          style={{
            transform: `translate(${par.x * 0.25}px, ${par.y * 0.25}px)`,
            transition: 'transform 0.1s linear',
          }}
        >
          {/* Main Numeric Character Grid */}
          <p
            className="relative font-bold leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(96px, 16vw, 150px)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 50%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontVariantNumeric: 'tabular-nums',
              filter: shift
                ? 'drop-shadow(2px 0 rgba(220,38,38,0.4)) drop-shadow(-2px 0 rgba(14,165,233,0.4))'
                : 'drop-shadow(0 4px 12px var(--color-border))',
            }}
          >
            {glitch}
          </p>
        </div>

        {/* Context Configuration Metadata Trace */}
        <div className="mb-4 font-mono text-[11px] text-foreground-subtle tracking-wider">
          error_code:&nbsp;
          <span className="text-primary font-bold">{String(counted).padStart(3, '0')}</span>
          &nbsp;·&nbsp;
          <span className="text-foreground-subtle">status: NOT_FOUND</span>
        </div>

        {/* Title Elements */}
        <h1 className="text-2xl font-bold text-foreground mb-2 tracking-tight">
          Lost in the wards?
        </h1>

        {/* Dynamic Character Layout Buffer Context */}
        <p className="text-sm text-foreground-muted mb-6 max-w-xs leading-relaxed min-h-10">
          {typed}
          <span className="inline-block w-[2px] h-[12px] bg-primary ml-0.5 align-middle n-blink" />
        </p>

        {/* Completed Search Mechanism Integration */}
        <form 
          onSubmit={handleSearchSubmit} 
          className={`relative w-full rounded-lg bg-input border transition-all duration-200 flex items-center px-3 mb-6 ${focused ? 'border-border-focus ring-1 ring-border-focus shadow-sm' : 'border-border'}`}
        >
          <Search size={16} className="text-foreground-subtle shrink-0" />
          <input
            type="text"
            placeholder="Search platform routes..."
            value={search}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 px-2 bg-transparent text-sm text-foreground placeholder:text-foreground-subtle outline-none border-none"
          />
        </form>

        {/* Control Interactions Elements Frame Layer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-semibold transition-colors hover:bg-primary-hover active:scale-[0.98]"
          >
            <Home size={14} />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md border border-border bg-surface text-sm font-semibold text-foreground-muted hover:bg-hover hover:text-foreground active:scale-[0.98] transition-colors"
          >
            <ArrowLeft size={14} />
            Go Back
          </button>
        </div>

      </div>

      {/* Styled Sheet Directives */}
      <style>{`
        @keyframes nf-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%       { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes nf-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes nf-ring-cw  { to { transform: rotate(360deg);  } }
        @keyframes nf-ring-ccw { to { transform: rotate(-360deg); } }

        .n-floater { animation: nf-float 4s ease-in-out infinite; }
        .n-blink   { animation: nf-blink 1s step-end infinite; }
        .n-ring-cw  { animation: nf-ring-cw  40s linear infinite; transform-origin: center; }
        .n-ring-ccw { animation: nf-ring-ccw 25s linear infinite; transform-origin: center; }

        .n-aurora {
          position: absolute;
          border-radius: var(--radius-full);
          filter: blur(80px);
          pointer-events: none;
          opacity: 0.6;
        }
        .n-a1 {
          width: 400px; height: 400px;
          top: -100px; right: -100px;
          background: radial-gradient(circle, var(--color-primary-light) 0%, transparent 70%);
        }
        .n-a2 {
          width: 450px; height: 450px;
          bottom: -150px; left: -150px;
          background: radial-gradient(circle, var(--color-secondary-light) 0%, transparent 70%);
        }

        .ecg-path {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
          animation: draw 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}