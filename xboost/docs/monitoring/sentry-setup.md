# Xboost Sentry設定ガイド

## 概要

Sentryは本番環境でのエラー追跡・パフォーマンスモニタリングを行うプラットフォームです。

---

## 手順

### 1. Sentryプロジェクト作成

1. https://sentry.io にアクセス
2. アカウント作成またはログイン
3. 「Create Project」をクリック
4. 以下を設定:
   - **Platform**: Next.js
   - **Name**: xboost-production
   - **Language**: TypeScript

### 2. SDKのインストール

```bash
cd xboost/apps/web
npm install @sentry/nextjs
```

### 3. Sentry初期化

```bash
# Sentryウィザードを実行
npx @sentry/wizard -i nextjs
```

ウィザードで以下を設定:
- **Dsn**: SentryプロジェクトのDSN（自動検出）
- **Performance**: 有効化
- **Session Replay**: オプションで有効化

### 4. `.sentryclirc`作成

プロジェクトルートに以下の内容で作成:

```ini
[auth]
token=your-sentry-auth-token

[defaults]
org=your-org-name
project=xboost-production
```

### 5. Next.js設定更新

`next.config.js`にSentry設定を追加:

```javascript
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // ...既存の設定
}

module.exports = withSentryConfig(nextConfig)
```

### 6. 環境変数追加

Vercelに以下を追加:
- `SENTRY_AUTH_TOKEN` - Sentry Auth Token
- `SENTRY_DSN` - プロジェクトDSN
- `SENTRY_ENVIRONMENT` - production

### 7. エラー追跡の有効化

`sentry.client.config.js`と`sentry.server.config.js`は自動的に生成されます。

---

## 確認

デプロイ後、Sentry Dashboardで以下を確認:
- エラーがキャプチャされている
- パフォーマンスデータが収集されている
- パンくずが記録されている

---

**リソース**:
- [Sentry Next.js Docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
