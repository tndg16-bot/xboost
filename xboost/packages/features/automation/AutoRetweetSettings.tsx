'use client';

import { useState } from 'react';

export interface AutoRetweetSettings {
  enabled: boolean;
  delayHours: number;
  maxRetweets: number;
  onlyHighEngagement: boolean;
  minLikes: number;
}

export interface AutoRetweetSettingsProps {
  settings: AutoRetweetSettings;
  onChange: (settings: AutoRetweetSettings) => void;
}

export function AutoRetweetSettingsPanel({ settings, onChange }: AutoRetweetSettingsProps) {
  const handleChange = (key: keyof AutoRetweetSettings, value: AutoRetweetSettings[keyof AutoRetweetSettings]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div className="rounded-2xl border-2 border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          自動リツイート設定
        </h2>
        <button
          onClick={() => handleChange('enabled', !settings.enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            settings.enabled ? 'bg-teal-600' : 'bg-zinc-300 dark:bg-zinc-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
              settings.enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {!settings.enabled && (
        <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
          自動リツイートを有効にすると、設定に基づいて投稿が自動でリツイートされます。
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            リツイート遅延時間
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="1"
              max="72"
              value={settings.delayHours}
              onChange={(e) => handleChange('delayHours', parseInt(e.target.value))}
              disabled={!settings.enabled}
              className="flex-1 accent-teal-600"
            />
            <span className="min-w-[100px] rounded-lg border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
              {settings.delayHours}時間後
            </span>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
            最大リツイート回数
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.maxRetweets}
            onChange={(e) => handleChange('maxRetweets', parseInt(e.target.value))}
            disabled={!settings.enabled}
            className="w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-teal-500"
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border-2 border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div>
            <h3 className="mb-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              エンゲージメントが高い投稿のみ
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              いいね数が閾値を超えた投稿のみ自動リツイート
            </p>
          </div>
          <button
            onClick={() => handleChange('onlyHighEngagement', !settings.onlyHighEngagement)}
            disabled={!settings.enabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.onlyHighEngagement ? 'bg-teal-600' : 'bg-zinc-300 dark:bg-zinc-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                settings.onlyHighEngagement ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {settings.onlyHighEngagement && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-900 dark:text-zinc-50">
              最小いいね数
            </label>
            <input
              type="number"
              min="10"
              max="1000"
              value={settings.minLikes}
              onChange={(e) => handleChange('minLikes', parseInt(e.target.value))}
              disabled={!settings.enabled}
              className="w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 focus:border-teal-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-teal-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
