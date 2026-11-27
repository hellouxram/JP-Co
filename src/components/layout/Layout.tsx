import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

/**
 * App shell: skip link, sticky header, main landmark, footer.
 * On client-side navigation it scrolls to the top (or to #hash targets) and moves
 * focus to <main> so screen-reader and keyboard users land on the new content.
 */
export default function Layout() {
  const { pathname, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const prevKey = useRef<string | null>(null);

  useEffect(() => {
    const key = pathname + hash;
    if (prevKey.current === key) return; // StrictMode re-run or no real change
    const isFirst = prevKey.current === null;
    prevKey.current = key;

    if (hash) {
      // Wait a frame so the new route has rendered its anchors.
      const id = decodeURIComponent(hash.slice(1));
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView();
          if (!isFirst) {
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
          }
        }
      });
      return;
    }

    if (isFirst) return;
    // Jump (not smooth-scroll) to the top: html has scroll-behavior: smooth, which would
    // otherwise animate the new page up from the previous scroll position.
    const root = document.documentElement;
    const prevBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';
    root.getClientRects(); // flush style before scrolling
    window.scrollTo(0, 0);
    root.style.scrollBehavior = prevBehavior;
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[60] bg-jp-gold px-5 py-3 font-medium text-jp-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
