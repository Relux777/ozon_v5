// src/components/ui/alert/index.tsx — всплывающие уведомления («тосты»), инструкция: alert.md рядом
'use client';

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type PointerEvent,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';

/** кнопка действия в уведомлении («Отменить», «Открыть»): после нажатия уведомление закрывается */
export type AlertAction = { label: string; onClick: () => void };

export type AlertOptions = {
    /** заголовок: «Адрес скопирован» */
    title: string;
    /** вторая строка (до двух строк, дальше многоточие): сам адрес, код, ссылка */
    text?: string;
    type?: AlertType;
    /** через сколько мс закрыть; 0 — только вручную. По умолчанию — duration провайдера */
    duration?: number;
    position?: AlertPosition;
    /** уведомление с тем же id не дублируется, а выходит вперёд, обновляется и заново отсчитывает время */
    id?: string;
    action?: AlertAction;
};

type AlertApi = {
    /** показать уведомление; возвращает ключ для close() */
    show: (options: AlertOptions) => number;
    close: (key: number) => void;
};

type AlertItem = {
    key: number;
    /** меняется при обновлении по id — перезапускает таймер и «подпрыгивание» карточки */
    stamp: number;
    id?: string;
    title: string;
    text?: string;
    type: AlertType;
    duration: number;
    position: AlertPosition;
    action?: AlertAction;
    leaving: boolean;
};

const POSITIONS: readonly AlertPosition[] = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center', 'center'];

const EXIT_MS = 260;
// свайп вбок дальше этого (px) закрывает уведомление; быстрый «смах» (px/мс) — и на меньшем расстоянии
const SWIPE_CLOSE = 70;
const SWIPE_FLICK = 0.55;
const SWIPE_FLICK_MIN = 24;
// в свёрнутой «колоде» из-под переднего уведомления выглядывают не больше двух (см. _alert.scss)
const PEEK_COUNT = 2;
const PEEK_PX = 12;
const GAP_PX = 10;
// «капля», из которой раскрывается и в которую сворачивается уведомление: иконка с полями (= $pill в _alert.scss)
const PILL_PX = 60;

// Пружина для анимаций из JS — та же кривая, что $spring в _alert.scss (easing-функция linear()); в браузерах без неё — обычная кривая
const SPRING =
    'linear(0, 0.001 0.5%, 0.0084 1.7%, 0.0292 3.2%, 0.0683 5%, 0.1283 7.2%, 0.2088 9.6%, 0.3067 12.3%, 0.4169 15.2%, 0.5328 18.3%, 0.6472 21.7%, 0.7538 25.3%, 0.847 29%, 0.9234 33%, 0.9812 37.1%, 1.0207 41.5%, 1.0438 46%, 1.0534 50.7%, 1.0531 55.5%, 1.0463 60.5%, 1.0362 65.7%, 1.0254 71.1%, 1.0156 76.5%, 1.0078 82.2%, 1.0023 88%, 0.999 93.9%, 1)';
const springEasing = () =>
    typeof CSS !== 'undefined' && CSS.supports('transition-timing-function', 'linear(0, 1)') ? SPRING : 'cubic-bezier(0.22, 1.2, 0.36, 1)';

// Короткий отклик вибрацией на телефоне (Android; iOS вибрацию из браузера не даёт): у ошибки — тройной, как в системных уведомлениях
const HAPTICS: Record<AlertType, number | number[]> = { success: 10, info: 8, warning: [12, 50, 12], error: [14, 60, 14, 60, 14] };

const AlertContext = createContext<AlertApi | null>(null);
const NOOP: AlertApi = { show: () => -1, close: () => {} };

/** API уведомлений. Без <AlertProvider> выше по дереву — тихо ничего не делает (компонент не падает) */
export function useAlert(): AlertApi {
    return useContext(AlertContext) ?? NOOP;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isBottom = (position: AlertPosition) => position.startsWith('bottom');

function buzz(type: AlertType) {
    try {
        if (!('vibrate' in navigator) || reducedMotion()) return;
        if (!window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
        navigator.vibrate(HAPTICS[type]);
    } catch {
        // вибрация недоступна или запрещена — уведомление работает и без неё
    }
}

// Иконки — свои SVG-контуры (24×24, stroke), чтобы папка переносилась без зависимостей
const ICONS: Record<AlertType, ReactNode> = {
    success: <path className='alert-icon-mark' d='m6.5 12.5 3.6 3.6 7.4-8.2' pathLength={1} />,
    error: <path className='alert-icon-mark' d='M16.5 7.5l-9 9m0-9 9 9' pathLength={1} />,
    warning: <path className='alert-icon-mark' d='M12 6.5v7.5m0 3.6h.01' pathLength={1} />,
    info: <path className='alert-icon-mark' d='M12 17.5v-7m0-3.6h.01' pathLength={1} />,
};

type ProviderProps = {
    children: ReactNode;
    /** где показывать по умолчанию (у каждого уведомления можно переопределить) */
    position?: AlertPosition;
    /** сколько мс висит уведомление по умолчанию */
    duration?: number;
    /** сколько уведомлений одновременно в одном углу; лишние, самые старые, закрываются */
    max?: number;
    /** короткая вибрация при появлении уведомления на телефоне */
    haptics?: boolean;
};

export function AlertProvider({ children, position = 'top-right', duration = 4000, max = 3, haptics = true }: ProviderProps) {
    const t = useTranslations('A11y');
    const [items, setItems] = useState<AlertItem[]>([]);
    // текст для скринридера: отдельные живые регионы есть в DOM заранее, иначе первое сообщение не объявляется
    const [announce, setAnnounce] = useState({ polite: '', assertive: '' });
    const [mounted, setMounted] = useState(false);
    // вкладка скрыта — время уведомлений стоит: иначе они сгорят, пока человек смотрит в другую вкладку
    const [hidden, setHidden] = useState(false);
    const counter = useRef(0);
    const flip = useRef(false);

    useEffect(() => {
        setMounted(true);
        const onVisibility = () => setHidden(document.hidden);
        document.addEventListener('visibilitychange', onVisibility);
        return () => document.removeEventListener('visibilitychange', onVisibility);
    }, []);

    const close = useCallback((key: number) => {
        setItems((list) => list.map((item) => (item.key === key ? { ...item, leaving: true } : item)));
    }, []);

    const remove = useCallback((key: number) => {
        setItems((list) => list.filter((item) => item.key !== key));
    }, []);

    const show = useCallback(
        (options: AlertOptions) => {
            counter.current += 1;
            const stamp = counter.current;
            const fresh: AlertItem = {
                key: stamp,
                stamp,
                id: options.id,
                title: options.title,
                text: options.text,
                type: options.type ?? 'success',
                duration: options.duration ?? duration,
                position: options.position ?? position,
                action: options.action,
                leaving: false,
            };

            setItems((list) => {
                // то же уведомление (по id) — выходит вперёд с тем же ключом, таймер начинается заново
                const same = options.id ? list.find((item) => item.id === options.id && !item.leaving) : undefined;
                const next = same ? [...list.filter((item) => item !== same), { ...fresh, key: same.key }] : [...list, fresh];

                const inCorner = next.filter((item) => item.position === fresh.position && !item.leaving);
                const extra = inCorner.length - max;
                if (extra <= 0) return next;

                const drop = new Set(inCorner.slice(0, extra).map((item) => item.key));
                return next.map((item) => (drop.has(item.key) ? { ...item, leaving: true } : item));
            });

            // одинаковый текст подряд живой регион не объявит — чередуем невидимый символ (пробел нулевой ширины) в конце
            flip.current = !flip.current;
            const message = `${options.text ? `${options.title}. ${options.text}` : options.title}${flip.current ? '\u200b' : ''}`;
            setAnnounce(fresh.type === 'error' ? { polite: '', assertive: message } : { polite: message, assertive: '' });

            if (haptics) buzz(fresh.type);

            return stamp;
        },
        [duration, position, max, haptics],
    );

    const api = useMemo(() => ({ show, close }), [show, close]);

    return (
        <AlertContext.Provider value={api}>
            {children}
            {mounted &&
                createPortal(
                    <>
                        <output className='sr-only' aria-atomic='true'>
                            {announce.polite}
                        </output>
                        <div className='sr-only' role='alert' aria-atomic='true'>
                            {announce.assertive}
                        </div>
                        {POSITIONS.map((corner) => {
                            const list = items.filter((item) => item.position === corner);
                            if (list.length === 0) return null;

                            return (
                                <AlertStack
                                    corner={corner}
                                    items={list}
                                    paused={hidden}
                                    label={t('alerts')}
                                    closeLabel={t('alertClose')}
                                    onClose={close}
                                    onRemoved={remove}
                                    key={corner}
                                />
                            );
                        })}
                    </>,
                    document.body,
                )}
        </AlertContext.Provider>
    );
}

// ── Стопка в одном углу: свёрнута «колодой», при наведении/фокусе раскрывается списком ───────────
type StackProps = {
    corner: AlertPosition;
    items: AlertItem[];
    paused: boolean;
    label: string;
    closeLabel: string;
    onClose: (key: number) => void;
    onRemoved: (key: number) => void;
};

function AlertStack({ corner, items, paused, label, closeLabel, onClose, onRemoved }: StackProps) {
    const ref = useRef<HTMLElement>(null);
    // откуда фокус пришёл в стопку — туда он вернётся, когда уведомление закроют с клавиатуры
    const returnTo = useRef<HTMLElement | null>(null);
    // естественная высота каждого уведомления (по содержимому) — из неё считаются сдвиги раскрытого списка
    const [heights, setHeights] = useState<Record<number, number>>({});

    // Верхний слой браузера (Popover API): стопка рисуется поверх всего — любых z-index, модальных <dialog>, полноэкранных
    // окон. Эффект стоит первым: до него [popover] скрыт, и замер высот ниже дал бы нули. Без поддержки — обычный z-index
    useLayoutEffect(() => {
        const stack = ref.current;
        try {
            if (stack?.showPopover && !stack.matches(':popover-open')) stack.showPopover();
        } catch {
            // браузер без Popover API или элемент уже показан — остаётся position: fixed с --alert-z
        }
    }, []);

    // biome-ignore lint/correctness/useExhaustiveDependencies: перемерить при каждом изменении списка — появились новые карточки
    useLayoutEffect(() => {
        const stack = ref.current;
        if (!stack) return;

        const measure = () => {
            const next: Record<number, number> = {};
            for (const el of stack.querySelectorAll<HTMLElement>('.alert-inner')) next[Number(el.dataset.key)] = el.offsetHeight;
            setHeights((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
        };

        measure();
        const observer = new ResizeObserver(measure);
        for (const el of stack.querySelectorAll('.alert-inner')) observer.observe(el);
        return () => observer.disconnect();
    }, [items]);

    useEffect(() => {
        const stack = ref.current;
        if (!stack) return;
        const onFocusIn = (e: FocusEvent) => {
            const from = e.relatedTarget as HTMLElement | null;
            if (from && !stack.contains(from)) returnTo.current = from;
        };
        stack.addEventListener('focusin', onFocusIn);
        return () => stack.removeEventListener('focusin', onFocusIn);
    }, []);

    // закрывают уведомление, в котором стоит фокус: передаём его соседнему уведомлению, а если их нет — туда, откуда пришёл
    const handOffFocus = useCallback((card: HTMLElement) => {
        if (!card.contains(document.activeElement)) return;
        const others = [...(ref.current?.querySelectorAll<HTMLElement>('.alert:not(.is-leaving) .alert-close') ?? [])];
        const next = others.find((button) => !card.contains(button)) ?? returnTo.current;
        if (next?.isConnected) next.focus();
        else (document.activeElement as HTMLElement | null)?.blur();
    }, []);

    // новое — первым (индекс 0 — переднее уведомление)
    const ordered = [...items].reverse();
    const live = ordered.filter((item) => !item.leaving);
    const height = (item: AlertItem) => heights[item.key] ?? 72;
    const frontHeight = live[0] ? height(live[0]) : 0;

    let offset = 0;
    const layout = ordered.map((item) => {
        const index = live.indexOf(item);
        const at = offset;
        if (index >= 0) offset += height(item) + GAP_PX;
        return { item, index, offset: at };
    });

    const peek = Math.min(Math.max(live.length - 1, 0), PEEK_COUNT) * PEEK_PX;
    const style = {
        '--front-h': `${frontHeight}px`,
        '--stack-h': `${frontHeight + peek}px`,
        '--stack-full': `${Math.max(offset - GAP_PX, 0)}px`,
    } as CSSProperties;

    return (
        <section ref={ref} className={`alert-stack alert-${corner}${paused ? ' is-paused' : ''}`} aria-label={label} style={style} popover='manual'>
            {layout.map(({ item, index, offset: shift }) => (
                <AlertCard
                    item={item}
                    index={index}
                    offset={shift}
                    height={height(item)}
                    bottom={isBottom(corner)}
                    closeLabel={closeLabel}
                    onClose={onClose}
                    onRemoved={onRemoved}
                    onFocusLeave={handOffFocus}
                    key={item.key}
                />
            ))}
        </section>
    );
}

type CardProps = {
    item: AlertItem;
    /** место в стопке: 0 — переднее, −1 — закрывается */
    index: number;
    /** сдвиг в раскрытом списке, px */
    offset: number;
    height: number;
    bottom: boolean;
    closeLabel: string;
    onClose: (key: number) => void;
    onRemoved: (key: number) => void;
    onFocusLeave: (card: HTMLElement) => void;
};

type Drag = { id: number; x: number; dx: number; lastX: number; lastT: number; v: number };

function AlertCard({ item, index, offset, height, bottom, closeLabel, onClose, onRemoved, onFocusLeave }: CardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const drag = useRef<Drag | null>(null);
    const [dragging, setDragging] = useState(false);
    const { key, leaving, stamp } = item;
    const shownStamp = useRef(stamp);
    // закрывающееся уведомление гаснет на своём месте в стопке, а не прыгает вперёд (index у него уже −1)
    const [place, setPlace] = useState({ index: Math.max(index, 0), offset });
    if (index >= 0 && (place.index !== index || place.offset !== offset)) setPlace({ index, offset });

    // то же уведомление показали ещё раз (по id): карточка «подпрыгивает» — видно, что действие сработало снова.
    // Иконка и кольцо-таймер перерисовываются сами: у них key = stamp
    useEffect(() => {
        if (shownStamp.current === stamp) return;
        shownStamp.current = stamp;
        if (!reducedMotion()) ref.current?.animate([{ scale: '1' }, { scale: '1.045' }, { scale: '1' }], { duration: 460, easing: springEasing() });
    }, [stamp]);

    // закрытие: текст гаснет, карточка сворачивается обратно в «каплю» у иконки и исчезает;
    // соседи пружиной занимают её место (transition в CSS)
    useLayoutEffect(() => {
        if (!leaving) return;
        const el = ref.current;
        if (!el || reducedMotion()) {
            onRemoved(key);
            return;
        }

        const done = () => onRemoved(key);
        for (const part of el.querySelectorAll('.alert-body, .alert-action, .alert-close')) {
            part.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: 'ease-out', fill: 'forwards' });
        }
        // высоту держим свою: стопка уже пересчитана без этой карточки (--front-h), и CSS схлопнул бы её в полоску
        const height = `${el.offsetHeight}px`;
        el.animate(
            [
                { opacity: 1, width: `${el.offsetWidth}px`, height, scale: '1', filter: 'blur(0px)' },
                { opacity: 1, width: `${PILL_PX}px`, height, scale: '1', filter: 'blur(0px)', offset: 0.62 },
                { opacity: 0, width: `${PILL_PX}px`, height, scale: '0.6', filter: 'blur(6px)', translate: bottom ? '0 10px' : '0 -10px' },
            ],
            { duration: EXIT_MS, easing: 'cubic-bezier(0.4, 0, 0.6, 1)', fill: 'forwards' },
        ).finished.then(done, done);
    }, [leaving, key, bottom, onRemoved]);

    const dismiss = () => {
        if (ref.current) onFocusLeave(ref.current);
        onClose(key);
    };

    const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        if (e.key !== 'Escape') return;
        e.stopPropagation();
        dismiss();
    };

    // ── Свайп вбок закрывает (палец и мышь); кнопки внутри — как обычно ───────────────────────────
    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (leaving || (e.target as HTMLElement).closest('button')) return;
        drag.current = { id: e.pointerId, x: e.clientX, dx: 0, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
        e.currentTarget.setPointerCapture(e.pointerId);
        // пока уведомление держат — время стоит и карточка идёт за пальцем без задержки (.is-dragging в CSS)
        setDragging(true);
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        const dt = e.timeStamp - d.lastT;
        // скорость сглажена: одно резкое событие в конце жеста не должно решать, закрывать или нет
        if (dt > 0) d.v = d.v * 0.4 + ((e.clientX - d.lastX) / dt) * 0.6;
        d.lastX = e.clientX;
        d.lastT = e.timeStamp;
        d.dx = e.clientX - d.x;
        e.currentTarget.style.translate = `${d.dx}px 0`;
        e.currentTarget.style.opacity = String(1 - Math.min(Math.abs(d.dx) / 220, 0.7));
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        drag.current = null;
        setDragging(false);
        if (!d) return;
        const el = e.currentTarget;
        const flick = Math.abs(d.v) > SWIPE_FLICK && Math.abs(d.dx) > SWIPE_FLICK_MIN && Math.sign(d.v) === Math.sign(d.dx);

        if (Math.abs(d.dx) > SWIPE_CLOSE || flick) {
            const done = () => onRemoved(key);
            el.animate([{ translate: `${d.dx}px 0` }, { translate: `${Math.sign(d.dx) * 120}% 0`, opacity: 0 }], {
                // быстрый смах — уведомление улетает быстрее
                duration: flick ? 150 : 210,
                easing: 'cubic-bezier(0.3, 0, 0.8, 0.6)',
                fill: 'forwards',
            }).finished.then(done, done);
            return;
        }

        if (d.dx !== 0) el.animate([{ translate: el.style.translate }, { translate: '0 0' }], { duration: 420, easing: springEasing() });
        el.style.translate = '';
        el.style.opacity = '';
    };

    const style = { '--i': place.index, '--offset': `${place.offset}px`, '--h': `${height}px` } as CSSProperties;
    const state = place.index === 0 ? ' is-front' : place.index > PEEK_COUNT ? ' is-buried' : '';

    return (
        <div
            ref={ref}
            className={`alert alert-${item.type}${state}${leaving ? ' is-leaving' : ''}${dragging ? ' is-dragging' : ''} overflow-hidden`}
            style={style}
            // задние уведомления свёрнутой «колоды» — только для глаз; читаются и нажимаются, когда стопка раскрыта
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            {/* ширина содержимого = ширине стопки (100cqw в CSS): карточка раскрывается из «капли», а текст не переверстывается */}
            <div className='alert-inner flex nowrap align-center gap-12' data-key={key}>
                <span className='alert-icon grid place-center shrink-0' aria-hidden='true' key={stamp}>
                    <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
                        {ICONS[item.type]}
                    </svg>
                </span>

                <div className='alert-body grid gap-2 flex-1'>
                    <b className='alert-title'>{item.title}</b>
                    {item.text && <span className='alert-text'>{item.text}</span>}
                </div>

                {item.action && (
                    <button
                        type='button'
                        className='alert-action shrink-0 hover-none'
                        onKeyDown={onKeyDown}
                        onClick={() => {
                            item.action?.onClick();
                            dismiss();
                        }}
                    >
                        {item.action.label}
                    </button>
                )}

                {/* крестик в кольце-таймере: кольцо «сгорает» за duration и закрывает уведомление; паузы — в CSS (.alert-ring) */}
                <button type='button' className='alert-close grid place-center shrink-0 br-round hover-none' aria-label={closeLabel} onKeyDown={onKeyDown} onClick={dismiss}>
                    {item.duration > 0 && !leaving && (
                        <svg className='alert-ring' viewBox='0 0 32 32' aria-hidden='true' key={stamp}>
                            <circle
                                cx='16'
                                cy='16'
                                r='14.5'
                                pathLength={1}
                                // длительность — с !important: сбросы «без анимации» (animation-duration: 0.01ms !important у «*»,
                                // как в ReluxCode) иначе обнуляют таймер, и уведомление закрывается, не успев появиться.
                                // Перебить !important из слоя может только !important в style самого элемента; React его в style не пишет
                                ref={(circle) => circle?.style.setProperty('animation-duration', `${item.duration}ms`, 'important')}
                                onAnimationEnd={(e) => {
                                    e.stopPropagation();
                                    onClose(key);
                                }}
                            />
                        </svg>
                    )}
                    <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' aria-hidden='true'>
                        <path d='M17 7 7 17M7 7l10 10' />
                    </svg>
                </button>
            </div>
        </div>
    );
}
