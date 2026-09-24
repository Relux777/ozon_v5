import type { Metadata } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { OG_IMAGE, SITE_CONFIG } from '@/config/site';

const BASE_URL = SITE_CONFIG.url;

type Href = Parameters<typeof getPathname>[0]['href'];

// Open Graph требует формат language_TERRITORY, а не просто код языка
const OG_LOCALES: Record<AppLocale, string> = {
    ru: 'ru_RU',
    uz: 'uz_UZ',
    hy: 'hy_AM',
    az: 'az_AZ',
    ka: 'ka_GE',
    ky: 'ky_KG',
    kk: 'kk_KZ',
};

export function getHreflangLinks(href: Href): Record<string, string> {
    const languages: Record<string, string> = Object.fromEntries(
        routing.locales.map((locale) => [locale, `${BASE_URL}${getPathname({ locale, href })}`])
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
}: PageMetadataInput): Metadata {
    const languages = getHreflangLinks(href);
    const url = languages[locale];

    return {
        title: absoluteTitle ? { absolute: title } : title,
        description,
        alternates: { canonical: url, languages },
        ...(noindex && { robots: { index: false, follow: false } }),
        openGraph: {
            type: 'website',
            url,
            siteName,
            title,
            description,
            locale: OG_LOCALES[locale],
            alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
            // превью ссылки в Telegram/WhatsApp/VK/соцсетях; без картинки summary_large_image был пустым.
            // JPEG до 300 КБ — иначе WhatsApp не показывает превью
            images: [{ ...OG_IMAGE, alt: siteName }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [OG_IMAGE.url] },
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
            item: `${BASE_URL}${getPathname({ locale, href: item.href })}`,
        })),
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
        url: `${BASE_URL}${getPathname({ locale, href: '/' })}`,
    };
}
