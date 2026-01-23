# エージェントへのタスク指示一覧

作成日: 2026-01-23 17:15
PM: Sisyphus

---

## 🔴 エージェントCへの指示

---

### タスクC-1: TypeScript構文エラー修正（cta-checker）

**優先度**: 🔴 P0（クリティカル）
**目標**: 2026-01-23 19:00 までに完了
**推定時間**: 30分

**指示**:
```
エージェントCさん、以下のタスクを開始してください。

【タスク】
ファイル: xboost/apps/web/app/cta-checker/page.tsx
行番号: 189
エラー: ':' expected.

【原因】
SVGパスの構文エラーです。現在のSVGが壊れています。

【解決策】
正しいSVGアイコンに置き換えてください：
1. Line 189付近の<svg>タグを確認
2. 壊れたSVGパスを以下の正しいパスに置き換え：

```tsx
<svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
  {checkResult.hasCTA ? (
    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
  ) : (
    <path fillRule="evenodd" d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" clipRule="evenodd" />
  )}
</svg>
```

【検証】
修正後、以下のコマンドでエラーがないことを確認してください：
```bash
cd xboost/apps/web
npm run typecheck
```

【進捗報告】
完了したら、以下のフォーマットで報告してください：
```
## 進捗報告
エージェント: C
タスクID: C-1
アクション: 完了
詳細: cta-checker/page.tsxのSVGパスを修正しました。npm run typecheck成功。
```

【参考】
詳細なガイド: docs/guides/typescript-error-fix.md
```

---

### タスクC-2: TypeScript構文エラー修正（ai-pattern-analyzer）

**優先度**: 🔴 P0（クリティカル）
**目標**: 2026-01-23 20:00 までに完了
**推定時間**: 1時間

**指示**:
```
エージェントCさん、タスクC-1完了後、このタスクを開始してください。

【タスク】
ファイル: xboost/apps/web/services/ai-pattern-analyzer.ts
行番号: 300, 311, 359, 196, 248, 262, 272, 302-306, 315, 323, 327, 334, 339

【原因】
複数のTypeScriptエラーがあります：
1. openaiパッケージが見つからない（Line 196）
2. OpenAI APIの型エラー（Line 248）
3. 変数宣言エラー（Lines 302-306, 315, 323, 327, 334, 339）
4. 構文エラー（Lines 300, 311, 359）

【解決策】

ステップ1: openaiパッケージのインストール
```bash
cd xboost/apps/web
npm install openai
```

ステップ2: 変数宣言の追加
関数の先頭で以下の変数を宣言してください：
```typescript
const allPatterns: Pattern[] = [];
const allTopics: string[] = [];
const allFormats: PostFormat[] = [];
let totalConfidence = 0;
```

ステップ3: OpenAI APIの型エラー修正
Line 248付近のコードを確認し、適切な型ガードを追加してください。

ステップ4: 構文エラーの修正
Lines 300, 311, 359の周辺を確認し、括弧の閉じ忘れなどを修正してください。

【検証】
修正後、以下のコマンドでエラーがないことを確認してください：
```bash
npm run typecheck
```

【進捗報告】
完了したら、以下のフォーマットで報告してください：
```
## 進捗報告
エージェント: C
タスクID: C-2
アクション: 完了
詳細: ai-pattern-analyzer.tsのすべてのTypeScriptエラーを修正しました。npm run typecheck成功。
```

【参考】
詳細なガイド: docs/guides/typescript-error-fix.md
```

---

### タスクC-3: openaiパッケージの追加

**優先度**: 🔴 P0（クリティカル）
**目標**: タスクC-2と同時に完了
**推定時間**: 5分

**指示**:
```
エージェントCさん、タスクC-2の一部として実施してください。

【タスク】
openaiパッケージのインストール

【手順】
```bash
cd xboost/apps/web
npm install openai
```

【検証】
xboost/apps/web/package.jsonに以下が追加されていることを確認：
```json
"dependencies": {
  "openai": "^4.x.x"
}
```

【進捗報告】
タスクC-2の一部として報告してください。
```

---

### タスクC-4: Lintエラーの解消

**優先度**: 🔴 P0（高）
**目標**: 2026-01-23 22:00 までに完了
**推定時間**: 2時間

**指示**:
```
エージェントCさん、タスクC-2完了後、このタスクを開始してください。

【タスク】
以下のLintエラーをすべて解消してください：

1. 未使用の引数の修正 (6箇所):
   - xboost/apps/web/app/api/automation/delete-rules/route.ts:8 - `request` → `_request`
   - xboost/apps/web/app/api/automation/repost-rules/route.ts:8 - `request` → `_request`
   - xboost/apps/web/app/api/payments/portal/route.ts:9 - `request` → `_request`
   - xboost/apps/web/app/api/payments/subscription/route.ts:8 - `request` → `_request`
   - xboost/apps/web/app/api/twitter-accounts/route.ts:10 - `request` → `_request`
   - xboost/apps/web/app/api/webhooks/stripe/route.ts:5 - `crypto` → `_crypto`

2. let → const の変更 (3箇所):
   - xboost/apps/web/app/api/v1/analytics/route.ts:20 - `startDate`
   - xboost/apps/web/app/api/v1/analytics/ai-patterns/route.ts:24 - `startDate`
   - xboost/apps/web/app/api/v1/analytics/winning-patterns/route.ts:24 - `startDate`

3. any型の置き換え (10+箇所):
   - 各ファイルで適切な型を定義してください

4. React purityエラーの修正:
   - xboost/apps/web/app/early-access/page.tsx:20

5. 未使用コンポーネントの削除:
   - xboost/apps/web/app/follower-suggestions/page.tsx:5 - `ProfileForm`

6. console.logの修正:
   - console.log → console.warn または削除

【検証】
修正後、以下のコマンドでエラーがないことを確認してください：
```bash
cd xboost/apps/web
npm run lint
```

目標:
- ESLintエラー: 0
- ESLint警告: < 10

【進捗報告】
完了したら、以下のフォーマットで報告してください：
```
## 進捗報告
エージェント: C
タスクID: C-4
アクション: 完了
詳細: すべてのLintエラーを解消しました。npm run lint成功。
- ESLintエラー: 0
- ESLint警告: X
```
```

---

### タスクC-5 & C-6: P3タスク（未着手）

**指示**: タスクC-1〜C-4完了後に開始してください。詳細は AGENT_TASKS.md を参照してください。

---

## 🟡 エージェントAへの指示

---

### タスクA-1: AIプロフィール関連APIの実装

**優先度**: 🟡 P1（高）
**目標**: 2026-01-24 18:00 までに完了
**推定時間**: 4時間

**注意**: エージェントCによるTypeScriptエラー修正完了後に開始してください。

**指示**:
```
エージェントAさん、以下のタスクを開始してください。

【タスク】
3つのAPIエンドポイントを実装してください：

1. POST /api/v1/ai/profile/analyze - プロフィール分析
2. POST /api/v1/ai/profile/fixed-post - 改善案投稿の生成
3. POST /api/v1/ai/profile/generate - プロフィール生成

【要件】
- NextAuthセッション認証を実装
- レート制限（1分あたり10リクエスト）
- エラーハンドリングと適切なHTTPステータスコード
- TypeScript型定義（Request/Response）
- OpenAI APIを使用したAI処理
- ロギングの実装

【出力物】
- xboost/apps/web/app/api/v1/ai/profile/analyze/route.ts
- xboost/apps/web/app/api/v1/ai/profile/fixed-post/route.ts
- xboost/apps/web/app/api/v1/ai/profile/generate/route.ts

【検証】
npm run typecheck でエラーがないこと

【進捗報告】
開始時、完了時、またはブロッカー発生時に以下のフォーマットで報告してください：
```
## 進捗報告
エージェント: A
タスクID: A-1
アクション: [開始/完了/ブロッカー発生]
詳細: [詳細情報]
```

【参考】
- xboost/apps/web/services/ai-pattern-analyzer.ts - 既存のAI処理ロジック
- xboost/apps/web/app/api/posts/route.ts - 認証パターン
- docs/specifications/issue-104-public-api.md - API仕様
```

---

## 🟡 エージェントBへの指示

---

### タスクB-1: Stripe決済システムのテスト

**優先度**: 🟡 P1（高）
**目標**: 2026-01-24 18:00 までに完了
**推定時間**: 3時間

**注意**: エージェントCによるTypeScriptエラー修正完了後に開始してください。

**指示**:
```
エージェントBさん、以下のタスクを開始してください。

【タスク】
Stripe決済システムのテストを実施してください。

【テスト項目】

1. テストプランの確認:
   - Starter (¥1,000/月)
   - Pro (¥5,000/月)
   - Team (¥15,000/月)

2. Checkoutフローのテスト:
   - テストカード 4242 4242 4242 4242 で決済
   - 14日トライアルの確認
   - 成功後のリダイレクト
   - エラーケース（資金不足、有効期限切れ）

3. Webhookのローカルテスト:
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   stripe trigger checkout.session.completed
   stripe trigger customer.subscription.updated
   stripe trigger invoice.payment_succeeded
   stripe trigger invoice.payment_failed
   ```

4. Customer Portalのテスト:
   - プラン変更（Pro → Team）
   - 解約の実行
   - 支払い方法の変更
   - 解約後のリダイレクト

5. テスト結果のドキュメント化:
   - 各テストの結果（成功/失敗）
   - 発見した問題とその解決策

【出力物】
- docs/testing/stripe-test-results.md

【進捗報告】
開始時、完了時、またはブロッカー発生時に以下のフォーマットで報告してください：
```
## 進捗報告
エージェント: B
タスクID: B-1
アクション: [開始/完了/ブロッカー発生]
詳細: [詳細情報]
```

【参考】
- docs/guides/stripe-implementation.md - 詳細実装ガイド
- docs/stripe-setup-guide.md - 基本設定
```

---

### タスクB-2: UIコンポーネントのリンク確認

**優先度**: 🟢 P2（中）
**目標**: 2026-01-25 18:00 までに完了
**推定時間**: 2時間

**指示**:
```
エージェントBさん、タスクB-1完了後、このタスクを開始してください。

【タスク】
各フィーチャーパッケージのUIコンポーネントのリンクを確認してください。

【対象パッケージ】
- @xboost/ui
- @xboost/ai-post-generation
- @xboost/ai-profile-creation
- @xboost/ai-rewrite
- @xboost/analytics
- @xboost/automation
- @xboost/empathy-post
- @xboost/multi-account
- @xboost/personal-brand
- @xboost/post-editor
- @xboost/profile-editing
- @xboost/scheduling

【手順】
1. 各パッケージのindex.tsのエクスポートを確認
2. xboost/apps/web/appからのインポートが正しく機能するかテスト
3. 欠落しているエクスポートを追加
4. 各ページでコンポーネントが正しくレンダリングされるか確認

【進捗報告】
完了したら、以下のフォーマットで報告してください：
```
## 進捗報告
エージェント: B
タスクID: B-2
アクション: 完了
詳細: UIコンポーネントのリンク確認完了。X個のエクスポートを追加しました。
```
```

---

## 📝 共通の指示（全エージェント）

### 進捗報告について

**報告タイミング**:
- タスク開始時
- タスク完了時
- ブロッカー発生時
- 重要な進捗更新時（1時間ごとの更新推奨）

**報告フォーマット**:
```
## 進捗報告
エージェント: [A/B/C]
タスクID: [タスクID]
アクション: [開始/完了/ブロッカー発生]
詳細: [詳細情報]
```

**テンプレート**: templates/PROGRESS_REPORT_TEMPLATE.md を参照してください

### 重要な注意事項

1. **エージェントC（基盤・品質担当）**
   - TypeScript構文エラーの修正が最優先
   - これが完了しないと、他のエージェントは作業できない
   - 1時間ごとに進捗報告をしてください

2. **エージェントA・B**
   - エージェントCの作業完了を待ってから開始
   - 開始前に「エージェントCのタスク完了を確認」と報告してください

3. **ブロッカー発生時**
   - 即座にPM（Sisyphus）に報告してください
   - 詳細なエラーメッセージを含めてください

### PMへの連絡

以下のトピックについては、即座にPMに通知してください：

1. **ブロッカー発生**
2. **重大なエラー**
3. **タスク完了**
4. **予定の大幅な遅延**

---

**作成日**: 2026-01-23 17:15
**PM**: Sisyphus
**有効期限**: 2026-02-07（Sprint 1終了時）
