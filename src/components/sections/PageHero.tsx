import type { ReactNode } from 'react';
import Ribbon from '../brand/Ribbon';
import { Eyebrow } from '../ui/SectionHeading';

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
};

/** Compact navy hero used on inner pages. Text is live HTML; the ribbon is decorative. */
export default function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section aria-labelledby="page-title" className="surface-dark relative isolate overflow-hidden">
      {/* On small screens the ribbon sits faintly behind the text so contrast stays well above AA. */}
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-full opacity-30 lg:w-[60%] lg:opacity-100">
        <Ribbon className="h-full w-full" />
        {/* Keeps the left side of the ribbon from competing with the text. */}
        <div className="absolute inset-0 hidden bg-gradient-to-r from-jp-navy via-jp-navy/30 to-transparent lg:block" />
      </div>
      <div className="container-site pb-20 pt-16 sm:pb-24 sm:pt-20 lg:pb-32 lg:pt-28">
        <div className="max-w-3xl motion-safe:animate-fade-up">
          <Eyebrow tone="dark" className="mb-6">
            {eyebrow}
          </Eyebrow>
          <h1 id="page-title" className="text-page-title text-jp-ivory">
            {title}
          </h1>
          {intro && <div className="mt-6 max-w-prose text-lead text-jp-ivory/80">{intro}</div>}
          {children && <div className="mt-10">{children}</div>}
        </div>
      </div>
    </section>
  );
}
