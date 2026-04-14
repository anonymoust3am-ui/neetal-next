# Theme System — AI Reference Guide

> **Stack:** Next.js 16 · React 19 · Tailwind CSS v4 · TypeScript  
> **Location of all theme code:**
> - Hook + Provider → `src/contexts/ThemeContext.tsx`
> - Re-export shim  → `src/hooks/useTheme.ts`
> - CSS tokens      → `src/app/globals.css`
> - Layout wiring   → `src/app/layout.tsx`

---

## 1. Architecture Overview

```
ThemeProvider  (Client Component — src/contexts/ThemeContext.tsx)
  │
  ├─ reads  localStorage key "theme"  ('light' | 'dark' | 'system')
  ├─ reads  window.matchMedia for system preference
  ├─ writes .dark / .light class to <html>
  ├─ writes data-theme="light|dark" attribute to <html>
  └─ exposes ThemeContext consumed by useTheme()

globals.css
  ├─ :root { }          — all design tokens, light values
  ├─ .dark { }          — overrides for dark mode
  └─ @theme inline { }  — maps tokens → Tailwind utility classes
```

**Dark mode trigger:** The `.dark` class on `<html>`. Tailwind's `dark:` variant is configured with `@custom-variant dark (&:where(.dark, .dark *))` — class-based, NOT media-query-based.

---

## 2. `useTheme` Hook

### Import

```tsx
import { useTheme } from '@/hooks/useTheme';
// or
import { useTheme } from '@/contexts/ThemeContext';
```

### Return value

```ts
interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system'; // stored preference
  resolvedTheme: 'light' | 'dark';    // actual applied theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;            // cycles light ↔ dark
}
```

### Rules

- Must be called inside a **Client Component** (`'use client'` directive required).
- Must be rendered inside `<ThemeProvider>` (already in `layout.tsx`).
- Throws if called outside `<ThemeProvider>`.

### Example — toggle button

```tsx
'use client';
import { useTheme } from '@/hooks/useTheme';

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {resolvedTheme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
```

### Example — set a specific theme

```tsx
'use client';
import { useTheme } from '@/hooks/useTheme';

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  return (
    <select value={theme} onChange={e => setTheme(e.target.value as any)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

### Example — conditional rendering by theme

```tsx
'use client';
import { useTheme } from '@/hooks/useTheme';

export function Logo() {
  const { resolvedTheme } = useTheme();
  return (
    <img
      src={resolvedTheme === 'dark' ? '/logo-dark.svg' : '/logo-light.svg'}
      alt="Logo"
    />
  );
}
```

---

## 3. `ThemeProvider`

Already added to `src/app/layout.tsx`. No additional setup needed.

```tsx
// src/app/layout.tsx (already configured — do not re-add)
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <head>
        {/* Inline script prevents flash of wrong theme on first load */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**`suppressHydrationWarning` on `<html>` is required** — the inline script adds a class before React hydrates, causing an intentional mismatch.

---

## 4. CSS Design Tokens

All tokens are CSS custom properties on `:root`. The `.dark` class overrides only the tokens that change.

### 4.1 Brand Colors

| Token | Light | Dark |
|---|---|---|
| `--color-primary` | `#0d9488` | `#0d9488` (unchanged) |
| `--color-primary-hover` | `#0f766e` | `#0f766e` |
| `--color-primary-light` | `#ccfbf1` | `#042f2e` |
| `--color-primary-foreground` | `#ffffff` | `#ffffff` |
| `--color-secondary` | `#7c3aed` | `#7c3aed` |
| `--color-secondary-hover` | `#6d28d9` | `#6d28d9` |
| `--color-secondary-light` | `#ede9fe` | `#2e1065` |
| `--color-accent` | `#0ea5e9` | `#0ea5e9` |
| `--color-accent-light` | `#e0f2fe` | `#0c4a6e` |

### 4.2 Background Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-bg-primary` | `#f8fafc` | `#0f172a` |
| `--color-bg-secondary` | `#ffffff` | `#1e293b` |
| `--color-bg-muted` | `#f1f5f9` | `#1e293b` |
| `--color-bg-elevated` | `#ffffff` | `#1e293b` |
| `--color-bg-hover` | `#f1f5f9` | `#334155` |

### 4.3 Text Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-text-primary` | `#0f172a` | `#f8fafc` |
| `--color-text-secondary` | `#475569` | `#94a3b8` |
| `--color-text-muted` | `#94a3b8` | `#64748b` |
| `--color-text-inverse` | `#ffffff` | `#0f172a` |
| `--color-text-link` | `#2563eb` | `#60a5fa` |
| `--color-text-link-hover` | `#1d4ed8` | `#93c5fd` |

### 4.4 Border Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-border` | `#e2e8f0` | `#334155` |
| `--color-border-strong` | `#cbd5f5` | `#475569` |
| `--color-border-focus` | `#2563eb` | `#3b82f6` |

### 4.5 State Tokens

| Token | Light | Dark |
|---|---|---|
| `--color-success` | `#16a34a` | `#16a34a` |
| `--color-success-light` | `#dcfce7` | `#14532d` |
| `--color-error` | `#dc2626` | `#dc2626` |
| `--color-error-light` | `#fee2e2` | `#7f1d1d` |
| `--color-warning` | `#d97706` | `#d97706` |
| `--color-warning-light` | `#fef3c7` | `#78350f` |
| `--color-info` | `#0284c7` | `#0284c7` |
| `--color-info-light` | `#e0f2fe` | `#0c4a6e` |

### 4.6 UI Component Tokens

| Token | Purpose | Light | Dark |
|---|---|---|---|
| `--color-card` | card bg | `#ffffff` | `#1e293b` |
| `--color-card-hover` | card hover bg | `#f1f5f9` | `#334155` |
| `--color-overlay` | modal overlay | `rgba(15,23,42,0.5)` | `rgba(0,0,0,0.6)` |
| `--color-skeleton` | skeleton loading | `#e2e8f0` | `#334155` |
| `--color-disabled-bg` | disabled bg | `#e2e8f0` | `#1e293b` |
| `--color-disabled-text` | disabled text | `#94a3b8` | `#475569` |
| `--color-selection` | text selection | `#bfdbfe` | `#1e3a5f` |
| `--color-focus-ring` | focus outline | `#2563eb` | `#2563eb` |
| `--color-navbar-bg` | navbar bg | `#ffffff` | `#0f172a` |
| `--color-sidebar-bg` | sidebar bg | `#f8fafc` | `#0f172a` |
| `--color-sidebar-active` | sidebar active item | `#e0f2fe` | `#1e3a5f` |
| `--color-input-bg` | input bg | `#ffffff` | `#1e293b` |
| `--color-input-border` | input border | `#e2e8f0` | `#334155` |
| `--color-input-placeholder` | input placeholder | `#94a3b8` | `#64748b` |
| `--color-tooltip-bg` | tooltip bg | `#0f172a` | `#f8fafc` |
| `--color-tooltip-text` | tooltip text | `#ffffff` | `#0f172a` |
| `--color-modal-bg` | modal bg | `#ffffff` | `#1e293b` |
| `--color-dropdown-bg` | dropdown bg | `#ffffff` | `#1e293b` |
| `--color-dropdown-hover` | dropdown hover | `#f1f5f9` | `#334155` |

### 4.7 Chart Tokens

| Token | Value (both modes) |
|---|---|
| `--color-chart-1` | `#2563eb` |
| `--color-chart-2` | `#7c3aed` |
| `--color-chart-3` | `#0ea5e9` |
| `--color-chart-4` | `#16a34a` |
| `--color-chart-5` | `#d97706` |

### 4.8 Non-Color Tokens

```css
/* Typography */
--font-sans: "Inter", system-ui, -apple-system, sans-serif;
--font-mono: "JetBrains Mono", monospace;
--font-light: 300;   --font-normal: 400;  --font-medium: 500;
--font-semibold: 600; --font-bold: 700;

/* Radius */
--radius-sm: 4px;  --radius-md: 8px;   --radius-lg: 12px;
--radius-xl: 16px; --radius-full: 9999px;

/* Shadow (changes in dark mode) */
--shadow-sm: 0 1px 2px rgba(...);
--shadow-md: 0 4px 6px rgba(...);
--shadow-lg: 0 10px 15px rgba(...);

/* Z-index */
--z-dropdown: 1000;  --z-sticky: 1020;   --z-fixed: 1030;
--z-modal-backdrop: 1040; --z-modal: 1050; --z-tooltip: 1060;

/* Transitions */
--transition-fast: 150ms ease-in-out;
--transition-normal: 250ms ease-in-out;
--transition-slow: 350ms ease-in-out;

/* Spacing */
--space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
--space-5: 20px; --space-6: 24px; --space-8: 32px;
--space-10: 40px; --space-12: 48px;

/* Gradients */
--gradient-primary: linear-gradient(135deg, #2563eb, #1d4ed8);
--gradient-accent:  linear-gradient(135deg, #0ea5e9, #0284c7);
--gradient-hero:    linear-gradient(135deg, #2563eb, #7c3aed);
```

---

## 5. Tailwind Utility Classes

The `@theme inline` block in `globals.css` maps every token to Tailwind utility classes. Each `--color-{name}` entry generates **all color utilities**: `bg-{name}`, `text-{name}`, `border-{name}`, `ring-{name}`, `fill-{name}`, `stroke-{name}`, `decoration-{name}`, `shadow-{name}`, `outline-{name}`, `accent-{name}`, `caret-{name}`.

### 5.1 Color Utilities Quick Reference

| Tailwind utility | Token it references | Use for |
|---|---|---|
| `bg-background` | `--color-bg-primary` | Page canvas |
| `bg-surface` | `--color-bg-secondary` | Panels, sheets |
| `bg-muted` | `--color-bg-muted` | Subtle section backgrounds |
| `bg-elevated` | `--color-bg-elevated` | Popovers, dropdowns |
| `bg-hover` | `--color-bg-hover` | Row / item hover states |
| `bg-card` / `text-card` | `--color-card` | Card backgrounds |
| `bg-primary` / `text-primary` / `border-primary` | `--color-primary` | Primary actions |
| `bg-secondary` / `text-secondary` | `--color-secondary` | Secondary actions |
| `bg-accent` / `text-accent` | `--color-accent` | Highlights |
| `text-foreground` | `--color-text-primary` | Body text |
| `text-foreground-muted` | `--color-text-secondary` | Subdued text |
| `text-foreground-subtle` | `--color-text-muted` | Placeholder text |
| `text-foreground-inverse` | `--color-text-inverse` | Text on dark surfaces |
| `text-link` | `--color-text-link` | Anchor text |
| `border-border` | `--color-border` | Default border |
| `border-border-strong` | `--color-border-strong` | Emphasized border |
| `border-border-focus` | `--color-border-focus` | Focus border |
| `bg-success` / `bg-success-light` | state tokens | Success states |
| `bg-error` / `bg-error-light` | state tokens | Error states |
| `bg-warning` / `bg-warning-light` | state tokens | Warning states |
| `bg-info` / `bg-info-light` | state tokens | Info states |
| `bg-overlay` | `--color-overlay` | Modal backdrops |
| `bg-skeleton` | `--color-skeleton` | Skeleton loaders |
| `bg-disabled` | `--color-disabled-bg` | Disabled controls |
| `bg-input` | `--color-input-bg` | Input fields |
| `bg-navbar` | `--color-navbar-bg` | Navbar |
| `bg-sidebar` | `--color-sidebar-bg` | Sidebar |
| `bg-tooltip` | `--color-tooltip-bg` | Tooltips |
| `bg-modal` | `--color-modal-bg` | Modal dialogs |
| `bg-dropdown` | `--color-dropdown-bg` | Dropdown menus |
| `bg-chart-1` … `bg-chart-5` | chart tokens | Data visualization |

### 5.2 Typography Utilities

```tsx
// Font family
<p className="font-sans">  // Inter
<p className="font-mono">  // JetBrains Mono

// Font weight
<p className="font-light">      // 300
<p className="font-normal">     // 400
<p className="font-medium">     // 500
<p className="font-semibold">   // 600
<p className="font-bold">       // 700
```

### 5.3 Radius Utilities

```tsx
<div className="rounded-sm">    // 4px
<div className="rounded-md">    // 8px
<div className="rounded-lg">    // 12px
<div className="rounded-xl">    // 16px
<div className="rounded-full">  // 9999px (pill)
```

> **Note:** `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl` override Tailwind's default rem-based values with your pixel-based design tokens.

### 5.4 Shadow Utilities

```tsx
<div className="shadow-sm">   // subtle
<div className="shadow-md">   // medium
<div className="shadow-lg">   // prominent
// Shadows are stronger in dark mode (auto-applied via .dark token overrides)
```

### 5.5 Z-Index Utilities

```tsx
<div className="z-dropdown">       // 1000
<div className="z-sticky">         // 1020
<div className="z-fixed">          // 1030
<div className="z-modal-backdrop"> // 1040
<div className="z-modal">          // 1050
<div className="z-tooltip">        // 1060
```

---

## 6. Dark Mode with Tailwind `dark:` Variant

The `dark:` variant responds to the `.dark` class on `<html>` (NOT the OS media query).

```tsx
// Correct — uses design token utilities that auto-switch
<div className="bg-background text-foreground border border-border">

// Also correct — explicit dark: override when needed
<div className="bg-white dark:bg-slate-900">

// Combining both
<div className="bg-surface dark:ring-1 dark:ring-border">
```

**Preferred pattern:** use the token-based utilities (`bg-background`, `text-foreground`, etc.) since they switch automatically without needing `dark:` prefixes.

---

## 7. Using Tokens Directly in CSS / Inline Styles

For cases where Tailwind utilities aren't enough:

```tsx
// Inline style
<div style={{ background: 'var(--gradient-hero)' }}>

// CSS module / arbitrary Tailwind value
<div className="bg-[var(--color-bg-primary)]">

// In a CSS file or <style> block
.my-component {
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  transition: background var(--transition-normal);
}
```

---

## 8. Common UI Patterns

### Card

```tsx
<div className="bg-card border border-border rounded-lg shadow-sm p-6">
  <h2 className="text-foreground font-semibold">Title</h2>
  <p className="text-foreground-muted">Description</p>
</div>
```

### Primary Button

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary-hover rounded-md px-4 py-2 font-medium transition-colors">
  Click me
</button>
```

### Input Field

```tsx
<input
  className="bg-input border border-border focus:border-border-focus rounded-md px-3 py-2 text-foreground placeholder:text-foreground-subtle outline-none"
  placeholder="Enter value…"
/>
```

### Badge — Success

```tsx
<span className="bg-success-light text-success rounded-full px-2 py-0.5 text-sm font-medium">
  Active
</span>
```

### Navbar

```tsx
<nav className="bg-navbar border-b border-border z-fixed sticky top-0">
  <span className="text-foreground font-semibold">App</span>
</nav>
```

### Modal Backdrop

```tsx
<div className="bg-overlay z-modal-backdrop fixed inset-0" />
<div className="bg-modal z-modal rounded-xl shadow-lg fixed …">…</div>
```

### Sidebar

```tsx
<aside className="bg-sidebar border-r border-border">
  <a className="text-foreground-muted hover:bg-muted hover:text-foreground rounded-md">
    Dashboard
  </a>
  <a className="bg-sidebar-active text-foreground rounded-md">
    Settings {/* active item */}
  </a>
</aside>
```

### Skeleton Loader

```tsx
<div className="bg-skeleton animate-pulse rounded-md h-4 w-32" />
```

### Tooltip

```tsx
<div className="bg-tooltip text-foreground-inverse rounded-md px-2 py-1 text-sm z-tooltip">
  Tooltip text
</div>
```

---

## 9. Adding New Tokens

1. Add the CSS variable to `:root` in `globals.css`
2. Add the dark-mode override to `.dark` in `globals.css`  
3. Add a `--color-{name}: var(--your-token)` entry inside `@theme inline` in `globals.css`
4. Use `bg-{name}` / `text-{name}` / `border-{name}` in JSX immediately — no config file changes needed.

---

## 10. File Map

```
src/
├── app/
│   ├── globals.css          ← All CSS tokens, @theme inline, dark overrides
│   └── layout.tsx           ← ThemeProvider + FOUC-prevention script
├── contexts/
│   └── ThemeContext.tsx     ← ThemeProvider component + useTheme hook
└── hooks/
    └── useTheme.ts          ← Re-export shim (import from here or ThemeContext)
```
