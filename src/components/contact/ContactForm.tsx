import { useId, useRef, useState, type ChangeEvent, type FormEvent, type MouseEvent, type ReactNode } from 'react';
import { projectTypes } from '../../config/content';
import { site } from '../../config/site';
import { cn } from '../../lib/cn';
import {
  buildMailto,
  emptyValues,
  isFormConnected,
  submitContactForm,
  validate,
  type ContactFormErrors,
  type ContactFormValues,
} from '../../lib/contactForm';
import { Button } from '../ui/Button';
import { CheckIcon, InfoIcon } from '../ui/Icons';

type Status = 'idle' | 'submitting' | 'sent' | 'error' | 'mailto';

const fieldOrder: (keyof ContactFormValues)[] = ['name', 'email', 'business', 'projectType', 'details'];

const inputCls =
  'mt-2 block w-full min-h-[3rem] border bg-jp-white px-4 py-3 text-jp-ink ' +
  'transition-colors duration-200 focus:border-jp-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-jp-navy';

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium text-jp-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-jp-navy">
            *
          </span>
        ) : (
          <span className="ml-2 font-normal text-jp-slate">(optional)</span>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-jp-slate">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-jp-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default function ContactForm({ initialProjectType = '' }: { initialProjectType?: string }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const [values, setValues] = useState<ContactFormValues>({ ...emptyValues, projectType: initialProjectType });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    // Clear a field's error as soon as it is corrected.
    if (errors[name as keyof ContactFormValues]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof ContactFormValues];
        return next;
      });
    }
  };

  const describedBy = (name: keyof ContactFormValues, hint = false) =>
    [hint ? `${id(name)}-hint` : null, errors[name] ? `${id(name)}-error` : null].filter(Boolean).join(' ') || undefined;

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    if (!isFormConnected) {
      // Not connected: hand off to the visitor's email client. We do not claim anything was sent.
      window.location.href = buildMailto(values);
      setStatus('mailto');
      requestAnimationFrame(() => statusRef.current?.focus());
      return;
    }

    setStatus('submitting');
    try {
      await submitContactForm(values);
      setStatus('sent');
      setValues({ ...emptyValues });
    } catch {
      setStatus('error');
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  if (status === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-jp-border bg-jp-white p-8 sm:p-10">
        <CheckIcon className="h-8 w-8 text-jp-navy" />
        <h2 className="mt-6 text-h3 text-jp-navy">Thank you — your enquiry has been received.</h2>
        <p className="mt-4 text-jp-slate">
          We will reply to the email address you provided. If your enquiry is urgent, you can also email{' '}
          <a className="link text-jp-navy" href={site.contact.emailHref}>
            {site.contact.email}
          </a>
          .
        </p>
        <Button variant="outline-dark" className="mt-8" onClick={() => setStatus('idle')}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  const errorList = fieldOrder.filter((f) => errors[f]);

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby={isFormConnected ? undefined : `${uid}-form-note`}
      className="relative space-y-7"
    >
      {!isFormConnected && (
        <div id={`${uid}-form-note`} className="flex gap-4 border-l-2 border-jp-gold bg-jp-white p-5 text-sm text-jp-slate">
          <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-jp-navy" />
          <p>
            <strong className="font-medium text-jp-ink">This form is not yet connected to a sending service.</strong>{' '}
            Submitting it will open your own email app with your message addressed to {site.contact.email}, ready for
            you to send. Nothing is sent or stored by this website.
          </p>
        </div>
      )}

      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          aria-labelledby={`${uid}-error-title`}
          className="border-l-2 border-jp-error bg-jp-white p-5"
        >
          <p id={`${uid}-error-title`} className="font-medium text-jp-ink">
            Please fix {errorList.length === 1 ? 'the following' : `these ${errorList.length}`} before continuing:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {errorList.map((f) => (
              <li key={f}>
                <a
                  className="link text-jp-error"
                  href={`#${id(f)}`}
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    document.getElementById(id(f))?.focus();
                  }}
                >
                  {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-sm text-jp-slate">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field id={id('name')} label="Name" required error={errors.name}>
          <input
            id={id('name')}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={onChange}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy('name')}
            className={cn(inputCls, errors.name ? 'border-jp-error' : 'border-jp-slate/80')}
          />
        </Field>
        <Field id={id('email')} label="Email" required error={errors.email}>
          <input
            id={id('email')}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={onChange}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email')}
            className={cn(inputCls, errors.email ? 'border-jp-error' : 'border-jp-slate/80')}
          />
        </Field>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field id={id('business')} label="Business" error={errors.business}>
          <input
            id={id('business')}
            name="business"
            type="text"
            autoComplete="organization"
            value={values.business}
            onChange={onChange}
            aria-describedby={describedBy('business')}
            className={cn(inputCls, 'border-jp-slate/80')}
          />
        </Field>
        <Field id={id('projectType')} label="Project type" required error={errors.projectType}>
          <select
            id={id('projectType')}
            name="projectType"
            required
            value={values.projectType}
            onChange={onChange}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={describedBy('projectType')}
            className={cn(inputCls, 'appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10', errors.projectType ? 'border-jp-error' : 'border-jp-slate/80')}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230B1F3B' stroke-width='1.5'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="">Select a project type</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={id('details')}
        label="Project details"
        required
        hint="What are you trying to achieve, and what is getting in the way?"
        error={errors.details}
      >
        <textarea
          id={id('details')}
          name="details"
          rows={6}
          required
          value={values.details}
          onChange={onChange}
          aria-invalid={Boolean(errors.details)}
          aria-describedby={describedBy('details', true)}
          className={cn(inputCls, 'resize-y', errors.details ? 'border-jp-error' : 'border-jp-slate/80')}
        />
      </Field>

      {/* Honeypot: visually hidden and skipped by keyboard/screen readers. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('hpField')}>Leave this field empty</label>
        <input
          id={id('hpField')}
          name="hpField"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.hpField}
          onChange={onChange}
        />
      </div>

      <p className="text-sm text-jp-slate">
        <span className="font-medium text-jp-ink">Privacy: </span>
        The details you share are used only to respond to your enquiry.
        {!isFormConnected && ' Because this form opens your own email app, your message is sent from your email account, not stored on this website.'}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button type="submit" variant="navy" arrow disabled={status === 'submitting'} aria-describedby={isFormConnected ? undefined : `${uid}-form-note`}>
          {status === 'submitting' ? 'Sending…' : isFormConnected ? 'Send Enquiry' : 'Open in Email App'}
        </Button>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {status === 'mailto' && (
          <p className="border-l-2 border-jp-navy bg-jp-white p-5 text-jp-slate">
            Your email app should now open with your message ready to send. If nothing happened, please email{' '}
            <a className="link text-jp-navy" href={site.contact.emailHref}>
              {site.contact.email}
            </a>{' '}
            directly.
          </p>
        )}
        {status === 'error' && (
          <p role="alert" className="border-l-2 border-jp-error bg-jp-white p-5 text-jp-ink">
            Sorry — your enquiry could not be sent. Please try again, or email{' '}
            <a className="link text-jp-navy" href={site.contact.emailHref}>
              {site.contact.email}
            </a>{' '}
            directly.
          </p>
        )}
      </div>
    </form>
  );
}
