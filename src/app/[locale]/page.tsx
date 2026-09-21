import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLocaleFromParams } from '@/i18n/params';
import { buildPageMetadata, generateJsonLd } from '@/lib/seo';
import JsonLd from '@/components/JsonLd';

import Image from 'next/image';
import AdvantagesPhoto1  from '@/assets/img/advantages/1.png';
import AdvantagesPhoto2  from '@/assets/img/advantages/2.png';
import AdvantagesPhoto3  from '@/assets/img/advantages/3.png';
import AdvantagesPhoto4  from '@/assets/img/advantages/4.png';
import AdvantagesPhoto5  from '@/assets/img/advantages/5.png';
import AdvantagesPhoto6  from '@/assets/img/advantages/6.png';

// Порядок картинок = порядок элементов HomePage.stats в messages/*.json
const STAT_IMAGES = [
    AdvantagesPhoto1,
    AdvantagesPhoto2,
    AdvantagesPhoto3,
    AdvantagesPhoto4,
    AdvantagesPhoto5,
    AdvantagesPhoto6,
];

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
    const stats = t.raw('stats') as { value: string; label: string }[];

    const jsonLd = generateJsonLd(locale, 'WebSite', {
        name: tMeta('siteName'),
        description: t('description'),
    });

    return (
        <main className='home_page'>
            <JsonLd data={jsonLd} />
            <section>
                <div className="container flex align-center">
                    <div className="f-w-8">
                        <p className="color-5-100 font-14">{tMeta('siteName')}</p>
                        <h1 className="color-2-90">{t('heading')}</h1>
                        <p className='font-16 max-w-60-ch'>{t('lead')}</p>
                        <ul className='font-14 checks-li grid gap-7 mb-20'>
                            {features.map((feature) => (
                                <li className='p-relative pl-30' key={feature}>{feature}</li>
                            ))}
                        </ul>
                        <div className='flex gap-15'>
                            <button className='bg-5-100 hover-none hover-bg-5-80 br-36 h-46 px-24 color-6-100 translate_0_2 shadow-1'>Выбрать город</button>
                            <button className='bg-2-7 hover-none br-36 h-46 px-24 color-2-100 translate_0_2 blur-7 shadow-3'>Получить 2 000 ₽</button>
                        </div>
                    </div>
                    <div className="f-w-4">
11
                    </div>
                </div>
            </section>
            <section>
                <div className="container">
                    <div className='flex'>
                        {stats.map(({ value, label }, i) => (
                            <div className='f-w-2 f-h-4' key={label}>
                                <div className='bg-2-3 blur-7 pd-10 shadow-3 br-36 text_center translate_0_5 tr-2 cursor-pointer'>
                                    <Image className='mb-10' src={STAT_IMAGES[i]} width={100} height={100} alt="" />
                                    <h3>{value}</h3>
                                    <p className='mt-7'>{label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <p>1</p>
                <p>1</p>
                <p>1</p>
                <p>1</p>
            </section>
        </main>
    );
}
