"use client";

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { NextIntlClientProvider } from 'next-intl';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [messages, setMessages] = useState<any>(null);
  const locale = Cookies.get('NEXT_LOCALE') || 'en';

  useEffect(() => {
    // Load messages for the current locale
    import(`../messages/${locale}.json`)
      .then((messages) => {
        setMessages(messages.default);
      })
      .catch((error) => {
        console.error('Error loading messages:', error);
        // Fallback to English if there's an error
        import('../messages/en.json').then((messages) => {
          setMessages(messages.default);
        });
      });
  }, [locale]);

  if (!messages) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextIntlClientProvider locale={locale} messages={messages}>
        <Header />
        <main>
          {children}
        </main>
        <Toaster />
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}