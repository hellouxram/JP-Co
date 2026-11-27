import type { ReactNode } from 'react';
import { ButtonLink } from '../ui/Button';
import Reveal from '../ui/Reveal';

type CtaBandProps = {
  title: ReactNode;
  body?: ReactNode;
  primary: { label: string; to: string };
  secondary?: { label: string; to: string };
};

/** Closing call-to-action on an ivory surface, framed by hairlines. */
export default function CtaBand({ title, body, primary, secondary }: CtaBandProps) {
  return (
    <section aria-labelledby="cta-title" className="bg-page py-section">
      <div className="container-site">
        <Reveal className="relative border-y border-line py-16 text-center sm:py-20">
          <span aria-hidden="true" className="mx-auto mb-10 block h-12 w-px bg-deco" />
          <h2 id="cta-title" className="mx-auto max-w-4xl text-h2 text-fg">
            {title}
          </h2>
          {body && <p className="mx-auto mt-6 max-w-prose text-lead text-muted">{body}</p>}
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            <ButtonLink to={primary.to} variant="primary" arrow>
              {primary.label}
            </ButtonLink>
            {secondary && (
              <ButtonLink to={secondary.to} variant="outline">
                {secondary.label}
              </ButtonLink>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
