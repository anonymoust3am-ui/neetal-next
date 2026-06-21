import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Privacy policy for Neetell, including how student counselling and account information is handled.',
  alternates: {
    canonical: '/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-black text-foreground">Privacy Policy</h1>
        <p className="mt-5 text-base leading-8 text-foreground-muted">
          This placeholder privacy policy explains that Neetell may collect account,
          profile, counselling preference, and usage information to provide NEET counselling
          tools, recommendations, and support. Replace this page with your final legal copy
          before launch.
        </p>
      </div>
    </main>
  );
}
