import { redirect } from 'next/navigation';

import type { LocaleParamsProps } from '@/types/types';

export default async function Products({ params }: LocaleParamsProps) {
  const { locale } = await params;
  redirect(`/${locale}`);
}
