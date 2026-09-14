import React from 'react';

import { Heading } from '../../elements/heading';
import { Subheading } from '../../elements/subheading';
import { StrapiMedia } from '@/components/ui/strapi-media';

export const Testimonials = ({
  heading,
  sub_heading,
  testimonials,
}: {
  heading: string;
  sub_heading: string;
  testimonials: any;
}) => {
  const items = Array.isArray(testimonials) ? testimonials : [];

  return (
    <section className="relative bg-cream py-20">
      <Heading className="pt-4">{heading}</Heading>
      <Subheading>{sub_heading}</Subheading>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 px-6 mt-12">
        {items.slice(0, 6).map((item: any, index: number) => (
          <blockquote
            key={item.id ?? index}
            className="rounded-2xl border border-amber-100 bg-white p-6 shadow-sm"
          >
            <p className="text-brand-black text-base leading-relaxed">
              {item.text}
            </p>
            <footer className="flex items-center gap-3 mt-6">
              {item.user?.image?.url && (
                <StrapiMedia
                  src={item.user.image.url}
                  alt={`${item.user.firstname} ${item.user.lastname}`}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover"
                />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-brand-black">
                  {item.user?.firstname} {item.user?.lastname}
                </span>
                <span className="text-sm text-muted">{item.user?.job}</span>
              </div>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};
