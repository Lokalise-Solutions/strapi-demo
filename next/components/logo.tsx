import { Link } from 'next-view-transitions';
import React from 'react';

import { BlurImage } from './blur-image';
import { resolveStrapiMedia } from '@/lib/strapi/strapiImage';
import { Image } from '@/types/types';

export const Logo = ({ image, locale }: { image?: Image; locale?: string }) => {
  return (
    <Link
      href={`/${locale || 'en'}`}
      className="font-normal flex space-x-2 items-center text-sm mr-4 text-brand-black relative z-20"
    >
      {image === undefined || image === null ? (
        <span className="text-brand-black font-bold text-lg tracking-tight">
          Lokalise
        </span>
      ) : (
        <BlurImage
          {...resolveStrapiMedia(image?.url)}
          alt={image.alternativeText || 'Lokalise'}
          width={200}
          height={200}
          className="h-8 w-auto object-contain"
        />
      )}
    </Link>
  );
};
