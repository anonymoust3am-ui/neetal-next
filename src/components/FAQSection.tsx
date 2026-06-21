import { faqItems } from '@/lib/seo';

export function FAQSection() {
  return (
    <section id="faq" className="bg-background py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-2 text-3xl font-black text-foreground">NEET counselling questions</h2>
          <p className="mt-3 text-sm text-foreground-muted">
            Clear answers for students comparing colleges, cutoffs, fees, bonds, and choice filling strategy.
          </p>
        </div>

        <div className="space-y-3">
          {faqItems.map(item => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border bg-surface p-5 shadow-sm"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-foreground">
                <span className="inline-flex w-full items-center justify-between gap-4">
                  {item.question}
                  <span className="text-lg text-primary transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
