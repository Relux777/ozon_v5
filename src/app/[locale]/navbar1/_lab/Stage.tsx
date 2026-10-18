'use client';

import Image from 'next/image';
import { type CSSProperties, type UIEvent, useRef, useState } from 'react';
import pg1 from '@/assets/img/pg1.webp';
import pg3 from '@/assets/img/pg3.webp';
import lab from './navbar1.module.scss';
import V1Classic from './V1Classic';
import V2Drag from './V2Drag';
import V3Ios from './V3Ios';
import V4Lift from './V4Lift';
import V5Lens from './V5Lens';

export type VariantId = 'v1' | 'v2' | 'v3' | 'v4' | 'v5';

type Props = {
    variant: VariantId;
    labels: readonly string[];
    ariaLabel: string;
    /** первый экран на странице: его картинка видна сразу — грузим без отложенной загрузки */
    eager?: boolean;
};

// цветные плитки под стеклом — чтобы было видно размытие и преломление
const TILES = ['#1c7ed6', '#0ca678', '#7a5af8', '#f08c00', '#e64980', '#0d5ef5'];

// «Экран телефона»: прокручиваемая страница-заглушка и меню поверх неё
export default function Stage({ variant, labels, ariaLabel, eager = false }: Props) {
    const [collapsed, setCollapsed] = useState(false);
    const lastY = useRef(0);

    // как в iOS: прокрутка вниз сворачивает панель, вверх — разворачивает (нужно только варианту 3)
    const onScroll = (e: UIEvent<HTMLDivElement>) => {
        if (variant !== 'v3') return;
        const y = e.currentTarget.scrollTop;
        const d = y - lastY.current;
        if (Math.abs(d) < 8) return;
        lastY.current = y;
        setCollapsed(d > 0 && y > 48);
    };

    const props = { labels, ariaLabel };

    return (
        <div className={lab.frame}>
            <div className={lab.screen} onScroll={onScroll}>
                <ScreenContent eager={eager} />
            </div>
            {variant === 'v1' && <V1Classic {...props} />}
            {variant === 'v2' && <V2Drag {...props} />}
            {variant === 'v3' && <V3Ios {...props} collapsed={collapsed} onExpand={() => setCollapsed(false)} />}
            {variant === 'v4' && <V4Lift {...props} />}
            {variant === 'v5' && <V5Lens {...props} />}
        </div>
    );
}

// Заглушка страницы без текста и цифр: полосы вместо строк, картинки сайта и цветные плитки
function ScreenContent({ eager }: { eager: boolean }) {
    const tiles = (from: number) => (
        <div className={lab.tiles}>
            {[0, 1, 2, 3].map((k) => (
                <span key={k} className={lab.tile} style={{ '--c': TILES[(from + k) % TILES.length] } as CSSProperties} />
            ))}
        </div>
    );
    const lines = (widths: number[]) => (
        <div className='flex column gap-8'>
            {widths.map((w) => (
                <span key={w} className={lab.line} style={{ inlineSize: `${w}%` }} />
            ))}
        </div>
    );

    return (
        <div className='flex column gap-14' aria-hidden='true'>
            <div className={`flex nowrap align-center gap-10 ${lab.fakeHead}`}>
                <span className={lab.dot} />
                <span className={lab.line} style={{ inlineSize: '38%' }} />
            </div>
            <div className={`flex column gap-10 ${lab.hero}`}>
                <span className={lab.heroLine} style={{ inlineSize: '70%' }} />
                <span className={lab.heroLine} style={{ inlineSize: '52%' }} />
                <span className={lab.heroBtn} />
            </div>
            {lines([92, 84, 64])}
            <Image src={pg3} alt='' sizes='(width < 440px) 90vw, 400px' loading={eager ? 'eager' : 'lazy'} className={lab.pic} />
            {tiles(0)}
            {lines([88, 95, 72, 40])}
            <Image src={pg1} alt='' sizes='(width < 440px) 90vw, 400px' className={lab.pic} />
            {tiles(2)}
            {lines([90, 78, 60])}
        </div>
    );
}
