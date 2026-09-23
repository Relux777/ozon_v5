'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import MenuRightSVG from '@/assets/svg/menu-right.svg';
import styles from '@/components/Modal/modal.module.scss';
import type { PageNavItem } from '@/components/Modal/content/PageNavModal';

const Modal = dynamic(() => import('@/components/Modal'));

type PageNavModalProps = { title: string; items: PageNavItem[]; onNavigate: () => void };
const PageNavModal = dynamic<PageNavModalProps>(() => import('@/components/Modal/content/PageNavModal'));

type Props = {
    label: string;
    items: PageNavItem[];
};

// Плавающая кнопка справа — быстрый переход по разделам главной (модалка со списком, ссылки — обычные
// #якоря: закрывают модалку и одновременно плавно скроллят к разделу за счёт scroll-behavior в ReluxCode)
export default function PageNav({ label, items }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                type='button'
                className='page-nav-btn p-fixed z-10 grid place-center w-46 h-46 br-round bg-1-7 shadow-1 blur-7 active_scale_09'
                onClick={() => setIsOpen(true)}
                aria-label={label}
                aria-haspopup='dialog'
            >
                <MenuRightSVG width={22} height={22} aria-hidden='true' />
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel={label} className={styles.right}>
                <PageNavModal title={label} items={items} onNavigate={() => setIsOpen(false)} />
            </Modal>
        </>
    );
}
