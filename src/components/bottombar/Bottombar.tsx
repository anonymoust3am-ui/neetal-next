'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { bottomNavItems } from './BottomNavConfig';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ── SVG glass distortion filter — same as reference code ── */
function GlassFilter() {
  return (
    <svg style={{ display: 'none' }}>
      <filter
        id="bnav-glass"
        x="0%"
        y="0%"
        width="100%"
        height="100%"
        filterUnits="objectBoundingBox"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.001 0.005"
          numOctaves="1"
          seed="17"
          result="turbulence"
        />
        <feComponentTransfer in="turbulence" result="mapped">
          <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
          <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
          <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
        </feComponentTransfer>
        <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
        <feSpecularLighting
          in="softMap"
          surfaceScale="5"
          specularConstant="1"
          specularExponent="100"
          lightingColor="white"
          result="specLight"
        >
          <fePointLight x="-200" y="-200" z="300" />
        </feSpecularLighting>
        <feComposite
          in="specLight"
          operator="arithmetic"
          k1="0"
          k2="1"
          k3="1"
          k4="0"
          result="litImage"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="softMap"
          scale="200"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
    </svg>
  );
}

/* ── Three stacked glass layers — same technique as reference ── */
function GlassLayers({ borderRadius = 24 }: { borderRadius?: number }) {
  return (
    <>
      {/* Layer 1 — backdrop blur + SVG distortion */}
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          borderRadius,
          backdropFilter: 'blur(3.5px)',
          filter: 'url(#bnav-glass)',
          isolation: 'isolate',
        }}
      />
      {/* Layer 2 — white tint */}
      <div
        className="absolute inset-0 z-10"
        style={{
          borderRadius,
          background: 'rgba(255,255,255,0.22)',
        }}
      />
      {/* Layer 3 — inset rim highlights */}
      <div
        className="absolute inset-0 z-20 overflow-hidden"
        style={{
          borderRadius,
          boxShadow:
            'inset 2px 2px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 1px rgba(255,255,255,0.45)',
        }}
      />
    </>
  );
}

const labelBase: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  pointerEvents: 'none',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif",
  transition:
    'max-width 0.35s cubic-bezier(0.34,1.4,0.64,1), opacity 0.25s ease, margin-left 0.35s cubic-bezier(0.34,1.4,0.64,1)',
};

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <GlassFilter />

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1200] flex justify-center w-full px-4 pointer-events-none">
        {/* ── NAV PILL — outer glass shell ── */}
        <nav
          className="pointer-events-auto relative flex items-center gap-1 overflow-hidden"
          style={{
            padding: 7,
            borderRadius: 32,
            boxShadow: '0 6px 6px rgba(0,0,0,0.2), 0 0 20px rgba(0,0,0,0.1)',
            transitionTimingFunction: 'cubic-bezier(0.175,0.885,0.32,2.2)',
          }}
        >
          <GlassLayers borderRadius={32} />

          {/* ── ITEMS ── */}
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isCenter = item.key === 'dashboard';
            const iconSize = isCenter ? 26 : 24;
            const br = isCenter ? 24 : 22;
            const h = isCenter ? 58 : 52;
            const minW = isCenter ? 58 : 52;

            return (
              <Link
                key={item.key}
                href={item.href}
                className="group relative flex flex-row items-center z-30 overflow-hidden"
                style={{
                  height: h,
                  minWidth: minW,
                  borderRadius: br,
                  padding: isCenter ? '0 16px' : '0 14px',
                  cursor: 'pointer',
                  transition:
                    'min-width 0.35s cubic-bezier(0.34,1.4,0.64,1), box-shadow 0.25s ease',
                  boxShadow: active
                    ? isCenter
                      ? '0 6px 6px rgba(0,0,0,0.18), 0 0 16px rgba(0,0,0,0.08)'
                      : '0 4px 12px rgba(0,0,0,0.12), 0 0 10px rgba(0,0,0,0.06)'
                    : 'none',
                  transitionTimingFunction: 'cubic-bezier(0.175,0.885,0.32,2.2)',
                }}
              >
                {/* Per-item glass layers when active OR on hover */}
                {active && (
                  <>
                    {/* distortion layer */}
                    <div
                      className="absolute inset-0 z-0 overflow-hidden"
                      style={{
                        borderRadius: br,
                        backdropFilter: 'blur(4px)',
                        filter: 'url(#bnav-glass)',
                        isolation: 'isolate',
                      }}
                    />
                    {/* tint — teal for center, white for others */}
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        borderRadius: br,
                        background: isCenter
                          ? 'linear-gradient(155deg, rgba(13,180,165,0.88) 0%, rgba(9,138,126,0.92) 100%)'
                          : 'rgba(255,255,255,0.38)',
                      }}
                    />
                    {/* rim */}
                    <div
                      className="absolute inset-0 z-20 overflow-hidden"
                      style={{
                        borderRadius: br,
                        boxShadow:
                          'inset 2px 2px 1px 0 rgba(255,255,255,0.55), inset -1px -1px 1px 1px rgba(255,255,255,0.45)',
                      }}
                    />
                  </>
                )}

                {/* hover glass — only for inactive items */}
                {!active && (
                  <>
                    <div
                      className="absolute inset-0 z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderRadius: br,
                        backdropFilter: 'blur(3px)',
                        filter: 'url(#bnav-glass)',
                        isolation: 'isolate',
                      }}
                    />
                    <div
                      className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderRadius: br,
                        background: 'rgba(255,255,255,0.18)',
                      }}
                    />
                    <div
                      className="absolute inset-0 z-20 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderRadius: br,
                        boxShadow:
                          'inset 2px 2px 1px 0 rgba(255,255,255,0.4), inset -1px -1px 1px 1px rgba(255,255,255,0.35)',
                      }}
                    />
                  </>
                )}

                {/* Icon */}
                <Icon
                  size={iconSize}
                  strokeWidth={active ? 2.1 : 1.8}
                  className="relative z-30 flex-shrink-0 transition-all duration-[220ms] group-hover:scale-[1.1]"
                  style={{
                    color: active
                      ? isCenter
                        ? '#ffffff'
                        : '#0d9488'
                      : 'rgba(30,30,50,0.42)',
                    transitionTimingFunction: 'cubic-bezier(0.175,0.885,0.32,2.2)',
                  }}
                />

                {/* Label */}
                <span
                  className={cn('relative z-30', !active && 'group-hover:!max-w-[110px] group-hover:!opacity-60 group-hover:!ml-2')}
                  style={{
                    ...labelBase,
                    maxWidth: active ? (isCenter ? 110 : 100) : 0,
                    opacity: active ? 1 : 0,
                    marginLeft: active ? (isCenter ? 9 : 8) : 0,
                    color: active
                      ? isCenter
                        ? 'rgba(255,255,255,0.95)'
                        : '#0d9488'
                      : 'rgba(30,30,50,0.60)',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}