import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inkerrobotics.com';

type ChangeFreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

const routes: { url: string; priority: number; freq: ChangeFreq }[] = [
  { url: '/', priority: 1.0, freq: 'weekly' },
  { url: '/robotics', priority: 0.9, freq: 'monthly' },
  { url: '/ai-solutions', priority: 0.9, freq: 'monthly' },
  { url: '/roboparks', priority: 0.9, freq: 'monthly' },
  { url: '/edutech', priority: 0.9, freq: 'weekly' },
  { url: '/about', priority: 0.7, freq: 'monthly' },
  { url: '/careers', priority: 0.7, freq: 'weekly' },
  { url: '/contact', priority: 0.6, freq: 'yearly' }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE_URL}${r.url}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority
  }));
}
