import type { Faq } from '../../config/content';
import { cn } from '../../lib/cn';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';

type FaqSectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  faqs: Faq[];
  className?: string;
};

/**
 * Visible question-and-answer list. Questions are real <h3> headings and every answer is in the
 * HTML (not hidden behind JavaScript), so crawlers and AI answer engines can read and quote it.
 * The same data is emitted as FAQPage JSON-LD at build time (src/seo/structuredData.ts).
 */
export default function FaqSection({ id, eyebrow = 'Questions', title, intro, faqs, className }: FaqSectionProps) {
  return (
    <section aria-labelledby={id} className={cn('bg-jp-ivory py-section', className)}>
      <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-4">
          <SectionHeading id={id} eyebrow={eyebrow} title={title} intro={intro} />
        </Reveal>
        <div className="border-t border-jp-border lg:col-span-8">
          {faqs.map((f, i) => (
            <Reveal key={f.question} delay={i * 60} className="border-b border-jp-border py-8">
              <h3 className="text-h3 text-jp-navy">{f.question}</h3>
              <p className="mt-3 max-w-prose text-jp-slate">{f.answer}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
