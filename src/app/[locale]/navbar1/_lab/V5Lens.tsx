'use client';

import { type CSSProperties, useRef, useState } from 'react';
import { NAV_ITEMS, type VariantProps } from './items';
import lab from './navbar1.module.scss';
import { useTabDrag } from './useTabDrag';

// 5. «Жидкое стекло» без SVG-фильтров — работает и на телефонах (в т. ч. iPhone).
// SVG-способ (backdrop-filter: url(#фильтр) с feDisplacementMap) Safari и Firefox не поддерживают, поэтому
// преломление здесь собрано из обычных трансформаций:
// - слайдер — линза. Внутри неё лежит копия ряда иконок цветом раздела, сдвинутая ровно под настоящий ряд;
//   линза растёт и тянется — копия увеличивается вместе с ней, и иконки под линзой выглядят увеличенными стеклом;
// - настоящий ряд под линзой вырезан маской, поэтому иконка не двоится;
// - у линзы цветная кромка (красноватая слева, голубоватая справа — как дисперсия в стекле) и блик,
//   а по панели за линзой бежит отсвет.
// Жесты: нажатие — линза переезжает под палец и поднимается; держите — растёт; тяните — тянется «каплей»
// с лёгким притяжением к пунктам; отпустили — пружинисто садится. На Android — короткая вибрация на каждом пункте
export default function V5Lens({ labels, ariaLabel }: VariantProps) {
    const [active, setActive] = useState(0);
    const barRef = useRef<HTMLDivElement>(null);
    const { shown, bind, onItemClick } = useTabDrag(barRef, {
        count: NAV_ITEMS.length,
        active,
        onSelect: setActive,
        pressPreview: true,
        lift: true,
        magnet: true,
        travel: true,
    });

    return (
        <div className={lab.lensDock}>
            <nav aria-label={ariaLabel} className='p-events-none'>
                <div ref={barRef} {...bind} style={{ '--nb-i': shown } as CSSProperties} className={lab.lensBar}>
                    <ul className={lab.lensTrack}>
                        {NAV_ITEMS.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.href} className='flex'>
                                    <button
                                        type='button'
                                        data-nav-item
                                        onClick={() => onItemClick(i)}
                                        aria-current={i === active ? 'page' : undefined}
                                        className={`hover-none ${lab.lensItem}`}
                                    >
                                        <Icon width={24} height={24} aria-hidden='true' />
                                        <span>{labels[i]}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* линза: копия ряда под увеличением, для скринридеров её нет */}
                    <div className={lab.lens} aria-hidden='true'>
                        <div className={lab.lensZoom}>
                            <div className={lab.lensContent}>
                                {NAV_ITEMS.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <span key={item.href} className={`${lab.lensItem} ${i === shown ? lab.on : ''}`}>
                                            <Icon width={24} height={24} />
                                            <span>{labels[i]}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
