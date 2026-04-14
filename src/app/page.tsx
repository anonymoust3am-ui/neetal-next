import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-background font-sans">

      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-sticky border-b border-border bg-navbar px-6 py-3 flex items-center justify-between">
        <Image
          src="/next.svg"
          alt="Next.js logo"
          width={90}
          height={18}
          priority
          className="dark:invert"
        />
        <ThemeToggle />
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <main className="flex flex-1 flex-col items-center justify-center gap-12 px-6 py-20">
        <div className="text-center max-w-xl flex flex-col gap-4">
          <span className="self-center rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
            Theme system ready
          </span>
          <h1 className="text-4xl font-bold text-foreground tracking-tight">
            Build faster with design tokens
          </h1>
          <p className="text-lg text-foreground-muted leading-relaxed">
            Every color, radius, shadow, and z-index is a token.
            Toggle the theme — everything adapts automatically.
          </p>
        </div>

        {/* ── CTA buttons ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover">
            Primary action
          </button>
          <button className="rounded-lg bg-secondary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-secondary-hover">
            Secondary action
          </button>
          <button className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted">
            Ghost action
          </button>
        </div>

        {/* ── Cards row ───────────────────────────────────────────── */}
        <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-3">

          {/* Success card */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm flex flex-col gap-3">
            <span className="inline-flex w-fit rounded-full bg-success-light px-2.5 py-0.5 text-xs font-medium text-success">
              Success
            </span>
            <p className="text-sm font-semibold text-foreground">Deployed</p>
            <p className="text-xs text-foreground-muted">
              Build passed all checks and is live.
            </p>
          </div>

          {/* Warning card */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm flex flex-col gap-3">
            <span className="inline-flex w-fit rounded-full bg-warning-light px-2.5 py-0.5 text-xs font-medium text-warning">
              Warning
            </span>
            <p className="text-sm font-semibold text-foreground">Degraded</p>
            <p className="text-xs text-foreground-muted">
              Response times above threshold.
            </p>
          </div>

          {/* Error card */}
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm flex flex-col gap-3">
            <span className="inline-flex w-fit rounded-full bg-error-light px-2.5 py-0.5 text-xs font-medium text-error">
              Error
            </span>
            <p className="text-sm font-semibold text-foreground">Failed</p>
            <p className="text-xs text-foreground-muted">
              Last deployment exited with code 1.
            </p>
          </div>
        </div>

        {/* ── Input + divider ─────────────────────────────────────── */}
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="h-px bg-divider" />
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-foreground">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="rounded-lg border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-foreground-subtle outline-none transition-colors focus:border-border-focus focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        {/* ── Token palette ───────────────────────────────────────── */}
        <div className="w-full max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground-subtle">
            Chart palette
          </p>
          <div className="flex gap-2">
            {[
              "bg-chart-1", "bg-chart-2", "bg-chart-3",
              "bg-chart-4", "bg-chart-5",
            ].map((cls) => (
              <div
                key={cls}
                title={cls}
                className={`h-8 flex-1 rounded-md ${cls}`}
              />
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface px-6 py-4 text-center text-xs text-foreground-subtle">
        Built with the token-based theme system · toggle dark mode above
      </footer>
    </div>
  );
}
