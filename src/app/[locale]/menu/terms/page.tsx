import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import LegalDoc from '@/components/LegalDoc';
import { legalValues } from '@/components/LegalDoc/rich';

// Пользовательское соглашение информационного сайта без аккаунтов и форм. Тексты — LegalDocs.terms (все 9 языков,
// юридически значима русская версия); владелец и контакты — config/legal.ts. Не юридическая консультация — согласовать с юристом.

type Props = {
    params: Promise<{ locale: string }>;
};

const SECTIONS = ['general', 'status', 'info', 'ads', 'links', 'ip', 'liability', 'data', 'law'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.terms' });
    return { title: t('title'), robots: { index: false, follow: true } };
}

export default async function TermsPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.terms' });
    const values = legalValues(locale);

    const sections = SECTIONS.map((id) => ({
        id,
        title: t(`${id}.title`),
        content: <p>{t.rich(`${id}.text`, values)}</p>,
    }));

    return <LegalDoc locale={locale} href='/menu/terms' sections={sections} />;
}
