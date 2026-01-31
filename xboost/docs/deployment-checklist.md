# 本番デプロイチェックリスト

**プロジェクト**: Xboost  
**対象**: Sprint 4 本番準備・品質保証 (Issue #132)  
**最終更新**: 2026-02-01

---

## ✅ 完了済み（環境変数不要）

### セキュリティ強化 (S4-4)
- [x] セキュリティヘッダーミドルウェア (`lib/security-headers.ts`)
- [x] CORS設定
- [x] Content Security Policy (CSP)
- [x] Error Boundaryコンポーネント
- [x] レート制限（既存機能確認済み）

### モニタリング・ログ設定 (S4-3)
- [x] ヘルスチェックAPI拡張 (`/api/health`)
- [x] Cronジョブ: 予約投稿処理
- [x] Cronジョブ: アナリティクス同期
- [x] Vercel設定 (`vercel.json`)

### パフォーマンス最適化 (S4-5)
- [x] SEOメタデータ最適化 (`layout.tsx`)
- [x] サイトマップ (`sitemap.ts`)
- [x] robots.txt (`robots.ts`)
- [x] パフォーマンス最適化ガイド

### テスト・品質保証
- [x] E2Eテストケース (`e2e/production-readiness.spec.ts`)
- [x] 構文リファレンスページ (#94)
- [x] 画像コピペ機能 (#57)

### データベース
- [x] Couponモデル追加 (Prismaスキーマ)
- [x] マイグレーションファイル準備

---

## ⏳ 環境変数設定待ち

### データベース
- [ ] `DATABASE_URL` - PostgreSQL接続文字列
- [ ] Prismaマイグレーション実行: `npx prisma migrate deploy`

### 認証
- [ ] `AUTH_TWITTER_ID` - Twitter OAuth Client ID
- [ ] `AUTH_TWITTER_SECRET` - Twitter OAuth Client Secret
- [ ] `NEXTAUTH_URL` - NextAuth.js URL
- [ ] `NEXTAUTH_SECRET` - NextAuth.js Secret

### 決済
- [ ] `STRIPE_SECRET_KEY` - Stripe Secret Key
- [ ] `STRIPE_PUBLISHABLE_KEY` - Stripe Publishable Key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe Webhook Secret

### AI機能
- [ ] `OPENAI_API_KEY` - OpenAI API Key

### モニタリング（オプション）
- [ ] `SENTRY_DSN` - Sentry DSN
- [ ] `CRON_SECRET` - Cronジョブ認証用

---

## 🚀 デプロイ手順

### 1. 事前準備
```bash
# 環境変数を設定
vercel env add DATABASE_URL
vercel env add AUTH_TWITTER_ID
vercel env add AUTH_TWITTER_SECRET
vercel env add STRIPE_SECRET_KEY
vercel env add OPENAI_API_KEY
# ... その他
```

### 2. マイグレーション実行
```bash
# 本番環境でマイグレーション
npx prisma migrate deploy
```

### 3. デプロイ
```bash
# Vercelにデプロイ
vercel --prod
```

### 4. 動作確認
- [ ] トップページが表示される
- [ ] `/api/health` が200を返す
- [ ] 認証フローが動作する
- [ ] 決済フローが動作する（テストモード）

---

## 📋 デプロイ後チェック

### 機能テスト
- [ ] ユーザー登録・ログイン
- [ ] Twitterアカウント連携
- [ ] 投稿作成・予約
- [ ] 予約投稿の自動公開（Cron）
- [ ] 決済（Stripe）
- [ ] 分析ダッシュボード

### パフォーマンステスト
- [ ] Lighthouseスコア90以上
- [ ] LCP < 2.5s
- [ ] FID < 100ms

### セキュリティテスト
- [ ] CSPヘッダー確認
- [ ] CORS設定確認
- [ ] レート制限動作確認

---

## 🆘 トラブルシューティング

### データベース接続エラー
```
Error: P1001: Can't reach database server
→ DATABASE_URLを確認
→ IPアドレス制限を確認（Supabase/Railway等）
```

### Twitter OAuthエラー
```
Error: OAuth callback failed
→ AUTH_TWITTER_ID/SECRETを確認
→ Callback URLを確認
```

### Stripeエラー
```
Error: No such API key
→ STRIPE_SECRET_KEYを確認
→ テスト/本番キーの区別
```

---

## 📞 サポート連絡先

- **Discord**: https://discord.com/invite/CXa5mdJjUv
- **メール**: support@xboost.now
- **X**: @xboost_now

---

**作成**: Sisyphus  
**最終更新**: 2026-02-01
