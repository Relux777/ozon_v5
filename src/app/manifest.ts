// src/app/manifest.ts
import type {MetadataRoute} from 'next';
import {getTranslations} from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Pick a locale that is representative of the app
  const locale = 'ru';

  const t = await getTranslations({
    namespace: 'ManifestGlobal',
    locale
  });


  return {
    id: '/',
    name: t('SiteName'),
    short_name: t('SiteName'),
    description: t('SiteDescription'),
    lang: locale,
    start_url: '/',
    display: 'standalone',
    // как --bg-phone (светлая тема) и фирменный синий --bg-5
    background_color: '#ededed',
    theme_color: '#005bff',
    // иконки из логотипа (src/assets/svg/logo.svg); maskable — с запасом под круглую/скруглённую маску Android
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };

}
