import { brandAssets } from '../../config/site';
import { cn } from '../../lib/cn';

type LockupAsset = (typeof brandAssets)['lockupDark'] | (typeof brandAssets)['lockupLight'];

type LogoProps = {
  /** Height utility (e.g. "h-9 lg:h-11"); width follows the artwork's aspect ratio (never stretched). */
  className?: string;
  /** Eager-load for above-the-fold placements (header). */
  priority?: boolean;
  /** Set when the surrounding link already provides the accessible name. */
  decorative?: boolean;
};

function LockupImage({
  asset,
  className,
  priority,
  decorative,
  wrapperClass,
}: LogoProps & { asset: LockupAsset; wrapperClass?: string }) {
  return (
    <picture className={wrapperClass}>
      <source srcSet={asset.webp} type="image/webp" />
      <img
        src={asset.png}
        width={asset.width}
        height={asset.height}
        alt={decorative ? '' : asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        className={cn('block w-auto select-none', className ?? 'h-10')}
        draggable={false}
      />
    </picture>
  );
}

/**
 * Theme-aware primary lockup for the header: gold monogram + divider + wordmark.
 * Light theme → navy wordmark; dark theme → ivory wordmark. Switching is pure CSS
 * (.show-light / .show-dark), so it follows the theme without JavaScript.
 * Never recolour the artwork with CSS filters.
 */
export function ThemedLogo(props: LogoProps) {
  return (
    <>
      <LockupImage {...props} asset={brandAssets.lockupLight} wrapperClass="show-light" />
      <LockupImage {...props} asset={brandAssets.lockupDark} wrapperClass="show-dark" />
    </>
  );
}

/** Ivory-wordmark lockup for always-navy brand zones (footer), in both themes. */
export function LogoOnNavy(props: LogoProps) {
  return <LockupImage {...props} asset={brandAssets.lockupDark} />;
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
