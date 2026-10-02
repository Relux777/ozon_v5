import type { CSSProperties, ReactNode } from 'react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { Link } from '@/i18n/navigation';
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from '@/lib/seo';
import { PROMO } from '@/config/promo';
import {
    BANANAS,
    CANCEL_AFTER_START,
    CANCELLATION,
    EARLY_BOOKING,
    LEVEL_LOCALES,
    LEVELS,
    LOW_PRODUCTIVITY,
    NEWBIE_HOURS,
    POINTS_MAX,
    PRODUCTIVITY,
    RATING_CHECKED_AT,
    SLOTS_PER_BANANA,
    type Duration,
} from '@/config/rating';
import CopyCode from '@/components/ui/copy-code';
import FaqAccordion from '@/components/ui/faq-accordion';
import JsonLd from '@/components/ui/json-ld';
import PageNav from '@/components/PageNav';
import RatingCalculator from '@/components/RatingCalculator';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com). viewBox='0 0 24 24' — у иконок не родного размера
import CalendarCheckSVG from '@/assets/svg/sklad/calendar-check.svg';
import CreditCardSVG from '@/assets/svg/sklad/credit-card.svg';
import UserCheckSVG from '@/assets/svg/sklad/user-check.svg';
import InfoCircleSVG from '@/assets/svg/menu/info-circle.svg';
import CalendarXSVG from '@/assets/svg/level/calendar-x.svg';
import AlarmSVG from '@/assets/svg/level/alarm.svg';
import UserXSVG from '@/assets/svg/level/user-x.svg';
import TrendingUpSVG from '@/assets/svg/level/trending-up.svg';
import HistorySVG from '@/assets/svg/level/history.svg';
import DiamondSVG from '@/assets/svg/level/diamond.svg';
import CalculatorSVG from '@/assets/svg/level/calculator.svg';
import HourglassSVG from '@/assets/svg/level/hourglass.svg';

// Рейтинг Ozon Job: уровни (шкала + что даёт каждый), как начисляют и списывают баллы (таблицы с полосками),
// калькулятор баллов за слот, бананы и бан, советы, вопросы (FAQPage) с кодом Ozon Job, источники.
// Цифры — config/rating.ts (из приложения Ozon Job и справки), тексты — LevelPage.* (все 9 языков, см. LEVEL_LOCALES).

type Props = {
    params: Promise<{ locale: string }>;
};

type Titled = { title: string; text: string };

const DOCS_URL = 'https://docs.ozon.ru/job-ff-help';

// Разделы справки: подписи — Sources.* (все 9 языков), сами страницы справки только на русском
const SOURCES = [
    ['rating', `${DOCS_URL}/rating/rating/`],
    ['ban', `${DOCS_URL}/rating/ban/`],
    ['paymentSchedule', `${DOCS_URL}/payments/payout/payment-schedule/`],
] as const;

// Иконка и цвет советов — по порядку LevelPage.tips
const TIP_STYLE = [
    { icon: CalendarCheckSVG, accent: '#0ca678' },
    { icon: CalendarXSVG, accent: '#f76707' },
    { icon: UserXSVG, accent: '#e03131' },
    { icon: AlarmSVG, accent: '#7a5af8' },
    { icon: TrendingUpSVG, accent: '#005bff' },
    { icon: HistorySVG, accent: '#1c7ed6' },
];

const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

// «+200» / «−20»: настоящий минус, а не дефис
const signed = (n: number, suffix = '') => `${n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n)}${suffix}`;

// длина полоски в таблицах — доля от самого большого значения
const barWidth = (n: number, max = POINTS_MAX) => `${Math.round((Math.abs(n) / max) * 100)}%`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LevelPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/menu/level',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
        // языки, на которых страница переведена (остальные — noindex и без hreflang)
        locales: LEVEL_LOCALES,
    });
}

export default async function LevelPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LevelPage' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });
    const tMenu = await getTranslations({ locale, namespace: 'MenuPage' });
    const tSources = await getTranslations({ locale, namespace: 'Sources' });
    const format = await getFormatter({ locale });

    const checkedDate = format.dateTime(new Date(RATING_CHECKED_AT), { dateStyle: 'long' });
    // длительность передаём числом и единицей: фразу целиком («за 24 часа», «24 saatdan», «3 gündən») строит словарь
    const dur = ({ n, unit }: Duration) => ({ n, unit });
    const faq = t.raw('faq') as Titled[];
    const tips = t.raw('tips') as Titled[];

    const navItems = [
        { kicker: t('levelsEyebrow'), title: t('levelsTitle'), href: '#levels' },
        { kicker: t('pointsEyebrow'), title: t('pointsTitle'), href: '#points' },
        { kicker: t('calcEyebrow'), title: t('calcTitle'), href: '#calc' },
        { kicker: t('bansEyebrow'), title: t('bansTitle'), href: '#bans' },
        { kicker: t('tipsEyebrow'), title: t('tipsTitle'), href: '#tips' },
        { kicker: t('faqEyebrow'), title: t('faqTitle'), href: '#faq' },
    ];

    // строка таблицы: подпись, значение и полоска под ними (цвет — --accent карточки: зелёный/красный)
    const row = (label: string, value: string, width: string, extra?: ReactNode) => (
        <li className='grid gap-5' key={label}>
            <span className='flex nowrap justify-between align-center gap-10 font-14'>
                <span className='color-2-90'>
                    {label}
                    {extra ? ' ' : null}
                    {extra}
                </span>
                <b className='accent-text space-nowrap'>{value}</b>
            </span>
            <span className='block h-4 br-8 bg-2-7 overflow-hidden' aria-hidden='true'>
                <span className='accent-fill block h-4 br-8' style={{ width }} />
            </span>
        </li>
    );

    // заголовок блока внутри карточки таблиц + пояснение
    const tableHead = (title: string, note?: string) => (
        <div className='grid gap-2'>
            <h4 className='font-16 color-2-90'>{title}</h4>
            {note && <p className='md-0 font-12 color-2-80'>{note}</p>}
        </div>
    );

    const lowPoints = (id: (typeof LOW_PRODUCTIVITY)[number]['id']) => LOW_PRODUCTIVITY.find((item) => item.id === id)?.points ?? 0;

    return (
        <main>
            <JsonLd
                data={breadcrumbJsonLd(locale, [
                    { name: tNav('home'), href: '/' },
                    { name: tNav('menu'), href: '/menu' },
                    { name: tMenu('quick.level.title'), href: '/menu/level' },
                ])}
            />
            {/* вопросы на этой странице свои (не повторяют главную) — FAQPage здесь допустим */}
            <JsonLd data={faqJsonLd(locale, faq)} />
            <PageNav label={t('pageNavLabel')} items={navItems} />

            {/* первая секция «почти во весь экран» (style.scss) — вступление и уровни в ней вместе */}
            <section>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('eyebrow')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                    <p className='max-w-60-ch mb-15'>{t('lead')}</p>
                    <ul className='flex gap-8 mb-20'>
                        {(t.raw('facts') as string[]).map((fact) => (
                            <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500' key={fact}>
                                {fact}
                            </li>
                        ))}
                    </ul>

                    {/* ── Уровни: шкала как в приложении, у каждого шага — что он даёт ─────────────────── */}
                    <div className='scroll-anchor' id='levels'>
                        <h2 className='mb-7 color-2-90 text-balance'>{t('levelsTitle')}</h2>
                        <p className='max-w-60-ch mb-20'>{t('levelsLead')}</p>

                        <ol className='scale-grid grid gap-12 mb-15'>
                            {LEVELS.map((level) => {
                                const diamond = level.id === 'diamond';
                                const range = 'over' in level
                                    ? t('over', { points: signed(level.over).replace('+', '') })
                                    : t('upTo', { points: signed(level.upTo).replace('+', '') });

                                return (
                                    <li
                                        className={`grid gap-8 content-start br-20 pd-20 border-1px-2-10 ${diamond ? 'city-stat-accent' : 'bg-3-100 shadow-3'}`}
                                        style={accent(diamond ? '#ffffff' : level.color)}
                                        key={level.id}
                                    >
                                        <span className='accent-fill block h-4 br-8' aria-hidden='true' />
                                        <span className={`font-12 font-w-500${diamond ? '' : ' color-2-80'}`}>{range}</span>
                                        <h3 className={`offer-title flex nowrap align-center gap-8${diamond ? '' : ' color-2-90'}`}>
                                            {diamond && <DiamondSVG className='shrink-0' width={22} height={22} viewBox='0 0 24 24' aria-hidden='true' />}
                                            {t(`levels.${level.id}`)}
                                        </h3>
                                        <ul className='grid gap-7 font-14'>
                                            <li className='flex nowrap align-start gap-8'>
                                                <CalendarCheckSVG className='shrink-0 accent-text' width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                                {t('booking', dur(level.booking))}
                                            </li>
                                            <li className='flex nowrap align-start gap-8'>
                                                <CreditCardSVG className='shrink-0 accent-text' width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                                {t('payout', { hours: level.payoutHours })}
                                            </li>
                                            {diamond && (
                                                <li className='flex nowrap align-start gap-8'>
                                                    <HourglassSVG className='shrink-0' width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                                    {t('diamondExtra')}
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ol>

                        <div className='flex nowrap align-start gap-12 br-20 pd-15 bg-5-10 mb-15' style={accent('#005bff')}>
                            <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                <UserCheckSVG width={24} height={24} viewBox='0 0 24 24' />
                            </span>
                            <div className='grid gap-2'>
                                <h3 className='offer-title color-2-90'>{t('newbieTitle')}</h3>
                                <p className='md-0 font-14'>{t('newbieText', { hours: NEWBIE_HOURS })}</p>
                            </div>
                        </div>
                        <p className='font-12 max-w-60-ch'>{t('levelsNote')}</p>
                    </div>
                </div>
            </section>

            {/* ── Баллы: начисления и списания ──────────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='points'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('pointsEyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('pointsTitle')}</h2>
                    <p className='max-w-60-ch mb-15'>{t('pointsLead')}</p>

                    <div className='flex nowrap align-start gap-12 br-20 pd-15 bg-5-10 mb-20 max-w-60-ch' style={accent('#005bff')}>
                        <InfoCircleSVG className='shrink-0 accent-text' width={22} height={22} viewBox='0 0 24 24' aria-hidden='true' />
                        <p className='md-0 font-14'>
                            <b className='color-2-90'>{t('exampleTitle')}.</b> {t('exampleText')}
                        </p>
                    </div>

                    <div className='flex row-flush'>
                        {/* начисления — зелёные (.rating-plus задаёт --accent) */}
                        <div className='f-w-6 mb-20'>
                            <article className='rating-plus grid gap-15 content-start h-full br-20 pd-20 bg-3-100 border-1px-2-10 shadow-3' aria-labelledby='rating-plus-title'>
                                <header className='grid gap-2'>
                                    <h3 className='offer-title accent-text' id='rating-plus-title'>{t('accrualsTitle')}</h3>
                                    <p className='md-0 font-14'>{t('accrualsLead')}</p>
                                </header>
                                <div className='grid gap-10'>
                                    {tableHead(t('productivityTitle'), t('productivityNote'))}
                                    <ul className='grid gap-10'>
                                        {PRODUCTIVITY.map(({ pct, points }) =>
                                            row(t('productivityRow', { pct }), signed(points), barWidth(points)),
                                        )}
                                    </ul>
                                </div>
                                <div className='grid gap-10'>
                                    {tableHead(t('earlyTitle'), t('earlyNote'))}
                                    <ul className='grid gap-10'>
                                        {EARLY_BOOKING.map((item) =>
                                            row(
                                                t(item.less ? 'earlyLess' : 'earlyMore', dur(item)),
                                                signed(item.bonus, '%'),
                                                barWidth(item.bonus, 50),
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </article>
                        </div>

                        {/* списания — красные (.rating-minus) */}
                        <div className='f-w-6 mb-20'>
                            <article className='rating-minus grid gap-15 content-start h-full br-20 pd-20 bg-3-100 border-1px-2-10 shadow-3' aria-labelledby='rating-minus-title'>
                                <header className='grid gap-2'>
                                    <h3 className='offer-title accent-text' id='rating-minus-title'>{t('penaltiesTitle')}</h3>
                                    <p className='md-0 font-14'>{t('penaltiesLead')}</p>
                                </header>
                                <div className='grid gap-10'>
                                    {tableHead(t('lowTitle'))}
                                    <ul className='grid gap-10'>
                                        {LOW_PRODUCTIVITY.map(({ id, points }) =>
                                            row(
                                                t(`low.${id}`),
                                                signed(points),
                                                barWidth(points),
                                                id === 'noShow' ? (
                                                    <span className='inline-flex align-center px-10 h-20 br-36 bg-2-7 font-12 color-2-80 space-nowrap'>{t('bananaChip')} 🍌</span>
                                                ) : undefined,
                                            ),
                                        )}
                                    </ul>
                                </div>
                                <div className='grid gap-5'>
                                    {tableHead(t('lateTitle'))}
                                    <p className='md-0 font-14'>{t('lateText')}</p>
                                </div>
                                <div className='grid gap-10'>
                                    {tableHead(t('cancelTitle'), t('cancelNote'))}
                                    <ul className='grid gap-10'>
                                        {CANCELLATION.map((item) =>
                                            row(t('cancelRow', dur(item)), signed(item.points), barWidth(item.points)),
                                        )}
                                        {row(t('cancelStarted'), signed(CANCEL_AFTER_START), barWidth(CANCEL_AFTER_START))}
                                    </ul>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Калькулятор баллов за слот ───────────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='calc'>
                <div className='container'>
                    <div className='flex row-flush align-center'>
                        <div className='f-w-5 mb-20'>
                            <span className='icon-badge grid place-center w-46 h-46 br-round mb-15' style={accent('#005bff')} aria-hidden='true'>
                                <CalculatorSVG width={24} height={24} viewBox='0 0 24 24' />
                            </span>
                            <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('calcEyebrow')}</p>
                            <h2 className='mb-7 color-2-90 text-balance'>{t('calcTitle')}</h2>
                            <p className='max-w-60-ch mb-15'>{t('calcLead')}</p>
                            <p className='font-12 max-w-60-ch'>{t('calcHint')}</p>
                        </div>
                        <div className='f-w-7 mb-20'>
                            <div className='br-20 pd-20 bg-3-100 border-1px-2-10 shadow-3'>
                                <RatingCalculator
                                    locale={locale}
                                    productivity={[
                                        ...PRODUCTIVITY.map(({ pct, points }) => ({ label: `${pct}%`, value: points })),
                                        { label: t('calcLt20'), value: lowPoints('lt20') },
                                        { label: t('calcLt5'), value: lowPoints('lt5') },
                                    ]}
                                    early={EARLY_BOOKING.map((item) => ({
                                        label: t(item.less ? 'calcLess' : 'calcMore', dur(item)),
                                        value: item.bonus,
                                    }))}
                                    // по умолчанию: 100% и запись больше чем за 3 дня → +130
                                    defaultProductivity={1}
                                    defaultEarly={3}
                                    labels={{
                                        productivity: t('calcProductivity'),
                                        early: t('calcEarly'),
                                        result: t('calcResult'),
                                        formula: t.raw('calcFormula') as string,
                                        noBonus: t('calcNoBonus'),
                                        pointsForms: t.raw('pointsForms') as { other: string },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Бананы и бан ─────────────────────────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='bans'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('bansEyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('bansTitle')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('bansLead')}</p>

                    <ol className='scale-grid grid gap-12 mb-20'>
                        {BANANAS.map(({ count, id, color }) => (
                            <li className='grid gap-8 content-start br-20 pd-20 bg-3-100 border-1px-2-10 shadow-3' style={accent(color)} key={id}>
                                <span className='accent-fill block h-4 br-8' aria-hidden='true' />
                                <b className='font-24 color-2-90 space-nowrap'>{t('bananaCount', { count })}</b>
                                <span className='font-14 font-w-500 color-2-90'>{t(`bananas.${id}`)}</span>
                            </li>
                        ))}
                    </ol>

                    <div className='flex row-flush'>
                        <div className='f-w-4 f-h-6 mb-20'>
                            <div className='grid gap-10 content-start h-full br-20 pd-20 bg-3-100 border-1px-2-10'>
                                <h3 className='offer-title color-2-90'>{t('reasonsTitle')}</h3>
                                <ul className='checks-li grid gap-8 font-14'>
                                    {(t.raw('reasons') as string[]).map((reason) => (
                                        <li className='p-relative pl-30' key={reason}>{reason}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className='f-w-4 f-h-6 mb-20'>
                            <div className='grid gap-10 content-start h-full br-20 pd-20 bg-3-100 border-1px-2-10'>
                                <h3 className='offer-title color-2-90'>{t('removeTitle')}</h3>
                                <p className='md-0 font-14'>{t('removeText', { slots: SLOTS_PER_BANANA })}</p>
                            </div>
                        </div>
                        <div className='f-w-4 mb-20'>
                            <div className='grid gap-10 content-start h-full br-20 pd-20 bg-3-100 border-1px-2-10'>
                                <h3 className='offer-title color-2-90'>{t('bansFactsTitle')}</h3>
                                <ul className='checks-li grid gap-8 font-14'>
                                    {(t.raw('bansFacts') as string[]).map((fact) => (
                                        <li className='p-relative pl-30' key={fact}>{fact}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Советы ───────────────────────────────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='tips'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('tipsEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('tipsTitle')}</h2>
                    <ul className='flex row-flush'>
                        {tips.map((tip, i) => {
                            const { icon: Icon, accent: color } = TIP_STYLE[i % TIP_STYLE.length];

                            return (
                                <li className='f-w-4 f-h-6 mb-20' key={tip.title}>
                                    <article className='menu-card grid gap-10 content-start h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3' style={accent(color)}>
                                        <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                            <Icon width={24} height={24} viewBox='0 0 24 24' />
                                        </span>
                                        <h3 className='font-16 color-2-90'>{tip.title}</h3>
                                        <p className='md-0 font-14'>{tip.text}</p>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* ── Вопросы + код Ozon Job ──────────────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='faq'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('faqEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('faqTitle')}</h2>
                    <div className='flex row-flush'>
                        <div className='f-w-8 mb-20'>
                            <FaqAccordion items={faq} />
                        </div>
                        <div className='f-w-4 mb-20'>
                            <aside className='city-stat-accent grid gap-12 content-start br-20 border-1px-2-10 pd-20' aria-labelledby='level-cta-title'>
                                <p className='md-0 font-12 text-uppercase letter-s-8'>{t('ctaKicker')}</p>
                                <h3 className='offer-title' id='level-cta-title'>{t('ctaTitle')}</h3>
                                <p className='md-0 font-14'>{t('ctaText')}</p>
                                <p className='md-0 font-12 text-uppercase letter-s-8'>{t('ctaCodeLabel')}</p>
                                <CopyCode code={PROMO.code} copyLabel={t('ctaCopy')} copiedLabel={t('ctaCopied')} />
                                <Link href='/#promo' className='promo-btn hover-none flex align-center justify-center h-46 px-24 br-36 font-w-500'>
                                    {t('ctaLink')}
                                </Link>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Источники ───────────────────────────────────────────────────────────────────────── */}
            <section className='py-20'>
                <div className='container'>
                    <h2 className='menu-title mb-15 color-2-90'>{t('sourcesTitle')}</h2>
                    <ul className='flex gap-7 mb-15'>
                        {SOURCES.map(([key, href]) => (
                            <li key={href}>
                                <a href={href} hrefLang='ru' className='source-chip inline-flex nowrap align-center px-10 h-36 br-36 blur-3 touch-no-blur font-12 font-w-500' target='_blank' rel='nofollow noopener noreferrer'>
                                    {tSources(key)} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className='font-12 max-w-60-ch mb-15'>
                        {t('sourcesNote', { date: checkedDate })}
                        {locale !== 'ru' && <span className='block'>{tSources('ruHint')}</span>}
                    </p>
                    <p className='font-14'>
                        <Link href='/menu' className='color-5-100'>{t('backLink')}</Link>
                    </p>
                </div>
            </section>
        </main>
    );
}
