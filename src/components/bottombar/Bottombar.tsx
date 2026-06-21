'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { bottomNavItems } from './BottomNavConfig';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const theme = {
  primary: 'var(--color-primary)',
  primaryForeground: 'var(--color-primary-foreground)',
  primaryLight: 'var(--color-primary-light)',
  surface: 'var(--color-bg-secondary)',
  surfaceElevated: 'var(--color-bg-elevated)',
  border: 'var(--color-border)',
  text: 'var(--color-text-primary)',
  textMuted: 'var(--color-text-muted)',
  shadow: 'var(--shadow-lg)',
};

/* ── SVG glass distortion filter — kept for desktop ── */
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

/* ── Three stacked glass layers — kept for desktop ── */
function GlassLayers({ borderRadius = 24 }: { borderRadius?: number }) {
  return (
    <>
      <div
        className="absolute inset-0 z-0 overflow-hidden"
        style={{
          borderRadius,
          backdropFilter: 'blur(3.5px)',
          filter: 'url(#bnav-glass)',
          isolation: 'isolate',
        }}
      />
      <div
        className="absolute inset-0 z-10"
        style={{
          borderRadius,
          background: 'color-mix(in srgb, var(--color-bg-elevated) 82%, transparent)',
          border: '1px solid color-mix(in srgb, var(--color-border) 76%, transparent)',
        }}
      />
      <div
        className="absolute inset-0 z-20 overflow-hidden"
        style={{
          borderRadius,
          boxShadow:
            'inset 1px 1px 0 color-mix(in srgb, var(--color-text-inverse) 32%, transparent), inset -1px -1px 0 color-mix(in srgb, var(--color-border-strong) 34%, transparent)',
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
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Screen size detection hydration guard
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is the standard Tailwind md breakpoint
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setNavHidden(false);
      return;
    }

    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;

      if (scrollStopRef.current) clearTimeout(scrollStopRef.current);

      if (currentY < 24) {
        setNavHidden(false);
      } else if (delta > 6) {
        setNavHidden(true);
      } else if (delta < -6) {
        setNavHidden(false);
      }

      lastScrollYRef.current = currentY;
      scrollStopRef.current = setTimeout(() => setNavHidden(false), 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStopRef.current) clearTimeout(scrollStopRef.current);
    };
  }, [isMobile]);

  useEffect(() => {
    setNavHidden(false);
  }, [pathname]);

  const isPathMatch = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const matchedNavItem = bottomNavItems.find((item) =>
    item.href === '/dashboard' ? pathname === '/dashboard' : isPathMatch(item.href)
  );

  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === '/dashboard' || (pathname.startsWith('/dashboard') && !matchedNavItem)
      : isPathMatch(href);

  // Prevent flash of layout before hook runs on client mount
  if (isMobile === null) return null;

  /* ─────────────────────────────────────────────────────────
     MOBILE COMPONENT: Fixed bottom, solid background, active pop out
     ───────────────────────────────────────────────────────── */
  if (isMobile) {
    return (
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[1200] bg-surface border-t border-border shadow-lg rounded-t-[24px] px-2 pb-safe-bottom transition-transform duration-300 ease-out',
          navHidden && 'translate-y-[calc(100%+12px)] pointer-events-none'
        )}
      >
        <nav className="flex items-end justify-between w-full h-[72px] max-w-md mx-auto px-4">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            const isCenter = item.key === 'dashboard';

            return (
              <Link
                key={item.key}
                href={item.href}
                className="relative flex flex-col items-center justify-center flex-1 h-full pb-2 select-none group"
              >
                {/* Visual Pop-out Wrapper for Icon */}
                <div
                  className={cn(
                    "flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    active
                      ? isCenter
                        ? "w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md -translate-y-4"
                        : "w-12 h-12 rounded-2xl bg-primary text-primary-foreground shadow-md -translate-y-4"
                      : "w-10 h-10 text-icon-muted group-hover:text-foreground-muted"
                  )}
                >
                  <Icon
                    size={isCenter && active ? 26 : 22}
                    strokeWidth={active ? 2.2 : 1.8}
                    className="transition-transform duration-200"
                  />
                </div>

                {/* Micro Label directly below the icon */}
                <span
                  className="absolute bottom-1 text-[11px] font-bold tracking-tight text-center transition-all duration-250 ease-out"
                  style={{
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateY(0) scale(1)' : 'translateY(4px) scale(0.9)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    );
  }

  /* ─────────────────────────────────────────────────────────
     DESKTOP COMPONENT: Unchanged floating glass layout
     ───────────────────────────────────────────────────────── */
  return (
    <>
      <GlassFilter />

      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[1200] flex justify-center w-full px-4 pointer-events-none">
        <nav
          className="pointer-events-auto relative flex items-center gap-1 overflow-hidden"
          style={{
            padding: 7,
            borderRadius: 32,
            boxShadow: theme.shadow,
            transitionTimingFunction: 'cubic-bezier(0.175,0.885,0.32,2.2)',
          }}
        >
          <GlassLayers borderRadius={32} />

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
                    ? `0 8px 18px color-mix(in srgb, ${theme.primary} 28%, transparent)`
                    : 'none',
                  transitionTimingFunction: 'cubic-bezier(0.175,0.885,0.32,2.2)',
                }}
              >
                {active && (
                  <>
                    <div
                      className="absolute inset-0 z-0 overflow-hidden"
                      style={{
                        borderRadius: br,
                        backdropFilter: 'blur(4px)',
                        filter: 'url(#bnav-glass)',
                        isolation: 'isolate',
                      }}
                    />
                    <div
                      className="absolute inset-0 z-10"
                      style={{
                        borderRadius: br,
                        background: isCenter
                          ? `linear-gradient(155deg, ${theme.primary} 0%, color-mix(in srgb, ${theme.primary} 86%, ${theme.surface} 14%) 100%)`
                          : `color-mix(in srgb, ${theme.primaryLight} 86%, transparent)`,
                      }}
                    />
                    <div
                      className="absolute inset-0 z-20 overflow-hidden"
                      style={{
                        borderRadius: br,
                        boxShadow:
                          'inset 1px 1px 0 color-mix(in srgb, var(--color-primary-foreground) 38%, transparent), inset -1px -1px 0 color-mix(in srgb, var(--color-border-strong) 26%, transparent)',
                      }}
                    />
                  </>
                )}

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
                        background: `color-mix(in srgb, ${theme.surfaceElevated} 72%, transparent)`,
                      }}
                    />
                    <div
                      className="absolute inset-0 z-20 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        borderRadius: br,
                        boxShadow:
                          'inset 1px 1px 0 color-mix(in srgb, var(--color-text-inverse) 20%, transparent), inset -1px -1px 0 color-mix(in srgb, var(--color-border-strong) 22%, transparent)',
                      }}
                    />
                  </>
                )}

                <Icon
                  size={iconSize}
                  strokeWidth={active ? 2.1 : 1.8}
                  className="relative z-30 flex-shrink-0 transition-all duration-[220ms] group-hover:scale-[1.1]"
                  style={{
                    color: active
                      ? isCenter
                        ? theme.primaryForeground
                        : theme.primary
                      : theme.textMuted,
                    transitionTimingFunction: 'cubic-bezier(0.175,0.885,0.32,2.2)',
                  }}
                />

                <span
                  className={cn('relative z-30', !active && 'group-hover:!max-w-[110px] group-hover:!opacity-60 group-hover:!ml-2')}
                  style={{
                    ...labelBase,
                    maxWidth: active ? (isCenter ? 110 : 100) : 0,
                    opacity: active ? 1 : 0,
                    marginLeft: active ? (isCenter ? 9 : 8) : 0,
                    color: active
                      ? isCenter
                        ? theme.primaryForeground
                        : theme.primary
                      : theme.textMuted,
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
