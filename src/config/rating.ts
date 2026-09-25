// Рейтинг Ozon Job — цифры для страницы /menu/level (подписи — LevelPage.* в messages/*.json).
//
// Источники (сверено 2026-09-25): приложение Ozon Job — экраны «Рейтинг», «Как считаем рейтинг», «Нарушения»
// (скриншоты владельца), и справка https://docs.ozon.ru/job-ff-help/rating/rating/ и …/rating/ban/.
// Пороги уровней и сроки записи приложение показывает «для последнего склада» исполнителя — на других складах
// могут отличаться; на странице это оговорено. Поменялись цифры в приложении — править здесь.
import { routing, type AppLocale } from '@/i18n/routing';

/** Дата сверки — выводится на странице и уходит в sitemap как lastModified */
export const RATING_CHECKED_AT = '2026-09-25';

/**
 * Языки, на которых страница переведена и индексируется. С 2026-09-25 — все 7. Если добавите язык без перевода
 * LevelPage — уберите его отсюда: на нём будет noindex, и он выпадет из sitemap и hreflang.
 */
export const LEVEL_LOCALES: readonly AppLocale[] = routing.locales;

export type Duration = { n: number; unit: 'hours' | 'days' };

/**
 * Уровни по шкале приложения (−1000 · −600 · 199 · 599 · >599): upTo — верхняя граница баллов,
 * over — у «Бриллианта» («больше 599»); booking — за сколько открывается запись на слоты;
 * payoutHours — через сколько часов приходит выплата на карту Ozon Банка (справка «График выплат»)
 */
export const LEVELS = [
    { id: 'level0', upTo: -1000, booking: { n: 8, unit: 'hours' }, payoutHours: 12, color: '#e03131' },
    { id: 'level1', upTo: -600, booking: { n: 3, unit: 'days' }, payoutHours: 12, color: '#f76707' },
    { id: 'level2', upTo: 199, booking: { n: 7, unit: 'days' }, payoutHours: 12, color: '#f59f00' },
    { id: 'level3', upTo: 599, booking: { n: 30, unit: 'days' }, payoutHours: 12, color: '#0ca678' },
    { id: 'diamond', over: 599, booking: { n: 365, unit: 'days' }, payoutHours: 3, color: '#005bff' },
] as const satisfies readonly { id: string; upTo?: number; over?: number; booking: Duration; payoutHours: number; color: string }[];

/** «Новичок»: уровень появляется после стольких часов на объектах; выплаты — через 3 часа */
export const NEWBIE_HOURS = 55;

/** Начисление за производительность: процент → баллы (считается относительно самых продуктивных исполнителей уровня) */
export const PRODUCTIVITY = [
    { pct: 150, points: 200 },
    { pct: 100, points: 100 },
    { pct: 90, points: 90 },
    { pct: 80, points: 80 },
    { pct: 70, points: 70 },
    { pct: 60, points: 60 },
    { pct: 50, points: 50 },
    { pct: 40, points: 40 },
    { pct: 30, points: 30 },
    { pct: 20, points: 20 },
] as const;

/** Ранняя запись: надбавка в % к баллам за производительность. less — «менее чем за», иначе «более чем за» */
export const EARLY_BOOKING = [
    { less: true, n: 24, unit: 'hours', bonus: 0 },
    { less: false, n: 24, unit: 'hours', bonus: 10 },
    { less: false, n: 36, unit: 'hours', bonus: 20 },
    { less: false, n: 3, unit: 'days', bonus: 30 },
    { less: false, n: 7, unit: 'days', bonus: 40 },
    { less: false, n: 14, unit: 'days', bonus: 50 },
] as const satisfies readonly (Duration & { less: boolean; bonus: number })[];

/** Списания за производительность и невыход (невыход ещё и «банан») */
export const LOW_PRODUCTIVITY = [
    { id: 'lt20', points: -20 },
    { id: 'lt5', points: -200 },
    { id: 'noShow', points: -200 },
] as const;

/** Отмена записи «менее чем за …» → списание; последняя строка — отмена после начала записи */
export const CANCELLATION = [
    { n: 72, unit: 'hours', points: -20 },
    { n: 48, unit: 'hours', points: -30 },
    { n: 24, unit: 'hours', points: -40 },
    { n: 12, unit: 'hours', points: -50 },
    { n: 6, unit: 'hours', points: -60 },
    { n: 5, unit: 'hours', points: -70 },
    { n: 4, unit: 'hours', points: -80 },
    { n: 3, unit: 'hours', points: -90 },
    { n: 2, unit: 'hours', points: -100 },
    { n: 1, unit: 'hours', points: -150 },
] as const satisfies readonly (Duration & { points: number })[];

export const CANCEL_AFTER_START = -175;

/** Самое большое значение в таблицах — от него считается длина полосок */
export const POINTS_MAX = 200;

/** Бананы: сколько → что будет (справка «Ограничения и блокировка») */
export const BANANAS = [
    { count: '1–3', id: 'warning', color: '#f59f00' },
    { count: '4', id: 'cancel', color: '#f76707' },
    { count: '5', id: 'ban2', color: '#e8590c' },
    { count: '6', id: 'ban7', color: '#e03131' },
    { count: '7+', id: 'ban30', color: '#c92a2a' },
] as const;

/** Один банан снимают за столько слотов подряд без нарушений */
export const SLOTS_PER_BANANA = 3;
