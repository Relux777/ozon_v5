import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Все пути, кроме /api, /_next, /_vercel, путей с точкой (favicon.ico и т.п.) и картинок превью страниц городов:
    // Next пишет их адрес в og:image с языком (/ru/sklad/…/opengraph-image/…), а next-intl убрал бы /ru редиректом
    // Первый пункт — корень сайта: при basePath (сайт в подпапке /ozon) шаблон ниже его не ловит, и главная отдавала 404
    matcher: ['/', '/((?!api|_next|_vercel|.*opengraph-image|.*twitter-image|.*\\..*).*)'],
};