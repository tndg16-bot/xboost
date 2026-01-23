# 開発環境セットアップガイド

## 前提条件

- Node.js 20+
- Docker Desktop (PostgreSQL用)
- npm

## 0. Docker Desktopのインストール（まだの場合）

### Windowsの場合

1. **Docker Desktop for Windowsをダウンロード**
   - 公式サイト: https://www.docker.com/products/docker-desktop/
   - 「Windows用Docker Desktop」をダウンロード

2. **インストール**
   - ダウンロードしたインストーラー（`Docker Desktop Installer.exe`）をダブルクリック
   - 画面の指示に従ってインストール
   - 「Use WSL 2 instead of Hyper-V」にチェックを入れる（推奨）

3. **WSL 2の有効化（まだの場合）**
   ```powershell
   # PowerShellを管理者として実行
   dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
   dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
   ```

4. **再起動**

5. **Docker Desktopの設定**
   - Docker Desktopを起動
   - 設定画面が開いたら、「Accept」をクリック
   - 必要に応じて再起動

6. **インストール確認**
   ```bash
   docker --version
   docker compose version
   ```

### macOSの場合

1. **Docker Desktop for Macをダウンロード**
   - 公式サイト: https://www.docker.com/products/docker-desktop/
   - Intel用またはApple Silicon用を選択してダウンロード

2. **インストール**
   - ダウンロードした`.dmg`ファイルを開く
   - DockerアイコンをApplicationsフォルダにドラッグ

3. **Docker Desktopを起動**
   - ApplicationsフォルダからDockerを開く

4. **インストール確認**
   ```bash
   docker --version
   docker compose version
   ```

### Linuxの場合

1. **Docker Engineをインストール**

   Ubuntuの場合:
   ```bash
   # 古いバージョンを削除
   sudo apt-get remove docker docker-engine docker.io containerd runc

   # リポジトリを設定
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
   sudo chmod a+r /etc/apt/keyrings/docker.gpg
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   # Docker Engineをインストール
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
   ```

2. **Dockerサービスを起動**
   ```bash
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

3. **ユーザー権限を追加（オプション）**
   ```bash
   sudo usermod -aG docker $USER
   ```
   （ログアウトして再ログインが必要）

4. **インストール確認**
   ```bash
   docker --version
   docker compose version
   ```

### トラブルシューティング

#### Docker Desktopが起動しない場合
- **Windows**: WSL 2が有効になっているか確認
  ```powershell
  wsl --list --verbose
  ```
- **macOS**: システム設定で「セキュリティとプライバシー」でDockerを許可

#### 「docker: command not found」エラー
- インストールが完了しているか確認
- Docker Desktopが起動しているか確認
- 再起動を試す

#### メモリ不足エラー
- Docker Desktopの設定でリソース割り当てを調整
- Settings → Resources → Memory を増やす（推奨: 4GB以上）

## 手順

### 1. Docker Desktopを起動

PostgreSQLデータベース用にDocker Desktopを起動してください。

### 2. データベースを起動

```bash
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
cd apps/web
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
