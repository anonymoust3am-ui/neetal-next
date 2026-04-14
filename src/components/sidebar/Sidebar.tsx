'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import {
  useSidebar,
  SIDEBAR_COLLAPSED_W,
  SIDEBAR_EXPANDED_W,
  HEADER_H,
} from '@/contexts/SidebarContext';
import { sidebarItems, NavItem } from './sidebarConfig';

function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}


export function Sidebar() {
  const pathname = usePathname();
  const { expanded, setHovered } = useSidebar();
  const [openKeys, setOpenKeys] = useState<Set<string>>(new Set());

  // Auto-open the parent that owns the current route
  useEffect(() => {
    const auto = new Set<string>();
    for (const item of sidebarItems) {
      if (item.children?.some(c => pathname === c.href || pathname.startsWith(c.href + '/'))) {
        auto.add(item.key);
      }
    }
    setOpenKeys(auto);
  }, [pathname]);

  // Close all sub-menus when sidebar collapses
  useEffect(() => {
    if (!expanded) setOpenKeys(new Set());
  }, [expanded]);

  const toggleKey = (key: string) =>
    setOpenKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const hasActiveChild = (item: NavItem) =>
    item.children?.some(c => isActive(c.href)) ?? false;

  const sidebarW = expanded ? SIDEBAR_EXPANDED_W : SIDEBAR_COLLAPSED_W;

  return (
    <aside
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: sidebarW,
        top: HEADER_H,
        transition: 'width 240ms cubic-bezier(0.4,0,0.2,1)',
      }}
      className="fixed left-0 bottom-0 z-[1020] flex flex-col overflow-hidden
        bg-[var(--color-sidebar-bg)] border-r border-[var(--color-border)]
        shadow-[3px_0_16px_rgba(0,0,0,0.07)]"
    >
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scroll-smooth">
        <ul className="space-y-0.5 px-2">
          {sidebarItems.map(item => {
            const isOpen   = openKeys.has(item.key);
            const active   = item.href ? isActive(item.href) : hasActiveChild(item);
            const Icon     = item.icon;
            const isDirect = !!item.href; // Dashboard — no sub-menu

            return (
              <li key={item.key}>
                {/* Divider */}
                {item.dividerBefore && (
                  <div className="mx-1 mb-2 mt-1 border-t border-[var(--color-divider)]" />
                )}

                {/* ── Parent button / link ───────────────────── */}
                {isDirect ? (
                  <Link
                    href={item.href!}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-colors',
                      active
                        ? 'bg-[var(--color-primary-light)] text-primary font-semibold'
                        : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
                      !expanded && 'justify-center'
                    )}
                  >
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.2 : 1.8}
                      className={cn(
                        'shrink-0 transition-colors',
                        active ? 'text-primary' : 'text-[var(--color-icon-secondary)]'
                      )}
                    />
                    {expanded && (
                      <span
                        className="truncate leading-none whitespace-nowrap"
                        style={{ opacity: expanded ? 1 : 0, transition: 'opacity 200ms 60ms' }}
                      >
                        {item.label}
                      </span>
                    )}
                  </Link>
                ) : (
                  /* Parent with sub-menu */
                  <div className="relative group/nav">
                    <button
                      onClick={() => expanded && toggleKey(item.key)}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm transition-colors text-left',
                        active
                          ? 'bg-[var(--color-primary-light)] text-primary font-semibold'
                          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]',
                        !expanded && 'justify-center'
                      )}
                    >
                      {/* Icon */}
                      <div className="relative shrink-0">
                        <Icon
                          size={18}
                          strokeWidth={active ? 2.2 : 1.8}
                          className={cn(
                            'transition-colors',
                            active
                              ? 'text-primary'
                              : 'text-[var(--color-icon-secondary)]'
                          )}
                        />
                        {/* Dot indicator for active when collapsed */}
                        {!expanded && active && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full border-2 border-[var(--color-sidebar-bg)]" />
                        )}
                      </div>

                      {/* Label + meta (visible only when expanded) */}
                      {expanded && (
                        <span
                          className="flex-1 flex items-center gap-1.5 min-w-0"
                          style={{ opacity: 1, transition: 'opacity 180ms 50ms' }}
                        >
                          <span className="truncate leading-none">{item.label}</span>
                          {item.featured && (
                            <Star size={9} className="text-warning shrink-0" fill="currentColor" />
                          )}
                        </span>
                      )}
                      {expanded && (
                        <ChevronDown
                          size={13}
                          className={cn(
                            'shrink-0 text-[var(--color-icon-muted)] transition-transform duration-200',
                            isOpen && 'rotate-180'
                          )}
                        />
                      )}
                    </button>

                    {/* Tooltip when collapsed */}
                    {!expanded && (
                      <div className="pointer-events-none absolute left-full top-1/2 ml-2.5 -translate-y-1/2 z-[1060]
                        opacity-0 group-hover/nav:opacity-100 transition-opacity duration-150 delay-100">
                        <div className="bg-[var(--color-tooltip-bg)] text-[var(--color-tooltip-text)]
                          text-xs font-medium px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                          {item.label}
                        </div>
                        <div className="absolute right-full top-1/2 -translate-y-1/2
                          border-[5px] border-transparent border-r-[var(--color-tooltip-bg)]" />
                      </div>
                    )}
                  </div>
                )}

                {/* ── Sub-items accordion ──────────────────────── */}
                {!isDirect && expanded && (
                  <div
                    style={{
                      maxHeight: isOpen ? '400px' : '0px',
                      opacity: isOpen ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'max-height 220ms ease, opacity 180ms ease',
                    }}
                  >
                    {/* Hierarchy line */}
                    <ul className="ml-[23px] pl-4 border-l-2 border-[var(--color-border)] mt-0.5 mb-1 space-y-0.5">
                      {item.children?.map(child => {
                        const childActive = isActive(child.href);
                        const ChildIcon = child.icon;
                        return (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                'flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] transition-colors',
                                childActive
                                  ? 'bg-[var(--color-primary-light)] text-primary font-semibold'
                                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)]'
                              )}
                            >
                              <ChildIcon
                                size={13}
                                strokeWidth={childActive ? 2.2 : 1.8}
                                className={cn(
                                  'shrink-0',
                                  childActive ? 'text-primary' : 'text-[var(--color-icon-muted)]'
                                )}
                              />
                              <span className="truncate leading-none">{child.label}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Footer: user strip ─────────────────────────────────── */}
      <div className="shrink-0 border-t border-[var(--color-border)] px-2 py-2.5">
        {expanded ? (
          <div className="flex items-center gap-2.5 px-1.5">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-primary">AS</span>
            </div>
            <div
              className="overflow-hidden min-w-0 flex-1"
              style={{ opacity: expanded ? 1 : 0, transition: 'opacity 180ms' }}
            >
              <p className="text-xs font-semibold text-[var(--color-text-primary)] truncate leading-tight">
                Aryan Sharma
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)] truncate leading-tight">
                NEET UG 2025
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center">
              <span className="text-[11px] font-bold text-primary">AS</span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
