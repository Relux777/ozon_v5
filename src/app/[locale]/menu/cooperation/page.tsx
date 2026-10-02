import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { Link } from '@/i18n/navigation';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { CONTACTS } from '@/config/legal';
import ContactList from '@/components/ContactList';
import JsonLd from '@/components/ui/json-ld';

// Иконки — Boxicons (Free, CC BY 4.0, https://boxicons.com). viewBox='0 0 24 24' — у иконок не родного размера
import TranslateSVG from '@/assets/svg/support/translate.svg';
import SearchSVG from '@/assets/svg/support/search.svg';
import DevicesSVG from '@/assets/svg/support/devices.svg';
import ShieldSVG from '@/assets/svg/support/shield.svg';
import PaletteSVG from '@/assets/svg/support/palette.svg';
import TargetSVG from '@/assets/svg/support/target.svg';
import EnvelopeSVG from '@/assets/svg/support/envelope.svg';
import TelegramSVG from '@/assets/svg/support/telegram.svg';
import MegaphoneSVG from '@/assets/svg/menu/megaphone.svg';

// «Сотрудничество»: компании заказывают такой же рекламный сайт; реклама и партнёрство на этом сайте; контакты.
// Тексты — CooperationPage.* (все 9 языков), контакты — config/legal.ts (общий блок ContactList)

type Props = {
    params: Promise<{ locale: string }>;
};

type Svg = typeof TranslateSVG;
type Titled = { title: string; text: string };

// Иконка и цвет каждой карточки «Что входит» — по порядку CooperationPage.features
const FEATURE_STYLE: { icon: Svg; accent: string }[] = [
    { icon: TranslateSVG, accent: '#1c7ed6' },
    { icon: SearchSVG, accent: '#0ca678' },
    { icon: DevicesSVG, accent: '#7a5af8' },
    { icon: ShieldSVG, accent: '#f08c00' },
    { icon: PaletteSVG, accent: '#e64980' },
    { icon: TargetSVG, accent: '#005bff' },
];

// Технологии — чипами в карточке «Что делаем» (названия не переводятся)
const STACK = ['Next.js', 'React', 'TypeScript', 'HTML', 'SCSS'];

const accent = (color: string) => ({ '--accent': color }) as CSSProperties;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'CooperationPage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/menu/cooperation',
        title: t('title'),
        description: t('description', CONTACTS.hours),
        siteName: tMeta('siteName'),
    });
}

export default async function CooperationPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'CooperationPage' });
    const tNav = await getTranslations({ locale, namespace: 'NavBar' });

    const features = t.raw('features') as Titled[];
    const steps = t.raw('steps') as Titled[];
    const doItems = t.raw('doItems') as string[];
    const dontItems = t.raw('dontItems') as string[];
    const terms = t.raw('terms') as Titled[];
    const mailto = `mailto:${CONTACTS.email}?subject=${encodeURIComponent(t('mailSubject'))}`;

    return (
        <main>
            <JsonLd
                data={breadcrumbJsonLd(locale, [
                    { name: tNav('home'), href: '/' },
                    { name: tNav('menu'), href: '/menu' },
                    { name: t('eyebrow'), href: '/menu/cooperation' },
                ])}
            />

            {/* первая секция «почти во весь экран» (style.scss): предложение слева, контакты справа */}
            <section>
                <div className='container flex'>
                    <div className='flex row-flush align-center'>
                        <div className='f-w-7 mb-20'>
                            <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('eyebrow')}</p>
                            <h1 className='mb-7 color-2-90 text-balance'>{t('heading')}</h1>
                            <p className='max-w-60-ch mb-15'>{t('lead')}</p>
                            <ul className='flex gap-8 mb-20'>
                                {(['factLanguages', 'factPages', 'factHours'] as const).map((key) => (
                                    <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500' key={key}>
                                        {t(key, CONTACTS.hours)}
                                    </li>
                                ))}
                            </ul>
                            <div className='flex gap-8'>
                                <a href={mailto} className='offer-cta hover-none inline-flex nowrap align-center justify-center gap-8 h-46 px-24 br-36 font-w-500'>
                                    <EnvelopeSVG width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                    {t('ctaMail')}
                                </a>
                                <a
                                    href={CONTACTS.telegram.url}
                                    className='offer-copy hover-none inline-flex nowrap align-center justify-center gap-8 h-46 px-24 br-36 font-w-500'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    <TelegramSVG width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                    {t('ctaTelegram')}
                                </a>
                            </div>
                        </div>

                        <div className='f-w-5 mb-20'>
                            <div className='scroll-anchor grid gap-12 content-start br-20 bg-3-100 border-1px-2-10 shadow-3 pd-20' id='contacts'>
                                <h2 className='offer-title color-2-90'>{t('contactsTitle')}</h2>
                                <p className='md-0 font-14'>{t('contactsLead')}</p>
                                <p className='md-0 font-14 color-2-80'>{t('contactName')}</p>
                                <ContactList locale={locale} mailSubject={t('mailSubject')} />
                                <p className='md-0 font-12 color-2-80'>
                                    {t.rich('privacyNote', {
                                        link: (chunks) => <Link href='/menu/privacy' className='color-5-100'>{chunks}</Link>,
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Что входит ─────────────────────────────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='features'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('featuresEyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('featuresTitle')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('featuresLead')}</p>
                    <ul className='flex row-flush'>
                        {features.map((feature, i) => {
                            const { icon: Icon, accent: color } = FEATURE_STYLE[i % FEATURE_STYLE.length];
                            return (
                                <li className='f-w-4 f-h-6 mb-15' key={feature.title}>
                                    <article
                                        className='menu-card grid gap-10 content-start h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3'
                                        style={accent(color)}
                                    >
                                        <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                            <Icon width={24} height={24} viewBox='0 0 24 24' />
                                        </span>
                                        <h3 className='font-16 color-2-90'>{feature.title}</h3>
                                        <p className='md-0 font-14 color-2-80'>{feature.text}</p>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </section>

            {/* ── Условия: что делаем (фронтенд), что не входит, срок, стоимость, передача ──────────────── */}
            <section className='py-20 scroll-anchor' id='terms'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('termsEyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('termsTitle')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('termsLead')}</p>
                    <div className='flex row-flush'>
                        <div className='f-w-6 mb-15'>
                            <article className='grid gap-12 content-start h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3' aria-labelledby='coop-do-title'>
                                <h3 className='offer-title color-2-90' id='coop-do-title'>{t('doTitle')}</h3>
                                <ul className='flex gap-8'>
                                    {STACK.map((tech) => (
                                        <li className='inline-flex nowrap align-center h-36 px-16 br-36 bg-5-10 color-5-100 font-14 font-w-500' key={tech}>
                                            {tech}
                                        </li>
                                    ))}
                                </ul>
                                <ul className='checks-li grid gap-8 font-14'>
                                    {doItems.map((item) => (
                                        <li className='p-relative pl-30' key={item}>{item}</li>
                                    ))}
                                </ul>
                            </article>
                        </div>
                        <div className='f-w-6 mb-15'>
                            <article className='grid gap-12 content-start h-full pd-20 br-20 bg-2-3 border-1px-2-10' aria-labelledby='coop-dont-title'>
                                <h3 className='offer-title color-2-90' id='coop-dont-title'>{t('dontTitle')}</h3>
                                <ul className='legal-list grid gap-8 font-14'>
                                    {dontItems.map((item) => (
                                        <li key={item}>{item}</li>
                                    ))}
                                </ul>
                            </article>
                        </div>
                    </div>
                    <ul className='flex row-flush'>
                        {terms.map((term) => (
                            <li className='f-w-4 f-h-6 mb-15' key={term.title}>
                                <div className='grid gap-5 content-start h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3'>
                                    <h3 className='font-16 color-2-90'>{term.title}</h3>
                                    <p className='md-0 font-14 color-2-80'>{term.text}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* ── Как работаем: тот же степпер, что «Первые шаги» на главной ─────────────────────────── */}
            <section className='py-20 scroll-anchor' id='process'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('stepsEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('stepsTitle')}</h2>
                    <div className='container-type-inline'>
                        <ol className='stepper grid' style={{ '--stepper-cols': steps.length } as CSSProperties}>
                            {steps.map((step, i) => (
                                <li className='stepper-item p-relative grid rows-auto-1fr gap-14' key={step.title} style={{ '--i': i } as CSSProperties}>
                                    <span className='stepper-node p-relative z-1 grid place-center w-46 h-46 br-round bg-3-100 color-5-100 font-18 font-w-700' aria-hidden='true'>{i + 1}</span>
                                    <div className='stepper-card grid gap-8 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3'>
                                        <span className='stepper-label color-5-100 font-12 font-w-500 text-uppercase letter-s-8'>
                                            {t('stepLabel', { n: i + 1, total: steps.length })}
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

            {/* ── Реклама и партнёрство на этом сайте ────────────────────────────────────────────────── */}
            <section className='py-20 scroll-anchor' id='ads'>
                <div className='container'>
                    <div className='grid gap-12 content-start br-20 bg-2-3 pd-20' style={accent('#e64980')}>
                        <div className='flex nowrap align-center gap-12'>
                            <span className='icon-badge grid place-center w-46 h-46 br-round shrink-0' aria-hidden='true'>
                                <MegaphoneSVG width={24} height={24} viewBox='0 0 24 24' />
                            </span>
                            <h2 className='menu-title color-2-90'>{t('adsTitle')}</h2>
                        </div>
                        <p className='md-0 max-w-60-ch'>{t('adsText')}</p>
                        <div>
                            <Link href='/menu/ads' className='color-5-100 font-14 font-w-500'>{t('adsLink')} →</Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
