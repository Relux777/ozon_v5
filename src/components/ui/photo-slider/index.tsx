// src/components/ui/photo-slider/index.tsx — инструкция: photo-slider.md рядом
'use client';

import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import ChevronLeftSVG from '@/assets/svg/chevron-left.svg';
import ChevronRightSVG from '@/assets/svg/menu/chevron-right.svg';
import SearchPlusSVG from '@/assets/svg/search-plus.svg';
import { formatLabel, pad, preloadLarge, prefersReducedMotion, type PhotoSlide, type PhotoSliderLabels } from './shared';

export type { PhotoSlide, PhotoSliderLabels } from './shared';

// окно просмотра — отдельный чанк: грузится при первом наведении/касании фото, а не со всей страницей
const PhotoViewer = dynamic(() => import('./photo-viewer'), { ssr: false });
const warmViewer = () => void import('./photo-viewer');

type Props = {
    slides: PhotoSlide[];
    labels: PhotoSliderLabels;
    /** `sizes` миниатюр — по реальной ширине слайда (см. --ps-slide-w в _photo-slider.scss) */
    sizes?: string;
    className?: string;
};

// сдвиг мыши, после которого нажатие считается перетаскиванием ленты, а не кликом по фото
const DRAG_START = 6;

// Лента фото со свайпом (нативный scroll-snap: инерция и жесты — браузерные, без библиотек), активный слайд —
// по центру, соседние приглушены. Под лентой — счётчик, точки-пагинация и стрелки. Нажатие на фото открывает
// окно просмотра (photo-viewer.tsx): размытый фон, листание свайпом, закрытие свайпом вниз / Esc / крестиком.
export default function PhotoSlider({ slides, labels, sizes = '(max-width: 620px) 58vw, 250px', className }: Props) {
    const [active, setActive] = useState(0);
    // окно просмотра: с какого фото открыто (null — закрыто) и какое фото в нём сейчас (его миниатюра скрыта)
    const [viewerStart, setViewerStart] = useState<number | null>(null);
    const [viewing, setViewing] = useState<number | null>(null);

    const trackRef = useRef<HTMLElement>(null);
    const slideRefs = useRef<(HTMLElement | null)[]>([]);
    const thumbRefs = useRef<(HTMLImageElement | null)[]>([]);
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const drag = useRef<{ id: number; x: number; left: number; moved: boolean } | null>(null);
    const suppressClick = useRef(false);

    const last = slides.length - 1;

    /** активный — слайд, чей центр ближе всего к центру ленты */
    const nearestIndex = () => {
        const track = trackRef.current;
        if (!track) return 0;

        const center = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        slideRefs.current.forEach((slide, i) => {
            if (!slide) return;
            const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
            if (dist < bestDist) {
                bestDist = dist;
                best = i;
            }
        });

        return best;
    };

    // scroll и так приходит не чаще раза за кадр — считаем сразу (7 слайдов, без принудительного пересчёта раскладки)
    const onScroll = () => setActive(nearestIndex());

    const scrollToIndex = (index: number, instant = false) => {
        const track = trackRef.current;
        const slide = slideRefs.current[index];
        if (!track || !slide) return;

        track.scrollTo({
            left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
            behavior: instant || prefersReducedMotion() ? 'instant' : 'smooth',
        });
    };

    const go = (index: number) => {
        const next = Math.max(0, Math.min(last, index));
        setActive(next);
        scrollToIndex(next);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        // стрелки листают ленту, только когда фокус на самой ленте (не на кнопке внутри неё)
        if (e.target !== e.currentTarget) return;

        const keys: Record<string, number> = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: last };
        if (!(e.key in keys)) return;

        e.preventDefault();
        go(keys[e.key]);
    };

    // ── Перетаскивание мышью (на тач-экранах лента листается нативно) ─────────────────────────────
    const onPointerDown = (e: PointerEvent<HTMLElement>) => {
        if (e.pointerType !== 'mouse' || e.button !== 0 || !trackRef.current) return;
        drag.current = { id: e.pointerId, x: e.clientX, left: trackRef.current.scrollLeft, moved: false };
    };

    const onPointerMove = (e: PointerEvent<HTMLElement>) => {
        const d = drag.current;
        const track = trackRef.current;
        if (!d || !track || e.pointerId !== d.id) return;

        const dx = e.clientX - d.x;
        if (!d.moved) {
            if (Math.abs(dx) < DRAG_START) return;
            d.moved = true;
            track.setPointerCapture(d.id);
            // без snap во время перетаскивания — иначе лента «прилипает» к слайдам под курсором
            track.classList.add('is-dragging');
        }
        track.scrollLeft = d.left - dx;
    };

    const onPointerUp = () => {
        const d = drag.current;
        drag.current = null;
        if (!d?.moved) return;

        trackRef.current?.classList.remove('is-dragging');
        go(nearestIndex());
        // клик, который браузер пришлёт сразу после отпускания кнопки, — не открытие фото
        suppressClick.current = true;
        setTimeout(() => {
            suppressClick.current = false;
        }, 0);
    };

    // ── Окно просмотра ───────────────────────────────────────────────────────────────────────────
    /** заранее: код окна и крупная версия фото — к моменту нажатия всё уже загружено */
    const warm = (index: number) => {
        warmViewer();
        preloadLarge(slides[index].src);
    };

    const open = (index: number) => {
        if (suppressClick.current) return;
        warm(index);
        setViewerStart(index);
    };

    /** окно листают — лента под ним мгновенно встаёт на то же фото, чтобы при закрытии фото «вернулось» на место */
    const onViewerIndex = (index: number) => {
        setViewing(index);
        setActive(index);
        scrollToIndex(index, true);
    };

    const onViewerClose = (index: number) => {
        setViewerStart(null);
        setViewing(null);
        buttonRefs.current[index]?.focus({ preventScroll: true });
    };

    return (
        <div className={`photo-slider${className ? ` ${className}` : ''}`}>
            {/* <section> с aria-label — ориентир «регион» для скринридеров (внутри нет .container, поэтому правило
                «первая секция в main» из style.scss её не задевает) */}
            <section
                ref={trackRef}
                className='photo-slider-track p-relative flex nowrap scrollbar-none'
                aria-label={labels.region}
                // biome-ignore lint/a11y/noNoninteractiveTabindex: лента прокручивается — с клавиатуры её листают стрелками
                tabIndex={0}
                onScroll={onScroll}
                onKeyDown={onKeyDown}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
            >
                {slides.map((slide, i) => (
                    <figure
                        ref={(el) => {
                            slideRefs.current[i] = el;
                        }}
                        className={`photo-slider-slide grid gap-12 content-start shrink-0 md-0${i === active ? ' is-active' : ''}${i === viewing ? ' is-viewing' : ''}`}
                        key={slide.src.src}
                    >
                        <button
                            ref={(el) => {
                                buttonRefs.current[i] = el;
                            }}
                            type='button'
                            className='photo-slider-thumb p-relative block w-full overflow-hidden hover-none'
                            aria-label={`${labels.open}: ${slide.title ?? slide.alt}`}
                            aria-haspopup='dialog'
                            onClick={() => open(i)}
                            onPointerEnter={() => warm(i)}
                            onFocus={() => warm(i)}
                        >
                            <Image
                                ref={(el) => {
                                    thumbRefs.current[i] = el;
                                }}
                                className='block w-full'
                                src={slide.src}
                                alt={slide.alt}
                                sizes={sizes}
                                draggable={false}
                            />
                            <span className='photo-slider-zoom p-absolute t-10 r-10 grid place-center w-36 h-36 br-round' aria-hidden='true'>
                                <SearchPlusSVG width={18} height={18} />
                            </span>
                        </button>

                        {(slide.title || slide.text) && (
                            <figcaption className='grid gap-5'>
                                <span className='flex nowrap align-center gap-8'>
                                    <span className='inline-flex nowrap align-center px-10 py-4 br-36 bg-5-10 color-5-100 font-12 font-w-700' aria-hidden='true'>
                                        {pad(i + 1)}
                                    </span>
                                    {slide.title && <b className='color-2-90 font-16'>{slide.title}</b>}
                                </span>
                                {slide.text && <span className='font-14'>{slide.text}</span>}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </section>

            {/* пагинация: счётчик · точки (активная вытягивается в «таблетку») · стрелки */}
            <div className='photo-slider-bar flex nowrap align-center justify-between gap-15 mt-15'>
                <p className='photo-slider-count md-0 font-14 space-nowrap' aria-hidden='true'>
                    <b className='color-2-90 font-w-700'>{pad(active + 1)}</b> / {pad(slides.length)}
                </p>

                <div className='flex nowrap align-center gap-8'>
                    {slides.map((slide, i) => (
                        <button
                            type='button'
                            className={`photo-slider-dot hover-none${i === active ? ' is-active' : ''}`}
                            aria-label={formatLabel(labels.goTo, { n: i + 1, total: slides.length })}
                            aria-current={i === active ? 'true' : undefined}
                            onClick={() => go(i)}
                            key={slide.src.src}
                        />
                    ))}
                </div>

                <div className='flex nowrap gap-8'>
                    <button
                        type='button'
                        className='photo-slider-arrow grid place-center w-46 h-46 br-round bg-3-100 border-1px-2-10 hover-none active_scale_09'
                        aria-label={labels.prev}
                        disabled={active === 0}
                        onClick={() => go(active - 1)}
                    >
                        <ChevronLeftSVG width={22} height={22} aria-hidden='true' />
                    </button>
                    <button
                        type='button'
                        className='photo-slider-arrow grid place-center w-46 h-46 br-round bg-3-100 border-1px-2-10 hover-none active_scale_09'
                        aria-label={labels.next}
                        disabled={active === last}
                        onClick={() => go(active + 1)}
                    >
                        <ChevronRightSVG width={22} height={22} aria-hidden='true' />
                    </button>
                </div>
            </div>

            {viewerStart !== null && (
                <PhotoViewer
                    slides={slides}
                    labels={labels}
                    startIndex={viewerStart}
                    getThumb={(i) => thumbRefs.current[i] ?? null}
                    onOpen={setViewing}
                    onIndexChange={onViewerIndex}
                    onClose={onViewerClose}
                />
            )}
        </div>
    );
}
