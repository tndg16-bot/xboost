'use client';

import { ViralPostQueue } from './components/ViralPostQueue';
import { RepostSchedule } from './components/RepostSchedule';
import { AutoDeleteSettings } from './components/AutoDeleteSettings';
import { AutoPlugSettings } from './components/AutoPlugSettings';
import { RepostHistory } from './components/RepostHistory';

export const AutomationDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">自動化ツール</h1>
        <p className="text-gray-600">
          Xboostが回す部分 × 人間がやる部分
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">運用哲学</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-blue-600 mb-2">Xboostが回す部分</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✅ 実績のあるバズ投稿</li>
                <li>✅ 定期的な再投稿</li>
                <li>✅ 感情ゼロのルーティン</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-purple-600 mb-2">人間がやる部分</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>🎯 思想価値観</li>
                <li>🎯 体験プライベート</li>
                <li>🎯 感情個性</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">バズ再投稿の力</h3>
          <p className="text-sm opacity-90 mb-4">
            10万インプレ超えの投稿は再投稿してもほぼ同じ数字が出る
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">~20</p>
              <p className="text-xs opacity-80">回テスト済み</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold">High</p>
              <p className="text-xs opacity-80">再現性</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">設定パネル</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RepostSchedule />
          <AutoDeleteSettings />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AutoPlugSettings />
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">バズ投稿</h2>
        <ViralPostQueue />
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">履歴</h2>
        <RepostHistory />
      </div>
    </div>
  );
};
