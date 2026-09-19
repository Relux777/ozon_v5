// src/components/CitySearch/index.tsx
'use client';

import { useId, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CityIndexItem } from '@/lib/sklad';
import styles from './city-search.module.scss';

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
                    className={`w-full br-20 bg-3-100 border-1px-2-20 ${styles.input}`}
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={t('placeholder')}
                    autoComplete="off"
                    enterKeyHint="search"
                />
            </div>

            <p className="mb-15 color-2-80" role="status" aria-live="polite">
                {visible.length > 0 ? t('found', { count: visible.length }) : t('empty')}
            </p>

            {/* Весь список рендерится на сервере: ссылки видны поисковикам без JS */}
            <ul className={`flex ${styles.row}`} aria-label={t('listLabel')}>
                {visible.map(({ slug, name, count }) => (
                    <li key={slug} className={`f-w-4 mb-7 ${styles.cell}`}>
                        <Link
                            href={`/sklad/${slug}`}
                            className="flex nowrap justify-between align-center gap-10 pd-10 br-20 bg-3-100 border-1px-2-10"
                        >
                            <span className="font-w-500">{name}</span>
                            {count > 0 ? (
                                <span className={`color-5-100 ${styles.badge}`}>{t('count', { count })}</span>
                            ) : (
                                <span className={`color-2-80 ${styles.muted}`}>{t('noData')}</span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
