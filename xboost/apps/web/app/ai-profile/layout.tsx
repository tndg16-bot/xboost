import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: 'AIプロフィール作成',
  description: 'AIによるX（Twitter）プロフィール最適化・作成。あなたの強みを活かした魅力的なプロフィールの提案。',
});

export default function AiProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
