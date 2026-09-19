import type { Metadata } from 'next';
import { getLocaleFromParams } from '@/i18n/params';
import { getTranslations } from 'next-intl/server';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
    params: Promise<{ locale: string }>;
};

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

    return (
        <main>
            <h1>{t('title')}</h1>
        </main>
    );
}
