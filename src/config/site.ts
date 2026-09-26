export const SITE_CONFIG = {
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ozon-rabota.ru',
} as const;

/**
 * Дата сверки текстов главной (шаги, выплаты, документы) со справкой Ozon Job (docs.ozon.ru).
 * Выводится на главной и уходит в sitemap.xml как lastModified — обновлять при каждой сверке.
 */
export const HOME_CHECKED_AT = '2026-09-22';

/** Дата сверки ответов /menu/support со справкой Ozon Job — выводится на странице и уходит в sitemap */
export const SUPPORT_CHECKED_AT = '2026-09-25';

/**
 * Подтверждение прав на сайт в панелях поисковиков — значение content из их мета-тега:
 * Яндекс Вебмастер (<meta name="yandex-verification" content="…">) и Google Search Console
 * (<meta name="google-site-verification" content="…">). Пусто — тег не выводится.
 */
export const SEARCH_VERIFICATION = {
    yandex: '',
    google: '',
};

/** Картинка для превью ссылок (Open Graph / Twitter): public/og.jpg, 1200×630 */
export const OG_IMAGE = { url: '/og.jpg', width: 1200, height: 630 } as const;
