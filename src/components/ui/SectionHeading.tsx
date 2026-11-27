import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

/** `themed` follows light/dark theme; `brand` is for always-navy brand bands. */
type Tone = 'themed' | 'brand';

export function Eyebrow({ children, tone = 'themed', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p
      className={cn(
        'eyebrow flex items-center gap-4',
        // Small gold text: accessible accent-ink in themed areas (≥ 4.6:1), champagne on brand navy (8.4:1).
        tone === 'brand' ? 'text-jp-gold' : 'text-accent-ink',
        className,
      )}
    >
      <span aria-hidden="true" className={cn('h-px w-8 shrink-0', tone === 'brand' ? 'bg-jp-gold' : 'bg-deco')} />
      <span>{children}</span>
    </p>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: Tone;
  id?: string;
  /** Heading level — keep document outline correct (h1 only once per page). */
  as?: 'h1' | 'h2';
  align?: 'left' | 'center';
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = 'themed',
  id,
  as: H = 'h2',
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <Eyebrow tone={tone} className={cn('mb-6', align === 'center' && 'justify-center')}>
          {eyebrow}
        </Eyebrow>
      )}
      <H id={id} className={cn(H === 'h1' ? 'text-page-title' : 'text-h2', tone === 'brand' ? 'text-jp-ivory' : 'text-fg')}>
        {title}
      </H>
      {intro && (
        <div className={cn('mt-6 max-w-prose text-lead', align === 'center' && 'mx-auto', tone === 'brand' ? 'text-jp-ivory/80' : 'text-muted')}>
          {intro}
        </div>
      )}
    </div>
  );
}
