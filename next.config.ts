// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'node:path';

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,

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
