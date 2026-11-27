import { Link } from 'react-router-dom';
import CtaBand from '../components/sections/CtaBand';
import PageHero from '../components/sections/PageHero';
import { ArrowRightIcon, CheckIcon, InfoIcon } from '../components/ui/Icons';
import Reveal from '../components/ui/Reveal';
import { Eyebrow } from '../components/ui/SectionHeading';
import { services } from '../config/content';
import { cn } from '../lib/cn';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ServicesPage() {
  usePageMeta('/services');

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Practical technology, carefully built."
        intro="Four disciplines that work together or on their own. Each engagement starts with understanding the problem — then we recommend only what it needs."
      />

      {/* In-page index */}
      <nav aria-label="Services on this page" className="sticky top-[var(--header-height)] z-40 border-b border-line bg-page/90 backdrop-blur-md">
        <ul className="container-site flex gap-x-8 gap-y-1 overflow-x-auto py-3 [scrollbar-width:none]">
          {services.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-[2.75rem] items-center gap-3 text-[0.9375rem] text-muted transition-colors hover:text-fg"
              >
                <span className="text-xs font-medium tracking-[0.18em]">{s.number}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-surface">
        {services.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            aria-labelledby={`${s.id}-title`}
            className={cn('scroll-mt-14 py-section', i > 0 && 'border-t border-line')}
          >
            <div className="container-site grid gap-12 lg:grid-cols-12 lg:gap-16">
              <Reveal className="lg:col-span-5">
                <p className="font-sans text-sm font-medium tracking-[0.18em] text-muted">{s.number}</p>
                <h2 id={`${s.id}-title`} className="mt-6 text-h2 text-fg">
                  {s.title}
                </h2>
                <p className="mt-6 text-lead text-fg">{s.intro}</p>
                <Link
                  to={`/contact?service=${s.id}`}
                  className="mt-8 inline-flex min-h-[2.75rem] items-center gap-2 font-medium text-fg underline decoration-fg/30 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-fg"
                >
                  Discuss this service<span className="sr-only">: {s.title}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </Reveal>

              <Reveal className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:pt-12" delay={120}>
                <div>
                  <Eyebrow className="mb-5">What it can include</Eyebrow>
                  <ul className="space-y-4">
                    {s.includes.map((item) => (
                      <li key={item} className="flex gap-3 text-fg">
                        <CheckIcon className="mt-[0.35em] h-4 w-4 shrink-0 text-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Eyebrow className="mb-5">What you receive</Eyebrow>
                  <ul className="space-y-4">
                    {s.outputs.map((item) => (
                      <li key={item} className="flex gap-3 text-fg">
                        <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-icon" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <aside
                  aria-label={`A note on ${s.title}`}
                  className="card flex gap-4 border-l-2 border-l-deco p-6 text-muted sm:col-span-2"
                >
                  <InfoIcon className="mt-[0.2em] h-5 w-5 shrink-0 text-icon" />
                  <p>{s.note}</p>
                </aside>
              </Reveal>
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="engagement-title" className="surface-brand py-section">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <Eyebrow tone="brand" className="mb-6">
              How engagements start
            </Eyebrow>
            <h2 id="engagement-title" className="text-h2 text-jp-ivory">
              Every project begins with a scoping call.
            </h2>
          </Reveal>
          <Reveal className="space-y-6 text-lead text-jp-ivory/80 lg:col-span-7 lg:pt-12" delay={120}>
            <p>
              We use the first conversation to understand what you are trying to achieve, what already exists, and what
              constraints matter — budget, timing, systems and people.
            </p>
            <p>
              If we are a good fit, we follow up with a written outline of scope and next steps. If we are not, we will
              say so. Estimates are shared after discovery, once the problem is properly understood.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand
        title="Ready to talk through a project?"
        body="Tell us a little about the problem and we will arrange a scoping call."
        primary={{ label: 'Request a Scoping Call', to: '/contact' }}
        secondary={{ label: 'See Our Approach', to: '/approach' }}
      />
    </>
  );
}
