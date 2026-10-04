// src/components/ui/photo-slider/photo-viewer.tsx — окно просмотра PhotoSlider (инструкция: photo-slider.md)
'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import CloseSVG from '@/assets/svg/x.svg';
import ChevronLeftSVG from '@/assets/svg/chevron-left.svg';
import ChevronRightSVG from '@/assets/svg/menu/chevron-right.svg';
import { VIEWER_SIZES, formatLabel, prefersReducedMotion, type PhotoSlide, type PhotoSliderLabels } from './shared';

type Props = {
    slides: PhotoSlide[];
    labels: PhotoSliderLabels;
    startIndex: number;
    /** миниатюра в ленте — из неё фото «вылетает» при открытии и в неё же «возвращается» при закрытии */
    getThumb: (index: number) => HTMLImageElement | null;
    /** окно появилось (миниатюру под ним можно скрыть) */
    onOpen: (index: number) => void;
    onIndexChange: (index: number) => void;
    /** анимация закрытия закончилась — родитель убирает окно */
    onClose: (index: number) => void;
};

const OPEN_MS = 420;
const CLOSE_MS = 320;
const EASE = 'cubic-bezier(0.2, 0.9, 0.25, 1)';
// после какого сдвига жест «решает», куда он: вбок (листать) или вниз (закрыть)
const AXIS_LOCK = 8;
// закрыть: потянуть вниз дальше этого (px) или смахнуть быстрее этого (px/мс)
const CLOSE_DISTANCE = 110;
const CLOSE_VELOCITY = 0.6;
// мышью: сдвиг больше этой доли ширины листает на соседнее фото
const FLIP_SHARE = 0.15;

type Drag = {
    id: number;
    mouse: boolean;
    x: number;
    y: number;
    left: number;
    axis: 'x' | 'y' | null;
    dy: number;
    lastY: number;
    lastT: number;
    velocity: number;
};

const center = (r: DOMRect) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 });

/** transform, который ставит элемент с прямоугольником `base` на место прямоугольника `target` (transform-origin — центр) */
const flip = (target: DOMRect, base: DOMRect) => {
    const a = center(target);
    const b = center(base);
    return `translate(${a.x - b.x}px, ${a.y - b.y}px) scale(${target.width / base.width})`;
};

const isOnScreen = (r: DOMRect) => r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;

const radiusOf = (el: Element) => Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;

export default function PhotoViewer({ slides, labels, startIndex, getThumb, onOpen, onIndexChange, onClose }: Props) {
    const [index, setIndex] = useState(startIndex);
    // крупные фото рендерим только для текущего и соседних (и тех, что уже смотрели)
    const [visited, setVisited] = useState(() => new Set([startIndex - 1, startIndex, startIndex + 1]));
    // пока крупное фото грузится, под ним видна уже загруженная миниатюра (или blurDataURL)
    const [placeholders] = useState(() =>
        slides.map((slide, i) => {
            const thumb = getThumb(i);
            const src = thumb?.complete && thumb.currentSrc ? thumb.currentSrc : slide.src.blurDataURL;
            return src ? `url("${src}")` : undefined;
        }),
    );

    const rootRef = useRef<HTMLDivElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const stripRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);
    const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
    const indexRef = useRef(startIndex);
    const closing = useRef(false);
    const drag = useRef<Drag | null>(null);
    const suppressClick = useRef(false);

    const last = slides.length - 1;
    const slide = slides[index];
    const hasCaptions = slides.some((s) => s.title || s.text);

    /** верхняя панель, подпись, стрелки — гаснут при свайпе вниз и при закрытии */
    const chrome = () => Array.from(rootRef.current?.querySelectorAll<HTMLElement>('.photo-viewer-ui') ?? []);

    const go = (target: number) => {
        const strip = stripRef.current;
        if (!strip) return;
        const next = Math.max(0, Math.min(last, target));
        strip.scrollTo({ left: next * strip.clientWidth, behavior: prefersReducedMotion() ? 'instant' : 'smooth' });
    };

    const close = () => {
        if (closing.current) return;
        closing.current = true;

        const i = indexRef.current;
        const img = imgRefs.current[i];
        const backdrop = backdropRef.current;
        const finish = () => onClose(i);

        if (!img || !backdrop || prefersReducedMotion()) {
            finish();
            return;
        }

        // откуда летим (с учётом сдвига пальцем) и куда — в миниатюру, если она на экране
        const from = img.getBoundingClientRect();
        img.style.transform = '';
        const base = img.getBoundingClientRect();
        const thumb = getThumb(i);
        const to = thumb?.getBoundingClientRect();
        const radius = radiusOf(img);

        const fade = (el: HTMLElement, duration: number) =>
            el.animate([{ opacity: getComputedStyle(el).opacity }, { opacity: 0 }], { duration, easing: 'ease-in', fill: 'forwards' });

        const animations = [fade(backdrop, CLOSE_MS), ...chrome().map((el) => fade(el, 180))];

        if (thumb && to && isOnScreen(to)) {
            const scale = to.width / base.width;
            animations.push(
                img.animate(
                    [
                        { transform: flip(from, base), borderRadius: `${radius}px` },
                        { transform: flip(to, base), borderRadius: `${radiusOf(thumb) / scale}px` },
                    ],
                    { duration: CLOSE_MS, easing: EASE, fill: 'forwards' },
                ),
            );
        } else {
            animations.push(
                img.animate(
                    [
                        { transform: flip(from, base), opacity: 1 },
                        { transform: `${flip(from, base)} scale(0.9)`, opacity: 0 },
                    ],
                    { duration: CLOSE_MS, easing: 'ease-in', fill: 'forwards' },
                ),
            );
        }

        Promise.all(animations.map((a) => a.finished)).then(finish, finish);
    };

    // ── Открытие: встаём на нужное фото и «выращиваем» его из миниатюры (FLIP) ───────────────────────
    // biome-ignore lint/correctness/useExhaustiveDependencies: только при открытии — дальше окно живёт своим состоянием
    useLayoutEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;

        strip.scrollLeft = startIndex * strip.clientWidth;
        onOpen(startIndex);

        if (prefersReducedMotion()) return;

        backdropRef.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: OPEN_MS, easing: 'ease-out' });
        for (const el of chrome()) {
            el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 140, easing: 'ease-out', fill: 'backwards' });
        }

        const img = imgRefs.current[startIndex];
        const thumb = getThumb(startIndex);
        if (!img) return;

        const to = img.getBoundingClientRect();
        const from = thumb?.getBoundingClientRect();

        if (thumb && from && isOnScreen(from) && to.width > 0) {
            const scale = from.width / to.width;
            img.animate(
                [
                    { transform: flip(from, to), borderRadius: `${radiusOf(thumb) / scale}px` },
                    { transform: 'none', borderRadius: `${radiusOf(img)}px` },
                ],
                { duration: OPEN_MS, easing: EASE },
            );
        } else {
            img.animate([{ opacity: 0, transform: 'scale(0.92)' }, { opacity: 1, transform: 'none' }], { duration: OPEN_MS, easing: EASE });
        }
    }, []);

    // ── Блокировка прокрутки страницы, клавиатура, фокус ────────────────────────────────────────────
    // biome-ignore lint/correctness/useExhaustiveDependencies: подписка один раз на время жизни окна, текущее фото — в indexRef
    useEffect(() => {
        const html = document.documentElement;
        html.style.overflow = 'hidden';
        html.style.scrollbarGutter = 'stable';
        closeRef.current?.focus({ preventScroll: true });

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                go(indexRef.current + (e.key === 'ArrowRight' ? 1 : -1));
            } else if (e.key === 'Tab') {
                // фокус не уходит из окна на страницу под ним
                const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>('button:not([disabled])') ?? []);
                if (items.length === 0) return;
                const first = items[0];
                const lastItem = items[items.length - 1];
                const current = document.activeElement;

                if (!rootRef.current?.contains(current)) {
                    e.preventDefault();
                    first.focus();
                } else if (e.shiftKey && current === first) {
                    e.preventDefault();
                    lastItem.focus();
                } else if (!e.shiftKey && current === lastItem) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        // поворот экрана / изменение окна: остаёмся на том же фото
        const onResize = () => {
            const strip = stripRef.current;
            if (strip) strip.scrollLeft = indexRef.current * strip.clientWidth;
        };

        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('resize', onResize);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('resize', onResize);
            html.style.overflow = '';
            html.style.scrollbarGutter = '';
        };
    }, []);

    // ── Листание: лента со scroll-snap, текущее фото — по положению прокрутки ────────────────────────
    const onScroll = () => {
        const strip = stripRef.current;
        if (!strip || closing.current) return;

        const i = Math.max(0, Math.min(last, Math.round(strip.scrollLeft / strip.clientWidth)));
        if (i === indexRef.current) return;

        indexRef.current = i;
        setIndex(i);
        setVisited((prev) => (prev.has(i - 1) && prev.has(i + 1) ? prev : new Set([...prev, i - 1, i, i + 1])));
        onIndexChange(i);
    };

    // ── Жесты: вниз — закрыть (палец и мышь), вбок мышью — листать (пальцем листает сам браузер) ────
    const resetDrag = (img: HTMLImageElement | null | undefined) => {
        const backdrop = backdropRef.current;
        if (img?.style.transform) {
            img.animate([{ transform: img.style.transform }, { transform: 'none' }], { duration: 250, easing: EASE });
            img.style.transform = '';
        }
        for (const el of [backdrop, ...chrome()]) {
            if (!el?.style.opacity) continue;
            el.animate([{ opacity: el.style.opacity }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
            el.style.opacity = '';
        }
    };

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (closing.current || !stripRef.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
        drag.current = {
            id: e.pointerId,
            mouse: e.pointerType === 'mouse',
            x: e.clientX,
            y: e.clientY,
            left: stripRef.current.scrollLeft,
            axis: null,
            dy: 0,
            lastY: e.clientY,
            lastT: e.timeStamp,
            velocity: 0,
        };
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        const strip = stripRef.current;
        if (!d || !strip || e.pointerId !== d.id) return;

        const dx = e.clientX - d.x;
        const dy = e.clientY - d.y;

        if (!d.axis) {
            if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
            d.axis = Math.abs(dy) > Math.abs(dx) ? 'y' : 'x';
            // вбок пальцем — нативная прокрутка ленты (touch-action: pan-x), мы в неё не вмешиваемся
            if (d.axis === 'x' && !d.mouse) {
                drag.current = null;
                return;
            }
            strip.setPointerCapture(d.id);
            if (d.axis === 'x') strip.classList.add('is-dragging');
        }

        if (d.axis === 'x') {
            strip.scrollLeft = d.left - dx;
            return;
        }

        // вниз — свободно, вверх — с сопротивлением
        const y = dy > 0 ? dy : dy / 4;
        const dt = e.timeStamp - d.lastT;
        if (dt > 0) d.velocity = (e.clientY - d.lastY) / dt;
        d.lastY = e.clientY;
        d.lastT = e.timeStamp;
        d.dy = y;

        const progress = Math.min(Math.abs(y) / 400, 1);
        const img = imgRefs.current[indexRef.current];
        if (img) img.style.transform = `translate3d(0, ${y}px, 0) scale(${1 - progress * 0.15})`;
        if (backdropRef.current) backdropRef.current.style.opacity = String(1 - progress * 0.85);
        for (const el of chrome()) el.style.opacity = String(1 - Math.min(progress * 3, 1));
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        drag.current = null;
        const strip = stripRef.current;
        if (!d?.axis || !strip) return;

        // клик сразу после жеста — не «клик по фону»
        suppressClick.current = true;
        setTimeout(() => {
            suppressClick.current = false;
        }, 0);

        if (d.axis === 'x') {
            strip.classList.remove('is-dragging');
            const width = strip.clientWidth;
            const dx = e.clientX - d.x;
            const from = Math.round(d.left / width);
            go(dx < -width * FLIP_SHARE ? from + 1 : dx > width * FLIP_SHARE ? from - 1 : from);
            return;
        }

        if (e.type === 'pointerup' && (d.dy > CLOSE_DISTANCE || d.velocity > CLOSE_VELOCITY)) {
            close();
            return;
        }

        resetDrag(imgRefs.current[indexRef.current]);
    };

    // клик мимо фото (по пустому месту) закрывает окно
    const onStripClick = (e: MouseEvent<HTMLDivElement>) => {
        if (suppressClick.current) return;
        if ((e.target as HTMLElement).tagName !== 'IMG') close();
    };

    const portalRoot = document.getElementById('modal-root') ?? document.body;

    return createPortal(
        <div
            ref={rootRef}
            className={`photo-viewer p-fixed inset-0 z-40${hasCaptions ? '' : ' photo-viewer-bare'}`}
            role='dialog'
            aria-modal='true'
            aria-label={labels.viewer}
        >
            <div ref={backdropRef} className='photo-viewer-backdrop p-absolute inset-0' aria-hidden='true' />

            {/* biome-ignore lint/a11y/noStaticElementInteractions lint/a11y/useKeyWithClickEvents: клик по фону дублирует крестик, с клавиатуры окно закрывается Esc */}
            <div
                ref={stripRef}
                className='photo-viewer-strip p-absolute inset-0 flex nowrap scrollbar-none'
                onScroll={onScroll}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onClick={onStripClick}
            >
                {slides.map((item, i) => (
                    <div className='photo-viewer-cell grid place-center shrink-0 w-full h-full' aria-hidden={i === index ? undefined : true} key={item.src.src}>
                        {visited.has(i) && (
                            <Image
                                ref={(el) => {
                                    imgRefs.current[i] = el;
                                }}
                                className='photo-viewer-img block'
                                src={item.src}
                                alt={item.alt}
                                sizes={VIEWER_SIZES}
                                loading='eager'
                                draggable={false}
                                style={{ '--pv-ratio': item.src.height / item.src.width, backgroundImage: placeholders[i] } as CSSProperties}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className='photo-viewer-top photo-viewer-ui p-absolute flex nowrap align-center justify-between gap-10'>
                <p className='photo-viewer-count md-0 font-14 font-w-500' aria-live='polite' aria-atomic='true'>
                    <span aria-hidden='true'>
                        {index + 1} / {slides.length}
                    </span>
                    <span className='sr-only'>{formatLabel(labels.position, { n: index + 1, total: slides.length })}</span>
                </p>
                <button
                    ref={closeRef}
                    type='button'
                    className='photo-viewer-btn grid place-center w-46 h-46 br-round hover-none active_scale_09'
                    aria-label={labels.close}
                    onClick={close}
                >
                    <CloseSVG width={22} height={22} viewBox='0 0 24 24' aria-hidden='true' />
                </button>
            </div>

            <button
                type='button'
                className='photo-viewer-btn photo-viewer-nav photo-viewer-prev photo-viewer-ui p-absolute grid place-center br-round hover-none'
                aria-label={labels.prev}
                disabled={index === 0}
                onClick={() => go(index - 1)}
            >
                <ChevronLeftSVG width={26} height={26} aria-hidden='true' />
            </button>
            <button
                type='button'
                className='photo-viewer-btn photo-viewer-nav photo-viewer-next photo-viewer-ui p-absolute grid place-center br-round hover-none'
                aria-label={labels.next}
                disabled={index === last}
                onClick={() => go(index + 1)}
            >
                <ChevronRightSVG width={26} height={26} aria-hidden='true' />
            </button>

            <div className='photo-viewer-bottom photo-viewer-ui p-absolute grid gap-10 justify-i-center text_center'>
                {(slide.title || slide.text) && (
                    <div className='photo-viewer-caption grid gap-5'>
                        {slide.title && <b className='font-16'>{slide.title}</b>}
                        {slide.text && <span className='font-14'>{slide.text}</span>}
                    </div>
                )}
                <div className='flex nowrap align-center gap-8'>
                    {slides.map((item, i) => (
                        <button
                            type='button'
                            className={`photo-slider-dot hover-none${i === index ? ' is-active' : ''}`}
                            aria-label={formatLabel(labels.goTo, { n: i + 1, total: slides.length })}
                            aria-current={i === index ? 'true' : undefined}
                            onClick={() => go(i)}
                            key={item.src.src}
                        />
                    ))}
                </div>
            </div>
        </div>,
        portalRoot,
    );
}
