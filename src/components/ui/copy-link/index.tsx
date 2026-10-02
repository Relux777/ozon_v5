// src/components/ui/copy-link/index.tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
    /** что копировать: ссылку, адрес склада и т.п. */
    url: string;
    /** подписи приходят с сервера — так клиентскому компоненту не нужны свои переводы */
    copyLabel: string;
    copiedLabel: string;
    className?: string;
    /** иконка перед подписью (готовая разметка с сервера), необязательно */
    icon?: ReactNode;
};

// Кнопка «Скопировать …» — в отличие от CopyCode не показывает само значение:
// ссылка длинная, выводить её текстом незачем. Используется и для адресов складов на странице города.
export default function CopyLink({ url, copyLabel, copiedLabel, className, icon }: Props) {
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
            {icon}
            {copied ? copiedLabel : copyLabel}
        </button>
    );
}
