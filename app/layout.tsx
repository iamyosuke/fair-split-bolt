import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/toaster";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { useLocale } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "FairSplit - Split Expenses Fairly",
    description: "Split expenses with friends and groups easily",
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();
    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <html lang={locale} className="light" style={{ colorScheme: "light" }}>
                <body className={inter.className}>
                    <Header />
                    <main>{children}</main>
                    <Toaster />
                </body>
            </html>
        </NextIntlClientProvider>
    );
}
