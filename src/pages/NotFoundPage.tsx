import PageHero from '../components/sections/PageHero';
import { ButtonLink } from '../components/ui/Button';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('__not_found__', { noindex: true });

  return (
    <PageHero
      eyebrow="404"
      title="This page could not be found."
      intro="The link may be out of date, or the page may have moved."
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <ButtonLink to="/" variant="primary" arrow>
          Go to the home page
        </ButtonLink>
        <ButtonLink to="/contact" variant="outline">
          Contact us
        </ButtonLink>
      </div>
    </PageHero>
  );
}
