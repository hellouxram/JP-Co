/**
 * Geometry for the decorative "flowing ribbon" motif from the approved banner.
 * Each ribbon is a family of cubic curves interpolated between a bright leading
 * edge and a softer inner edge, which produces the fine silk-like line texture.
 * Pure functions — no React — so the shape can be unit-tested or pre-rendered.
 */

type Pt = readonly [number, number];
type Cubic = readonly [Pt, Pt, Pt, Pt];

export type RibbonSpec = {
  edge: Cubic;
  inner: Cubic;
  lines: number;
};

export const RIBBON_VIEWBOX = { width: 900, height: 900 } as const;

export const ribbonSpecs: RibbonSpec[] = [
  {
    edge: [
      [40, 960],
      [380, 760],
      [430, 300],
      [960, -40],
    ],
    inner: [
      [330, 960],
      [560, 800],
      [640, 560],
      [960, 420],
    ],
    lines: 48,
  },
  {
    edge: [
      [400, 960],
      [600, 820],
      [690, 650],
      [960, 560],
    ],
    inner: [
      [620, 960],
      [740, 880],
      [820, 820],
      [960, 790],
    ],
    lines: 28,
  },
];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const fmt = (p: Pt) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

export function cubicPath(c: Cubic): string {
  return `M${fmt(c[0])} C${fmt(c[1])} ${fmt(c[2])} ${fmt(c[3])}`;
}

function lerpCubic(a: Cubic, b: Cubic, t: number): Cubic {
  return [lerpPt(a[0], b[0], t), lerpPt(a[1], b[1], t), lerpPt(a[2], b[2], t), lerpPt(a[3], b[3], t)];
}

/**
 * Closed shape between the leading edge and a curve `depth` of the way to the inner edge.
 * depth = 1 gives the full ribbon body; small values give the bright "sheen" band.
 */
export function bodyPath(spec: RibbonSpec, depth = 1): string {
  const e = spec.edge;
  const i = lerpCubic(spec.edge, spec.inner, depth);
  return `${cubicPath(e)} L${fmt(i[3])} C${fmt(i[2])} ${fmt(i[1])} ${fmt(i[0])} Z`;
}

/** Interpolated strands. `t` (0 = leading edge, 1 = inner edge) drives opacity. */
export function strandPaths(spec: RibbonSpec): { d: string; t: number }[] {
  const out: { d: string; t: number }[] = [];
  for (let n = 0; n <= spec.lines; n++) {
    // Ease the spacing so strands bunch near the bright edge, like folded silk.
    const t = Math.pow(n / spec.lines, 1.6);
    out.push({ d: cubicPath(lerpCubic(spec.edge, spec.inner, t)), t });
  }
  return out;
}
