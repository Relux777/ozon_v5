// Общие секции главной — от «Ozon в цифрах» до «Источников». Используются на главной и на страницах городов
// (sklad/[city]): разметка одна, правится в одном месте. Все тексты — HomePage.* в messages/*.json.
import { Fragment, type CSSProperties, type ReactNode } from 'react';
import { getFormatter, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { APP_STORES, CARD, PROMO } from '@/config/promo';
import { HOME_CHECKED_AT } from '@/config/site';
import CopyCode from '@/components/CopyCode';
import CopyLink from '@/components/CopyLink';
import FaqAccordion from '@/components/FaqAccordion';
import type { PageNavItem } from '@/components/Modal/content/PageNavModal';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';

// Картинки — webp-копии нужного размера (иконки 384 px). Исходные PNG по 3–10 МБ лежат рядом
// и в код не импортируются (см. §16 CLAUDE.md)
import AdvantagesPhoto1  from '@/assets/img/advantages/1.webp';
import AdvantagesPhoto2  from '@/assets/img/advantages/2.webp';
import AdvantagesPhoto3  from '@/assets/img/advantages/3.webp';
import AdvantagesPhoto4  from '@/assets/img/advantages/4.webp';
import AdvantagesPhoto5  from '@/assets/img/advantages/6.webp';
import AdvantagesPhoto6  from '@/assets/img/advantages/5.webp';

import PayPhoto from '@/assets/img/pg3.webp';
import TipsPhoto from '@/assets/img/pg4.webp';
import InviteIcon1 from '@/assets/img/invitation/1.webp';
import InviteIcon2 from '@/assets/img/invitation/2.webp';
import DocsIcon1 from '@/assets/img/documents/1.webp';
import DocsIcon2 from '@/assets/img/documents/2.webp';
import CardQr from '@/assets/svg/card-qr.svg';
// Boxicons (Free, CC BY 4.0) — иконки формулы выплаты
import ScanBarcodeSVG from '@/assets/svg/sklad/scan-barcode.svg';
import PackageSVG from '@/assets/svg/sklad/package.svg';
import CreditCardSVG from '@/assets/svg/sklad/credit-card.svg';
import FileDetailSVG from '@/assets/svg/sklad/file-detail.svg';

// Иконки слагаемых формулы по порядку HomePage.pay.formula: пики (скан ТСД) × тариф (товар) = вознаграждение
const FORMULA_ICONS = [ScanBarcodeSVG, PackageSVG, CreditCardSVG];

// Порядок картинок = порядок элементов HomePage.stats в messages/*.json
const STAT_IMAGES = [
    AdvantagesPhoto1,
    AdvantagesPhoto2,
    AdvantagesPhoto3,
    AdvantagesPhoto4,
    AdvantagesPhoto5,
    AdvantagesPhoto6,
];

// Дата сверки шагов, выплат и документов со справкой Ozon Job — HOME_CHECKED_AT в config/site.ts
// (оттуда же её берёт sitemap.xml)
const DOCS_URL = 'https://docs.ozon.ru/job-ff-help';

// Знаки между блоками формулы «пики × тариф = вознаграждение»
const PAY_OPS = ['×', '='] as const;
// Какая карточка сроков получает метку «быстрее всего» (порядок как в HomePage.pay.times)
const FAST_TIME = 2;

// Источники (справка Ozon Job, docs.ozon.ru) — по разделам главной страницы; названия не переводим
// (ссылки одинаковые для всех языков)
const SOURCES = [
    ['Приведите друга', `${DOCS_URL}/benefits/refferal/`],
    ['Регистрация', `${DOCS_URL}/personal-account/registration/`],
    ['Регистрация иностранных граждан', `${DOCS_URL}/personal-account/registration-foreigners/`],
    ['Условия сотрудничества', `${DOCS_URL}/conditions/basic-rules/`],
    ['График выплат', `${DOCS_URL}/payments/payout/payment-schedule/`],
    ['Расчёт выплат', `${DOCS_URL}/payments/payout/rewards/`],
    ['Тарифы', `${DOCS_URL}/payments/tariffs/`],
    ['Документы для первого выхода', `${DOCS_URL}/shifts/documents/`],
    ['Первый выход', `${DOCS_URL}/shifts/onboarding/`],
    ['Уровни и баллы', `${DOCS_URL}/rating/rating/`],
    ['Приведи друга (Ozon Банк)', 'https://help-bank.ozon.ru/individuals/bonuses-and-promotions/referral'],
] as const;

type Titled = { title: string; text: string };
type DocMode = { id: string; label: string; docs: { name: string; note: string }[] };

/**
 * Пункты быстрой навигации (PageNav) по общим секциям — переиспользуют уже переведённые заголовки.
 * Страница может добавить свои пункты перед ними (так делает страница города).
 */
export async function getHomeNavItems(locale: AppLocale): Promise<PageNavItem[]> {
    const t = await getTranslations({ locale, namespace: 'HomePage' });

    return [
        { kicker: t('statsEyebrow'), title: t('statsTitle'), href: '#stats' },
        { kicker: t('stepsEyebrow'), title: t('stepsTitle'), href: '#steps' },
        { kicker: t('promo.kicker'), title: t('promo.stepsLabel'), href: '#promo' },
        {
            kicker: t('friend.eyebrow'),
            title: t('friend.title'),
            href: '#friend',
            links: [
                { label: t('friend.invited.title'), href: '#friend-invited' },
                { label: t('friend.inviter.title'), href: '#friend-inviter' },
            ],
        },
        {
            kicker: t('pay.eyebrow'),
            title: t('pay.title'),
            href: '#pay',
            links: [
                { label: t('pay.formulaLabel'), href: '#pay-formula' },
                { label: t('pay.timesTitle'), href: '#pay-times' },
            ],
        },
        {
            kicker: t('firstDay.eyebrow'),
            title: t('firstDay.title'),
            href: '#first-day',
            links: [
                { label: t('firstDay.docsTitle'), href: '#first-day-docs' },
                { label: t('firstDay.dayTitle'), href: '#first-day-day' },
            ],
        },
        { kicker: t('types.eyebrow'), title: t('types.title'), href: '#types' },
        { kicker: t('card.kicker'), title: t('card.stepsLabel'), href: '#card' },
        { kicker: t('pay.tipsEyebrow'), title: t('pay.tipsTitle'), href: '#tips' },
    ];
}

type Props = {
    locale: AppLocale;
    /** блоки страницы, которые встают сразу после «Почему стоит работать в Ozon» (#stats) — так делает страница города */
    afterStats?: ReactNode;
};

export default async function HomeSections({ locale, afterStats }: Props) {
    const t = await getTranslations({ locale, namespace: 'HomePage' });
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
    const docModes = t.raw('firstDay.docsModes') as DocMode[];
    const dayOne = t.raw('firstDay.day') as Titled[];
    const typeItems = t.raw('types.items') as { name: string; tax: string; note: string }[];
    const cardPerks = t.raw('card.perks') as string[];
    const cardSteps = t.raw('card.steps') as Titled[];
    // кнопки магазинов без ссылки не показываем
    const stores = APP_STORES.filter((store) => store.url);
    const format = await getFormatter({ locale });
    const dataDate = format.dateTime(new Date(HOME_CHECKED_AT), { dateStyle: 'long' });

    return (
        <>
            <section className='py-20 scroll-anchor' id='stats'>
                <div className="container">
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('statsEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('statsTitle')}</h2>
                    <div className='flex'>
                        {stats.map(({ value, label }, i) => (
                            <div className='f-w-2 f-h-4 f-m-6 mb-20' key={label}>
                                <div className='bg-2-3 blur-7 touch-no-blur pd-10 shadow-3 br-36 text_center translate_0_5 tr-2 cursor-pointer'>
                                    {/* alt пустой намеренно: иконка декоративная, смысл передаёт подпись рядом */}
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
            {afterStats}
            <section className='py-20 scroll-anchor' id='steps'>
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
            <section className='py-20 scroll-anchor' id='promo'>
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
                                                    className='promo-store hover-none flex align-center justify-center br-36 h-46 px-0 font-14 font-w-500'
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
            <section className='py-20 scroll-anchor' id='friend'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('friend.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('friend.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('friend.lead')}</p>
                    <div className='flex'>
                        {friendRoles.map((role) => (
                            <div className='f-w-6 mb-20' key={role.key}>
                                <article className='role scroll-anchor p-relative overflow-hidden grid gap-15 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20' id={`friend-${role.key}`}>
                                    <header className='flex nowrap align-center gap-14'>
                                        <Image className='role-img float shrink-0' src={role.image} width={96} height={96} sizes='64px' alt='' />
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
            <section className='py-20 scroll-anchor' id='pay'>
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
                                    alt={t('imageAlt.pay')}
                                    sizes='(max-width: 990px) 100vw, 420px'
                                />
                            </div>
                        </div>

                        <div className='f-w-8 grid gap-15 content-start'>

                        {/* формула «пики × тариф = вознаграждение»: у каждого слагаемого иконка, знаки — в кружках,
                            итог выделен синим (.formula-result); в узком контейнере — столбиком (см. .formula в style.scss) */}
                        <div className='container-type-inline scroll-anchor bg-3-100 br-20 border-1px-2-10 pd-20 mb-20' id='pay-formula'>
                            <h3 className='font-18 color-2-90 mb-15'>{t('pay.formulaLabel')}</h3>
                            <ol className='formula grid gap-10' aria-label={t('pay.formulaLabel')}>
                                {payFormula.map((item, i) => {
                                    const Icon = FORMULA_ICONS[i] ?? CreditCardSVG;
                                    const isResult = i === payFormula.length - 1;

                                    return (
                                        <Fragment key={item.title}>
                                            {i > 0 && (
                                                <li className='formula-op grid place-center' aria-hidden='true'>
                                                    <span className='grid place-center w-36 h-36 br-round bg-5-100 color-6-100 font-18 font-w-700'>
                                                        {PAY_OPS[i - 1]}
                                                    </span>
                                                </li>
                                            )}
                                            <li className={`grid gap-8 content-start br-20 pd-15 font-14${isResult ? ' formula-result' : ' bg-2-3'}`}>
                                                <span className='icon-badge grid place-center w-46 h-46 br-round' aria-hidden='true'>
                                                    <Icon width={24} height={24} viewBox='0 0 24 24' />
                                                </span>
                                                <b className='color-2-90 font-16'>{item.title}</b>
                                                <span>{item.text}</span>
                                            </li>
                                        </Fragment>
                                    );
                                })}
                            </ol>
                            <p className='flex nowrap align-start gap-10 br-20 bg-5-10 pd-10 font-14 mt-15 md-0'>
                                <FileDetailSVG className='shrink-0 color-5-100' width={20} height={20} viewBox='0 0 24 24' aria-hidden='true' />
                                <span>
                                    <b className='color-2-90'>{t('pay.taxTitle')}</b> {t('pay.taxText')}
                                </span>
                            </p>
                        </div>
                            <div className='scroll-anchor' id='pay-times'>
                                <h3 className='font-18 color-2-90 mb-15'>{t('pay.timesTitle')}</h3>
                                {/* одна линия: на широком экране 4 колонки, на телефоне — лента со свайпом */}
                                <ul className='time-row grid gap-10 scrollbar-none'>
                                    {payTimes.map((item, i) => (
                                        <li
                                            className={`time-item p-relative grid gap-3 content-start bg-3-100 br-20 border-1px-2-10 pd-10 font-12 translate_0_5 tr-2${i === FAST_TIME ? ' time-fast blur-3 touch-no-blur' : ''}`}
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
                                <p className='font-12 mt-10'>
                                    {t('pay.timesNote')}{' '}
                                    <Link href='/menu/level' className='color-5-100'>{t('pay.levelsLink')}</Link>
                                </p>
                            </div>


                        </div>
                    </div>
                    <p className='font-12 mt-20'>{t('pay.note', { date: dataDate })}</p>
                </div>
            </section>
            <section className='py-20 scroll-anchor' id='first-day'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('firstDay.eyebrow')}</p>
                    <h2 className='mb-7 color-2-90 text-balance'>{t('firstDay.title')}</h2>
                    <p className='max-w-60-ch mb-20'>{t('firstDay.lead')}</p>
                    <div className='flex'>
                        <div className='f-w-6 mb-20'>
                            {/* переключатель режима + чек-лист: радио и чекбоксы работают без JS (см. .doc-mode-* в style.scss) */}
                            <div className='doc-mode-wrap scroll-anchor p-relative overflow-hidden grid gap-15 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20' id='first-day-docs'>
                                <header className='flex nowrap align-center gap-14'>
                                    <Image className='role-img float shrink-0' src={DocsIcon1} width={96} height={96} sizes='64px' alt='' />
                                    <h3 className='font-22 color-2-90'>{t('firstDay.docsTitle')}</h3>
                                </header>

                                <div className='flex gap-8 m-justify-center' role='radiogroup' aria-label={t('firstDay.docsModeLabel')}>
                                    {docModes.map((mode, i) => (
                                        <Fragment key={mode.id}>
                                            <input className='doc-mode-input sr-only' type='radio' name='doc-mode' id={`doc-mode-${mode.id}`} defaultChecked={i === 0} />
                                            <label className='doc-mode-label inline-flex align-center px-16 py-4 br-36 bg-2-7 font-14 font-w-500 cursor-pointer' htmlFor={`doc-mode-${mode.id}`}>
                                                {mode.label}
                                            </label>
                                        </Fragment>
                                    ))}
                                </div>

                                {docModes.map((mode) => (
                                    <div
                                        className='doc-mode-panel grid gap-15 content-start'
                                        data-doc-mode={mode.id}
                                        key={mode.id}
                                        style={{ '--total': `"${mode.docs.length}"` } as CSSProperties}
                                    >
                                        <ul className='docs grid gap-8'>
                                            {mode.docs.map((doc) => (
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
                                        <p className='font-14 font-w-500 color-5-100 md-0 mt-15'>
                                            {t('firstDay.progress')} <span className='docs-count' />
                                        </p>
                                    </div>
                                ))}

                                <p className='font-12 md-0'>{t('firstDay.docsModeNote')}</p>
                                <p className='font-12 md-0'>{t('firstDay.docsNote')}</p>
                            </div>
                        </div>

                        <div className='f-w-6 mb-20'>
                            <div className='scroll-anchor p-relative overflow-hidden grid gap-15 content-start h-full bg-3-100 br-20 border-1px-2-10 pd-20' id='first-day-day'>
                                <header className='flex nowrap align-center gap-14'>
                                    <Image className='role-img float shrink-0' src={DocsIcon2} width={96} height={96} sizes='64px' alt='' />
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
            <section className='py-20 scroll-anchor' id='types'>
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
            <section className='py-20 scroll-anchor' id='card'>
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
                                    <CopyLink url={CARD.url} copyLabel={t('card.copy')} copiedLabel={t('card.copied')} className='promo-btn hover-none flex align-center justify-center h-46 px-24 br-36 font-w-500' />
                                    <a
                                        href={CARD.url}
                                        className='promo-btn-outline hover-none flex align-center justify-center h-46 px-24 br-36 font-w-500'
                                        target='_blank'
                                        rel='sponsored nofollow noopener noreferrer'
                                    >
                                        {t('card.openLink')}
                                    </a>
                                </div>
                            </div>

                            <div className='f-w-5'>
                                {/* QR наезжает на нижний правый угол карты — компактнее по высоте, чем два блока друг под другом */}
                                <div className='card-visual flex column justify-between p-relative w-full pd-20 br-20'>
                                    <span className='card-chip br-8' />
                                    <span className='card-brand font-22 font-w-500'>Ozon Карта</span>
                                    <span className='card-number font-14 letter-s-14 opacity-90'>•••• •••• •••• 0000</span>
                                    <div className='card-qr p-absolute z-1 pd-5 br-20'>
                                        <CardQr className='block w-full br-8' role='img' aria-label={t('card.qrLabel')} />
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
            <section className='py-20 scroll-anchor' id='tips'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('pay.tipsEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('pay.tipsTitle')}</h2>
                    <div className='flex align-center'>
                        <div className='f-w-8 grid gap-15 content-start mb-20'>
                            <FaqAccordion items={payTips} />
                            <p className='font-12'>
                                <Link href='/menu/support' className='color-5-100'>{t('pay.tipsAllLink')}</Link>
                            </p>
                        </div>
                        <div className='f-w-4 mb-20'>
                            <div className='pay-photo-wrap'>
                                <Image
                                    className='pay-photo br-36 w-full cover'
                                    src={TipsPhoto}
                                    alt={t('imageAlt.tips')}
                                    sizes='(max-width: 990px) 100vw, 420px'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className='py-20'>
                <div className='container'>
                    <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('sourcesEyebrow')}</p>
                    <h2 className='mb-20 color-2-90 text-balance'>{t('sourcesTitle')}</h2>
                    {/* названия источников не переводятся — на других языках помечаем их как русский текст */}
                    <ul className='sources-scroll flex nowrap align-center gap-7 h-60' lang={locale === 'ru' ? undefined : 'ru'}>
                        {SOURCES.map(([title, href]) => (
                            <li className='shrink-0' key={href}>
                                <a href={href} className='source-chip inline-flex nowrap align-center gap-4 px-10 h-36 br-36 blur-3 touch-no-blur font-12 font-w-500' target='_blank' rel='nofollow noopener noreferrer'>
                                    {title} ↗
                                </a>
                            </li>
                        ))}
                    </ul>
                    <p className='font-12 mt-15'>{t('sourcesNote', { date: dataDate })}</p>
                </div>
            </section>
        </>
    );
}
