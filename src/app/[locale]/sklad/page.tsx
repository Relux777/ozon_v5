import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { getCityIndex } from '@/lib/sklad';
import Breadcrumbs from '@/components/Breadcrumbs';
import CitySearch from '@/components/CitySearch';
import JsonLd from '@/components/JsonLd';
import styles from './sklad.module.scss';

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
        <main className={styles.page}>
            <JsonLd data={jsonLd} />

            {/* Одна секция: у первой секции на сайте высота на весь экран (style.scss),
                поэтому поиск должен быть внутри неё, а не ниже */}
            <section>
                <div className="container">
                    <Breadcrumbs items={[{ label: tNav('home'), href: '/' }, { label: tNav('warehouses') }]} />

                    <h1 className="font-36">{t('heading')}</h1>

                    <p className="mb-15">{t('lead')}</p>

                    <CitySearch cities={getCityIndex()} />
                </div>
            </section>
        </main>
    );
}
