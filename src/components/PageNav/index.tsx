'use client';

import { useEffect, useState } from 'react';
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

// после этого скролла снизу справа появляется кнопка (как ScrollTop на /sklad)
const SHOW_AFTER_Y = 400;

// Плавающая кнопка снизу справа — быстрый переход по разделам главной (модалка со списком, ссылки —
// обычные #якоря: закрывают модалку и одновременно плавно скроллят к разделу за счёт scroll-behavior
// в ReluxCode). Появляется только при прокрутке вниз — общая анимация с ScrollTop, см. .float-btn
export default function PageNav({ label, items }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_Y);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <>
            <button
                type='button'
                className={`float-btn p-fixed z-20 grid place-center w-46 h-46 br-round bg-1-7 shadow-1 blur-7 active_scale_09 r-10 b-20${visible ? ' float-btn-visible' : ''}`}
                onClick={() => setIsOpen(true)}
                aria-label={label}
                aria-haspopup='dialog'
                tabIndex={visible ? 0 : -1}
            >
                <MenuRightSVG width={22} height={22} aria-hidden='true' />
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel={label} className={styles.right}>
                <PageNavModal title={label} items={items} onNavigate={() => setIsOpen(false)} />
            </Modal>
        </>
    );
}
