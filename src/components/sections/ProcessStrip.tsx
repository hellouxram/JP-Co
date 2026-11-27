import { processSteps } from '../../config/content';
import { cn } from '../../lib/cn';
import { ArrowRightIcon } from '../ui/Icons';
import Reveal from '../ui/Reveal';

/** Discover → Design → Build → Improve, as an ordered list with hairline dividers. */
export default function ProcessStrip({ className }: { className?: string }) {
  return (
    <ol className={cn('grid border-t border-line sm:grid-cols-2 lg:grid-cols-4 lg:border-b', className)}>
      {processSteps.map((step, i) => (
        <Reveal
          as="li"
          key={step.title}
          delay={i * 90}
          className={cn(
            'relative border-b border-line py-10',
            'sm:odd:pr-8 sm:even:border-l sm:even:pl-8',
            'lg:border-b-0 lg:px-8 lg:py-12 lg:first:pl-0 lg:last:pr-0 lg:[&:not(:first-child)]:border-l',
          )}
        >
          <div className="flex items-center justify-between">
            <p className="font-sans text-sm font-medium tracking-[0.18em] text-muted">
              <span className="sr-only">Step </span>
              {step.number}
            </p>
            {i < processSteps.length - 1 && (
              <ArrowRightIcon className="hidden h-5 w-5 text-deco lg:block" />
            )}
          </div>
          <h3 className="mt-6 text-h3 text-fg">{step.title}</h3>
          <p className="mt-3 text-muted">{step.summary}</p>
        </Reveal>
      ))}
    </ol>
  );
}
