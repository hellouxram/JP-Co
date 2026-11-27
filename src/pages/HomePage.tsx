import { Link } from 'react-router-dom';
import Ribbon from '../components/brand/Ribbon';
import CtaBand from '../components/sections/CtaBand';
import ProcessStrip from '../components/sections/ProcessStrip';
import ServiceCard from '../components/sections/ServiceCard';
import { ButtonLink } from '../components/ui/Button';
import { ArrowRightIcon } from '../components/ui/Icons';
import Reveal from '../components/ui/Reveal';
import SectionHeading, { Eyebrow } from '../components/ui/SectionHeading';
import { services } from '../config/content';
import { brandAssets, site } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

export default function HomePage() {
  usePageMeta('/');
  const { heroBackground } = brandAssets;

  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section
        aria-labelledby="hero-title"
        className="surface-hero relative isolate overflow-hidden border-b border-line lg:flex lg:min-h-[min(54rem,calc(100svh_-_var(--header-height)))] lg:items-center"
      >
        {/* Motion graphic covering the entire hero: flowing silk ribbons drift slowly behind the copy.
            A theme-coloured scrim keeps the text side calm and readable (AA) in both themes. */}
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          {heroBackground ? (
            <img
              src={heroBackground.src}
              width={heroBackground.width}
              height={heroBackground.height}
              alt=""
              decoding="async"
              className="h-full w-full object-cover motion-safe:animate-fade-in"
            />
          ) : (
            <Ribbon className="h-full w-full" layout="full" ambient />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-hero-fade/75 via-hero-fade/55 via-60% to-hero-fade/10 lg:bg-gradient-to-r lg:from-hero-fade/85 lg:via-hero-fade/45 lg:via-40% lg:to-transparent lg:to-75%" />
        </div>

        <div className="container-site w-full pb-40 pt-16 sm:pb-48 sm:pt-24 lg:py-28">
          <div className="max-w-3xl lg:max-w-[46rem]">
            <Eyebrow className="mb-8 motion-safe:animate-fade-up">
              AI · Product Design · Engineering
            </Eyebrow>
            <h1
              id="hero-title"
              className="text-display text-fg motion-safe:animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              Technology built with purpose.
            </h1>
            <p
              className="mt-8 max-w-[36rem] text-lead text-muted motion-safe:animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              We design intelligent products, streamline complex workflows, and build software that helps businesses
              move forward.
            </p>
            <div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center motion-safe:animate-fade-up"
              style={{ animationDelay: '240ms' }}
            >
              <ButtonLink to="/contact" variant="primary" arrow>
                Discuss a Project
              </ButtonLink>
              <ButtonLink to="/services" variant="outline">
                Explore Services
              </ButtonLink>
            </div>
            <div
              className="mt-16 flex items-center gap-5 motion-safe:animate-fade-up lg:mt-24"
              style={{ animationDelay: '320ms' }}
            >
              <span aria-hidden="true" className="h-10 w-px bg-deco/70" />
              <p className="font-serif text-lg italic text-muted sm:text-xl">{site.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Positioning ───────────── */}
      <section aria-labelledby="intro-title" className="bg-surface py-section">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Eyebrow className="mb-6">Who we are</Eyebrow>
            <h2 id="intro-title" className="text-h2 text-fg">
              A founder-led technology company.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:pt-14" delay={120}>
            <p className="text-lead text-fg">
              JP &amp; Co. works across AI, product design and software engineering. We take on focused projects where
              clear thinking and careful engineering make the difference.
            </p>
            <p className="mt-6 text-muted">
              Over time, we intend to build our own B2B SaaS products, shaped by the problems we encounter in that
              work.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex min-h-[2.75rem] items-center gap-2 font-medium text-fg underline decoration-fg/30 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-fg"
            >
              About JP &amp; Co.
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Services preview ───────────── */}
      <section aria-labelledby="services-title" className="border-y border-line bg-page py-section">
        <div className="container-site">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                id="services-title"
                eyebrow="Services"
                title="What we do"
                intro="Four connected disciplines, used together or on their own — depending on what the problem needs."
              />
            </Reveal>
            <Reveal delay={100}>
              <ButtonLink to="/services" variant="outline" arrow>
                Explore Services
              </ButtonLink>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Approach strip ───────────── */}
      <section aria-labelledby="approach-title" className="bg-surface py-section">
        <div className="container-site">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Reveal>
              <SectionHeading
                id="approach-title"
                eyebrow="Approach"
                title="Discover. Design. Build. Improve."
                intro="A simple, transparent process with tangible outputs at every step — so you always know where things stand."
              />
            </Reveal>
            <Reveal delay={100}>
              <Link
                to="/approach"
                className="inline-flex min-h-[2.75rem] items-center gap-2 font-medium text-fg underline decoration-fg/30 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-fg"
              >
                See how we work
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <ProcessStrip className="mt-14" />
        </div>
      </section>

      {/* ───────────── Closing CTA ───────────── */}
      <CtaBand
        title={
          <>
            Have a complex problem worth solving?{' '}
            <span className="block italic text-muted">Let’s build the right solution.</span>
          </>
        }
        primary={{ label: 'Discuss a Project', to: '/contact' }}
        secondary={{ label: 'Explore Services', to: '/services' }}
      />
    </>
  );
}
