import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { Link } from '@/i18n/navigation';
import { breadcrumbJsonLd, buildPageMetadata, faqJsonLd } from '@/lib/seo';
import { SUPPORT_CHECKED_AT } from '@/config/site';
import ContactList from '@/components/ContactList';
import FaqAccordion from '@/components/FaqAccordion';
import JsonLd from '@/components/JsonLd';
import PageNav from '@/components/PageNav';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com). viewBox='0 0 24 24' — у иконок не родного размера
import UserCheckSVG from '@/assets/svg/sklad/user-check.svg';
import CalendarCheckSVG from '@/assets/svg/sklad/calendar-check.svg';
import CreditCardSVG from '@/assets/svg/sklad/credit-card.svg';
import BarChartSVG from '@/assets/svg/sklad/bar-chart.svg';
import GiftSVG from '@/assets/svg/sklad/gift.svg';
import InfoCircleSVG from '@/assets/svg/menu/info-circle.svg';
import MessageDotsSVG from '@/assets/svg/support/message-dots.svg';
import BriefcaseSVG from '@/assets/svg/support/briefcase.svg';
import ArrowUpRightSVG from '@/assets/svg/menu/arrow-up-right.svg';

// «Вопросы и ответы»: темы (иконка + аккордеон) слева, справа — куда писать: поддержка Ozon Job (аккаунт, выплаты)
// и мы (вопросы по сайту, сотрудничество). Тексты — SupportPage.* (все 9 языков), контакты — config/legal.ts.
// Вопросы с главной (HomePage.pay.tips) тоже показываются здесь, в своих темах, но в разметку FAQPage не входят:
// одинаковые вопросы размечают только на одной странице — на главной.

type Props = {
    params: Promise<{ locale: string }>;
};

type Svg = typeof UserCheckSVG;
type Titled = { title: string; text: string };

// Темы: иконка, цвет (--accent), какие вопросы главной добавить в начало (индексы HomePage.pay.tips — поменяете
// порядок вопросов на главной, поправьте и здесь) и раздел сайта «подробнее» (подпись — SupportPage.topics.<id>.more)
const TOPICS = [
    { id: 'account', icon: UserCheckSVG, accent: '#1c7ed6', homeTips: [2, 3], more: '/#first-day' },
    { id: 'shifts', icon: CalendarCheckSVG, accent: '#7a5af8', homeTips: [6, 5], more: '/#steps' },
    { id: 'money', icon: CreditCardSVG, accent: '#005bff', homeTips: [0, 1, 4], more: '/#pay' },
    { id: 'rating', icon: BarChartSVG, accent: '#0ca678', homeTips: [], more: '/menu/level' },
    { id: 'bonus', icon: GiftSVG, accent: '#e64980', homeTips: [], more: '/#promo' },
    { id: 'site', icon: InfoCircleSVG, accent: '#f08c00', homeTips: [], more: '/menu/about' },
] as const satisfies readonly { id: string; icon: Svg; accent: string; homeTips: readonly number[]; more: string }[];

const HELP_URL = 'https://docs.ozon.ru/job-ff-help/';

const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'SupportPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/menu/support',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
    });
}

export default async function SupportPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'SupportPage' });
    const tHome = await getTranslations({ locale, namespace: 'HomePage' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });
    const tMenu = await getTranslations({ locale, namespace: 'MenuPage' });
    const format = await getFormatter({ locale });

    const checkedDate = format.dateTime(new Date(SUPPORT_CHECKED_AT), { dateStyle: 'long' });
    const homeTips = tHome.raw('pay.tips') as Titled[];

    const topics = TOPICS.map((topic) => {
        const own = t.raw(`topics.${topic.id}.items`) as Titled[];
        return { ...topic, own, items: [...topic.homeTips.map((i) => homeTips[i]), ...own] };
    });
    const total = topics.reduce((sum, topic) => sum + topic.items.length, 0);

    const navItems = [
        ...topics.map(({ id, items }) => ({
            kicker: t('count', { count: items.length }),
            title: t(`topics.${id}.title`),
            href: `#topic-${id}`,
        })),
        { kicker: t('contactsKicker'), title: t('contactsTitle'), href: '#contacts' },
    ];

    return (
        <main>
            <JsonLd
                data={breadcrumbJsonLd(locale, [
                    { name: tNav('home'), href: '/' },
                    { name: tNav('menu'), href: '/menu' },
                    { name: tMenu('quick.support.title'), href: '/menu/support' },
                ])}
            />
            {/* только свои вопросы страницы: вопросы главной размечены на главной */}
            <JsonLd data={faqJsonLd(locale, topics.flatMap((topic) => topic.own))} />
            <PageNav label={t('pageNavLabel')} items={navItems} />

            {/* одна секция: у первой секции страницы высота «почти во весь экран» (style.scss) */}
            <section>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('eyebrow')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                    <p className='max-w-60-ch mb-15'>{t('lead')}</p>
                    <ul className='flex gap-8 mb-20'>
                        <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500'>
                            {t('count', { count: total })}
                        </li>
                        <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500'>
                            {t('checked', { date: checkedDate })}
                        </li>
                        <li>
                            <a href='#contacts' className='offer-copy hover-none inline-flex nowrap align-center h-36 px-16 br-36 font-14 font-w-500'>
                                {t('contactsChip')} ↓
                            </a>
                        </li>
                    </ul>

                    {/* темы — якоря, текст всех ответов всё равно в HTML (аккордеон прячет его только визуально) */}
                    <nav className='mb-20' aria-label={t('topicsLabel')}>
                        <ul className='support-topics grid gap-8'>
                            {topics.map(({ id, icon: Icon, accent: color, items }) => (
                                <li key={id}>
                                    <a
                                        href={`#topic-${id}`}
                                        className='page-nav-head hover-none flex nowrap align-center gap-12 h-full pd-10 br-20 bg-3-100 border-1px-2-10'
                                        style={accent(color)}
                                    >
                                        <span className='icon-badge grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                                            <Icon width={20} height={20} viewBox='0 0 24 24' />
                                        </span>
                                        <span className='grid gap-2'>
                                            <b className='font-14 color-2-90'>{t(`topics.${id}.title`)}</b>
                                            <span className='font-12 color-2-80'>{t('count', { count: items.length })}</span>
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className='flex row-flush'>
                        <div className='f-w-8'>
                            {topics.map(({ id, icon: Icon, accent: color, items, more }) => (
                                <section className='scroll-anchor mb-20' id={`topic-${id}`} key={id} aria-labelledby={`topic-${id}-title`}>
                                    <header className='flex nowrap align-center gap-12 mb-15' style={accent(color)}>
                                        <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                            <Icon width={24} height={24} viewBox='0 0 24 24' />
                                        </span>
                                        <div className='grid gap-2'>
                                            <h2 className='menu-title color-2-90' id={`topic-${id}-title`}>{t(`topics.${id}.title`)}</h2>
                                            <p className='md-0 font-14 color-2-80'>{t(`topics.${id}.lead`)}</p>
                                        </div>
                                    </header>
                                    <FaqAccordion items={items} defaultOpen={-1} idPrefix={`q-${id}`} />
                                    <div className='mt-15'>
                                        <Link href={more} className='color-5-100 font-14 font-w-500'>{t(`topics.${id}.more`)} →</Link>
                                    </div>
                                </section>
                            ))}
                            <p className='font-12 color-2-80 mb-20'>
                                {t('sourceNote', { date: checkedDate })}{' '}
                                <a href={HELP_URL} className='color-5-100' target='_blank' rel='nofollow noopener noreferrer'>
                                    {t('helpLink')} ↗
                                </a>
                            </p>
                        </div>

                        <div className='f-w-4 mb-20'>
                            {/* h-full — колонка во всю высоту ряда: внутри неё «едет» карточка контактов (sticky-aside) */}
                            <aside className='scroll-anchor grid gap-15 content-start h-full' id='contacts' aria-label={t('contactsKicker')}>
                                {/* аккаунт, выплаты, рейтинг — только поддержка Ozon Job: у сайта нет доступа к аккаунтам */}
                                <div className='city-stat-accent grid gap-10 content-start br-20 pd-20'>
                                    <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                        <MessageDotsSVG width={24} height={24} viewBox='0 0 24 24' />
                                    </span>
                                    <h2 className='offer-title'>{t('ozonTitle')}</h2>
                                    <p className='md-0 font-14'>{t('ozonText')}</p>
                                    <a
                                        href={HELP_URL}
                                        className='promo-btn hover-none flex nowrap align-center justify-center gap-5 h-46 px-16 br-36 font-w-500'
                                        target='_blank'
                                        rel='nofollow noopener noreferrer'
                                    >
                                        {t('ozonLink')}
                                        <ArrowUpRightSVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                    </a>
                                    <p className='md-0 font-12'>{t('safety')}</p>
                                </div>

                                {/* вопросы по сайту и сотрудничество — к нам */}
                                <div className='sticky-aside grid gap-12 content-start br-20 bg-3-100 border-1px-2-10 shadow-3 pd-20'>
                                    <div className='flex nowrap align-center gap-12' style={accent('#7a5af8')}>
                                        <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                            <BriefcaseSVG width={24} height={24} viewBox='0 0 24 24' />
                                        </span>
                                        <h2 className='offer-title color-2-90'>{t('contactsTitle')}</h2>
                                    </div>
                                    <p className='md-0 font-14'>{t('contactsText')}</p>
                                    <ContactList locale={locale} mailSubject={t('mailSubject')} />
                                    <Link
                                        href='/menu/cooperation'
                                        className='offer-cta hover-none flex nowrap align-center justify-center gap-5 h-46 px-16 br-36 font-w-500'
                                    >
                                        {t('cooperationLink')} →
                                    </Link>
                                    <p className='md-0 font-12 color-2-80'>
                                        {t.rich('privacyNote', {
                                            link: (chunks) => <Link href='/menu/privacy' className='color-5-100'>{chunks}</Link>,
                                        })}
                                    </p>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
