import { useEffect, type RefObject } from 'react';
import { bodyPath, cubicPath, flowSpec, ribbonSpecs, strandPaths } from './ribbonGeometry';

/** Geometry updates are capped at ~30fps: the drift is slow, so this is visually smooth and halves the work. */
const MORPH_INTERVAL_MS = 33;
/** Max pointer parallax offset in CSS px (also limited by the overscan below). */
const PARALLAX_X = 18;
const PARALLAX_Y = 12;
/**
 * While animating, the artwork is scaled up slightly so parallax and drift never
 * reveal its clipped edges. Offsets are clamped to the extra room this creates.
 */
const OVERSCAN = 1.06;

type Parts = {
  body: SVGPathElement | null;
  sheen: SVGPathElement | null;
  strands: SVGPathElement[];
  edges: SVGPathElement[]; // glow, crisp edge and light-sweep copies all follow the leading edge
};

/**
 * Drives the ambient hero motion directly on the DOM (no React re-renders):
 *  - a slow, seamless silk-like drift of every ribbon (see flowSpec)
 *  - gentle pointer parallax on devices with a fine pointer
 *
 * Off when the user prefers reduced motion, and paused while the hero is
 * off-screen or the tab is hidden, so it costs nothing when not visible.
 */
export function useAmbientRibbon(svgRef: RefObject<SVGSVGElement>, enabled: boolean) {
  useEffect(() => {
    const svg = svgRef.current;
    if (!enabled || !svg) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');

    const parts: Parts[] = ribbonSpecs.map((_, i) => {
      const q = (part: string) => svg.querySelectorAll<SVGPathElement>(`[data-rb="${i}"][data-part="${part}"]`);
      return {
        body: q('body')[0] ?? null,
        sheen: q('sheen')[0] ?? null,
        strands: Array.from(q('strand')),
        edges: Array.from(q('edge')),
      };
    });

    let raf = 0;
    let running = false;
    let inView = true;
    let elapsed = 0; // ms of motion played so far (pauses don't jump the animation)
    let lastTick = 0;
    let lastMorph = -Infinity;
    const pointer = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };
    const room = { x: PARALLAX_X, y: PARALLAX_Y };
    const measure = () => {
      const r = svg.getBoundingClientRect();
      room.x = Math.min(PARALLAX_X, (r.width * (OVERSCAN - 1)) / 2 - 1);
      room.y = Math.min(PARALLAX_Y, (r.height * (OVERSCAN - 1)) / 2 - 1);
    };

    const applyGeometry = (timeS: number) => {
      ribbonSpecs.forEach((spec, i) => {
        const s = flowSpec(spec, i, timeS);
        const p = parts[i];
        p.body?.setAttribute('d', bodyPath(s));
        p.sheen?.setAttribute('d', bodyPath(s, 0.16));
        const strands = strandPaths(s);
        p.strands.forEach((el, n) => strands[n] && el.setAttribute('d', strands[n].d));
        const edge = cubicPath(s.edge);
        p.edges.forEach((el) => el.setAttribute('d', edge));
      });
    };

    const frame = (now: number) => {
      if (!running) return;
      elapsed += lastTick ? Math.min(now - lastTick, 100) : 0;
      lastTick = now;

      if (elapsed - lastMorph >= MORPH_INTERVAL_MS) {
        lastMorph = elapsed;
        applyGeometry(elapsed / 1000);
      }

      // Ease the parallax towards the pointer; GPU-composited transform only.
      offset.x += (pointer.x - offset.x) * 0.06;
      offset.y += (pointer.y - offset.y) * 0.06;
      svg.style.transform = `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0) scale(${OVERSCAN})`;

      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || reduceMotion.matches || !inView || document.hidden) return;
      running = true;
      lastTick = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const reset = () => {
      stop();
      elapsed = 0;
      lastMorph = -Infinity;
      applyGeometry(0);
      svg.style.transform = '';
    };

    const onPointer = (e: PointerEvent) => {
      if (!finePointer.matches) return;
      pointer.x = -(e.clientX / window.innerWidth - 0.5) * 2 * room.x;
      pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2 * room.y;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    const onMotionPref = () => (reduceMotion.matches ? reset() : start());

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) start();
      else stop();
    });
    io.observe(svg);
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    measure();

    window.addEventListener('pointermove', onPointer, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    reduceMotion.addEventListener('change', onMotionPref);
    svg.style.willChange = 'transform';
    start();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      reduceMotion.removeEventListener('change', onMotionPref);
      svg.style.transform = '';
      svg.style.willChange = '';
    };
  }, [svgRef, enabled]);
}
