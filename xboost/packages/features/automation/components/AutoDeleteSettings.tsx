'use client';

import { useState } from 'react';
import { getSettings } from '../mockData';

export const AutoDeleteSettings = () => {
  const [settings, setSettings] = useState(getSettings());

  const handleToggle = () => {
    setSettings({ ...settings, autoDelete: !settings.autoDelete });
  };

  const handleDaysChange = (days: number) => {
    setSettings({ ...settings, deleteAfterDays: days });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">自動削除設定</h3>
          <p className="text-sm text-gray-500">タイムラインを整理</p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.autoDelete ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.autoDelete ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className={`transition-opacity ${settings.autoDelete ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              保存期間
            </label>
            <div className="flex gap-2">
              {[7, 14, 30, 60].map((days) => (
                <button
                  key={days}
                  onClick={() => handleDaysChange(days)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    settings.deleteAfterDays === days
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {days}日
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              ⚠️ 古い投稿は自動的に削除されます。
              削除された投稿は復元できません。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
