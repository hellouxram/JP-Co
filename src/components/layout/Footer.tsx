import { Link } from 'react-router-dom';
import { services } from '../../config/content';
import { navigation, site } from '../../config/site';
import { LogoLockup } from '../brand/Logo';
import { GlobeIcon, MailIcon, PhoneIcon } from '../ui/Icons';

const linkCls =
  'inline-flex min-h-[2.75rem] items-center text-jp-ivory/75 transition-colors duration-200 hover:text-jp-ivory sm:min-h-[2.25rem]';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-dark relative overflow-hidden">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-jp-gold/60 to-transparent" />
      <div className="container-site py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <Link to="/" aria-label={`${site.name} — home`} className="-m-2 inline-block p-2">
              <LogoLockup decorative className="h-14 sm:h-16" />
            </Link>
            <p className="mt-8 font-serif text-xl italic text-jp-ivory/90">{site.tagline}</p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-2">
            <h2 className="eyebrow mb-4 font-sans text-jp-gold">Explore</h2>
            <ul>
              {navigation.map((item) => (
                <li key={item.to}>
                  <Link className={linkCls} to={item.to}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-2">
            <h2 className="eyebrow mb-4 font-sans text-jp-gold">Services</h2>
            <ul>
              {services.map((s) => (
                <li key={s.id}>
                  <Link className={linkCls} to={`/services#${s.id}`}>
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow mb-4 font-sans text-jp-gold">Contact</h2>
            <ul>
              <li>
                <a className={`${linkCls} gap-3`} href={site.contact.emailHref}>
                  <MailIcon className="h-4 w-4 shrink-0 text-jp-gold" />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a className={`${linkCls} gap-3`} href={site.contact.phoneHref}>
                  <PhoneIcon className="h-4 w-4 shrink-0 text-jp-gold" />
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a className={`${linkCls} gap-3`} href={site.contact.websiteHref} target="_blank" rel="noopener noreferrer">
                  <GlobeIcon className="h-4 w-4 shrink-0 text-jp-gold" />
                  {site.contact.websiteLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-jp-ivory/10 pt-8 text-sm text-jp-ivory/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name} All rights reserved.
          </p>
          <p>
            {site.name} · {site.descriptor}
          </p>
        </div>
      </div>
    </footer>
  );
}
