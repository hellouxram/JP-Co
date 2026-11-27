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
        className="surface-dark relative isolate overflow-hidden lg:flex lg:min-h-[min(54rem,calc(100svh_-_var(--header-height)))] lg:items-center"
      >
        {/* Ribbon: below the copy on small screens (no overlap), right-hand side on desktop. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 -z-10 h-72 overflow-hidden sm:h-80 lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[58%]"
        >
          {heroBackground ? (
            <img
              src={heroBackground.src}
              width={heroBackground.width}
              height={heroBackground.height}
              alt=""
              decoding="async"
              className="h-full w-full object-cover object-right motion-safe:animate-fade-in"
            />
          ) : (
            <Ribbon className="h-full w-full" ambient />
          )}
          <div className="absolute inset-0 hidden bg-gradient-to-r from-jp-navy via-jp-navy/20 to-transparent lg:block" />
        </div>

        <div className="container-site w-full pb-80 pt-16 sm:pb-96 sm:pt-24 lg:py-28">
          <div className="max-w-3xl lg:max-w-[46rem]">
            <Eyebrow tone="dark" className="mb-8 motion-safe:animate-fade-up">
              AI · Product Design · Engineering
            </Eyebrow>
            <h1
              id="hero-title"
              className="text-display text-jp-ivory motion-safe:animate-fade-up"
              style={{ animationDelay: '80ms' }}
            >
              Technology built with purpose.
            </h1>
            <p
              className="mt-8 max-w-[36rem] text-lead text-jp-ivory/80 motion-safe:animate-fade-up"
              style={{ animationDelay: '160ms' }}
            >
              We design intelligent products, streamline complex workflows, and build software that helps businesses
              move forward.
            </p>
            <div
              className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center motion-safe:animate-fade-up"
              style={{ animationDelay: '240ms' }}
            >
              <ButtonLink to="/contact" variant="gold" arrow>
                Discuss a Project
              </ButtonLink>
              <ButtonLink to="/services" variant="outline-light">
                Explore Services
              </ButtonLink>
            </div>
            <div
              className="mt-16 flex items-center gap-5 motion-safe:animate-fade-up lg:mt-24"
              style={{ animationDelay: '320ms' }}
            >
              <span aria-hidden="true" className="h-10 w-px bg-jp-gold/70" />
              <p className="font-serif text-lg italic text-jp-ivory/80 sm:text-xl">{site.tagline}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Positioning ───────────── */}
      <section aria-labelledby="intro-title" className="bg-jp-ivory py-section">
        <div className="container-site grid gap-10 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <Eyebrow className="mb-6">Who we are</Eyebrow>
            <h2 id="intro-title" className="text-h2 text-jp-navy">
              A founder-led technology company.
            </h2>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:pt-14" delay={120}>
            <p className="text-lead text-jp-ink">
              JP &amp; Co. works across AI, product design and software engineering. We take on focused projects where
              clear thinking and careful engineering make the difference.
            </p>
            <p className="mt-6 text-jp-slate">
              Over time, we intend to build our own B2B SaaS products, shaped by the problems we encounter in that
              work.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex min-h-[2.75rem] items-center gap-2 font-medium text-jp-navy underline decoration-jp-navy/30 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-jp-navy"
            >
              About JP &amp; Co.
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ───────────── Services preview ───────────── */}
      <section aria-labelledby="services-title" className="border-y border-jp-border bg-jp-white py-section">
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
              <ButtonLink to="/services" variant="outline-dark" arrow>
                Explore Services
              </ButtonLink>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-px border border-jp-border bg-jp-border sm:grid-cols-2 xl:grid-cols-4">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 80}>
                <ServiceCard service={s} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── Approach strip ───────────── */}
      <section aria-labelledby="approach-title" className="bg-jp-ivory py-section">
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
                className="inline-flex min-h-[2.75rem] items-center gap-2 font-medium text-jp-navy underline decoration-jp-navy/30 decoration-1 underline-offset-[0.3em] transition-colors hover:decoration-jp-navy"
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
            <span className="block italic text-jp-slate">Let’s build the right solution.</span>
          </>
        }
        primary={{ label: 'Discuss a Project', to: '/contact' }}
        secondary={{ label: 'Explore Services', to: '/services' }}
      />
    </>
  );
}
