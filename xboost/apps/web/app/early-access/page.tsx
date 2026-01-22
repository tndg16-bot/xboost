'use client';

import { useState } from 'react';

interface CouponCode {
  code: string;
  status: 'available' | 'used' | 'expired';
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
  validUntil?: string;
}

export default function EarlyAccessPage() {
  const [coupons, setCoupons] = useState<CouponCode[]>([
    {
      code: 'EARLYBIRD2024',
      status: 'available',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]);
  const [newCode, setNewCode] = useState('');

  const [showCouponModal, setShowCouponModal] = useState(false);

  const handleCreateCoupon = () => {
    if (!newCode.trim()) return;

    const coupon: CouponCode = {
      code: newCode.trim().toUpperCase(),
      status: 'available',
      createdAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setCoupons((prev) => [...prev, coupon]);
    setNewCode('');
    setShowCouponModal(false);
  };

  const handleUseCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.code === code
          ? { ...c, status: 'used', usedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const availableCount = coupons.filter((c) => c.status === 'available').length;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            クーポンコード管理
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            先行アクセス（5名限定）の管理画面
          </p>
        </div>

        {/* Create Coupon Button */}
        <div className="mb-8 rounded-2xl border-2 border-zinc-200 bg-white p-8 text-center shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            新規クーポンコード発行
          </h2>
          <button
            onClick={() => setShowCouponModal(true)}
            className="rounded-full bg-teal-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-teal-700"
          >
            クーポンコードを作成
          </button>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            • 初回のみ：無料期間または割引額
            • 総定：各クーポン1回のみ使用可能
            • 有効期限：発行から30日間
            • 対象人数：5名限定
          </p>
        </div>

        {/* Coupon List */}
        <div className="rounded-2xl border-2 border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="mb-6 flex items-center justify-between border-b-2 border-zinc-200 p-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              クーポンコード一覧
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                {availableCount}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                / 5 利用可能
              </span>
            </div>
          </div>

          <div className="space-y-3 p-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="flex items-center justify-between rounded-lg border-2 border-zinc-200 bg-zinc-50 p-4 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {coupon.code}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        coupon.status === 'available'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : coupon.status === 'used'
                          ? 'bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-zinc-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {coupon.status === 'available'
                        ? '利用可能'
                        : coupon.status === 'used'
                        ? '使用済み'
                        : '有効期限切れ'}
                    </span>
                  </div>
                  {coupon.usedAt && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      使用日時: {new Date(coupon.usedAt).toLocaleString('ja-JP')}
                    </p>
                  )}
                  {coupon.validUntil && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                      有効期限: {new Date(coupon.validUntil).toLocaleDateString('ja-JP')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {coupon.status === 'available' && (
                    <button
                      onClick={() => handleUseCoupon(coupon.code)}
                      className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                    >
                      適用
                    </button>
                  )}
                  {coupon.status === 'used' && (
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      {coupon.usedBy || 'ユーザー不明'}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setCoupons((prev) => prev.filter((c) => c.code !== coupon.code));
                    }}
                    className="rounded-lg border-2 border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700 dark:hover:bg-zinc-600"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Creation Modal */}
        {showCouponModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
              <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                クーポンコードを作成
              </h2>
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    クーポンコード
                  </label>
                  <input
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="英数字6〜12文字"
                    className="w-full rounded-lg border-2 border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCouponModal(false)}
                    className="flex-1 rounded-lg border-2 border-zinc-300 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-700"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleCreateCoupon}
                    disabled={!newCode.trim()}
                    className="flex-1 rounded-lg bg-teal-600 px-4 py-3 text-sm font-semibold text-white disabled:bg-teal-400 disabled:cursor-not-allowed transition-colors hover:bg-teal-700"
                  >
                    作成
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
