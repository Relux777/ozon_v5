import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PROMO } from '@/config/promo';
import Hero, { HERO_PRIMARY_BTN, HERO_SECONDARY_BTN } from '@/components/Hero';
import HomeSections, { getHomeNavItems } from '@/components/HomeSections';
import PageNav from '@/components/PageNav';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { buildPageMetadata, faqJsonLd, generateJsonLd } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

// Главная = первый экран (Hero) + общие секции (HomeSections: от «Ozon в цифрах» до «Источников»).
// Те же секции переиспользует страница города sklad/[city] — правки разметки делать в HomeSections.

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
    });

    return (
        <main className='home_page'>
            <JsonLd data={jsonLd} />
            {/* «Частые вопросы» (#tips) — FAQPage размечаем только здесь: на страницах городов те же вопросы */}
            <JsonLd data={faqJsonLd(locale, t.raw('pay.tips') as { title: string; text: string }[])} />
            {/* быстрая навигация по странице: пункты — заголовки общих секций */}
            <PageNav label={t('pageNavLabel')} items={await getHomeNavItems(locale)} />
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
            <HomeSections locale={locale} />
        </main>
    );
}
