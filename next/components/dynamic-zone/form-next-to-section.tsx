'use client';

import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from '@tabler/icons-react';
import Link from 'next/link';

import { Button } from '../elements/button';
import { AnimatedTooltip } from '@/components/ui/animated-tooltip';

export function FormNextToSection({
  heading,
  sub_heading,
  form,
  section,
}: {
  heading: string;
  sub_heading: string;
  form: any;
  section: any;
  social_media_icon_links: any;
}) {
  const socials = [
    {
      title: 'twitter',
      href: 'https://twitter.com/lokalise',
      icon: (
        <IconBrandX className="h-5 w-5 text-muted hover:text-brand-black" />
      ),
    },
    {
      title: 'github',
      href: 'https://github.com/lokalise',
      icon: (
        <IconBrandGithub className="h-5 w-5 text-muted hover:text-brand-black" />
      ),
    },
    {
      title: 'linkedin',
      href: 'https://linkedin.com/company/lokalise',
      icon: (
        <IconBrandLinkedin className="h-5 w-5 text-muted hover:text-brand-black" />
      ),
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 relative overflow-hidden bg-white">
      <div className="flex relative z-20 items-center w-full justify-center px-4 py-16 lg:py-28 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div>
            <h1 className="mt-8 text-2xl font-display font-semibold leading-9 tracking-tight text-brand-black">
              {heading}
            </h1>
            <p className="mt-4 text-muted text-sm max-w-sm">{sub_heading}</p>
          </div>

          <div className="py-10">
            <form className="space-y-4">
              {form &&
                form?.inputs?.map((input: any, index: number) => (
                  <div key={`form-input-${index}`}>
                    {input.type !== 'submit' && (
                      <label
                        htmlFor={`form-input-${index}`}
                        className="block text-sm font-medium leading-6 text-brand-black"
                      >
                        {input.name}
                      </label>
                    )}

                    <div className="mt-2">
                      {input.type === 'textarea' ? (
                        <textarea
                          rows={5}
                          id={`form-input-${index}`}
                          placeholder={input.placeholder}
                          className="block w-full bg-neutral-50 px-4 rounded-lg border border-neutral-200 py-1.5 text-brand-black placeholder:text-muted focus:ring-2 focus:ring-brand-salmon focus:outline-none sm:text-sm sm:leading-6"
                        />
                      ) : input.type === 'submit' ? (
                        <div>
                          <Button className="w-full mt-6">{input.name}</Button>
                        </div>
                      ) : (
                        <input
                          id={`form-input-${index}`}
                          type={input.type}
                          placeholder={input.placeholder}
                          className="block w-full bg-neutral-50 px-4 rounded-lg border border-neutral-200 py-1.5 text-brand-black placeholder:text-muted focus:ring-2 focus:ring-brand-salmon focus:outline-none sm:text-sm sm:leading-6"
                        />
                      )}
                    </div>
                  </div>
                ))}
            </form>
          </div>
          <div className="flex items-center justify-center space-x-4 py-4">
            {socials.map((social) => (
              <Link href={social.href} target="_blank" key={social.title}>
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="relative w-full z-20 hidden md:flex border-l border-neutral-200 overflow-hidden bg-cream items-center justify-center">
        <div className="max-w-sm mx-auto px-8">
          <div className="flex flex-row items-center justify-center mb-10 w-full">
            <AnimatedTooltip items={section.users} />
          </div>
          <p className="font-semibold text-xl text-center text-brand-black text-balance">
            {section.heading}
          </p>
          <p className="font-normal text-base text-center text-muted mt-8 text-balance">
            {section.sub_heading}
          </p>
        </div>
      </div>
    </div>
  );
}
