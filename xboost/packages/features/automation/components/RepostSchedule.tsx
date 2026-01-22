'use client';

import { useState } from 'react';
import { getSettings, getViralPosts } from '../mockData';

export const RepostSchedule = () => {
  const [settings, setSettings] = useState(getSettings());

  const handleToggle = () => {
    setSettings({ ...settings, autoRepost: !settings.autoRepost });
  };

  const handleIntervalChange = (days: number) => {
    setSettings({ ...settings, repostInterval: days });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">自動再投稿設定</h3>
          <p className="text-sm text-gray-500">バズ投稿を定期的に再投稿</p>
        </div>
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.autoRepost ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              settings.autoRepost ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className={`transition-opacity ${settings.autoRepost ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              再投稿間隔
            </label>
            <div className="flex gap-2">
              {[7, 14, 21, 30].map((days) => (
                <button
                  key={days}
                  onClick={() => handleIntervalChange(days)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                    settings.repostInterval === days
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {days}日
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              推奨: 14日（2週間ごと）
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>検証済み:</strong> 10万インプレ超えの投稿は、
              約20回テストの結果、再投稿してもほぼ同じ数字が出るアルゴリズム的再現性あり
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
