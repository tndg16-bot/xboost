# Xboost Next Sprint Plan

作成日: 2026-01-23
Sprint期間: 2026-01-24 〜 2026-02-07 (2週間)

---

## Sprintゴール

**技術的債務の解消とプロジェクト安定性の確立**

- TypeScript/Lintエラーの完全解消
- Workspaces設定の修正とパッケージ連携の確立
- Stripe決済システムのテスト完了

---

## 優先度別タスク

### 🔴 P0 - クリティカル（今週中に完了）

#### 1. Workspaces設定の修正
**Issue**: #110 - Phase 1 プロジェクト基盤構築
**担当**: エージェントC

**タスク**:
- [ ] ルート`package.json`のworkspacesパスを修正
  ```json
  "workspaces": [
    "apps/*",
    "packages/*",
    "packages/features/*"
  ]
  ```
- [ ] `npm install`で正しくリンクされることを確認
- [ ] 各パッケージから他のパッケージをインポートできることをテスト

**成果物**:
- 修正された`package.json`
- パッケージ間の正しいリンク

---

#### 2. Prisma Clientの修正
**担当**: エージェントC

**タスク**:
- [ ] `apps/web/prisma/schema.prisma`の再生成
  ```bash
  npx prisma generate
  ```
- [ ] `@prisma/client`から`PrismaClient`が正しくエクスポートされているか確認
- [ ] `lib/prisma.ts`のインポートを修正（必要な場合）

**成果物**:
- 正しく動作するPrisma Client
- TypeScriptエラーの解消

---

#### 3. `openai`パッケージの追加
**担当**: エージェントC

**タスク**:
- [ ] `apps/web/package.json`に`openai`依存を追加
  ```bash
  npm install openai
  ```
- [ ] `services/ai-pattern-analyzer.ts`のimportエラー解消

**成果物**:
- 更新された`package.json`
- AI機能の正常動作

---

### 🟡 P1 - 高優先度（来週中に完了）

#### 4. Lintエラーの完全解消
**担当**: エージェントC

**タスク**:
- [ ] 未使用の`request`引数を`_request`に修正
  - `app/api/automation/delete-rules/route.ts` ✅（完了済み）
  - `app/api/automation/repost-rules/route.ts` ✅（完了済み）
  - `app/api/payments/portal/route.ts` ✅（完了済み）
  - `app/api/payments/subscription/route.ts` ✅（完了済み）
  - `app/api/twitter-accounts/route.ts` ✅（完了済み）
- [ ] `let startDate`を`const`に変更（または仕様を維持）
  - `app/api/v1/analytics/route.ts`
  - `app/api/v1/analytics/ai-patterns/route.ts`
  - `app/api/v1/analytics/winning-patterns/route.ts`
- [ ] `any`型を適切な型に置き換え
  - `app/api/payments/portal/route.ts`
  - `app/api/prices/route.ts`
  - `app/api/v1/analytics/ai-patterns/route.ts`
  - `app/api/v1/analytics/route.ts`

**成果物**:
- ESLintエラー0の状態
- より型安全なコード

---

#### 5. 欠落しているAPIルートの実装
**担当**: エージェントA
**関連Issue**: #105 - MCP対応、#104 - Public API

**タスク**:
- [ ] `/api/v1/ai/profile/analyze` の実装
- [ ] `/api/v1/ai/profile/fixed-post` の実装
- [ ] `/api/v1/ai/profile/generate` の実装
- [ ] 各ルートの認証・レート制限を実装
- [ ] 各ルートのテストケース作成

**成果物**:
- 3つのAPIルート
- APIドキュメントの更新

---

### 🟢 P2 - 中優先度（2週間以内に完了）

#### 6. Stripe決済システムのテスト完了
**担当**: エージェントB
**関連Issue**: #11 - Stripe決済自動化

**タスク**:
- [ ] Stripe Dashboardでテストプランの作成確認
  - Starter (¥1,000/月)
  - Pro (¥5,000/月)
  - Team (¥15,000/月)
- [ ] テストカードでのCheckoutフローの実行
- [ ] Webhookのローカルテスト
  ```bash
  stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
  ```
- [ ] Customer Portalの動作確認
  - プラン変更
  - 解約
- [ ] 本番環境への移行計画の策定

**成果物**:
- 完了したテストケース
- Stripe実装ガイドの更新（必要に応じて）

---

#### 7. UIコンポーネントのリンク確認
**担当**: エージェントB

**タスク**:
- [ ] 各フィーチャーパッケージの`index.ts`のエクスポート確認
- [ ] `apps/web/app`からのインポートが正しく機能するかテスト
- [ ] 欠落しているエクスポートを追加
- [ ] 各ページでコンポーネントが正しくレンダリングされるか確認

**成果物**:
- 正しく設定されたパッケージ
- 動作するUI

---

### 🔵 P3 - 低優先度（次のSprintへ）

#### 8. 共通ユーティリティの実装
**担当**: エージェントC

**タスク**:
- [ ] `packages/utils/`パッケージの作成
- [ ] 共通ユーティリティの抽出と移動
  - 日時フォーマット
  - 文字列操作
  - 検証関数
- [ ] 各パッケージから使用できるように設定
- [ ] ドキュメントの作成

**成果物**:
- 新しい`@xboost/utils`パッケージ
- 重複コードの削減

---

#### 9. ドキュメントの更新
**担当**: エージェントC

**タスク**:
- [ ] 実装とドキュメントの乖離を確認
  - `docs/specifications/issue-101-multi-account.md`
  - `docs/specifications/issue-104-public-api.md`
- [ ] ドキュメントを最新の実装に合わせて更新
- [ ] 新しい機能のドキュメント作成
  - 自動化機能
  - Stripe決済

**成果物**:
- 更新された仕様書
- 新しい機能ドキュメント

---

## エージェント別割り当て

| エージェント | 担当タスク | 優先度 |
|-----------|-----------|---------|
| **エージェントA** | 欠落APIルートの実装 (#5) | P1 |
| **エージェントB** | Stripe決済テスト (#6) | P2 |
| **エージェントB** | UIコンポーネントリンク確認 (#7) | P2 |
| **エージェントC** | Workspaces修正 (#1) | P0 |
| **エージェントC** | Prisma修正 (#2) | P0 |
| **エージェントC** | openai追加 (#3) | P0 |
| **エージェントC** | Lintエラー解消 (#4) | P1 |
| **エージェントC** | 共通ユーティリティ (#8) | P3 |
| **エージェントC** | ドキュメント更新 (#9) | P3 |

---

## 進捗追跡

| ID | タスク | 担当 | 状態 |
|----|-------|------|------|
| 1 | Workspaces修正 | C | 🔄 未着手 |
| 2 | Prisma修正 | C | 🔄 未着手 |
| 3 | openai追加 | C | 🔄 未着手 |
| 4 | Lint解消 | C | 🔄 未着手 |
| 5 | API実装 | A | 🔄 未着手 |
| 6 | Stripeテスト | B | 🔄 未着手 |
| 7 | UIリンク確認 | B | 🔄 未着手 |
| 8 | 共通ユーティリティ | C | 🔄 未着手 |
| 9 | ドキュメント更新 | C | 🔄 未着手 |

---

## 成功基準

Sprintの終了時に以下を達成：

### 技術的指標
- [ ] TypeScriptエラー: 0
- [ ] ESLintエラー: 0
- [ ] ESLint警告: < 10
- [ ] `npm run typecheck` 成功
- [ ] `npm run lint` 成功

### 機能的指標
- [ ] Stripe決済のテストフロー完了
- [ ] 欠落APIルートの実装完了
- [ ] UIコンポーネントの正しくレンダリング

### ドキュメント指標
- [ ] WORK_PROGRESS.md 更新
- [ ] Next Sprint Planの準備完了

---

## ブロッカー・リスク

### 既知のリスク
1. **Prisma Client生成の問題**: 再生成でエラーが発生する可能性
   - **軽減**: スキーマのバックアップを取得
2. **Workspaces変更の影響**: 既存のビルドキャッシュが無効になる可能性
   - **軽減**: `.next`ディレクトリの削除と再ビルド
3. **Stripeテスト環境**: テストアカウントの設定が必要
   - **軽減**: 事前にStripe Dashboardを確認

---

## 次のSprintへの引き継ぎ

### 次期Sprintの候補タスク
- 本番環境へのデプロイ準備
- MCP（Model Context Protocol）対応 (#105)
- パブリックAPIの実装 (#104)
- 複数アカウント管理の完全実装 (#101)
- トピック提案機能の拡張

---

## 更新履歴

| 日付 | 更新内容 |
|------|---------|
| 2026-01-23 | Sprint Planの作成 |
