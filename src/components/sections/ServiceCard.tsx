import { Link } from 'react-router-dom';
import type { Service } from '../../config/content';
import { ArrowRightIcon } from '../ui/Icons';

/** Editorial service tile. The whole tile is clickable via a stretched link (one tab stop). */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="group relative flex h-full flex-col bg-jp-white p-8 transition-colors duration-300 hover:bg-jp-ivory sm:p-10">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-jp-gold transition-transform duration-500 ease-out-soft group-hover:scale-x-100"
      />
      <p className="font-sans text-sm font-medium tracking-[0.18em] text-jp-slate">{service.number}</p>
      <h3 className="mt-8 text-h3 text-jp-navy">{service.title}</h3>
      <p className="mt-4 flex-1 text-jp-slate">{service.summary}</p>
      <Link
        to={`/services#${service.id}`}
        className="mt-8 inline-flex min-h-[2.75rem] items-center gap-2 text-[0.9375rem] font-medium text-jp-navy after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-jp-navy"
      >
        Learn more<span className="sr-only"> about {service.title}</span>
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
