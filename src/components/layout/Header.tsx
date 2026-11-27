import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { navigation, site } from '../../config/site';
import { cn } from '../../lib/cn';
import { LogoLockup } from '../brand/Logo';
import { ButtonLink } from '../ui/Button';
import { CloseIcon, MenuIcon } from '../ui/Icons';

const MENU_ID = 'mobile-navigation';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = true) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Hairline under the header once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Mobile menu: scroll lock, Escape to close, focus containment, auto-close at desktop width.
  useEffect(() => {
    if (!open) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    // Make the page behind the menu unreachable for screen-reader browse modes too.
    const background = [document.getElementById('main'), document.querySelector('footer')].filter(
      (el): el is HTMLElement => el !== null,
    );
    background.forEach((el) => el.setAttribute('inert', ''));

    const firstLink = panelRef.current?.querySelector<HTMLElement>('a, button');
    firstLink?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current || !toggleRef.current) return;
      const focusables = [
        toggleRef.current,
        ...Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')),
      ];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = (ev: MediaQueryListEvent) => ev.matches && close(false);

    document.addEventListener('keydown', onKey);
    mq.addEventListener('change', onMq);
    return () => {
      body.style.overflow = prevOverflow;
      background.forEach((el) => el.removeAttribute('inert'));
      document.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onMq);
    };
  }, [open, close]);

  return (
    <header
      className={cn(
        'surface-dark sticky top-0 z-50 border-b transition-colors duration-300',
        scrolled || open ? 'border-jp-ivory/10' : 'border-transparent',
      )}
    >
      <div className="container-site flex h-[var(--header-height)] items-center justify-between gap-6">
        <Link to="/" aria-label={`${site.name} — home`} className="-m-2 shrink-0 p-2">
          <LogoLockup priority decorative className="h-9 lg:h-11" />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {navigation.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative inline-flex min-h-[2.75rem] items-center px-3 text-[0.9375rem] transition-colors duration-200 xl:px-4',
                      'after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-left after:bg-jp-gold after:transition-transform after:duration-300 xl:after:inset-x-4',
                      isActive
                        ? 'text-jp-ivory after:scale-x-100'
                        : 'text-jp-ivory/75 after:scale-x-0 hover:text-jp-ivory hover:after:scale-x-100',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <ButtonLink to="/contact" variant="gold" size="sm" className="hidden lg:inline-flex">
            Discuss a Project
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-jp-ivory lg:hidden"
            aria-expanded={open}
            aria-controls={MENU_ID}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => (open ? close() : setOpen(true))}
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation panel */}
      <div
        id={MENU_ID}
        ref={panelRef}
        hidden={!open}
        // Close on any link activation — including links to the current page, which don't change
        // location.pathname. Focus returns to the toggle; Layout then moves it to <main> on a route change.
        onClick={(e: MouseEvent<HTMLDivElement>) => {
          if ((e.target as Element).closest('a')) close();
        }}
        className="surface-dark fixed inset-x-0 bottom-0 top-[var(--header-height)] overflow-y-auto border-t border-jp-ivory/10 lg:hidden"
      >
        <nav aria-label="Mobile" className="container-site flex min-h-full flex-col justify-between gap-12 py-10">
          <ul className="flex flex-col">
            {navigation.map((item, i) => (
              <li key={item.to} className="border-b border-jp-ivory/10">
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  style={{ animationDelay: `${i * 50}ms` }}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-[3.5rem] items-center justify-between py-4 font-serif text-3xl motion-safe:animate-fade-up',
                      isActive ? 'text-jp-gold' : 'text-jp-ivory',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="space-y-6">
            <ButtonLink to="/contact" variant="gold" arrow className="w-full">
              Discuss a Project
            </ButtonLink>
            <div className="space-y-2 text-jp-ivory/80">
              <p>
                <a className="link inline-flex min-h-[2.75rem] items-center" href={site.contact.emailHref}>
                  {site.contact.email}
                </a>
              </p>
              <p>
                <a className="link inline-flex min-h-[2.75rem] items-center" href={site.contact.phoneHref}>
                  {site.contact.phoneDisplay}
                </a>
              </p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
