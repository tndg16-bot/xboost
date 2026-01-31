import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.xboost.now';

  // 公開ページ
  const publicPages = [
    '',
    '/pricing',
    '/about',
    '/contact',
  ];

  // 認証が必要なページ（検索結果には表示しないが、クロールは許可）
  const appPages = [
    '/analytics',
    '/automation',
    '/scheduling',
    '/post-editor',
    '/ai-profile',
    '/ai-rewrite',
    '/multi-account',
    '/personal-brand',
    '/profile',
    '/settings',
    '/syntax-reference',
  ];

  const now = new Date();

  return [
    // 公開ページ
    ...publicPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.8,
    })),

    // アプリページ
    ...appPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
  ];
}
