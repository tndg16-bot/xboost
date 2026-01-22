'use client';

import { useState } from 'react';
import { Users, Reply, Repeat2, Target, TrendingUp, Settings2, Zap, ChevronDown, ChevronUp, Upload, Download } from 'lucide-react';

interface StrongAccount {
  id: string;
  handle: string;
  name: string;
  followers: number;
  avgEngagement: number;
  category: 'tech' | 'business' | 'creator' | 'other';
  lastPostAt: Date;
  strategy: 'quote' | 'reply' | 'both' | 'none';
}

interface StrategyConfig {
  enabled: boolean;
  defaultStrategy: 'quote' | 'reply' | 'both';
  autoQuoteThreshold: number;
  autoReplyThreshold: number;
  minFollowers: number;
  excludeSelfPosts: boolean;
  delayHours: number;
}

export default function StrongAccountStrategyPage() {
  const [accounts, setAccounts] = useState<StrongAccount[]>([]);
  const [selectedAccount, _setSelectedAccount] = useState<StrongAccount | null>(null);
  const [config, setConfig] = useState<StrategyConfig>({
    enabled: true,
    defaultStrategy: 'both',
    autoQuoteThreshold: 100,
    autoReplyThreshold: 50,
    minFollowers: 50000,
    excludeSelfPosts: true,
    delayHours: 2,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showStrategyDropdown, setShowStrategyDropdown] = useState<string | null>(null);

  const handleToggleStrategy = (accountId: string, newStrategy: StrongAccount['strategy']) => {
    setAccounts(prev =>
      prev.map(acc =>
        acc.id === accountId ? { ...acc, strategy: newStrategy } : acc
      )
    );
    setShowStrategyDropdown(null);
  };

  const handleUpdateConfig = (newConfig: Partial<StrategyConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const handleBulkStrategy = (strategy: 'quote' | 'reply' | 'both' | 'none') => {
    setAccounts(prev => prev.map(acc => ({ ...acc, strategy })));
    setShowStrategyDropdown(null);
  };

  const getCategoryBadge = (category: StrongAccount['category']) => {
    const badges = {
      tech: { label: 'テクノロジー', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      business: { label: 'ビジネス', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      creator: { label: 'クリエイター', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
      other: { label: 'その他', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    };
    return badges[category];
  };

  const getStrategyBadge = (strategy: StrongAccount['strategy']) => {
    const badges = {
      quote: { label: '引用', icon: Repeat2, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' },
      reply: { label: 'リプライ', icon: Reply, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' },
      both: { label: '引用+リプライ', icon: Zap, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      none: { label: 'なし', icon: Target, color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    };
    return badges[strategy];
  };

  const renderStrategyDropdown = (account: StrongAccount) => {
    const badges = {
      both: { icon: Zap, label: '引用+リプライ', color: 'bg-green-100 text-green-700' },
      quote: { icon: Repeat2, label: '引用', color: 'bg-indigo-100 text-indigo-700' },
      reply: { icon: Reply, label: 'リプライ', color: 'bg-orange-100 text-orange-700' },
      none: { icon: Target, label: 'なし', color: 'bg-gray-100 text-gray-700' },
    };

    return (
      <div className="absolute right-0 top-full mt-1 w-[180px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20">
        {(['both', 'quote', 'reply', 'none'] as const).map(strat => {
          const Icon = badges[strat].icon;
          return (
            <button
              key={strat}
              onClick={() => handleToggleStrategy(account.id, strat)}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 text-sm"
            >
              <Icon className={`h-4 w-4 ${badges[strat].color}`} />
              <span className={badges[strat].color}>{badges[strat].label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const generateMockData = () => {
    const mockAccounts: StrongAccount[] = [
      {
        id: 'account-1',
        handle: '@tech_influencer',
        name: 'テック系インフルエンサー',
        followers: 125000,
        avgEngagement: 4.8,
        category: 'tech',
        lastPostAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        strategy: 'both',
      },
      {
        id: 'account-2',
        handle: '@business_pro',
        name: 'ビジネス系アカウント',
        followers: 78000,
        avgEngagement: 3.5,
        category: 'business',
        lastPostAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        strategy: 'quote',
      },
      {
        id: 'account-3',
        handle: '@creator_star',
        name: 'クリエイター',
        followers: 92000,
        avgEngagement: 5.2,
        category: 'creator',
        lastPostAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        strategy: 'reply',
      },
      {
        id: 'account-4',
        handle: '@other_strong',
        name: 'その他',
        followers: 156000,
        avgEngagement: 4.1,
        category: 'other',
        lastPostAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        strategy: 'both',
      },
    ];

    setAccounts(mockAccounts);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            <Target className="h-8 w-8 text-indigo-600" />
            強いアカウント引用・リプライ戦略切り替え
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            フォローしている強いアカウントに対して、引用やリプライの戦略を管理
          </p>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="アカウント検索..."
                className="flex-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
              />
              <Users className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              追加アカウント:
            </span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full text-sm font-medium">
              {accounts.length}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={generateMockData}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
            >
              <TrendingUp className="h-4 w-4" />
              データ読込
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Upload className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {showSettings && (
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-indigo-600" />
                    戦略設定
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <span className="text-lg">✕</span>
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={config.enabled}
                        onChange={e => handleUpdateConfig({ enabled: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        自動戦略を有効にする
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      デフォルト戦略
                    </label>
                    <select
                      value={config.defaultStrategy}
                      onChange={e => handleUpdateConfig({ defaultStrategy: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                    >
                      <option value="quote">引用のみ</option>
                      <option value="reply">リプライのみ</option>
                      <option value="both">引用+リプライ</option>
                      <option value="none">なし</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        自動引用しきい値（いいね）
                      </label>
                      <input
                        type="number"
                        value={config.autoQuoteThreshold}
                        onChange={e => handleUpdateConfig({ autoQuoteThreshold: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        自動リプライしきい値（いいね）
                      </label>
                      <input
                        type="number"
                        value={config.autoReplyThreshold}
                        onChange={e => handleUpdateConfig({ autoReplyThreshold: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        最小フォロワー数
                      </label>
                      <input
                        type="number"
                        value={config.minFollowers}
                        onChange={e => handleUpdateConfig({ minFollowers: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        遅延時間（時間）
                      </label>
                      <input
                        type="number"
                        value={config.delayHours}
                        onChange={e => handleUpdateConfig({ delayHours: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={config.excludeSelfPosts}
                        onChange={e => handleUpdateConfig({ excludeSelfPosts: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        自分の投稿には反応しない
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  追加アカウント一覧
                </h2>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Settings2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {accounts.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    アカウントをまだ読込んでいません。「データ読込」をクリックしてください
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        一括操作:
                      </span>
                      {['both', 'quote', 'reply', 'none'].map(strategy => {
                        const badges = {
                          both: { label: '引用+リプライ', color: 'bg-green-100 text-green-700' },
                          quote: { label: '引用', color: 'bg-indigo-100 text-indigo-700' },
                          reply: { label: 'リプライ', color: 'bg-orange-100 text-orange-700' },
                          none: { label: 'なし', color: 'bg-gray-100 text-gray-700' },
                        };
                        return (
                          <button
                            key={strategy}
                            onClick={() => handleBulkStrategy(strategy as any)}
                            className={`text-sm px-3 py-1.5 rounded-md ${badges[strategy as keyof typeof badges].color} hover:opacity-80 transition-opacity`}
                          >
                            {badges[strategy as keyof typeof badges].label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {accounts.map(account => {
                      const categoryBadge = getCategoryBadge(account.category);
                      const strategyBadge = getStrategyBadge(account.strategy);
                      const isDropdownOpen = showStrategyDropdown === account.id;
                      const StrategyIcon = strategyBadge.icon;

                      return (
                        <div
                          key={account.id}
                          className={`border rounded-lg p-4 transition-all ${
                            selectedAccount?.id === account.id
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                  {account.handle}
                                </h3>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {account.name}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryBadge.color}`}>
                                  {categoryBadge.label}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                {account.lastPostAt.toLocaleDateString('ja-JP')}に最後の投稿
                              </p>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Users className="h-3.5 w-3.5" />
                                  <span>{formatNumber(account.followers)}フォロワー</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <TrendingUp className="h-3.5 w-3.5" />
                                  <span>平均エンゲージメント: {account.avgEngagement}%</span>
                                </div>
                              </div>
                            </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-900 rounded-lg">
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                戦略:
                              </span>
                              <div className="relative">
                                <button
                                  onClick={() => {
                                    if (isDropdownOpen) {
                                      setShowStrategyDropdown(null);
                                    } else {
                                      setShowStrategyDropdown(account.id);
                                    }
                                  }}
                                  className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full flex items-center gap-1.5"
                                >
                                  <StrategyIcon className={`h-3.5 w-3.5 ${strategyBadge.color}`} />
                                  <span className={strategyBadge.color}>{strategyBadge.label}</span>
                                  {isDropdownOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                </button>

                                {isDropdownOpen && renderStrategyDropdown(account)}
                              </div>
                            </div>

                            <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                              戦略変更
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200 dark:border-indigo-700">
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  戦略のポイント
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  引用は知名度向上に効果的
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  リプライは対話を生む
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  適切な戦略でエンゲージメントを最大化
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  自動化で効率化
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                戦略統計
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      引用した投稿
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      24
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>今月</span>
                    <span className="text-green-600 dark:text-green-400">
                      +12% 増加
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      リプライした投稿
                    </span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      18
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>今月</span>
                    <span className="text-green-600 dark:text-green-400">
                      +8% 増加
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      獲得フォロワー
                    </span>
                    <span className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
                      +847
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    <span>今月</span>
                    <span className="text-green-600 dark:text-green-400">
                      +23% 増加
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
