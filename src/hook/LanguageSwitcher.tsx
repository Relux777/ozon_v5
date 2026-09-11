'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

import ChevronDown from '@/assets/svg/chevron-down.svg';
import Flag_ru from '@/assets/svg/Language/ru.svg';

import Modal from '@/components/Modal';
import styles from '@/components/Modal/modal.module.scss';
const LanguageModal = dynamic(() => import('@/components/Modal/content/LanguageModal'));

export default function LanguageSwitcher() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className='language'>
            <button className='flex align-center gap-5 hover-80' onClick={() => setIsModalOpen(true)} >
                <Flag_ru width={22} height={22} />
                <span>Русский</span>
                <ChevronDown width={20} height={20} viewBox="0 0 24 24" />
            </button>
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                className={`${styles.center} ${styles.w_360px}`}
                >
                <LanguageModal />
            </Modal>
        </div>
    )
}
