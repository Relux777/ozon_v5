// Партнёрская программа: пользователь устанавливает приложение и вводит промокод.
//
// Код и сумма бонуса живут ТОЛЬКО в .env.local (PROMO_CODE, PROMO_USER_BONUS) — в коде значений по
// умолчанию нет, чтобы на сайт никогда не попал придуманный код или сумма. Если переменной нет,
// сборка/запуск упадёт с понятным сообщением.
//
// ВАЖНО перед публикацией:
//  1. Сверьте условия акции в актуальных правилах программы: сумма бонуса, срок, кто и когда его получает.
//  2. Не публикуйте сумму вашего вознаграждения — только то, что получает пользователь.
//
// Файл читается только на сервере (в клиентские компоненты значения передаются пропсами).

function required(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`[config/promo] не задана переменная окружения ${name} — добавьте её в .env.local`);
    }
    return value;
}

/** Официальная страница приложения Ozon Job: кнопка «Скачать» сама ведёт в нужный магазин */
const OFFICIAL_APP_PAGE = 'https://job.ozon.ru/app';

const userBonus = Number(required('PROMO_USER_BONUS'));
if (!Number.isFinite(userBonus) || userBonus <= 0) {
    throw new Error('[config/promo] PROMO_USER_BONUS должна быть положительным числом (рубли), например 2000');
}

export const PROMO = {
    code: required('PROMO_CODE'),
    /** сколько получает пользователь, ₽ */
    userBonus,
    /** ссылка на приложение для страниц городов; по умолчанию — официальная страница, можно подставить реферальную ссылку */
    appUrl: process.env.PROMO_APP_URL || OFFICIAL_APP_PAGE,
} as const;

/**
 * Карточки приложения Ozon Job в магазинах (проверены 2026-09-22).
 * Пустой url — кнопка магазина не показывается (AppGallery: страницу Ozon Job найти не удалось).
 */
export const APP_STORES = [
    {
        id: 'appStore',
        name: 'App Store',
        url: process.env.PROMO_URL_APPSTORE || 'https://apps.apple.com/ru/app/ozon-job/id6498711171',
    },
    {
        id: 'googlePlay',
        name: 'Google Play',
        url: process.env.PROMO_URL_GOOGLEPLAY || 'https://play.google.com/store/apps/details?id=ru.ozon.hire',
    },
    {
        id: 'ruStore',
        name: 'RuStore',
        url: process.env.PROMO_URL_RUSTORE || 'https://www.rustore.ru/catalog/app/ru.ozon.hire',
    },
    {
        id: 'appGallery',
        name: 'AppGallery',
        url: process.env.PROMO_URL_APPGALLERY || '',
    },
] as const;
