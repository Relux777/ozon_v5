import type { Metadata } from 'next';
import { Fragment, type CSSProperties } from 'react';
import { getFormatter, getTranslations } from 'next-intl/server';
import { APP_STORES, CARD, PROMO } from '@/config/promo';
import CopyCode from '@/components/CopyCode';
import CopyLink from '@/components/CopyLink';
import { Link } from '@/i18n/navigation';
import { getLocaleFromParams } from '@/i18n/params';
import { buildPageMetadata, generateJsonLd } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

import Image from 'next/image';
import HomeIMG  from '@/assets/img/pg1.png';

import AdvantagesPhoto1  from '@/assets/img/advantages/1.png';
import AdvantagesPhoto2  from '@/assets/img/advantages/2.png';
import AdvantagesPhoto3  from '@/assets/img/advantages/3.png';
import AdvantagesPhoto4  from '@/assets/img/advantages/4.png';
import AdvantagesPhoto6  from '@/assets/img/advantages/6.png';
import AdvantagesPhoto5  from '@/assets/img/advantages/5.png';

import PayPhoto from '@/assets/img/pg3.png';
import InviteIcon1 from '@/assets/img/invitation/1.png';
import InviteIcon2 from '@/assets/img/invitation/2.png';
import DocsIcon1 from '@/assets/img/documents/1.png';
import DocsIcon2 from '@/assets/img/documents/2.png';
import CardQr from '@/assets/svg/card-qr.svg';

// Порядок картинок = порядок элементов HomePage.stats в messages/*.json
const STAT_IMAGES = [
    AdvantagesPhoto1,
    AdvantagesPhoto2,
    AdvantagesPhoto3,
    AdvantagesPhoto4,
    AdvantagesPhoto5,
    AdvantagesPhoto6,
];

// Дата сверки шагов, выплат и документов со справкой Ozon Job (docs.ozon.ru)
const STEPS_CHECKED_AT = '2026-09-22';
const DOCS_URL = 'https://docs.ozon.ru/job-ff-help';

// Знаки между блоками формулы «пики × тариф = вознаграждение»
const PAY_OPS = ['×', '='] as const;
// Какая карточка сроков получает метку «быстрее всего» (порядок как в HomePage.pay.times)
const FAST_TIME = 2;

type Titled = { title: string; text: string };

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'HomePage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });

    return buildPageMetadata({
        locale,
        href: '/',
        title: t('title'),
        description: t('description'),
        siteName: tMeta('siteName'),
        // ключевые слова и бренд заданы прямо в title — шаблон из layout не применяем
        absoluteTitle: true,
    });
}

export default async function HomePage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'HomePage' });
    const tMeta = await getTranslations({ locale, namespace: 'Metadata' });
    const features = t.raw('features') as string[];
    const stats = t.raw('stats') as { value: string; label: string }[];
    const steps = t.raw('steps') as { title: string; text: string; needs: string[] }[];
    const promoTerms = t.raw('promo.terms') as string[];
    const promoSteps = t.raw('promo.steps') as { title: string; text: string }[];
    const friendRoles = [
        { key: 'invited', image: InviteIcon1, kicker: t('friend.invited.kicker'), title: t('friend.invited.title'), steps: t.raw('friend.invited.steps') as Titled[] },
        { key: 'inviter', image: InviteIcon2, kicker: t('friend.inviter.kicker'), title: t('friend.inviter.title'), steps: t.raw('friend.inviter.steps') as Titled[] },
    ];
    const friendRules = t.raw('friend.rules') as Titled[];
    const payFormula = t.raw('pay.formula') as Titled[];
    const payTimes = t.raw('pay.times') as { big: string; title: string; text: string }[];
    const payTips = t.raw('pay.tips') as Titled[];
    const docs = t.raw('firstDay.docs') as { name: string; note: string }[];
    const dayOne = t.raw('firstDay.day') as Titled[];
    const typeItems = t.raw('types.items') as { name: string; tax: string; note: string }[];
    const cardPerks = t.raw('card.perks') as string[];
    const cardSteps = t.raw('card.steps') as Titled[];
    // кнопки магазинов без ссылки не показываем
    const stores = APP_STORES.filter((store) => store.url);
    const format = await getFormatter({ locale });
    const dataDate = format.dateTime(new Date(STEPS_CHECKED_AT), { dateStyle: 'long' });

    const jsonLd = generateJsonLd(locale, 'WebSite', {
        name: tMeta('siteName'),
        description: t('description'),
    });

    return (
        <main className='home_page'>
            <JsonLd data={jsonLd} />
            <section>
                <div className="container flex align-center">
                    <div className="f-w-8">
                        <p className="color-5-100 font-14">{tMeta('siteName')}</p>
                        <h1 className="color-2-90">{t('heading')}</h1>
                        <p className='font-16 max-w-60-ch'>{t('lead', { amount: PROMO.userBonus })}</p>
                        <ul className='font-14 checks-li grid gap-7 mb-20'>
                            {features.map((feature) => (
                                <li className='p-relative pl-30' key={feature}>{feature}</li>
                            ))}
                        </ul>
                        <div className='flex gap-15'>
                            <Link href='/sklad' className='flex align-center bg-5-100 hover-none hover-bg-5-80 br-36 h-46 px-24 color-6-100 translate_0_2 shadow-1'>
                                {t('heroCity')}
                            </Link>
                            {/* якорь на блок с кодом: плавную прокрутку даёт scroll-behavior в ReluxCode */}
                            <a href='#promo' className='flex align-center bg-2-7 hover-none br-36 h-46 px-24 color-2-100 translate_0_2 blur-7 shadow-3'>
                                {t('heroBonus', { amount: PROMO.userBonus })}
                            </a>
                        </div>
                    </div>
                    <div className="f-w-4">
                        <div className='home-img grid justify-i-center pb-12'>
                            <Image
                                className='float w-full'
                                src={HomeIMG}
                                alt=''
                                sizes='(max-width: 990px) 70vw, 340px'
                                loading='eager'
                                fetchPriority='high'
                            />
                            <span className='shadow float-shadow h-20 mt-15 p-events-none' aria-hidden='true'></span>
                        </div>
                    </div>
                </div>
            </section>
            <section className='py-20'>
                <div className="container">
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('statsEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('statsTitle')}</h2>
                    <div className='flex'>
                        {stats.map(({ value, label }, i) => (
                            <div className='f-w-2 f-h-4 f-m-6 mb-20' key={label}>
                                <div className='bg-2-3 blur-7 pd-10 shadow-3 br-36 text_center translate_0_5 tr-2 cursor-pointer'>
                                    <Image className='mb-10' src={STAT_IMAGES[i]} width={100} height={100} alt="" />
                                    <h3>{value}</h3>
                                    <p className='mt-7'>{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className='font-12'>{t('statsNote')}</p>
                </div>
            </section>
            <section className='py-20'>
                <div className="container">
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('stepsEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('stepsTitle')}</h2>
                    <div className='container-type-inline'>
                        <ol className='stepper grid'>
                            {steps.map((step, i) => (
                                <li className='stepper-item p-relative grid rows-auto-1fr gap-14' key={step.title} style={{ '--i': i } as CSSProperties}>
                                    <span className='stepper-node p-relative z-1 grid place-center w-46 h-46 br-round bg-3-100 color-5-100 font-18 font-w-700' aria-hidden='true'>{i + 1}</span>
                                    <div className='stepper-card grid gap-8 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 shadow-3'>
                                        <span className='stepper-label color-5-100 font-12 font-w-500 text-uppercase letter-s-8'>
                                            {t('stepLabel', { n: i + 1, total: steps.length })}
                                        </span>
                                        <h3>{step.title}</h3>
                                        <p className='font-14'>{step.text}</p>
                                        <ul className='flex gap-5' aria-label={t('stepsNeedsLabel')}>
                                            {step.needs.map((need) => (
                                                <li className='pill inline-flex align-center px-10 py-4 br-36 bg-2-7 font-12' key={need}>{need}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>

                    <p className='font-12 mt-20'>{t('stepsNote', { date: dataDate })}</p>
                </div>
            </section>
            <section className='py-20' id='promo'>
                <div className='container'>
                    <div className='promo p-relative isolate overflow-hidden br-32 container-type-inline'>
                        <div className='promo-top flex align-center'>
                            <div className='f-w-7 grid gap-15 content-start'>
                                <p className='promo-kicker flex align-center gap-8 text-uppercase letter-s-8 font-12'>
                                    <span className='promo-badge inline-flex align-center px-10 br-36 letter-s-6'>{t('promo.ad')}</span>
                                    {t('promo.kicker')}
                                </p>
                                <h2 className='promo-title text-balance'>{t('promo.title')}</h2>
                                <p className='promo-text max-w-60-ch'>{t('promo.text')}</p>
                                <ul className='promo-terms flex gap-8' aria-label={t('promo.termsLabel')}>
                                    {promoTerms.map((term) => (
                                        <li className='inline-flex nowrap align-center gap-8 br-36 font-14' key={term}>{term}</li>
                                    ))}
                                    {/* сумму бонуса обводим зелёным; значение берётся из config/promo.ts */}
                                    <li className='inline-flex nowrap align-center gap-8 br-36 font-14'>
                                        <span>
                                            {t.rich('promo.bonus', {
                                                amount: PROMO.userBonus,
                                                sum: (chunks) => <b className='promo-sum br-36 px-10 font-w-700'>{chunks}</b>,
                                            })}
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className='f-w-5'>
                                {/* «купон»: код и ссылки на карточки приложения в магазинах */}
                                <div className='promo-coupon grid gap-10 br-32'>
                                    <p className='promo-label text-uppercase letter-s-8 font-12'>{t('promo.codeLabel')}</p>
                                    <CopyCode code={PROMO.code} copyLabel={t('promo.copy')} copiedLabel={t('promo.copied')} />
                                    <p className='promo-hint font-12'>{t('promo.codeHint')}</p>
                                    <p className='promo-hint font-12'>{t('promo.storesLabel')}</p>
                                    <ul className='promo-stores grid gap-8'>
                                        {stores.map((store) => (
                                            <li key={store.id}>
                                                <a
                                                    className='promo-store flex align-center justify-center br-36 h-46 px-0 font-14 font-w-500'
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
                        </div>

                        <ol className='promo-steps grid gap-12' aria-label={t('promo.stepsLabel')}>
                            {promoSteps.map((step, i) => (
                                <li className='p-relative overflow-hidden grid gap-8 content-start br-20 pd-20 font-14' key={step.title}>
                                    <span className='promo-ghost p-absolute font-w-700 p-events-none u-select-none' aria-hidden='true'>{i + 1}</span>
                                    <span className='promo-num grid place-center w-36 h-36 br-round font-w-700' aria-hidden='true'>{i + 1}</span>
                                    <h3 className='font-16'>{step.title}</h3>
                                    <p>{step.text}</p>
                                </li>
                            ))}
                        </ol>

                        <p className='promo-condition font-14'>{t('promo.condition')}</p>
                        <p className='promo-warn br-20 font-14'>{t('promo.warn')}</p>
                        <p className='promo-note font-12'>{t('promo.note')}</p>
                    </div>
                </div>
            </section>
            <section className='py-20' id='friend'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('friend.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('friend.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('friend.lead')}</p>
                    <div className='flex'>
                        {friendRoles.map((role) => (
                            <div className='f-w-6 mb-20' key={role.key}>
                                <article className='role p-relative overflow-hidden grid gap-15 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20'>
                                    <header className='flex nowrap align-center gap-14'>
                                        <Image className='role-img float shrink-0' src={role.image} width={96} height={96} sizes='96px' alt='' />
                                        <div>
                                            <p className='color-5-100 text-uppercase letter-s-8 font-12 mb-5'>{role.kicker}</p>
                                            <h3 className='font-22 color-2-90'>{role.title}</h3>
                                        </div>
                                    </header>
                                    <ol className='mini-steps grid gap-12'>
                                        {role.steps.map((step) => (
                                            <li className='p-relative grid gap-2 font-14' key={step.title}>
                                                <b className='color-2-90'>{step.title}</b>
                                                <span>{step.text}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </article>
                            </div>
                        ))}
                    </div>

                    <h3 className='font-18 color-2-90 mb-15'>{t('friend.rulesTitle')}</h3>
                    <ul className='flex'>
                        {friendRules.map((rule) => (
                            <li className='f-w-3 f-h-6 mb-20' key={rule.title}>
                                <div className='grid gap-7 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20 font-14 translate_0_5 tr-2'>
                                    <b className='color-2-90'>{rule.title}</b>
                                    <span>{rule.text}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className='font-12'>
                        {t('friend.note')}{' '}
                        <a className='color-5-100' href={`${DOCS_URL}/benefits/refferal/`} target='_blank' rel='noopener noreferrer'>
                            {t('friend.noteLink')}
                        </a>
                    </p>
                </div>
            </section>
            <section className='py-20' id='pay'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('pay.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('pay.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('pay.lead')}</p>

                    <div className='flex align-center'>
                        <div className='f-w-4 mb-20'>
                            {/* фото держится на месте, пока читаются блоки справа */}
                            <div className='pay-photo-wrap'>
                                <Image
                                    className='pay-photo br-36 w-full cover'
                                    src={PayPhoto}
                                    alt=''
                                    sizes='(max-width: 990px) 100vw, 380px'
                                />
                            </div>
                        </div>

                        <div className='f-w-8 grid gap-15 content-start'>
                            
                        <div className='container-type-inline bg-3-100 br-20 border-1px-2-10 pd-20 mb-20'>
                            <ol className='formula grid gap-10' aria-label={t('pay.formulaLabel')}>
                                        {payFormula.map((item, i) => (
                                            <Fragment key={item.title}>
                                                {i > 0 && (
                                                    <li className='formula-op grid place-center font-24 font-w-700 color-5-100' aria-hidden='true'>
                                                        {PAY_OPS[i - 1]}
                                                    </li>
                                                )}
                                                <li className='grid gap-3 content-start br-20 bg-2-3 pd-10 font-14'>
                                                    <b className='color-2-90 font-16'>{item.title}</b>
                                                    <span>{item.text}</span>
                                                </li>
                                            </Fragment>
                                        ))}
                            </ol>
                            <p className='br-20 bg-5-10 pd-10 font-14 mt-15'>
                                <b className='color-2-90'>{t('pay.taxTitle')}</b> {t('pay.taxText')}
                            </p>
                        </div>
                            <div>
                                <h3 className='font-18 color-2-90 mb-15'>{t('pay.timesTitle')}</h3>
                                {/* одна линия: на широком экране 4 колонки, на телефоне — лента со свайпом */}
                                <ul className='time-row grid gap-10 scrollbar-none'>
                                    {payTimes.map((item, i) => (
                                        <li
                                            className={`time-item p-relative grid gap-3 content-start bg-3-100 br-20 border-1px-2-10 pd-10 font-12 translate_0_5 tr-2${i === FAST_TIME ? ' time-fast' : ''}`}
                                            key={item.title}
                                        >
                                            {/* метка «быстрее всего» — на верхней грани карточки, высоту не увеличивает */}
                                            {i === FAST_TIME && (
                                                <span className='time-tag p-absolute r-10 pill inline-flex align-center px-10 py-4 br-36 bg-5-100 color-6-100 font-12'>{t('pay.fastTag')}</span>
                                            )}
                                            <b className='font-24 font-w-700 color-5-100 space-nowrap'>{item.big}</b>
                                            <b className='color-2-90 font-14'>{item.title}</b>
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            
                        </div>
                    </div>
                    <p className='font-12 mt-20'>{t('pay.note', { date: dataDate })}</p>
                </div>
            </section>
            <section className='py-20' id='first-day'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('firstDay.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('firstDay.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('firstDay.lead')}</p>
                    <div className='flex'>
                        <div className='f-w-6 mb-20'>
                            {/* чек-лист: галочки работают без JS, счётчик «собрано» — на CSS-счётчиках */}
                            <div
                                className='p-relative overflow-hidden grid gap-15 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20'
                                style={{ '--total': `"${docs.length}"` } as CSSProperties}
                            >
                                <header className='flex nowrap align-center gap-14'>
                                    <Image className='role-img float shrink-0' src={DocsIcon1} width={96} height={96} sizes='96px' alt='' />
                                    <h3 className='font-22 color-2-90'>{t('firstDay.docsTitle')}</h3>
                                </header>
                                <ul className='docs grid gap-8'>
                                    {docs.map((doc) => (
                                        <li key={doc.name}>
                                            <label className='doc p-relative flex nowrap align-start gap-12 br-20 bg-2-3 cursor-pointer'>
                                                <input className='doc-input' type='checkbox' />
                                                <span className='doc-box p-relative shrink-0 br-round' aria-hidden='true' />
                                                <span className='grid gap-2 font-14'>
                                                    <b className='doc-name color-2-90'>{doc.name}</b>
                                                    {doc.note && <small className='font-12'>{doc.note}</small>}
                                                </span>
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                                <p className='font-14 font-w-500 color-5-100 md-0'>
                                    {t('firstDay.progress')} <span className='docs-count' />
                                </p>
                                <p className='font-12 md-0'>{t('firstDay.docsNote')}</p>
                            </div>
                        </div>

                        <div className='f-w-6 mb-20'>
                            <div className='p-relative overflow-hidden grid gap-15 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20'>
                                <header className='flex nowrap align-center gap-14'>
                                    <Image className='role-img float shrink-0' src={DocsIcon2} width={96} height={96} sizes='96px' alt='' />
                                    <h3 className='font-22 color-2-90'>{t('firstDay.dayTitle')}</h3>
                                </header>
                                <ol className='mini-steps grid gap-12'>
                                    {dayOne.map((step) => (
                                        <li className='p-relative grid gap-2 font-14' key={step.title}>
                                            <b className='color-2-90'>{step.title}</b>
                                            <span>{step.text}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                    <p className='font-12'>{t('firstDay.note', { date: dataDate })}</p>
                </div>
            </section>
            <section className='py-20' id='types'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('types.eyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('types.title')}</h2>
                    <ul className='flex'>
                        {typeItems.map((item) => (
                            <li className='f-w-3 f-h-6 mb-20' key={item.name}>
                                <div className='grid gap-10 content-start h-full bg-3-100 br-20 border-1px-2-10 shadow-3 pd-20 text_center font-14 translate_0_5 tr-2'>
                                    <h3 className='font-22 color-2-90'>{item.name}</h3>
                                    <p className='br-20 bg-5-10 pd-10 md-0'>
                                        <span className='block font-12 color-5-100 text-uppercase letter-s-8'>{t('types.taxLabel')}</span>
                                        <b className='color-2-90'>{item.tax}</b>
                                    </p>
                                    <p>{item.note}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className='font-12'>{t('types.note', { date: dataDate })}</p>
                </div>
            </section>
            <section className='py-20' id='card'>
                <div className='container'>
                    <div className='promo p-relative isolate overflow-hidden br-32 container-type-inline'>
                        <div className='promo-top flex align-center'>
                            <div className='f-w-7 grid gap-15 content-start'>
                                <p className='promo-kicker flex align-center gap-8 text-uppercase letter-s-8 font-12'>
                                    <span className='promo-badge inline-flex align-center px-10 br-36 letter-s-6'>{t('card.ad')}</span>
                                    {t('card.kicker')}
                                </p>
                                <h2 className='promo-title text-balance'>{t('card.title')}</h2>
                                <p className='promo-text max-w-60-ch'>{t('card.text')}</p>

                                <ul className='promo-terms flex gap-8' aria-label={t('card.perksLabel')}>
                                    {cardPerks.map((perk) => (
                                        <li className='inline-flex nowrap align-center gap-8 br-36 font-14' key={perk}>{perk}</li>
                                    ))}
                                </ul>

                                <div className='flex align-center gap-10 mb-15'>
                                    <CopyLink url={CARD.url} copyLabel={t('card.copy')} copiedLabel={t('card.copied')} className='promo-btn flex align-center justify-center' />
                                    <a
                                        href={CARD.url}
                                        className='promo-btn-outline flex align-center justify-center h-46 px-24 br-36 font-w-500'
                                        target='_blank'
                                        rel='sponsored nofollow noopener noreferrer'
                                    >
                                        {t('card.openLink')}
                                    </a>
                                </div>
                            </div>

                            <div className='f-w-5'>
                                {/* QR наезжает на нижний правый угол карты — компактнее по высоте, чем два блока друг под другом */}
                                <div className='card-visual'>
                                    <span className='card-chip' />
                                    <span className='card-brand'>Ozon Карта</span>
                                    <span className='card-number'>•••• •••• •••• 0000</span>
                                    <div className='card-qr'>
                                        <CardQr className='card-qr-image' role='img' aria-label={t('card.qrLabel')} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <ol className='promo-steps grid gap-12' aria-label={t('card.stepsLabel')}>
                            {cardSteps.map((step, i) => (
                                <li className='p-relative overflow-hidden grid gap-8 content-start br-20 pd-20 font-14' key={step.title}>
                                    <span className='promo-ghost p-absolute font-w-700 p-events-none u-select-none' aria-hidden='true'>{i + 1}</span>
                                    <span className='promo-num grid place-center w-36 h-36 br-round font-w-700' aria-hidden='true'>{i + 1}</span>
                                    <h3 className='font-16'>{step.title}</h3>
                                    <p>{step.text}</p>
                                </li>
                            ))}
                        </ol>

                        <p className='promo-warn br-20 font-14'>{t('card.warn')}</p>
                        <p className='promo-note font-12'>{t('card.note')}</p>
                    </div>
                </div>
            </section>
            <section className='py-20'>
                <div className='container'>
                    <h3 className='font-18 color-2-90 mb-15'>{t('pay.tipsTitle')}</h3>
                        <div className='grid gap-8'>
                            {payTips.map((tip, i) => (
                                <details className='tip bg-3-100 br-20 border-1px-2-10' name='pay-tips' open={i === 0} key={tip.title}>
                                    <summary className='flex nowrap justify-between align-center gap-10 font-w-500 color-2-90 cursor-pointer'>
                                        {tip.title}
                                    </summary>
                                    <p className='font-14'>{tip.text}</p>
                                </details>
                            ))}
                        </div>
                    </div>
            </section>
            </main>
    );
}
