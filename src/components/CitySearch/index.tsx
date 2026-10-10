// src/components/CitySearch/index.tsx
'use client';

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { CityIndexItem } from '@/lib/sklad';
import LocationSVG from '@/assets/svg/location.svg';
import CloseSVG from '@/assets/svg/x.svg';

// Поиск города на /sklad: большая строка поиска (клавиша «/» ставит в неё курсор), фильтр «Все / С адресами»,
// «Больше всего складов» (пока ничего не ищут), алфавитный указатель и список по буквам.
// Весь список рендерится на сервере (компонент клиентский, но первый HTML — полный): ссылки видны поисковикам без JS.

// ё = е и регистр не важны: «орел» находит «Орёл»
const normalize = (value: string) => value.toLowerCase().replaceAll('ё', 'е').trim();

// сколько городов в «Больше всего складов»
const POPULAR_LIMIT = 8;

type Filter = 'all' | 'data';

/**
 * Ссылка на город с предзагрузкой «по намерению». Обычный <Link> заранее скачивает данные КАЖДОЙ ссылки, попавшей
 * на экран: здесь их сотни по ~30 КБ — только при открытии страницы уходило ~440 КБ, а при прокрутке списка на
 * телефоне — мегабайты. Теперь данные города грузятся, когда к ссылке навели мышь, перешли Tab или коснулись её
 * (касание опережает переход на ~0,1–0,3 с) — приём из документации Next.js (prefetching → hover-triggered prefetch).
 */
function CityLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
    const [intent, setIntent] = useState(false);
    const onIntent = () => setIntent(true);

    return (
        <Link href={href} className={className} prefetch={intent ? null : false} onMouseEnter={onIntent} onFocus={onIntent} onTouchStart={onIntent}>
            {children}
        </Link>
    );
}

type Props = {
    cities: CityIndexItem[];
};

export default function CitySearch({ cities }: Props) {
    const t = useTranslations('SkladSearch');
    const locale = useLocale();
    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');
    const [filter, setFilter] = useState<Filter>('all');

    // запрос живёт в адресе (/sklad?q=казань): ссылкой на поиск можно поделиться, «назад» возвращает к нему,
    // а разметка WebSite → SearchAction на главной ведёт сюда же. На сервере страница статическая — q читаем в браузере
    useEffect(() => {
        const q = new URLSearchParams(window.location.search).get('q');
        if (q) setQuery(q);
    }, []);

    // «/» в любом месте страницы — курсор в поиск (как на GitHub/YouTube), если сейчас не печатают в другом поле
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey || target.closest('input, textarea, select, [contenteditable]')) return;
            e.preventDefault();
            inputRef.current?.focus();
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, []);

    const search = (value: string) => {
        setQuery(value);
        const url = new URL(window.location.href);
        if (value.trim()) url.searchParams.set('q', value);
        else url.searchParams.delete('q');
        window.history.replaceState(window.history.state, '', url);
    };

    const reset = () => {
        search('');
        setFilter('all');
        inputRef.current?.focus();
    };

    const sorted = useMemo(() => [...cities].sort((a, b) => a.name.localeCompare(b.name, locale)), [cities, locale]);
    const withData = useMemo(() => cities.filter((city) => city.count > 0).length, [cities]);
    const popular = useMemo(
        () =>
            cities
                .filter((city) => city.count > 0 && !city.region)
                .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, locale))
                .slice(0, POPULAR_LIMIT),
        [cities, locale],
    );

    // ищем и по названию на языке страницы, и по-русски: «Kazan» и «Казань» находят одно и то же
    const needle = normalize(query);
    const visible = sorted.filter(
        (city) => (filter === 'all' || city.count > 0) && (!needle || normalize(city.name).includes(needle) || normalize(city.search).includes(needle)),
    );

    // по первой букве — для указателя и заголовков групп
    const groups: { letter: string; items: CityIndexItem[] }[] = [];
    for (const city of visible) {
        const letter = city.name.charAt(0).toLocaleUpperCase(locale);
        const last = groups[groups.length - 1];
        if (last?.letter === letter) last.items.push(city);
        else groups.push({ letter, items: [city] });
    }

    const showPopular = !needle && popular.length > 0;

    return (
        <div className='city-search'>
            {/* ── Строка поиска ──────────────────────────────────────────────────────────────────── */}
            <label htmlFor={inputId} className='sr-only'>
                {t('label')}
            </label>
            <div className='city-search-box flex nowrap align-center gap-10 h-60 br-36 bg-3-100 border-1px-2-10 shadow-3'>
                <svg className='city-search-icon shrink-0' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round' aria-hidden='true'>
                    <circle cx='11' cy='11' r='7' />
                    <path d='m20 20-3.5-3.5' />
                </svg>
                <input
                    ref={inputRef}
                    id={inputId}
                    className='city-search-input flex-1 h-full'
                    type='search'
                    value={query}
                    onChange={(event) => search(event.target.value)}
                    placeholder={t('placeholder')}
                    autoComplete='off'
                    enterKeyHint='search'
                />
                {query ? (
                    <button type='button' className='city-search-clear grid place-center w-36 h-36 br-round shrink-0 hover-none' aria-label={t('clear')} onClick={reset}>
                        <CloseSVG width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                    </button>
                ) : (
                    <kbd className='city-search-kbd none-max-990 shrink-0' title={t('hotkey')}>
                        /
                    </kbd>
                )}
            </div>

            {/* ── Фильтр и число найденных ───────────────────────────────────────────────────────── */}
            <div className='flex align-center justify-between gap-10 mt-15 mb-20'>
                <fieldset className='city-filter inline-flex nowrap gap-2 br-36'>
                    <legend className='sr-only'>{t('filterLabel')}</legend>
                    {(['all', 'data'] as const).map((value) => (
                        <button
                            type='button'
                            className='city-filter-btn inline-flex nowrap align-center gap-7 h-36 px-16 br-36 font-14 font-w-500 hover-none'
                            aria-pressed={filter === value}
                            onClick={() => setFilter(value)}
                            key={value}
                        >
                            {value === 'all' ? t('filterAll') : t('filterData')}
                            <span className='city-filter-count font-12'>{value === 'all' ? cities.length : withData}</span>
                        </button>
                    ))}
                </fieldset>
                {/* <output> — живой регион (роль status): число найденных городов объявляется по мере ввода */}
                <output className='font-14 color-2-80'>{visible.length > 0 ? t('found', { count: visible.length }) : ''}</output>
            </div>

            {/* ── Больше всего складов: пока ничего не ищут ─────────────────────────────────────── */}
            {showPopular && (
                <section className='mb-20' aria-labelledby={`${inputId}-popular`}>
                    <h2 className='city-section-title color-2-90 mb-10' id={`${inputId}-popular`}>
                        {t('popular')}
                    </h2>
                    <ul className='city-popular grid gap-10'>
                        {popular.map(({ slug, name, count }, i) => (
                            <li key={slug}>
                                <CityLink href={`/sklad/${slug}`} className='city-top hover-none grid gap-8 h-full pd-15 br-20 bg-3-100 border-1px-2-10 shadow-3'>
                                    <span className='flex nowrap align-center justify-between gap-8'>
                                        <span className='city-top-rank font-12 font-w-700'>{String(i + 1).padStart(2, '0')}</span>
                                        <span className='city-pill inline-flex nowrap align-center px-10 py-4 br-36 font-12 font-w-500'>{t('count', { count })}</span>
                                    </span>
                                    <span className='city-top-name font-16 font-w-700'>{name}</span>
                                </CityLink>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* ── Алфавитный указатель: ссылки на буквы, на телефоне листается вбок ──────────────── */}
            {groups.length > 1 && (
                <nav className='city-abc mb-15' aria-label={t('alphabet')}>
                    <ul className='flex nowrap gap-4 overflow-auto scrollbar-none'>
                        {groups.map(({ letter }, i) => (
                            <li className='shrink-0' key={letter}>
                                <a href={`#city-letter-${i}`} className='city-abc-link grid place-center w-36 h-36 br-round font-14 font-w-500 hover-none'>
                                    {letter}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* ── Список по буквам ───────────────────────────────────────────────────────────────── */}
            {groups.length > 0 && filter === 'all' && <p className='font-12 color-2-80 mb-15'>{t('legend')}</p>}
            {groups.length > 0 ? (
                <div className='grid gap-20'>
                    {groups.map(({ letter, items }, i) => (
                        <section className='city-group scroll-anchor' id={`city-letter-${i}`} aria-labelledby={`city-letter-${i}-title`} key={letter}>
                            <h2 className='city-letter flex nowrap align-center gap-10 mb-10' id={`city-letter-${i}-title`}>
                                {letter}
                                <span className='city-letter-line flex-1' aria-hidden='true' />
                            </h2>
                            <ul className='city-grid grid gap-8'>
                                {items.map(({ slug, name, count, region }) => (
                                    <li key={slug}>
                                        <CityLink
                                            href={`/sklad/${slug}`}
                                            className={`city-row${count > 0 ? ' has-data' : ''} hover-none flex nowrap align-center gap-10 h-full px-16 py-5 br-20`}
                                        >
                                            <LocationSVG className='city-row-icon shrink-0' width={18} height={18} viewBox='0 0 24 24' aria-hidden='true' />
                                            <span className='grid flex-1'>
                                                <span className='city-row-name font-w-500'>{name}</span>
                                                {region && <span className='font-12 color-2-80'>{t('region')}</span>}
                                            </span>
                                            {count > 0 ? (
                                                <span className='city-pill shrink-0 inline-flex nowrap align-center px-10 py-4 br-36 font-12 font-w-500'>{t('count', { count })}</span>
                                            ) : (
                                                // «адреса уточняются» — одной строкой над списком (legend); здесь — только для скринридера
                                                <span className='sr-only'>{t('noData')}</span>
                                            )}
                                        </CityLink>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            ) : (
                <div className='city-empty grid gap-10 justify-i-center text_center pd-20 br-20 bg-3-100 border-1px-2-10'>
                    <LocationSVG className='city-empty-icon' width={40} height={40} viewBox='0 0 24 24' aria-hidden='true' />
                    <p className='md-0 font-16 color-2-90'>{t('empty')}</p>
                    <button type='button' className='source-chip hover-none h-46 px-24 br-36 font-w-500' onClick={reset}>
                        {t('showAll')}
                    </button>
                </div>
            )}
        </div>
    );
}
