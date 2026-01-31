import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: '投稿エディタ',
  description: 'AI支援によるX（Twitter）投稿作成。テンプレート、下書き、ハッシュタグ最適化機能。',
});

export default function PostEditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
