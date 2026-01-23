'use client';

import { useState } from 'react';
import { Target, TrendingUp, BarChart3, PieChart, Lightbulb, ArrowUpRight, Download, Timer } from 'lucide-react';

interface StrategyMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  positive: boolean;
  trend: number[];
}

interface ContentStrategy {
  id: string;
  title: string;
  category: string;
  performance: number;
  posts: number;
  avgEngagement: number;
}

interface TimeSlotAnalysis {
  timeRange: string;
  avgImpressions: number;
  avgEngagementRate: number;
  bestDay: string;
  recommendedTime: string;
}

export default function StrategyRoomPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'timing' | 'insights'>('overview');

  const metrics: StrategyMetric[] = [
    {
      id: 'impressions',
      title: '総インプレッション',
      value: '2.4M',
      change: '+23%',
      positive: true,
      trend: [1800000, 1950000, 2100000, 2050000, 2200000, 2350000, 2400000],
    },
    {
      id: 'engagement',
      title: 'エンゲージメント率',
      value: '4.8%',
      change: '+0.5%',
      positive: true,
      trend: [4.2, 4.3, 4.4, 4.1, 4.5, 4.6, 4.8],
    },
    {
      id: 'followers',
      title: 'フォロワー増加',
      value: '+1,234',
      change: '+15%',
      positive: true,
      trend: [800, 950, 1100, 1050, 1200, 1350, 1234],
    },
    {
      id: 'viral_posts',
      title: 'バズ投稿数',
      value: '12',
      change: '+3',
      positive: true,
      trend: [5, 7, 6, 8, 9, 10, 12],
    },
  ];

  const contentStrategies: ContentStrategy[] = [
    {
      id: 'shared-experience',
      title: '共通体験型',
      category: '共感',
      performance: 85,
      posts: 24,
      avgEngagement: 5.2,
    },
    {
      id: 'educational',
      title: '教育・解説型',
      category: '価値提供',
      performance: 78,
      posts: 18,
      avgEngagement: 4.1,
    },
    {
      id: 'vulnerability',
      title: '弱さ共有型',
      category: '共感',
      performance: 92,
      posts: 15,
      avgEngagement: 6.3,
    },
    {
      id: 'question',
      title: '質問型',
      category: '対話',
      performance: 70,
      posts: 30,
      avgEngagement: 3.5,
    },
    {
      id: 'story',
      title: '物語型',
      category: '物語',
      performance: 75,
      posts: 12,
      avgEngagement: 4.0,
    },
  ];

  const timeSlotAnalysis: TimeSlotAnalysis = {
    timeRange: selectedPeriod === 'week' ? '過去1週間' : selectedPeriod === 'month' ? '過去1ヶ月' : '過去3ヶ月',
    avgImpressions: selectedPeriod === 'week' ? 34000 : selectedPeriod === 'month' ? 80000 : 240000,
    avgEngagementRate: selectedPeriod === 'week' ? 5.1 : selectedPeriod === 'month' ? 4.8 : 4.5,
    bestDay: '月曜日',
    recommendedTime: '朝7:00 - 9:00',
  };

  const insights = [
    {
      id: 'high-performing',
      title: '高パフォーマンスコンテンツ',
      description: '「弱さ共有型」が最もエンゲージメント率が高い（平均6.3%）',
      recommendation: 'より多くの弱さ共有投稿を検討',
      priority: 'high',
    },
    {
      id: 'timing-optimization',
      title: 'タイミング最適化',
      description: '月曜日の朝7-9時が最も高いインプレッション',
      recommendation: '重要投稿をこの時間帯に集中させる',
      priority: 'medium',
    },
    {
      id: 'content-mix',
      title: 'コンテンツミックス',
      description: '教育・解説型の投稿頻度が減少傾向',
      recommendation: '週1回は教育コンテンツを投稿',
      priority: 'medium',
    },
    {
      id: 'audience-growth',
      title: 'オーディエンス成長',
      description: 'リツイート経由のフォロワー獲得が増加',
      recommendation: 'リツイートを積極的に活用',
      priority: 'high',
    },
  ];

  const tabs = [
    { id: 'overview', label: '概要', icon: Target },
    { id: 'content', label: 'コンテンツ戦略', icon: Lightbulb },
    { id: 'timing', label: 'タイミング分析', icon: BarChart3 },
    { id: 'insights', label: 'インサイト', icon: PieChart },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            <Target className="h-8 w-8 text-indigo-600" />
            戦略室
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            コンテンツとアナリティクスを統合した戦略的ダッシュボード
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="week">過去1週間</option>
              <option value="month">過去1ヶ月</option>
              <option value="quarter">過去3ヶ月</option>
            </select>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(metric => (
                  <div
                    key={metric.id}
                    className="bg-white rounded-lg p-5 shadow-sm dark:bg-gray-800"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {metric.title}
                      </span>
                      <span className={`text-xs font-semibold ${
                        metric.positive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {metric.value}
                    </div>
                    <div className="h-8">
                      <svg width="100%" height="100%" viewBox="0 0 100 32">
                        <polyline
                          fill="none"
                          stroke={metric.positive ? '#16a34a' : '#dc2626'}
                          strokeWidth="2"
                          points={metric.trend.map((v, i) => `${(i / (metric.trend.length - 1)) * 100},${32 - (v / Math.max(...metric.trend)) * 30}`).join(' ')}
                        />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-indigo-600" />
                    コンテンツカテゴリ別パフォーマンス
                  </h3>

                  <div className="space-y-3">
                    {contentStrategies.map(strategy => (
                      <div key={strategy.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              strategy.performance >= 80 ? 'bg-green-500' :
                              strategy.performance >= 60 ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {strategy.title}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                              {strategy.category}
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${
                            strategy.performance >= 80 ? 'text-green-600 dark:text-green-400' :
                            strategy.performance >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                            'text-red-600 dark:text-red-400'
                          }`}>
                            {strategy.performance}点
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                          <span>{strategy.posts}投稿</span>
                          <span>平均エンゲージメント: {strategy.avgEngagement}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    推奨アクション
                  </h3>

                  <div className="space-y-3">
                    {insights.map(insight => (
                      <div
                        key={insight.id}
                        className={`p-4 rounded-lg border-2 ${
                          insight.priority === 'high'
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {insight.title}
                          </h4>
                          {insight.priority === 'high' && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">
                              高優先度
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {insight.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-indigo-600" />
                          <span className="text-indigo-700 dark:text-indigo-300">
                            {insight.recommendation}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                コンテンツ戦略詳細
              </h3>

              <div className="space-y-4">
                {contentStrategies.map(strategy => {
                  const performanceColor =
                    strategy.performance >= 80 ? 'text-green-600 dark:text-green-400' :
                    strategy.performance >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400';

                  const performanceBg =
                    strategy.performance >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                    strategy.performance >= 60 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                    'bg-red-100 dark:bg-red-900/30';

                  return (
                    <div key={strategy.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                            {strategy.title}
                          </h4>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 ml-2">
                            {strategy.category}
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${performanceColor}`}>
                          {strategy.performance}点
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 mb-1">
                            投稿数
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            {strategy.posts}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 mb-1">
                            平均エンゲージメント
                          </div>
                          <div className={`font-semibold ${performanceColor}`}>
                            {strategy.avgEngagement}%
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 mb-1">
                            パフォーマンス
                          </div>
                          <div className={`font-semibold px-3 py-1 rounded ${performanceBg}`}>
                            {strategy.performance >= 80 ? '優秀' :
                             strategy.performance >= 60 ? '良好' : '要改善'}
                          </div>
                        </div>
                      </div>

                      {strategy.performance >= 80 && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                          <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                            <TrendingUp className="h-4 w-4" />
                            <span className="font-medium">
                              高パフォーマンスコンテンツです！この戦略をさらに活用しましょう
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'timing' && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Timer className="h-5 w-5 text-indigo-600" />
                  最適投稿時間
                </h3>

                <div className="space-y-4">
                  <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border-2 border-indigo-200 dark:border-indigo-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      推奨時間帯
                    </div>
                    <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                      {timeSlotAnalysis.recommendedTime}
                    </div>
                    <div className="mt-2 text-sm text-indigo-600 dark:text-indigo-400">
                      最も高いインプレッションが見込めます
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        最適曜日
                      </div>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {timeSlotAnalysis.bestDay}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        期間中平均
                      </div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {selectedPeriod === 'week' ? '1週間' : selectedPeriod === 'month' ? '1ヶ月' : '3ヶ月'}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                      1時間ごとのパフォーマンス
                    </h4>
                    <div className="space-y-2">
                      {[
                        { time: '0:00-3:00', engagement: '2.1%', impressions: '12K' },
                        { time: '3:00-6:00', engagement: '3.5%', impressions: '18K' },
                        { time: '6:00-9:00', engagement: '5.8%', impressions: '32K' },
                        { time: '9:00-12:00', engagement: '4.2%', impressions: '28K' },
                        { time: '12:00-15:00', engagement: '3.8%', impressions: '25K' },
                        { time: '15:00-18:00', engagement: '4.5%', impressions: '27K' },
                        { time: '18:00-21:00', engagement: '5.2%', impressions: '30K' },
                        { time: '21:00-24:00', engagement: '3.9%', impressions: '22K' },
                      ].map((slot, index) => {
                        const isRecommended = slot.time === '6:00-9:00';
                        return (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isRecommended
                                ? 'bg-indigo-100 dark:bg-indigo-900/30 border-2 border-indigo-500'
                                : 'bg-gray-50 dark:bg-gray-900'
                            }`}
                          >
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {slot.time}
                            </span>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                インプレッション: {slot.impressions}
                              </span>
                              <span className={`font-semibold ${
                                isRecommended
                                  ? 'text-indigo-700 dark:text-indigo-300'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                {slot.engagement}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  曜日別分析
                </h3>

                <div className="space-y-3">
                  {['月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日', '日曜日'].map((day, index) => {
                    const isBestDay = day === timeSlotAnalysis.bestDay;
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          isBestDay
                            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                            : 'bg-gray-50 dark:bg-gray-900'
                        }`}
                      >
                        <span className={`font-medium ${
                          isBestDay
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {day}
                        </span>
                        {isBestDay && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            最適
                          </span>
                        )}
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {isBestDay ? '平均 32K インプレッション' : '平均 18K インプレッション'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-indigo-600" />
                  詳細インサイト
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors">
                  <Download className="h-4 w-4" />
                  レポート出力
                </button>
              </div>

              <div className="space-y-4">
                {insights.map(insight => {
                  const priorityColors = {
                    high: {
                      bg: 'bg-red-50 dark:bg-red-900/20',
                      border: 'border-red-500',
                      badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
                    },
                    medium: {
                      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
                      border: 'border-yellow-500',
                      badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                    },
                    low: {
                      bg: 'bg-green-50 dark:bg-green-900/20',
                      border: 'border-green-500',
                      badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                    },
                  };

                  const colors = priorityColors[insight.priority as keyof typeof priorityColors] || priorityColors.low;

                  return (
                    <div
                      key={insight.id}
                      className={`border-2 ${colors.bg} ${colors.border} rounded-lg p-5`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                          {insight.title}
                        </h4>
                        {insight.priority === 'high' && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
                            高優先度
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                        {insight.description}
                      </p>

                      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-indigo-600" />
                          <span className="text-gray-700 dark:text-gray-300">
                            推奨アクション
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-indigo-700 dark:text-indigo-300">
                            {insight.recommendation}
                          </span>
                          <ArrowUpRight className="h-4 w-4 text-indigo-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
