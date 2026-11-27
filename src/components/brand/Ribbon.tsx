import { useId } from 'react';
import { colors } from '../../config/tokens';
import { cn } from '../../lib/cn';
import { RIBBON_VIEWBOX, bodyPath, cubicPath, ribbonSpecs, strandPaths } from './ribbonGeometry';

type RibbonProps = {
  className?: string;
  /** Plays the entrance animation (fade + edge draw). Disabled automatically for prefers-reduced-motion. */
  animate?: boolean;
};

/**
 * Decorative navy-and-gold flowing ribbon, echoing the approved banner art.
 * Rendered as resolution-independent SVG so it stays crisp on large and high-DPI screens.
 * Purely presentational: hidden from assistive technology.
 */
export default function Ribbon({ className, animate = true }: RibbonProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = {
    ambient: `rb-ambient-${uid}`,
    body: `rb-body-${uid}`,
    sheen: `rb-sheen-${uid}`,
    strand: `rb-strand-${uid}`,
    edge: `rb-edge-${uid}`,
    glow: `rb-glow-${uid}`,
  };
  const { width, height } = RIBBON_VIEWBOX;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMaxYMax slice"
      aria-hidden="true"
      focusable="false"
      className={cn('pointer-events-none select-none', className)}
    >
      <defs>
        <radialGradient id={ids.ambient} cx="0.62" cy="0.62" r="0.55">
          <stop offset="0" stopColor={colors.gold} stopOpacity="0.08" />
          <stop offset="1" stopColor={colors.gold} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.body} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor={colors.ivory} stopOpacity="0" />
          <stop offset="0.45" stopColor={colors.ivory} stopOpacity="0.06" />
          <stop offset="1" stopColor={colors.ivory} stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id={ids.sheen} gradientUnits="userSpaceOnUse" x1="0" y1={height} x2={width} y2="0">
          <stop offset="0" stopColor={colors.gold} stopOpacity="0" />
          <stop offset="0.35" stopColor={colors.gold} stopOpacity="0.16" />
          <stop offset="0.7" stopColor={colors.ivory} stopOpacity="0.22" />
          <stop offset="1" stopColor={colors.ivory} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={ids.strand} gradientUnits="userSpaceOnUse" x1="0" y1={height} x2={width} y2="0">
          <stop offset="0" stopColor={colors.gold} stopOpacity="0" />
          <stop offset="0.3" stopColor={colors.gold} stopOpacity="1" />
          <stop offset="0.72" stopColor={colors.ivory} stopOpacity="0.9" />
          <stop offset="1" stopColor={colors.ivory} stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={ids.edge} gradientUnits="userSpaceOnUse" x1="0" y1={height} x2={width} y2="0">
          <stop offset="0" stopColor={colors.gold} stopOpacity="0" />
          <stop offset="0.22" stopColor={colors.gold} stopOpacity="1" />
          <stop offset="0.7" stopColor={colors.ivory} stopOpacity="1" />
          <stop offset="1" stopColor={colors.ivory} stopOpacity="0.5" />
        </linearGradient>
        <filter id={ids.glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      <g className={cn(animate && 'motion-safe:animate-fade-in')}>
        <rect width={width} height={height} fill={`url(#${ids.ambient})`} />
        {ribbonSpecs.map((spec, i) => (
          <g key={i}>
            <path d={bodyPath(spec)} fill={`url(#${ids.body})`} />
            <path d={bodyPath(spec, 0.16)} fill={`url(#${ids.sheen})`} />
            <g fill="none" stroke={`url(#${ids.strand})`} strokeWidth={0.7}>
              {strandPaths(spec).map((s, j) => (
                <path key={j} d={s.d} strokeOpacity={0.1 + (1 - s.t) * 0.55} />
              ))}
            </g>
            <path
              d={cubicPath(spec.edge)}
              fill="none"
              stroke={colors.gold}
              strokeOpacity={0.7}
              strokeWidth={6}
              filter={`url(#${ids.glow})`}
            />
            <path
              d={cubicPath(spec.edge)}
              fill="none"
              stroke={`url(#${ids.edge})`}
              strokeWidth={1.8}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              className={cn(animate && 'motion-safe:animate-draw')}
              style={animate ? { animationDelay: `${250 + i * 250}ms` } : undefined}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
