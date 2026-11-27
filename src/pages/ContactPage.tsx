import type { ComponentType, SVGProps } from 'react';
import { useSearchParams } from 'react-router-dom';
import ContactForm from '../components/contact/ContactForm';
import PageHero from '../components/sections/PageHero';
import { GlobeIcon, MailIcon, PhoneIcon } from '../components/ui/Icons';
import Reveal from '../components/ui/Reveal';
import { Eyebrow } from '../components/ui/SectionHeading';
import { services } from '../config/content';
import { site } from '../config/site';
import { usePageMeta } from '../hooks/usePageMeta';

type ContactItem = {
  label: string;
  value: string;
  href: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  external?: boolean;
};

const contactItems: ContactItem[] = [
  { label: 'Email', value: site.contact.email, href: site.contact.emailHref, Icon: MailIcon },
  { label: 'Phone', value: site.contact.phoneDisplay, href: site.contact.phoneHref, Icon: PhoneIcon },
  { label: 'Website', value: site.contact.websiteLabel, href: site.contact.websiteHref, Icon: GlobeIcon, external: true },
];

export default function ContactPage() {
  usePageMeta('/contact');
  const [params] = useSearchParams();
  const preselected = services.find((s) => s.id === params.get('service'))?.title ?? '';

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about your project."
        intro="Share a little about what you are working on. We will reply to arrange a scoping call if it looks like a good fit."
      />

      <section aria-label="Contact details and enquiry form" className="bg-jp-ivory py-section">
        <div className="container-site grid gap-16 lg:grid-cols-12 lg:gap-20">
          {/* Direct contact details */}
          <Reveal className="lg:col-span-4">
            <Eyebrow className="mb-6">Direct</Eyebrow>
            <h2 className="text-h3 text-jp-navy">Prefer to get in touch directly?</h2>
            <p className="mt-4 text-jp-slate">
              Contact {site.founder.name}, {site.founder.title}. JP &amp; Co. is based in {site.location.label}.
            </p>

            <dl className="mt-10 border-t border-jp-border">
              {contactItems.map(({ label, value, href, Icon, external }) => (
                <div key={label} className="border-b border-jp-border py-5">
                  <dt className="eyebrow text-jp-slate">{label}</dt>
                  <dd className="mt-2">
                    <a
                      href={href}
                      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="group inline-flex min-h-[2.75rem] items-center gap-3 text-lg text-jp-navy"
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="underline decoration-jp-navy/30 decoration-1 underline-offset-[0.25em] transition-colors group-hover:decoration-jp-navy">
                        {value}
                      </span>
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* Enquiry form */}
          <Reveal className="lg:col-span-8" delay={120}>
            <div className="border border-jp-border bg-jp-ivory p-6 sm:p-10 lg:p-12">
              <Eyebrow className="mb-6">Enquiry</Eyebrow>
              <h2 className="mb-8 text-h3 text-jp-navy">Tell us about your project</h2>
              <ContactForm key={preselected} initialProjectType={preselected} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
