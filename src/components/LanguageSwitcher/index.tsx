// src/components/LanguageSwitcher/index.tsx
'use client';

import { useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import ChevronDown from '@/assets/svg/chevron-down.svg';

const Modal = dynamic(() => import('@/components/ui/modal'));

type LanguageModalProps = { title: string };
const LanguageModal = dynamic<LanguageModalProps>(
    () => import('@/components/LanguageSwitcher/LanguageModal')
);
// тот же модуль — тот же чанк: вызов заранее просто прогревает его к моменту клика
const preloadLanguageModal = () => import('@/components/LanguageSwitcher/LanguageModal');

type Props = {
    modalTitle: string;
    /** название и флаг текущего языка рендерит сервер (Header) — флаги не попадают в общий клиентский JS */
    label: string;
    flag: ReactNode;
};

export default function LanguageSwitcher({ modalTitle, label, flag }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    // Список языков рендерим только после первого открытия: в нём названия на 7 алфавитах, и даже
    // скрытый (visibility:hidden) он заставлял браузер на КАЖДОЙ странице качать грузинский, армянский
    // и расширенные начертания шрифтов. Код списка подгружаем заранее — при наведении/касании кнопки.
    const [wasOpened, setWasOpened] = useState(false);
    const t = useTranslations('A11y');

    const open = () => {
        setWasOpened(true);
        setIsModalOpen(true);
    };

    const preload = () => {
        void preloadLanguageModal();
    };

    return (
        <div className='language'>
            <button
                type="button"
                className='flex align-center gap-5 hover-80'
                onClick={open}
                onPointerEnter={preload}
                onFocus={preload}
                aria-label={`${t('chooseLanguage')}: ${label}`}
                aria-haspopup="dialog"
            >
                {flag}
                <span className='none-max-360' aria-hidden="true">{label}</span>
                <ChevronDown width={20} height={20} viewBox="0 0 24 24" aria-hidden="true" />
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ariaLabel={modalTitle}
                position='center'
                size={360}
            >
                {wasOpened && <LanguageModal title={modalTitle} />}
            </Modal>
        </div>
    );
}
