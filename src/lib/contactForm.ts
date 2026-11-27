import { site } from '../config/site';

export type ContactFormValues = {
  name: string;
  email: string;
  business: string;
  projectType: string;
  details: string;
  /**
   * Honeypot — hidden from people, often filled by bots. Its value is forwarded as `_gotcha`
   * so the backend (e.g. Formspree) can discard spam; the client never fakes success.
   */
  hpField: string;
};

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

export const emptyValues: ContactFormValues = {
  name: '',
  email: '',
  business: '',
  projectType: '',
  details: '',
  hpField: '',
};

const SUBMIT_TIMEOUT_MS = 15000;

/** Some email clients reject very long mailto: URLs, so the pre-filled body is capped. */
const MAILTO_DETAILS_LIMIT = 1500;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validate(v: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name.';
  if (!v.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Please enter a valid email address, for example name@company.com.';
  if (!v.projectType) errors.projectType = 'Please choose the type of project.';
  if (v.details.trim().length < 20) errors.details = 'Please add a few sentences about your project (at least 20 characters).';
  if (v.details.length > 5000) errors.details = 'Please keep project details under 5,000 characters.';
  return errors;
}

/** True only when a real submission endpoint has been configured. */
export const isFormConnected = Boolean(site.contactFormEndpoint);

/**
 * POSTs JSON to the configured endpoint. Resolves only on a 2xx response —
 * the UI never shows a success message unless the server confirms receipt.
 */
export async function submitContactForm(v: ContactFormValues): Promise<void> {
  if (!isFormConnected) throw new Error('Contact form endpoint is not configured.');

  // Fail visibly rather than leaving the button on "Sending…" if the endpoint hangs.
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

  const res = await fetch(site.contactFormEndpoint, {
    method: 'POST',
    signal: controller.signal,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      name: v.name.trim(),
      email: v.email.trim(),
      business: v.business.trim(),
      projectType: v.projectType,
      details: v.details.trim(),
      _subject: `New enquiry via website — ${v.projectType}`,
      _gotcha: v.hpField,
    }),
  }).finally(() => window.clearTimeout(timer));
  if (!res.ok) throw new Error(`Submission failed with status ${res.status}`);
}

/**
 * Builds a mailto: link with the visitor's message pre-filled. Used when no backend is
 * configured, so visitors can still send their enquiry from their own email app.
 */
export function buildMailto(v: ContactFormValues): string {
  const subject = `Project enquiry — ${v.projectType || 'General'}`;
  const lines = [
    `Name: ${v.name.trim()}`,
    `Email: ${v.email.trim()}`,
    v.business.trim() ? `Business: ${v.business.trim()}` : null,
    `Project type: ${v.projectType}`,
    '',
    v.details.trim().length > MAILTO_DETAILS_LIMIT
      ? `${v.details.trim().slice(0, MAILTO_DETAILS_LIMIT)}… (truncated — please paste the rest of your message here)`
      : v.details.trim(),
  ].filter((l): l is string => l !== null);
  return `${site.contact.emailHref}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
}
