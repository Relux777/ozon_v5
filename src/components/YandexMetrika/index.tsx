'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_CHANGE_EVENT, readConsent } from '@/lib/consent';

type Ym = ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
type MetrikaWindow = Window & { ym?: Ym };

// Яндекс Метрика — только с согласия («Принять» в CookieBanner). Без согласия скрипт не загружается и cookie
// аналитики не ставятся; при отзыве согласия writeConsent удаляет cookie _ym_*, а страница перезагружается,
// чтобы выгрузить уже работающий счётчик. Номер счётчика — YANDEX_METRIKA_ID в config/legal.ts (пусто — компонента
// в layout нет). Вебвизор выключен: он записывает действия на странице — это лишние персональные данные.
export default function YandexMetrika({ id }: { id: string }) {
    const pathname = usePathname();
    const [enabled, setEnabled] = useState(false);
    const lastPath = useRef<string>(null);
    const lastUrl = useRef('');

    useEffect(() => {
        const sync = () => {
            const allowed = readConsent() === 'all';
            // согласие отозвали, а счётчик уже работает — выгрузить его можно только перезагрузкой
            if (!allowed && (window as MetrikaWindow).ym) window.location.reload();
            setEnabled(allowed);
        };
        sync();
        window.addEventListener(CONSENT_CHANGE_EVENT, sync);
        return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
    }, []);

    // загрузка счётчика (официальный код Метрики, переписанный без eval); первый просмотр он отправит сам
    useEffect(() => {
        const w = window as MetrikaWindow;
        if (!enabled || w.ym) return;
        // очередь вызовов до загрузки tag.js — скрипт заберёт её из ym.a
        const queue: unknown[] = [];
        const ym: Ym = (...args: unknown[]) => {
            queue.push(args);
        };
        ym.a = queue;
        ym.l = Date.now();
        w.ym = ym;
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://mc.yandex.ru/metrika/tag.js';
        document.head.appendChild(script);
        ym(Number(id), 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: false });
        lastPath.current = pathname;
        lastUrl.current = window.location.href;
    }, [enabled, id, pathname]);

    // переходы внутри сайта без перезагрузки страницы (App Router) — отдельный просмотр, откуда пришли — прошлая страница
    useEffect(() => {
        const w = window as MetrikaWindow;
        if (!enabled || !w.ym || lastPath.current === pathname) return;
        lastPath.current = pathname;
        w.ym(Number(id), 'hit', window.location.href, { referer: lastUrl.current });
        lastUrl.current = window.location.href;
    }, [enabled, id, pathname]);

    return null;
}
