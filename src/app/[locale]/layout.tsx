import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata } from 'next';
import { getLocaleFromParams } from '@/i18n/params';

import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { SITE_CONFIG } from '@/config/site';

import HeaderComponent from "@/components/Header";
import NavBarComponent from "@/components/NavBar";
import BackgroundDecor from "@/components/BackgroundDecor";

import { Geist } from "next/font/google";
import "@/assets/scss/ReluxCode.scss";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    return {
        metadataBase: new URL(SITE_CONFIG.url),
        title: {
            template: `%s — ${t('siteName')}`,
            default: t('siteName'),
        },
        applicationName: t('siteName'),
        formatDetection: { telephone: false },
        robots: { index: true, follow: true },
        openGraph: {
            siteName: t('siteName'),
            type: 'website',
            locale,
        },
        icons: {
            icon: '/favicon.ico',
            apple: '/apple-touch-icon.png',
        },
    };
}

export default async function RootLayout({ children, params }: Props) {
    const locale = await getLocaleFromParams(params);
    const messages = await getMessages();

    return (
        <html lang={locale} className={`${geistSans.variable}`} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    <ThemeProvider
                      attribute="data-theme"
                      defaultTheme="system"
                      enableSystem
                      storageKey="theme"
                    >
                      <HeaderComponent />
                        {children}
                      <div id="modal-root"></div>
                      <NavBarComponent />
                      <BackgroundDecor />
                  </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}