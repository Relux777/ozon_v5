// src/components/CitySearch/index.tsx
'use client';

import { useEffect, useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CityIndexItem } from '@/lib/sklad';

// ё = е и регистр не важны: «орел» находит «Орёл»
const normalize = (value: string) => value.toLowerCase().replaceAll('ё', 'е').trim();

// после этого скролла строка поиска сжимается и прилипает под шапкой
const COMPACT_SCROLL_Y = 80;

type Props = {
    cities: CityIndexItem[];
};

export default function CitySearch({ cities }: Props) {
    const t = useTranslations('SkladSearch');
    const inputId = useId();
    const [query, setQuery] = useState('');
    const [compact, setCompact] = useState(false);

    useEffect(() => {
        const onScroll = () => setCompact(window.scrollY > COMPACT_SCROLL_Y);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const needle = normalize(query);
    const visible = needle ? cities.filter((city) => normalize(city.name).includes(needle)) : cities;

    return (
        <div>
            <div className={`search-bar p-sticky z-10 mb-15${compact ? ' search-bar-compact' : ''}`}>
                <label htmlFor={inputId} className='search-label block mb-7 font-w-500'>
                    {t('label')}
                </label>
                <input
                    id={inputId}
                    className='search-input w-full br-36 bg-3-100 border-1px-2-20'
                    type='search'
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('placeholder')}
                    autoComplete='off'
                    enterKeyHint='search'
                />
            </div>

            <p className='mb-15 color-2-80' role='status' aria-live='polite'>
                {visible.length > 0 ? t('found', { count: visible.length }) : t('empty')}
            </p>

            {/* Весь список рендерится на сервере: ссылки видны поисковикам без JS */}
            <ul className='flex row-flush' aria-label={t('listLabel')}>
                {visible.map(({ slug, name, count }) => (
                    <li key={slug} className='city-cell f-w-4 mb-15'>
                        <Link href={`/sklad/${slug}`} className='block h-full hover-none'>
                            <div className='flex nowrap justify-between align-center gap-10 h-full pd-20 br-20 bg-3-100 border-1px-2-10 shadow-3 translate_0_5 tr-2'>
                                <span className='font-w-500 color-2-90'>{name}</span>
                                {count > 0 ? (
                                    <span className='shrink-0 inline-flex align-center px-10 py-4 br-36 bg-5-10 color-5-100 font-12'>
                                        {t('count', { count })}
                                    </span>
                                ) : (
                                    <span className='shrink-0 color-2-80 font-12'>{t('noData')}</span>
                                )}
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
