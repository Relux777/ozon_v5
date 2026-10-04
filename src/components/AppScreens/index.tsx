// «Как выглядит приложение изнутри» — скриншоты Ozon Job в слайдере (components/ui/photo-slider).
// Сейчас на страницах городов (sklad/[city]), но от страницы не зависит — можно поставить и на главную.
// Тексты — AppScreens.* в messages/*.json (порядок items = порядок картинок SCREENS).
import { getFormatter, getTranslations } from 'next-intl/server';
import PhotoSlider, { type PhotoSlide, type PhotoSliderLabels } from '@/components/ui/photo-slider';
import type { AppLocale } from '@/i18n/routing';

// webp 1080×2337 (из исходных jpg 1170×2532, лежат рядом и в код не импортируются)
import Screen1 from '@/assets/img/slider/1.webp';
import Screen2 from '@/assets/img/slider/2.webp';
import Screen3 from '@/assets/img/slider/3.webp';
import Screen4 from '@/assets/img/slider/4.webp';
import Screen5 from '@/assets/img/slider/5.webp';
import Screen6 from '@/assets/img/slider/6.webp';
import Screen7 from '@/assets/img/slider/7.webp';

// главный экран, записи, склады, выбор дней, выбор времени, виды работ, выплаты
const SCREENS = [Screen1, Screen2, Screen3, Screen4, Screen5, Screen6, Screen7];

// когда сделаны скриншоты (суммы и тарифы на них — на эту дату, см. AppScreens.note)
export const APP_SCREENS_TAKEN_AT = '2026-10-04';

export const APP_SCREENS_ID = 'app';

type Props = { locale: AppLocale };

export default async function AppScreens({ locale }: Props) {
    const t = await getTranslations({ locale, namespace: 'AppScreens' });
    const format = await getFormatter({ locale });

    const items = t.raw('items') as { title: string; text: string; alt: string }[];
    const slides: PhotoSlide[] = SCREENS.map((src, i) => ({ src, ...items[i] }));
    // шаблоны с {n}/{total} подставляет сам слайдер — поэтому raw, без форматирования next-intl
    const labels = t.raw('slider') as PhotoSliderLabels;
    const date = format.dateTime(new Date(APP_SCREENS_TAKEN_AT), { dateStyle: 'long' });

    return (
        <section className='py-20 scroll-anchor' id={APP_SCREENS_ID}>
            <div className='container'>
                {/* на широком экране — текст слева, лента справа: активный слайд стоит по центру ленты,
                    и в одну колонку слева от первого фото оставалась бы половина пустого экрана */}
                <div className='flex align-center row-flush'>
                    <div className='f-w-4 mb-20'>
                        <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('eyebrow')}</p>
                        <h2 className='mb-7 color-2-90 text-balance'>{t('title')}</h2>
                        <p className='max-w-60-ch'>{t('lead')}</p>
                    </div>
                    <div className='f-w-8 mb-20'>
                        <PhotoSlider slides={slides} labels={labels} />
                    </div>
                </div>

                <p className='font-12'>{t('note', { date })}</p>
            </div>
        </section>
    );
}
