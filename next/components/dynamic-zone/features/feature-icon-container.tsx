import React from 'react';

import { cn } from '@/lib/utils';

export const FeatureIconContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'h-14 w-14 rounded-xl bg-peach-100 text-brand-salmon mx-auto relative flex items-center justify-center',
        className
      )}
    >
      {children}
    </div>
  );
};
