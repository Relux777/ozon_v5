import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { GOOGLE_ANALYTICS_ID } from '@/config/legal';
import LegalDoc from '@/components/LegalDoc';
import { legalValues } from '@/components/LegalDoc/rich';

// Политика обработки персональных данных (ч. 2 ст. 18.1 152-ФЗ — опубликовать в свободном доступе).
// Тексты — LegalDocs.privacy (все 9 языков, юридически значима русская версия). Оператор, контакты и хостинг — config/legal.ts.
// Не юридическая консультация: перед запуском форм, аналитики или рассылок — согласовать с юристом.

type Props = {
    params: Promise<{ locale: string }>;
};

// Порядок абзацев и пунктов — ключи в LegalDocs.privacy
const GENERAL = ['intro', 'operator', 'independent'] as const;
const CASES = ['tech', 'cookies', 'requests'] as const;
const RIGHTS = ['know', 'fix', 'withdraw', 'complain'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.privacy' });
    return { title: t('title'), robots: { index: false, follow: false } };
}

export default async function PrivacyPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.privacy' });
    const values = legalValues(locale);
    // кому передаём: Google — только если подключён счётчик
    type TransferKey = 'hosting' | 'yandex' | 'google' | 'mail' | 'telegram' | 'gov';
    const transfer: TransferKey[] = ['hosting', 'yandex', ...(GOOGLE_ANALYTICS_ID ? (['google'] as const) : []), 'mail', 'telegram', 'gov'];

    const simple = (id: 'actions' | 'security' | 'changes') => ({
        id,
        title: t(`${id}.title`),
        content: <p>{t(`${id}.text`)}</p>,
    });

    const sections = [
        {
            id: 'general',
            title: t('general.title'),
            content: GENERAL.map((key) => <p key={key}>{t.rich(`general.p.${key}`, values)}</p>),
        },
        {
            id: 'data',
            title: t('data.title'),
            content: (
                <>
                    <p>{t('data.intro')}</p>
                    <div className='grid gap-10'>
                        {CASES.map((key) => (
                            <div className='grid gap-5 pd-15 br-20 bg-2-3' key={key}>
                                <b className='color-2-90'>{t(`data.cases.${key}.title`)}</b>
                                <p>{t.rich(`data.cases.${key}.text`, values)}</p>
                            </div>
                        ))}
                    </div>
                    <p>{t('data.outro')}</p>
                </>
            ),
        },
        simple('actions'),
        {
            id: 'transfer',
            title: t('transfer.title'),
            content: (
                <>
                    <p>{t('transfer.intro')}</p>
                    <ul className='legal-list grid gap-5'>
                        {transfer.map((key) => (
                            <li key={key}>{t.rich(`transfer.${key}`, values)}</li>
                        ))}
                    </ul>
                </>
            ),
        },
        {
            id: 'storage',
            title: t('storage.title'),
            content: <p>{t.rich('storage.text', values)}</p>,
        },
        simple('security'),
        {
            id: 'rights',
            title: t('rights.title'),
            content: (
                <>
                    <ul className='legal-list grid gap-5'>
                        {RIGHTS.map((key) => (
                            <li key={key}>{t.rich(`rights.items.${key}`, values)}</li>
                        ))}
                    </ul>
                    <p>{t.rich('rights.request', values)}</p>
                </>
            ),
        },
        simple('changes'),
    ];

    return <LegalDoc locale={locale} href='/menu/privacy' sections={sections} />;
}
