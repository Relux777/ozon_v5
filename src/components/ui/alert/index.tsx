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
    type PointerEvent,
    type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

export type AlertType = 'success' | 'error' | 'warning' | 'info';
export type AlertPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center' | 'center';

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
};

type AlertApi = {
    /** показать уведомление; возвращает ключ для close() */
    show: (options: AlertOptions) => number;
    close: (key: number) => void;
};

type AlertItem = {
    key: number;
    /** меняется при обновлении по id — перезапускает таймер */
    stamp: number;
    id?: string;
    title: string;
    text?: string;
    type: AlertType;
    duration: number;
    position: AlertPosition;
    leaving: boolean;
};

const POSITIONS: readonly AlertPosition[] = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center', 'center'];

const EXIT_MS = 240;
// свайп вбок дальше этого (px) закрывает уведомление
const SWIPE_CLOSE = 70;
// в свёрнутой «колоде» из-под переднего уведомления выглядывают не больше двух (см. _alert.scss)
const PEEK_COUNT = 2;
const PEEK_PX = 12;
const GAP_PX = 10;

const AlertContext = createContext<AlertApi | null>(null);
const NOOP: AlertApi = { show: () => -1, close: () => {} };

/** API уведомлений. Без <AlertProvider> выше по дереву — тихо ничего не делает (компонент не падает) */
export function useAlert(): AlertApi {
    return useContext(AlertContext) ?? NOOP;
}

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isBottom = (position: AlertPosition) => position.startsWith('bottom');

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
};

export function AlertProvider({ children, position = 'top-right', duration = 4000, max = 3 }: ProviderProps) {
    const t = useTranslations('A11y');
    const [items, setItems] = useState<AlertItem[]>([]);
    // текст для скринридера: отдельные живые регионы есть в DOM заранее, иначе первое сообщение не объявляется
    const [announce, setAnnounce] = useState({ polite: '', assertive: '' });
    const [mounted, setMounted] = useState(false);
    const counter = useRef(0);
    const flip = useRef(false);

    useEffect(() => setMounted(true), []);

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

            // одинаковый текст подряд живой регион не объявит — чередуем невидимый символ в конце
            flip.current = !flip.current;
            const message = `${options.text ? `${options.title}. ${options.text}` : options.title}${flip.current ? '​' : ''}`;
            setAnnounce(fresh.type === 'error' ? { polite: '', assertive: message } : { polite: message, assertive: '' });

            return stamp;
        },
        [duration, position, max],
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
    label: string;
    closeLabel: string;
    onClose: (key: number) => void;
    onRemoved: (key: number) => void;
};

function AlertStack({ corner, items, label, closeLabel, onClose, onRemoved }: StackProps) {
    const ref = useRef<HTMLElement>(null);
    // естественная высота каждого уведомления (по содержимому) — из неё считаются сдвиги раскрытого списка
    const [heights, setHeights] = useState<Record<number, number>>({});

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
        <section ref={ref} className={`alert-stack alert-${corner}`} aria-label={label} style={style}>
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
};

function AlertCard({ item, index, offset, height, bottom, closeLabel, onClose, onRemoved }: CardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const drag = useRef<{ id: number; x: number; dx: number } | null>(null);
    const { key, leaving } = item;
    // закрывающееся уведомление гаснет на своём месте в стопке, а не прыгает вперёд (index у него уже −1)
    const [place, setPlace] = useState({ index: Math.max(index, 0), offset });
    if (index >= 0 && (place.index !== index || place.offset !== offset)) setPlace({ index, offset });

    // закрытие: гаснет и уезжает к краю экрана (вверх или вниз), соседи плавно занимают место (transition в CSS)
    useLayoutEffect(() => {
        if (!leaving) return;
        const el = ref.current;
        if (!el || reducedMotion()) {
            onRemoved(key);
            return;
        }

        const animation = el.animate([{ opacity: 1 }, { opacity: 0, translate: bottom ? '0 30%' : '0 -30%', scale: '0.94' }], {
            duration: EXIT_MS,
            easing: 'cubic-bezier(0.4, 0, 1, 1)',
            fill: 'forwards',
        });
        animation.finished.then(
            () => onRemoved(key),
            () => onRemoved(key),
        );
    }, [leaving, key, bottom, onRemoved]);

    // ── Свайп вбок закрывает (палец и мышь); кнопка внутри — как обычно ───────────────────────────
    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (leaving || (e.target as HTMLElement).closest('button')) return;
        drag.current = { id: e.pointerId, x: e.clientX, dx: 0 };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        if (!d || d.id !== e.pointerId) return;
        d.dx = e.clientX - d.x;
        e.currentTarget.style.translate = `${d.dx}px 0`;
        e.currentTarget.style.opacity = String(1 - Math.min(Math.abs(d.dx) / 220, 0.7));
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const d = drag.current;
        drag.current = null;
        if (!d) return;
        const el = e.currentTarget;

        if (Math.abs(d.dx) > SWIPE_CLOSE) {
            el.animate([{ translate: `${d.dx}px 0` }, { translate: `${Math.sign(d.dx) * 120}% 0`, opacity: 0 }], {
                duration: 200,
                easing: 'ease-in',
                fill: 'forwards',
            }).finished.then(
                () => onRemoved(key),
                () => onRemoved(key),
            );
            return;
        }

        if (d.dx !== 0) el.animate([{ translate: el.style.translate }, { translate: '0 0' }], { duration: 220, easing: 'ease-out' });
        el.style.translate = '';
        el.style.opacity = '';
    };

    const style = { '--i': place.index, '--offset': `${place.offset}px`, '--h': `${height}px` } as CSSProperties;
    const state = place.index === 0 ? ' is-front' : place.index > PEEK_COUNT ? ' is-buried' : '';

    return (
        <div
            ref={ref}
            className={`alert alert-${item.type}${state}${leaving ? ' is-leaving' : ''} br-20 overflow-hidden`}
            style={style}
            // задние уведомления свёрнутой «колоды» — только для глаз; читаются и нажимаются, когда стопка раскрыта
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            <div className='alert-inner flex nowrap align-center gap-12' data-key={key}>
                <span className='alert-icon grid place-center shrink-0' aria-hidden='true'>
                    <svg width='18' height='18' viewBox='0 0 24 24' aria-hidden='true' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
                        {ICONS[item.type]}
                    </svg>
                </span>

                <div className='alert-body grid gap-2 flex-1'>
                    <b className='alert-title'>{item.title}</b>
                    {item.text && <span className='alert-text'>{item.text}</span>}
                </div>

                {/* крестик в кольце-таймере: кольцо «сгорает» за duration и закрывает уведомление; пауза — при наведении (CSS) */}
                <button type='button' className='alert-close grid place-center shrink-0 br-round hover-none' aria-label={closeLabel} onClick={() => onClose(key)}>
                    {item.duration > 0 && !leaving && (
                        <svg className='alert-ring' viewBox='0 0 32 32' aria-hidden='true' key={item.stamp}>
                            <circle
                                cx='16'
                                cy='16'
                                r='14.5'
                                pathLength={1}
                                style={{ animationDuration: `${item.duration}ms` }}
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
