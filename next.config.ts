// next.config.ts
import path from 'node:path';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Адрес сайта. Приложение живёт в корне отдельного поддомена: ozon.rendit.ru. Из адреса берётся basePath —
// Next сам добавляет его к ссылкам, статике и картинкам; для корневого поддомена basePath пустой.
// Значение вшивается при сборке: поменяли адрес (NEXT_PUBLIC_SITE_URL) — пересобрать.
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ozon.rendit.ru').replace(/\/+$/, '');
const BASE_PATH = new URL(SITE_URL).pathname.replace(/\/+$/, '');

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  basePath: BASE_PATH,
  // Cache Components (стандарт с Next 17): страница пререндерится, пока в ней нет данных «на запрос»; у каждой страницы сайта
  // стоит ensureStatic = 'navigation' — сборка упадёт, если такие данные появятся. Partial Prefetching — ссылка заранее
  // подгружает только общую «оболочку» страницы, а не страницу целиком
  cacheComponents: true,
  partialPrefetching: true,
  // код читает адрес и подпапку отсюда (src/config/site.ts) — один источник для ссылок, canonical и sitemap
  env: {
    NEXT_PUBLIC_SITE_URL: SITE_URL,
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },

  images: {
    // AVIF — тем браузерам, что его понимают (Accept: image/avif), остальным WebP. Качество Next подбирает
    // под WebP сам; на иллюстрациях сайта AVIF легче на 26–36 %, на скриншотах — на 6–11 %. Кодируется
    // дольше (~0,1 с на картинку при первом запросе), дальше отдаётся из кэша .next/cache/images
    formats: ['image/avif', 'image/webp'],
  },

  sassOptions: {
    includePaths: [path.join(process.cwd(), 'src/assets/scss')],
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              // svgo по умолчанию удаляет viewBox, если он совпадает с width/height (иконки Boxicons 24×24) —
              // тогда иконка, выведенная в другом размере (14, 16, 22 px), обрезается, а не масштабируется.
              // prefixIds — как в конфиге SVGR по умолчанию (уникальные id внутри SVG, напр. у card-qr)
              svgoConfig: {
                plugins: [
                  { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
                  'prefixIds',
                ],
              },
            },
          },
        ],
        as: '*.js',
      },
    },
  },

  // у себя на компьютере: localhost:3000 → localhost:3000/ozon (на сервере корень домена отдаёт другое приложение)
  async redirects() {
    return BASE_PATH ? [{ source: '/', destination: BASE_PATH, basePath: false, permanent: false }] : [];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
