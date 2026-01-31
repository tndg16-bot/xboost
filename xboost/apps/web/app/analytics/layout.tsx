import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'アナリティクス',
  description: 'X（Twitter）の投稿パフォーマンスを分析。1年分のデータ同期、勝ちパターンの発見、最適な投稿時間の特定。',
});

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
