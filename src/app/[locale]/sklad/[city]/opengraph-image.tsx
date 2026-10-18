// Картинка превью ссылки на страницу города (Telegram, WhatsApp, VK, поисковики): название города на языке страницы,
// сколько складов в базе и доход в штате. Генерируется на сервере (next/og) и кэшируется.
// Шрифт — Noto Sans (OFL) из src/assets/fonts/og: встроенный шрифт next/og знает только латиницу.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getCity, getCityName, getCityStats } from '@/lib/sklad';
import { BRAND_HEART, SECTION_GRADIENT } from '@/config/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

type Props = { params: Promise<{ locale: string; city: string }> };

const FONT_DIR = join(process.cwd(), 'src/assets/fonts/og');
// подмножества Noto Sans: латиница (+ расширенная для az/uz и знака ₽), кириллица (+ расширенная для kk/ky/tg), грузинский,
// армянский. У каждого подмножества своё имя семейства: из семейства с одним именем satori берёт только один файл на
// начертание, и символов из остальных файлов (₽, армянский, грузинский) на картинке не было. Порядок FONT_FAMILY —
// порядок поиска символа
const FONT_FILES = [
    ['OG Latin', 'noto-sans-latin-700-normal.woff', 700],
    ['OG Latin', 'noto-sans-latin-500-normal.woff', 500],
    ['OG Latin Ext', 'noto-sans-latin-ext-700-normal.woff', 700],
    ['OG Latin Ext', 'noto-sans-latin-ext-500-normal.woff', 500],
    ['OG Cyrillic', 'noto-sans-cyrillic-700-normal.woff', 700],
    ['OG Cyrillic', 'noto-sans-cyrillic-500-normal.woff', 500],
    ['OG Cyrillic Ext', 'noto-sans-cyrillic-ext-700-normal.woff', 700],
    ['OG Cyrillic Ext', 'noto-sans-cyrillic-ext-500-normal.woff', 500],
    ['OG Georgian', 'noto-sans-georgian-georgian-700-normal.woff', 700],
    ['OG Armenian', 'noto-sans-armenian-armenian-700-normal.woff', 700],
] as const;

const FONT_FAMILY = [...new Set(FONT_FILES.map(([family]) => family))].map((family) => `'${family}'`).join(', ');

// await на уровне модуля: шрифты читаются один раз при загрузке файла, до рендера. С Cache Components чтение файла
// во время рендера считается «незакэшированным вводом-выводом», и картинка отдавала 500
const fonts = await Promise.all(
    FONT_FILES.map(async ([name, file, weight]) => ({
        name,
        data: await readFile(join(FONT_DIR, file)),
        weight,
        style: 'normal' as const,
    })),
);

async function load(params: Props['params']) {
    const { locale, city: slug } = await params;
    const city = getCity(slug);
    if (!hasLocale(routing.locales, locale) || !city) notFound();
    const t = await getTranslations({ locale, namespace: 'CityPage' });
    return { locale, city, t };
}

export async function generateImageMetadata({ params }: Props) {
    // при сборке Next вызывает функцию и без города (список городов знает только page.tsx) — тогда без подписи,
    // а 404 для несуществующего города отдаст сама картинка
    const { locale: rawLocale, city: slug } = await params;
    if (!hasLocale(routing.locales, rawLocale) || !getCity(slug)) return [{ id: 'city', size, contentType }];

    const { locale, city, t } = await load(params);
    const name = getCityName(city, locale);
    const place = city.region ? name : t('cityPlace', { city: name });
    return [{ id: 'city', size, contentType, alt: t('og.alt', { place }) }];
}

export default async function Image({ params }: Props) {
    const { locale, city, t } = await load(params);
    // рядом со знаком — бренд проекта («РенДит Работа»), как в шапке сайта
    const tHeader = await getTranslations({ locale, namespace: 'Header' });
    const stats = getCityStats(city);
    const name = getCityName(city, locale);

    const chips = stats
        ? [
              t('og.count', { count: stats.count }),
              ...(stats.max ? [t('og.income', { value: stats.max })] : stats.min ? [t('og.incomeFrom', { value: stats.min })] : []),
          ]
        : [t('og.noData')];

    // длинные названия («Благовещенск (Республика Башкортостан)») — мельче, чтобы уместились в две строки
    const nameSize = name.length > 34 ? 60 : name.length > 20 ? 76 : 96;

    return new ImageResponse(
        <div
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '64px 72px',
                // те же оттенки, что у цветных блоков сайта ($promo-dark → --bg-5 → $promo-light в style.scss)
                background: SECTION_GRADIENT,
                color: '#fff',
                fontFamily: FONT_FAMILY,
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 32, fontWeight: 700 }}>
                {/* знак сайта — сердце, как логотип в шапке */}
                <svg width='48' height='48' viewBox='0 0 100 100' aria-hidden='true'>
                    {BRAND_HEART.map((d) => (
                        <path d={d} fill='#fff' key={d} />
                    ))}
                </svg>
                {tHeader('title')}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                <div style={{ fontSize: 34, fontWeight: 500, opacity: 0.88 }}>{t('og.kicker')}</div>
                <div style={{ fontSize: nameSize, fontWeight: 700, lineHeight: 1.05, maxWidth: 1050 }}>{name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
                    {chips.map((chip) => (
                        <div
                            key={chip}
                            style={{
                                display: 'flex',
                                padding: '10px 24px',
                                borderRadius: 40,
                                background: 'rgba(255, 255, 255, 0.18)',
                                fontSize: 30,
                                fontWeight: 700,
                            }}
                        >
                            {chip}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ fontSize: 28, fontWeight: 500, opacity: 0.9 }}>{t('og.tagline')}</div>
        </div>,
        { ...size, fonts },
    );
}
