'use client';

import React from 'react';

import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StickyScroll } from '@/components/ui/sticky-scroll';

export const Launches = ({
  heading,
  sub_heading,
  launches,
}: {
  heading: string;
  sub_heading: string;
  launches: any[];
}) => {
  const launchesWithDecoration = (launches ?? []).map((entry, index) => ({
    ...entry,
    content: (
      <p className="text-4xl md:text-6xl font-display font-semibold text-brand-salmon">
        {entry.mission_number ?? String(index + 1).padStart(2, '0')}
      </p>
    ),
  }));

  return (
    <div className="w-full relative h-full pt-16 md:pt-24 bg-white">
      <div className="px-6">
        <Heading className="mt-4">{heading}</Heading>
        <Subheading>{sub_heading}</Subheading>
      </div>
      <StickyScroll content={launchesWithDecoration} />
    </div>
  );
};
