// src/components/ui/copy-code/index.tsx
'use client';

import { useTranslations } from 'next-intl';
import { useAlert } from '../alert';

type Props = {
    code: string;
    /** подписи приходят с сервера — так клиентскому компоненту не нужны свои переводы */
    copyLabel: string;
    /** заголовок уведомления после копирования («Скопировано»); второй строкой в нём — сам код */
    copiedLabel: string;
};

// «Таблетка» с кодом и кнопкой копирования. Оформление — классы promo-code / promo-copy в style.scss.
// Результат — уведомлением ui/alert (и для скринридера тоже), подпись кнопки не меняется
export default function CopyCode({ code, copyLabel, copiedLabel }: Props) {
    const alert = useAlert();
    const t = useTranslations('A11y');

    async function copy() {
        try {
            await navigator.clipboard.writeText(code);
            alert.show({ id: `copy:${code}`, title: copiedLabel, text: code });
        } catch {
            // буфер обмена недоступен (http, запрет в браузере) — код всё равно виден на экране
            alert.show({ id: `copy:${code}`, type: 'error', title: t('copyFailed'), text: code });
        }
    }

    return (
        <div className="promo-code flex nowrap align-center justify-between gap-10 br-36 w-full">
            <code className="font-18 font-w-700 letter-s-12">{code}</code>
            <button type="button" className="promo-copy hover-none px-10 br-36 font-w-500 space-nowrap active_scale_098" onClick={copy}>
                {copyLabel}
            </button>
        </div>
    );
}
