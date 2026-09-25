'use client';

import { useEffect, useRef, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { CONSENT_OPEN_EVENT, readConsent, writeConsent, type Consent } from '@/lib/consent';
// Boxicons (Free, CC BY 4.0, https://boxicons.com)
import CookieSVG from '@/assets/svg/support/cookie.svg';

type Props = {
    /** подписи приходят с сервера (layout) — клиентскому компоненту не нужны свои переводы */
    labels: { title: string; text: string; more: string; accept: string; decline: string };
};

// сколько длится анимация скрытия (.cookie-banner-closing в style.scss)
const CLOSE_MS = 250;

// Уведомление о cookie (152-ФЗ): пока посетитель не выбрал, аналитика не загружается (см. YandexMetrika).
// «Принять» и «Отклонить» одинаковые по виду — отказ не прячем; закрыть без выбора нельзя (закрытие — не согласие).
// В серверном HTML баннера нет: выбор хранится в cookie, а читать её на сервере — значит сделать все страницы
// динамическими. Баннер появляется после загрузки поверх страницы (p-fixed) и вёрстку не сдвигает.
export default function CookieBanner({ labels }: Props) {
    const [state, setState] = useState<'hidden' | 'open' | 'closing'>('hidden');
    const ref = useRef<HTMLElement>(null);
    const focusOnOpen = useRef(false);

    useEffect(() => {
        if (!readConsent()) setState('open');

        // «Изменить выбор cookie» на странице /menu/cookies
        const onOpen = () => {
            focusOnOpen.current = true;
            setState('open');
        };
        window.addEventListener(CONSENT_OPEN_EVENT, onOpen);
        return () => window.removeEventListener(CONSENT_OPEN_EVENT, onOpen);
    }, []);

    useEffect(() => {
        // открыли кнопкой — переводим фокус в баннер; при первом показе фокус у страницы не забираем
        if (state === 'open' && focusOnOpen.current) {
            focusOnOpen.current = false;
            ref.current?.focus();
        }
        if (state !== 'closing') return;
        const timer = setTimeout(() => setState('hidden'), CLOSE_MS);
        return () => clearTimeout(timer);
    }, [state]);

    if (state === 'hidden') return null;

    const choose = (value: Consent) => {
        writeConsent(value);
        setState('closing');
    };

    return (
        <section
            ref={ref}
            tabIndex={-1}
            aria-labelledby='cookie-banner-title'
            className={`cookie-banner p-fixed z-30 grid gap-12 pd-15 br-20 bg-3-100 border-1px-2-10 shadow-5${state === 'closing' ? ' cookie-banner-closing' : ''}`}
        >
            <div className='flex nowrap align-start gap-12'>
                <span className='icon-badge grid place-center w-36 h-36 br-round shrink-0' aria-hidden='true'>
                    <CookieSVG width={20} height={20} viewBox='0 0 24 24' />
                </span>
                <div className='grid gap-2'>
                    <b className='color-2-90' id='cookie-banner-title'>{labels.title}</b>
                    <p className='md-0 font-14'>
                        {labels.text}{' '}
                        <Link href='/menu/cookies' className='color-5-100'>{labels.more}</Link>
                    </p>
                </div>
            </div>
            <div className='flex nowrap gap-8'>
                <button type='button' className='cookie-btn hover-none flex-1 h-46 px-16 br-36 font-w-500' onClick={() => choose('necessary')}>
                    {labels.decline}
                </button>
                <button type='button' className='cookie-btn hover-none flex-1 h-46 px-16 br-36 font-w-500' onClick={() => choose('all')}>
                    {labels.accept}
                </button>
            </div>
        </section>
    );
}
