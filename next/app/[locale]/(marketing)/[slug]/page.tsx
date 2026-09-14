import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import ClientSlugHandler from '../ClientSlugHandler';
import { isExcludedMarketingUrl } from '@/lib/marketing';
import PageContent from '@/lib/shared/PageContent';
import { generateMetadataObject } from '@/lib/shared/metadata';
import { fetchCollectionType } from '@/lib/strapi';
import type { LocaleSlugParamsProps } from '@/types/types';

export async function generateMetadata({
  params,
}: LocaleSlugParamsProps): Promise<Metadata> {
  const { slug, locale } = await params;

  if (isExcludedMarketingUrl(`/${slug}`) === true) {
    redirect(`/${locale}`);
  }

  const [pageData] = await fetchCollectionType('pages', {
    filters: {
      slug: {
        $eq: slug,
      },
      locale: locale,
    },
  });

  const seo = pageData.seo;
  const metadata = generateMetadataObject(seo);
  return metadata;
}

export default async function Page({ params }: LocaleSlugParamsProps) {
  const { slug, locale } = await params;

  if (isExcludedMarketingUrl(`/${slug}`) === true) {
    redirect(`/${locale}`);
  }

  const [pageData] = await fetchCollectionType('pages', {
    filters: {
      slug: {
        $eq: slug,
      },
      locale: locale,
    },
  });

  const localizedSlugs = pageData.localizations?.reduce(
    (acc: Record<string, string>, localization: any) => {
      acc[localization.locale] = localization.slug;
      return acc;
    },
    { [locale]: slug }
  );

  return (
    <>
      <ClientSlugHandler localizedSlugs={localizedSlugs} />
      <PageContent pageData={pageData} />
    </>
  );
}
