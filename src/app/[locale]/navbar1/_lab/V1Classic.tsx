'use client';

import { useState } from 'react';
import ours from '@/components/NavBar/nav.module.scss';
import { Link } from '@/i18n/navigation';
import { NAV_ITEMS, type VariantProps } from './items';

// 1. Наш вариант — разметка и стили настоящего меню (components/NavBar, те же классы и nav.module.scss).
// Отличия только для показа: стоит внутри «экрана», а не fixed, и пункт выбирается без перехода на страницу
export default function V1Classic({ labels, ariaLabel }: VariantProps) {
    const [active, setActive] = useState(0);

    return (
        <div className={`p-absolute l-0 w-full z-10 p-events-none ${ours.nav}`}>
            <nav aria-label={ariaLabel} className='flex justify-center align-center gap-5 p-events-none'>
                <ul className={`flex nowrap overflow-hidden p-relative br-36 shadow-1 blur-7 p-events-all bg-1-7 ${ours.ul} ${ours.home}`}>
                    {NAV_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = i === active;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    prefetch={false}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setActive(i);
                                    }}
                                    className={`flex column align-center justify-center p-relative z-10 gap-3 active_scale_09 ${ours.link} ${isActive ? ours.active : ''}`}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <Icon className={ours.nav_icon} width={24} height={24} aria-hidden='true' />
                                    <span className='block truncate font-12'>{labels[i]}</span>
                                </Link>
                            </li>
                        );
                    })}

                    <li aria-hidden='true'>
                        <div className={`${ours.slider} p-absolute t-0 l-0 br-36 shadow-2 bg-2-10 visible tr-bezier-5`} />
                    </li>
                </ul>
            </nav>
        </div>
    );
}
