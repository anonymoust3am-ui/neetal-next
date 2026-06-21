import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of service for using Neetell NEET counselling tools, college predictor, cutoffs, and guidance resources.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-black text-foreground">Terms of Service</h1>
        <p className="mt-5 text-base leading-8 text-foreground-muted">
          This placeholder terms page explains that Neetell provides counselling intelligence,
          college comparison, cutoff, and choice filling tools for informational planning.
          Students should verify official counselling notices, eligibility, dates, and allotment
          details with the relevant authorities. Replace this page with your final legal copy
          before launch.
        </p>
      </div>
    </main>
  );
}
