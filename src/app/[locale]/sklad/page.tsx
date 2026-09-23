import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { getCityIndex } from '@/lib/sklad';
import CitySearch from '@/components/CitySearch';
import ScrollTop from '@/components/ScrollTop';
import JsonLd from '@/components/JsonLd';

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

    const jsonLd = breadcrumbJsonLd(locale, [
        { name: tNav('home'), href: '/' },
        { name: tNav('warehouses'), href: '/sklad' },
    ]);

    return (
        <main>
            <JsonLd data={jsonLd} />
            <ScrollTop />

            {/* Одна секция: у первой секции на сайте высота на весь экран (style.scss),
                поэтому поиск должен быть внутри неё, а не ниже */}
            <section>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{tNav('warehouses')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                    <p className='max-w-60-ch mb-20'>{t('lead')}</p>

                    <CitySearch cities={getCityIndex()} />
                </div>
            </section>
        </main>
    );
}
