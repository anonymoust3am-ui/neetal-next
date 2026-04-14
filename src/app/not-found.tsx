'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search, Stethoscope, BookOpen, BarChart2, Map } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Canvas — particle network with connecting lines
// ─────────────────────────────────────────────────────────────────────────────
function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const BRAND = ['#0d9488', '#7c3aed', '#0ea5e9', '#14b8a6', '#8b5cf6'];
    const COUNT = 65;
    const CONNECT = 130;

    interface P { x: number; y: number; vx: number; vy: number; r: number; color: string; }

    let W = (canvas.width  = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2.2 + 0.8,
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
            const alpha = (1 - d / CONNECT) * 0.22;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(13,148,136,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + 'aa';
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

  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.65 }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// ECG / heartbeat strip
// ─────────────────────────────────────────────────────────────────────────────
function EcgStrip() {
  return (
    <div className="absolute bottom-14 left-0 right-0 h-14 pointer-events-none overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1400 56" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="ecg-g" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="rgba(13,148,136,0)" />
            <stop offset="20%"  stopColor="rgba(13,148,136,0.6)" />
            <stop offset="50%"  stopColor="rgba(124,58,237,0.7)" />
            <stop offset="80%"  stopColor="rgba(14,165,233,0.6)" />
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
          fill="none" stroke="url(#ecg-g)" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// hooks
// ─────────────────────────────────────────────────────────────────────────────
const GCHARS = '!<>-_\\/[]{}=+*^?#@$%&~|';

function useGlitch(target: string, period = 3200) {
  const [text, setText] = useState(target);
  const [shift, setShift] = useState(false);

  useEffect(() => {
    let frame = 0; let raf: number; let tout: ReturnType<typeof setTimeout>;
    const run = () => {
      frame++;
      if (frame < 22) {
        setShift(frame % 4 < 2);
        setText(target.split('').map((c, i) =>
          i < frame / 2.8 ? c : GCHARS[Math.floor(Math.random() * GCHARS.length)]
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

function useTypewriter(full: string, startDelay = 700, charDelay = 32) {
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

function useCountUp(target: number, ms = 1300) {
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

function useParallax(str = 14) {
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

function useTilt(el: React.RefObject<HTMLDivElement | null>, max = 7) {
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
// data
// ─────────────────────────────────────────────────────────────────────────────
const LINKS = [
  { href: '/dashboard',           icon: BarChart2,   label: 'Dashboard',  accent: '#0d9488' },
  { href: '/dashboard/colleges',  icon: BookOpen,    label: 'Colleges',   accent: '#7c3aed' },
  { href: '/dashboard/predictor', icon: Stethoscope, label: 'Predictor',  accent: '#0ea5e9' },
  { href: '/dashboard/guides',    icon: Map,         label: 'Guides',     accent: '#14b8a6' },
];

const FLOATERS = [
  { s: '+', x:  7, y: 14, d: 0,   sz: 18, o: 0.13, c: '#0d9488' },
  { s: '⊕', x: 89, y: 18, d: 0.6, sz: 22, o: 0.1,  c: '#7c3aed' },
  { s: '+', x: 14, y: 72, d: 1.1, sz: 15, o: 0.14, c: '#0ea5e9' },
  { s: '⊕', x: 82, y: 78, d: 1.7, sz: 20, o: 0.09, c: '#0d9488' },
  { s: '+', x: 52, y:  7, d: 0.9, sz: 17, o: 0.11, c: '#7c3aed' },
  { s: '⊕', x: 94, y: 52, d: 2.1, sz: 24, o: 0.08, c: '#0ea5e9' },
  { s: '+', x:  4, y: 48, d: 1.4, sz: 21, o: 0.1,  c: '#14b8a6' },
  { s: '⊕', x: 45, y: 92, d: 0.4, sz: 19, o: 0.1,  c: '#8b5cf6' },
];

// ─────────────────────────────────────────────────────────────────────────────
// page
// ─────────────────────────────────────────────────────────────────────────────
export default function NotFound() {
  const [mounted, setMounted]   = useState(false);
  const [search,  setSearch]    = useState('');
  const [focused, setFocused]   = useState(false);

  const cardRef  = useRef<HTMLDivElement>(null);
  const { text: glitch, shift } = useGlitch('404');
  const typed   = useTypewriter("This page doesn't exist — or was moved. Let's get you back on track.");
  const counted = useCountUp(404, 1400);
  const par     = useParallax(13);
  const tilt    = useTilt(cardRef);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden flex flex-col items-center justify-center px-6 py-20 font-sans select-none">

      {/* ── canvas network ── */}
      {mounted && <ParticleCanvas />}

      {/* ── aurora blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="n-aurora n-a1" />
        <div className="n-aurora n-a2" />
        <div className="n-aurora n-a3" />
      </div>

      {/* ── full-page dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(13,148,136,0.18) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* ── medical float symbols ── */}
      {mounted && FLOATERS.map((f, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute pointer-events-none font-black n-floater"
          style={{
            left: `${f.x}%`, top: `${f.y}%`,
            fontSize: f.sz, opacity: f.o, color: f.c,
            animationDelay: `${f.d}s`,
          }}
        >{f.s}</span>
      ))}

      {/* ── ECG strip ── */}
      <EcgStrip />

      {/* ── decorative spinning rings ── */}
      <div aria-hidden className="absolute -top-36 -right-36 w-[420px] h-[420px] rounded-full pointer-events-none n-ring-cw"
        style={{ border: '1px solid rgba(13,148,136,0.13)', boxShadow: 'inset 0 0 60px rgba(13,148,136,0.04)' }} />
      <div aria-hidden className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none"
        style={{ border: '1px dashed rgba(124,58,237,0.1)' }} />
      <div aria-hidden className="absolute -bottom-28 -left-28 w-80 h-80 rounded-full pointer-events-none n-ring-ccw"
        style={{ border: '1px solid rgba(14,165,233,0.1)' }} />
      <div aria-hidden className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full pointer-events-none"
        style={{ border: '1px dashed rgba(13,148,136,0.08)' }} />

      {/* ── main card ── */}
      <div
        ref={cardRef}
        className={`relative z-10 flex flex-col items-center text-center max-w-xl w-full transition-opacity duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        style={{
          transform: `perspective(1100px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.18s ease',
        }}
      >

        {/* brand pill */}
        <div
          className="mb-8 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-border bg-surface/80 backdrop-blur-md shadow-sm"
          style={{ animation: mounted ? 'nf-pill 0.55s 0.1s ease both' : 'none' }}
        >
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-xs font-semibold text-foreground-muted tracking-wide">NeEtal · Page not found</span>
          <span className="text-[10px] font-mono text-foreground-subtle bg-muted px-2 py-0.5 rounded-md border border-border">HTTP 404</span>
        </div>

        {/* ── 404 with parallax + glow + glitch + scanlines ── */}
        <div
          className="relative mb-1"
          style={{
            transform: `translate(${par.x * 0.35}px, ${par.y * 0.35}px)`,
            transition: 'transform 0.12s linear',
          }}
        >
          {/* glow bloom */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            aria-hidden
            style={{ filter: 'blur(55px)' }}
          >
            <span
              className="font-black leading-none"
              style={{
                fontSize: 'clamp(90px, 18vw, 180px)',
                background: 'linear-gradient(135deg, #0d9488, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                opacity: 0.45,
              }}
            >404</span>
          </div>

          {/* main number */}
          <p
            className="relative font-black leading-none tracking-tighter"
            style={{
              fontSize: 'clamp(90px, 18vw, 180px)',
              background: 'linear-gradient(135deg, #0d9488 0%, #7c3aed 50%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontVariantNumeric: 'tabular-nums',
              filter: shift
                ? 'drop-shadow(3px 0 rgba(255,0,80,0.5)) drop-shadow(-3px 0 rgba(0,220,255,0.5)) brightness(1.1)'
                : 'drop-shadow(0 0 28px rgba(13,148,136,0.28))',
              transition: 'filter 0.05s',
            }}
          >{glitch}</p>

          {/* scanlines */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.022) 2px, rgba(0,0,0,0.022) 4px)',
            }}
          />

          {/* corner brackets */}
          <div aria-hidden className="absolute top-2 left-2 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid rgba(13,148,136,0.4)', borderLeft: '2px solid rgba(13,148,136,0.4)' }} />
          <div aria-hidden className="absolute top-2 right-2 w-5 h-5 pointer-events-none" style={{ borderTop: '2px solid rgba(124,58,237,0.4)', borderRight: '2px solid rgba(124,58,237,0.4)' }} />
          <div aria-hidden className="absolute bottom-2 left-2 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid rgba(14,165,233,0.4)', borderLeft: '2px solid rgba(14,165,233,0.4)' }} />
          <div aria-hidden className="absolute bottom-2 right-2 w-5 h-5 pointer-events-none" style={{ borderBottom: '2px solid rgba(13,148,136,0.4)', borderRight: '2px solid rgba(13,148,136,0.4)' }} />
        </div>

        {/* count-up badge */}
        <div
          className="mb-5 font-mono text-[11px] text-foreground-subtle tracking-widest"
          style={{ animation: mounted ? 'nf-up 0.5s 0.55s ease both' : 'none' }}
        >
          error_code:&nbsp;
          <span className="text-primary font-bold">{String(counted).padStart(3, '0')}</span>
          &nbsp;·&nbsp;
          <span className="text-foreground-subtle">status: NOT_FOUND</span>
        </div>

        {/* headline */}
        <h1
          className="text-[26px] sm:text-3xl font-bold text-foreground mb-3 leading-tight"
          style={{ animation: mounted ? 'nf-up 0.6s 0.3s ease both' : 'none' }}
        >
          Lost in the wards?
        </h1>

        {/* typewriter */}
        <p
          className="text-base text-foreground-muted mb-8 max-w-sm leading-relaxed"
          style={{ minHeight: 52, animation: mounted ? 'nf-up 0.6s 0.4s ease both' : 'none' }}
        >
          {typed}
          <span className="inline-block w-[2px] h-[15px] bg-primary ml-0.5 align-middle n-blink" />
        </p>

        {/* search with animated focus ring */}
        <div
          className="relative w-full max-w-sm mb-8"
          style={{ animation: mounted ? 'nf-up 0.6s 0.5s ease both' : 'none' }}
        >
          {/* animated gradient border on focus */}
          {focused && (
            <div
              className="absolute -inset-[2px] rounded-[18px] pointer-events-none n-search-glow"
              style={{
                background: 'linear-gradient(135deg, #0d9488, #7c3aed, #0ea5e9, #0d9488)',
                backgroundSize: '300% 300%',
                animation: 'nf-grad-spin 2s linear infinite',
              }}
            />
          )}
          <div className="relative">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-subtle pointer-events-none z-10" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="Search colleges, cutoffs, counselling…"
              className="w-full h-12 pl-10 pr-4 rounded-2xl border border-border bg-surface/90 backdrop-blur-md text-sm text-foreground placeholder:text-foreground-subtle focus:outline-none transition-all shadow-sm relative z-[1]"
              style={{ borderColor: focused ? 'transparent' : undefined }}
            />
          </div>
        </div>

        {/* quick link cards */}
        <div
          className="grid grid-cols-4 gap-3 w-full mb-8"
          style={{ animation: mounted ? 'nf-up 0.6s 0.6s ease both' : 'none' }}
        >
          {LINKS.map(({ href, icon: Icon, label, accent }, i) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2.5 px-2 py-4 rounded-2xl border border-border bg-surface/80 backdrop-blur-md hover:shadow-lg transition-all duration-200 overflow-hidden relative"
              style={{ animationDelay: `${0.62 + i * 0.06}s` }}
            >
              {/* hover fill */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                style={{ background: `${accent}0d` }}
              />
              <div
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${accent}18` }}
              >
                <Icon size={18} style={{ color: accent }} className="opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="relative text-[11px] font-semibold text-foreground-muted group-hover:text-foreground transition-colors">{label}</span>
            </Link>
          ))}
        </div>

        {/* CTA row */}
        <div
          className="flex flex-wrap items-center justify-center gap-3"
          style={{ animation: mounted ? 'nf-up 0.6s 0.75s ease both' : 'none' }}
        >
          <Link
            href="/dashboard"
            className="group relative flex items-center gap-2 h-11 px-7 rounded-2xl bg-primary text-white text-sm font-semibold overflow-hidden transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.97]"
            style={{ boxShadow: '0 4px 24px rgba(13,148,136,0.3)' }}
          >
            {/* shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-600 ease-in-out" />
            <Home size={15} />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 h-11 px-6 rounded-2xl border border-border bg-surface/80 backdrop-blur-md text-sm font-semibold text-foreground-muted hover:border-border-strong hover:text-foreground active:scale-[0.97] transition-all"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
        </div>

        {/* status row */}
        <p
          className="mt-8 text-[11px] text-foreground-subtle font-mono"
          style={{ animation: mounted ? 'nf-up 0.5s 0.9s ease both' : 'none' }}
        >
          neetal.app&nbsp;·&nbsp;
          <span className="text-primary">v2.5.0</span>&nbsp;·&nbsp;
          <Link href="/dashboard" className="hover:text-foreground transition-colors">sitemap</Link>
        </p>
      </div>

      {/* ── keyframes ── */}
      <style>{`
        @keyframes nf-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes nf-pill {
          from { opacity: 0; transform: scale(0.88) translateY(-8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes nf-float {
          0%, 100% { transform: translateY(0)    rotate(0deg); }
          50%       { transform: translateY(-14px) rotate(10deg); }
        }
        @keyframes nf-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes nf-ring-cw  { to { transform: rotate(360deg);  } }
        @keyframes nf-ring-ccw { to { transform: rotate(-360deg); } }
        @keyframes nf-aurora1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(70px,-50px) scale(1.12); }
          66%       { transform: translate(-45px,35px) scale(0.93); }
        }
        @keyframes nf-aurora2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-90px,60px) scale(1.18); }
        }
        @keyframes nf-aurora3 {
          0%, 100% { transform: translate(0,0) scale(1); }
          40%       { transform: translate(55px,75px) scale(1.1); }
          80%       { transform: translate(-30px,-25px) scale(0.88); }
        }
        @keyframes nf-ecg-draw {
          from { stroke-dashoffset: 3000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes nf-ecg-pulse {
          0%, 100% { opacity: 0.35; }
          50%       { opacity: 0.9; }
        }
        @keyframes nf-grad-spin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .n-floater { animation: nf-float 4.5s ease-in-out infinite; }
        .n-blink   { animation: nf-blink 1.1s step-end infinite; }
        .n-ring-cw  { animation: nf-ring-cw  35s linear infinite; transform-origin: center; }
        .n-ring-ccw { animation: nf-ring-ccw 22s linear infinite; transform-origin: center; }

        .n-aurora {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }
        .n-a1 {
          width: 520px; height: 520px;
          top: -130px; right: -130px;
          background: radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 70%);
          animation: nf-aurora1 13s ease-in-out infinite;
        }
        .n-a2 {
          width: 620px; height: 620px;
          bottom: -180px; left: -180px;
          background: radial-gradient(circle, rgba(124,58,237,0.11) 0%, transparent 70%);
          animation: nf-aurora2 17s ease-in-out infinite;
        }
        .n-a3 {
          width: 420px; height: 420px;
          top: 35%; left: 38%;
          background: radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%);
          animation: nf-aurora3 11s ease-in-out infinite;
        }

        .ecg-path {
          stroke-dasharray: 3000;
          animation: nf-ecg-draw 2.8s 0.5s ease forwards,
                     nf-ecg-pulse 2.5s 3.3s ease-in-out infinite;
        }

        .n-search-glow { border-radius: 18px; }
      `}</style>
    </div>
  );
}
