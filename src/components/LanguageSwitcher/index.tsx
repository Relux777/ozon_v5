// src/components/LanguageSwitcher/index.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';

import ChevronDown from '@/assets/svg/chevron-down.svg';
import { getLanguageByCode } from '@/config/languages';
import styles from '@/components/Modal/modal.module.scss';

const Modal = dynamic(() => import('@/components/Modal'));

type LanguageModalProps = { title: string };
const LanguageModal = dynamic<LanguageModalProps>(
    () => import('@/components/Modal/content/LanguageModal')
);

type Props = {
    modalTitle: string;
};

export default function LanguageSwitcher({ modalTitle }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations('A11y');
    const { label, flag: Flag } = getLanguageByCode(locale);

    return (
        <div className='language'>
            <button
                type="button"
                className='flex align-center gap-5 hover-80'
                onClick={() => setIsModalOpen(true)}
                aria-label={`${t('chooseLanguage')}: ${label}`}
                aria-haspopup="dialog"
            >
                <Flag width={22} height={22} aria-hidden="true" />
                <span className='none-max-360' aria-hidden="true">{label}</span>
                <ChevronDown width={20} height={20} viewBox="0 0 24 24" aria-hidden="true" />
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ariaLabel={modalTitle}
                className={`${styles.center} ${styles.w_360px}`}
            >
                <LanguageModal title={modalTitle} />
            </Modal>
        </div>
    );
}
