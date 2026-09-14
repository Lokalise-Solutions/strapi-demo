'use client';

import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type Props = {
  href: never;
  children: ReactNode;
  active?: boolean;
  className?: string;
  target?: string;
};

export function NavbarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const pathname = usePathname();
  const isActive =
    active === true ||
    (typeof href === 'string' && pathname === href) ||
    (typeof href === 'string' &&
      href !== `/${pathname?.split('/')[1]}` &&
      pathname?.startsWith(href) === true);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center text-sm leading-[110%] px-4 py-2 rounded-lg text-brand-black hover:bg-neutral-100 transition duration-200',
        isActive === true && 'bg-neutral-100 text-brand-black',
        className
      )}
      target={target}
      suppressHydrationWarning
    >
      {children}
    </Link>
  );
}
