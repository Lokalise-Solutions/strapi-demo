'use client';

import { Link } from 'next-view-transitions';
import { useState } from 'react';
import { IoIosClose, IoIosMenu } from 'react-icons/io';

import { LocaleSwitcher } from '../locale-switcher';
import { Button } from '@/components/elements/button';
import { Logo } from '@/components/logo';

type Props = {
  leftNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  rightNavbarItems: {
    URL: string;
    text: string;
    target?: string;
  }[];
  logo: any;
  locale: string;
};

export const MobileNavbar = ({
  leftNavbarItems,
  rightNavbarItems,
  logo,
  locale,
}: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between bg-transparent items-center w-full px-4 py-3">
      <Logo locale={locale} image={logo?.image} />

      <IoIosMenu
        className="text-brand-black h-6 w-6"
        onClick={() => setOpen(true)}
      />

      {open === true && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-start justify-start space-y-10 pt-5 text-xl">
          <div className="flex items-center justify-between w-full px-5">
            <Logo locale={locale} image={logo?.image} />
            <div className="flex items-center space-x-2">
              <LocaleSwitcher currentLocale={locale} />
              <IoIosClose
                className="h-8 w-8 text-brand-black"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-[14px] px-8">
            {leftNavbarItems.map((navItem: any, idx: number) => (
              <Link
                key={`link=${idx}`}
                href={`/${locale}${navItem.URL}`}
                onClick={() => setOpen(false)}
                className="relative"
                suppressHydrationWarning
              >
                <span className="block text-[26px] text-brand-black">
                  {navItem.text}
                </span>
              </Link>
            ))}
          </div>
          <div className="flex flex-row w-full items-start gap-2.5 px-8 py-4">
            {rightNavbarItems.map((item, index) => (
              <Button
                key={item.text}
                variant={
                  index === rightNavbarItems.length - 1 ? 'primary' : 'simple'
                }
                as={Link}
                href={`/${locale}${item.URL}`}
              >
                {item.text}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
