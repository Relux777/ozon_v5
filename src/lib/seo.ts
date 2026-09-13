import { getPathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { SITE_CONFIG } from '@/config/site';

const BASE_URL = SITE_CONFIG.url;

type Href = Parameters<typeof getPathname>[0]['href'];

export async function getHreflangLinks(href: Href): Promise<Record<string, string>> {
    const entries = await Promise.all(
        routing.locales.map(async (locale) => {
            const pathname = await getPathname({ locale, href });
            return [locale, `${BASE_URL}${pathname}`] as const;
        })
    );

    const languages = Object.fromEntries(entries);
    languages['x-default'] = languages[routing.defaultLocale];

    return languages;
}

export async function generateJsonLd(
    locale: AppLocale,
    type: 'WebSite' | 'Article' | 'Organization' = 'WebSite',
    customData: Record<string, unknown> = {}
) {
    const pathname = await getPathname({ locale, href: '/' });

    return {
        '@context': 'https://schema.org',
        '@type': type,
        ...customData,
        url: `${BASE_URL}${pathname}`,
    };
}