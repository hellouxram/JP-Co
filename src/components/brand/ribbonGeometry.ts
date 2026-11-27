/**
 * Geometry for the hero's decorative motif: a few fine gold hairlines sweeping up the
 * right-hand side, echoing the flowing ribbon of the approved banner art without filled
 * or hatched areas. Each "ribbon" is a pair of guide curves (a leading edge and an inner
 * edge); hairlines are drawn at chosen positions between them.
 * Pure functions — no React — so the shape can be unit-tested or pre-rendered.
 */

type Pt = readonly [number, number];
type Cubic = readonly [Pt, Pt, Pt, Pt];

export type Hairline = {
  /** Position between the leading edge (0) and the inner edge (1). */
  t: number;
  width: number;
  opacity: number;
  /** The leading line of each ribbon gets a soft glow, the intro draw and the light sweep. */
  primary?: boolean;
};

export type RibbonSpec = {
  edge: Cubic;
  inner: Cubic;
  lines: Hairline[];
};

export const RIBBON_VIEWBOX = { width: 900, height: 900 } as const;

/** Lines stay right of the headline on desktop and below the buttons on mobile. */
export const ribbonSpecs: RibbonSpec[] = [
  {
    edge: [
      [180, 960],
      [560, 860],
      [690, 430],
      [960, 170],
    ],
    inner: [
      [520, 960],
      [760, 880],
      [840, 640],
      [960, 520],
    ],
    lines: [
      { t: 0, width: 1.6, opacity: 1, primary: true },
      { t: 0.07, width: 0.8, opacity: 0.55 },
      { t: 0.2, width: 0.8, opacity: 0.4 },
      { t: 0.42, width: 0.7, opacity: 0.28 },
      { t: 0.75, width: 0.7, opacity: 0.18 },
    ],
  },
  {
    edge: [
      [480, 960],
      [700, 880],
      [780, 720],
      [960, 640],
    ],
    inner: [
      [700, 960],
      [820, 920],
      [880, 860],
      [960, 830],
    ],
    lines: [
      { t: 0, width: 1.3, opacity: 0.9, primary: true },
      { t: 0.25, width: 0.7, opacity: 0.35 },
      { t: 0.6, width: 0.7, opacity: 0.2 },
    ],
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

/** Path for a hairline at position `t` between the ribbon's two guide curves. */
export function hairlinePath(spec: Pick<RibbonSpec, 'edge' | 'inner'>, t: number): string {
  return cubicPath(lerpCubic(spec.edge, spec.inner, t));
}

/* ------------------------------------------------------------------
   Ambient motion: a slow, looping "silk in a draught" drift.
   Endpoints stay fixed off-canvas; only the inner control points move.
   The inner guide lags the leading edge, so the lines gently fan out,
   close up and twist.
   ------------------------------------------------------------------ */

/** One full cycle of the drift, in seconds. Long and slow by design. */
export const FLOW_PERIOD_S = 18;

const FLOW = [
  { amp: 34, phase: 0 },
  { amp: 24, phase: 2.1 },
];

const offset = (p: Pt, dx: number, dy: number): Pt => [p[0] + dx, p[1] + dy];

/** Guide curves at `time` seconds into the ambient loop (t = 0 → the static shape). */
export function flowSpec(spec: RibbonSpec, index: number, time: number): RibbonSpec {
  const { amp: A, phase } = FLOW[index % FLOW.length];
  const w = (2 * Math.PI) / FLOW_PERIOD_S;
  // Sine terms start at 0 for t = 0, so the first frame matches the static render exactly.
  const s = (k: number, lag = 0) => Math.sin(w * k * time + lag) - Math.sin(lag);
  const c = (k: number, lag = 0) => Math.cos(w * k * time + lag) - Math.cos(lag);
  const lag = 0.9;

  const e = spec.edge;
  const i = spec.inner;
  return {
    lines: spec.lines,
    edge: [
      e[0],
      offset(e[1], A * s(1, phase), A * 0.7 * c(1, phase)),
      offset(e[2], A * c(1, phase + 1.3), A * 0.6 * s(2, phase + 0.4)),
      offset(e[3], 0, A * 0.5 * s(1, phase + 2)),
    ],
    inner: [
      i[0],
      offset(i[1], A * 1.3 * s(1, phase + lag), A * 0.9 * c(1, phase + lag)),
      offset(i[2], A * 1.3 * c(1, phase + 1.3 + lag), A * 0.8 * s(2, phase + 0.4 + lag)),
      offset(i[3], 0, A * 0.7 * s(1, phase + 2 + lag)),
    ],
  };
}
