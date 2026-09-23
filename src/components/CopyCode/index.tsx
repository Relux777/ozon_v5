// src/components/CopyCode/index.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
    code: string;
    /** подписи приходят с сервера — так клиентскому компоненту не нужны свои переводы */
    copyLabel: string;
    copiedLabel: string;
};

// «Таблетка» с кодом и кнопкой копирования. Оформление — классы promo-code / promo-copy в style.scss
export default function CopyCode({ code, copyLabel, copiedLabel }: Props) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // буфер обмена недоступен (http, запрет в браузере) — код всё равно виден на экране
        }
    }

    return (
        <div className="promo-code flex nowrap align-center justify-between gap-10 br-36 w-full">
            <code className="font-18 font-w-700 letter-s-12">{code}</code>
            <button type="button" className="promo-copy hover-none px-10 br-36 font-w-500 space-nowrap" onClick={copy}>
                {copied ? copiedLabel : copyLabel}
            </button>
            <span className="sr-only" role="status">
                {copied ? copiedLabel : ''}
            </span>
        </div>
    );
}
