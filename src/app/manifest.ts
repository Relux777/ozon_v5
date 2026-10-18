// src/app/manifest.ts
import type {MetadataRoute} from 'next';
import {getTranslations} from 'next-intl/server';
import { SECTION_COLOR, SITE_CONFIG } from '@/config/site';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Pick a locale that is representative of the app
  const locale = 'ru';

  const t = await getTranslations({
    namespace: 'ManifestGlobal',
    locale
  });


  // приложение в подпапке домена: все адреса манифеста — с ней ('/ozon'), иначе «установленный» сайт открыл бы корень домена
  const base = SITE_CONFIG.basePath;

  return {
    id: base || '/',
    name: t('SiteName'),
    short_name: t('SiteName'),
    description: t('SiteDescription'),
    lang: locale,
    start_url: base || '/',
    scope: `${base}/`,
    display: 'standalone',
    // как --bg-phone (светлая тема) и цвет раздела --bg-5
    background_color: '#ededed',
    theme_color: SECTION_COLOR,
    // иконки из логотипа-сердца; maskable — с запасом под круглую/скруглённую маску Android
    icons: [
      { src: `${base}/icons/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: `${base}/icons/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: `${base}/icons/icon-maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

}
