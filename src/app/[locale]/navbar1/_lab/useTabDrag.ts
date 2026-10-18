'use client';

import { type PointerEvent, type RefObject, useEffect, useRef, useState } from 'react';

// Перетаскивание слайдера нижнего меню пальцем или мышью — общее для вариантов 2–5.
// Положение слайдера живёт в CSS-переменных панели: --nb-i (номер пункта, его ставит React) и --nb-x (сдвиг в px).
// Пока палец ведёт слайдер, --nb-x пишется сюда же каждый кадр (мимо React — без лишних рендеров); отпустили —
// --nb-x убирается, и CSS сам доводит его пружиной до calc(--nb-i × ширина пункта). Ещё --nb-st — растяжение
// от скорости, атрибуты data-dragging / data-pressed / data-hold — для стилей «поднятого» слайдера.

type Options = {
    count: number;
    active: number;
    onSelect: (index: number) => void;
    /** нажатие сразу переносит слайдер под палец, выбор — когда отпустили (как в iOS) */
    pressPreview?: boolean;
    /** пока палец прижат — data-pressed, а через 0,3 с — data-hold: по ним CSS «поднимает» и растит слайдер */
    lift?: boolean;
    /** лёгкое притяжение к центрам пунктов при перетаскивании */
    magnet?: boolean;
    /** «капля» растягивается по пути к пункту, выбранному нажатием */
    travel?: boolean;
    /** выключить жесты (например, пока панель свёрнута) */
    enabled?: boolean;
};

const DRAG_START = 6; // px: сдвиг дальше — уже перетаскивание, а не нажатие
const FLICK_MS = 120; // на сколько мс вперёд «докатывается» слайдер после броска
const RUBBER = 0.3; // сопротивление за краями панели
const HOLD_MS = 300; // через сколько слайдер начинает расти дальше, если палец держат

const tick = () => {
    // короткая вибрация на Android; iPhone вибрацию из браузера не даёт
    if ('vibrate' in navigator) navigator.vibrate(5);
};

export function useTabDrag(
    barRef: RefObject<HTMLElement | null>,
    { count, active, onSelect, pressPreview = false, lift = false, magnet = false, travel = false, enabled = true }: Options,
) {
    // пункт под слайдером, пока палец прижат; null — слайдер стоит на выбранном пункте
    const [pointed, setPointed] = useState<number | null>(null);
    const st = useRef({
        id: -1,
        startX: 0,
        startY: 0,
        pointerX: 0,
        x: 0,
        vx: 0,
        t: 0,
        left: 0,
        w: 1,
        dragging: false,
        justDragged: false,
        raf: 0,
        hold: 0,
        pointed: -1,
    });
    const shown = pointed ?? active;

    const clampIndex = (i: number) => Math.min(count - 1, Math.max(0, i));

    const frame = (time: number) => {
        const s = st.current;
        const bar = barRef.current;
        if (!bar || !s.dragging) return;

        // слайдер центром под пальцем, за краями — с сопротивлением
        const max = (count - 1) * s.w;
        let target = s.pointerX - s.left - s.w / 2;
        if (target < 0) target = Math.max(target * RUBBER, -s.w * 0.35);
        else if (target > max) target = Math.min(max + (target - max) * RUBBER, max + s.w * 0.35);
        if (magnet) {
            const near = Math.round(target / s.w) * s.w;
            if (Math.abs(near - target) < s.w * 0.22) target += (near - target) * 0.35;
        }

        // небольшое сглаживание: слайдер «догоняет» палец за 2–3 кадра — движение жидкое, без рывков
        const x = s.x + (target - s.x) * 0.55;
        const dt = Math.max(1, time - s.t);
        s.vx += ((x - s.x) / dt - s.vx) * 0.3; // px/мс, сглаженная
        s.x = x;
        s.t = time;

        bar.style.setProperty('--nb-x', `${x.toFixed(2)}px`);
        bar.style.setProperty('--nb-st', Math.min(0.3, Math.abs(s.vx) * 0.16).toFixed(3));

        const i = clampIndex(Math.round(x / s.w));
        if (i !== s.pointed) {
            s.pointed = i;
            setPointed(i);
            tick();
        }
        s.raf = requestAnimationFrame(frame);
    };

    const finish = (commit: boolean) => {
        const s = st.current;
        const bar = barRef.current;
        cancelAnimationFrame(s.raf);
        clearTimeout(s.hold);

        let target = active;
        if (s.dragging) {
            // бросок: куда слайдер доехал бы по инерции
            if (commit) target = clampIndex(Math.round((s.x + s.vx * FLICK_MS) / s.w));
            s.justDragged = true;
            // клик, который браузер может прислать после отпускания, — не выбор пункта (новое нажатие сбросит флаг раньше)
            setTimeout(() => {
                s.justDragged = false;
            }, 400);
        } else if (pressPreview && commit && s.pointed >= 0) {
            target = s.pointed;
        }

        if (bar) {
            // номер — сразу, не дожидаясь рендера: иначе слайдер на кадр поехал бы к прежнему пункту
            bar.style.setProperty('--nb-i', String(target));
            bar.style.removeProperty('--nb-x');
            bar.style.removeProperty('--nb-st');
            bar.removeAttribute('data-dragging');
            bar.removeAttribute('data-pressed');
            bar.removeAttribute('data-hold');
        }
        s.dragging = false;
        s.id = -1;
        s.pointed = -1;
        setPointed(null);
        if (target !== active) {
            onSelect(target);
            tick();
        }
    };

    const onPointerDown = (e: PointerEvent<HTMLElement>) => {
        if (!enabled || e.button !== 0 || !e.isPrimary) return;
        const s = st.current;
        const bar = barRef.current;
        const first = bar?.querySelector<HTMLElement>('[data-nav-item]')?.getBoundingClientRect();
        if (!bar || !first) return;

        s.left = first.left;
        s.w = first.width || 1;
        s.id = e.pointerId;
        s.startX = s.pointerX = e.clientX;
        s.startY = e.clientY;
        s.dragging = false;
        s.justDragged = false;
        s.pointed = pressPreview ? clampIndex(Math.floor((e.clientX - s.left) / s.w)) : active;
        s.x = s.pointed * s.w;
        s.vx = 0;
        if (pressPreview) setPointed(s.pointed);
        if (lift) {
            bar.setAttribute('data-pressed', '');
            s.hold = window.setTimeout(() => bar.setAttribute('data-hold', ''), HOLD_MS);
        }
    };

    const onPointerMove = (e: PointerEvent<HTMLElement>) => {
        const s = st.current;
        if (e.pointerId !== s.id) return;
        s.pointerX = e.clientX;
        if (s.dragging) return;

        const dx = e.clientX - s.startX;
        const dy = e.clientY - s.startY;
        if (Math.abs(dx) > DRAG_START && Math.abs(dx) > Math.abs(dy)) {
            const bar = barRef.current;
            if (!bar) return;
            s.dragging = true;
            s.t = performance.now();
            bar.setPointerCapture(e.pointerId);
            bar.setAttribute('data-dragging', '');
            s.raf = requestAnimationFrame(frame);
        } else if (Math.abs(dy) > DRAG_START * 2) {
            finish(false); // повели вверх-вниз — это прокрутка, а не меню
        }
    };

    const onPointerUp = (e: PointerEvent<HTMLElement>) => {
        if (e.pointerId === st.current.id) finish(true);
    };

    const onPointerCancel = (e: PointerEvent<HTMLElement>) => {
        if (e.pointerId === st.current.id) finish(false);
    };

    // нажатие с клавиатуры или обычный клик; клик сразу после перетаскивания пропускаем
    const onItemClick = (index: number) => {
        if (st.current.justDragged) return;
        onSelect(index);
    };

    // «капля» по пути: при выборе нажатием слайдер вытягивается и пружинисто собирается обратно
    const prevShown = useRef(shown);
    useEffect(() => {
        const from = prevShown.current;
        prevShown.current = shown;
        const bar = barRef.current;
        if (!travel || !bar || from === shown || st.current.dragging) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const amp = Math.min(0.3, 0.1 + 0.07 * Math.abs(shown - from));
        bar.animate([{ '--nb-st': '0' }, { '--nb-st': String(amp), offset: 0.3 }, { '--nb-st': '0' }], {
            duration: 560,
            easing: 'cubic-bezier(0.3, 0.7, 0.3, 1)',
        });
    }, [shown, travel, barRef]);

    useEffect(() => {
        const s = st.current;
        return () => {
            cancelAnimationFrame(s.raf);
            clearTimeout(s.hold);
        };
    }, []);

    return { shown, pointed, bind: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel }, onItemClick };
}
