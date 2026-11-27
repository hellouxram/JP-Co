import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type Tone = 'light' | 'dark';

export function Eyebrow({ children, tone = 'light', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p
      className={cn(
        'eyebrow flex items-center gap-4',
        // Gold text only on navy (8.4:1). On light surfaces use slate text (5.5:1) with a decorative gold rule.
        tone === 'dark' ? 'text-jp-gold' : 'text-jp-slate',
        className,
      )}
    >
      <span aria-hidden="true" className="h-px w-8 shrink-0 bg-jp-gold" />
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
  tone = 'light',
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
      <H id={id} className={cn(H === 'h1' ? 'text-page-title' : 'text-h2', tone === 'dark' ? 'text-jp-ivory' : 'text-jp-navy')}>
        {title}
      </H>
      {intro && (
        <div className={cn('mt-6 max-w-prose text-lead', align === 'center' && 'mx-auto', tone === 'dark' ? 'text-jp-ivory/80' : 'text-jp-slate')}>
          {intro}
        </div>
      )}
    </div>
  );
}
