// robots.txt — обработчиком маршрута, а не robots.ts: MetadataRoute.Robots не умеет директиву Яндекса Clean-param.
// Clean-param говорит Яндексу, что метки рекламы и рассылок (utm_*, yclid, gclid…) не меняют страницу, — иначе
// ссылки с метками из Telegram/рекламы попадают в индекс отдельными страницами-дублями.
//
// ВНИМАНИЕ: сайт живёт в подпапке (job.rendit.ru/ozon), и этот файл отдаётся как /ozon/robots.txt. Поисковики читают
// robots.txt только из корня домена — поэтому его строки (Clean-param и Sitemap) нужно повторить в /robots.txt корневого
// приложения или отдавать этот файл оттуда через Nginx (см. instructions.md).
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
