import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['ru', 'uz', 'hy', 'az', 'ka', 'ky', 'kk'],
    defaultLocale: 'ru',

    // у дефолтного языка (ru) URL без префикса: /menu
    // у остальных — с префиксом: /uz/menu, /ka/menu и т.д.
    localePrefix: 'as-needed',

    // помним выбор языка год, а не только сессию браузера
    localeCookie: {
        name: 'NEXT_LOCALE',
        maxAge: 60 * 60 * 24 * 365,
    },
});

export type AppLocale = (typeof routing.locales)[number];