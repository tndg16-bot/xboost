# Stripe決済実装詳細ガイド

XboostプロジェクトにおけるStripe決済システムの実装手順と技術仕様について説明します。

## 概要

XboostはStripeを使用して月額サブスクリプションを実装しています。以下の3つのプランを提供しています：
- **Starter**: ¥1,000/月（1アカウント、自動化無効）
- **Pro**: ¥5,000/月（5アカウント、自動化有効）
- **Team**: ¥15,000/月（999アカウント、チーム機能有効）

---

## アーキテクチャ

### コンポーネント構成

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
├─────────────────────────────────────────────────────────────┤
│  • Pricing Page (/pricing)                                │
│  • Checkout Success Page (/checkout/success)                │
│  • Subscription Management UI                              │
│  • Stripe Client (@stripe/stripe-js)                       │
└─────────────────────────────────────────────────────────────┘
                           ↓ (HTTP)
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Next.js API Routes)             │
├─────────────────────────────────────────────────────────────┤
│  • /api/payments/checkout     (Checkout Session作成)     │
│  • /api/payments/portal      (Customer Portal)            │
│  • /api/payments/subscription (サブスクリプション取得)    │
│  • /api/prices              (プラン価格情報)              │
│  • /api/webhooks/stripe     (Stripe Webhook)             │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Stripe API)
┌─────────────────────────────────────────────────────────────┐
│                     Stripe                               │
├─────────────────────────────────────────────────────────────┤
│  • Products (Xboost Starter, Pro, Team)                  │
│  • Prices (価格設定)                                     │
│  • Subscriptions                                         │
│  • Invoices                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ (Webhook)
┌─────────────────────────────────────────────────────────────┐
│                  Database (Prisma/PostgreSQL)             │
├─────────────────────────────────────────────────────────────┤
│  • User (stripeCustomerId)                                │
│  • Subscription (Stripeデータ + 拡張)                    │
│  • Invoice                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## データベーススキーマ

### Prismaモデル

#### Userモデル（関連部分）
```prisma
model User {
  id              String  @id @default(cuid())
  stripeCustomerId String? @unique
  subscription     Subscription?

  // 他のフィールド...
}

@@index([stripeCustomerId])
```

#### Subscriptionモデル
```prisma
enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  UNPAID
  TRIALING
  INCOMPLETE
  INCOMPLETE_EXPIRED
}

enum PlanType {
  STARTER
  PRO
  TEAM
}

model Subscription {
  id                    String             @id @default(cuid())
  userId                String             @unique
  user                  User               @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Stripe fields
  stripeSubscriptionId   String             @unique
  stripeCustomerId       String
  stripePriceId        String

  // Plan & status
  planType              PlanType
  status                SubscriptionStatus

  // Billing periods
  currentPeriodStart     DateTime
  currentPeriodEnd       DateTime
  cancelAtPeriodEnd     Boolean            @default(false)
  canceledAt            DateTime?

  // Feature limits
  accountsLimit          Int                @default(1)
  automationEnabled      Boolean            @default(false)

  createdAt             DateTime           @default(now())
  updatedAt             DateTime           @updatedAt

  @@index([stripeSubscriptionId])
  @@index([stripeCustomerId])
  @@index([userId])
}
```

#### Invoiceモデル
```prisma
model Invoice {
  id              String    @id @default(cuid())
  stripeInvoiceId String    @unique
  userId          String
  amount          Int
  currency        String
  status          String
  hostedUrl       String?
  pdfUrl          String?

  createdAt       DateTime  @default(now())

  @@index([stripeInvoiceId])
  @@index([userId])
}
```

---

## APIルート詳細

### 1. Checkout Session作成

**Endpoint**: `POST /api/payments/checkout`

**リクエスト**:
```json
{
  "priceId": "price_starter_monthly_..."
}
```

**レスポンス**:
```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

**実装** (`app/api/payments/checkout/route.ts`):
```typescript
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { priceId } = await request.json();

  // 既存のStripe Customerを取得、または新規作成
  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  // Checkout Sessionを作成
  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: {
      metadata: { userId: user.id },
      trial_period_days: 14,  // 14日間のトライアル
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
```

---

### 2. Customer Portal

**Endpoint**: `POST /api/payments/portal`

**機能**: サブスクリプションの更新、支払い方法の変更、解約などを管理

**実装** (`app/api/payments/portal/route.ts`):
```typescript
export async function POST(_request: Request) {
  const session = await auth();

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/subscription`,
  });

  return NextResponse.json({ url: portalSession.url });
}
```

---

### 3. サブスクリプション取得

**Endpoint**: `GET /api/payments/subscription`

**レスポンス**:
```json
{
  "subscription": {
    "id": "cl_xxx",
    "planType": "PRO",
    "status": "ACTIVE",
    "currentPeriodStart": "2026-01-01T00:00:00Z",
    "currentPeriodEnd": "2026-02-01T00:00:00Z",
    "cancelAtPeriodEnd": false,
    "accountsLimit": 5,
    "automationEnabled": true
  }
}
```

---

### 4. Webhook

**Endpoint**: `POST /api/webhooks/stripe`

**処理するイベント**:
- `checkout.session.completed` - Checkout完了
- `customer.subscription.created` - サブスクリプション作成
- `customer.subscription.updated` - サブスクリプション更新
- `customer.subscription.deleted` - サブスクリプション削除
- `invoice.payment_succeeded` - 支払い成功
- `invoice.payment_failed` - 支払い失敗

**実装の要点**:
```typescript
// Webhook署名の検証
event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
);

// イベントタイプごとの処理
switch (event.type) {
  case 'customer.subscription.updated':
    await handleSubscriptionUpdated(event.data.object);
    break;
  // 他のイベント...
}

// サブスクリプション更新ハンドラ
async function handleSubscriptionUpdated(subscription: any) {
  const planType = mapPriceIdToPlanType(
    subscription.items.data[0].price.id
  );

  await db.subscription.update({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      status: subscription.status.toUpperCase(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      planType,
    },
  });
}
```

---

## プランと価格のマッピング

### Price IDからPlan Typeへの変換

```typescript
function mapPriceIdToPlanType(priceId: string): 'STARTER' | 'PRO' | 'TEAM' {
  if (priceId.includes('starter')) return 'STARTER';
  if (priceId.includes('team')) return 'TEAM';
  return 'PRO'; // デフォルト
}
```

### プランの機能制限

| プラン | accountsLimit | automationEnabled | チーム機能 |
|--------|---------------|------------------|------------|
| STARTER | 1 | false | false |
| PRO | 5 | true | false |
| TEAM | 999 | true | true |

```typescript
function getPlanLimits(planType: 'STARTER' | 'PRO' | 'TEAM') {
  switch (planType) {
    case 'STARTER':
      return { accountsLimit: 1, automationEnabled: false };
    case 'PRO':
      return { accountsLimit: 5, automationEnabled: true };
    case 'TEAM':
      return { accountsLimit: 999, automationEnabled: true };
  }
}
```

---

## 環境変数

`.env.local` に以下の環境変数を設定してください：

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# アプリケーションURL（リダイレクト用）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 本番環境用の環境変数
`.env.production` に本番用のキーを設定してください。

---

## Stripe設定手順

### 1. プランの作成（Stripe Dashboard）

#### Starterプラン
1. **Products** → **Create product**
   - Name: `Xboost Starter`
   - Description: `1アカウント、基本機能`

2. **Price**:
   - Amount: `1000`
   - Currency: `JPY`
   - Interval: `Month`
   - **重要**: Price IDに`starter`を含める（例: `price_starter_monthly_xxx`）

#### Proプラン
1. **Products** → **Create product**
   - Name: `Xboost Pro`
   - Description: `5アカウント、自動化有効`

2. **Price**:
   - Amount: `5000`
   - Currency: `JPY`
   - Interval: `Month`
   - **重要**: Price IDに`pro`を含める

#### Teamプラン
1. **Products** → **Create product**
   - Name: `Xboost Team`
   - Description: `無制限アカウント、チーム機能`

2. **Price**:
   - Amount: `15000`
   - Currency: `JPY`
   - Interval: `Month`
   - **重要**: Price IDに`team`を含める

---

### 2. Webhookの設定

1. **Developers** → **Webhooks** → **Add endpoint**

2. **Endpoint URL**:
   - 開発: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe` で確認
   - 本番: `https://yourdomain.com/api/webhooks/stripe`

3. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. **Signing Secret**をコピーし、`STRIPE_WEBHOOK_SECRET`に設定

---

## テスト

### ローカルでのテスト

1. **Stripe CLIでWebhookをフォワード**:
```bash
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

2. **テストイベントをトリガー**:
```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

### テストカード情報
| 目的 | カード番号 | CVV | 有効期限 |
|------|------------|------|----------|
| 成功 | `4242 4242 4242 4242` | 任意 | 任意の未来日付 |
| 不十分な資金 | `4000 0025 0000 3155` | 任意 | 任意の未来日付 |
| 有効期限切れ | `4000 0000 0000 0069` | 任意 | 過去の日付 |

---

## トラブルシューティング

### Webhook署名エラー

**エラー**: `Webhook signature verification failed`

**解決策**:
1. `STRIPE_WEBHOOK_SECRET` が正しいか確認
2. 本番/テストモードのシークレットが一致しているか確認
3. リクエストボディが改変されていないか確認

### サブスクリプションが作成されない

**エラー**: `Subscription already processed, skipping`

**原因**:
- 同じWebhookイベントが重複して送信されている
- 既存のサブスクリプションがある

**解決策**:
- Webhookハンドラで `findUnique` を使用して重複チェックを実装
- `checkout.session.completed` で初期チェックを実行

### プランタイプが正しく認識されない

**原因**: Price IDに `starter`、`pro`、`team` が含まれていない

**解決策**:
- Stripe DashboardでPrice IDを確認
- 必要に応じてPrice IDの命名規則を変更
- `mapPriceIdToPlanType` 関数を更新

---

## 本番環境への移行

### ステップ

1. **テスト環境で完全に動作確認**
   - ユーザー登録から解約までのフローを確認
   - エッジケース（支払い失敗、解約、プラン変更）をテスト

2. **Stripe Dashboardで「Live mode」に切り替え**

3. **本番用のAPIキーを設定**:
   ```bash
   # .env.production
   STRIPE_SECRET_KEY=sk_live_your_live_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
   STRIPE_WEBHOOK_SECRET=whsec_your_live_webhook_secret
   NEXT_PUBLIC_APP_URL=https://xboost.now
   ```

4. **本番用Webhookエンドポイントを設定**

5. **データベースマイグレーションを実行**:
   ```bash
   cd xboost/apps/web
   npx prisma migrate deploy
   ```

6. **デプロイ後、本番Webhookをテスト**:
   ```bash
   stripe trigger --stripe-account=acct_xxx checkout.session.completed
   ```

---

## セキュリティ考慮事項

1. **Webhook署名の検証**: 必ず実装してください
2. **ユーザー認証**: すべてのAPIルートで認証を確認
3. **metadataの使用**: `userId` などの重要な情報はmetadataに保存
4. **環境変数の保護**: シークレットキーをコードに含めない

---

## 関連リソース

- [Stripe Checkoutドキュメント](https://stripe.com/docs/api/checkout/sessions)
- [Stripe Webhookドキュメント](https://stripe.com/docs/webhooks)
- [Billing Portalドキュメント](https://stripe.com/docs/billing/subscriptions/integrate-customer-portal)
- [Prisma Stripe統合ガイド](https://www.prisma.io/docs/guides/stripe)
- [Stripe CLIドキュメント](https://stripe.com/docs/stripe-cli)

---

## 今後の機能拡張

- 年次プランの提供
- クーポンコードのサポート
- 請求書のPDF生成
- 複数の支払い方法
- 自動再試行ロジックのカスタマイズ
