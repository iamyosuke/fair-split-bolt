"use server"
import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const locales = ['en', 'ja'];

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    locale: locale,
    timeZone: 'Asia/Tokyo'
  };
});