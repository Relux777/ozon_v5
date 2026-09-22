// src/components/CopyLink/index.tsx
'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
    url: string;
    /** подписи приходят с сервера — так клиентскому компоненту не нужны свои переводы */
    copyLabel: string;
    copiedLabel: string;
    className?: string;
};

// Кнопка «Скопировать ссылку» — в отличие от CopyCode не показывает само значение:
// ссылка длинная, выводить её текстом незачем.
export default function CopyLink({ url, copyLabel, copiedLabel, className }: Props) {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timer.current), []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // буфер обмена недоступен — рядом есть кнопка «Открыть ссылку»
        }
    }

    return (
        <button type="button" className={className} onClick={copy} aria-live="polite">
            {copied ? copiedLabel : copyLabel}
        </button>
    );
}
