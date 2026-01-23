# Stripeプラン設定ガイド

XboostでStripeサブスクリプションを使用するための設定手順です。

---

## 1. Stripeアカウントの作成

まだStripeアカウントを持っていない場合：
1. [Stripe Dashboard](https://dashboard.stripe.com/register) にアクセス
2. アカウントを作成（テストモードで開始可能）

---

## 2. プランの作成

Stripe Dashboardで以下の3つのプランを作成します：

### Starterプラン（¥1,000/月）
- **Product**: 作成 → Products
- **Name**: Xboost Starter
- **Description**: 1アカウント、基本機能
- **Price**: ¥1,000 / month / recurring
- **Price ID**: `price_xboost_starter_monthly`

**制限**:
- 複数アカウント: 1
- 自動化機能: 無効

### Proプラン（¥5,000/月）
- **Product**: 作成 → Products
- **Name**: Xboost Pro
- **Description**: 5アカウント、自動化有効
- **Price**: ¥5,000 / month / recurring
- **Price ID**: `price_xboost_pro_monthly`

**制限**:
- 複数アカウント: 5
- 自動化機能: 有効

### Teamプラン（¥15,000/月）
- **Product**: 作成 → Products
- **Name**: Xboost Team
- **Description**: 無制限アカウント、チーム機能
- **Price**: ¥15,000 / month / recurring
- **Price ID**: `price_xboost_team_monthly`

**制限**:
- 複数アカウント: 999（実質無制限）
- 自動化機能: 有効
- チームコラボレーション: 有効

---

## 3. Webhookの設定

1. **WebhookエンドポイントURL**:
   - 本番: `https://yourdomain.com/api/webhooks/stripe`
   - 開発: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe` コマンドで確認

2. **Stripe DashboardでWebhookを追加**:
   - Developers → Webhooks → Add endpoint
   - エンドポイントURLを入力
   - 以下のイベントを選択:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Webhook Secretを取得**:
   - Webhook詳細ページから `Signing Secret` をコピー
   - `.env` の `STRIPE_WEBHOOK_SECRET` に設定

---

## 4. APIキーの取得

1. **Secretキー**（サーバー側）:
   - Developers → API keys
   - Secret key（`sk_test_...` または `sk_live_...`）をコピー
   - `.env` の `STRIPE_SECRET_KEY` に設定

2. **Publishableキー**（クライアント側）:
   - 同じページで Publishable key（`pk_test_...` または `pk_live_...`）をコピー
   - `.env` の `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` に設定

---

## 5. 環境変数の設定

`.env` ファイルに以下を追加（`.env.example` にあります）：

```bash
# Stripe Payment
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. マイグレーションの実行

Prismaスキーマを更新した後、マイグレーションを実行します：

```bash
cd xboost/apps/web
npx prisma migrate dev --name add-stripe-subscription
```

---

## 7. テスト

### ローカルテスト
1. Stripe CLIでテストイベントを送信：
   ```bash
   stripe login
   stripe trigger checkout.session.completed
   ```

2. テストカード情報：
   - 成功: `4242 4242 4242 4242`
   - 不十分な資金: `4000 0025 0000 3155`

### Webhookのローカル転送
```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

---

## 8. 本番環境への移行

### ステップ
1. テスト環境で完全に動作確認
2. Stripe Dashboardで「Live mode」に切り替え
3. 本番用のAPIキーを `.env.production` に設定
4. 本番用のWebhookエンドポイントを設定
5. 本番環境でマイグレーション実行
6. デプロイ後、本番Webhookをテスト

---

## トラブルシューティング

### マイグレーションエラー
```
Error: The datasource.url property is required
```
**解決策**: Prisma 7の新しい構文に従い、`prisma.config.ts` を使用するか、環境変数DATABASE_URLを設定

### Webhook署名エラー
```
Webhook signature verification failed
```
**解決策**:
- `STRIPE_WEBHOOK_SECRET` が正しいか確認
- 本番/テストモードのシークレットが一致しているか確認

### Webhookイベントが処理されない
**解決策**:
- Stripe DashboardのWebhookイベントログを確認
- サーバーログでエラーを確認
- Metadataに`userId`が含まれているか確認

---

## プラン価格IDの対応

コード内で`mapPriceIdToPlanType`関数を使用して、Price IDからプランタイプを判定しています：

```typescript
function mapPriceIdToPlanType(priceId: string): 'STARTER' | 'PRO' | 'TEAM' {
  if (priceId.includes('starter')) return 'STARTER';
  if (priceId.includes('team')) return 'TEAM';
  return 'PRO'; // デフォルト
}
```

**重要**: Stripeで作成したプランのPrice IDには以下の文字列を含めるようにしてください：
- Starter: `starter`
- Pro: `pro`
- Team: `team`

---

## 追加リソース

- [Stripe Checkoutドキュメント](https://stripe.com/docs/api/checkout/sessions)
- [Stripe Webhookドキュメント](https://stripe.com/docs/webhooks)
- [Billing Portalドキュメント](https://stripe.com/docs/billing/subscriptions/integrate-customer-portal)
- [Prisma Stripe統合ガイド](https://www.prisma.io/docs/guides/stripe)
