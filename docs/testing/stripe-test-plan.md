# Stripe Payment System Test Plan

**Version**: 1.0
**Date**: 2026-01-23
**Purpose**: Comprehensive testing of Stripe payment integration in Xboost

---

## Table of Contents
1. [Test Environment Setup](#test-environment-setup)
2. [Test Data](#test-data)
3. [Test Cases](#test-cases)
4. [Pre-Test Checklist](#pre-test-checklist)
5. [Test Execution Guide](#test-execution-guide)
6. [Post-Test Verification](#post-test-verification)
7. [Troubleshooting](#troubleshooting)

---

## Test Environment Setup

### Requirements
- Node.js 18+ installed
- Stripe CLI installed (`npm install -g stripe-cli`)
- Test Stripe account with API keys
- `.env.local` configured with test keys

### Environment Variables
```bash
# Test Mode Keys (Stripe Dashboard > Developers > API Keys)
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Local Development Server
```bash
cd xboost/apps/web
npm run dev
# Server runs on http://localhost:3000
```

---

## Test Data

### Test Card Numbers
| Card Number | Result | Description |
|-------------|---------|-------------|
| `4242 4242 4242 4242` | Success | General payment success |
| `4000 0000 0000 0002` | Card Declined | Card declined |
| `4000 0000 0000 9995` | Insufficient Funds | Insufficient funds |
| `4000 0000 0000 0069` | Expired Card | Expired card |

### Test Price IDs
```bash
# Get actual price IDs from Stripe Dashboard or /api/prices endpoint
# Expected structure:
# - Starter (¥1,000/month): price_xxxxxx_starter
# - Pro (¥5,000/month): price_xxxxxx_pro
# - Team (¥15,000/month): price_xxxxxx_team
```

---

## Test Cases

### TC-01: Checkout Flow - Trial Period

**Objective**: Verify 14-day trial period works correctly

**Steps**:
1. Navigate to `/pricing` or `/early-access`
2. Select "Starter" plan (¥1,000/month)
3. Click "Start Free Trial" button
4. Complete checkout form with test card `4242 4242 4242 4242`
5. Submit payment

**Expected Results**:
- User redirected to `/dashboard` after successful payment
- Subscription status in database: `TRIALING`
- Trial period: 14 days
- User has access to Starter plan features

**Database Verification**:
```sql
SELECT * FROM "Subscription" WHERE "userId" = 'test-user-id';
-- status should be 'TRIALING'
-- stripeCurrentPeriodEnd should be 14 days from now
```

---

### TC-02: Checkout Flow - Direct Payment

**Objective**: Verify immediate payment works

**Steps**:
1. Navigate to `/pricing`
2. Select "Pro" plan (¥5,000/month)
3. Complete checkout with test card
4. Submit payment

**Expected Results**:
- Subscription status: `ACTIVE`
- First invoice created and paid
- User has access to Pro features

---

### TC-03: Checkout Flow - Card Declined

**Objective**: Verify declined card handling

**Steps**:
1. Select "Team" plan
2. Use card number `4000 0000 0000 0002`
3. Submit payment

**Expected Results**:
- Error message displayed: "Your card was declined"
- No subscription created
- User remains on checkout page with error

---

### TC-04: Webhook - Checkout Session Completed

**Objective**: Verify webhook processes completed checkout

**Setup**:
```bash
# Terminal 1: Start Stripe CLI listener
stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
```

**Test Trigger**:
```bash
# Terminal 2: Trigger webhook event
stripe trigger checkout.session.completed
```

**Expected Results**:
- Webhook receives event
- Database subscription record created/updated
- Console logs webhook processing
- No errors in webhook handler

**Webhook Logs to Check**:
```
[Webhook] Received checkout.session.completed
[Webhook] User found: user-id
[Webhook] Subscription created: sub_xxxxxx
```

---

### TC-05: Webhook - Customer Subscription Updated

**Objective**: Verify subscription update handling

**Test Trigger**:
```bash
stripe trigger customer.subscription.updated
```

**Expected Results**:
- Database subscription status updated
- Current period end updated
- Plan limits updated if tier changed

---

### TC-06: Webhook - Invoice Payment Failed

**Objective**: Verify failed payment handling

**Test Trigger**:
```bash
stripe trigger invoice.payment_failed
```

**Expected Results**:
- Subscription status: `PAST_DUE`
- Email/notification sent to user
- User still has limited access

---

### TC-07: Webhook - Invoice Payment Succeeded

**Objective**: Verify successful renewal

**Test Trigger**:
```bash
stripe trigger invoice.payment_succeeded
```

**Expected Results**:
- Subscription status: `ACTIVE`
- New invoice record created
- Period end extended

---

### TC-08: Customer Portal - Plan Upgrade

**Objective**: Verify plan upgrade in portal

**Steps**:
1. Navigate to `/settings` → "Subscription"
2. Click "Manage Subscription" → Opens Stripe Portal
3. Change plan from Starter → Pro
4. Confirm change

**Expected Results**:
- Redirected back to app after change
- Plan limit updated (Pro tier)
- Subscription record updated

---

### TC-09: Customer Portal - Cancel Subscription

**Objective**: Verify cancellation flow

**Steps**:
1. Open Stripe Portal
2. Click "Cancel subscription"
3. Confirm cancellation

**Expected Results**:
- Subscription status: `CANCELED`
- User downgraded to FREE tier
- Access revoked to paid features

---

### TC-10: Customer Portal - Update Payment Method

**Objective**: Verify payment method update

**Steps**:
1. Open Stripe Portal
2. Click "Update payment method"
3. Enter new card: `4242 4242 4242 4242`
4. Save

**Expected Results**:
- Payment method updated
- Future invoices use new card

---

## Pre-Test Checklist

- [ ] Test Stripe account configured with test mode enabled
- [ ] Test API keys in `.env.local`
- [ ] Webhook secret configured in `.env.local`
- [ ] Development server running on port 3000
- [ ] Stripe CLI installed and authenticated
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] NextAuth session can be created
- [ ] Test user account exists

---

## Test Execution Guide

### Running Tests

1. **Start Development Server**:
   ```bash
   cd xboost/apps/web
   npm run dev
   ```

2. **Start Stripe Webhook Listener** (Terminal 2):
   ```bash
   stripe listen --forward-to http://localhost:3000/api/webhooks/stripe
   ```
   - Note: This outputs webhook signing secret for `.env.local`

3. **Configure Webhook Secret**:
   ```bash
   # Copy the webhook secret from the stripe listen output
   STRIPE_WEBHOOK_SECRET=whsec_test_...
   ```

4. **Execute Test Cases**:
   - Manual testing: Navigate to app and test UI
   - Webhook testing: Use `stripe trigger` commands

### Test Execution Order
1. TC-01: Checkout with trial
2. TC-04: Webhook - session completed
3. TC-08: Customer Portal - plan upgrade
4. TC-05: Webhook - subscription updated
5. TC-09: Customer Portal - cancel
6. TC-07: Webhook - payment succeeded (renewal)

---

## Post-Test Verification

### Database Verification
```bash
# Connect to database
npx prisma studio

# Check subscription records
# Verify: status, stripeCustomerId, stripeSubscriptionId
```

### API Endpoint Verification
```bash
# Test subscription endpoint
curl -H "Cookie: next-auth.session-token=..." \
  http://localhost:3000/api/payments/subscription

# Expected: Current subscription object
```

### Logs Verification
Check server logs for:
- Webhook events received
- Database updates
- Error messages
- Rate limit headers

---

## Troubleshooting

### Issue: "Webhook signature verification failed"
**Cause**: Webhook secret mismatch
**Solution**:
1. Run `stripe listen --forward-to ...`
2. Copy the webhook signing secret from output
3. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`
4. Restart dev server

### Issue: "Customer not found"
**Cause**: Stripe Customer not created or linked
**Solution**:
1. Check Stripe Dashboard for customer
2. Verify `stripeCustomerId` in User table
3. Ensure checkout flow creates customer

### Issue: "Subscription status not updating"
**Cause**: Webhook not processing correctly
**Solution**:
1. Check webhook logs in Stripe Dashboard
2. Verify webhook endpoint receives events
3. Check database update logic in webhook handler

### Issue: "Rate limit exceeded"
**Cause**: Too many API requests
**Solution**:
1. Wait for rate limit reset (1 minute)
2. Implement exponential backoff
3. Check rate limiting logic

### Issue: "Checkout redirect not working"
**Cause**: Missing or incorrect `success_url`/`cancel_url`
**Solution**:
1. Check `/api/payments/checkout/route.ts`
2. Verify redirect URLs match app routes
3. Ensure URLs are absolute

### Issue: "Portal returns 403"
**Cause**: Customer ID not associated with user
**Solution**:
1. Verify `stripeCustomerId` exists in User table
2. Check Stripe Customer exists
3. Ensure customer creation flow works

---

## Test Results Template

| Test Case | Status | Expected | Actual | Notes |
|------------|--------|----------|---------|-------|
| TC-01 | ⬜ | 14-day trial works | | |
| TC-02 | ⬜ | Immediate payment | | |
| TC-03 | ⬜ | Card declined | | |
| TC-04 | ⬜ | Webhook session completed | | |
| TC-05 | ⬜ | Webhook subscription updated | | |
| TC-06 | ⬜ | Webhook payment failed | | |
| TC-07 | ⬜ | Webhook payment succeeded | | |
| TC-08 | ⬜ | Portal plan upgrade | | |
| TC-09 | ⬜ | Portal cancel | | |
| TC-10 | ⬜ | Portal payment update | | |

**Legend**: ✅ Pass, ❌ Fail, ⬜ Not Tested, ⚠️ Issues

---

## Related Documentation

- [Stripe Implementation Guide](../guides/stripe-implementation.md)
- [Stripe Setup Guide](../stripe-setup-guide.md)
- [API Reference](../../xboost/apps/web/app/api/payments/)
