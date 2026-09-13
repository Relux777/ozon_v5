// app/hook/LanguageSwitcher.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useLocale } from 'next-intl';

import ChevronDown from '@/assets/svg/chevron-down.svg';
import { getLanguageByCode } from '@/config/languages';

import Modal from '@/components/Modal';
import styles from '@/components/Modal/modal.module.scss';

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
    const { label, flag: Flag } = getLanguageByCode(locale);

    return (
        <div className='language'>
            <button className='flex align-center gap-5 hover-80' onClick={() => setIsModalOpen(true)}>
                <Flag width={22} height={22} />
                <span className='none-max-360'>{label}</span>
                <ChevronDown width={20} height={20} viewBox="0 0 24 24" />
            </button>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className={`${styles.center} ${styles.w_360px}`}
            >
                <LanguageModal title={modalTitle} />
            </Modal>
        </div>
    );
}