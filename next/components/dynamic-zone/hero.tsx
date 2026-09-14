'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Button } from '../elements/button';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { isExcludedMarketingUrl } from '@/lib/marketing';

export const Hero = ({
  heading,
  sub_heading,
  CTAs,
  locale,
}: {
  heading: string;
  sub_heading: string;
  CTAs: any[];
  locale: string;
}) => {
  const actions = (CTAs ?? []).filter(
    (cta) => isExcludedMarketingUrl(cta?.URL) === false
  );

  return (
    <div className="relative flex flex-col items-center justify-center px-4 pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-b from-peach-100 via-white to-white">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center"
      >
        <Heading
          as="h1"
          size="2xl"
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          {heading}
        </Heading>
        <Subheading className="text-center mt-6 text-base md:text-xl text-muted max-w-3xl mx-auto relative z-10">
          {sub_heading}
        </Subheading>
        <div className="flex flex-wrap gap-3 items-center justify-center mt-10">
          {actions.map((cta, index) => (
            <Button
              key={cta?.id ?? cta?.text}
              as={Link}
              href={`/${locale}${cta.URL}`}
              variant={cta.variant ?? (index === 0 ? 'primary' : 'outline')}
            >
              {cta.text}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
