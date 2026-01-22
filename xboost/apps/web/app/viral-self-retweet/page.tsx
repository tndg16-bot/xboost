'use client';

import { useState } from 'react';
import { Flame, Calendar, RefreshCw, Eye, Heart, Repeat2, MessageCircle, ChevronDown, ChevronUp, Settings2 } from 'lucide-react';

interface ViralPost {
  id: string;
  content: string;
  postedAt: Date;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  engagementRate: number;
}

interface AutoSelfRetweet {
  id: string;
  postId: string;
  postContent: string;
  retweetScheduledAt?: Date;
  retweetSentAt?: Date;
  status: 'pending' | 'scheduled' | 'sent' | 'skipped';
  notes?: string;
}

interface SelfRetweetConfig {
  enabled: boolean;
  minEngagementRate: number;
  minLikes: number;
  minRetweets: number;
  minHoursSincePost: number;
  maxRetweetsPerDay: number;
  excludeHashtags: string[];
}

export default function ViralSelfRetweetPage() {
  const [viralPosts, setViralPosts] = useState<ViralPost[]>([]);
  const [scheduledRetweets, setScheduledRetweets] = useState<AutoSelfRetweet[]>([]);
  const [config, setConfig] = useState<SelfRetweetConfig>({
    enabled: true,
    minEngagementRate: 5.0,
    minLikes: 100,
    minRetweets: 20,
    minHoursSincePost: 24,
    maxRetweetsPerDay: 3,
    excludeHashtags: [],
  });
  const [showSettings, setShowSettings] = useState(false);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  const handleScheduleRetweet = (post: ViralPost) => {
    const hoursSincePost = (Date.now() - post.postedAt.getTime()) / (1000 * 60 * 60);
    const delayHours = hoursSincePost < 72 ? 72 - hoursSincePost : 168 - hoursSincePost;
    const scheduledAt = new Date(Date.now() + delayHours * 60 * 60 * 1000);

    const retweet: AutoSelfRetweet = {
      id: `retweet-${Date.now()}`,
      postId: post.id,
      postContent: post.content,
      retweetScheduledAt: scheduledAt,
      status: 'scheduled',
    };

    setScheduledRetweets(prev => [...prev, retweet]);
  };

  const handleCancelRetweet = (retweetId: string) => {
    setScheduledRetweets(prev => prev.filter(r => r.id !== retweetId));
  };

  const handleUpdateConfig = (newConfig: Partial<SelfRetweetConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const getStatusBadge = (status: AutoSelfRetweet['status']) => {
    const badges = {
      pending: { text: '保留中', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' },
      scheduled: { text: '予約済', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
      sent: { text: '送信済', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
      skipped: { text: 'スキップ', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
    };
    return badges[status];
  };

  const calculateViralScore = (post: ViralPost): number => {
    const weights = { impressions: 0.3, likes: 0.4, retweets: 0.25, replies: 0.05 };
    const normalizedImpressions = Math.min(post.impressions / 100000, 1);
    const normalizedLikes = Math.min(post.likes / 5000, 1);
    const normalizedRetweets = Math.min(post.retweets / 1000, 1);
    const normalizedReplies = Math.min(post.replies / 200, 1);
    const score = ((normalizedImpressions * weights.impressions +
      normalizedLikes * weights.likes +
      normalizedRetweets * weights.retweets +
      normalizedReplies * weights.replies) * 100);
    return Math.round(score);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const generateMockData = () => {
    const posts: ViralPost[] = [];
    const now = Date.now();

    for (let i = 0; i < 10; i++) {
      const daysAgo = Math.floor(Math.random() * 90) + 1;
      const postedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
      const impressions = Math.floor(Math.random() * 100000) + 5000;
      const likes = Math.floor(Math.random() * 5000) + 100;
      const retweets = Math.floor(Math.random() * 1000) + 10;
      const replies = Math.floor(Math.random() * 200) + 5;
      const engagementRate = ((likes + retweets * 2 + replies * 3) / impressions) * 100;

      posts.push({
        id: `post-${i}`,
        content: `【共有】今日学んだことを共有します。\n\n#学び #知識共有`,
        postedAt,
        impressions,
        likes,
        retweets,
        replies,
        engagementRate,
      });
    }

    setViralPosts(posts.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime()));
  };

  const generateMockScheduled = () => {
    const now = Date.now();
    const retweets: AutoSelfRetweet[] = [];

    for (let i = 0; i < 3; i++) {
      const hoursAhead = Math.floor(Math.random() * 72) + 24;
      const scheduledAt = new Date(now + hoursAhead * 60 * 60 * 1000);

      retweets.push({
        id: `scheduled-${i}`,
        postId: `post-${i}`,
        postContent: `【共有】今日学んだことを共有します。\n\n#学び #知識共有`,
        retweetScheduledAt: scheduledAt,
        status: 'scheduled',
      });
    }

    setScheduledRetweets(retweets);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
              <Flame className="h-8 w-8 text-orange-500" />
              過去バズ投稿のセルフリツイート自動化
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              過去のバズ投稿を自動でリツイートし、再拡散する機能
            </p>
          </div>
          <button
            onClick={() => {
              generateMockData();
              generateMockScheduled();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            データ読込
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  バズ投稿一覧
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Settings2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {showSettings && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    自動リツイート設定
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={e => handleUpdateConfig({ enabled: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          自動リツイートを有効にする
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                          最小エンゲージメント率
                        </label>
                        <input
                          type="number"
                          value={config.minEngagementRate}
                          onChange={e => handleUpdateConfig({ minEngagementRate: parseFloat(e.target.value) })}
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                          最小いいね数
                        </label>
                        <input
                          type="number"
                          value={config.minLikes}
                          onChange={e => handleUpdateConfig({ minLikes: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                          最小リツイート数
                        </label>
                        <input
                          type="number"
                          value={config.minRetweets}
                          onChange={e => handleUpdateConfig({ minRetweets: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1.5">
                          1日最大リツイート数
                        </label>
                        <input
                          type="number"
                          value={config.maxRetweetsPerDay}
                          onChange={e => handleUpdateConfig({ maxRetweetsPerDay: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viralPosts.length === 0 ? (
                <div className="text-center py-12">
                  <Flame className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    データをまだ読込んでいません。「データ読込」をクリックしてください
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {viralPosts.map(post => {
                    const viralScore = calculateViralScore(post);
                    const isExpanded = expandedPost === post.id;
                    const isScheduled = scheduledRetweets.some(r => r.postId === post.id);

                    return (
                      <div
                        key={post.id}
                        className={`border rounded-lg transition-all ${
                          isExpanded
                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                                  <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                  <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                                    {viralScore}点
                                  </span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                  {post.postedAt.toLocaleDateString('ja-JP')}
                                </span>
                                {isScheduled && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
                                    予約済
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-900 dark:text-gray-100 mb-3">
                                {isExpanded ? post.content : post.content.substring(0, 100) + '...'}
                              </p>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1.5">
                                  <Eye className="h-4 w-4" />
                                  <span>{formatNumber(post.impressions)}インプレッション</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Heart className="h-4 w-4" />
                                  <span>{formatNumber(post.likes)}いいね</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Repeat2 className="h-4 w-4" />
                                  <span>{formatNumber(post.retweets)}リツイート</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MessageCircle className="h-4 w-4" />
                                  <span>{formatNumber(post.replies)}返信</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setExpandedPost(isExpanded ? null : post.id)}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => handleScheduleRetweet(post)}
                                disabled={isScheduled}
                                className={`p-2 rounded-lg ${
                                  isScheduled
                                    ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                                    : 'hover:bg-green-100 dark:hover:bg-green-900/20'
                                }`}
                              >
                                <RefreshCw className={`h-5 w-5 ${
                                  isScheduled
                                    ? 'text-gray-400'
                                    : 'text-green-600 dark:text-green-400'
                                }`} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                予約済リツイート
              </h2>

              {scheduledRetweets.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    予約されたリツイートはありません
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledRetweets.map(retweet => {
                    const status = getStatusBadge(retweet.status);

                    return (
                      <div key={retweet.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <span className={`text-xs px-2 py-1 rounded ${status.color}`}>
                            {status.text}
                          </span>
                          {retweet.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancelRetweet(retweet.id)}
                              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              キャンセル
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                          {retweet.postContent}
                        </p>
                        {retweet.retweetScheduledAt && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <span>⏰</span>
                            <span>
                              {retweet.retweetScheduledAt.toLocaleString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-6 border border-orange-200 dark:border-orange-700 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  バズのポイント
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  過去の成功例を再利用
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  最適なタイミングでリツイート
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                  エンゲージメントを最大化
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
