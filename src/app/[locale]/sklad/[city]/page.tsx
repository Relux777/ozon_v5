import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import {
    DATA_UPDATED_AT,
    getCitiesWithWarehouses,
    getCity,
    getCityStats,
    getOzonCityUrl,
    type Income,
} from '@/lib/sklad';
import { PROMO } from '@/config/promo';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd from '@/components/JsonLd';
import PromoCode from '@/components/PromoCode';
import styles from '../sklad.module.scss';

type Props = {
    params: Promise<{ locale: string; city: string }>;
};

// Заранее собираем только города с адресами складов (во всех языках).
// Остальные страницы рендерятся при первом заходе и дальше отдаются из кэша.
export function generateStaticParams() {
    return getCitiesWithWarehouses().map(({ slug }) => ({ city: slug }));
}

async function resolveCity(params: Props['params']) {
    const { city: slug } = await params;
    const city = getCity(slug);

    if (!city) notFound();

    return city;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const city = await resolveCity(params);
    const stats = getCityStats(city);

    const t = await getTranslations({ locale, namespace: 'CityPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    const income = incomeLabel(t, { from: stats?.min, to: stats?.max });
    const values = { city: city.name, income };

    return buildPageMetadata({
        locale,
        href: `/sklad/${city.slug}`,
        title: stats ? t('titleWithData', values) : t('titleNoData', values),
        description: stats ? t('descriptionWithData', values) : t('descriptionNoData', values),
        siteName: tMeta('siteName'),
        absoluteTitle: true,
        // без адресов страница почти не отличается от соседних — не индексируем, пока нет данных
        noindex: !stats,
    });
}

type Translator = Awaited<ReturnType<typeof getTranslations<'CityPage'>>>;

/** «от 90 000 до 160 000 ₽/мес», «до 126 000 ₽/мес» или «от 149 000 ₽/мес» */
function incomeLabel(t: Translator, { from, to }: Income) {
    if (from && to) return t('incomeRange', { from, to });
    if (to) return t('incomeUpTo', { to });
    if (from) return t('incomeFrom', { from });
    return '';
}

export default async function CityPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const city = await resolveCity(params);
    const stats = getCityStats(city);

    const t = await getTranslations({ locale, namespace: 'CityPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });
    const format = await getFormatter({ locale });

    const income = incomeLabel(t, { from: stats?.min, to: stats?.max });
    const values = { city: city.name, income };
    const offers = t.raw('offers') as string[];
    const duties = t.raw('duties') as string[];
    const updatedAt = format.dateTime(new Date(DATA_UPDATED_AT), { dateStyle: 'long' });

    const jsonLd = breadcrumbJsonLd(locale, [
        { name: tNav('home'), href: '/' },
        { name: tNav('warehouses'), href: '/sklad' },
        { name: city.name, href: `/sklad/${city.slug}` },
    ]);

    return (
        <main className={styles.page}>
            <JsonLd data={jsonLd} />

            <section>
                <div className="container flex align-center">
                    <div className="f-w-8">
                        <Breadcrumbs
                            items={[
                                { label: tNav('home'), href: '/' },
                                { label: tNav('warehouses'), href: '/sklad' },
                                { label: city.name },
                            ]}
                        />

                        <p className="color-5-100">{tMeta('siteName')}</p>

                        <h1 className="font-36">{t('heading', { site: tMeta('siteName'), city: city.name })}</h1>

                        <p>{stats ? t('leadWithData', values) : t('leadNoData', values)}</p>

                        <ul aria-label={t('offersTitle')}>
                            {offers.map((offer) => (
                                <li key={offer}>{offer}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className="container flex">
                    <div className="f-w-12">
                        {stats && (
                            <dl className={`flex ${styles.row}`}>
                                <div className="f-w-4 mb-15">
                                    <div className="bg-3-100 br-20 pd-20 border-1px-2-10">
                                        <dt className="color-2-80">{t('statWarehouses')}</dt>
                                        <dd className={`font-22 font-w-500 ${styles.dd}`}>{stats.count}</dd>
                                    </div>
                                </div>
                                <div className="f-w-4 mb-15">
                                    <div className="bg-3-100 br-20 pd-20 border-1px-2-10">
                                        <dt className="color-2-80">{t('statIncome')}</dt>
                                        <dd className={`font-22 font-w-500 ${styles.dd}`}>{income}</dd>
                                    </div>
                                </div>
                                {stats.average && stats.count > 1 && (
                                    <div className="f-w-4 mb-15">
                                        <div className="bg-3-100 br-20 pd-20 border-1px-2-10">
                                            <dt className="color-2-80">{t('statAverage')}</dt>
                                            <dd className={`font-22 font-w-500 ${styles.dd}`}>
                                                {t('incomeUpTo', { to: stats.average })}
                                            </dd>
                                        </div>
                                    </div>
                                )}
                            </dl>
                        )}

                        {stats && (
                            <>
                                <h2 className="font-24 mb-15">{t('perksTitle')}</h2>
                                <ul className="flex gap-5 mb-15">
                                    {stats.perks.map((perk) => (
                                        <li key={perk} className={`br-36 bg-2-10 color-5-100 ${styles.tag}`}>
                                            {t(`perks.${perk}`)}
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}

                        <h2 className="font-24 mb-15">{t('warehousesTitle', values)}</h2>

                        {city.warehouses.length > 0 ? (
                            <ul className={`flex ${styles.row}`}>
                                {city.warehouses.map((warehouse) => (
                                    <li key={warehouse.address} className="f-w-4 mb-15">
                                        <div className="bg-3-100 br-20 pd-20 border-1px-2-10">
                                            <p className="font-w-500 mb-7">{warehouse.address}</p>
                                            <p className="color-5-100 mb-7">{incomeLabel(t, warehouse.income)}</p>
                                            <ul className="flex gap-5">
                                                {warehouse.perks.map((perk) => (
                                                    <li key={perk} className={`br-36 bg-2-10 ${styles.tag}`}>
                                                        {t(`perks.${perk}`)}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mb-15">{t('warehousesEmpty')}</p>
                        )}

                        <h2 className="font-24 mb-15">{t('dutiesTitle')}</h2>
                        <ul className="mb-15">
                            {duties.map((duty) => (
                                <li key={duty}>{duty}</li>
                            ))}
                        </ul>

                        <PromoCode code={PROMO.code} amount={PROMO.userBonus} appUrl={PROMO.appUrl || undefined} />

                        <p className={`color-2-80 mb-15 ${styles.note}`}>{t('disclaimer', { date: updatedAt })}</p>

                        <div className="flex gap-10">
                            <a
                                className={`br-36 ${styles.button} ${styles.primary}`}
                                href={getOzonCityUrl(city)}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                            >
                                {t('source')}
                            </a>
                            <Link className={`br-36 bg-2-10 ${styles.button}`} href="/sklad">
                                {t('allCities')}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
