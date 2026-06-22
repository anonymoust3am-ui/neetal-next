'use client';

import { createElement, useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import Script from 'next/script';
import { usePathname, useRouter } from 'next/navigation';
import { X } from 'lucide-react';

const POSITION_KEY = 'neetell_ai_orb_position';
const MOBILE_ORB_SIZE = 120;
const DESKTOP_ORB_SIZE = 150;
const EDGE_PADDING = 12;

type OrbPosition = {
  x: number;
  y: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getDefaultPosition(): OrbPosition {
  if (typeof window === 'undefined') return { x: 0, y: 0 };
  const orbSize = getOrbSize();
  return {
    x: window.innerWidth - orbSize - EDGE_PADDING,
    y: window.innerHeight - orbSize - 112,
  };
}

function getOrbSize() {
  if (typeof window === 'undefined') return DESKTOP_ORB_SIZE;
  return window.innerWidth < 768 ? MOBILE_ORB_SIZE : DESKTOP_ORB_SIZE;
}

function normalizePosition(position: OrbPosition): OrbPosition {
  if (typeof window === 'undefined') return position;
  const orbSize = getOrbSize();
  return {
    x: clamp(position.x, EDGE_PADDING, window.innerWidth - orbSize - EDGE_PADDING),
    y: clamp(position.y, EDGE_PADDING + 56, window.innerHeight - orbSize - EDGE_PADDING),
  };
}

function readStoredPosition() {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(POSITION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OrbPosition>;
    if (typeof parsed.x !== 'number' || typeof parsed.y !== 'number') return null;
    return normalizePosition({ x: parsed.x, y: parsed.y });
  } catch {
    return null;
  }
}

export function DashboardAiOrb() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<OrbPosition>({ x: 0, y: 0 });
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: 0,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    setPosition(readStoredPosition() ?? getDefaultPosition());
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;

    function handleResize() {
      setPosition(current => {
        const next = normalizePosition(current);
        localStorage.setItem(POSITION_KEY, JSON.stringify(next));
        return next;
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visible]);

  if (!visible || pathname === '/dashboard/ai') return null;

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      drag.moved = true;
    }

    setPosition(normalizePosition({ x: drag.originX + dx, y: drag.originY + dy }));
  };

  const handlePointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;

    const finalPosition = normalizePosition({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    });

    dragRef.current.active = false;
    setPosition(finalPosition);
    localStorage.setItem(POSITION_KEY, JSON.stringify(finalPosition));

    if (!drag.moved) {
      router.push('/dashboard/ai');
    }
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setVisible(false);
  };

  return (
    <>
      <Script
        src="https://unpkg.com/@lottiefiles/lottie-player@2.0.12/dist/lottie-player.js"
        strategy="afterInteractive"
      />

      <div
        className="fixed z-[1350] h-[120px] w-[120px] md:h-[150px] md:w-[150px]"
        style={{ left: position.x, top: position.y }}
      >
        <div className="pointer-events-none absolute inset-2 rounded-full border border-primary/35 animate-ping" />
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative flex h-full w-full touch-none select-none items-center justify-center rounded-full bg-transparent p-0 outline-none transition-transform active:scale-1.2"
          aria-label="Open NEET AI assistant"
        >
          {createElement('lottie-player', {
            src: '/neetell-ai.json',
            background: 'transparent',
            speed: '1',
            loop: true,
            autoplay: true,
            style: { width: '100%', height: '100%' },
          })}
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="absolute right-1 top-1 z-10 m-0 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface/95 p-0 text-foreground-muted shadow-sm backdrop-blur transition-colors hover:text-error"
          aria-label="Hide NEET AI assistant"
        >
          <X size={13} />
        </button>
      </div>
    </>
  );
}
