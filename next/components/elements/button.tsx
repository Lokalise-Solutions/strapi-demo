import { LinkProps } from 'next/link';
import React from 'react';

import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'simple' | 'outline' | 'primary' | 'muted';
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
  href?: LinkProps['href'];
  onClick?: () => void;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  as: Tag = 'button',
  className,
  children,
  ...props
}) => {
  const variantClass =
    variant === 'simple'
      ? 'bg-transparent border-transparent text-brand-black hover:bg-neutral-100'
      : variant === 'outline'
        ? 'bg-white text-brand-black border-brand-black hover:bg-neutral-100'
        : variant === 'primary'
          ? 'bg-brand-salmon border-brand-salmon text-white hover:bg-peach-700'
          : variant === 'muted'
            ? 'bg-neutral-100 border-transparent text-brand-black hover:bg-neutral-200'
            : '';
  const Element = Tag as any;

  return (
    <Element
      className={cn(
        'relative z-10 border text-sm font-medium transition duration-200 rounded-lg px-4 py-2 flex items-center justify-center',
        variantClass,
        className
      )}
      {...props}
      suppressHydrationWarning
    >
      {children ?? `Get Started`}
    </Element>
  );
};
