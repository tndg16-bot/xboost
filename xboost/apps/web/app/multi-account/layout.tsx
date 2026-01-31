import { Metadata } from 'next';
import { generateMetadata } from '@/lib/seo';

export const metadata: Metadata = generateMetadata({
  title: '複数アカウント管理',
  description: 'X（Twitter）の複数アカウントを一元管理。ワンクリック切り替え、アカウント役割の設定（本アカ/サブ/特化）。',
});

export default function MultiAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
