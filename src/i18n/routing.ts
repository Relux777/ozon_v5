import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['ru', 'uz', 'tg', 'hy', 'az', 'ka', 'ky', 'kk', 'en'],
    defaultLocale: 'ru',

    // у дефолтного языка (ru) URL без префикса: /menu
    // у остальных — с префиксом: /uz/menu, /ka/menu и т.д.
    localePrefix: 'as-needed',

    // hreflang отдаём сами через metadata (lib/seo.ts) с каноничным хостом;
    // заголовки Link от next-intl строятся по хосту запроса и могут с ними расходиться
    alternateLinks: false,

    // язык определяет только адрес: без автоматического редиректа по языку браузера и cookie. Google не советует
    // такие редиректы — человек из русской выдачи с английским браузером улетал бы на /en. Язык меняют в шапке
    localeDetection: false,

    // cookie с выбранным языком (NEXT_LOCALE) не ставим: при localeDetection: false её никто не читает —
    // язык берётся только из адреса. Меньше cookie — короче страница /menu/cookies и уведомление в РКН
    localeCookie: false,
});

export type AppLocale = (typeof routing.locales)[number];