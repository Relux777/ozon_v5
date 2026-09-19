import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { buildPageMetadata, generateJsonLd } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

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

    const jsonLd = generateJsonLd(locale, 'WebSite', {
        name: tMeta('siteName'),
        description: t('description'),
    });

    return (
        <main>
            <JsonLd data={jsonLd} />
            <section>
                <div className="container flex align-center">
                    <div className="f-w-8">
                        <p className="color-5-100">{tMeta('siteName')}</p>

                        <h1 className="font-36">{t('heading')}</h1>

                        <p>{t('lead')}</p>

                        <ul>
                            {features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>
            <section>
                123
            </section>
        </main>
    );
}
