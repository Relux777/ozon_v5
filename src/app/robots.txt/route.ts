// robots.txt — обработчиком маршрута, а не robots.ts: MetadataRoute.Robots не умеет директиву Яндекса Clean-param.
// Clean-param говорит Яндексу, что метки рекламы и рассылок (utm_*, yclid, gclid…) не меняют страницу, — иначе
// ссылки с метками из Telegram/рекламы попадают в индекс отдельными страницами-дублями.
//
// Приложение живёт в корне ozon.rendit.ru, поэтому маршрут отдаёт robots.txt непосредственно по адресу /robots.txt.
import { SITE_CONFIG } from '@/config/site';

// export const dynamic = 'force-static' здесь больше не нужен (и с Cache Components запрещён): обработчик не читает
// данные запроса, поэтому Next пререндерит его сам
const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'yclid', 'gclid', 'fbclid'];

export function GET() {
    const body = [
        'User-agent: *',
        'Allow: /',
        '',
        'User-agent: Yandex',
        'Allow: /',
        `Clean-param: ${TRACKING_PARAMS.join('&')}`,
        '',
        `Sitemap: ${SITE_CONFIG.url}/sitemap.xml`,
        '',
    ].join('\n');

    return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
