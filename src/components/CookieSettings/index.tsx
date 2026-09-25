'use client';

import { useEffect, useState } from 'react';
import { CONSENT_CHANGE_EVENT, openCookieSettings, readConsent, type Consent } from '@/lib/consent';

type Props = {
    /** подписи приходят с сервера — клиентскому компоненту не нужны свои переводы */
    labels: { button: string; all: string; necessary: string; none: string };
};

// «Изменить выбор cookie» — отзыв согласия (ч. 2 ст. 9 152-ФЗ) в любой момент: открывает баннер заново.
// Рядом — текущий выбор, чтобы было видно, что сейчас разрешено
export default function CookieSettings({ labels }: Props) {
    const [consent, setConsent] = useState<Consent | null>(null);

    useEffect(() => {
        const sync = () => setConsent(readConsent());
        sync();
        window.addEventListener(CONSENT_CHANGE_EVENT, sync);
        return () => window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
    }, []);

    return (
        <div className='flex align-center gap-12'>
            <button
                type='button'
                className='cookie-btn hover-none inline-flex nowrap align-center h-46 px-24 br-36 font-w-500'
                onClick={openCookieSettings}
            >
                {labels.button}
            </button>
            <span className='font-14 color-2-80' aria-live='polite'>
                {consent ? labels[consent] : labels.none}
            </span>
        </div>
    );
}
