'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { IconChevronDown } from '@tabler/icons-react';

import { Container } from '@/components/container';
import { Heading } from '@/components/elements/heading';
import { Subheading } from '@/components/elements/subheading';
import { cn } from '@/lib/utils';

export const FAQ = ({
  heading,
  sub_heading,
  faqs,
}: {
  heading: string;
  sub_heading: string;
  faqs: any[];
}) => {
  const items = faqs ?? [];

  return (
    <Container className="flex flex-col items-center justify-between pb-20">
      <div className="relative z-20 py-10 md:pt-24">
        <Heading as="h2" className="mt-4">
          {heading}
        </Heading>
        {sub_heading && (
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        )}
      </div>
      <div className="w-full max-w-3xl divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((faq: { question: string; answer: string }) => (
          <Disclosure key={faq.question} as="div" className="py-2">
            {({ open }) => (
              <>
                <DisclosureButton className="flex w-full items-center justify-between py-4 text-left">
                  <span className="text-lg font-semibold text-brand-black pr-6">
                    {faq.question}
                  </span>
                  <IconChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-muted transition-transform',
                      open === true && 'rotate-180'
                    )}
                  />
                </DisclosureButton>
                <DisclosurePanel className="pb-5 text-muted leading-relaxed">
                  {faq.answer}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </Container>
  );
};
