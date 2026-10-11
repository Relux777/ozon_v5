import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { GOOGLE_ANALYTICS_ID, OWNER, YANDEX_METRIKA_ID } from '@/config/legal';
import LegalDoc from '@/components/LegalDoc';
import { legalValues } from '@/components/LegalDoc/rich';
import CookieSettings from '@/components/CookieSettings';

// Cookie и согласие на аналитику: какие cookie ставит сайт, и отдельно — текст согласия на обработку данных
// Яндекс Метрикой (с 01.09.2025 согласие оформляется отдельно от других документов, ч. 1 ст. 9 152-ФЗ).
// Кнопка «Изменить выбор cookie» — отзыв согласия. Тексты — LegalDocs.cookies (все 9 языков, юридически значима русская версия).

type Props = {
    params: Promise<{ locale: string }>;
};

type RowKey = 'consent' | 'theme' | 'ym' | 'ymOther' | 'ga' | 'gaState';
type Row = { key: RowKey; name?: string; owner: 'site' | 'yandex' | 'google'; analytics?: boolean };

// Имена cookie не переводятся; у строк без name имя берётся из словаря (rows.<key>.name).
// Cookie языка сайт не ставит (routing.localeCookie: false) — язык определяет адрес страницы
const COOKIES: Row[] = [
    { key: 'consent', name: 'cookie_consent', owner: 'site' },
    { key: 'theme', owner: 'site' },
    { key: 'ym', name: '_ym_uid, _ym_d', owner: 'yandex', analytics: true },
    { key: 'ymOther', owner: 'yandex', analytics: true },
    // Google Analytics — строки появляются, только если задан GOOGLE_ANALYTICS_ID
    ...(GOOGLE_ANALYTICS_ID
        ? ([
              { key: 'ga', name: '_ga', owner: 'google', analytics: true },
              { key: 'gaState', name: '_ga_*', owner: 'google', analytics: true },
          ] as const)
        : []),
];

// Пункты согласия по порядку; трансграничная передача — только с Google Analytics
type ConsentKey = 'data' | 'purpose' | 'actions' | 'crossBorder' | 'method' | 'term' | 'withdraw';
const CONSENT: ConsentKey[] = ['data', 'purpose', 'actions', ...(GOOGLE_ANALYTICS_ID ? (['crossBorder'] as const) : []), 'method', 'term', 'withdraw'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.cookies' });
    return { title: t('title'), robots: { index: false, follow: true } };
}

export default async function CookiesPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.cookies' });
    const tCookies = await getTranslations({ locale, namespace: 'Cookies' });
    const values = legalValues(locale);
    const what = t.raw('what.p') as string[];
    // в русском тексте согласия имя — в дательном падеже («даю согласие Плотникову…»)
    const consentOwner = locale === 'ru' ? OWNER.fullNameGenitive : values.owner;

    const settings = (
        <CookieSettings
            labels={{
                button: tCookies('settings'),
                all: tCookies('statusAll'),
                necessary: tCookies('statusNecessary'),
                none: tCookies('statusNone'),
            }}
        />
    );

    const sections = [
        {
            id: 'what',
            title: t('what.title'),
            content: (
                <>
                    {what.map((text) => (
                        <p key={text}>{text}</p>
                    ))}
                    {settings}
                </>
            ),
        },
        {
            id: 'list',
            title: t('list.title'),
            content: (
                <>
                    <ul className='grid gap-10'>
                        {COOKIES.map((row) => (
                            <li className='grid gap-5 pd-15 br-20 bg-2-3' key={row.key}>
                                <div className='flex align-center justify-between gap-8'>
                                    <code className='color-2-90 font-w-500'>
                                        {row.name ?? t(`list.rows.${row.key as 'theme' | 'ymOther'}.name`)}
                                    </code>
                                    <span className={`inline-flex nowrap align-center h-20 px-10 br-36 font-12 ${row.analytics ? 'bg-5-10 color-5-100' : 'bg-2-7 color-2-80'}`}>
                                        {row.analytics ? t('list.analytics') : t('list.necessary')}
                                    </span>
                                </div>
                                <p>{t(`list.rows.${row.key}.purpose`)}</p>
                                <p className='font-12 color-2-80'>
                                    {t('list.meta', { owner: t(`list.owners.${row.owner}`), term: t(`list.rows.${row.key}.term`) })}
                                </p>
                            </li>
                        ))}
                    </ul>
                    {!YANDEX_METRIKA_ID && !GOOGLE_ANALYTICS_ID && <p className='font-14 color-2-80'>{t('list.noCounters')}</p>}
                    <p>{t('list.delete')}</p>
                </>
            ),
        },
        {
            id: 'consent',
            title: t('consent.title'),
            content: (
                <>
                    <p>{t.rich('consent.intro', { ...values, owner: consentOwner })}</p>
                    <ul className='legal-list grid gap-5'>
                        {CONSENT.map((key) => (
                            <li key={key}>{t.rich(`consent.${key}`, values)}</li>
                        ))}
                    </ul>
                    <p>{t.rich('consent.privacy', values)}</p>
                </>
            ),
        },
    ];

    return <LegalDoc locale={locale} href='/menu/cookies' sections={sections} />;
}
