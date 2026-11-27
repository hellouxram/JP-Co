/**
 * Brand colour tokens for places where CSS custom properties cannot be used
 * (e.g. SVG presentation attributes). Keep in sync with src/styles/index.css.
 *
 * Contrast notes (WCAG 2.x, checked):
 *   ivory on navy 15.1:1 · gold on navy 8.4:1 · navy on gold 8.4:1
 *   slate on ivory 5.5:1 · slate on white 6.0:1 · ink on ivory 14.5:1
 *   gold on ivory 1.8:1  → decorative use only on light surfaces, never text.
 *   ivory @70% on navy 8.0:1 → minimum opacity used for muted text on navy.
 *   form borders: slate @80% on white 3.8:1 (≥ 3:1 for UI components).
 */
export const colors = {
  navy: '#0B1F3B',
  gold: '#D4B483',
  ivory: '#F8F5EB',
  slate: '#5B6470',
  white: '#FFFFFF',
  ink: '#172337',
  border: '#D9DDE3',
  /** Functional error state for forms (not a brand colour). */
  error: '#9B1C1C',
} as const;
