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
        <main>
            <JsonLd data={jsonLd} />

            <section>
                <div className="container">
                    <Breadcrumbs
                        items={[
                            { label: tNav('home'), href: '/' },
                            { label: tNav('warehouses'), href: '/sklad' },
                            { label: city.name },
                        ]}
                    />

                    <p className="color-5-100 font-14">{tMeta('siteName')}</p>
                    <h1 className="mb-7 color-2-90 text-balance">{t('heading', { site: tMeta('siteName'), city: city.name })}</h1>
                    <p className="max-w-60-ch mb-20">{stats ? t('leadWithData', values) : t('leadNoData', values)}</p>

                    <ul className="font-14 checks-li grid gap-7 mb-20" aria-label={t('offersTitle')}>
                        {offers.map((offer) => (
                            <li className="p-relative pl-30" key={offer}>{offer}</li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="py-20">
                <div className="container">
                    {stats && (
                        <dl className="flex row-flush mb-15">
                            <div className="f-w-4 mb-15">
                                <div className="bg-3-100 br-20 pd-20 border-1px-2-10 shadow-3">
                                    <dt className="color-2-80">{t('statWarehouses')}</dt>
                                    <dd className="md-0 font-22 font-w-500 color-2-90">{stats.count}</dd>
                                </div>
                            </div>
                            <div className="f-w-4 mb-15">
                                <div className="bg-3-100 br-20 pd-20 border-1px-2-10 shadow-3">
                                    <dt className="color-2-80">{t('statIncome')}</dt>
                                    <dd className="md-0 font-22 font-w-500 color-5-100">{income}</dd>
                                </div>
                            </div>
                            {stats.average && stats.count > 1 && (
                                <div className="f-w-4 mb-15">
                                    <div className="bg-3-100 br-20 pd-20 border-1px-2-10 shadow-3">
                                        <dt className="color-2-80">{t('statAverage')}</dt>
                                        <dd className="md-0 font-22 font-w-500 color-2-90">{t('incomeUpTo', { to: stats.average })}</dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    )}

                    {stats && (
                        <>
                            <h2 className="font-22 mb-15 color-2-90">{t('perksTitle')}</h2>
                            <ul className="flex gap-5 mb-20" aria-label={t('perksTitle')}>
                                {stats.perks.map((perk) => (
                                    <li className="inline-flex nowrap align-center px-10 py-4 br-36 bg-5-10 color-5-100 font-14" key={perk}>
                                        {t(`perks.${perk}`)}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    <h2 className="font-22 mb-15 color-2-90">{t('warehousesTitle', values)}</h2>

                    {city.warehouses.length > 0 ? (
                        <ul className="flex row-flush mb-15">
                            {city.warehouses.map((warehouse) => (
                                <li className="f-w-4 mb-15" key={warehouse.address}>
                                    <div className="grid gap-7 content-start h-full bg-3-100 br-20 pd-20 border-1px-2-10 shadow-3 translate_0_5 tr-2">
                                        <p className="md-0 font-w-500 color-2-90">{warehouse.address}</p>
                                        <p className="md-0 color-5-100 font-14">{incomeLabel(t, warehouse.income)}</p>
                                        <ul className="flex gap-5">
                                            {warehouse.perks.map((perk) => (
                                                <li className="inline-flex nowrap align-center px-10 py-4 br-36 bg-2-7 font-12" key={perk}>
                                                    {t(`perks.${perk}`)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mb-20">{t('warehousesEmpty')}</p>
                    )}

                    <h2 className="font-22 mb-15 color-2-90">{t('dutiesTitle')}</h2>
                    <ul className="font-14 checks-li grid gap-7 mb-20">
                        {duties.map((duty) => (
                            <li className="p-relative pl-30" key={duty}>{duty}</li>
                        ))}
                    </ul>

                    <PromoCode code={PROMO.code} amount={PROMO.userBonus} appUrl={PROMO.appUrl || undefined} />

                    <p className="color-2-80 font-12 mb-15">{t('disclaimer', { date: updatedAt })}</p>

                    <div className="flex gap-10">
                        <a
                            className="hover-none flex align-center bg-5-100 hover-bg-5-80 br-36 h-46 px-24 color-6-100 translate_0_2 shadow-1"
                            href={getOzonCityUrl(city)}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                        >
                            {t('source')}
                        </a>
                        <Link href="/sklad" className="hover-none flex align-center bg-2-7 br-36 h-46 px-24 color-2-100 translate_0_2 shadow-3">
                            {t('allCities')}
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
