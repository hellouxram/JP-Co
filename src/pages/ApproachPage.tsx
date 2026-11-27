import CtaBand from '../components/sections/CtaBand';
import PageHero from '../components/sections/PageHero';
import Reveal from '../components/ui/Reveal';
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading';
import { principles, processSteps } from '../config/content';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ApproachPage() {
  usePageMeta('/approach');

  return (
    <>
      <PageHero
        eyebrow="Approach"
        title="Discover. Design. Build. Improve."
        intro="A clear process with tangible outputs at every step. We would rather set realistic expectations early than promise speed we cannot responsibly deliver."
      />

      <section aria-labelledby="steps-title" className="bg-surface py-section">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              id="steps-title"
              eyebrow="The process"
              title="Four steps, each with something to show for it."
              intro="Steps can overlap and repeat — real projects rarely move in a straight line. What stays constant is that each step ends with an output you can review."
            />
          </Reveal>

          <ol className="mt-16 border-t border-line">
            {processSteps.map((step) => (
              <li key={step.title} className="border-b border-line">
                <Reveal className="grid gap-8 py-12 lg:grid-cols-12 lg:gap-16 lg:py-16">
                  <div className="lg:col-span-4">
                    <p className="font-sans text-sm font-medium tracking-[0.18em] text-muted">
                      <span className="sr-only">Step </span>
                      {step.number}
                    </p>
                    <h3 className="mt-4 font-serif text-h2 text-fg">{step.title}</h3>
                    <p className="mt-4 text-lead text-fg">{step.summary}</p>
                  </div>

                  <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
                    <div>
                      <Eyebrow className="mb-5">What happens</Eyebrow>
                      <ul className="space-y-3">
                        {step.activities.map((a) => (
                          <li key={a} className="flex gap-3 text-fg">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-icon" />
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <Eyebrow className="mb-5">Outputs</Eyebrow>
                      <ul className="space-y-3">
                        {step.outputs.map((o) => (
                          <li key={o} className="flex gap-3 text-fg">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-4 shrink-0 bg-icon" />
                            <span>{o}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card border-l-2 border-l-deco p-6 sm:col-span-2">
                      <p className="eyebrow mb-2 text-accent-ink">What to expect</p>
                      <p className="text-muted">{step.expectation}</p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="surface-brand py-section">
        <div className="container-site">
          <Reveal>
            <SectionHeading
              id="principles-title"
              tone="brand"
              eyebrow="Working principles"
              title="How we keep projects honest."
            />
          </Reveal>
          <ul className="mt-14 grid gap-px overflow-hidden rounded-xl border border-jp-ivory/10 bg-jp-ivory/10 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80} className="bg-jp-navy p-8 sm:p-10">
                <span aria-hidden="true" className="mb-8 block h-8 w-px bg-jp-gold" />
                <h3 className="text-h3 text-jp-ivory">{p.title}</h3>
                <p className="mt-4 text-jp-ivory/75">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title="Start with a conversation."
        body="A scoping call is the simplest way to find out whether this approach fits your project."
        primary={{ label: 'Request a Scoping Call', to: '/contact' }}
        secondary={{ label: 'Explore Services', to: '/services' }}
      />
    </>
  );
}
