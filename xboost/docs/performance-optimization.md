# Xboost パフォーマンス最適化ガイド

**作成日**: 2026-01-28

---

## 📊 現状分析

### ページパフォーマンス目標

| 指標 | 目標 | 現状 | 差分 |
|--------|------|------|------|
| Lighthouse Performance | 90+ | N/A | N/A |
| Lighthouse Accessibility | 90+ | N/A | N/A |
| 初期表示時間 (LCP) | <2.5s | N/A | N/A |
| 総ブロッキング時間 (TBT) | <200ms | N/A | N/A |

---

## 🚀 最適化施策

### 1. 画像最適化

#### 現状
- Next.js Imageコンポーネントが部分的に使用
- 外部画像ホスト最適化未実施

#### 施策

**a) Imageコンポーネントの完全採用**

```typescript
import Image from 'next/image'

// Before
<img src="/hero.jpg" alt="Hero" width={1200} height={630} />

// After
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={630}
  priority  // Above the fold images
/>
```

**b) 外部画像ホストの許可設定**

```javascript
// next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'pbs.twimg.com',  // Twitter images
    },
    {
      protocol: 'https',
      hostname: 'abs.twimg.com',  // Twitter assets
    },
  ],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

**c) 画像最適化チェックリスト**

- [ ] 全`<img>`タグを`<Image>`に置換
- [ ] LCP画像に`priority`属性を追加
- [ ] 画像フォーマットをWebP/AVIFに変換
- [ ] レスポンシブ画像サイズを実装

---

### 2. フォント最適化

#### 施策

**a) next/fontの使用**

```typescript
// lib/fonts.ts
import { Inter } from 'next/font/google'

export const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})
```

**b) CSS変数の適用**

```css
/* globals.css */
:root {
  --font-inter: 'Inter', system-ui, sans-serif;
}

body {
  font-family: var(--font-inter);
}
```

**c) フォント最適化チェックリスト**

- [ ] Google Fontsをnext/fontからインポート
- [ ] 必要なサブセットのみを読み込み
- [ ] font-display: swapを設定
- [ ] システムフォントフォールバックを設定

---

### 3. コード分割

#### 施策

**a) 動的インポートの実装**

```typescript
// Before
import { HeavyComponent } from './HeavyComponent'

// After
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,  // Client-only components
})
```

**b) ルートごとのコード分割**

Next.js App Routerでは自動的に分割されます。

**c) ライブラリのツリーシェイキング**

```javascript
// next.config.js
experimental: {
  optimizePackageImports: [
    'recharts',
    'lucide-react',
  ],
}
```

---

### 4. CSS最適化

#### 施策

**a) Tailwind CSSのPurge**

Tailwind v4+では自動的にPurgeされます。

**b) 未使用スタイルの削除**

```bash
# 未使用CSSを検出
npx @tailwindcss/unused
```

**c) CSSのインライン化**

クリティカルなCSSをインライン化:

```typescript
// app/layout.tsx
export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCss }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

---

### 5. バンドル分析

#### 施策

**a) Bundle Analyzerの有効化**

```bash
# インストール
npm install @next/bundle-analyzer

# next.config.js
const { withBundleAnalyzer } = require('@next/bundle-analyzer')({
  openAnalyzer: false,
})

module.exports = withBundleAnalyzer(nextConfig)
```

**b) バンドルサイズの目標**

| パッケージ | 目標 | 現状 |
|-----------|------|------|
| React | <100KB | N/A |
| Recharts | <150KB | N/A |
| Total (gzip) | <500KB | N/A |

---

### 6. キャッシュ戦略

#### 施策

**a) ISR (Incremental Static Regeneration)**

```typescript
export const revalidate = 3600  // 1時間ごとに再生成
```

**b) SWR (Stale-While-Revalidate)**

```typescript
import { useSWR } from 'swr'

const { data } = useSWR('/api/posts', fetcher, {
  refreshInterval: 300000,  // 5分ごとに更新
})
```

**c) Vercel Edge Cache**

```typescript
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
```

---

## 📈 パフォーマンス監視

### Vercel Analytics

```bash
# インストール
npm install @vercel/analytics

# app/layout.tsx
import { SpeedInsights } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

### Web Vitals

```typescript
'use client'
import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Analyticsに送信
    console.log(metric)
  })

  return null
}
```

---

## ✅ 実施チェックリスト

### 即時実施（優先度高）

- [ ] next.config.jsの最適化設定を追加
- [ ] lib/fonts.tsを作成・適用
- [ ] lib/security.tsのTypeScriptエラー修正
- [ ] 画像最適化設定をnext.config.jsに追加
- [ ] バンドル分析ツールをインストール

### 中期実施（優先度中）

- [ ] すべての`<img>`を`<Image>`に置換
- [ ] 動的インポートを導入
- [ ] 未使用CSS/JSを削除
- [ ] キャッシュ戦略を実装

### 長期実施（優先度低）

- [ ] WebP/AVIF変換を全画像に適用
- [ ] Service Workerを導入
- [ ] Edge Functionsでキャッシュを拡張

---

## 📝 作成したファイル

1. **apps/web/next.config.optimization.ts** - パフォーマンス最適化設定
2. **apps/web/lib/fonts.ts** - フォント最適化設定
3. **apps/web/lib/security.ts** - セキュリティヘッダー・CORS設定

---

**作成者**: Sisyphus
**最終更新**: 2026-01-28
**バージョン**: 1.0
