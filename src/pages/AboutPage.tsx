import { Monogram } from '../components/brand/Logo';
import CtaBand from '../components/sections/CtaBand';
import PageHero from '../components/sections/PageHero';
import { MailIcon } from '../components/ui/Icons';
import Reveal from '../components/ui/Reveal';
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading';
import { values } from '../config/content';
import { site } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta('/about');

  return (
    <>
      <PageHero
        eyebrow="About"
        title="A founder-led technology business."
        intro="JP & Co. designs intelligent products, streamlines complex workflows and builds software — with a long-term aim of creating our own B2B SaaS products."
      />

      {/* Mission + founder */}
      <section aria-labelledby="mission-title" className="bg-jp-ivory py-section">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow className="mb-6">Mission</Eyebrow>
            <h2 id="mission-title" className="text-h2 text-jp-navy">
              To build technology that is useful, well made, and honest about what it can do.
            </h2>
            <p className="mt-8 max-w-prose text-lead text-jp-slate">
              We focus on the problems that matter to the business — then choose the simplest approach that solves
              them well, whether that is an automation, a better-designed product or new software.
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5" delay={120}>
            <div className="surface-dark relative overflow-hidden p-10 sm:p-12">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jp-gold/70 to-transparent" />
              <Monogram className="h-20" />
              <div className="mt-10">
                <p className="eyebrow text-jp-gold">Leadership</p>
                <p className="mt-4 font-serif text-3xl text-jp-ivory">{site.founder.name}</p>
                <p className="mt-2 text-jp-ivory/80">{site.founder.title}</p>
                <a
                  href={site.contact.emailHref}
                  className="link mt-8 inline-flex min-h-[2.75rem] items-center gap-3 text-jp-ivory/90 hover:text-jp-ivory"
                >
                  <MailIcon className="h-4 w-4 text-jp-gold" />
                  {site.contact.email}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Direction */}
      <section aria-labelledby="direction-title" className="border-y border-jp-border bg-jp-white py-section">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <SectionHeading id="direction-title" eyebrow="Direction" title="From services to products." />
          </Reveal>
          <Reveal className="space-y-6 text-lead text-jp-ink lg:col-span-7 lg:pt-14" delay={120}>
            <p>
              Today, JP &amp; Co. works with businesses on AI and workflow automation, product design, software
              engineering and product strategy.
            </p>
            <p className="text-jp-slate">
              Over time, we plan to develop proprietary B2B SaaS products, informed by the problems we see in that
              work. Our services and our products share the same standard: clear purpose, careful design and solid
              engineering.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="bg-jp-ivory py-section">
        <div className="container-site">
          <Reveal>
            <SectionHeading id="values-title" eyebrow="Values" title="What we hold ourselves to." />
          </Reveal>
          <ul className="mt-14 grid border-t border-jp-border sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <Reveal
                as="li"
                key={v.title}
                delay={i * 80}
                className="border-b border-jp-border py-10 sm:odd:pr-8 sm:even:border-l sm:even:pl-8 lg:border-b-0 lg:px-8 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l"
              >
                <h3 className="text-h3 text-jp-navy">{v.title}</h3>
                <p className="mt-3 text-jp-slate">{v.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title={
          <>
            Built on vision. <span className="italic text-jp-slate">Driven by innovation.</span>
          </>
        }
        body="If you have a problem worth solving, we would be glad to hear about it."
        primary={{ label: 'Discuss a Project', to: '/contact' }}
      />
    </>
  );
}
