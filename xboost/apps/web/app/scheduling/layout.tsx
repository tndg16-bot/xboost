import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: '予約投稿',
  description: 'X（Twitter）の投稿を予約管理。2ヶ月先までの投稿スケジュール、編集・キャンセル機能。',
});

export default function SchedulingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
