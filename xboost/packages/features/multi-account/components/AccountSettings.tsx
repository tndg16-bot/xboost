'use client';

import { useState } from 'react';
import { Modal } from '@xboost/ui';
import { Button } from '@xboost/ui';
import { Input } from '@xboost/ui';
import { type TwitterAccount } from './AccountCard';

interface AccountSettingsProps {
  account: TwitterAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (accountId: string, updates: Partial<TwitterAccount>) => Promise<void>;
  onDelete: (accountId: string) => Promise<void>;
}

export const AccountSettings = ({ account, isOpen, onClose, onSave, onDelete }: AccountSettingsProps) => {
  const [displayName, setDisplayName] = useState(account?.displayName || '');
  const [role, setRole] = useState<TwitterAccount['role']>(account?.role || 'SUB');
  const [color, setColor] = useState(account?.color || '#3B82F6');
  const [description, setDescription] = useState(account?.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset form when account changes
  if (account && displayName !== account.displayName) {
    setDisplayName(account.displayName || '');
    setRole(account.role);
    setColor(account.color);
    setDescription(account.description || '');
  }

  if (!account) return null;

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(account.id, {
        displayName: displayName || null,
        role,
        color,
        description: description || null,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save account settings:', error);
      alert('設定の保存に失敗しました。');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当にこのアカウントを削除しますか？この操作は取り消せません。')) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(account.id);
      onClose();
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('アカウントの削除に失敗しました。');
    } finally {
      setIsDeleting(false);
    }
  };

  const colorOptions = [
    { value: '#3B82F6', label: 'ブルー', class: 'bg-blue-500' },
    { value: '#8B5CF6', label: 'パープル', class: 'bg-purple-500' },
    { value: '#EC4899', label: 'ピンク', class: 'bg-pink-500' },
    { value: '#10B981', label: 'グリーン', class: 'bg-green-500' },
    { value: '#F59E0B', label: 'オレンジ', class: 'bg-amber-500' },
    { value: '#EF4444', label: 'レッド', class: 'bg-red-500' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="アカウント設定">
      <div className="space-y-6">
        {/* Account Info */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
          {account.profileImageUrl ? (
            <img
              src={account.profileImageUrl}
              alt={account.displayName || account.username}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: account.color || '#3B82F6' }}
            >
              {account.username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{account.displayName || account.username}</h3>
            <p className="text-sm text-gray-500">@{account.username}</p>
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
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="表示名を入力..."
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              アカウントロール
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as TwitterAccount['role'])}
              className="w-full px-4 py-2.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="MAIN">🎯 本アカウント</option>
              <option value="SUB">💼 サブアカウント</option>
              <option value="NICHE">🎨 特化アカウント</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カラー
            </label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full ${option.class} ${
                    color === option.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  title={option.label}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
                title="カスタムカラー"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              メモ
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? '削除中...' : 'アカウントを削除'}
          </Button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button variant="secondary" onClick={onClose} fullWidth>
            キャンセル
          </Button>
          <Button variant="primary" onClick={handleSave} fullWidth disabled={isSaving}>
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
