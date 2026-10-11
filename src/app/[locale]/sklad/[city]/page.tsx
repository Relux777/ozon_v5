import type { Metadata } from 'next';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { notFound } from 'next/navigation';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { PROMO } from '@/config/promo';
import {
    DATA_UPDATED_AT,
    PERKS,
    getCitiesWithWarehouses,
    getCity,
    getCityLocalities,
    getCityName,
    getCityStats,
    getNationalStats,
    getOzonCityUrl,
    getRelatedCities,
    type City,
    type Income,
    type Perk,
    type Warehouse,
} from '@/lib/sklad';
import Breadcrumbs from '@/components/ui/breadcrumbs';
import CopyLink from '@/components/ui/copy-link';
import FaqAccordion from '@/components/ui/faq-accordion';
import AppScreens, { APP_SCREENS_ID } from '@/components/AppScreens';
import Hero, { HERO_PRIMARY_BTN, HERO_SECONDARY_BTN } from '@/components/Hero';
import HomeSections, { getHomeNavItems, type HomeSection } from '@/components/HomeSections';
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
import ScanBarcodeSVG from '@/assets/svg/sklad/scan-barcode.svg';
import ScanSearchSVG from '@/assets/svg/sklad/scan-search.svg';
import PackageSVG from '@/assets/svg/sklad/package.svg';
import UserCheckSVG from '@/assets/svg/sklad/user-check.svg';
import MapSVG from '@/assets/svg/sklad/map.svg';
import CopySVG from '@/assets/svg/sklad/copy.svg';
import DirectionsSVG from '@/assets/svg/sklad/directions.svg';
import HelpCircleSVG from '@/assets/svg/menu/help-circle.svg';
import ChevronRightSVG from '@/assets/svg/menu/chevron-right.svg';
import GiftSVG from '@/assets/svg/sklad/gift.svg';
import HotSVG from '@/assets/svg/hot.svg';
// фото рядом с вопросами о городе (то же, что у советов на главной; webp 840×925)
import FaqPhoto from '@/assets/img/pg4.webp';
// иллюстрация «деньги» в крупной карточке выплат (#benefits); webp 1254×1254
import PayoutsPhoto from '@/assets/img/pg3.webp';
// подарок в карточке «Бонус по коду приглашения» — та же 3D-иконка, что в «Ozon в цифрах» (384 px)
import BonusPhoto from '@/assets/img/advantages/5.webp';

// Страница города: первый экран, блоки про склады ЭТОГО города (данные, удобства, адреса, вопросы с ответами по
// данным города, «штат или Ozon Job» с его цифрами), скриншоты приложения и только три общих раздела главной
// (шаги, код приглашения, Ozon Карта). Остальное общее — ссылками на главную (#more): так 585 страниц городов
// не дублируют главную. Данные вакансий в штат (career.ozon.ru) везде подписаны «в штате», условия Ozon Job —
// по job.ozon.ru и справке для исполнителей. Данные складов — lib/sklad.ts.

type Props = {
    params: Promise<{ locale: string; city: string }>;
};

type Svg = typeof WarehouseSVG;

// Сколько адресов видно сразу; остальные — под «Показать все адреса» (<details>, без JS)
const VISIBLE_ADDRESSES = 6;

// Сколько соседних городов видно сразу; остальные — под «Показать все города» (у Москвы их больше 80)
const VISIBLE_RELATED = 12;

// Сколько населённых пунктов перечислять в тексте; остальные — «и ещё N»
const VISIBLE_LOCALITIES = 6;

// Сценарии «сколько слотов в месяц» для блока дохода Ozon Job: доля полоски = слоты / 30 дней
const JOB_SCENARIOS = [5, 10, 20] as const;
const DAYS_IN_MONTH = 30;

// Общие разделы главной, которые остаются на странице города (остальные — ссылками в #more)
const SHARED_SECTIONS: readonly HomeSection[] = ['steps', 'promo', 'card'];

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

// «Штат или Ozon Job»: строки сравнения (тексты — CityPage.compare.*), иконка и цвет подписи строки
const COMPARE_ROWS = [
    { key: 'contract', icon: FileDetailSVG, accent: '#7a5af8' },
    { key: 'income', icon: BarChartSVG, accent: '#0ca678' },
    { key: 'schedule', icon: CalendarCheckSVG, accent: '#12b886' },
    { key: 'payouts', icon: CreditCardSVG, accent: '#005bff' },
    { key: 'perks', icon: BusSVG, accent: '#1c7ed6' },
    { key: 'start', icon: UserCheckSVG, accent: '#f76707' },
] as const;

// «Чем предстоит заниматься»: три процесса на складе по порядку (тексты — CityPage.duty.items.*);
// «Что понадобится» (duty.items.you) — отдельной полосой под ними
const DUTIES = [
    { key: 'scan', icon: ScanBarcodeSVG, accent: '#005bff' },
    { key: 'check', icon: ScanSearchSVG, accent: '#7a5af8' },
    { key: 'pack', icon: PackageSVG, accent: '#f76707' },
] as const;

// «Что даёт подработка»: карточки (тексты — CityPage.benefits.items.*), иконка, цвет и куда ведёт «Подробнее».
// Первая — крупная синяя (главное: деньги быстро), транспорт — с цифрами города
const BENEFITS = [
    { key: 'payouts', icon: CreditCardSVG, accent: '#005bff', href: '/#pay' },
    { key: 'schedule', icon: CalendarCheckSVG, accent: '#12b886', href: '#app' },
    { key: 'start', icon: BookOpenSVG, accent: '#7a5af8', href: '/#first-day' },
    { key: 'transport', icon: BusSVG, accent: '#1c7ed6', href: '#perks' },
    { key: 'online', icon: UserCheckSVG, accent: '#0ca678', href: '#steps' },
    { key: 'rating', icon: BarChartSVG, accent: '#f08c00', href: '/menu/level' },
    { key: 'tariffs', icon: HotSVG, accent: '#e03131', href: '#app' },
    { key: 'bonus', icon: GiftSVG, accent: '#e64980', href: '#promo' },
] as const;

// «Подробнее на главной» — те же карточки и тексты, что в меню (MenuPage.quick.*)
const MORE_LINKS = [
    { key: 'pay', href: '/#pay', icon: CreditCardSVG, accent: '#005bff' },
    { key: 'firstDay', href: '/#first-day', icon: FileDetailSVG, accent: '#f08c00' },
    { key: 'level', href: '/menu/level', icon: BarChartSVG, accent: '#0ca678' },
    { key: 'support', href: '/menu/support', icon: HelpCircleSVG, accent: '#12b886' },
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

type Translator = Awaited<ReturnType<typeof getTranslations<'CityPage'>>>;

/** «от 90 000 до 160 000 ₽/мес», «до 126 000 ₽/мес» или «от 149 000 ₽/мес» */
function incomeLabel(t: Translator, { from, to }: Income) {
    if (from && to) return t('incomeRange', { from, to });
    if (to) return t('incomeUpTo', { to });
    if (from) return t('incomeFrom', { from });
    return '';
}

/**
 * Как город называется в тексте: «г. Казань» / «Qozon sh.» / «Kazan»; у регионов — без «г.» («Московская область»).
 * city — название на языке страницы (латиницей на en/uz/az), place — с пометкой «город» для городов
 */
function cityLabels(t: Translator, city: City, locale: string) {
    const name = getCityName(city, locale);
    return { city: name, place: city.region ? name : t('cityPlace', { city: name }) };
}

/** «с. Новая Тура (Зеленодольский р-н), с. Столбище и пос. Шушары»; длинный список — первые N «и ещё M» */
function listLocalities(t: Translator, locale: string, localities: string[]) {
    const list = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });
    if (localities.length <= VISIBLE_LOCALITIES) return list.format(localities);
    const rest = localities.length - (VISIBLE_LOCALITIES - 1);
    return list.format([...localities.slice(0, VISIBLE_LOCALITIES - 1), t('localitiesMore', { count: rest })]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const city = await resolveCity(params);
    const stats = getCityStats(city);

    const t = await getTranslations({ locale, namespace: 'CityPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    const income = incomeLabel(t, { from: stats?.min, to: stats?.max });
    const values = { ...cityLabels(t, city, locale), income };

    return buildPageMetadata({
        locale,
        href: `/sklad/${city.slug}`,
        title: stats ? t('titleWithData', values) : t('titleNoData', values),
        description: stats ? t('descriptionWithData', values) : t('descriptionNoData', values),
        siteName: tMeta('siteName'),
        absoluteTitle: true,
        // без адресов страница почти не отличается от соседних — не индексируем, пока нет данных
        noindex: !stats,
        // превью для соцсетей — своё у каждого города (opengraph-image.tsx рядом)
        ownImage: true,
    });
}

export default async function CityPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const city = await resolveCity(params);
    const stats = getCityStats(city);
    const national = getNationalStats();
    const related = getRelatedCities(city);

    const t = await getTranslations({ locale, namespace: 'CityPage' });
    const tHome = await getTranslations({ locale, namespace: 'HomePage' });
    const tMenu = await getTranslations({ locale, namespace: 'MenuPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });
    const tApp = await getTranslations({ locale, namespace: 'AppScreens' });
    const format = await getFormatter({ locale });

    const { city: name, place } = cityLabels(t, city, locale);
    const income = incomeLabel(t, { from: stats?.min, to: stats?.max });
    const values = { city: name, place, income };
    const updatedAt = format.dateTime(new Date(DATA_UPDATED_AT), { dateStyle: 'long' });
    const officialUrl = getOzonCityUrl(city);
    const jobScenarios = t.raw('why.jobScenarios') as string[];

    // где склады: населённые пункты из адресов; отдельно — склады с транспортом (для ответа «есть ли развозка»)
    const localities = listLocalities(t, locale, getCityLocalities(city));
    const transportLocalities = listLocalities(
        t,
        locale,
        getCityLocalities({ ...city, warehouses: city.warehouses.filter((w) => w.perks.includes('transport')) }),
    );

    // средний доход в штате по городу против среднего по всей базе; разница в пределах ±2% — «на уровне среднего»
    const diff = stats?.average ? Math.round((stats.average / national.average - 1) * 100) : 0;
    const compare =
        diff >= 2 ? t('why.above', { percent: diff }) : diff <= -2 ? t('why.below', { percent: -diff }) : t('why.equal');

    // первый экран: факты именно этого города (без данных — общие преимущества с главной)
    const heroFacts = stats
        ? [
              t('heroFacts.count', { count: stats.count }),
              ...(income ? [t('heroFacts.income', { income })] : []),
              ...(stats.perkCounts.transport > 0 ? [t('heroFacts.transport', { count: stats.perkCounts.transport, total: stats.count })] : []),
              t('heroFacts.job'),
              t('heroFacts.bonus', { amount: PROMO.userBonus }),
          ]
        : (tHome.raw('features') as string[]);

    // вопросы и ответы по городу — ответы собраны из его данных (поэтому на каждой странице свои)
    const faq = stats
        ? [
              { title: t('faq.where.q', values), text: t('faq.where.a', { count: stats.count, localities }) },
              { title: t('faq.pay.q', values), text: income ? t('faq.pay.aStaff', { income, date: updatedAt }) : t('faq.pay.aJob') },
              {
                  title: t('faq.transport.q', values),
                  text:
                      stats.perkCounts.transport > 0
                          ? t('faq.transport.aYes', { count: stats.perkCounts.transport, total: stats.count, list: transportLocalities })
                          : t('faq.transport.aNo'),
              },
              {
                  title: t('faq.meal.q', values),
                  text: stats.perkCounts.meal > 0 ? t('faq.meal.aYes', { count: stats.perkCounts.meal, total: stats.count }) : t('faq.meal.aNo'),
              },
              { title: t('faq.start.q', values), text: t('faq.start.a') },
          ]
        : [];

    // «Штат или Ozon Job»: колонка штата — цифры города, колонка Ozon Job — общие условия
    const compareStaff: Record<(typeof COMPARE_ROWS)[number]['key'], string> = {
        contract: t('compare.contract.staff'),
        income: income ? t('compare.income.staff', { income }) : t('compare.income.staffNone'),
        schedule: t('compare.schedule.staff'),
        payouts: t('compare.payouts.staff'),
        perks: stats
            ? t('compare.perks.staff', {
                  transport: stats.perkCounts.transport,
                  meal: stats.perkCounts.meal,
                  dms: stats.perkCounts.dms,
                  total: stats.count,
              })
            : t('compare.perks.staffNone'),
        start: t('compare.start.staff'),
    };

    // «Что даёт подработка»: транспорт — с цифрами города (или без них, если в вакансиях не указан), бонус — из config/promo
    const transportCount = stats?.perkCounts.transport ?? 0;
    const benefitCopy = (key: (typeof BENEFITS)[number]['key']) => {
        if (key === 'transport' && stats && transportCount > 0) {
            return {
                title: t('benefits.items.transport.title', { count: transportCount, total: stats.count }),
                text: t('benefits.items.transport.text', { ...values, count: transportCount, total: stats.count }),
            };
        }
        if (key === 'transport') return { title: t('benefits.items.transport.titleNone'), text: t('benefits.items.transport.textNone') };
        if (key === 'bonus') return { title: t('benefits.items.bonus.title'), text: t('benefits.items.bonus.text', { amount: PROMO.userBonus }) };
        return { title: t(`benefits.items.${key}.title`), text: t(`benefits.items.${key}.text`) };
    };

    const jsonLd = breadcrumbJsonLd(locale, [
        { name: tNav('home'), href: '/' },
        { name: tNav('warehouses'), href: '/sklad' },
        { name, href: `/sklad/${city.slug}` },
    ]);

    // ── Модалка быстрой навигации: справка по городу + пункты по порядку страницы ───────────────
    const cityNav: PageNavItem[] = [
        {
            kicker: t('why.eyebrow', values),
            title: t('why.title', values),
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
        ...(await getHomeNavItems(locale, ['stats'])),
        { kicker: t('benefits.eyebrow'), title: t('benefits.title', values), href: '#benefits' },
        ...(stats ? [{ kicker: t('faq.eyebrow'), title: t('faq.title', values), href: '#city-faq' }] : []),
        {
            kicker: t('compare.eyebrow'),
            title: t('compare.title'),
            href: '#compare',
            links: [{ label: t('duty.title'), href: '#duties' }],
        },
        { kicker: tApp('eyebrow'), title: tApp('title'), href: `#${APP_SCREENS_ID}` },
    ];
    const navItems = [
        ...cityNav,
        ...(await getHomeNavItems(locale, SHARED_SECTIONS)),
        { kicker: t('more.eyebrow'), title: t('more.title'), href: '#more' },
    ];

    const navExtras: PageNavExtra[] = [
        {
            label: t('nav.official', values),
            href: officialUrl,
            external: true,
            icon: <WarehouseSVG width={18} height={18} viewBox='0 0 24 24' />,
        },
        { label: t('allCities'), href: '/sklad', icon: <MapSVG width={18} height={18} viewBox='0 0 24 24' /> },
    ];

    const navSummary = (
        <div className='city-summary grid gap-10 br-20 pd-20 mb-20'>
            <p className='font-12 text-uppercase letter-s-8'>{t('nav.summaryKicker', values)}</p>
            {stats ? (
                <>
                    <p className='font-18'>
                        <b className='font-22'>{stats.count}</b> {t('why.countLabel', { ...values, count: stats.count })}
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
                        className='inline-flex nowrap align-center gap-5 h-36 px-16 br-36 bg-5-10 hover-none font-12 font-w-500 color-5-100 active_scale_09'
                    >
                        <DirectionsSVG width={16} height={16} viewBox='0 0 24 24' aria-hidden='true' />
                        {t('addresses.map')}
                        {/* полное описание — только для скринридеров и после видимой подписи: доступное имя ссылки
                            должно начинаться с того, что написано на кнопке (WCAG 2.5.3, голосовое управление) */}
                        <span className='sr-only'> — {t('addresses.mapLabel', { address: warehouse.fullAddress })}</span>
                    </a>
                </div>
            </article>
        </li>
    );

    // чип-ссылка на соседний город (те же склады показываются и на его странице)
    const renderRelated = (item: City) => (
        <li key={item.slug}>
            <Link href={`/sklad/${item.slug}`} className='source-chip hover-none inline-flex nowrap align-center gap-5 h-36 px-16 br-36 font-12 font-w-500'>
                <LocationSVG width={14} height={14} viewBox='0 0 24 24' aria-hidden='true' />
                {getCityName(item, locale)}
            </Link>
        </li>
    );

    const visibleAddresses = city.warehouses.slice(0, VISIBLE_ADDRESSES);
    const moreAddresses = city.warehouses.slice(VISIBLE_ADDRESSES);

    return (
        <main>
            <JsonLd data={jsonLd} />
            <PageNav label={tHome('pageNavLabel')} items={navItems} summary={navSummary} extrasTitle={t('nav.extrasTitle')} extras={navExtras} />

            <Hero
                top={
                    <Breadcrumbs
                        items={[
                            { label: tNav('home'), href: '/' },
                            { label: tNav('warehouses'), href: '/sklad' },
                            { label: name },
                        ]}
                    />
                }
                kicker={t('heroKicker', values)}
                heading={t('heading', { ...values, site: tMeta('siteName') })}
                lead={stats ? t('leadWithData', values) : t('leadNoData', values)}
                features={heroFacts}
                imageAlt={tHome('imageAlt.hero')}
                actions={
                    <>
                        {stats ? (
                            <a href='#addresses' className={HERO_PRIMARY_BTN}>
                                {t('heroAddresses')}
                            </a>
                        ) : (
                            <Link href='/sklad' className={HERO_PRIMARY_BTN}>
                                {t('allCities')}
                            </Link>
                        )}
                        {/* без суммы: бонус новичку зависит от склада первой записи, см. #promo */}
                        <a href='#promo' className={HERO_SECONDARY_BTN}>
                            {t('heroBonus')}
                        </a>
                    </>
                }
            />

            {/* ── Склады города: обзор, наши данные, удобства, адреса, соседние города ─────────────── */}
            <section className='py-20 scroll-anchor' id='city'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('why.eyebrow', values)}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('why.title', values)}</h2>
                    {stats && <p className='max-w-60-ch mb-7 color-2-90'>{t('overview', { ...values, count: stats.count, localities })}</p>}
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
                                                <span className='font-14'>{t('why.countLabel', { ...values, count: stats.count })}</span>
                                            </p>
                                        </div>
                                        <span className='block h-4 br-36 bg-2-7 overflow-hidden' aria-hidden='true'>
                                            <span className='block h-full br-36 bg-5-100' style={{ width: `${Math.max((stats.count / national.count) * 100, 2)}%` }} />
                                        </span>
                                        <div className='flex align-center justify-between gap-10 font-12'>
                                            <span>{t('why.countShare', { count: stats.count, total: national.count })}</span>
                                            <a href='#addresses' className='color-5-100 font-w-500'>
                                                {t('why.toAddresses')} ↓
                                            </a>
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
                                                        {stats.average ? t('why.averageValue', { value: stats.average }) : t('why.fromValue', { value: stats.min ?? 0 })}
                                                    </b>
                                                    <span className='font-12'>{stats.average ? t('why.averageLabel') : t('why.incomeLabel')}</span>
                                                    {stats.average && (
                                                        <>
                                                            <span className='city-stat-chip inline-flex nowrap align-center px-10 py-4 br-36 font-12 font-w-700'>{compare}</span>
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
                            <h3 className='font-22 color-2-90 mb-7 scroll-anchor' id='perks'>
                                {t('perksTitle')}
                            </h3>
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
                            <h3 className='font-22 color-2-90 mb-7 scroll-anchor' id='addresses'>
                                {t('warehousesTitle', values)}
                            </h3>
                            <p className='max-w-60-ch mb-20'>{t('addresses.lead')}</p>
                            <ul className='flex row-flush'>{visibleAddresses.map((warehouse, i) => renderAddress(warehouse, i))}</ul>
                            {moreAddresses.length > 0 && (
                                <details className='city-more mb-20'>
                                    <summary className='flex nowrap align-center justify-center gap-8 h-46 px-24 br-36 bg-2-7 font-w-500 color-2-90 cursor-pointer mb-20'>
                                        <span className='city-more-open'>{t('addresses.more', { count: city.warehouses.length })}</span>
                                        <span className='city-more-less'>{t('addresses.less')}</span>
                                        <ChevronDownSVG className='city-more-icon' width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                    </summary>
                                    <ul className='flex row-flush'>{moreAddresses.map((warehouse, i) => renderAddress(warehouse, VISIBLE_ADDRESSES + i))}</ul>
                                </details>
                            )}

                            {/* соседние города и районы с теми же складами — перелинковка страниц городов */}
                            {related.length > 0 && (
                                <div className='scroll-anchor mb-20' id='related'>
                                    <h3 className='font-22 color-2-90 mb-7'>{t('related.title')}</h3>
                                    <p className='max-w-60-ch mb-15'>{t('related.lead')}</p>
                                    <ul className='flex gap-8'>{related.slice(0, VISIBLE_RELATED).map(renderRelated)}</ul>
                                    {related.length > VISIBLE_RELATED && (
                                        <details className='city-more mt-15'>
                                            <summary className='flex nowrap align-center justify-center gap-8 h-46 px-24 br-36 bg-2-7 font-w-500 color-2-90 cursor-pointer mb-15'>
                                                <span className='city-more-open'>{t('related.more', { count: related.length })}</span>
                                                <span className='city-more-less'>{t('addresses.less')}</span>
                                                <ChevronDownSVG className='city-more-icon' width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                            </summary>
                                            <ul className='flex gap-8'>{related.slice(VISIBLE_RELATED).map(renderRelated)}</ul>
                                        </details>
                                    )}
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

            {/* ── «Ozon в цифрах — почему стоит работать в Ozon»: тот же блок, что на главной ──────────── */}
            <HomeSections locale={locale} sections={['stats']} />

            {/* ── Что даёт подработка через Ozon Job: коротко по пунктам, транспорт — по данным города ── */}
            <section className='py-20 scroll-anchor' id='benefits'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('benefits.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('benefits.title', values)}</h2>
                    <p className='max-w-60-ch mb-20'>{t('benefits.lead')}</p>

                    <ul className='benefits grid gap-15'>
                        {BENEFITS.map(({ key, icon: Icon, accent: color, href }) => {
                            const { title, text } = benefitCopy(key);
                            // без адресов в базе блока «удобства» на странице нет — транспорт ведёт к скриншотам приложения
                            const target = key === 'transport' && !stats ? `#${APP_SCREENS_ID}` : href;
                            const internal = target.startsWith('/');
                            const linkClass = 'benefit-link inline-flex nowrap align-center gap-5 font-14 font-w-500 hover-none';
                            const linkBody = (
                                <>
                                    {t('benefits.more')}
                                    <span className='sr-only'>: {title}</span>
                                    <ChevronRightSVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                </>
                            );

                            return (
                                <li className={`benefit benefit-${key} p-relative grid gap-10 content-start pd-20 br-20 border-1px-2-10 shadow-3`} style={accent(color)} key={key}>
                                    <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                        <Icon width={24} height={24} viewBox='0 0 24 24' />
                                    </span>
                                    {key === 'payouts' && (
                                        <Image className='benefit-photo p-absolute' src={PayoutsPhoto} alt='' sizes='(max-width: 620px) 60vw, 300px' />
                                    )}
                                    {key === 'bonus' && <Image className='benefit-gift p-absolute none-max-620' src={BonusPhoto} alt='' sizes='120px' />}
                                    <h3 className='benefit-title'>{title}</h3>
                                    <p className='md-0 font-14'>{text}</p>
                                    {internal ? (
                                        <Link href={target} className={linkClass}>
                                            {linkBody}
                                        </Link>
                                    ) : (
                                        <a href={target} className={linkClass}>
                                            {linkBody}
                                        </a>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                    <p className='font-12 mt-15'>{t('benefits.note')}</p>
                </div>
            </section>

            {/* ── Вопросы о складах города: ответы — из данных этого города ─────────────────────────── */}
            {stats && (
                <section className='py-20 scroll-anchor' id='city-faq'>
                    <div className='container'>
                        <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('faq.eyebrow')}</p>
                        <h2 className='mb-20 color-2-90 text-balance'>{t('faq.title', values)}</h2>
                        <div className='flex row-flush'>
                            <div className='f-w-8'>
                                <FaqAccordion items={faq} idPrefix='city-q' />
                            </div>
                            {/* фото — декоративное (alt пустой), на телефоне и планшете не показываем: вопросы важнее */}
                            <div className='f-w-4 none-max-990'>
                                <div className='faq-photo p-sticky'>
                                    <Image src={FaqPhoto} alt='' sizes='(max-width: 1200px) 30vw, 380px' className='block w-full h-full' />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Штат или Ozon Job: сравнение с цифрами города + чем предстоит заниматься ──────────── */}
            <section className='py-20 scroll-anchor' id='compare'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('compare.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('compare.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('compare.lead', values)}</p>

                    {/* настоящая таблица (строка — признак, столбцы — штат и Ozon Job); на телефоне строки складываются
                        в карточки: признак сверху, два значения рядом с подписями столбцов (.compare-tag) — см. style.scss */}
                    <div className='bg-3-100 br-20 border-1px-2-10 shadow-3 overflow-hidden mb-15'>
                        <table className='compare w-full font-14'>
                            <caption className='sr-only'>{t('compare.title')}</caption>
                            <thead className='font-12 font-w-700 text-uppercase letter-s-6'>
                                <tr>
                                    <th scope='col'>
                                        <span className='sr-only'>{t('compare.rowLabel')}</span>
                                    </th>
                                    <th scope='col' className='color-2-90'>
                                        {t('compare.staff')}
                                    </th>
                                    <th scope='col' className='color-5-100'>
                                        {t('compare.job')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {COMPARE_ROWS.map(({ key, icon: Icon, accent: color }) => (
                                    <tr key={key}>
                                        <th scope='row' className='font-w-500 color-2-90' style={accent(color)}>
                                            <span className='flex nowrap align-center gap-8'>
                                                <span className='icon-badge grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                                                    <Icon width={18} height={18} viewBox='0 0 24 24' />
                                                </span>
                                                {t(`compare.${key}.label`)}
                                            </span>
                                        </th>
                                        <td>
                                            <span className='compare-tag block font-12 color-2-80' aria-hidden='true'>
                                                {t('compare.staff')}
                                            </span>
                                            {compareStaff[key]}
                                        </td>
                                        <td className='compare-job'>
                                            <span className='compare-tag block font-12 color-5-100' aria-hidden='true'>
                                                {t('compare.job')}
                                            </span>
                                            {t(`compare.${key}.job`)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className='font-12 mb-20'>{t('compare.note')}</p>

                    <div className='scroll-anchor' id='duties'>
                        <h3 className='font-22 color-2-90 mb-7'>{t('duty.title')}</h3>
                        <p className='max-w-60-ch mb-15'>{t('duty.lead')}</p>

                        {/* три процесса по порядку: номер, иконка, между карточками — стрелка (style.scss, .duty-flow) */}
                        <ol className='duty-flow grid gap-15 mb-15'>
                            {DUTIES.map(({ key, icon: Icon, accent: color }, i) => (
                                <li className='duty-step p-relative grid gap-10 content-start pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3' style={accent(color)} key={key}>
                                    <div className='flex nowrap align-center justify-between gap-10'>
                                        <span className='duty-icon grid place-center w-46 h-46' aria-hidden='true'>
                                            <Icon width={24} height={24} viewBox='0 0 24 24' />
                                        </span>
                                        <span className='duty-num accent-text font-w-700' aria-hidden='true'>
                                            {String(i + 1).padStart(2, '0')}
                                        </span>
                                    </div>
                                    <b className='font-16 color-2-90'>{t(`duty.items.${key}.title`)}</b>
                                    <span className='font-14'>{t(`duty.items.${key}.text`)}</span>
                                </li>
                            ))}
                        </ol>

                        {/* что понадобится — полоса-памятка со ссылкой на документы первого дня */}
                        <div className='duty-you flex nowrap align-center gap-15 pd-20 br-20 mb-20'>
                            <span className='duty-you-icon grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                <UserCheckSVG width={24} height={24} viewBox='0 0 24 24' />
                            </span>
                            <div className='grid gap-2 flex-1'>
                                <b className='font-16 color-2-90'>{t('duty.items.you.title')}</b>
                                <span className='font-14'>{t('duty.items.you.text')}</span>
                            </div>
                            <Link href='/#first-day' className='benefit-link inline-flex nowrap align-center gap-5 font-14 font-w-500 hover-none shrink-0 m-none'>
                                {tMenu('quick.firstDay.title')}
                                <ChevronRightSVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Скриншоты приложения Ozon Job: слайдер + просмотр крупно ───────────────────────────── */}
            <AppScreens locale={locale} />

            {/* ── Из главной — только шаги, код приглашения и Ozon Карта (остальное — ссылками ниже) ─── */}
            <HomeSections locale={locale} sections={SHARED_SECTIONS} />

            {/* ── Подробнее на главной и в разделах: выплаты, документы, рейтинг, вопросы ─────────────── */}
            <section className='py-20 scroll-anchor' id='more'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('more.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('more.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('more.lead')}</p>
                    {/* ссылки строками: иконка, заголовок цветом ссылки, стрелка в кружке — сразу видно, что это переходы */}
                    <ul className='link-rows grid gap-10'>
                        {MORE_LINKS.map(({ key, href, icon: Icon, accent: color }) => (
                            <li key={key}>
                                <Link href={href} className='link-row hover-line-group hover-none flex nowrap align-center gap-15 h-full pd-15 br-20 bg-3-100 border-1px-2-10' style={accent(color)}>
                                    <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                        <Icon width={24} height={24} viewBox='0 0 24 24' />
                                    </span>
                                    <span className='grid gap-2 flex-1'>
                                        <b className='link-row-title font-16'>
                                            <span className='hover-line'>{tMenu(`quick.${key}.title`)}</span>
                                        </b>
                                        <span className='font-14 color-2-80'>{tMenu(`quick.${key}.text`)}</span>
                                    </span>
                                    <span className='link-row-arrow grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                                        <ChevronRightSVG width={20} height={20} viewBox='0 0 24 24' />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
}
