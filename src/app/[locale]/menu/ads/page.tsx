import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import LegalDoc from '@/components/LegalDoc';
import { legalValues } from '@/components/LegalDoc/rich';

// Раскрытие рекламы в одном месте: что на сайте реклама, кто рекламодатель, кто её распространяет и как
// маркируется (ФЗ «О рекламе», ст. 18.1). Пометки «Реклама» стоят и у самих ссылок (#promo/#card на главной, /stocks).
// Тексты — LegalDocs.ads (все 9 языков)

type Props = {
    params: Promise<{ locale: string }>;
};

const KINDS = ['job', 'bank', 'blogger'] as const;
const SECTIONS = ['reward', 'distributor', 'partners'] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.ads' });
    return { title: t('title'), robots: { index: false, follow: true } };
}

export default async function AdsPage({ params }: Props) {
    const locale = await getLocaleFromParams(params);
    const t = await getTranslations({ locale, namespace: 'LegalDocs.ads' });
    const values = legalValues(locale);

    const sections = [
        {
            id: 'kinds',
            title: t('kinds.title'),
            content: (
                <>
                    <p>{t('kinds.intro')}</p>
                    <ul className='legal-list grid gap-5'>
                        {KINDS.map((key) => (
                            <li key={key}>{t.rich(`kinds.items.${key}`, values)}</li>
                        ))}
                    </ul>
                </>
            ),
        },
        ...SECTIONS.map((id) => ({
            id,
            title: t(`${id}.title`),
            content: <p>{t.rich(`${id}.text`, values)}</p>,
        })),
    ];

    return <LegalDoc locale={locale} href='/menu/ads' sections={sections} />;
}
