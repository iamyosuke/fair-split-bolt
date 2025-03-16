import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

const locales = ['en', 'ja'];

export default getRequestConfig(async () => {
  let locale;
  try {
    const cookieStore = cookies();
    locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  } catch (error) {
    console.error(error);
    locale = 'en';
  }
  return {
    messages: (await import(`../../messages/${locale}.json`)).default,
    locale: locale,
    timeZone: 'Asia/Tokyo'
  };
});