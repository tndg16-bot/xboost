# Phase 1 プロジェクト基盤構築 - 詳細実装計画

## 概要

Phase 1 (MVP開発・先行アクセス) の詳細な実装計画

## 手順

### 手順1: Next.js プロジェクト初期化 ✓ (完了)

```bash
# プロジェクトルートに移動
cd xboost

# Next.js アプリケーションを作成
npx create-next-app@latest apps/next --typescript --tailwind --app --no-src-dir --import-alias "@/*" --use-npm
```

**現在の状態**: プロジェクトは既に初期化済み (apps/web)

### 手順2: 環境変数の設定 ✓ (完了)

`.env.local` を作成

```bash
cat > apps/next/.env.local << ENVFILE
DATABASE_URL=postgresql://user:password@localhost:5432/xboost
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
ENVFILE
```

**現在の状態**: 環境変数の例ファイルが存在 (apps/web/.env.example)

### 手順3: 開発サーバーの起動 ✓ (完了)

```bash
cd apps/next
npm install
npm run dev
```

**現在の状態**: 開発サーバーは既に設定済み

## 次のステップ (Phase 1)

### 1. NextAuth.js の設定 ✓ (完了)
- [x] Twitterプロバイダー設定
- [x] セッション管理
- [x] 認証ページ実装
- [x] サインアウト機能

**現在の状態**: NextAuth.js は既に実装済み

### 2. データベースのセットアップ
- [ ] Prismaスキーマ定義
- [ ] マイグレーション設定
- [ ] データベース接続設定
- [ ] モデル定義 (User, Post, Schedule, Analytics)

### 3. API ルートの作成
- [ ] 投稿作成 API
- [ ] 予約投稿 API
- [ ] アナリティクス取得 API
- [ ] プロフィール更新 API

### 4. UI コンポーネントの作成
- [x] 投稿作成画面
- [x] 予約投稿画面
- [x] アナリティクス画面
- [x] チュートリアル画面
- [x] プロフィール編集画面

## 既に実装済みの機能

### コンポーネント
- Navigation (レスポンシブ対応 ✓)
- PostEditor ✓
- Scheduling (カレンダー/リスト表示) ✓
- Analytics ✓
- Tutorial ✓
- ProfileEditor ✓
- Automation ✓
- MultiAccount ✓

### ページ
- ホームページ (/)
- 認証ページ (/auth/signin)
- 投稿作成 (/post-editor)
- 予約投稿 (/scheduling)
- アナリティクス (/analytics)
- 戦略室 (/strategy-room)
- 自動化 (/automation)
- 複数アカウント (/multi-account)
- ネタ (/inspo)
- プロフィール (/profile)
- チュートリアル (/tutorial)

### パッケージ (features)
- ai-profile-creation ✓
- ai-rewrite ✓
- analytics ✓
- automation ✓
- empathy-post ✓
- empathy-posts ✓
- follower-based-suggestions ✓
- multi-account ✓
- personal-brand ✓
- post-editor ✓
- profile-correction ✓
- profile-editing ✓
- scheduling ✓
- strong-account-strategy ✓
- topic-proposal ✓
- viral-self-retweet ✓

## 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js v5
- **UI Components**: Lucide React Icons

### バックエンド
- **API Routes**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL (予定)
- **Authentication**: NextAuth.js with Twitter Provider

## 開発環境のセットアップ

### 前提条件
- Node.js 18+ 
- npm (または yarn, pnpm)
- Git
- PostgreSQL (ローカルまたはクラウド)

### 環境変数

```bash
# コピー
cp apps/web/.env.example apps/web/.env.local

# 必要な環境変数を編集
DATABASE_URL=postgresql://...
AUTH_TWITTER_ID=...
AUTH_TWITTER_SECRET=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

### 開発サーバーの起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# http://localhost:3000 でアクセス
```

## プロジェクト構造

```
xboost/
├── apps/
│   └── web/                 # Next.jsアプリケーション
│       ├── app/             # App Router
│       ├── components/      # Reactコンポーネント
│       ├── lib/            # ユーティリティ
│       └── public/         # 静的ファイル
├── packages/
│   ├── features/          # 機能パッケージ
│   ├── ui/               # 共通UIコンポーネント
│   └── mcp-server/       # MCPサーバー
├── docs/                # ドキュメント
└── .github/             # GitHub設定
    └── workflows/         # CI/CD
```

## Phase 1 の完了基準

- [ ] ユーザー認証が機能する (Twitter OAuth)
- [ ] 投稿作成・予約ができる
- [ ] アナリティクスが表示できる
- [ ] モバイル対応が完了している
- [ ] チュートリアルが実装されている
- [ ] 開発ドキュメントが整備されている

## 次のフェーズへの移行

Phase 1 完了後、Phase 2 (正式ローンチ・有料プラン開始) に移行

### Phase 2 での予定
- Stripe決済システムの実装
- 有料プランの公開
- 自動削除機能
- 自動リポスト機能
- 出戻しポスト機能

## 関連リンク

- [Issue #1] Phase 1 MVP開発・先行アクセス
- [Issue #3] X API OAuth認証実装
- [Issue #4] 投稿作成機能
- [Issue #5] 予約投稿機能
- [Issue #7] 基本分析機能
- [Issue #8] ユーザー管理・認証基盤
