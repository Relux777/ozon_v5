// Тестовый компонент: промокод + кнопка «Скопировать». Без переводов — текст прямо в разметке.
'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './copy-code.module.scss';

export default function CopyCode({ code }: { code: string }) {
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
            // буфер обмена недоступен — код всё равно виден на экране
        }
    }

    return (
        <div className={`flex nowrap align-center gap-10 ${styles.box}`}>
            <code className={styles.code}>{code}</code>
            <button type="button" className={styles.button} onClick={copy} aria-live="polite">
                {copied ? 'Скопировано ✓' : 'Скопировать'}
            </button>
        </div>
    );
}
