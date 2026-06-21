import type { Metadata } from 'next';
import { JsonLd } from '@/components/seo/JsonLd';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Neetell Editorial Team',
  description:
    'Meet the Neetell editorial team creating NEET counselling guides, cutoff explainers, college comparison resources, and admission strategy content.',
  alternates: {
    canonical: '/authors/neetell',
  },
};

const authorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Neetell Editorial Team',
  url: `${SITE_URL}/authors/neetell`,
  parentOrganization: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
  },
  knowsAbout: [
    'NEET counselling',
    'Medical college admissions',
    'NEET cutoff analysis',
    'AIQ counselling',
    'State quota counselling',
    'Choice filling strategy',
  ],
};

export default function NeetellAuthorPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <JsonLd data={authorJsonLd} />
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Author</p>
        <h1 className="mt-3 text-4xl font-black text-foreground">Neetell Editorial Team</h1>
        <p className="mt-5 text-base leading-8 text-foreground-muted">
          The Neetell team publishes NEET counselling resources, college comparison guides,
          cutoff explainers, fee and bond insights, and choice filling strategy content for
          medical aspirants in India.
        </p>
        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold text-foreground">Editorial Focus</h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
            <li>NEET UG and NEET PG counselling guidance</li>
            <li>AIQ, state quota, MCC, and state counselling workflows</li>
            <li>Medical college cutoffs, fees, bonds, seats, and choice filling</li>
            <li>Rank-aware college prediction and admission planning</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
