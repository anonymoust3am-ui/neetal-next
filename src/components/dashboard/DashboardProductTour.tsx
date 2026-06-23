'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type TourStep = {
  selector: string;
  title: string;
  body: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
};

type TargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

const TOUR_STORAGE_KEY = 'neetell.dashboard.product-tour.v2';

const TOUR_STEPS: TourStep[] = [
  {
    selector: '[data-tour="top-counselling"]',
    title: 'Counselling selector',
    body: 'Switch between counselling bodies and states from here.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="top-search"]',
    title: 'Search colleges',
    body: 'Search colleges, states, and counselling content from the top bar.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="top-news"]',
    title: 'Blogs and news',
    body: 'Open counselling updates, explainers, and latest NEET articles.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="top-notifications"]',
    title: 'Notifications',
    body: 'Important updates and reminders appear here.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="top-expert"]',
    title: 'Talk to expert',
    body: 'Use this when you want direct counselling help.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="top-profile"]',
    title: 'Profile menu',
    body: 'Manage your profile, appearance, support, and logout.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="bottom-choices"]',
    title: 'Choice lists',
    body: 'Build and organize your counselling preference lists.',
    placement: 'top',
  },
  {
    selector: '[data-tour="bottom-predictor"]',
    title: 'Predictor',
    body: 'Find safe, target, and dream colleges from your rank.',
    placement: 'top',
  },
  {
    selector: '[data-tour="bottom-compare"]',
    title: 'Compare',
    body: 'Compare colleges side by side before final ordering.',
    placement: 'top',
  },
  {
    selector: '[data-tour="bottom-dashboard"]',
    title: 'Dashboard',
    body: 'Return to your main counselling overview anytime.',
    placement: 'top',
  },
  {
    selector: '[data-tour="bottom-neet-ai"]',
    title: 'NEET AI',
    body: 'Ask counselling, cutoff, and choice-filling questions.',
    placement: 'top',
  },
  {
    selector: '[data-tour="bottom-allotment"]',
    title: 'Allotment',
    body: 'Explore allotment records and rank data.',
    placement: 'top',
  },
  {
    selector: '[data-tour="bottom-institutes"]',
    title: 'Institutes',
    body: 'Browse medical colleges and institute details.',
    placement: 'top',
  },
];

function getPaddedRect(element: Element): TargetRect {
  const rect = element.getBoundingClientRect();
  const pad = 6;
  return {
    top: Math.max(8, rect.top - pad),
    left: Math.max(8, rect.left - pad),
    width: rect.width + pad * 2,
    height: rect.height + pad * 2,
  };
}

function getTooltipPosition(rect: TargetRect, placement: TourStep['placement']) {
  const width = Math.min(280, window.innerWidth - 32);
  const margin = 12;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let top = rect.top + rect.height + margin;
  let left = rect.left + rect.width / 2 - width / 2;

  if (placement === 'top') top = rect.top - margin;
  if (placement === 'left') {
    top = rect.top + rect.height / 2;
    left = rect.left - width - margin;
  }
  if (placement === 'right') {
    top = rect.top + rect.height / 2;
    left = rect.left + rect.width + margin;
  }

  left = Math.min(Math.max(16, left), viewportWidth - width - 16);

  if (placement === 'top') {
    top = Math.max(16, top);
    return { width, left, bottom: viewportHeight - rect.top + margin };
  }

  if (placement === 'left' || placement === 'right') {
    top = Math.min(Math.max(16, top - 68), viewportHeight - 150);
  } else {
    top = Math.min(Math.max(16, top), viewportHeight - 150);
  }

  return { width, top, left };
}

export function DashboardProductTour() {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [rect, setRect] = useState<TargetRect | null>(null);

  const availableSteps = useMemo(() => {
    if (typeof document === 'undefined') return [];
    return TOUR_STEPS.filter((step) => {
      const element = document.querySelector(step.selector);
      return element && element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0;
    });
  }, [active]);

  const step = availableSteps[stepIndex];

  const finish = useCallback(() => {
    localStorage.setItem(TOUR_STORAGE_KEY, 'done');
    setActive(false);
  }, []);

  const measureRect = useCallback(() => {
    if (!active || !step) return;
    const element = document.querySelector(step.selector);
    if (!element) {
      setRect(null);
      return;
    }
    setRect(getPaddedRect(element));
  }, [active, step]);

  const focusTarget = useCallback(() => {
    if (!active || !step) return;
    const element = document.querySelector(step.selector);
    if (!element) return;
    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    window.setTimeout(() => setRect(getPaddedRect(element)), 180);
  }, [active, step]);

  useEffect(() => {
    if (localStorage.getItem(TOUR_STORAGE_KEY)) return;

    const timer = window.setTimeout(() => setActive(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!active || !availableSteps.length) return;
    if (stepIndex > availableSteps.length - 1) setStepIndex(0);
  }, [active, availableSteps.length, stepIndex]);

  useEffect(() => {
    if (!active) return;
    focusTarget();
  }, [active, stepIndex, focusTarget]);

  useEffect(() => {
    if (!active) return;
    window.addEventListener('resize', measureRect);
    window.addEventListener('scroll', measureRect, true);
    return () => {
      window.removeEventListener('resize', measureRect);
      window.removeEventListener('scroll', measureRect, true);
    };
  }, [active, measureRect]);

  if (!active || !step || !rect) return null;

  const tooltipPosition = getTooltipPosition(rect, step.placement);

  return (
    <div className="fixed inset-0 z-[6500] pointer-events-none">
      <div
        className="fixed rounded-xl border border-primary bg-transparent transition-all duration-300"
        style={{
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
          boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.38), 0 10px 30px rgba(15,23,42,0.18)',
        }}
      />

      <div
        className="pointer-events-auto fixed rounded-xl border border-border bg-card p-3 shadow-xl"
        style={tooltipPosition}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary">
              Guide {stepIndex + 1}/{availableSteps.length}
            </p>
            <h2 className="mt-0.5 text-sm font-bold text-foreground">{step.title}</h2>
          </div>
          <button
            type="button"
            onClick={finish}
            className="flex h-7 w-7 items-center justify-center rounded-md text-foreground-subtle transition hover:bg-hover hover:text-foreground"
            aria-label="Skip product tour"
          >
            <X size={14} />
          </button>
        </div>

        <p className="text-xs leading-5 text-foreground-muted">{step.body}</p>

        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={finish}
            className="h-9 rounded-md border border-border px-3 text-xs font-semibold text-foreground-muted transition hover:bg-hover hover:text-foreground"
          >
            Skip
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground-muted transition hover:bg-hover hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous tour step"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                if (stepIndex >= availableSteps.length - 1) finish();
                else setStepIndex((current) => current + 1);
              }}
              className="flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-bold text-primary-foreground shadow-md shadow-primary/15 transition hover:bg-primary-hover"
            >
              {stepIndex >= availableSteps.length - 1 ? 'Done' : 'Next'}
              {stepIndex < availableSteps.length - 1 && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
