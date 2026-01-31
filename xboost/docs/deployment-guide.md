# Xboost 本番環境デプロイガイド

**作成日**: 2026-01-28
**対象**: Xboostプロジェクト

---

## 📋 目次

1. [事前準備](#事前準備)
2. [Vercelプロジェクト設定](#vercelプロジェクト設定)
3. [本番データベースセットアップ](#本番データベースセットアップ)
4. [環境変数の設定](#環境変数の設定)
5. [マイグレーション実行](#マイグレーション実行)
6. [デプロイ](#デプロイ)
7. [本番環境検証](#本番環境検証)

---

## 事前準備

### 必要なアカウント

- [x] **GitHub**: https://github.com
  - xboostリポジトリへのアクセス権
- [x] **Vercel**: https://vercel.com
  - 無料アカウントを作成
- [x] **PostgreSQLプロバイダー**: いずれかを選択
  - [Supabase](https://supabase.com) (推奨)
  - [Neon](https://neon.tech)
  - [Railway](https://railway.app)
- [x] **Stripe**: https://dashboard.stripe.com
  - テスト/本番アカウント
- [x] **Twitter Developer Portal**: https://developer.twitter.com
  - OAuthアプリケーション
- [x] **OpenAI**: https://platform.openai.com
  - APIキー

### ローカル環境の準備

```bash
# 1. 最新コードを取得
cd xboost
git pull origin main

# 2. 依存関係のインストール
npm install

# 3. ローカルでビルド成功を確認
npm run build
```

---

## Vercelプロジェクト設定

### 方法1: Vercel CLIを使用（推奨）

```bash
# Vercel CLIのインストール
npm i -g vercel

# ログイン
vercel login

# プロジェクトをリンク
cd xboost/apps/web
vercel link

# プロジェクト名を入力
? What's your project's name? xboost
? In which directory is your code located? ./
? Want to link to the existing project? y
```

### 方法2: Vercel Dashboardから

1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「Add New Project」をクリック
3. 「Import Git Repository」を選択
4. xboostリポジトリを選択
5. 以下の設定を確認:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. 「Deploy」をクリック

---

## 本番データベースセットアップ

### 推奨: Supabase

#### 1. Supabaseプロジェクト作成

1. [Supabase](https://supabase.com)にアクセス
2. 「New Project」をクリック
3. 以下を設定:
   - **Name**: `xboost-production`
   - **Database Password**: 強いパスワードを設定（保存！）
   - **Region**: `Northeast Asia (Tokyo)` - 日本ユーザー向けに最適
4. 「Create new project」をクリック
5. プロジェクトが作成されるのを待つ（約2分）

#### 2. 接続情報を取得

1. 作成したプロジェクトを選択
2. 左メニューの「Settings」→「Database」を選択
3. 「Connection String」を探す
4. 「URI」タブの接続文字列をコピー

```
postgresql://postgres.xxxxxxxxxxxx:[YOUR-PASSWORD]@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres
```

#### 3. 接続情報の更新

Vercelの環境変数設定時にこの接続文字列を使用します。

---

### 代替: Neon Serverless PostgreSQL

1. [Neon](https://neon.tech)にアクセス
2. 「Create a project」をクリック
3. プロジェクト名を入力: `xboost-production`
4. リージョンを選択: `Asia Northeast (Tokyo)`
5. 「Create project」をクリック
6. Dashboardで接続文字列をコピー

---

## 環境変数の設定

### Vercel Environment Variablesの追加

1. Vercel Dashboardでプロジェクトを選択
2. 「Settings」→「Environment Variables」を選択
3. 以下の環境変数を追加:

#### 必須変数

| 変数名 | 値 | 環境 |
|---------|-----|--------|
| `DATABASE_URL` | Supabase/Neonの接続文字列 | Production, Preview, Development |
| `NEXTAUTH_SECRET` | ランダムな32文字以上の文字列 | Production, Preview, Development |
| `NEXTAUTH_URL` | 本番ドメイン: `https://your-domain.vercel.app` | Production |
| | | |

#### OAuth & APIキー

| 変数名 | 値 | 取得元 |
|---------|-----|--------|
| `AUTH_TWITTER_ID` | Twitter Client ID | [Twitter Developer Portal](https://developer.twitter.com) |
| `AUTH_TWITTER_SECRET` | Twitter Client Secret | [Twitter Developer Portal](https://developer.twitter.com) |
| `STRIPE_SECRET_KEY` | `sk_live_...` (本番用) | [Stripe Dashboard](https://dashboard.stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Stripe Webhook設定後に取得 |
| `OPENAI_API_KEY` | `sk-...` | [OpenAI Platform](https://platform.openai.com) |

#### デプロイ環境

各環境変数に対して、適切な環境を選択:
- **Production**: 本番環境の値
- **Preview**: プレビュー環境の値（テスト用）
- **Development**: ローカル開発環境の値

---

## マイグレーション実行

### 本番DBでマイグレーション

#### 方法1: Vercel CLIを使用

```bash
# 本番環境のシェルにアクセス
vercel env pull .env.production production

# マイグレーション実行
cd xboost/apps/web
DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-) npx prisma migrate deploy
```

#### 方法2: ローカルから本番DBへ

```bash
# 本番DBの接続文字列を使用
DATABASE_URL="postgresql://postgres:[PASSWORD]@host:5432/postgres" npx prisma migrate deploy
```

#### マイグレーション確認

```bash
# Prisma Studioで確認（オプション）
DATABASE_URL="production-url" npx prisma studio
```

---

## デプロイ

### 自動デプロイ

GitHubと連携済みの場合、`main`ブランチへのプッシュで自動的にデプロイされます。

```bash
# mainブランチに変更をプッシュ
git checkout main
git pull
git add .
git commit -m "Sprint 4: 本番環境デプロイ準備完了"
git push origin main
```

### 手動デプロイ

Vercel Dashboardから:
1. 「Deployments」タブを選択
2. 「Redeploy」ボタンをクリック
3. デプロイ完了を待つ（約2-3分）

---

## 本番環境検証

### 1. 基本機能確認

- [ ] トップページが表示される
- [ ] Twitter認証が動作する
- [ ] ログイン後ダッシュボードが表示される

### 2. APIエンドポイント確認

```bash
# ヘルスチェック
curl https://your-domain.vercel.app/api/health

# 想定されるレスポンス
{"status": "ok"}
```

### 3. 認証フロー確認

- [ ] Twitter OAuth連携が成功する
- [ ] セッションが正しく管理されている
- [ ] ログアウトが動作する

### 4. 主要機能確認

- [ ] 投稿作成が動作する
- [ ] 予約投稿が作成できる
- [ ] アナリティクスが表示される
- [ ] 自動化ルールが保存できる

### 5. Stripe決済テスト

```bash
# テスト環境の場合
# Stripe Dashboardでテストモードを確認
# テストカード: 4242 4242 4242 4242

# 本番環境への切り替え手順
# 1. Stripe Dashboardで「Toggle Live Mode」をクリック
# 2. 本番APIキーを使用するよう環境変数を更新
# 3. 本番Webhookエンドポイントを設定
```

---

## トラブルシューティング

### デプロイが失敗する

**原因**: ビルドエラー

**解決策**:
```bash
# ローカルでビルドを確認
npm run build

# エラーがある場合は修正してから再デプロイ
```

### データベース接続エラー

**症状**: `Error: P1001: Can't reach database server`

**解決策**:
1. Supabaseプロジェクトが「Active」であることを確認
2. 接続文字列が正しいか確認
3. IPホワイトリスト設定を確認（Supabaseでは不要）

### 環境変数が反映されない

**症状**: `process.env.VARIABLE` がundefined

**解決策**:
1. 環境変数が正しい環境（Production）に設定されているか確認
2. 変数名にタイポがないか確認（大文字・小文字）
3. デプロイを再実行して環境変数を反映

### Stripe Webhookが受信されない

**症状**: 決済完了後にDBが更新されない

**解決策**:
1. Webhook URLが正しいか確認:
   ```
   https://your-domain.vercel.app/api/webhooks/stripe
   ```
2. Stripe DashboardでWebhook Secretが正しいか確認
3. Webhook署名検証が有効になっているか確認

---

## パフォーマンス最適化

### Vercel Analyticsの有効化

1. Vercel Dashboardでプロジェクトを選択
2. 「Analytics」タブを選択
3. 「Enable Analytics」をクリック

### Edge Configの使用

頻繁にアクセスされる設定値はEdge Configに保存:
```typescript
// 例: プラン制限
import { unstable_getEdgeConfig } from 'next/server'

const config = unstable_getEdgeConfig('plan-limits')
```

---

## セキュリティ

### 環境変数の保護

- [x] シークレットキーをコードにコミットしない
- [x] `.env.local` を`.gitignore`に追加済み
- [x] 本番キーをGitHub Secretsに保存しない

### レート制限の有効化

```bash
# Vercel Edge Functionsのレート制限
# 現在の設定を確認
vercel inspect
```

### CORS設定

本番環境ではCORSを適切に設定:
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
        ],
      },
    ]
  },
}
```

---

## モニタリング

### Vercelログの確認

1. Vercel Dashboardでプロジェクトを選択
2. 「Logs」タブでリアルタイムログを確認
3. エラー/警告をフィルタリング

### エラートラッキング（オプション）

Sentryを導入する場合:
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

---

## ローンチチェックリスト

### 技術的確認

- [ ] 本番DBのマイグレーションが完了している
- [ ] 環境変数がすべて設定されている
- [ ] デプロイが成功している
- [ ] SSL証明書が有効である
- [ ] ドメインが正しく設定されている

### 機能的確認

- [ ] 認証フローが動作する
- [ ] 主要なAPIエンドポイントが応答する
- [ ] Stripe決済フローが動作する
- [ ] Twitter API連携が動作する

### パフォーマンス確認

- [ ] Lighthouse Performance > 90
- [ ] Lighthouse Accessibility > 90
- [ ] 初期表示速度 < 3秒
- [ ] API応答時間 < 500ms

---

## サポート

デプロイに関する問題がある場合:

- **Vercel Docs**: https://vercel.com/docs
- **Vercel Status**: https://www.vercel-status.com
- **Supabase Docs**: https://supabase.com/docs

---

**作成者**: Sisyphus
**最終更新**: 2026-01-28
**バージョン**: 1.0
