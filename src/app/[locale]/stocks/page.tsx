import { Fragment, type CSSProperties } from 'react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { Link } from '@/i18n/navigation';
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from '@/lib/seo';
import { PROMO } from '@/config/promo';
import { REFERRALS, REFERRALS_CHECKED_AT, STOCKS_LOCALES, type ReferralId } from '@/config/referrals';
import CopyCode from '@/components/CopyCode';
import CopyLink from '@/components/CopyLink';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import PageNav from '@/components/PageNav';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com). viewBox='0 0 24 24' — у иконок не родного размера
import CreditCardSVG from '@/assets/svg/sklad/credit-card.svg';
import CreditCardFrontSVG from '@/assets/svg/stocks/credit-card-front.svg';
import CrownSVG from '@/assets/svg/stocks/crown.svg';
import WalletSVG from '@/assets/svg/stocks/wallet.svg';
import HomeHeartSVG from '@/assets/svg/stocks/home-heart.svg';
import StoreSVG from '@/assets/svg/stocks/store.svg';
import BankSVG from '@/assets/svg/stocks/bank.svg';
import MegaphoneSVG from '@/assets/svg/menu/megaphone.svg';
import CopySVG from '@/assets/svg/sklad/copy.svg';
import ArrowUpRightSVG from '@/assets/svg/menu/arrow-up-right.svg';
import ChevronDownSVG from '@/assets/svg/chevron-down.svg';

// «Акции»: приглашения Ozon Банка («Приведи друга») — сетка с фильтром «Для себя / Для бизнеса» (радио + :has(), без JS);
// «Заработок» — код Ozon Job и Ozon Blogger; как это работает; вопросы (FAQPage) с раскрытием рекламы рядом.
// Ссылки и категории — config/referrals.ts, тексты — StocksPage.* (все 7 языков, см. STOCKS_LOCALES), иконки и цвета — здесь.

type Props = {
    params: Promise<{ locale: string }>;
};

type Svg = typeof CreditCardSVG;
type Titled = { title: string; text: string };
type Offer = (typeof REFERRALS)[number];

// Иконка и цвет (--accent для .icon-badge и подложки «Вы получите») каждой программы
const OFFER_STYLE: Record<ReferralId, { icon: Svg; accent: string }> = {
    debit: { icon: CreditCardSVG, accent: '#005bff' },
    credit: { icon: CreditCardFrontSVG, accent: '#7a5af8' },
    premium: { icon: CrownSVG, accent: '#f08c00' },
    salary: { icon: WalletSVG, accent: '#0ca678' },
    pension: { icon: HomeHeartSVG, accent: '#e64980' },
    bizReg: { icon: StoreSVG, accent: '#1c7ed6' },
    bizAccount: { icon: BankSVG, accent: '#f76707' },
    blogger: { icon: MegaphoneSVG, accent: '#e64980' },
};

// Кнопки фильтра; id радио используются в style.scss (.offers:has(#offer-filter-…:checked))
const FILTERS = ['all', 'personal', 'business'] as const;

// Продукты банка — в сетке с фильтром; программы заработка — отдельной секцией рядом с кодом Ozon Job
const BANK_OFFERS = REFERRALS.filter((offer) => offer.category !== 'earn');
const EARN_OFFERS = REFERRALS.filter((offer) => offer.category === 'earn');

// Ширина карточек банка на десктопе: первые 3 — по трети ряда, остальные — по половине. 7 программ = 3 + 2 + 2,
// без одинокой карточки в последнем ряду — и при «Все», и при каждом фильтре (для себя 3 + 2, для бизнеса 2).
// Добавите программу банка — пересчитайте, чтобы ряды снова заполнялись
const NARROW_COUNT = 3;

const HELP_URL = 'https://help-bank.ozon.ru/individuals/bonuses-and-promotions/referral';
const BLOGGER_TERMS_URL = 'https://docs.ozon.ru/legal/partners/bloggers/';

const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'StocksPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/stocks',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
        // языки, на которых страница переведена (остальные — noindex и без hreflang)
        locales: STOCKS_LOCALES,
    });
}

export default async function StocksPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'StocksPage' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });
    const format = await getFormatter({ locale });

    const checkedDate = format.dateTime(new Date(REFERRALS_CHECKED_AT), { dateStyle: 'long' });
    const how = t.raw('how') as Titled[];
    const faq = t.raw('faq') as Titled[];
    const counts = {
        all: BANK_OFFERS.length,
        personal: BANK_OFFERS.filter((offer) => offer.category === 'personal').length,
        business: BANK_OFFERS.filter((offer) => offer.category === 'business').length,
    };

    // оглавление плавающей кнопки: каждая программа банка, «Заработок» (с под-ссылками), «Как это работает», «Вопросы»
    const navItems = [
        ...BANK_OFFERS.map(({ id, category }) => ({
            kicker: t(`filters.${category}`),
            title: t(`offers.${id}.name`),
            href: `#offer-${id}`,
        })),
        {
            kicker: t('earnEyebrow'),
            title: t('earnTitle'),
            href: '#earn',
            links: [
                { label: 'Ozon Job', href: '#earn-job' },
                ...EARN_OFFERS.map(({ id }) => ({ label: t(`offers.${id}.name`), href: `#offer-${id}` })),
            ],
        },
        { kicker: t('howEyebrow'), title: t('howTitle'), href: '#how' },
        { kicker: t('faqEyebrow'), title: t('faqTitle'), href: '#faq' },
    ];

    // Карточка программы: шапка, «Вы получите», плюсы, шаги (<details>), кнопки, рекламодатель.
    // Heading: в сетке банка карточки идут сразу под h1 (h2), в секции «Заработок» — под её h2 (h3)
    const renderOffer = ({ id, category, advertiser, url, erid }: Offer, width: string, Heading: 'h2' | 'h3') => {
        const { icon: Icon, accent: color } = OFFER_STYLE[id];
        const name = t(`offers.${id}.name`);
        const perks = t.raw(`offers.${id}.perks`) as string[];
        const steps = t.raw(`offers.${id}.steps`) as string[];

        return (
            <li className={`scroll-anchor ${width} mb-20`} data-cat={category} id={`offer-${id}`} key={id}>
                <article
                    className='offer-card grid gap-12 h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3'
                    style={accent(color)}
                    aria-labelledby={`offer-${id}-name`}
                >
                    <header className='flex nowrap align-center gap-12'>
                        <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                            <Icon width={24} height={24} viewBox='0 0 24 24' />
                        </span>
                        <div className='grid gap-2 flex-1'>
                            <p className='md-0 font-12 color-2-80'>{t(`offers.${id}.kicker`)}</p>
                            <Heading className='offer-title color-2-90' id={`offer-${id}-name`}>{name}</Heading>
                        </div>
                        {/* пометка «Реклама» — на виду, у заголовка, а не только мелким шрифтом внизу */}
                        <span className='shrink-0 inline-flex align-center px-10 h-20 br-36 bg-2-7 font-12 color-2-80'>{t('ad')}</span>
                    </header>

                    <p className='offer-benefit md-0 grid gap-2 pd-15 br-20'>
                        <span className='font-12 color-2-80'>{t('youGet')}</span>
                        <b className='font-18 color-2-90 text-balance'>{t(`offers.${id}.benefit`)}</b>
                    </p>

                    <ul className='checks-li grid gap-8 content-start font-14'>
                        {perks.map((perk) => (
                            <li className='p-relative pl-30' key={perk}>{perk}</li>
                        ))}
                    </ul>

                    {/* шаги — в <details>: карточки короче, а текст всё равно в HTML для поисковиков */}
                    <details className='offer-steps br-20 bg-2-3'>
                        <summary className='flex nowrap align-center justify-between gap-10 pd-10 px-16 font-14 font-w-500 color-2-90 cursor-pointer'>
                            {t('stepsTitle')}
                            <ChevronDownSVG className='offer-steps-icon shrink-0 color-5-100' width={18} height={18} aria-hidden='true' />
                        </summary>
                        <div className='grid gap-10 px-16 pb-12'>
                            <ol className='mini-steps grid gap-10 font-14'>
                                {steps.map((step) => (
                                    <li className='p-relative' key={step}>{step}</li>
                                ))}
                            </ol>
                            <p className='md-0 font-12 color-2-80'>{t(`offers.${id}.note`)}</p>
                        </div>
                    </details>

                    <div className='flex nowrap gap-8'>
                        <a
                            href={url}
                            className='offer-cta hover-none flex-1 flex nowrap align-center justify-center gap-5 h-46 px-16 br-36 font-w-500'
                            target='_blank'
                            rel='sponsored nofollow noopener noreferrer'
                            aria-label={t('openLabel', { name })}
                        >
                            {t('open')}
                            <ArrowUpRightSVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                        </a>
                        <CopyLink
                            url={url}
                            copyLabel={t('copy')}
                            copiedLabel={t('copied')}
                            icon={<CopySVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />}
                            className='offer-copy hover-none flex nowrap align-center justify-center gap-5 h-46 px-16 br-36 font-14 font-w-500 space-nowrap'
                        />
                    </div>

                    <p className='md-0 font-12 color-2-80'>
                        {t('advertiserLabel', { name: t(`advertiser.${advertiser}`) })}
                        {erid && ` · erid: ${erid}`}
                    </p>
                </article>
            </li>
        );
    };

    return (
        <main>
            <JsonLd
                data={breadcrumbJsonLd(locale, [
                    { name: tNav('home'), href: '/' },
                    { name: tNav('promotions'), href: '/stocks' },
                ])}
            />
            {/* вопросы на этой странице свои (не повторяют главную) — FAQPage здесь допустим */}
            <JsonLd data={faqJsonLd(locale, faq)} />
            <PageNav label={t('pageNavLabel')} items={navItems} />

            {/* первая секция «почти во весь экран» (style.scss) — поэтому вступление и карточки в ней вместе */}
            <section>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('eyebrow')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                    <p className='max-w-60-ch mb-15'>{t('lead')}</p>
                    <ul className='flex gap-8 mb-20'>
                        <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500'>
                            {t('factCount', { count: counts.all })}
                        </li>
                        {/* чип-ссылка на секцию заработка: без него её легко не заметить под семью карточками */}
                        <li>
                            <a href='#earn' className='offer-copy hover-none inline-flex nowrap align-center h-36 px-16 br-36 font-14 font-w-500'>
                                {t('factEarn')} ↓
                            </a>
                        </li>
                        <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500'>
                            {t('factChecked', { date: checkedDate })}
                        </li>
                    </ul>

                    {/* фильтр — радио + :has() в style.scss (.offers), работает без JS; все карточки всегда в HTML */}
                    <div className='offers'>
                        <div className='flex gap-8 mb-20 m-justify-center' role='radiogroup' aria-label={t('filterLabel')}>
                            {FILTERS.map((filter, i) => (
                                <Fragment key={filter}>
                                    <input
                                        className='offer-filter-input sr-only'
                                        type='radio'
                                        name='offer-filter'
                                        id={`offer-filter-${filter}`}
                                        defaultChecked={i === 0}
                                    />
                                    <label
                                        className='offer-filter-label inline-flex nowrap align-center gap-8 h-36 px-10 br-36 bg-2-7 font-14 font-w-500 cursor-pointer'
                                        htmlFor={`offer-filter-${filter}`}
                                    >
                                        {t(`filters.${filter}`)}
                                        <span className='font-12 opacity-50'>{counts[filter]}</span>
                                    </label>
                                </Fragment>
                            ))}
                        </div>

                        <ul className='flex row-flush'>
                            {BANK_OFFERS.map((offer, index) => renderOffer(offer, `${index < NARROW_COUNT ? 'f-w-4' : 'f-w-6'} f-h-6`, 'h2'))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* ── Заработок: код Ozon Job + Ozon Blogger ─────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='earn'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('earnEyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('earnTitle')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('earnLead')}</p>
                    <ul className='flex row-flush'>
                        <li className='scroll-anchor f-w-6 mb-20' id='earn-job'>
                            <article className='city-stat-accent grid gap-12 content-start h-full br-20 border-1px-2-10 pd-20' aria-labelledby='stocks-job-title'>
                                <p className='md-0 font-12 text-uppercase letter-s-8'>{t('jobKicker')}</p>
                                <h3 className='offer-title' id='stocks-job-title'>{t('jobTitle')}</h3>
                                <p className='md-0 font-14'>{t('jobText')}</p>
                                <p className='md-0 font-12 text-uppercase letter-s-8'>{t('jobCodeLabel')}</p>
                                <CopyCode code={PROMO.code} copyLabel={t('jobCopy')} copiedLabel={t('copied')} />
                                <div className='flex gap-8 m-justify-center'>
                                    <Link href='/#promo' className='promo-btn hover-none flex align-center justify-center h-46 px-24 br-36 font-w-500'>
                                        {t('jobLink')}
                                    </Link>
                                    <Link href='/sklad' className='promo-btn-outline hover-none flex align-center justify-center h-46 px-24 br-36 font-w-500'>
                                        {t('skladLink')}
                                    </Link>
                                </div>
                            </article>
                        </li>
                        {EARN_OFFERS.map((offer) => renderOffer(offer, 'f-w-6', 'h3'))}
                    </ul>
                </div>
            </section>

            {/* ── Как это работает: тот же степпер, что «Первые шаги» на главной ─────────────────────── */}
            <section className='py-20 scroll-anchor' id='how'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('howEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('howTitle')}</h2>
                    <div className='container-type-inline'>
                        <ol className='stepper grid' style={{ '--stepper-cols': how.length } as CSSProperties}>
                            {how.map((step, i) => (
                                <li className='stepper-item p-relative grid rows-auto-1fr gap-14' key={step.title} style={{ '--i': i } as CSSProperties}>
                                    <span className='stepper-node p-relative z-1 grid place-center w-46 h-46 br-round bg-3-100 color-5-100 font-18 font-w-700' aria-hidden='true'>{i + 1}</span>
                                    <div className='stepper-card grid gap-8 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3'>
                                        <span className='stepper-label color-5-100 font-12 font-w-500 text-uppercase letter-s-8'>
                                            {t('stepLabel', { n: i + 1, total: how.length })}
                                        </span>
                                        <h3>{step.title}</h3>
                                        <p className='font-14'>{step.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </section>

            {/* ── Вопросы + раскрытие рекламы и дата сверки ──────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='faq'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('faqEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('faqTitle')}</h2>
                    <div className='flex row-flush'>
                        <div className='f-w-8 mb-20'>
                            <FaqAccordion items={faq} />
                        </div>
                        <div className='f-w-4 mb-20'>
                            <aside className='grid gap-10 content-start br-20 bg-2-3 pd-20 font-12' aria-labelledby='stocks-about-title'>
                                <h3 className='offer-title color-2-90' id='stocks-about-title'>{t('aboutTitle')}</h3>
                                <p className='md-0'>{t('checked', { date: checkedDate })}</p>
                                <p className='md-0'>{t('disclosure')}</p>
                                <ul className='grid gap-7'>
                                    <li>
                                        <Link href='/menu/ads' className='color-5-100'>{t('adsLink')}</Link>
                                    </li>
                                    <li>
                                        <a href={HELP_URL} className='color-5-100' target='_blank' rel='nofollow noopener noreferrer'>
                                            {t('helpLink')} ↗
                                        </a>
                                    </li>
                                    <li>
                                        <a href={BLOGGER_TERMS_URL} className='color-5-100' target='_blank' rel='nofollow noopener noreferrer'>
                                            {t('bloggerLink')} ↗
                                        </a>
                                    </li>
                                </ul>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
