import { Link } from 'react-router-dom';
import type { Service } from '../../config/content';
import { ArrowRightIcon } from '../ui/Icons';

/** Editorial service tile. The whole tile is clickable via a stretched link (one tab stop). */
export default function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden p-8 sm:p-10">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-deco transition-transform duration-500 ease-out-soft group-hover:scale-x-100"
      />
      <p className="font-sans text-sm font-medium tracking-[0.18em] text-muted">{service.number}</p>
      <h3 className="mt-8 text-h3 text-fg">{service.title}</h3>
      <p className="mt-4 flex-1 text-muted">{service.summary}</p>
      <Link
        to={`/services#${service.id}`}
        className="mt-8 inline-flex min-h-[2.75rem] items-center gap-2 text-[0.9375rem] font-medium text-fg after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-focus"
      >
        Learn more<span className="sr-only"> about {service.title}</span>
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
      </Link>
    </article>
  );
}
