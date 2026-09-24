import { ThemeProvider } from "@/providers/ThemeProvider";
import type { Metadata, Viewport } from 'next';
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

// Основной шрифт: латиница + кириллица (ru, ky, kk) — их подгружаем с preload.
// `subsets` влияет только на preload: @font-face для latin-ext/cyrillic-ext (uz/az: ʻ, ə, İ; kk/ky: Қ, Ғ, Ө…)
// next/font всё равно добавляет, и браузер тянет их по unicode-range только при надобности.
// Второй экземпляр Geist (был geistExt) давал второй набор @font-face с тем же именем «Geist»:
// latin и cyrillic скачивались дважды, а preload уходил впустую.
const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

// Geist не содержит грузинский и армянский: без этих шрифтов ka/hy рендерятся системным.
// В стек шрифтов они попадают только на своих языках — см. body:lang(ka|hy) в style.scss
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

const fontVariables = [geist, notoGeorgian, notoArmenian]
  .map((font) => font.variable)
  .join(' ');

// Цвет панели браузера на телефоне — как фон страницы (--bg-phone в _variables.scss)
export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#ededed' },
        { media: '(prefers-color-scheme: dark)', color: '#000000' },
    ],
};

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
        // крупные превью картинок и сниппет без ограничения длины (Google, Яндекс)
        robots: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
        // иконки — файлами в src/app (favicon.ico, icon.svg, apple-icon.png): Next сам добавит <link>;
        // явный icons здесь дублировал <link rel="icon" href="/favicon.ico">
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
