import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { getLocaleFromParams } from '@/i18n/params';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';
import { Link } from '@/i18n/navigation';
import { APP_STORES } from '@/config/promo';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com). viewBox='0 0 24 24' — у иконок не родного размера
import MapSVG from '@/assets/svg/sklad/map.svg';
import GiftSVG from '@/assets/svg/sklad/gift.svg';
import CreditCardSVG from '@/assets/svg/sklad/credit-card.svg';
import FileDetailSVG from '@/assets/svg/sklad/file-detail.svg';
import BarChartSVG from '@/assets/svg/sklad/bar-chart.svg';
import RocketSVG from '@/assets/svg/menu/rocket.svg';
import HelpCircleSVG from '@/assets/svg/menu/help-circle.svg';
import WalletCardsSVG from '@/assets/svg/menu/wallet-cards.svg';
import InfoCircleSVG from '@/assets/svg/menu/info-circle.svg';
import LockSVG from '@/assets/svg/menu/lock.svg';
import MegaphoneSVG from '@/assets/svg/menu/megaphone.svg';
import MobileSVG from '@/assets/svg/menu/mobile-alt.svg';
import ArrowUpRightSVG from '@/assets/svg/menu/arrow-up-right.svg';
import ChevronRightSVG from '@/assets/svg/menu/chevron-right.svg';
import CookieSVG from '@/assets/svg/support/cookie.svg';
import BriefcaseSVG from '@/assets/svg/support/briefcase.svg';

// Меню — хаб сайта: разделы (карточки с иконками), приложение Ozon Job (магазины), официальные ресурсы Ozon
// и документы сайта (компактный список). Тексты — MenuPage.* в messages/*.json, адреса и иконки — здесь.

type Props = {
    params: Promise<{ locale: string }>;
};

type Svg = typeof MapSVG;

// Разделы сайта: ключ текста (MenuPage.quick.*), ссылка, иконка и цвет (--accent для .icon-badge)
const QUICK = [
    { key: 'sklad', href: '/sklad', icon: MapSVG, accent: '#1c7ed6' },
    { key: 'steps', href: '/#steps', icon: RocketSVG, accent: '#7a5af8' },
    { key: 'promo', href: '/#promo', icon: GiftSVG, accent: '#e64980' },
    { key: 'pay', href: '/#pay', icon: CreditCardSVG, accent: '#005bff' },
    { key: 'firstDay', href: '/#first-day', icon: FileDetailSVG, accent: '#f08c00' },
    { key: 'level', href: '/menu/level', icon: BarChartSVG, accent: '#0ca678' },
    { key: 'support', href: '/menu/support', icon: HelpCircleSVG, accent: '#12b886' },
    { key: 'card', href: '/#card', icon: WalletCardsSVG, accent: '#f76707' },
] as const satisfies readonly { key: string; href: string; icon: Svg; accent: string }[];

// Официальные ресурсы Ozon — первоисточники условий (внешние ссылки)
const OFFICIAL = [
    { key: 'job', href: 'https://job.ozon.ru/' },
    { key: 'help', href: 'https://docs.ozon.ru/job-ff-help/' },
    { key: 'career', href: 'https://career.ozon.ru/' },
] as const;

// Документы сайта. «Реклама и вознаграждение» — не отдельной карточкой, а строкой списка: раскрытие
// рекламы по закону должно оставаться доступным (см. §11 CLAUDE.md), но выделять его незачем.
// «Cookie» — там же кнопка «Изменить выбор cookie» (отзыв согласия на аналитику)
const DOCS = [
    { key: 'about', href: '/menu/about', icon: InfoCircleSVG },
    { key: 'cooperation', href: '/menu/cooperation', icon: BriefcaseSVG },
    { key: 'privacy', href: '/menu/privacy', icon: LockSVG },
    { key: 'cookies', href: '/menu/cookies', icon: CookieSVG },
    { key: 'terms', href: '/menu/terms', icon: FileDetailSVG },
    { key: 'ads', href: '/menu/ads', icon: MegaphoneSVG },
] as const;

const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'MenuPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/menu',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
    });
}

export default async function MenuPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'MenuPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
    // кнопки магазинов без ссылки не показываем (как в блоке кода приглашения на главной)
    const stores = APP_STORES.filter((store) => store.url);

    return (
        <main>
            {/* одна секция: у первой секции страницы высота «почти во весь экран» (style.scss) */}
            <section>
                <div className='container'>
                    <p className='color-5-100 font-14'>{tMeta('siteName')}</p>
                    <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                    <p className='max-w-60-ch mb-20'>{t('lead')}</p>

                    {/* ── Разделы сайта ─────────────────────────────────────────────────────────── */}
                    <h2 className='menu-title color-2-90 mb-15'>{t('quickTitle')}</h2>
                    <ul className='flex row-flush'>
                        {QUICK.map(({ key, href, icon: Icon, accent: color }) => (
                            <li className='f-w-3 f-h-6 mb-15' key={key}>
                                <Link
                                    href={href}
                                    className='menu-card grid gap-10 content-start h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3 translate_0_5 tr-2 hover-none'
                                    style={accent(color)}
                                >
                                    <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                        <Icon width={24} height={24} viewBox='0 0 24 24' />
                                    </span>
                                    <b className='font-16 color-2-90'>{t(`quick.${key}.title`)}</b>
                                    <span className='font-14 color-2-80'>{t(`quick.${key}.text`)}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <div className='flex row-flush'>
                        {/* ── Приложение Ozon Job: ссылки на магазины ─────────────────────────────── */}
                        <div className='f-w-6 mb-20'>
                            <div className='city-stat-accent grid gap-15 content-start h-full br-20 border-1px-2-10 pd-20'>
                                <div className='flex nowrap align-center gap-14'>
                                    <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                        <MobileSVG width={24} height={24} viewBox='0 0 24 24' />
                                    </span>
                                    <h2 className='menu-title'>{t('appTitle')}</h2>
                                </div>
                                <p className='md-0 font-14'>{t('appText')}</p>
                                <ul className='promo-stores grid gap-8'>
                                    {stores.map((store) => (
                                        <li key={store.id}>
                                            <a
                                                className='promo-store hover-none flex text_center align-center justify-center br-36 h-46 font-14 font-w-500'
                                                href={store.url}
                                                target='_blank'
                                                rel='nofollow noopener noreferrer'
                                            >
                                                {store.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── Официальные ресурсы Ozon (внешние) ──────────────────────────────────── */}
                        <div className='f-w-6 mb-20'>
                            <div className='grid gap-10 content-start h-full br-20 bg-3-100 border-1px-2-10 shadow-3 pd-20'>
                                <h2 className='menu-title color-2-90'>{t('officialTitle')}</h2>
                                <p className='md-0 font-14 color-2-80'>{t('officialText')}</p>
                                <ul className='grid gap-5'>
                                    {OFFICIAL.map(({ key, href }) => (
                                        <li key={key}>
                                            <a
                                                href={href}
                                                target='_blank'
                                                rel='nofollow noopener noreferrer'
                                                className='page-nav-head hover-none flex nowrap align-center gap-12 pd-10 br-20 bg-2-3'
                                            >
                                                <span className='grid gap-2 flex-1'>
                                                    <b className='color-2-90'>{t(`official.${key}.title`)}</b>
                                                    <span className='font-12 color-2-80'>{t(`official.${key}.text`)}</span>
                                                </span>
                                                <ArrowUpRightSVG className='shrink-0 color-5-100' width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* ── О сайте и документы — компактный список ─────────────────────────────── */}
                    <h2 className='menu-title color-2-90 mb-15'>{t('docsTitle')}</h2>
                    <ul className='flex row-flush'>
                        {DOCS.map(({ key, href, icon: Icon }) => (
                            <li className='f-w-6 mb-10' key={key}>
                                <Link
                                    href={href}
                                    className='page-nav-head hover-none flex nowrap align-center gap-12 h-full pd-10 br-20 bg-3-100 border-1px-2-10'
                                >
                                    <span className='page-nav-num grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                                        <Icon width={18} height={18} viewBox='0 0 24 24' />
                                    </span>
                                    <span className='grid gap-2 flex-1'>
                                        <b className='color-2-90'>{t(`docs.${key}.title`)}</b>
                                        <span className='font-12 color-2-80'>{t(`docs.${key}.text`)}</span>
                                    </span>
                                    <ChevronRightSVG className='shrink-0 color-5-100' width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <p className='font-12 color-2-80 mt-15'>{t('note')}</p>
                </div>
            </section>
        </main>
    );
}
