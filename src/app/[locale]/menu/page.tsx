import type { Metadata } from 'next';
import { getLocaleFromParams } from '@/i18n/params';
import { getTranslations } from 'next-intl/server';
import { getHreflangLinks, generateJsonLd } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'MenuPage' });
    const languages = await getHreflangLinks('/menu');

    return {
        title: t('title'),
        description: t('description'),
        alternates: {
            canonical: languages[locale],
            languages,
        },
        openGraph: {
            title: t('title'),
            description: t('description'),
        },
    };
}

export default async function MenuPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'MenuPage' });
    const jsonLd = await generateJsonLd(locale, 'WebSite');

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
                }}
            />
            <h1>{t('title')}</h1>
        </main>
    );
}