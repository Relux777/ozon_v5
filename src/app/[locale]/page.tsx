import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PROMO } from '@/config/promo';
import Hero, { HERO_PRIMARY_BTN, HERO_SECONDARY_BTN } from '@/components/Hero';
import HomeSections, { getHomeNavItems } from '@/components/HomeSections';
import PageNav from '@/components/PageNav';
import PopularCities, { POPULAR_CITIES_ID } from '@/components/PopularCities';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { buildPageMetadata, faqJsonLd, generateJsonLd, siteSearchAction } from '@/lib/seo';
import JsonLd from '@/components/ui/json-ld';

// Страница целиком статическая: сборка упадёт, если в неё попадёт рендер «на запрос» — cookies, headers, незакэшированные
// данные (Next 16.4, работает с cacheComponents). У каждой страницы сайта, кроме [...rest]: там адрес заранее не известен
export const ensureStatic = 'navigation';

// Главная = первый экран (Hero) + общие секции (HomeSections: от «Ozon в цифрах» до «Источников»), а после
// «Ozon в цифрах» — ссылки на страницы крупных городов (PopularCities). Часть секций (шаги, код приглашения,
// Ozon Карта) показывает и страница города sklad/[city] — правки их разметки делать в HomeSections.

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'HomePage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
        // ключевые слова и бренд заданы прямо в title — шаблон из layout не применяем
        absoluteTitle: true,
    });
}

export default async function HomePage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'HomePage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    const jsonLd = generateJsonLd(locale, 'WebSite', {
        name: tMeta('siteName'),
        description: t('description'),
        // поиск по сайту — поиск города на /sklad?q=…
        potentialAction: siteSearchAction(locale),
    });

    // пункты быстрой навигации: «Ozon в цифрах» → города → остальные секции (как на странице)
    const [statsNav, ...restNav] = await getHomeNavItems(locale);
    const navItems = [statsNav, { kicker: t('cities.eyebrow'), title: t('cities.title'), href: `#${POPULAR_CITIES_ID}` }, ...restNav];

    return (
        <main className='home_page'>
            <JsonLd data={jsonLd} />
            {/* «Частые вопросы» (#tips) — FAQPage размечаем только здесь: на страницах городов те же вопросы */}
            <JsonLd data={faqJsonLd(locale, t.raw('pay.tips') as { title: string; text: string }[])} />
            {/* быстрая навигация по странице: пункты — заголовки общих секций */}
            <PageNav label={t('pageNavLabel')} items={navItems} />
            <Hero
                kicker={tMeta('siteName')}
                heading={t('heading')}
                lead={t('lead', { amount: PROMO.userBonus })}
                features={t.raw('features') as string[]}
                imageAlt={t('imageAlt.hero')}
                actions={
                    <>
                        <Link href='/sklad' className={HERO_PRIMARY_BTN}>
                            {t('heroCity')}
                        </Link>
                        {/* якорь на блок с кодом: плавную прокрутку даёт scroll-behavior в ReluxCode */}
                        <a href='#promo' className={HERO_SECONDARY_BTN}>
                            {t('heroBonus', { amount: PROMO.userBonus })}
                        </a>
                    </>
                }
            />
            <HomeSections locale={locale} afterStats={<PopularCities locale={locale} />} />
        </main>
    );
}
