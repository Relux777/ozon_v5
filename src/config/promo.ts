// Партнёрская программа: пользователь устанавливает приложение и вводит промокод.
//
// Значения — прямо здесь, без .env: их редко меняют, а так проще редактировать и видно сразу,
// что нужно заменить перед публикацией.
//
// ВАЖНО перед публикацией:
//  1. Замените CODE и USER_BONUS на реальные и сверьте условия акции в актуальных правилах программы:
//     сумма бонуса, срок, кто и когда его получает.
//  2. Не публикуйте сумму вашего вознаграждения — только то, что получает пользователь.

/** Код приглашения Ozon Job (действующий, заменён владельцем 2026-09-25) */
const CODE = 'QK3HMR42';

/** Максимальный бонус новичку по коду, ₽ — выводится как «до N ₽». По спискам складов в справке Ozon Job (сентябрь 2026):
 *  1 000 ₽ — крупные склады и СЦ, 2 000 ₽ — дарксторы Ozon fresh, 5 000 ₽ — fresh «Новая Рига»; условие — доход 30 000 ₽ за 30 дней */
const USER_BONUS = 5000;

/** Официальная страница приложения Ozon Job: кнопка «Скачать» сама ведёт в нужный магазин */
const OFFICIAL_APP_PAGE = 'https://job.ozon.ru/app';

/** Ссылка для страниц городов; пусто — используется официальная страница выше. Сюда можно вписать свою реферальную ссылку */
const APP_URL = '';

/**
 * Идентификатор рекламы (erid) — выдаёт оператор рекламных данных (ОРД) при маркировке (ст. 18.1 ФЗ «О рекламе»).
 * Пусто — не выводится; с ним — показывается в пометке рекламы рядом с кодом. То же поле у CARD и в config/referrals.ts
 */
const CODE_ERID = '';

export const PROMO = {
    code: CODE,
    userBonus: USER_BONUS,
    appUrl: APP_URL || OFFICIAL_APP_PAGE,
    erid: CODE_ERID,
} as const;

/**
 * Карточки приложения Ozon Job в магазинах (проверены 2026-09-22).
 * Пустой url — кнопка магазина не показывается (AppGallery: страницу Ozon Job найти не удалось).
 */
export const APP_STORES = [
    {
        id: 'appStore',
        name: 'App Store',
        url: 'https://apps.apple.com/ru/app/ozon-job/id6498711171',
    },
    {
        id: 'googlePlay',
        name: 'Google Play',
        url: 'https://play.google.com/store/apps/details?id=ru.ozon.hire',
    },
    {
        id: 'ruStore',
        name: 'RuStore',
        url: 'https://www.rustore.ru/catalog/app/ru.ozon.hire',
    },
    {
        id: 'appGallery',
        name: 'AppGallery',
        url: '',
    },
] as const;

// Ozon Карта — реферальная ссылка «Приведи друга» из Ozon Банка (другая программа, не PROMO выше).
// Ссылка персональная (выдаётся в приложении банка): Ozon Банк → Выгода → Пригласите друзей.
// Сверено 2026-09-23: https://help-bank.ozon.ru/individuals/bonuses-and-promotions/referral
export const CARD = {
    url: 'https://ozon.ru/fintech/promo/ref/Q8Z2WF91J',
    /** идентификатор рекламы из ОРД — см. CODE_ERID выше */
    erid: '',
} as const;
