'use client';

import { Modal } from '@xboost/ui';
import { Button } from '@xboost/ui';
import { Input } from '@xboost/ui';
import type { Account } from '../mockData';

interface AccountSettingsProps {
  account: Account | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AccountSettings = ({ account, isOpen, onClose }: AccountSettingsProps) => {
  if (!account) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="アカウント設定">
      <div className="space-y-6">
        {/* Account Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          <span className="text-4xl">{account.avatar}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{account.displayName}</h3>
            <p className="text-sm text-gray-500">@{account.username.substring(1)}</p>
          </div>
        </div>

        {/* Settings Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              表示名
            </label>
            <Input
              type="text"
              defaultValue={account.displayName}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              アカウントロール
            </label>
            <select
              defaultValue={account.role}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="main">🎯 本アカウント</option>
              <option value="sub">💼 サブアカウント</option>
              <option value="niche">🎨 特化アカウント</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メモ
            </label>
            <textarea
              rows={3}
              placeholder="このアカウントの用途や運用方針を記述..."
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-red-600 mb-2">
            危険な操作
          </p>
          <p className="text-xs text-gray-500 mb-4">
            アカウントを削除すると、すべてのデータが失われます。
          </p>
          <Button variant="danger" size="md" fullWidth>
            アカウントを削除
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            キャンセル
          </Button>
          <Button variant="primary" onClick={onClose} fullWidth>
            保存
          </Button>
        </div>
      </div>
    </Modal>
  );
};
