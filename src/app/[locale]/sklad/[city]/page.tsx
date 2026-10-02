import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import {
    DATA_UPDATED_AT,
    PERKS,
    getCitiesWithWarehouses,
    getCity,
    getCityStats,
    getNationalStats,
    getOzonCityUrl,
    getRelatedCities,
    type Income,
    type Perk,
    type Warehouse,
} from '@/lib/sklad';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import CopyLink from '@/components/ui/copy-link';
import Hero, { HERO_PRIMARY_BTN, HERO_SECONDARY_BTN } from '@/components/Hero';
import HomeSections, { getHomeNavItems } from '@/components/HomeSections';
import JsonLd from '@/components/ui/json-ld';
import PageNav from '@/components/PageNav';
import type { PageNavExtra, PageNavItem } from '@/components/PageNav/PageNavModal';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com), как и остальные иконки проекта.
// viewBox='0 0 24 24' у иконок не родного размера — чтобы они масштабировались, а не обрезались
import LocationSVG from '@/assets/svg/location.svg';
import ChevronDownSVG from '@/assets/svg/chevron-down.svg';
import WarehouseSVG from '@/assets/svg/sklad/warehouse.svg';
import BarChartSVG from '@/assets/svg/sklad/bar-chart.svg';
import BusSVG from '@/assets/svg/sklad/bus.svg';
import BookOpenSVG from '@/assets/svg/sklad/book-open.svg';
import BowlHotSVG from '@/assets/svg/sklad/bowl-hot.svg';
import PlusShieldSVG from '@/assets/svg/sklad/plus-shield.svg';
import CreditCardSVG from '@/assets/svg/sklad/credit-card.svg';
import FileDetailSVG from '@/assets/svg/sklad/file-detail.svg';
import CalendarCheckSVG from '@/assets/svg/sklad/calendar-check.svg';
import GiftSVG from '@/assets/svg/sklad/gift.svg';
import ScanBarcodeSVG from '@/assets/svg/sklad/scan-barcode.svg';
import ScanSearchSVG from '@/assets/svg/sklad/scan-search.svg';
import PackageSVG from '@/assets/svg/sklad/package.svg';
import UserCheckSVG from '@/assets/svg/sklad/user-check.svg';
import MapSVG from '@/assets/svg/sklad/map.svg';
import CopySVG from '@/assets/svg/sklad/copy.svg';
import DirectionsSVG from '@/assets/svg/sklad/directions.svg';

// Страница города = первый экран (Hero) + секции главной (HomeSections), а сразу после «Почему стоит
// работать в Ozon» — блоки про склады города. Сайт — про подработку через приложение Ozon Job, поэтому
// данные вакансий в штат (career.ozon.ru: адреса, доход, удобства) везде подписаны как «в штате»,
// а условия Ozon Job — по job.ozon.ru и справке для исполнителей. Данные складов — lib/sklad.ts.

type Props = {
    params: Promise<{ locale: string; city: string }>;
};

type Svg = typeof WarehouseSVG;

// Сколько адресов видно сразу; остальные — под «Показать все адреса» (<details>, без JS)
const VISIBLE_ADDRESSES = 6;

// Сценарии «сколько слотов в месяц» для блока дохода Ozon Job: доля полоски = слоты / 30 дней
const JOB_SCENARIOS = [5, 10, 20] as const;
const DAYS_IN_MONTH = 30;

// Иконка и цвет каждого удобства — одинаковые в плитках «Что есть на складах», в карточках адресов и в модалке
const PERK_ICONS: Record<Perk, Svg> = {
    transport: BusSVG,
    training: BookOpenSVG,
    meal: BowlHotSVG,
    dms: PlusShieldSVG,
};

const PERK_ACCENTS: Record<Perk, string> = {
    transport: '#1c7ed6',
    training: '#7a5af8',
    meal: '#f08c00',
    dms: '#12b886',
};

// Касается ли удобство из вакансий в штат подработки через Ozon Job (тексты — CityPage.perksJob.*):
// транспорт — есть в условиях job.ozon.ru; обучение — первый слот учебный (справка Ozon Job);
// питание — в Ozon Job не указано; ДМС — только для штата (career.ozon.ru)
const JOB_TONE_COLORS = { yes: '#12b886', maybe: '#f59f00', no: '#868e96' } as const;
const PERK_JOB_TONE: Record<Perk, keyof typeof JOB_TONE_COLORS> = {
    transport: 'yes',
    training: 'yes',
    meal: 'maybe',
    dms: 'no',
};

// «Что даёт подработка через Ozon Job»: порядок карточек, иконки и цвета (тексты — CityPage.offer.items.*)
const OFFERS = [
    { key: 'payments', icon: CreditCardSVG, accent: '#005bff' },
    { key: 'schedule', icon: CalendarCheckSVG, accent: '#12b886' },
    { key: 'transport', icon: BusSVG, accent: '#1c7ed6' },
    { key: 'start', icon: BookOpenSVG, accent: '#f59f00' },
    { key: 'contract', icon: FileDetailSVG, accent: '#7a5af8' },
    { key: 'tasks', icon: PackageSVG, accent: '#f76707' },
    { key: 'transparent', icon: BarChartSVG, accent: '#0ca678' },
    { key: 'bonus', icon: GiftSVG, accent: '#e64980' },
] as const;

// «Чем предстоит заниматься» (тексты — CityPage.duty.items.*)
const DUTIES = [
    { key: 'scan', icon: ScanBarcodeSVG },
    { key: 'check', icon: ScanSearchSVG },
    { key: 'pack', icon: PackageSVG },
    { key: 'you', icon: UserCheckSVG },
] as const;

/** цвет для .icon-badge / .accent-* / .job-tone внутри элемента (см. style.scss) */
const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

/** поиск полного адреса в Яндекс Картах */
const mapUrl = (address: string) => `https://yandex.ru/maps/?text=${encodeURIComponent(address)}`;

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
    const national = getNationalStats();
    const related = getRelatedCities(city);

    const t = await getTranslations({ locale, namespace: 'CityPage' });
    const tHome = await getTranslations({ locale, namespace: 'HomePage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });
    const format = await getFormatter({ locale });

    const income = incomeLabel(t, { from: stats?.min, to: stats?.max });
    const values = { city: city.name, income };
    const updatedAt = format.dateTime(new Date(DATA_UPDATED_AT), { dateStyle: 'long' });
    const officialUrl = getOzonCityUrl(city);
    const jobScenarios = t.raw('why.jobScenarios') as string[];

    // средний доход в штате по городу против среднего по всей базе; разница в пределах ±2% — «на уровне среднего»
    const diff = stats?.average ? Math.round((stats.average / national.average - 1) * 100) : 0;
    const compare =
        diff >= 2 ? t('why.above', { percent: diff }) : diff <= -2 ? t('why.below', { percent: -diff }) : t('why.equal');

    const jsonLd = breadcrumbJsonLd(locale, [
        { name: tNav('home'), href: '/' },
        { name: tNav('warehouses'), href: '/sklad' },
        { name: city.name, href: `/sklad/${city.slug}` },
    ]);

    // ── Модалка быстрой навигации: справка по городу + пункты про город + пункты общих секций ──────
    const cityNav: PageNavItem[] = [
        {
            kicker: t('why.eyebrow', { city: city.name }),
            title: t('why.title', { city: city.name }),
            href: '#city',
            links: stats
                ? [
                      { label: t('nav.data'), href: '#city-data' },
                      { label: t('perksTitle'), href: '#perks' },
                      { label: t('warehousesTitle', values), href: '#addresses' },
                      ...(related.length > 0 ? [{ label: t('related.title'), href: '#related' }] : []),
                  ]
                : undefined,
        },
        {
            kicker: t('offer.eyebrow'),
            title: t('offer.title'),
            href: '#offers',
            links: [{ label: t('duty.title'), href: '#duties' }],
        },
    ];
    // порядок как на странице: «Почему стоит работать в Ozon» (#stats) → блоки города → остальные общие секции
    const [statsNav, ...restNav] = await getHomeNavItems(locale);
    const navItems = [statsNav, ...cityNav, ...restNav];

    const navExtras: PageNavExtra[] = [
        {
            label: t('nav.official', { city: city.name }),
            href: officialUrl,
            external: true,
            icon: <WarehouseSVG width={18} height={18} viewBox='0 0 24 24' />,
        },
        { label: t('allCities'), href: '/sklad', icon: <MapSVG width={18} height={18} viewBox='0 0 24 24' /> },
    ];

    const navSummary = (
        <div className='city-summary grid gap-10 br-20 pd-20 mb-20'>
            <p className='font-12 text-uppercase letter-s-8'>{t('nav.summaryKicker', { city: city.name })}</p>
            {stats ? (
                <>
                    <p className='font-18'>
                        <b className='font-22'>{stats.count}</b> {t('why.countLabel', { count: stats.count, city: city.name })}
                    </p>
                    <ul className='flex gap-5'>
                        {stats.perks.map((perk) => {
                            const Icon = PERK_ICONS[perk];

                            return (
                                <li className='city-summary-chip inline-flex nowrap align-center gap-5 px-10 py-4 br-36 font-12' key={perk}>
                                    <Icon width={14} height={14} viewBox='0 0 24 24' aria-hidden='true' />
                                    {t(`perksShort.${perk}`)} · {stats.perkCounts[perk]}/{stats.count}
                                </li>
                            );
                        })}
                    </ul>
                    {stats.average && <p className='font-14 font-w-500'>{t('nav.summaryAverage', { value: stats.average })}</p>}
                </>
            ) : (
                <p className='font-16'>{t('nav.summaryNoData')}</p>
            )}
            <p className='font-14 font-w-500'>{t('nav.summaryJob')}</p>
            <p className='font-12'>{t('nav.summaryDate', { date: updatedAt })}</p>
        </div>
    );

    // ── Карточка адреса склада: полный адрес — показываем, копируем и ищем на карте ──────────────
    const renderAddress = (warehouse: Warehouse, index: number) => (
        <li className='f-w-4 f-h-6 mb-20' key={warehouse.address}>
            <article className='address-card grid gap-12 h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3 translate_0_5 tr-2'>
                <div className='flex nowrap align-center justify-between gap-10'>
                    <span className='inline-flex nowrap align-center gap-5 color-5-100 font-12 font-w-500 text-uppercase letter-s-8'>
                        <LocationSVG width={16} height={16} viewBox='0 0 24 24' aria-hidden='true' />
                        {t('addresses.number', { n: index + 1 })}
                    </span>
                    <span className='inline-flex nowrap align-center px-10 py-4 br-36 bg-5-10 color-5-100 font-12 font-w-700 space-nowrap'>
                        {incomeLabel(t, warehouse.income)}
                    </span>
                </div>
                <p className='md-0 font-16 font-w-500 color-2-90'>{warehouse.fullAddress}</p>
                {/* обёртка занимает строку 1fr (.address-card), сам список — по содержимому */}
                <div>
                    <ul className='flex gap-5' aria-label={t('perksTitle')}>
                        {warehouse.perks.map((perk) => {
                            const Icon = PERK_ICONS[perk];

                            return (
                                <li className='inline-flex nowrap align-center gap-5 px-10 py-4 br-36 bg-2-7 font-12' style={accent(PERK_ACCENTS[perk])} key={perk}>
                                    <Icon className='accent-text' width={14} height={14} viewBox='0 0 24 24' aria-hidden='true' />
                                    {t(`perksShort.${perk}`)}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <div className='flex gap-8'>
                    <CopyLink
                        url={warehouse.fullAddress}
                        copyLabel={t('addresses.copy')}
                        copiedLabel={t('addresses.copied')}
                        icon={<CopySVG width={16} height={16} viewBox='0 0 24 24' aria-hidden='true' />}
                        className='inline-flex nowrap align-center gap-5 h-36 px-16 br-36 bg-2-7 hover-none font-12 font-w-500 color-2-90 active_scale_09'
                    />
                    <a
                        href={mapUrl(warehouse.fullAddress)}
                        target='_blank'
                        rel='nofollow noopener noreferrer'
                        aria-label={t('addresses.mapLabel', { address: warehouse.fullAddress })}
                        className='inline-flex nowrap align-center gap-5 h-36 px-16 br-36 bg-5-10 hover-none font-12 font-w-500 color-5-100 active_scale_09'
                    >
                        <DirectionsSVG width={16} height={16} viewBox='0 0 24 24' aria-hidden='true' />
                        {t('addresses.map')}
                    </a>
                </div>
            </article>
        </li>
    );

    const visibleAddresses = city.warehouses.slice(0, VISIBLE_ADDRESSES);
    const moreAddresses = city.warehouses.slice(VISIBLE_ADDRESSES);

    return (
        <main>
            <JsonLd data={jsonLd} />
            <PageNav
                label={tHome('pageNavLabel')}
                items={navItems}
                summary={navSummary}
                extrasTitle={t('nav.extrasTitle')}
                extras={navExtras}
            />

            <Hero
                top={
                    <Breadcrumbs
                        items={[
                            { label: tNav('home'), href: '/' },
                            { label: tNav('warehouses'), href: '/sklad' },
                            { label: city.name },
                        ]}
                    />
                }
                kicker={t('heroKicker', { city: city.name })}
                heading={t('heading', { site: tMeta('siteName'), city: city.name })}
                lead={stats ? t('leadWithData', values) : t('leadNoData', values)}
                features={tHome.raw('features') as string[]}
                imageAlt={tHome('imageAlt.hero')}
                actions={
                    <>
                        {stats ? (
                            <a href='#addresses' className={HERO_PRIMARY_BTN}>{t('heroAddresses')}</a>
                        ) : (
                            <Link href='/sklad' className={HERO_PRIMARY_BTN}>{t('allCities')}</Link>
                        )}
                        {/* без суммы: бонус новичку зависит от склада первой записи (1 000–5 000 ₽), см. #promo и offer.items.bonus */}
                        <a href='#promo' className={HERO_SECONDARY_BTN}>
                            {t('heroBonus')}
                        </a>
                    </>
                }
            />

            {/* Всё как на главной (цифры Ozon, шаги, код приглашения, выплаты, документы…), а сразу после
                «Почему стоит работать в Ozon» — блоки про склады этого города (слот afterStats) */}
            <HomeSections
                locale={locale}
                afterStats={
                    <>
                        {/* ── Склады города: наши данные, удобства, адреса, соседние города ────────────── */}
                        <section className='py-20 scroll-anchor' id='city'>
                            <div className='container'>
                                <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('why.eyebrow', { city: city.name })}</p>
                                <h2 className='mb-7 color-2-90 text-balance'>{t('why.title', { city: city.name })}</h2>
                                <p className='max-w-60-ch mb-20'>{t('why.lead')}</p>

                                {stats ? (
                                    <>
                                        {/* наши цифры: сколько складов; доход — честно разведён на «в штате» и «через Ozon Job» */}
                                        <div className='flex row-flush scroll-anchor' id='city-data'>
                                            <div className='f-w-4 mb-20'>
                                                <div className='grid gap-12 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3'>
                                                    <div className='flex nowrap align-center gap-14'>
                                                        <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                                            <WarehouseSVG width={24} height={24} />
                                                        </span>
                                                        <p className='md-0 grid'>
                                                            <b className='city-stat-value font-w-700 color-2-90'>{stats.count}</b>
                                                            <span className='font-14'>{t('why.countLabel', { count: stats.count, city: city.name })}</span>
                                                        </p>
                                                    </div>
                                                    <span className='block h-4 br-36 bg-2-7 overflow-hidden' aria-hidden='true'>
                                                        <span className='block h-full br-36 bg-5-100' style={{ width: `${Math.max((stats.count / national.count) * 100, 2)}%` }} />
                                                    </span>
                                                    <div className='flex align-center justify-between gap-10 font-12'>
                                                        <span>{t('why.countShare', { count: stats.count, total: national.count })}</span>
                                                        <a href='#addresses' className='color-5-100 font-w-500'>{t('why.toAddresses')} ↓</a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='f-w-8 mb-20'>
                                                <div className='city-stat-accent grid gap-15 content-start h-full br-20 border-1px-2-10 pd-20'>
                                                    <div className='flex nowrap align-center gap-14'>
                                                        <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                                            <BarChartSVG width={24} height={24} />
                                                        </span>
                                                        <h3 className='font-22'>{t('why.incomeTitle')}</h3>
                                                    </div>

                                                    <div className='flex row-flush'>
                                                        {/* в штате: цифры career.ozon.ru при полном графике; если у складов только «от …» — диапазон */}
                                                        {income && (
                                                            <div className='f-w-5 grid gap-5 content-start'>
                                                                <span className='city-stat-tag inline-flex nowrap align-center gap-5 px-10 py-4 br-36 font-12 font-w-700 text-uppercase letter-s-6'>
                                                                    <FileDetailSVG width={14} height={14} viewBox='0 0 24 24' aria-hidden='true' />
                                                                    {t('why.staffTitle')}
                                                                </span>
                                                                <b className='city-stat-value font-w-700'>
                                                                    {stats.average
                                                                        ? t('why.averageValue', { value: stats.average })
                                                                        : t('why.fromValue', { value: stats.min ?? 0 })}
                                                                </b>
                                                                <span className='font-12'>{stats.average ? t('why.averageLabel') : t('why.incomeLabel')}</span>
                                                                {stats.average && (
                                                                    <>
                                                                        <span className='city-stat-chip inline-flex nowrap align-center px-10 py-4 br-36 font-12 font-w-700'>
                                                                            {compare}
                                                                        </span>
                                                                        <span className='font-12'>{t('why.averageNote', { national: national.average })}</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* через Ozon Job: оплата за слот — итог зависит от числа слотов, поэтому без «средней суммы» */}
                                                        <div className={`${income ? 'f-w-7 city-stat-job' : 'f-w-12'} grid gap-8 content-start`}>
                                                            <span className='city-stat-tag city-stat-tag-job inline-flex nowrap align-center gap-5 px-10 py-4 br-36 font-12 font-w-700 text-uppercase letter-s-6'>
                                                                <CalendarCheckSVG width={14} height={14} viewBox='0 0 24 24' aria-hidden='true' />
                                                                {t('why.jobTitle')}
                                                            </span>
                                                            <p className='md-0 font-14'>{t('why.jobText')}</p>
                                                            <ul className='grid gap-8'>
                                                                {JOB_SCENARIOS.map((slots, i) => (
                                                                    <li className='grid gap-5' key={slots}>
                                                                        <span className='flex nowrap justify-between gap-10 font-12'>
                                                                            <b className='space-nowrap'>{t('why.jobSlots', { count: slots })}</b>
                                                                            <span className='text_right'>{jobScenarios[i]}</span>
                                                                        </span>
                                                                        <span className='city-stat-track block h-4 br-36 overflow-hidden' aria-hidden='true'>
                                                                            <span className='city-stat-fill block h-full br-36' style={{ width: `${(slots / DAYS_IN_MONTH) * 100}%` }} />
                                                                        </span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <p className='md-0 font-12'>{t('why.jobNote')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* удобства (из вакансий в штат) + отметка, касается ли это Ozon Job */}
                                        <h3 className='font-22 color-2-90 mb-7 scroll-anchor' id='perks'>{t('perksTitle')}</h3>
                                        <p className='max-w-60-ch mb-20'>{t('perksLead')}</p>
                                        <ul className='flex row-flush'>
                                            {PERKS.map((perk) => {
                                                const Icon = PERK_ICONS[perk];
                                                const count = stats.perkCounts[perk];

                                                return (
                                                    <li className='f-w-3 f-h-6 mb-20' key={perk}>
                                                        <div
                                                            className={`grid gap-10 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3${count === 0 ? ' opacity-50' : ''}`}
                                                            style={accent(PERK_ACCENTS[perk])}
                                                        >
                                                            <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                                                <Icon width={24} height={24} />
                                                            </span>
                                                            <b className='font-16 color-2-90'>{t(`perks.${perk}`)}</b>
                                                            <span className='font-14'>{t(`perksNote.${perk}`)}</span>
                                                            <span className='accent-text font-12 font-w-700'>
                                                                {count > 0 ? t('perksCount', { count, total: stats.count }) : t('perksNone')}
                                                            </span>
                                                            <span className='block h-4 br-36 bg-2-7 overflow-hidden' aria-hidden='true'>
                                                                <span className='accent-fill block h-full br-36' style={{ width: `${(count / stats.count) * 100}%` }} />
                                                            </span>
                                                            <span
                                                                className='job-tone inline-flex nowrap align-center px-10 py-4 br-36 font-12 font-w-500'
                                                                style={accent(JOB_TONE_COLORS[PERK_JOB_TONE[perk]])}
                                                            >
                                                                {t(`perksJob.${perk}`)}
                                                            </span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        {/* адреса: первые VISIBLE_ADDRESSES сразу, остальные — под «Показать все» */}
                                        <h3 className='font-22 color-2-90 mb-7 scroll-anchor' id='addresses'>{t('warehousesTitle', values)}</h3>
                                        <p className='max-w-60-ch mb-20'>{t('addresses.lead')}</p>
                                        <ul className='flex row-flush'>
                                            {visibleAddresses.map((warehouse, i) => renderAddress(warehouse, i))}
                                        </ul>
                                        {moreAddresses.length > 0 && (
                                            <details className='city-more mb-20'>
                                                <summary className='flex nowrap align-center justify-center gap-8 h-46 px-24 br-36 bg-2-7 font-w-500 color-2-90 cursor-pointer mb-20'>
                                                    <span className='city-more-open'>{t('addresses.more', { count: city.warehouses.length })}</span>
                                                    <span className='city-more-less'>{t('addresses.less')}</span>
                                                    <ChevronDownSVG className='city-more-icon' width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                                </summary>
                                                <ul className='flex row-flush'>
                                                    {moreAddresses.map((warehouse, i) => renderAddress(warehouse, VISIBLE_ADDRESSES + i))}
                                                </ul>
                                            </details>
                                        )}

                                        {/* соседние города и районы с теми же складами — перелинковка страниц городов */}
                                        {related.length > 0 && (
                                            <div className='scroll-anchor mb-20' id='related'>
                                                <h3 className='font-22 color-2-90 mb-7'>{t('related.title')}</h3>
                                                <p className='max-w-60-ch mb-15'>{t('related.lead', { city: city.name })}</p>
                                                <ul className='flex gap-8'>
                                                    {related.map((item) => (
                                                        <li key={item.slug}>
                                                            <Link
                                                                href={`/sklad/${item.slug}`}
                                                                className='source-chip hover-none inline-flex nowrap align-center gap-5 h-36 px-16 br-36 font-12 font-w-500'
                                                            >
                                                                <LocationSVG width={14} height={14} viewBox='0 0 24 24' aria-hidden='true' />
                                                                {item.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className='flex nowrap align-center gap-14 bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3 mb-20 scroll-anchor' id='addresses'>
                                        <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                            <MapSVG width={24} height={24} />
                                        </span>
                                        <p className='md-0'>{t('warehousesEmpty')}</p>
                                    </div>
                                )}

                                <p className='color-2-80 font-12'>{t('disclaimer', { date: updatedAt })}</p>
                            </div>
                        </section>

                        {/* ── Что даёт подработка через Ozon Job + обязанности ───────────────────────────── */}
                        <section className='py-20 scroll-anchor' id='offers'>
                            <div className='container'>
                                <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('offer.eyebrow')}</p>
                                <h2 className='mb-7 color-2-90 text-balance'>{t('offer.title')}</h2>
                                <p className='max-w-60-ch mb-20'>{t('offer.lead')}</p>
                                <ul className='flex row-flush'>
                                    {OFFERS.map(({ key, icon: Icon, accent: color }) => (
                                        <li className='f-w-3 f-h-6 mb-20' key={key}>
                                            <div className='grid gap-10 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3 translate_0_5 tr-2' style={accent(color)}>
                                                <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                                    <Icon width={24} height={24} />
                                                </span>
                                                <h3 className='font-16 color-2-90'>{t(`offer.items.${key}.title`)}</h3>
                                                <p className='md-0 font-14'>{t(`offer.items.${key}.text`, { city: city.name })}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <p className='font-12 mb-20'>{t('offer.note')}</p>

                                <div className='scroll-anchor' id='duties'>
                                    <h3 className='font-22 color-2-90 mb-15'>{t('duty.title')}</h3>
                                    <ul className='flex row-flush'>
                                        {DUTIES.map(({ key, icon: Icon }) => (
                                            <li className='f-w-3 f-h-6 mb-20' key={key}>
                                                <div className='flex nowrap align-start gap-12 h-full br-20 bg-2-3 border-1px-2-10 pd-20'>
                                                    <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                                        <Icon width={24} height={24} />
                                                    </span>
                                                    <div className='grid gap-5'>
                                                        <b className='color-2-90'>{t(`duty.items.${key}.title`)}</b>
                                                        <span className='font-14'>{t(`duty.items.${key}.text`)}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </>
                }
            />
        </main>
    );
}
