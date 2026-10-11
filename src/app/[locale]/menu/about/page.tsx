import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import LegalDoc from '@/components/LegalDoc';
import { legalValues } from '@/components/LegalDoc/rich';
import { DATA_UPDATED_AT, getCitiesWithWarehouses, getCityIndex, getNationalStats } from '@/lib/sklad';

// О проекте: кто ведёт сайт, откуда данные, как сайт зарабатывает. Тексты — LegalDocs.about (все 9 языков)

type Props = {
    params: Promise<{ locale: string }>;
};

const SECTIONS = ['what', 'sources', 'owner', 'money', 'cooperation'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.about' });
    return { title: t('title'), robots: { index: false, follow: true } };
}

export default async function AboutPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.about' });
    const format = await getFormatter({ locale });
    const values = {
        ...legalValues(locale),
        // «Откуда данные»: объём базы складов и дата выгрузки — из самих данных, чтобы текст не устаревал
        warehouses: getNationalStats().count,
        withData: getCitiesWithWarehouses().length,
        cities: getCityIndex(locale).length,
        date: format.dateTime(new Date(DATA_UPDATED_AT), { dateStyle: 'long' }),
    };

    const sections = SECTIONS.map((id) => ({
        id,
        title: t(`${id}.title`),
        content: <p>{t.rich(`${id}.text`, values)}</p>,
    }));

    return <LegalDoc locale={locale} href='/menu/about' sections={sections} />;
}
