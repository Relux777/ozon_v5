// src/components/ui/photo-slider/shared.ts — типы и помощники, общие для слайдера и окна просмотра (инструкция: photo-slider.md)
import { getImageProps, type StaticImageData } from 'next/image';

export type PhotoSlide = {
    /** статический импорт картинки (`import Shot from '@/assets/img/…/1.webp'`) */
    src: StaticImageData;
    /** описание для скринридеров и поисковиков */
    alt: string;
    /** подпись под фото (необязательно) */
    title?: string;
    text?: string;
};

/** Подписи приходят с сервера — так компоненту не нужны свои переводы. В шаблонах подставляются `{n}` и `{total}` */
export type PhotoSliderLabels = {
    /** название карусели, например «Скриншоты приложения» */
    region: string;
    /** название окна просмотра */
    viewer: string;
    prev: string;
    next: string;
    close: string;
    /** начало подписи кнопки-фото: «Открыть крупно: <title>» */
    open: string;
    /** шаблон «{n} из {total}» */
    position: string;
    /** шаблон «Показать снимок {n}» */
    goTo: string;
};

/** `sizes` картинки в окне просмотра — по нему же заранее грузим крупную версию (preloadLarge) */
export const VIEWER_SIZES = '(max-width: 620px) 100vw, 640px';

/** «{n} из {total}» → «3 из 7» */
export const formatLabel = (template: string, vars: Record<string, string | number>) =>
    template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ''));

/** 3 → «03» */
export const pad = (n: number) => String(n).padStart(2, '0');

export const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Крупную версию фото грузим заранее — при наведении/касании миниатюры, чтобы в окне просмотра она уже была в кэше.
// srcSet и sizes те же, что у <Image> в окне (getImageProps) — браузер выберет тот же файл.
const preloaded = new Set<string>();

export function preloadLarge(src: StaticImageData) {
    if (preloaded.has(src.src)) return;
    preloaded.add(src.src);

    const { props } = getImageProps({ src, alt: '', sizes: VIEWER_SIZES });
    const img = new window.Image();
    img.decoding = 'async';
    if (props.sizes) img.sizes = props.sizes;
    if (props.srcSet) img.srcset = props.srcSet;
    img.src = props.src;
}
