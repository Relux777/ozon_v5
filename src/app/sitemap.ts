import type { MetadataRoute } from 'next';
import { getPathname } from '@/i18n/navigation';
import { routing, type AppLocale } from '@/i18n/routing';
import { DATA_UPDATED_AT, getCitiesWithWarehouses } from '@/lib/sklad';
import { HOME_CHECKED_AT, SITE_CONFIG, SUPPORT_CHECKED_AT } from '@/config/site';
import { REFERRALS_CHECKED_AT, STOCKS_LOCALES } from '@/config/referrals';
import { LEVEL_LOCALES, RATING_CHECKED_AT } from '@/config/rating';
import { LEGAL_UPDATED_AT } from '@/config/legal';

// Города без адресов складов не включаем: у них noindex. Документы /menu/{about,privacy,cookies,terms,ads} —
// на русском для всех языков, поэтому noindex и в sitemap их нет.
const STATIC_PAGES = ['/', '/menu', '/sklad', '/stocks', '/menu/level', '/menu/support', '/menu/cooperation'];

// Страницы, переведённые пока не на все языки: остальные языки у них noindex (см. buildPageMetadata → locales),
// поэтому в sitemap и в alternates их нет
const PAGE_LOCALES: Record<string, readonly AppLocale[]> = {
  '/stocks': STOCKS_LOCALES,
  '/menu/level': LEVEL_LOCALES,
};

// lastModified — дата реальной сверки данных (а не дата сборки): поисковики по ней решают, когда
// переобходить страницу. Главная — сверка со справкой Ozon Job, склады — выгрузка warehouses.json,
// акции — сверка условий приглашений Ozon Банка.
function lastModified(href: string): string | undefined {
  if (href === '/') return HOME_CHECKED_AT;
  if (href === '/sklad' || href.startsWith('/sklad/')) return DATA_UPDATED_AT;
  if (href === '/stocks') return REFERRALS_CHECKED_AT;
  if (href === '/menu/level') return RATING_CHECKED_AT;
  if (href === '/menu/support') return SUPPORT_CHECKED_AT;
  if (href === '/menu/cooperation') return LEGAL_UPDATED_AT;
  return undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [...STATIC_PAGES, ...getCitiesWithWarehouses().map(({ slug }) => `/sklad/${slug}`)];

  return pages.flatMap((href) => {
    const locales = PAGE_LOCALES[href] ?? routing.locales;
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, `${SITE_CONFIG.url}${getPathname({ locale, href })}`]),
    );

    // по записи на каждую локаль, в каждой — полный набор alternates
    return locales.map((locale) => ({
      url: languages[locale],
      lastModified: lastModified(href),
      changeFrequency: 'weekly' as const,
      priority: href === '/' ? 1 : href.startsWith('/sklad/') ? 0.8 : 0.7,
      alternates: { languages },
    }));
  });
}
