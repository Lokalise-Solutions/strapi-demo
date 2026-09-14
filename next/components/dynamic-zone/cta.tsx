'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

import { Container } from '../container';
import { Button } from '../elements/button';
import { isExcludedMarketingUrl } from '@/lib/marketing';

export const CTA = ({
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
    <div className="relative py-20 md:py-28 bg-brand-black">
      <Container className="flex flex-col md:flex-row justify-between items-center w-full px-8 gap-8">
        <div className="flex flex-col">
          <motion.h2 className="text-white text-2xl text-center md:text-left md:text-4xl font-display font-semibold mx-auto md:mx-0 max-w-xl">
            {heading}
          </motion.h2>
          <p className="max-w-md mt-6 text-center md:text-left text-sm md:text-base mx-auto md:mx-0 text-neutral-400">
            {sub_heading}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {actions.map((cta, index) => (
            <Button
              as={Link}
              key={cta?.id ?? index}
              href={`/${locale}${cta.URL}`}
              variant={cta.variant ?? 'primary'}
              className="py-3"
            >
              {cta.text}
            </Button>
          ))}
        </div>
      </Container>
    </div>
  );
};
