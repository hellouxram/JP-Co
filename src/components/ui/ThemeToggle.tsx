import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'jp-theme';

function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

/** Applies a theme, briefly enabling a colour cross-fade (skipped for reduced motion). */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const animate = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (animate) root.classList.add('theme-switching');
  root.setAttribute('data-theme', theme);
  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((m) => m.setAttribute('content', theme === 'dark' ? '#0B1F3B' : '#FFFFFF'));
  if (animate) window.setTimeout(() => root.classList.remove('theme-switching'), 400);
}

/**
 * Light/dark switch for the header. The initial theme (saved choice or system preference) is
 * applied by an inline script in index.html before first paint; an explicit choice is saved
 * in localStorage only after the visitor uses this button.
 *
 * Accessible as a toggle button: fixed label "Dark theme" + aria-pressed.
 * The sun/moon icons swap via CSS (.show-light / .show-dark), so the right one shows without JS.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(currentTheme());
    // Follow the OS setting live unless the visitor has made an explicit choice.
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      const next: Theme = e.matches ? 'dark' : 'light';
      applyTheme(next);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage unavailable (private mode) — theme still applies for this page view */
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      data-theme-toggle=""
      aria-label="Dark theme"
      aria-pressed={theme === 'dark'}
      title="Switch between light and dark theme"
      onClick={toggle}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors duration-200 hover:border-accent hover:text-accent-ink"
    >
      {/* Light theme shows the moon (switch to dark); dark theme shows the sun. */}
      <span className="show-light">
        <MoonIcon className="h-5 w-5" />
      </span>
      <span className="show-dark">
        <SunIcon className="h-5 w-5" />
      </span>
    </button>
  );
}
