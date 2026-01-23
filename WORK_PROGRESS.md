# Xboost プロジェクト進捗レポート

最終更新: 2026-01-23

---

## プロジェクト概要

XboostはX（旧Twitter）運用に必要な全作業を一元管理できるSaaSツールです。

**主要機能**:
- 投稿作成（AI支援、下書き、テンプレート）
- 予約投稿（2ヶ月先まで予約可能）
- 分析・検証（1年分のデータ同期、勝ちパターン発見）
- 自動化（バズ投稿の自動再投稿、自動プラグ）
- 複数アカウント管理（ワンクリック切り替え）

---

## プロジェクト構造

```
xboost/
├── apps/
│   └── web/              # Next.js 16 Webアプリケーション
│       ├── app/           # App Router
│       │   ├── api/      # APIルート
│       │   ├── [page]/   # ページ
│       │   └── ...
│       ├── lib/           # ユーティリティライブラリ
│       ├── services/      # ビジネスロジック
│       └── prisma/       # Prismaスキーマ
├── packages/
│   ├── ui/              # 共通UIコンポーネント（@xboost/ui）
│   │   ├── components/   # コンポーネント
│   │   ├── tokens/       # デザイントークン
│   │   └── utils/       # ユーティリティ
│   └── features/        # フィーチャーパッケージ（モジュラーアーキテクチャ）
│       ├── ai-post-generation/    # AI投稿生成
│       ├── ai-profile-creation/   # AIプロフィール作成
│       ├── ai-rewrite/           # AIリライト
│       ├── analytics/            # 分析ダッシュボード
│       ├── automation/           # 自動化機能
│       ├── empathy-post/         # 共感投稿作成
│       ├── empathy-posts/        # 共感投稿（複数）
│       ├── follower-based-suggestions/ # フォロワー推奨
│       ├── multi-account/        # 複数アカウント管理
│       ├── personal-brand/        # パーソナルブランド
│       ├── post-editor/          # 投稿エディタ
│       ├── profile-correction/    # プロフィール修正
│       ├── profile-editing/      # プロフィール編集
│       ├── scheduling/           # 予約投稿
│       ├── syntax-reference/      # 構文リファレンス
│       ├── topic-proposal/       # トピック提案
│       └── viral-self-retweet/   # バズ再投稿
└── docs/              # ドキュメント
    ├── guides/          # ガイドライン
    ├── specifications/   # 技術仕様書
    └── ...
```

---

## 現在の実装状況

### ✅ 実装済み

#### バックエンド
- **認証システム**: NextAuth 4.x + Prisma Adapter
- **データベース**: PostgreSQL + Prisma 7.x
  - User, TwitterAccount, Post, ScheduledPostモデル
  - Subscription, Invoiceモデル（Stripe統合）
  - AutoRepostRule, AutoDeleteRule, AutoPlugRuleモデル
- **Stripe決済システム**:
  - Checkout Session作成 API (`/api/payments/checkout`)
  - Customer Portal API (`/api/payments/portal`)
  - サブスクリプション取得 API (`/api/payments/subscription`)
  - Webhookハンドラ (`/api/webhooks/stripe`)
  - 3つのプラン（Starter ¥1,000, Pro ¥5,000, Team ¥15,000）

#### フロントエンド
- **ページ一覧**:
  - 認証ページ（signin, step2, loading, error）
  - ダッシュボード（analytics, automation, empathy, scheduling）
  - ツールページ（ai-profile, ai-rewrite, cta-checker, early-access）
  - 設定ページ（multi-account, personal-brand, profile）

#### APIルート
- **認証**: `/api/auth/[...nextauth]`
- **Twitterアカウント**: `/api/twitter-accounts/*`
- **投稿**: `/api/posts/*`, `/api/v1/posts/*`
- **分析**: `/api/v1/analytics/*`, `/api/v1/analytics/ai-patterns/*`
- **自動化**: `/api/automation/*`
- **決済**: `/api/payments/*`, `/api/prices`
- **Webhooks**: `/api/webhooks/stripe`

---

### ⚠️ 課題・未解決の問題

#### 1. TypeScript / Lint エラー

**Type Checkエラー**:
- `.next/types/validator.ts` - Next.jsのビルドキャッシュ問題
- `@xboost/*` パッケージのモジュールが見つからない（TS設定の問題）
- `@prisma/client` のインポートエラー

**Lintエラー**:
- 未使用の引数（`request`）が複数のファイルで残っている
- `any` 型の使用が一部で検出
- `const` 推奨警告（`let startDate` の件）

#### 2. Workspaces設定の問題

`package.json`のworkspacesパスが正しくない可能性があります：
```json
"workspaces": [
  "xboost/apps/*",
  "xboost/packages/*",
  "xboost/packages/features/*"
]
```

正しいパスは：
```json
"workspaces": [
  "apps/*",
  "packages/*",
  "packages/features/*"
]
```

#### 3. 未実装の機能

- **UIコンポーネント**: 多数のページが`@xboost/ui`や各フィーチャーパッケージからコンポーネントをインポートしようとしているが、リンクが正しくない
- **APIエンドポイント**: 一部のAPIルート（`/api/v1/ai/profile/*`）が実装されていない
- **ページコンテンツ**: 多くのページが空の状態

---

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 16.1.4 (App Router)
- **UI**: React 19.2.3, Tailwind CSS 4
- **認証**: NextAuth 4.24.13
- **グラフ**: Recharts 3.7.0
- **決済**: Stripe.js 8.6.4

### バックエンド
- **データベース**: PostgreSQL
- **ORM**: Prisma 7.3.0
- **認証**: NextAuth Prisma Adapter
- **決済**: Stripe Node.js 20.2.0

### 開発ツール
- **言語**: TypeScript 5
- **Linting**: ESLint 9
- **フォーマット**: Prettier 3.8.1
- **Monorepo**: npm workspaces

---

## データベーススキーマ概要

### 主要モデル

| モデル | 説明 | 関連 |
|--------|------|------|
| `User` | ユーザー情報 | Account, Session, TwitterAccount, Subscription |
| `TwitterAccount` | Xアカウント情報 | User, Post, ScheduledPost |
| `Post` | 投稿データ | User, TwitterAccount |
| `ScheduledPost` | 予約投稿 | User, TwitterAccount |
| `Subscription` | サブスクリプション（Stripe） | User |
| `AutoRepostRule` | 自動再投稿ルール | User |
| `AutoDeleteRule` | 自動削除ルール | User |
| `AutoPlugRule` | 自動プラグルール | User, PlugTemplate |
| `PlugTemplate` | プラグテンプレート | User |
| `Invoice` | 請求書 | - |

### 主要なEnum

- `TwitterAccountRole`: MAIN, SUB, NICHE
- `PostStatus`: DRAFT, SCHEDULED, PUBLISHED, FAILED, DELETED
- `PostFormat`: SINGLE, THREAD, QUOTE, REPLY, POLL
- `ContentType`: EDUCATIONAL, ENTERTAINMENT, PROMOTIONAL, PERSONAL, NEWS, OPINION, OTHER
- `PlanType`: STARTER, PRO, TEAM
- `SubscriptionStatus`: ACTIVE, PAST_DUE, CANCELED, UNPAID, TRIALING, INCOMPLETE, INCOMPLETE_EXPIRED

---

## Stripe決済実装状況

### ✅ 実装済み
- Checkout Session作成（14日トライアル付き）
- Customer Portal（サブスクリプション管理）
- サブスクリプション状態の同期
- Webhookイベントハンドリング
- プラン制限の管理（accountsLimit, automationEnabled）

### 📚 ドキュメント
- `docs/stripe-setup-guide.md` - 基本的な設定手順
- `docs/guides/stripe-implementation.md` - 詳細な実装ガイド（新規作成）

### ⚠️ 注意点
- 本番環境に移行する際は、Stripe DashboardでLive modeに切り替える必要があります
- Webhook署名の検証は実装済みですが、正しい`STRIPE_WEBHOOK_SECRET`を設定する必要があります

---

## 依存関係の状況

### apps/webの主要依存
```json
{
  "@auth/prisma-adapter": "^2.11.1",
  "@prisma/client": "^7.3.0",
  "next": "16.1.4",
  "next-auth": "^4.24.13",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "recharts": "^3.7.0",
  "@stripe/stripe-js": "^8.6.4",
  "stripe": "^20.2.0"
}
```

### 不足している依存
- `openai` - `ai-pattern-analyzer.ts`で使用されているが、`package.json`に含まれていない

---

## 次のステップ

### 高優先度
1. **Workspaces設定の修正**: `package.json`のパスを正しいものに修正
2. **TypeScriptエラーの解消**:
   - Prisma Clientの生成と正しいインポート
   - `@xboost/*` パッケージの正しいエクスポート設定
   - `openai`パッケージの追加
3. **Lintエラーの解消**:
   - 未使用の引数の削除または `_` プレフィックスの追加
   - `any` 型の置き換え

### 中優先度
4. **APIルートの実装完了**:
   - `/api/v1/ai/profile/*` ルートの実装
   - 落ちているAPIエンドポイントの確認と実装
5. **UIコンポーネントの連携**: 各フィーチャーパッケージから正しくコンポーネントをインポートできるように設定

### 低優先度
6. **ドキュメントの更新**: 実装とドキュメントの整合性確認
7. **共通ユーティリティの実装**: `packages/utils/`パッケージの作成

---

## GitHubリポジトリ

- **URL**: https://github.com/tndg16-bot/xboost
- **ブランチ戦略**: Git Flowベース
  - `main`: 本番用
  - `develop`/`phaseX-*`: 開発用
  - `feature/*`: 機能追加用
  - `fix/*`: バグ修正用

---

## 現在のアクティブブランチ

- `feature/11-stripe-payment-automation`: Stripe決済自動化の実装

---

## 最終更新日

2026-01-23 15:57 (JST)
