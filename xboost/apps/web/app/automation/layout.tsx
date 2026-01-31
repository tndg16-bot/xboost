import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: '自動化',
  description: 'X（Twitter）運用を自動化。バズ投稿の自動再投稿、古い投稿の自動削除、自動プラグ機能。',
});

export default function AutomationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
