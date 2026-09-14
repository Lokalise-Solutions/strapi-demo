import { redirect } from 'next/navigation';

import type { LocaleSlugParamsProps } from '@/types/types';

export default async function SingleProductPage({
  params,
}: LocaleSlugParamsProps) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
