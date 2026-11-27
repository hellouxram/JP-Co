/**
 * Geometry for the decorative "flowing ribbon" motif from the approved banner.
 * Each ribbon is a family of cubic curves interpolated between a bright leading
 * edge and a softer inner edge, which produces the fine silk-like line texture.
 * Pure functions — no React — so the shape can be unit-tested or pre-rendered.
 *
 * Two layouts:
 *  - `full`: wide artwork that covers the entire home-page hero (behind the copy).
 *  - `side`: compact artwork anchored to the right of the inner-page heroes.
 */

type Pt = readonly [number, number];
type Cubic = readonly [Pt, Pt, Pt, Pt];

export type RibbonSpec = {
  edge: Cubic;
  inner: Cubic;
  lines: number;
  /** Overall strength of this ribbon (1 = full). */
  opacity?: number;
};

export type RibbonLayout = 'side' | 'full';

type LayoutDef = {
  viewBox: { width: number; height: number };
  preserveAspectRatio: string;
  specs: RibbonSpec[];
  /** Drift amplitude (viewBox units) and phase per ribbon. */
  flow: { amp: number; phase: number }[];
};

export const RIBBON_LAYOUTS: Record<RibbonLayout, LayoutDef> = {
  full: {
    viewBox: { width: 1600, height: 900 },
    preserveAspectRatio: 'xMidYMid slice',
    specs: [
      {
        // Main silk sweep: lower-left to upper-right across the whole hero.
        edge: [
          [-100, 980],
          [520, 860],
          [860, 260],
          [1700, 60],
        ],
        inner: [
          [320, 980],
          [860, 900],
          [1180, 520],
          [1700, 430],
        ],
        lines: 56,
      },
      {
        // Secondary ribbon, lower right.
        edge: [
          [620, 980],
          [1020, 860],
          [1260, 700],
          [1700, 610],
        ],
        inner: [
          [920, 980],
          [1220, 940],
          [1420, 860],
          [1700, 840],
        ],
        lines: 32,
      },
      {
        // Faint upper ribbon, top-left — gives depth behind the headline.
        edge: [
          [-100, 330],
          [300, 140],
          [720, 190],
          [1250, -60],
        ],
        inner: [
          [-100, 520],
          [380, 300],
          [820, 280],
          [1450, -60],
        ],
        lines: 28,
        opacity: 0.55,
      },
    ],
    flow: [
      { amp: 60, phase: 0 },
      { amp: 42, phase: 2.1 },
      { amp: 40, phase: 4.2 },
    ],
  },
  side: {
    viewBox: { width: 900, height: 900 },
    preserveAspectRatio: 'xMaxYMax slice',
    specs: [
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
    ],
    flow: [
      { amp: 42, phase: 0 },
      { amp: 30, phase: 2.1 },
    ],
  },
};

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

/* ------------------------------------------------------------------
   Ambient motion: a slow, looping "silk in a draught" drift.
   Endpoints stay fixed off-canvas so the ribbon never detaches from the
   edges; only the inner control points move. The inner edge lags the
   leading edge, so the ribbon gently widens, narrows and twists.
   ------------------------------------------------------------------ */

/** One full cycle of the drift, in seconds. Long and slow by design. */
export const FLOW_PERIOD_S = 18;

const offset = (p: Pt, dx: number, dy: number): Pt => [p[0] + dx, p[1] + dy];

/** Returns the ribbon's geometry at `time` seconds into the ambient loop (t = 0 → the static shape). */
export function flowSpec(spec: RibbonSpec, flow: { amp: number; phase: number }, time: number): RibbonSpec {
  const { amp: A, phase } = flow;
  const w = (2 * Math.PI) / FLOW_PERIOD_S;
  // Sine terms start at 0 for t = 0, so the first frame matches the static render exactly.
  const s = (k: number, lag = 0) => Math.sin(w * k * time + lag) - Math.sin(lag);
  const c = (k: number, lag = 0) => Math.cos(w * k * time + lag) - Math.cos(lag);
  const lag = 0.9;

  const e = spec.edge;
  const i = spec.inner;
  return {
    ...spec,
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
