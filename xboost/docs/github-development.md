# GitHub開発手順書

Xboostリポジトリでの開発・実装の手順

## 基本設定

### 事前準備
- [x] Gitのインストール確認
- [x] GitHubアカウントの準備
- [x] エディタの準備（VS Code推奨）

## 手順1: リポジトリのクローン

```bash
git clone https://github.com/tndg16-bot/xboost.git
cd xboost
```

## 手順2: ブランチの作成

```bash
# 新しいブランチを作成（機能単位で）
git checkout -b phase1-mvp-dev
git checkout -b phase2-launch
git checkout -b phase3-features
git checkout -b phase4-scale

# 既存のブランチを確認
git branch -a
```

## 手順3: コードの作成・編集

### VS Codeで開く
```bash
code .
```

### ファイル作成例
```
xboost/
├── apps/
│   ├── next/              # Next.jsアプリ
├── packages/
│   ├── ui/               # 共通UIコンポーネント
│   ├── api/              # APIサーバー
│   └── shared/           # 共通ライブラリ
├── docs/                 # ドキュメント
└── .github/             # GitHub設定
    └── workflows/         # CI/CD
```

## 手順4: コミット

### ステージング
```bash
# 全変更をステージング
git add .

# 特定のファイルのみ
git add apps/next/app/page.tsx
```

### コミット
```bash
git commit -m "feat: Phase 1 投稿作成機能実装"
```

### コミットメッセージ規約
```
type(scope): subject

type:
- feat: 新機能
- fix: バグ修正
- docs: ドキュメント
- style: コードスタイル（機能変更なし）
- refactor: リファクタリング
- test: テスト
- chore: その他

scope: 影響範囲（省略可）

例:
- feat(auth): OAuth認証実装
- fix(analytics): インプレッション表示のバグ修正
- docs: 開発手順書の作成
```

## 手順5: プッシュ

```bash
# 現在のブランチをプッシュ
git push origin phase1-mvp-dev

# 初回のみ、アップストリームの設定
git push -u origin phase1-mvp-dev
```

## 手順6: プルリクエストの作成

### GitHub Web UIから
1. https://github.com/tndg16-bot/xboost を開く
2. "Pull requests" タブをクリック
3. "New pull request" をクリック
4. baseブランチ（例: main）
5. compareブランチ（例: phase1-mvp-dev）
6. タイトルと説明を入力
7. "Create pull request" をクリック

### CLIから
```bash
gh pr create --base main --head phase1-mvp-dev --title "Phase 1 MVP実装" --body "PRの説明"
```

## 手順7: マージ

### GitHub Web UIから
1. PRを開く
2. "Merge pull request" をクリック
3. マージ方法を選択:
   - Merge commit
   - Squash and merge
   - Rebase and merge
4. "Confirm merge" をクリック

### CLIから
```bash
gh pr merge 1
```

## ブランチ保護ルール

### mainブランチの保護設定
1. Settings > Branches
2. "Add rule" をクリック
3. Branch name pattern: `main`
4. 保護ルール:
   - ✅ Require a pull request before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

## コードレビュー

### レビューチェックリスト
- [ ] コードスタイルの準拠
- [ ] TypeScriptエラーなし
- [ ] テストがパス
- [ ] ドキュメントの追加
- [ ] セキュリティ問題なし
- [ ] パフォーマンス問題なし

## 問題解決

### コンフリクトの解決
```bash
# mainに切り替えて最新を取得
git checkout main
git pull origin main

# ブランチに戻してリベース
git checkout phase1-mvp-dev
git rebase main

# コンフリクトを解決後
git add .
git rebase --continue
```

### 変更の取り消し
```bash
# 直前のコミットを取り消し（変更は残す）
git reset --soft HEAD~1

# コミットを完全に取り消す
git reset --hard HEAD~1
```

## ワークフローの概要

```
1. イシューから担当を割り当て
   ↓
2. ブランチを作成
   ↓
3. 開発・実装
   ↓
4. コミット＆プッシュ
   ↓
5. プルリクエスト作成
   ↓
6. コードレビュー
   ↓
7. マージ
   ↓
8. イシューをクローズ
```

## 関連イシュー

- Phase 1: #1 MVP開発・先行アクセス
- Phase 2: #10 正式ローンチ・有料プラン開始
- Phase 3: #19 機能拡充
- Phase 4: #27 無料プラン導入・スケール
