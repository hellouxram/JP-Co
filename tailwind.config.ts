import type { Config } from 'tailwindcss';

/**
 * Brand tokens. The source of truth for each colour is the CSS custom property
 * in src/styles/index.css (values copied verbatim from the brand brief).
 * Tailwind reads the RGB-channel variant so opacity modifiers (e.g. text-jp-ivory/80) work.
 */
const token = (name: string) => `rgb(var(--jp-${name}-rgb) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        jp: {
          navy: token('navy'),
          gold: token('gold'),
          ivory: token('ivory'),
          slate: token('slate'),
          white: token('white'),
          ink: token('ink'),
          border: token('border'),
          /** Functional error state — not part of the brand palette. */
          error: token('error'),
        },
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
        display: ['clamp(2.75rem, 1.55rem + 4.4vw, 5.5rem)', { lineHeight: '1.04', letterSpacing: '-0.02em' }],
        'page-title': ['clamp(2.5rem, 1.6rem + 3.2vw, 4.5rem)', { lineHeight: '1.06', letterSpacing: '-0.018em' }],
        h2: ['clamp(2.25rem, 1.75rem + 1.9vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
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
        gutter: 'clamp(1.25rem, 4vw, 3rem)',
        section: 'clamp(4.5rem, 3rem + 6vw, 9rem)',
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
