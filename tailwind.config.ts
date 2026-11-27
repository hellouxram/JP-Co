import type { Config } from 'tailwindcss';

/**
 * Design tokens. Source of truth: CSS custom properties in src/styles/index.css.
 *  - `jp.*`   brand constants (identical in both themes) — for always-navy brand zones.
 *  - semantic (page, surface, fg, muted, …) switch between the light and dark themes.
 * Values are RGB channels so opacity modifiers (e.g. text-fg/80) work.
 */
const brand = (name: string) => `rgb(var(--jp-${name}-rgb) / <alpha-value>)`;
const theme = (name: string) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jp: {
          navy: brand('navy'),
          'navy-deep': brand('navy-deep'),
          gold: brand('gold'),
          'gold-light': brand('gold-light'),
          ivory: brand('ivory'),
          slate: brand('slate'),
          mist: brand('mist'),
          white: brand('white'),
        },
        page: theme('page'),
        surface: theme('surface'),
        raised: theme('raised'),
        header: theme('header'),
        fg: theme('fg'),
        muted: theme('muted'),
        line: theme('line'),
        field: theme('field'),
        input: theme('input'),
        accent: theme('accent'),
        'accent-ink': theme('accent-ink'),
        deco: theme('deco'),
        icon: theme('icon'),
        btn: theme('btn'),
        'btn-fg': theme('btn-fg'),
        'btn-hover': theme('btn-hover'),
        danger: theme('danger'),
        focus: theme('focus'),
        'hero-fade': 'rgb(var(--hero-fade) / <alpha-value>)',
      },
      fontFamily: {
        serif: ['"Playfair Display Variable"', '"Playfair Display"', 'Georgia', '"Times New Roman"', 'serif'],
        sans: [
          '"Inter Variable"',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        // Fluid type scale (brief: hero ~64–88px desktop, sections ~40–56px, body 16–18px)
        display: ['clamp(2.75rem, 6vw, 5.75rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'page-title': ['clamp(2.5rem, 1.6rem + 3.2vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.018em' }],
        h2: ['clamp(2rem, 3.8vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.5rem, 1.3rem + 0.7vw, 1.875rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.0625rem, 0.98rem + 0.4vw, 1.3125rem)', { lineHeight: '1.6' }],
        body: ['clamp(1rem, 0.96rem + 0.18vw, 1.125rem)', { lineHeight: '1.7' }],
        eyebrow: ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.22em' }],
      },
      maxWidth: {
        site: '80rem',
        prose: '42rem',
      },
      spacing: {
        gutter: 'clamp(1rem, 4vw, 3rem)',
        section: 'clamp(3.5rem, 2rem + 5vw, 7rem)',
      },
      transitionTimingFunction: {
        'out-soft': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        draw: {
          from: { strokeDashoffset: '1' },
          to: { strokeDashoffset: '0' },
        },
        // Light sweep along the ribbon edge (pathLength = 1, dash = 0.14): glide, then rest.
        sweep: {
          '0%': { strokeDashoffset: '0.14' },
          '55%, 100%': { strokeDashoffset: '-1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 1.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        draw: 'draw 2.4s cubic-bezier(0.22, 1, 0.36, 1) both',
        sweep: 'sweep 11s cubic-bezier(0.45, 0, 0.25, 1) infinite both',
      },
    },
  },
  plugins: [],
} satisfies Config;
