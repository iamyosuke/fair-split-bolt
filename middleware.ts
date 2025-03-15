import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'ja'];

export default function middleware(request: NextRequest) {
  const defaultLocale = 'en';
  let locale = request.cookies.get('NEXT_LOCALE')?.value;

  // Validate locale
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  const response = NextResponse.next();
  
  // Set the locale cookie if it doesn't exist
  if (!request.cookies.has('NEXT_LOCALE')) {
    response.cookies.set('NEXT_LOCALE', locale);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};