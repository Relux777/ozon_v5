// src/components/CitySearch/index.tsx
'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CityIndexItem } from '@/lib/sklad';

// ё = е и регистр не важны: «орел» находит «Орёл»
const normalize = (value: string) => value.toLowerCase().replaceAll('ё', 'е').trim();

type Props = {
    cities: CityIndexItem[];
};

export default function CitySearch({ cities }: Props) {
    const t = useTranslations('SkladSearch');
    const inputId = useId();
    const [query, setQuery] = useState('');

    const needle = normalize(query);
    const visible = needle ? cities.filter((city) => normalize(city.name).includes(needle)) : cities;

    return (
        <div>
            <div className="mb-15">
                <label htmlFor={inputId} className="block mb-7 font-w-500">
                    {t('label')}
                </label>
                <input
                    id={inputId}
                    className="search-input w-full h-46 px-16 br-36 bg-2-3 blur-7 touch-no-blur border-1px-2-10 shadow-3"
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('placeholder')}
                    autoComplete="off"
                    enterKeyHint="search"
                />
            </div>

            <p className="mb-20 color-2-80" role="status" aria-live="polite">
                {visible.length > 0 ? t('found', { count: visible.length }) : t('empty')}
            </p>

            {/* Весь список рендерится на сервере: ссылки видны поисковикам без JS.
                touch-no-blur: 418 «стеклянных» ссылок на телефоне = 418 backdrop-filter на каждом кадре прокрутки */}
            <ul className="flex row-flush" aria-label={t('listLabel')}>
                {visible.map(({ slug, name, count }) => (
                    <li key={slug} className="f-w-3 mb-15">
                        <Link
                            href={`/sklad/${slug}`}
                            className="flex nowrap justify-between border-1px-2-10 align-center bg-2-3 blur-7 touch-no-blur pd-10 shadow-3 br-36 text_center translate_0_5 tr-2 cursor-pointer"
                        >
                            <span className="font-w-500 color-2-90">{name}</span>
                            {count > 0 ? (
                                <span className="shrink-0 inline-flex align-center px-10 py-4 br-36 bg-5-10 color-5-100 font-12">
                                    {t('count', { count })}
                                </span>
                            ) : (
                                <span className="shrink-0 color-2-80 font-12">{t('noData')}</span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
