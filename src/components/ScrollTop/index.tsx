// src/components/ScrollTop/index.tsx
'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import ChevronDown from '@/assets/svg/chevron-down.svg';

// после этого скролла снизу справа появляется кнопка «наверх»
const SHOW_AFTER_Y = 400;

export default function ScrollTop() {
    const t = useTranslations('A11y');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_Y);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <button
            type="button"
            className={`float-btn p-fixed z-20 grid place-center w-46 h-46 br-round bg-1-7 shadow-1 blur-7 active_scale_09 r-10 b-20${visible ? ' float-btn-visible' : ''}`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label={t('scrollTop')}
            tabIndex={visible ? 0 : -1}
        >
            <ChevronDown className="scroll-top-icon" width={22} height={22} aria-hidden="true" />
        </button>
    );
}
