'use client';

import { useState } from 'react';
import { getSettings } from '../mockData';

export const AutoPlugSettings = () => {
  const [settings, setSettings] = useState(getSettings());

  const handleToggle = () => {
    setSettings({ ...settings, autoPlug: !settings.autoPlug });
  };

  const handleMessageChange = (message: string) => {
    setSettings({ ...settings, plugMessage: message });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">自動プラグ設定</h3>
          <p className="text-sm text-gray-500">プロダクト導線を自動挿入</p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.autoPlug ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.autoPlug ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className={`transition-opacity ${settings.autoPlug ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              プラグメッセージ
            </label>
            <textarea
              value={settings.plugMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="プロダクト紹介メッセージを入力..."
            />
            <p className="mt-2 text-xs text-gray-500">
              投稿の最後に自動的に追加されます
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-800">
              💡 プラグ機能で投稿発信 → プロダクト導線へ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
