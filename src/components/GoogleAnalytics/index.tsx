'use client';

import { useEffect, useState } from 'react';
import { CONSENT_CHANGE_EVENT, readConsent } from '@/lib/consent';

type GaWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };

// Google Analytics 4 — только с согласия («Принять» в CookieBanner), как и YandexMetrika. Без согласия gtag.js не
// загружается и cookie _ga* не ставятся; при отзыве согласия writeConsent удаляет их, а страница перезагружается,
// чтобы выгрузить работающий скрипт. Номер — GOOGLE_ANALYTICS_ID в config/legal.ts (пусто — компонента в layout нет).
// Переходы по страницам App Router GA4 считает сам: «улучшенная статистика» → «изменения в истории браузера»
// включены в потоке данных по умолчанию, поэтому page_view вручную не отправляем (иначе будут двойные просмотры).
export default function GoogleAnalytics({ id }: { id: string }) {
    const [enabled, setEnabled] = useState(false);

    useEffect(() => {
        const sync = () => {
            const allowed = readConsent() === 'all';
            if (!allowed && (window as GaWindow).gtag) window.location.reload();
            setEnabled(allowed);
        };
        sync();
        window.addEventListener(CONSENT_CHANGE_EVENT, sync);
        return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
    }, []);

    useEffect(() => {
        const w = window as GaWindow;
        if (!enabled || w.gtag) return;
        w.dataLayer = w.dataLayer || [];
        const dataLayer = w.dataLayer;
        // официальный код Google: в dataLayer кладётся именно объект arguments — массив gtag.js не примет
        w.gtag = function gtag() {
            // biome-ignore lint/complexity/noArguments: так требует gtag.js
            dataLayer.push(arguments);
        };
        w.gtag('js', new Date());
        w.gtag('config', id);
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
        document.head.appendChild(script);
    }, [enabled, id]);

    return null;
}
