'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Home, Pin, Plus, X } from 'lucide-react';

type Tab = { label: string; href: string };

const baseTabs: Tab[] = [
    { label: 'Home', href: '/dashboard' },
];

const pinnedTabs: Tab[] = [
    { label: 'AIIMS Delhi', href: '/dashboard/colleges/aiims-delhi' },
    { label: 'JIPMER', href: '/dashboard/colleges/jipmer' },
];

export function DashboardTabs() {
    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement>(null);
    const tabRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

    const tabs = [...baseTabs, ...pinnedTabs];

    useEffect(() => {
        const idx = tabs.findIndex(t => t.href === pathname);
        const el = tabRefs.current[idx];
        const nav = navRef.current;
        if (!el || !nav) return;

        const er = el.getBoundingClientRect();
        const nr = nav.getBoundingClientRect();
        setPill({ left: er.left - nr.left, width: er.width, ready: true });
    }, [pathname]);

    return (
        <div className="sticky top-[56px] z-[1500]">
            <div
                ref={navRef}
                className="
          relative flex items-stretch gap-0.5 px-5 h-[52px]
          overflow-x-auto no-scrollbar
          bg-navbar
          border-b border-border
          shadow-sm
        "
            >
                {/* Sliding underline indicator */}
                {pill.ready && (
                    <span
                        className="
              absolute bottom-0 h-[2px] rounded-t-full bg-primary
              pointer-events-none
              transition-[left,width] duration-[280ms] ease-[cubic-bezier(.4,0,.2,1)]
            "
                        style={{ left: pill.left, width: pill.width }}
                    />
                )}

                {/* HOME tab */}
                {baseTabs.map((tab, i) => {
                    const active = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            ref={el => {
                                tabRefs.current[i] = el;
                            }}
                            className={`
                flex items-center gap-1.5 px-4 h-full shrink-0
                text-[13px] font-medium rounded-t-md
                transition-colors duration-[var(--transition-fast)]
                ${active
                                    ? 'text-primary'
                                    : 'text-foreground-subtle hover:text-foreground hover:bg-hover'}
              `}
                        >
                            <Home size={15} strokeWidth={2} />
                            Home
                        </Link>
                    );
                })}

                {/* Divider */}
                <div className="w-px self-stretch my-[10px] bg-border shrink-0 mx-1.5" />

                {/* PINNED tabs */}
                {pinnedTabs.map((tab, i) => {
                    const idx = i + baseTabs.length;
                    const active = pathname === tab.href;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            ref={(el) => {
                                tabRefs.current[i] = el;
                            }}
                            className={`
                group relative flex flex-row items-center justify-between gap-2
                px-3 min-w-[120px] h-full shrink-0
                text-[13px] font-medium rounded-t-md
                transition-colors duration-[var(--transition-fast)]
                ${active
                                    ? 'text-primary'
                                    : 'text-foreground-subtle hover:text-foreground hover:bg-hover'}
              `}
                        >
                            {/* Left accent pip */}
                            <span
                                className={`
                  absolute left-0 top-1/2 -translate-y-1/2
                  w-[3px] h-5 bg-primary rounded-r-full
                  transition-opacity duration-[var(--transition-fast)]
                  ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                `}
                            />

                            {/* Pin icon — left */}
                            <Pin
                                size={11}
                                strokeWidth={2.2}
                                className={`
                  shrink-0
                  transition-opacity duration-[var(--transition-fast)]
                  ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-80'}
                `}
                            />

                            {/* Label — center */}
                            <span className="flex-1 text-center leading-none truncate">{tab.label}</span>

                            {/* Close icon — right */}
                            <button
                                onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                                className={`
                  shrink-0 flex items-center justify-center
                  w-4 h-4 rounded-sm
                  transition-all duration-[var(--transition-fast)]
                  opacity-0 group-hover:opacity-60 hover:!opacity-100
                  hover:bg-error-light hover:text-error
                `}
                                aria-label={`Close ${tab.label}`}
                            >
                                <X size={10} strokeWidth={2.5} />
                            </button>
                        </Link>
                    );
                })}



                {/* Add-tab button */}
                <button
                    className="
            ml-2 my-auto flex items-center justify-center
            w-[30px] h-[30px] shrink-0
            rounded-md border border-dashed border-border
            text-foreground-subtle
            transition-all duration-[var(--transition-fast)]
            hover:text-primary hover:border-primary hover:bg-primary-light
          "
                    aria-label="Add tab"
                >
                    <Plus size={15} strokeWidth={2} />
                </button>
            </div>
        </div>
    );
}