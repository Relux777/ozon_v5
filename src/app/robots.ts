import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';

const BASE_URL = SITE_CONFIG.url;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}