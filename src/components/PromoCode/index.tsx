// src/components/PromoCode/index.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import styles from './promo.module.scss';

type Props = {
    code: string;
    /** сколько получает пользователь, ₽ */
    amount: number;
    /** ссылка на скачивание приложения; без неё кнопка не показывается */
    appUrl?: string;
};

export default function PromoCode({ code, amount, appUrl }: Props) {
    const t = useTranslations('Promo');
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
        <aside className="bg-3-100 br-20 pd-20 border-1px-2-10 mb-15">
            <h2 className="font-24 mb-7">{t('title')}</h2>
            <p className="mb-15">{t('text', { amount })}</p>

            <div className="flex align-center gap-10 mb-15">
                <span className="color-2-80">{t('codeLabel')}</span>
                <code className={`br-8 bg-2-10 font-w-500 ${styles.code}`}>{code}</code>
                <button type="button" className={`br-36 bg-2-10 ${styles.button}`} onClick={copy} aria-live="polite">
                    {copied ? t('copied') : t('copy')}
                </button>
                {appUrl && (
                    <a
                        className={`br-36 ${styles.button} ${styles.primary}`}
                        href={appUrl}
                        target="_blank"
                        rel="sponsored nofollow noopener noreferrer"
                    >
                        {t('download')}
                    </a>
                )}
            </div>

            <p className={`color-2-80 ${styles.note}`}>{t('disclosure')}</p>
        </aside>
    );
}
