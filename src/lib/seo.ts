import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { absoluteUrl, OG_IMAGE } from '@/config/site';

type Href = Parameters<typeof getPathname>[0]['href'];

// Open Graph требует формат language_TERRITORY, а не просто код языка
const OG_LOCALES: Record<AppLocale, string> = {
    ru: 'ru_RU',
    uz: 'uz_UZ',
    tg: 'tg_TJ',
    hy: 'hy_AM',
    az: 'az_AZ',
    ka: 'ka_GE',
    ky: 'ky_KG',
    kk: 'kk_KZ',
    en: 'en_US',
};

/** locales — языки, на которых страница уже переведена (по умолчанию все); остальные в hreflang не попадают */
export function getHreflangLinks(href: Href, locales: readonly AppLocale[] = routing.locales): Record<string, string> {
    const languages: Record<string, string> = Object.fromEntries(
        locales.map((locale) => [locale, absoluteUrl(getPathname({ locale, href }))])
    );
    languages['x-default'] = languages[routing.defaultLocale];

    return languages;
}

type PageMetadataInput = {
    locale: AppLocale;
    href: Href;
    title: string;
    description: string;
    siteName: string;
    /** true — title уже содержит бренд, шаблон из layout не применяется */
    absoluteTitle?: boolean;
    noindex?: boolean;
    /**
     * Языки, на которых страница уже переведена. На остальных — noindex (там временный русский текст,
     * дубль русской страницы), и в hreflang/og:locale:alternate они не попадают. По умолчанию — все языки.
     */
    locales?: readonly AppLocale[];
    /**
     * У страницы своя картинка превью — файл opengraph-image.tsx в её папке (страницы городов). Тогда общую
     * public/og.jpg не подставляем: явные images в metadata перебили бы картинку из файла
     */
    ownImage?: boolean;
};

// Next.js не сливает вложенные объекты metadata: openGraph страницы полностью заменяет
// openGraph из layout. Поэтому всё, что нужно для соцсетей, собираем в одном месте.
export function buildPageMetadata({
    locale,
    href,
    title,
    description,
    siteName,
    absoluteTitle = false,
    noindex = false,
    locales = routing.locales,
    ownImage = false,
}: PageMetadataInput): Metadata {
    const languages = getHreflangLinks(href, locales);
    const url = absoluteUrl(getPathname({ locale, href }));
    const hidden = noindex || !locales.includes(locale);

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: { canonical: url, languages },
        // не индексируем, но по ссылкам ходить можно: страница-«пустышка» не обрывает обход сайта
        ...(hidden && { robots: { index: false, follow: true } }),
        openGraph: {
            type: 'website',
            url,
            siteName,
            title,
            description,
            locale: OG_LOCALES[locale],
            alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
            // превью ссылки в Telegram/WhatsApp/VK/соцсетях; без картинки summary_large_image был пустым.
            // JPEG до 300 КБ — иначе WhatsApp не показывает превью
            ...(!ownImage && { images: [{ ...OG_IMAGE, alt: siteName }] }),
        },
        twitter: { card: 'summary_large_image', title, description, ...(!ownImage && { images: [OG_IMAGE.url] }) },
    };
}

export function breadcrumbJsonLd(locale: AppLocale, items: { name: string; href: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(getPathname({ locale, href: item.href })),
        })),
    };
}

/** Разметка ItemList — список страниц (на /sklad — города со складами), чтобы поисковик видел их как набор */
export function itemListJsonLd(locale: AppLocale, name: string, items: { name: string; href: Href }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        inLanguage: locale,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: absoluteUrl(getPathname({ locale, href: item.href })),
        })),
    };
}

/** Поиск по сайту для разметки WebSite: «Склады в городе …» → /sklad?q=… (поиск CitySearch читает q из адреса) */
export function siteSearchAction(locale: AppLocale) {
    return {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl(getPathname({ locale, href: '/sklad' }))}?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
    };
}

/**
 * Разметка FAQPage (вопрос — ответ). Только для настоящих вопросов, видимых на странице целиком, и только
 * на ОДНОЙ странице сайта: одинаковые вопросы на многих страницах Google размечать не рекомендует.
 */
export function faqJsonLd(locale: AppLocale, items: { title: string; text: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: locale,
        mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.title,
            acceptedAnswer: { '@type': 'Answer', text: item.text },
        })),
    };
}

export function generateJsonLd(
    locale: AppLocale,
    type: 'WebSite' | 'Article' | 'Organization' = 'WebSite',
    customData: Record<string, unknown> = {}
) {
    return {
        '@context': 'https://schema.org',
        '@type': type,
        inLanguage: locale,
        ...customData,
        url: absoluteUrl(getPathname({ locale, href: '/' })),
    };
}
