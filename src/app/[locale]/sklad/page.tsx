import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { breadcrumbJsonLd, buildPageMetadata, itemListJsonLd } from '@/lib/seo';
import { getCitiesWithWarehouses, getCityIndex, getCityName, getNationalStats } from '@/lib/sklad';
import CitySearch from '@/components/CitySearch';
import ScrollTop from '@/components/ui/scroll-top';
import JsonLd from '@/components/ui/json-ld';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'SkladPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/sklad',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
        absoluteTitle: true,
    });
}

export default async function SkladPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'SkladPage' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });

    const cities = getCityIndex(locale);
    const withData = getCitiesWithWarehouses();
    // цифры базы под заголовком: сколько всего городов и регионов, у скольких есть адреса, сколько складов
    const facts = [
        { value: cities.length, label: t('stats.cities', { count: cities.length }) },
        { value: withData.length, label: t('stats.data', { count: withData.length }) },
        { value: getNationalStats().count, label: t('stats.warehouses', { count: getNationalStats().count }) },
    ];

    const jsonLd = breadcrumbJsonLd(locale, [
        { name: tNav('home'), href: '/' },
        { name: tNav('warehouses'), href: '/sklad' },
    ]);

    return (
        <main>
            <JsonLd data={jsonLd} />
            {/* список страниц городов со складами — для поисковиков (ItemList) */}
            <JsonLd
                data={itemListJsonLd(
                    locale,
                    t('heading'),
                    withData.map((city) => ({ name: getCityName(city, locale), href: `/sklad/${city.slug}` })),
                )}
            />
            <ScrollTop />

            {/* Одна секция: у первой секции на сайте высота на весь экран (style.scss),
                поэтому поиск должен быть внутри неё, а не ниже */}
            <section>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{tNav('warehouses')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                    <p className='max-w-60-ch mb-15'>{t('lead')}</p>

                    <ul className='flex gap-8 mb-20'>
                        {facts.map(({ value, label }) => (
                            <li className='sklad-fact inline-flex nowrap align-center gap-7 px-16 py-5 br-36 bg-3-100 border-1px-2-10 font-14' key={label}>
                                <b className='font-18 color-2-90'>{value}</b>
                                {label}
                            </li>
                        ))}
                    </ul>

                    <CitySearch cities={cities} />
                </div>
            </section>
        </main>
    );
}
