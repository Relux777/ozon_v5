'use client';

import { useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import MenuRightSVG from '@/assets/svg/menu-right.svg';
import type { PageNavExtra, PageNavItem, PageNavModalProps } from '@/components/PageNav/PageNavModal';

const Modal = dynamic(() => import('@/components/ui/modal'));

const PageNavModal = dynamic<PageNavModalProps>(() => import('@/components/PageNav/PageNavModal'));

type Props = {
    label: string;
    items: PageNavItem[];
    /** краткая справка над оглавлением (страница города передаёт готовую серверную разметку) */
    summary?: ReactNode;
    extrasTitle?: string;
    extras?: PageNavExtra[];
};

// после этого скролла снизу справа появляется кнопка (как ScrollTop на /sklad)
const SHOW_AFTER_Y = 400;

// Плавающая кнопка снизу справа — быстрый переход по разделам страницы (модалка со списком, ссылки —
// обычные #якоря: закрывают модалку и одновременно плавно скроллят к разделу за счёт scroll-behavior
// в ReluxCode). Появляется только при прокрутке вниз — общая анимация с ScrollTop, см. .float-btn
// раздел считается «текущим», если его верх уже поднялся выше этой доли высоты экрана
const ACTIVE_LINE = 0.35;

export default function PageNav({ label, items, summary, extrasTitle, extras }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [activeHref, setActiveHref] = useState<string>();

    // Текущий раздел определяем один раз — в момент открытия (без постоянного слежения за прокруткой):
    // пункты идут в порядке страницы, поэтому текущий — последний, чей верх выше линии
    const open = () => {
        const line = window.innerHeight * ACTIVE_LINE;
        let current: string | undefined;
        for (const item of items) {
            const section = document.getElementById(item.href.slice(1));
            if (section && section.getBoundingClientRect().top <= line) current = item.href;
        }
        setActiveHref(current);
        setIsOpen(true);
    };

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
                onClick={open}
                aria-label={label}
                aria-haspopup='dialog'
                tabIndex={visible ? 0 : -1}
            >
                <MenuRightSVG width={22} height={22} aria-hidden='true' />
            </button>
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel={label} position='right'>
                <PageNavModal
                    title={label}
                    items={items}
                    onNavigate={() => setIsOpen(false)}
                    activeHref={activeHref}
                    summary={summary}
                    extrasTitle={extrasTitle}
                    extras={extras}
                />
            </Modal>
        </>
    );
}
