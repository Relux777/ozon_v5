// src/components/ui/copy-link/index.tsx
'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { useAlert } from '../alert';

type Props = {
    /** что копировать: ссылку, адрес склада и т.п. */
    url: string;
    /** подписи приходят с сервера — так клиентскому компоненту не нужны свои переводы */
    copyLabel: string;
    /** заголовок уведомления после копирования («Адрес скопирован»); второй строкой в нём — скопированный текст */
    copiedLabel: string;
    className?: string;
    /** иконка перед подписью (готовая разметка с сервера), необязательно */
    icon?: ReactNode;
};

// Кнопка «Скопировать …» — в отличие от CopyCode не показывает само значение:
// ссылка длинная, выводить её текстом незачем. Используется и для адресов складов на странице города.
// Результат — уведомлением ui/alert (оно же объявляется скринридеру), подпись кнопки не меняется
export default function CopyLink({ url, copyLabel, copiedLabel, className, icon }: Props) {
    const alert = useAlert();
    const t = useTranslations('A11y');

    async function copy() {
        try {
            await navigator.clipboard.writeText(url);
            alert.show({ id: `copy:${url}`, title: copiedLabel, text: url });
        } catch {
            // буфер обмена недоступен — рядом есть кнопка «Открыть ссылку» / «На карте»
            alert.show({ id: `copy:${url}`, type: 'error', title: t('copyFailed'), text: url });
        }
    }

    return (
        <button type="button" className={className} onClick={copy}>
            {icon}
            {copyLabel}
        </button>
    );
}
