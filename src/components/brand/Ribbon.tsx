import { useId, useRef } from 'react';
import { cn } from '../../lib/cn';
import { RIBBON_VIEWBOX, hairlinePath, ribbonSpecs } from './ribbonGeometry';
import { useAmbientRibbon } from './useAmbientRibbon';

type RibbonProps = {
  className?: string;
  /** Plays the entrance animation (fade + line draw). Disabled automatically for prefers-reduced-motion. */
  animate?: boolean;
  /**
   * Continuous ambient motion: slow drift of the lines, a light glint travelling along each
   * leading line, and subtle pointer parallax. Off for prefers-reduced-motion and paused off-screen.
   */
  ambient?: boolean;
};

/**
 * Decorative fine-line motif: a few thin gold hairlines sweeping up the right-hand side,
 * echoing the flowing ribbon of the approved banner art — no filled or hatched areas.
 * Colours come from theme variables (--rb-*), so it adapts to light and dark.
 * Resolution-independent SVG; purely presentational and hidden from assistive technology.
 */
export default function Ribbon({ className, animate = true, ambient = false }: RibbonProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  useAmbientRibbon(svgRef, ambient);

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const ids = {
    line: `rb-line-${uid}`,
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
        {/* Gold at the lower end, fading to ivory (dark) / slate (light) and out at the top. */}
        <linearGradient id={ids.line} gradientUnits="userSpaceOnUse" x1="0" y1={height} x2={width} y2="0">
          <stop offset="0" style={{ stopColor: 'var(--rb-gold)', stopOpacity: 0 }} />
          <stop offset="0.25" style={{ stopColor: 'var(--rb-gold)', stopOpacity: 1 }} />
          <stop offset="0.7" style={{ stopColor: 'var(--rb-hi)', stopOpacity: 0.9 }} />
          <stop offset="1" style={{ stopColor: 'var(--rb-hi)', stopOpacity: 0.15 }} />
        </linearGradient>
        <filter id={ids.glow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id={ids.sweepGlow} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <g className={cn(animate && 'motion-safe:animate-fade-in')} style={{ opacity: 'var(--rb-strength)' }}>
        {ribbonSpecs.map((spec, i) =>
          spec.lines.map((line, j) => {
            const d = hairlinePath(spec, line.t);
            const part = line.primary ? 'edge' : 'line';
            return (
              <g key={`${i}-${j}`}>
                {line.primary && (
                  <path
                    data-rb={i}
                    data-part={part}
                    data-t={line.t}
                    d={d}
                    fill="none"
                    style={{ stroke: 'var(--rb-gold)', strokeOpacity: 'var(--rb-glow)' }}
                    strokeWidth={5}
                    filter={`url(#${ids.glow})`}
                  />
                )}
                <path
                  data-rb={i}
                  data-part={part}
                  data-t={line.t}
                  d={d}
                  fill="none"
                  stroke={`url(#${ids.line})`}
                  strokeOpacity={line.opacity}
                  strokeWidth={line.width}
                  strokeLinecap="round"
                  {...(line.primary
                    ? {
                        pathLength: 1,
                        strokeDasharray: '1',
                        className: cn(animate && 'motion-safe:animate-draw'),
                        style: animate ? { animationDelay: `${250 + i * 250}ms` } : undefined,
                      }
                    : {})}
                />
                {ambient && line.primary && (
                  // Light glint: a short bright dash that glides along the leading line, then rests.
                  // Its resting dash offset keeps it invisible; removed entirely for reduced motion.
                  <g className="motion-reduce:hidden">
                    {[
                      { width: 6, opacity: 0.5, filter: `url(#${ids.sweepGlow})`, stroke: 'var(--rb-gold)' },
                      { width: 2, opacity: 0.95, filter: undefined, stroke: 'var(--rb-sweep)' },
                    ].map((layer, k) => (
                      <path
                        key={k}
                        data-rb={i}
                        data-part="edge"
                        data-t={0}
                        d={d}
                        fill="none"
                        strokeOpacity={layer.opacity}
                        strokeWidth={layer.width}
                        strokeLinecap="round"
                        filter={layer.filter}
                        pathLength={1}
                        strokeDasharray="0.14 1"
                        strokeDashoffset={0.14}
                        className="motion-safe:animate-sweep"
                        style={{ stroke: layer.stroke, animationDelay: `${3200 + i * 2600}ms` }}
                      />
                    ))}
                  </g>
                )}
              </g>
            );
          }),
        )}
      </g>
    </svg>
  );
}
