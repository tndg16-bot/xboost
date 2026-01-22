'use client';

import { useState } from 'react';

type Step = 'evaluation' | 'direction' | 'keywords' | 'proposal' | 'fixed-post';

interface ProfileData {
  currentProfile: string;
  goals: string[];
  achievements: string[];
  challenges: string[];
  direction: string;
  keywords: string[];
  selectedProposal: string | null;
  fixedPost: string;
}

const colors = {
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
} as const;

export const AIProfileCreator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('evaluation');
  const [profileData, setProfileData] = useState<ProfileData>({
    currentProfile: '',
    goals: [],
    achievements: [],
    challenges: [],
    direction: '',
    keywords: [],
    selectedProposal: null,
    fixedPost: '',
  });

  const steps: { id: Step; label: string; number: number }[] = [
    { id: 'evaluation', label: '評価', number: 1 },
    { id: 'direction', label: '方向性', number: 2 },
    { id: 'keywords', label: 'キーワード', number: 3 },
    { id: 'proposal', label: 'プロフィール案', number: 4 },
    { id: 'fixed-post', label: '固定ポスト', number: 5 },
  ];

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleStepClick = (stepId: Step) => {
    setCurrentStep(stepId);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors['gray-50'] }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">AIプロフィール作成</h1>
          <p className="text-sm text-gray-500 mt-1">
            AIと一緒に最適なプロフィールを作成しましょう
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => handleStepClick(step.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep === step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border-2 border-gray-300 text-gray-600'
                }`}
              >
                {step.number}
              </button>
              <span
                className={`ml-2 text-sm font-medium ${
                  currentStep === step.id ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="mx-8 h-0.5 w-16 bg-gray-300"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6 pb-24">
        {currentStep === 'evaluation' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ステップ1: 現状の評価
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  現在のプロフィール
                </label>
                <textarea
                  value={profileData.currentProfile}
                  onChange={(e) => setProfileData({...profileData, currentProfile: e.target.value})}
                  placeholder="現在のプロフィール文を入力..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  目標（1行ずつ）
                </label>
                <textarea
                  value={profileData.goals.join('\n')}
                  onChange={(e) => setProfileData({...profileData, goals: e.target.value.split('\n').filter(g => g.trim())})}
                  placeholder="- フォロワー1万人&#10;- 収益化&#10;- パーソナルブランド確立"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  実績（1行ずつ）
                </label>
                <textarea
                  value={profileData.achievements.join('\n')}
                  onChange={(e) => setProfileData({...profileData, achievements: e.target.value.split('\n').filter(a => a.trim())})}
                  placeholder="- 月間100万インプレッション&#10;- 1日500フォロワー増&#10;- 製品販売で月10万収益"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  課題・悩み（1行ずつ）
                </label>
                <textarea
                  value={profileData.challenges.join('\n')}
                  onChange={(e) => setProfileData({...profileData, challenges: e.target.value.split('\n').filter(c => c.trim())})}
                  placeholder="- フォロワーが伸び悩み&#10;- リツイートされない&#10;- コンテンツの方向性が定まらない"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNext}
                  disabled={!profileData.currentProfile}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'direction' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ステップ2: 方向性の策定
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  プロフィールの方向性
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  AIが最適なプロフィールを生成するための方向性を設定してください
                </p>
                <textarea
                  value={profileData.direction}
                  onChange={(e) => setProfileData({...profileData, direction: e.target.value})}
                  placeholder="例: プログラミング学習者に向けた情報発信、実際の開発体験を共有、初心者にも分かりやすい説明"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleNext}
                  disabled={!profileData.direction}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'keywords' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ステップ3: キーワードの策定
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  キーワード（1行ずつ）
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  プロフィールに含めたい重要なキーワードを入力してください
                </p>
                <textarea
                  value={profileData.keywords.join('\n')}
                  onChange={(e) => setProfileData({...profileData, keywords: e.target.value.split('\n').filter(k => k.trim())})}
                  placeholder="- プログラミング&#10;- TypeScript&#10;- Web開発&#10;- 初心者向け&#10;- 学習記録"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  入力済み: {profileData.keywords.length}個
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleNext}
                  disabled={profileData.keywords.length === 0}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'proposal' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ステップ4: プロフィール案の生成
            </h2>
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  AIがプロフィール案を生成中...
                </p>
                <p className="text-sm text-gray-500">
                  入力された情報に基づいて、最適なプロフィールを生成します
                </p>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">生成されたプロフィール案</h3>
                <div className="space-y-3">
                  {['プロフィール案1', 'プロフィール案2', 'プロフィール案3'].map((proposal, index) => (
                    <button
                      key={index}
                      onClick={() => setProfileData({...profileData, selectedProposal: proposal})}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        profileData.selectedProposal === proposal
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900 mb-2">{proposal}</div>
                      <div className="text-sm text-gray-600">
                        {index === 0 && 'プログラミング学習者に向けた情報発信を行っています。初心者にも分かりやすい説明を心がけています。'}
                        {index === 1 && 'Webエンジニア。技術ブログや学習記録を発信中。TypeScript、React、Next.jsについて書いています。'}
                        {index === 2 && 'プログラミングを学びながら、学んだことを分かりやすく発信しています。初心者に寄り添ったコンテンツ制作を心がけています。'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={handleNext}
                  disabled={!profileData.selectedProposal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  次へ
                </button>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'fixed-post' && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              ステップ5: 固定ポストの作成
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  固定ポスト
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  プロフィールの下に表示される固定ポストを作成しましょう
                </p>
                <textarea
                  value={profileData.fixedPost}
                  onChange={(e) => setProfileData({...profileData, fixedPost: e.target.value})}
                  placeholder="例: プログラミング学習者向けに情報発信しています。初心者にも分かりやすい技術記事を毎日更新中！&#10;&#10;🔧 技術スタック: TypeScript, React, Next.js&#10;📝 ブログ: [URL]&#10;📈 フォロワー: 1.2万人"
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  文字数: {profileData.fixedPost.length}
                </p>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  戻る
                </button>
                <button
                  onClick={() => {
                    alert('プロフィールと固定ポストを保存しました！');
                    // TODO: API call to save profile and fixed post
                  }}
                  disabled={!profileData.fixedPost}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  完了して保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
