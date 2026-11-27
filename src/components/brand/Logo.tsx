import { brandAssets } from '../../config/site';
import { cn } from '../../lib/cn';

type LogoProps = {
  /** Rendered height in CSS px; width follows the artwork's aspect ratio (never stretched). */
  className?: string;
  /** Eager-load for above-the-fold placements (header). */
  priority?: boolean;
  /** Set when the surrounding link already provides the accessible name. */
  decorative?: boolean;
};

/**
 * Approved light-on-dark lockup: gold JP monogram, thin ivory divider, ivory
 * "JP & Co." wordmark and "TECHNOLOGY COMPANY" descriptor.
 *
 * Only place this on navy surfaces. A light-background version has not been
 * approved yet (see TODO_BEFORE_LAUNCH.md) — do not recolour with CSS filters.
 */
export function LogoLockup({ className, priority = false, decorative = false }: LogoProps) {
  const a = brandAssets.lockupOnDark;
  return (
    <picture>
      <source srcSet={a.webp} type="image/webp" />
      <img
        src={a.png}
        width={a.width}
        height={a.height}
        alt={decorative ? '' : a.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={cn('block w-auto select-none', className ?? 'h-10')}
        draggable={false}
      />
    </picture>
  );
}

/** Gold intertwined JP monogram, for compact placements on navy. */
export function Monogram({ className, decorative = true }: Omit<LogoProps, 'priority'>) {
  const a = brandAssets.monogram;
  return (
    <picture>
      <source srcSet={a.webp} type="image/webp" />
      <img
        src={a.png}
        width={a.width}
        height={a.height}
        alt={decorative ? '' : 'JP monogram'}
        loading="lazy"
        decoding="async"
        className={cn('block w-auto select-none', className ?? 'h-16')}
        draggable={false}
      />
    </picture>
  );
}
