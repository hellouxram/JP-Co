import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ArrowRightIcon } from './Icons';

export type ButtonVariant =
  /** Gold fill, navy text — primary action on navy surfaces (8.4:1). */
  | 'gold'
  /** Navy fill, ivory text — primary action on light surfaces (15.1:1). */
  | 'navy'
  /** Hairline outline for secondary actions on navy surfaces. */
  | 'outline-light'
  /** Hairline outline for secondary actions on light surfaces. */
  | 'outline-dark';

export type ButtonSize = 'md' | 'sm';

const sizes: Record<ButtonSize, string> = {
  md: 'min-h-[3rem] px-7 py-3',
  sm: 'min-h-[2.75rem] px-5 py-2',
};

const base =
  'group inline-flex items-center justify-center gap-3 text-[0.9375rem] font-medium tracking-[0.01em] ' +
  'transition-[background-color,color,border-color,transform] duration-300 ease-out-soft ' +
  'disabled:cursor-not-allowed disabled:opacity-60';

const variants: Record<ButtonVariant, string> = {
  gold: 'bg-jp-gold text-jp-navy hover:bg-jp-ivory',
  navy: 'bg-jp-navy text-jp-ivory hover:bg-jp-ink',
  'outline-light': 'border border-jp-ivory/40 text-jp-ivory hover:border-jp-gold hover:text-jp-gold',
  'outline-dark': 'border border-jp-navy/60 text-jp-navy hover:border-jp-navy hover:bg-jp-navy hover:text-jp-ivory',
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
export function ButtonLink({ variant = 'gold', size = 'md', arrow, className, children, ...rest }: CommonProps & Omit<LinkProps, 'className' | 'children'>) {
  return (
    <Link className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </Link>
  );
}

/** External / protocol link (mailto:, tel:) styled as a button. */
export function ButtonAnchor({
  variant = 'gold',
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
  variant = 'navy',
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
