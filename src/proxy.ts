import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Все пути, кроме /api, /_next, /_vercel и путей с точкой (favicon.ico и т.п.)
    matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};