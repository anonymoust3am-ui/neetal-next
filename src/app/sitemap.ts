import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

const routes = [
  { path: '', priority: 1 },
  { path: '/auth', priority: 0.4 },
  { path: '/authors/neetell', priority: 0.5 },
  { path: '/dashboard', priority: 0.8 },
  { path: '/dashboard/colleges', priority: 0.9 },
  { path: '/dashboard/predictor', priority: 0.9 },
  { path: '/dashboard/compare', priority: 0.8 },
  { path: '/dashboard/counselling', priority: 0.8 },
  { path: '/dashboard/choices', priority: 0.7 },
  { path: '/dashboard/resources', priority: 0.7 },
  { path: '/dashboard/cutoffs', priority: 0.7 },
  { path: '/dashboard/fees', priority: 0.7 },
  { path: '/dashboard/seats', priority: 0.7 },
  { path: '/dashboard/courses', priority: 0.6 },
  { path: '/dashboard/guides', priority: 0.6 },
  { path: '/news', priority: 0.7 },
  { path: '/privacy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const homeImages = [
    `${SITE_URL}/logo-outline.png`,
    `${SITE_URL}/logo-nobg.png`,
    `${SITE_URL}/hero-light.png`,
    `${SITE_URL}/hero-dark.png`,
    `${SITE_URL}/og-one.png`,
    `${SITE_URL}/og-two.png`,
  ];

  return routes.map(route => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: 'daily',
    priority: route.priority,
    images: route.path === '' ? homeImages : undefined,
  }));
}
