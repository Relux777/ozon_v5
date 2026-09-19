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

import { Geist, Noto_Sans_Armenian, Noto_Sans_Georgian } from "next/font/google";
import "@/assets/scss/ReluxCode.scss";
import "@/assets/scss/style.scss";

// Основной шрифт: латиница + кириллица (ru, ky, kk) — их подгружаем с preload
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Расширенные наборы для uz/az (ʻ, ə, İ) и kk/ky (Қ, Ғ, Ө, Ү, Ң): тянутся по unicode-range только при надобности
const geistExt = Geist({
  variable: "--font-geist-ext",
  subsets: ["latin-ext", "cyrillic-ext"],
  display: "swap",
  preload: false,
});

// Geist не содержит грузинский и армянский: без этих шрифтов ka/hy рендерятся системным
const notoGeorgian = Noto_Sans_Georgian({
  variable: "--font-ka",
  subsets: ["georgian"],
  display: "swap",
  preload: false,
});

const notoArmenian = Noto_Sans_Armenian({
  variable: "--font-hy",
  subsets: ["armenian"],
  display: "swap",
  preload: false,
});

const fontVariables = [geist, geistExt, notoGeorgian, notoArmenian]
  .map((font) => font.variable)
  .join(' ');

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
        icons: {
            icon: '/favicon.ico',
        },
    };
}

export default async function RootLayout({ children, params }: Props) {
    const locale = await getLocaleFromParams(params);
    const messages = await getMessages();

    // В клиентский бандл уходят только ключи, которые реально читают клиентские компоненты
    const clientMessages = {
        NavBar: messages.NavBar,
        A11y: messages.A11y,
        SkladSearch: messages.SkladSearch,
        Promo: messages.Promo,
        ErrorPage: messages.ErrorPage,
    };

    return (
        <html lang={locale} className={fontVariables} suppressHydrationWarning>
            <body>
                <NextIntlClientProvider locale={locale} messages={clientMessages}>
                    <ThemeProvider
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
