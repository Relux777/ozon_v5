'use client';

import { type CSSProperties, useRef, useState } from 'react';
import { NAV_ITEMS, type VariantProps } from './items';
import lab from './navbar1.module.scss';
import { useTabDrag } from './useTabDrag';

// 3. По мотивам панели вкладок iOS (Liquid Glass): широкая стеклянная капсула почти во всю ширину экрана,
// выбранный пункт — цветом раздела на полупрозрачной серой «таблетке». Прокрутка вниз сворачивает панель
// в кружок с текущим пунктом (как minimize-on-scroll в iOS), вверх или нажатие на кружок — разворачивает.
// «Таблетку» можно тянуть, при нажатии она переезжает под палец и чуть увеличивается
type Props = VariantProps & {
    collapsed: boolean;
    onExpand: () => void;
};

export default function V3Ios({ labels, ariaLabel, collapsed, onExpand }: Props) {
    const [active, setActive] = useState(0);
    const barRef = useRef<HTMLDivElement>(null);
    const { shown, bind, onItemClick } = useTabDrag(barRef, {
        count: NAV_ITEMS.length,
        active,
        onSelect: setActive,
        pressPreview: true,
        lift: true,
        travel: true,
        enabled: !collapsed,
    });

    return (
        <div className={lab.iosDock}>
            <nav aria-label={ariaLabel} className='p-events-none'>
                <div ref={barRef} {...bind} data-collapsed={collapsed || undefined} style={{ '--nb-i': shown } as CSSProperties} className={lab.iosBar}>
                    <span className={lab.iosPill} aria-hidden='true' />
                    <ul className={lab.iosTrack}>
                        {NAV_ITEMS.map((item, i) => {
                            const Icon = item.icon;
                            const isShown = i === shown;
                            return (
                                <li key={item.href} className='flex'>
                                    <button
                                        type='button'
                                        data-nav-item
                                        tabIndex={collapsed && !isShown ? -1 : undefined}
                                        aria-expanded={collapsed && isShown ? false : undefined}
                                        onClick={() => (collapsed ? onExpand() : onItemClick(i))}
                                        aria-current={i === active ? 'page' : undefined}
                                        className={`hover-none ${lab.iosItem} ${isShown ? lab.on : ''}`}
                                    >
                                        <Icon width={25} height={25} aria-hidden='true' />
                                        <span>{labels[i]}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
