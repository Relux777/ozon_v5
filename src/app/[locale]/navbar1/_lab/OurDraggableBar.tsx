'use client';

import { type CSSProperties, useRef, useState } from 'react';
import ours from '@/components/NavBar/nav.module.scss';
import { NAV_ITEMS, type VariantProps } from './items';
import lab from './navbar1.module.scss';
import { useTabDrag } from './useTabDrag';

// Наше меню (вид и размеры — из components/NavBar/nav.module.scss) со слайдером, который можно тянуть.
// drag — вариант 2: слайдер едет за пальцем и растягивается от скорости;
// lift — вариант 4: вдобавок при нажатии переезжает под палец и растёт, пока палец прижат (как стекло в iOS)
type Props = VariantProps & { mode: 'drag' | 'lift' };

export default function OurDraggableBar({ labels, ariaLabel, mode }: Props) {
    const [active, setActive] = useState(0);
    const barRef = useRef<HTMLUListElement>(null);
    const isLift = mode === 'lift';
    const { shown, bind, onItemClick } = useTabDrag(barRef, {
        count: NAV_ITEMS.length,
        active,
        onSelect: setActive,
        pressPreview: isLift,
        lift: isLift,
        travel: true,
    });

    return (
        <div className={`p-absolute l-0 w-full z-10 p-events-none ${ours.nav} ${lab.ourDock}`}>
            <nav aria-label={ariaLabel} className='flex justify-center align-center gap-5 p-events-none'>
                <ul
                    ref={barRef}
                    {...bind}
                    style={{ '--nb-i': shown } as CSSProperties}
                    className={`flex nowrap p-relative br-36 shadow-1 blur-7 p-events-all bg-1-7 ${ours.ul} ${ours.home} ${lab.ourBar} ${isLift ? lab.ourLift : 'overflow-hidden'}`}
                >
                    {NAV_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        const isShown = i === shown;
                        return (
                            <li key={item.href}>
                                <button
                                    type='button'
                                    data-nav-item
                                    onClick={() => onItemClick(i)}
                                    aria-current={i === active ? 'page' : undefined}
                                    className={`flex column align-center justify-center p-relative z-10 gap-3 ${ours.link} ${lab.ourItem} ${isShown ? `${ours.active} ${lab.on}` : ''}`}
                                >
                                    <Icon className={ours.nav_icon} width={24} height={24} aria-hidden='true' />
                                    <span className='block truncate font-12'>{labels[i]}</span>
                                </button>
                            </li>
                        );
                    })}

                    <li aria-hidden='true'>
                        <div className={`${ours.slider} p-absolute t-0 l-0 br-36 shadow-2 bg-2-10 ${lab.ourSlider}`} />
                    </li>
                </ul>
            </nav>
        </div>
    );
}
