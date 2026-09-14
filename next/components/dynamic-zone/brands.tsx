import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { StrapiMedia } from '@/components/ui/strapi-media';

export const Brands = ({
  heading,
  sub_heading,
  logos,
}: {
  heading: string;
  sub_heading: string;
  logos: any[];
}) => {
  const items = logos ?? [];

  return (
    <section className="relative z-20 py-16 md:py-24 bg-white">
      <Heading className="pt-4">{heading}</Heading>
      <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>

      <div className="flex flex-wrap gap-x-12 gap-y-10 justify-center items-center max-w-5xl mx-auto mt-12 px-6">
        {items.map((logo, idx) => (
          <StrapiMedia
            key={logo.title || `logo-${idx}`}
            src={logo.image?.url}
            alt={logo.image?.alternativeText || logo.title}
            width={400}
            height={400}
            className="h-10 w-32 md:h-12 md:w-40 object-contain"
            draggable={false}
          />
        ))}
      </div>
    </section>
  );
};
