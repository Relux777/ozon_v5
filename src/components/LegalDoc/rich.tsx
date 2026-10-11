import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { SITE_CONFIG } from '@/config/site';
import { CONTACTS, GOOGLE_ANALYTICS_ID, HOSTING, OWNER, YANDEX_METRIKA_ID } from '@/config/legal';

// Общие подстановки для текстов документов (LegalDocs.* в messages): теги-ссылки и значения из config/legal.ts.
// Передаются в t.rich(key, legalValues(locale)) — лишние значения next-intl просто не использует

const external = { target: '_blank', rel: 'nofollow noopener noreferrer' } as const;
const LINK = 'color-5-100';

// Языки с латинским алфавитом — имя владельца латиницей, в остальных — как в паспорте
const LATIN_LOCALES: AppLocale[] = ['uz', 'az', 'en'];

export const ownerName = (locale: AppLocale) => (LATIN_LOCALES.includes(locale) ? OWNER.fullNameLatin : OWNER.fullName);

export function legalValues(locale: AppLocale) {
    const internal = (href: '/menu/ads' | '/menu/cooperation' | '/menu/privacy' | '/menu/cookies' | '/stocks') => (chunks: ReactNode) => (
        <Link href={href} className={LINK}>{chunks}</Link>
    );
    const outside = (href: string) => (chunks: ReactNode) => (
        <a href={href} className={LINK} {...external}>{chunks}</a>
    );

    return {
        // значения
        host: new URL(SITE_CONFIG.url).host,
        owner: ownerName(locale),
        email: CONTACTS.email,
        phone: CONTACTS.phone.label,
        telegram: CONTACTS.telegram.username,
        from: CONTACTS.hours.from,
        to: CONTACTS.hours.to,
        hosting: HOSTING.name,
        hasHosting: HOSTING.name ? 'yes' : 'no',
        hostingPlace: HOSTING.name ? (HOSTING.inRussia ? 'russia' : 'abroad') : 'none',
        ga: GOOGLE_ANALYTICS_ID ? 'yes' : 'no',
        // счётчиков нет вообще — политика прямо говорит, что cookie аналитики сейчас не ставятся
        counters: YANDEX_METRIKA_ID || GOOGLE_ANALYTICS_ID ? 'yes' : 'none',
        // теги
        b: (chunks: ReactNode) => <b>{chunks}</b>,
        mail: (chunks: ReactNode) => <a href={`mailto:${CONTACTS.email}`} className={LINK}>{chunks}</a>,
        call: (chunks: ReactNode) => <a href={`tel:${CONTACTS.phone.tel}`} className={LINK}>{chunks}</a>,
        tg: (chunks: ReactNode) => (
            <a href={CONTACTS.telegram.url} className={LINK} target='_blank' rel='noopener noreferrer'>{chunks}</a>
        ),
        job: outside('https://job.ozon.ru'),
        help: outside('https://docs.ozon.ru/job-ff-help/'),
        career: outside('https://career.ozon.ru'),
        ads: internal('/menu/ads'),
        cooperation: internal('/menu/cooperation'),
        privacy: internal('/menu/privacy'),
        cookies: internal('/menu/cookies'),
        stocks: internal('/stocks'),
    };
}
