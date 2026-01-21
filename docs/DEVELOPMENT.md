# GitHub開発手順書

Xboostプロジェクトの開発ワークフローとガイドラインです。

## 1. ブランチ戦略

本プロジェクトでは **Git Flow** をベースにしたフローを採用します。

### 主要ブランチ
- `main`: 本番環境（Production）用。常にデプロイ可能な状態を維持。
- `develop`: 開発環境（Development）用。次期リリースのための統合ブランチ。（必要に応じて作成）
- `phaseX-xxx`: フェーズごとの開発用ブランチ（例: `phase1-mvp-dev`）

### 作業ブランチ
機能追加やバグ修正は、適切な親ブランチから新しいブランチを作成して行います。

- **機能追加**: `feature/issue番号-機能名`
  - 例: `feature/96-post-editor`
- **バグ修正**: `fix/issue番号-バグ概要`
  - 例: `fix/101-login-error`
- **ドキュメント**: `docs/issue番号-ドキュメント名`
  - 例: `docs/107-github-flow`

## 2. 開発フロー

1. **Issueを作成/選択する**
   - 着手前にIssueを作成し、要件を定義します。
   - Issue番号（例: `#107`）を確認します。

2. **ブランチを作成する**
   - 現在の開発フェーズのブランチ（例: `phase1-mvp-dev`）から分岐します。
   ```bash
   git checkout phase1-mvp-dev
   git pull origin phase1-mvp-dev
   git checkout -b feature/107-dev-docs
   ```

3. **コミットする**
   - こまめにコミットします。
   - **コミットメッセージ規約**: `Prefix: 内容 (#Issue番号)`
     - `feat`: 新機能 (例: `feat: 投稿画面のUI実装 (#96)`)
     - `fix`: バグ修正
     - `docs`: ドキュメントのみ
     - `style`: コードの意味に影響しない変更（空白、フォーマットなど）
     - `refactor`: リファクタリング
     - `test`: テスト追加・修正
     - `chore`: ビルドプロセスやツールの変更

4. **Push & Pull Request (PR)**
   - GitHubへプッシュし、PRを作成します。
   - **PRタイトル**: Issueタイトルと同じ、または分かりやすい要約
   - **PR本文**: 変更内容、確認方法、関連Issue（`Close #107`など）を記載
   - **Review**: レビューを依頼し、承認を得ます。

5. **マージ**
   - `Squash and merge` を基本とします（履歴をきれいにするため）。

## 3. GitHub Issue管理

- **Title**: `[Category] 概要` （例: `[Feature] 投稿作成ツール`）
- **Body**:
  - 概要
  - 要件（チェックリスト）
  - 優先度
- **Labels**: `bug`, `enhancement`, `documentation`, `high priority` 等を活用

## 4. 環境構築 (Setup)

### リポジトリのクローン
```bash
git clone https://github.com/tndg16-bot/xboost.git
cd xboost
```

### 依存関係のインストール
（TBD: プロジェクト構成決定後に記載）

---
**Happy Coding! 🚀**
