# 開発環境セットアップガイド

## 前提条件

- Node.js 20+
- Docker Desktop (PostgreSQL用)
- npm

## 手順

### 1. Docker Desktopを起動

PostgreSQLデータベース用にDocker Desktopを起動してください。

### 2. データベースを起動

```bash
cd xboost
docker compose up -d
```

または `docker-compose` を使う場合:

```bash
docker-compose up -d
```

### 3. 環境変数の設定

`.env.local` が既に作成されています。以下の値を確認してください:

```bash
DATABASE_URL=postgresql://xboost:xboost_password@localhost:5432/xboost
NEXTAUTH_SECRET=xboost_secret_key_change_in_production_min_32_chars
NEXTAUTH_URL=http://localhost:3000
```

### 4. データベースマイグレーション

```bash
cd xboost/apps/web
npx prisma migrate dev --name init
```

### 5. 依存パッケージのインストール

ルートディレクトリで実行:

```bash
npm install
```

### 6. 開発サーバーの起動

```bash
npm run dev
```

またはルートから:

```bash
npm run dev --workspace=@xboost/web
```

### 7. アプリケーションにアクセス

ブラウザで `http://localhost:3000` を開いてください。

## 補足

### Twitter/X OAuth設定

Twitter Developer Portal (https://developer.twitter.com/en/portal/dashboard) でアプリケーションを作成し、以下の環境変数を `.env.local` に設定してください:

```bash
AUTH_TWITTER_ID=your-twitter-client-id
AUTH_TWITTER_SECRET=your-twitter-client-secret
```

### トラブルシューティング

#### Dockerが見つからない場合
- Docker Desktopが起動しているか確認してください
- Windowsの場合、WSL2が有効になっているか確認してください

#### データベース接続エラー
- PostgreSQLコンテナが実行中か確認: `docker ps`
- 接続情報が正しいか確認: `DATABASE_URL`

#### マイグレーションエラー
- データベースが起動しているか確認
- Prisma Clientが生成されているか確認: `npx prisma generate`
