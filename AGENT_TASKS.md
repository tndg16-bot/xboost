# Xboost エージェントタスク割り当て

作成日: 2026-01-23
PM: Sisyphus (Antigravity代表)

---

## エージェント別タスク一覧

### 🔴 エージェントA（実装担当）

#### タスク1: AIプロフィール関連APIの実装
**優先度**: P1（高）
**目標**: 2026-01-27 までに完了

**実装するAPIエンドポイント**:
1. `POST /api/v1/ai/profile/analyze` - プロフィール分析
2. `POST /api/v1/ai/profile/fixed-post` - 改善案投稿の生成
3. `POST /api/v1/ai/profile/generate` - プロフィール生成

**要件**:
- 各エンドポイントでNextAuthセッション認証を実装
- レート制限（1分あたり10リクエスト）を追加
- エラーハンドリングと適切なHTTPステータスコード
- TypeScript型定義（Request/Response）
- OpenAI APIを使用したAI処理
- ロギングの実装

**出力物**:
- 3つのAPIルートファイル（`xboost/apps/web/app/api/v1/ai/profile/`）
- 型定義ファイル（必要な場合）
- APIドキュメント（Swagger/Markdown）

**参考**:
- `xboost/apps/web/services/ai-pattern-analyzer.ts` - 既存のAI処理ロジック
- `xboost/apps/web/app/api/posts/route.ts` - 認証パターン
- `docs/specifications/issue-104-public-api.md` - API仕様

---

### 🟡 エージェントB（フロントエンド・テスト担当）

#### タスク1: Stripe決済システムのテスト
**優先度**: P1（高）
**目標**: 2026-01-27 までに完了

**テスト項目**:
1. **テストプランの確認**:
   - Starter (¥1,000/月)
   - Pro (¥5,000/月)
   - Team (¥15,000/月)
   - 各プランのPrice IDを確認

2. **Checkoutフローのテスト**:
   - テストカード `4242 4242 4242 4242` での決済
   - 14日トライアルの確認
   - 成功後のリダイレクト
   - エラーケース（資金不足、有効期限切れ）

3. **Webhookのローカルテスト**:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   stripe trigger invoice.payment_succeeded
   stripe trigger invoice.payment_failed
   ```
   - すべてのイベントが正しく処理されること
   - データベースの状態が正しく更新されること

4. **Customer Portalのテスト**:
   - プラン変更（Pro → Team）
   - 解約の実行
   - 支払い方法の変更
   - 解約後のリダイレクト

5. **テスト結果のドキュメント化**:
   - 各テストの結果（成功/失敗）
   - 発見した問題とその解決策
   - スクリーンショット（必要な場合）

**出力物**:
- `docs/testing/stripe-test-results.md` - テスト結果レポート
- `stripe-test-issues.md` - 発見した問題のリスト

**参考**:
- `docs/guides/stripe-implementation.md` - 詳細実装ガイド
- `docs/stripe-setup-guide.md` - 基本設定

---

#### タスク2: UIコンポーネントのリンク確認
**優先度**: P2（中）
**目標**: 2026-01-29 までに完了

**タスク**:
1. 各フィーチャーパッケージの`index.ts`のエクスポートを確認
2. `xboost/apps/web/app`からのインポートが正しく機能するかテスト
3. 欠落しているエクスポートを追加
4. 各ページでコンポーネントが正しくレンダリングされるか確認

**対象パッケージ**:
- `@xboost/ui`
- `@xboost/ai-post-generation`
- `@xboost/ai-profile-creation`
- `@xboost/ai-rewrite`
- `@xboost/analytics`
- `@xboost/automation`
- `@xboost/empathy-post`
- `@xboost/multi-account`
- `@xboost/personal-brand`
- `@xboost/post-editor`
- `@xboost/profile-editing`
- `@xboost/scheduling`

**出力物**:
- 修正された`index.ts`ファイル
- UIコンポーネントの正常動作確認

---

### 🟢 エージェントC（基盤・品質担当）

#### タスク1: TypeScript構文エラーの修正
**優先度**: P0（クリティカル）
**目標**: 2026-01-24 までに完了

**修正対象**:

1. **`xboost/apps/web/app/cta-checker/page.tsx` (189行目)**:
   - 構文エラー `':' expected`
   - 原因: SVGパスの問題
   - 解決策: SVGパスを分割して修正、または適切なフォーマット

2. **`xboost/apps/web/services/ai-pattern-analyzer.ts` (300, 311, 359行目)**:
   - `Declaration or statement expected`
   - 原因: 不適切な構文または閉じ括弧の問題
   - 解決策: 構文を修正

**検証**:
- 修正後に `npm run typecheck` を実行
- TypeScriptエラーが0であること

---

#### タスク2: 不足パッケージの追加
**優先度**: P0（クリティカル）
**目標**: 2026-01-24 までに完了

**追加するパッケージ**:
```bash
cd xboost/apps/web
npm install openai
npm install @stripe/stripe-js stripe
```

**確認**:
- `xboost/apps/web/package.json`に依存が追加されていること
- `npm run typecheck` でインポートエラーが解消されていること

---

#### タスク3: Lintエラーの解消
**優先度**: P0（高）
**目標**: 2026-01-25 までに完了

**修正項目**:

1. **未使用の引数の修正** (6箇所):
   - `xboost/apps/web/app/api/automation/delete-rules/route.ts:8` - `request` → `_request`
   - `xboost/apps/web/app/api/automation/repost-rules/route.ts:8` - `request` → `_request`
   - `xboost/apps/web/app/api/payments/portal/route.ts:9` - `request` → `_request`
   - `xboost/apps/web/app/api/payments/subscription/route.ts:8` - `request` → `_request`
   - `xboost/apps/web/app/api/twitter-accounts/route.ts:10` - `request` → `_request`
   - `xboost/apps/web/app/api/webhooks/stripe/route.ts:5` - `crypto` → `_crypto`

2. **`let` → `const` の変更** (3箇所):
   - `xboost/apps/web/app/api/v1/analytics/route.ts:20` - `startDate`
   - `xboost/apps/web/app/api/v1/analytics/ai-patterns/route.ts:24` - `startDate`
   - `xboost/apps/web/app/api/v1/analytics/winning-patterns/route.ts:24` - `startDate`

3. **`any` 型の置き換え** (10+箇所):
   - `xboost/apps/web/app/api/payments/portal/route.ts:31`
   - `xboost/apps/web/app/api/prices/route.ts:13,14`
   - `xboost/apps/web/app/api/v1/analytics/route.ts:109`
   - `xboost/apps/web/app/api/v1/analytics/ai-patterns/route.ts:`
   - `xboost/apps/web/app/api/webhooks/stripe/route.ts:22,72,93,114,118,133,143,164,173`

4. **React purityエラーの修正**:
   - `xboost/apps/web/app/early-access/page.tsx:20` - `Date.now()` をコンポーネント外に移動、またはuseEffectを使用

5. **未使用コンポーネントの削除**:
   - `xboost/apps/web/app/follower-suggestions/page.tsx:5` - `ProfileForm`

6. **console.logの修正**:
   - `xboost/apps/web/app/inspo/page.tsx:7` - `console.log` → `console.warn` または削除
   - `xboost/apps/web/app/api/webhooks/stripe/route.ts:59,85,110` - `console.log` → `console.warn` または削除

**検証**:
- 修正後に `npm run lint` を実行
- ESLintエラーが0であること
- ESLint警告が10以下であること

---

#### タスク4: 共通ユーティリティの実装
**優先度**: P3（低）
**目標**: 2026-01-31 までに完了

**タスク**:
1. `xboost/packages/utils/` パッケージの作成
2. 共通ユーティリティの抽出と移動:
   - 日時フォーマット（`formatDate`, `formatDateTime`, `getTimeAgo`）
   - 文字列操作（`truncate`, `slugify`, `capitalize`）
   - 検証関数（`isValidEmail`, `isValidUrl`, `isValidXHandle`）
3. 各パッケージから使用できるように設定
4. ドキュメントの作成（`xboost/packages/utils/README.md`）

**出力物**:
- `xboost/packages/utils/` パッケージ
- ユーティリティ関数の実装
- ドキュメント

---

#### タスク5: ドキュメントの更新
**優先度**: P3（低）
**目標**: 2026-01-31 までに完了

**タスク**:
1. 実装とドキュメントの乖離を確認:
   - `docs/specifications/issue-101-multi-account.md`
   - `docs/specifications/issue-104-public-api.md`
2. ドキュメントを最新の実装に合わせて更新
3. 新しい機能のドキュメント作成:
   - 自動化機能（`docs/features/automation.md`）
   - Stripe決済（`docs/features/stripe-payment.md`）
   - AIパターン分析（`docs/features/ai-patterns.md`）

**出力物**:
- 更新された仕様書
- 新しい機能ドキュメント

---

## 進捗報告の形式

各エージェントは、以下の形式で進捗を報告してください：

```
## エージェントX 進捗報告
日時: YYYY-MM-DD HH:MM:SS

### 完了したタスク
- [タスク名] - 完了日時

### 進行中のタスク
- [タスク名] - 現在の進捗（%）

### ブロッカー
- [問題点] - 影響範囲

### 次のステップ
- [次に取り組むタスク]
```

---

## 成功基準

Sprint終了時に以下を達成すること：

### 技術的指標
- [ ] TypeScriptエラー: 0
- [ ] ESLintエラー: 0
- [ ] ESLint警告: < 10
- [ ] `npm run typecheck` 成功
- [ ] `npm run lint` 成功

### 機能的指標
- [ ] Stripe決済のテストフロー完了
- [ ] 欠落APIルートの実装完了（AIプロフィール）
- [ ] UIコンポーネントの正しくレンダリング

### ドキュメント指標
- [ ] WORK_PROGRESS.md 更新
- [ ] Next Sprint Planの準備完了
- [ ] テスト結果のドキュメント化

---

## 連絡事項

### 重要な注意点
1. **ビルドエラー**: TypeScript構文エラーが修正されるまで、他のタスクには着手しないでください（エージェントC優先）
2. **Stripeテスト**: エージェントBはStripe Dashboardのアクセス権限が必要です。必要ならAntigravityに連絡してください
3. **AI API**: エージェントAはOpenAI APIキーが必要です。`.env.local`に設定されていることを確認してください

### 緊急連絡先
- PM: Sisyphus (このドキュメントの更新担当)
- 技術相談: Antigravity（GUI上のAI）

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2026-01-23 | 初版作成 | Sisyphus |
