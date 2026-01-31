import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.xboost.now'),
  title: {
    default: 'Xboost - X運用を一元管理するSaaSツール',
    template: '%s | Xboost',
  },
  description: 'X（旧Twitter）運用に必要な全作業を一元管理できるSaaSツール。AI支援による投稿作成、予約投稿、分析・検証、自動化、複数アカウント管理。14日間無料トライアル実施中。',
  keywords: ['X運用', 'Twitter管理', '予約投稿', 'SNS運用', 'ソーシャルメディア管理', '自動化', 'AI支援', 'フォロワー増加', 'マーケティングツール', 'Xboost'],
  authors: [{ name: 'Xboost Team' }],
  creator: 'Xboost',
  publisher: 'Xboost',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.xboost.now',
    siteName: 'Xboost',
    title: 'Xboost - X運用を一元管理するSaaSツール',
    description: 'X（旧Twitter）運用に必要な全作業を一元管理。AI支援、予約投稿、分析、自動化、複数アカウント管理。',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Xboost - X運用管理ツール',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xboost - X運用を一元管理するSaaSツール',
    description: 'X（旧Twitter）運用に必要な全作業を一元管理。AI支援、予約投稿、分析、自動化、複数アカウント管理。',
    images: ['/og-image.png'],
    creator: '@xboost_now',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.xboost.now',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  );
}
