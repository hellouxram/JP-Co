import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ArrowRightIcon } from './Icons';

export type ButtonVariant =
  /** Themed primary: navy fill + white text (light), champagne fill + deep-navy text (dark). */
  | 'primary'
  /** Themed hairline outline for secondary actions. */
  | 'outline';

export type ButtonSize = 'md' | 'sm';

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-[3rem] px-7 py-3',
  sm: 'min-h-[2.75rem] px-5 py-2',
};

const base =
  'group inline-flex items-center justify-center gap-3 rounded-full text-[0.9375rem] font-medium tracking-[0.01em] ' +
  'transition-[background-color,color,border-color,transform] duration-300 ease-out-soft ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-btn text-btn-fg shadow-sm hover:bg-btn-hover',
  outline: 'border border-fg/30 text-fg hover:border-accent hover:text-accent-ink',
};

type CommonProps = {
  variant?: ButtonVariant;
  /** Use 'sm' for compact placements (e.g. header). Both sizes keep a ≥ 44px touch target. */
  size?: ButtonSize;
  /** Adds a trailing arrow that nudges on hover. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

function Inner({ arrow, children }: { arrow?: boolean; children: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 ease-out-soft motion-safe:group-hover:translate-x-1" />
      )}
    </>
  );
}

/** Internal navigation styled as a button. */
export function ButtonLink({ variant = 'primary', size = 'md', arrow, className, children, ...rest }: CommonProps & Omit<LinkProps, 'className' | 'children'>) {
  return (
    <Link className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

/** External / protocol link (mailto:, tel:) styled as a button. */
export function ButtonAnchor({
  variant = 'primary',
  size = 'md',
  arrow,
  className,
  children,
  ...rest
}: CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'>) {
  return (
    <a className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  arrow,
  className,
  children,
  type = 'button',
  ...rest
}: CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'>) {
  return (
    <button type={type} className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}
