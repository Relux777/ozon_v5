// «Склады Ozon в вашем городе» на главной: ссылки на страницы городов с наибольшим числом складов в базе.
// Даёт главной прямые ссылки на страницы городов (раньше до них можно было дойти только через /sklad)
// и человеку — короткий путь к своему городу. Тексты — HomePage.cities.*, подпись числа складов — SkladSearch.count.
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { AppLocale } from '@/i18n/routing';
import { getCitiesWithWarehouses, getCityIndex, getCityName } from '@/lib/sklad';
import LocationSVG from '@/assets/svg/location.svg';
import MapSVG from '@/assets/svg/sklad/map.svg';

// сколько городов показать: города с большим числом складов, без регионов (у них свои страницы, но в «популярном»
// человек ищет свой город)
const LIMIT = 12;

export const POPULAR_CITIES_ID = 'cities';

export default async function PopularCities({ locale }: { locale: AppLocale }) {
    const t = await getTranslations({ locale, namespace: 'HomePage' });
    const tSearch = await getTranslations({ locale, namespace: 'SkladSearch' });

    const withWarehouses = getCitiesWithWarehouses();
    const cities = withWarehouses
        .filter((city) => !city.region)
        .sort((a, b) => b.warehouses.length - a.warehouses.length || a.name.localeCompare(b.name, 'ru'))
        .slice(0, LIMIT);

    return (
        <section className='py-20 scroll-anchor' id={POPULAR_CITIES_ID}>
            <div className='container'>
                <p className='color-5-100 text-uppercase font-w-500 letter-s-8 mb-7'>{t('cities.eyebrow')}</p>
                <h2 className='mb-7 color-2-90 text-balance'>{t('cities.title')}</h2>
                <p className='max-w-60-ch mb-20'>{t('cities.lead', { count: withWarehouses.length, total: getCityIndex(locale).length })}</p>
                {/* на широком экране — ряд чипов; на телефоне — ровная сетка в две колонки (.city-chips в style.scss) */}
                <ul className='city-chips flex gap-8 mb-15'>
                    {cities.map((city) => (
                        <li key={city.slug}>
                            <Link
                                href={`/sklad/${city.slug}`}
                                className='city-chip source-chip hover-none inline-flex nowrap align-center gap-8 h-46 px-16 br-36 font-14 font-w-500'
                            >
                                <LocationSVG className='shrink-0' width={16} height={16} viewBox='0 0 24 24' aria-hidden='true' />
                                <span className='city-chip-text'>
                                    <span className='truncate'>{getCityName(city, locale)}</span>
                                    <span className='font-12 font-w-400 opacity-90'>{tSearch('count', { count: city.warehouses.length })}</span>
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <Link href='/sklad' className='inline-flex nowrap align-center gap-8 color-5-100 font-w-500 hover-80'>
                    <MapSVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                    {t('cities.all')} →
                </Link>
            </div>
        </section>
    );
}
