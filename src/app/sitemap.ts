import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { getCitiesWithWarehouses } from '@/lib/sklad';
import { SITE_CONFIG } from '@/config/site';

// /stocks — заглушка «В разработке» (noindex). Города без адресов складов тоже не включаем: у них noindex.
const STATIC_PAGES = ['/', '/menu', '/sklad'];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...STATIC_PAGES, ...getCitiesWithWarehouses().map(({ slug }) => `/sklad/${slug}`)];

  return pages.flatMap((href) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, `${SITE_CONFIG.url}${getPathname({ locale, href })}`]),
    );

    // по записи на каждую локаль, в каждой — полный набор alternates
    return routing.locales.map((locale) => ({
      url: languages[locale],
      changeFrequency: 'weekly' as const,
      priority: href === '/' ? 1 : href.startsWith('/sklad/') ? 0.8 : 0.7,
      alternates: { languages },
    }));
  });
}
