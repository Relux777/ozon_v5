// Адрес и подпапка задаются в next.config.ts (там же запасной адрес) и вшиваются при сборке.
export const SITE_CONFIG = {
    /** полный адрес сайта без «/» в конце: https://ozon.rendit.ru */
    url: process.env.NEXT_PUBLIC_SITE_URL as string,
    /** подпапка домена, в которой живёт приложение: '' — сайт в корне домена */
    basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
} as const;

/**
 * Полный адрес страницы по пути внутри сайта ('/', '/sklad/ufa', '/uz/menu'). Главную канонизируем без завершающего слэша.
 */
export const absoluteUrl = (path: string) => `${SITE_CONFIG.url}${path === '/' ? '' : path}`;

/**
 * Дата сверки текстов главной (шаги, выплаты, документы) со справкой Ozon Job (docs.ozon.ru).
 * Выводится на главной и уходит в sitemap.xml как lastModified — обновлять при каждой сверке.
 */
export const HOME_CHECKED_AT = '2026-09-22';

/** Дата сверки ответов /menu/support со справкой Ozon Job — выводится на странице и уходит в sitemap */
export const SUPPORT_CHECKED_AT = '2026-09-25';

/**
 * Когда сделаны скриншоты приложения в слайдере страниц городов (components/AppScreens): суммы и тарифы на них —
 * на эту дату (подпись AppScreens.note). Уходит в sitemap как lastModified страниц городов — переснимали, обновить.
 */
export const APP_SCREENS_TAKEN_AT = '2026-10-09';

/**
 * Подтверждение прав на сайт в панелях поисковиков — значение content из их мета-тега:
 * Яндекс Вебмастер (<meta name="yandex-verification" content="…">) и Google Search Console
 * (<meta name="google-site-verification" content="…">). Пусто — тег не выводится.
 */
export const SEARCH_VERIFICATION = {
    yandex: '43691b5335c5ae82',
    google: '',
};

/** Картинка для превью ссылок (Open Graph / Twitter): public/og.jpg, 1200×630. Адрес полный — на ozon.rendit.ru */
export const OG_IMAGE = { url: `${SITE_CONFIG.url}/og.jpg`, width: 1200, height: 630 } as const;

/**
 * Цвет панели браузера на телефоне — как фон страницы (--bg-phone в _variables.scss) в каждой теме.
 * Нужен в двух местах: viewport.themeColor в layout (по системной теме) и ThemeSwitch (по теме, выбранной на сайте)
 */
export const THEME_COLORS = { light: '#ededed', dark: '#000000' } as const;

/** Красный бренда «РенДит Работа» (--color-rendit-job в style.scss): логотип-сердце, значки */
export const BRAND_COLOR = '#e5243f';

/**
 * Цвет раздела (--bg-5 в _variables.scss) и края градиента цветных блоков ($promo-dark / $promo-light в style.scss) —
 * для мест, где CSS-переменные недоступны: манифест, картинки превью
 */
export const SECTION_COLOR = '#0d5ef5';
export const SECTION_GRADIENT = `linear-gradient(135deg, #0a44c0 0%, ${SECTION_COLOR} 55%, #4a9cff 100%)`;

/**
 * Знак бренда — сердце в два мазка, контуры в рамке 100×100 (тот же рисунок, что в src/assets/svg/logo.svg и значках;
 * все файлы бренда пересоздаёт scripts/brand-assets.cjs — рисунок менять и там, и здесь)
 */
export const BRAND_HEART = [
    'M54 23C45 9 24 6 12 19C-1 33 6 55 22 69C31 77 41 83 48 90C43 81 36 73 30 66C19 53 17 37 25 28C33 19 46 18 54 23Z',
    'M50 32C57 14 79 8 90 21C101 35 93 57 78 70C69 78 59 85 54 94C58 83 65 75 72 67C83 54 85 38 78 29C70 20 57 21 50 32Z',
] as const;
