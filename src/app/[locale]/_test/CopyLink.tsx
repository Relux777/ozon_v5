// Тестовый компонент: кнопка «Скопировать ссылку» (в отличие от CopyCode — без видимого значения,
// ссылка длинная и показывать её целиком незачем). Без переводов — текст прямо в разметке.
'use client';

import { useEffect, useRef, useState } from 'react';

export default function CopyLink({ url, className = '' }: { url: string; className?: string }) {
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
            // буфер обмена недоступен — тогда воспользуйтесь кнопкой «Открыть ссылку» рядом
        }
    }

    return (
        <button type="button" className={className} onClick={copy} aria-live="polite">
            {copied ? 'Скопировано ✓' : 'Скопировать ссылку'}
        </button>
    );
}
