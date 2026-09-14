import React from 'react';

import { cn } from '@/lib/utils';

const toneClasses = {
  peach: 'bg-peach-100 border-peach-200',
  lavender: 'bg-lavender border-violet-100',
  cream: 'bg-cream border-amber-100',
  blue: 'bg-light-blue border-slate-200',
} as const;

export const Card = ({
  className,
  children,
  tone = 'peach',
}: {
  className?: string;
  children: React.ReactNode;
  tone?: keyof typeof toneClasses;
}) => {
  return (
    <div
      className={cn(
        'p-8 rounded-2xl border shadow-sm',
        toneClasses[tone],
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        'text-lg font-semibold text-brand-black py-2 font-display',
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn('text-sm font-normal text-muted max-w-sm', className)}>
      {children}
    </p>
  );
};
