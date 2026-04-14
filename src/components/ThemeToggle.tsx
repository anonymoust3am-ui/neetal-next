'use client';

import { useTheme } from '@/hooks/useTheme';
import { CSSProperties } from 'react';

interface ThemeToggleProps {
  showLabel?: boolean;
  width?: number | string;
  height?: number | string;
}

export function ThemeToggle({
  showLabel = true,
  width,
  height,
}: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const style: CSSProperties = {
    ...(width !== undefined && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height !== undefined && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      style={style}
      className={[
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden',
        'rounded-full border border-border bg-surface px-4 py-2',
        'text-sm font-medium text-foreground shadow-sm',
        'transition-all duration-300 ease-in-out',
        'hover:bg-muted hover:shadow-md active:scale-95',
        !showLabel ? 'aspect-square' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Ripple overlay on click */}
      <span
        className="pointer-events-none absolute inset-0 rounded-full bg-current opacity-0
                   transition-opacity duration-150 group-active:opacity-10"
      />

      {/* Animated icon container */}
      <span className="relative flex h-4 w-4 items-center justify-center">
        {/* Sun icon */}
        <SunIcon
          className={[
            'absolute transition-all duration-500 ease-in-out',
            isDark
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0',
          ].join(' ')}
        />
        {/* Moon icon */}
        <MoonIcon
          className={[
            'absolute transition-all duration-500 ease-in-out',
            isDark
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          ].join(' ')}
        />
      </span>

      {/* Animated label */}
      {showLabel && (
        <span
          className="relative overflow-hidden"
          style={{ minWidth: '2.75rem' }}
        >
          {/* "Light" label */}
          <span
            className={[
              'block transition-all duration-300 ease-in-out',
              isDark
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0 absolute inset-0',
            ].join(' ')}
          >
            Light
          </span>
          {/* "Dark" label */}
          <span
            className={[
              'block transition-all duration-300 ease-in-out',
              isDark
                ? 'translate-y-full opacity-0 absolute inset-0'
                : 'translate-y-0 opacity-100',
            ].join(' ')}
          >
            Dark
          </span>
        </span>
      )}
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}