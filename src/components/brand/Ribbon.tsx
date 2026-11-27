import { useId, useRef } from 'react';
import { colors } from '../../config/tokens';
import { cn } from '../../lib/cn';
import { RIBBON_VIEWBOX, bodyPath, cubicPath, ribbonSpecs, strandPaths } from './ribbonGeometry';
import { useAmbientRibbon } from './useAmbientRibbon';

type RibbonProps = {
  className?: string;
  /** Plays the entrance animation (fade + edge draw). Disabled automatically for prefers-reduced-motion. */
  animate?: boolean;
  /**
   * Continuous ambient motion: slow silk-like drift, a light sweep travelling along each
   * leading edge, and subtle pointer parallax. Off for prefers-reduced-motion and paused off-screen.
   */
  ambient?: boolean;
};

/**
 * Decorative navy-and-gold flowing ribbon, echoing the approved banner art.
 * Rendered as resolution-independent SVG so it stays crisp on large and high-DPI screens.
 * Purely presentational: hidden from assistive technology.
 */
export default function Ribbon({ className, animate = true, ambient = false }: RibbonProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useAmbientRibbon(svgRef, ambient);

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = {
    ambient: `rb-ambient-${uid}`,
    body: `rb-body-${uid}`,
    sheen: `rb-sheen-${uid}`,
    strand: `rb-strand-${uid}`,
    edge: `rb-edge-${uid}`,
    glow: `rb-glow-${uid}`,
    sweepGlow: `rb-sweep-glow-${uid}`,
  };
  const { width, height } = RIBBON_VIEWBOX;

  return (
    <svg
      ref={svgRef}
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
        <filter id={ids.sweepGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className={cn(animate && 'motion-safe:animate-fade-in')}>
        <rect width={width} height={height} fill={`url(#${ids.ambient})`} />
        {ribbonSpecs.map((spec, i) => {
          const edgeD = cubicPath(spec.edge);
          return (
            <g key={i}>
              <path data-rb={i} data-part="body" d={bodyPath(spec)} fill={`url(#${ids.body})`} />
              <path data-rb={i} data-part="sheen" d={bodyPath(spec, 0.16)} fill={`url(#${ids.sheen})`} />
              <g fill="none" stroke={`url(#${ids.strand})`} strokeWidth={0.7}>
                {strandPaths(spec).map((s, j) => (
                  <path key={j} data-rb={i} data-part="strand" d={s.d} strokeOpacity={0.1 + (1 - s.t) * 0.55} />
                ))}
              </g>
              <path
                data-rb={i}
                data-part="edge"
                d={edgeD}
                fill="none"
                stroke={colors.gold}
                strokeOpacity={0.7}
                strokeWidth={6}
                filter={`url(#${ids.glow})`}
              />
              <path
                data-rb={i}
                data-part="edge"
                d={edgeD}
                fill="none"
                stroke={`url(#${ids.edge})`}
                strokeWidth={1.8}
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                className={cn(animate && 'motion-safe:animate-draw')}
                style={animate ? { animationDelay: `${250 + i * 250}ms` } : undefined}
              />
              {ambient && (
                // Light sweep: a short bright dash that glides along the leading edge, then rests.
                // Its resting dash offset keeps it invisible, and it is removed entirely for reduced motion.
                <g className="motion-reduce:hidden">
                  {[
                    { width: 7, opacity: 0.55, filter: `url(#${ids.sweepGlow})`, stroke: colors.gold },
                    { width: 2.2, opacity: 0.95, filter: undefined, stroke: colors.ivory },
                  ].map((layer, k) => (
                    <path
                      key={k}
                      data-rb={i}
                      data-part="edge"
                      d={edgeD}
                      fill="none"
                      stroke={layer.stroke}
                      strokeOpacity={layer.opacity}
                      strokeWidth={layer.width}
                      strokeLinecap="round"
                      filter={layer.filter}
                      pathLength={1}
                      strokeDasharray="0.14 1"
                      strokeDashoffset={0.14}
                      className="motion-safe:animate-sweep"
                      style={{ animationDelay: `${3200 + i * 2600}ms` }}
                    />
                  ))}
                </g>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
