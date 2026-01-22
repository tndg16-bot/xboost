'use client';

import { useState } from 'react';
import { TrendingUp, Zap, Calendar, Send, Clock, ArrowRight, Plus, X, MessageCircle, Heart, Repeat2 } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  postedAt: Date;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  engagementRate: number;
}

interface FollowUp {
  id: string;
  postId: string;
  postContent: string;
  followUpContent: string;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent';
  followUpType: 'reply' | 'quote' | 'new_post';
}

interface FollowUpConfig {
  enabled: boolean;
  minEngagementRate: number;
  minLikes: number;
  followUpDelayHours: number;
  autoGenerate: boolean;
}

export default function AutoFollowUpPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpType, setFollowUpType] = useState<'reply' | 'quote' | 'new_post'>('reply');
  const [config, setConfig] = useState<FollowUpConfig>({
    enabled: true,
    minEngagementRate: 3.0,
    minLikes: 50,
    followUpDelayHours: 2,
    autoGenerate: false,
  });

  const handleScheduleFollowUp = () => {
    if (!selectedPost || !followUpContent.trim()) return;

    const hoursAhead = config.followUpDelayHours;
    const scheduledAt = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);

    const followUp: FollowUp = {
      id: `followup-${Date.now()}`,
      postId: selectedPost.id,
      postContent: selectedPost.content,
      followUpContent,
      scheduledAt,
      status: 'scheduled',
      followUpType,
    };

    setFollowUps(prev => [...prev, followUp]);
    setSelectedPost(null);
    setFollowUpContent('');
  };

  const handleCancelFollowUp = (followUpId: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== followUpId));
  };

  const generateFollowUpContent = (post: Post, type: 'reply' | 'quote' | 'new_post'): string => {
    const templates = {
      reply: [
        `返信：コメントありがとうございます！\n\n${post.content.substring(0, 30)}...について、補足します...`,
        `コメントありがとうござます！\n\nさらに詳しく知りたい方はコメントお待ちしております🙏`,
        `コメントいただいて嬉しいです！\n\nもっと深掘りしたければ教えてください😊`,
      ],
      quote: [
        `引用：\n\n"${post.content.substring(0, 50)}..." \n\n続きの内容をまとめてみました！`,
        `引用リツイート：\n\n"${post.content.substring(0, 50)}..." \n\n関連する情報を追加で共有します`,
      ],
      new_post: [
        `追撃：【補足】先程の投稿について\n\n${post.content.substring(0, 50)}...\n\nさらに詳しく...`,
        `追加情報：先程の投稿の補足です。\n\n${post.content.substring(0, 50)}...\n\n続き...`,
      ],
    };

    const typeTemplates = templates[type];
    return typeTemplates[Math.floor(Math.random() * typeTemplates.length)];
  };

  const handleAutoGenerate = (type: 'reply' | 'quote' | 'new_post') => {
    if (selectedPost) {
      const generated = generateFollowUpContent(selectedPost, type);
      setFollowUpContent(generated);
      setFollowUpType(type);
    }
  };

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setFollowUpContent('');
    setFollowUpType('reply');
  };

  const calculateEngagementScore = (post: Post): number => {
    return Math.round(post.engagementRate);
  };

  const isHighEngagement = (post: Post): boolean => {
    return post.engagementRate >= config.minEngagementRate && post.likes >= config.minLikes;
  };

  const generateMockData = () => {
    const mockPosts: Post[] = [];
    const now = Date.now();

    for (let i = 0; i < 8; i++) {
      const hoursAgo = Math.floor(Math.random() * 48) + 1;
      const postedAt = new Date(now - hoursAgo * 60 * 60 * 1000);
      const impressions = Math.floor(Math.random() * 50000) + 1000;
      const likes = Math.floor(Math.random() * 2000) + 10;
      const retweets = Math.floor(Math.random() * 500) + 5;
      const replies = Math.floor(Math.random() * 100) + 1;
      const engagementRate = ((likes + retweets * 2 + replies * 3) / impressions) * 100;

      mockPosts.push({
        id: `post-${i}`,
        content: `【共有】今日学んだことを共有します。\n\n${i % 2 === 0 ? '具体的な方法やポイントをまとめてみました。' : '誰かの役に立てば嬉しいです。'}\n\n#学び #知識共有`,
        postedAt,
        impressions,
        likes,
        retweets,
        replies,
        engagementRate,
      });
    }

    setPosts(mockPosts.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime()));

    const mockFollowUps: FollowUp[] = [
      {
        id: 'followup-1',
        postId: 'post-0',
        postContent: mockPosts[0]?.content || '',
        followUpContent: `返信：コメントありがとうございます！\n\n補足します...`,
        scheduledAt: new Date(now + 2 * 60 * 60 * 1000),
        status: 'scheduled',
        followUpType: 'reply',
      },
    ];

    setFollowUps(mockFollowUps);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            <Zap className="h-8 w-8 text-yellow-500" />
            エンゲージメント高投稿への追撃自動機能
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            高エンゲージメントの投稿に対して、自動でフォローアップ（追撃）を投稿する機能
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  高エンゲージメント投稿
                </h2>
                <button
                  onClick={generateMockData}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  データ読込
                </button>
              </div>

              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    データをまだ読込んでいません。「データ読込」をクリックしてください
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map(post => {
                    const isHigh = isHighEngagement(post);
                    const isSelected = selectedPost?.id === post.id;

                    return (
                      <div
                        key={post.id}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 ring-2 ring-yellow-500'
                            : isHigh
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        onClick={() => handleSelectPost(post)}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${
                                isHigh
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              }`}>
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm font-semibold">
                                  {calculateEngagementScore(post)}%
                                </span>
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {post.postedAt.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                              {post.content}
                            </p>
                            <div className="flex flex-wrap gap-4 text-xs text-gray-600 dark:text-gray-400 mt-2">
                              <div className="flex items-center gap-1.5">
                                <Heart className="h-3.5 w-3.5" />
                                <span>{post.likes}いいね</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Repeat2 className="h-3.5 w-3.5" />
                                <span>{post.retweets}RT</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <MessageCircle className="h-3.5 w-3.5" />
                                <span>{post.replies}返信</span>
                              </div>
                            </div>
                          </div>
                          {isHigh && (
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                高エンゲージメント
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedPost && (
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    フォローアップ作成
                  </h2>
                  <button
                    onClick={() => {
                      setSelectedPost(null);
                      setFollowUpContent('');
                    }}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-medium">引用元：</span>
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {selectedPost.content}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      フォローアップの種類
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'reply' as const, label: '返信', icon: MessageCircle },
                        { type: 'quote' as const, label: '引用', icon: ArrowRight },
                        { type: 'new_post' as const, label: '新規投稿', icon: Plus },
                      ].map(({ type, label, icon: Icon }) => (
                        <button
                          key={type}
                          onClick={() => {
                            setFollowUpType(type);
                            if (config.autoGenerate) {
                              handleAutoGenerate(type);
                            }
                          }}
                          className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1.5 ${
                            followUpType === type
                              ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${
                            followUpType === type
                              ? 'text-yellow-600 dark:text-yellow-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                          <span className={`text-sm font-medium ${
                            followUpType === type
                              ? 'text-yellow-700 dark:text-yellow-300'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {config.autoGenerate && (
                    <button
                      onClick={() => handleAutoGenerate(followUpType)}
                      className="w-full px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                    >
                      <span className="flex items-center gap-2 justify-center">
                        <Zap className="h-4 w-4" />
                        内容を自動生成
                      </span>
                    </button>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      フォローアップ内容
                    </label>
                    <textarea
                      value={followUpContent}
                      onChange={e => setFollowUpContent(e.target.value)}
                      placeholder="フォローアップの内容を入力..."
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={config.autoGenerate}
                          onChange={e => setConfig({ ...config, autoGenerate: e.target.checked })}
                          className="w-4 h-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                        />
                        自動生成を有効に
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedPost(null);
                          setFollowUpContent('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        キャンセル
                      </button>
                      <button
                        onClick={handleScheduleFollowUp}
                        disabled={!followUpContent.trim()}
                        className="px-4 py-2 bg-yellow-600 text-white font-medium rounded-md hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed transition-colors"
                      >
                        <Send className="h-4 w-4 inline" />
                        予約
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-yellow-500" />
                予約済フォローアップ
              </h2>

              {followUps.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    予約されたフォローアップはありません
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {followUps.map(followUp => (
                    <div key={followUp.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex gap-1.5">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            followUp.status === 'draft'
                              ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          }`}>
                            {followUp.status === 'draft' ? '下書き' : '予約済'}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
                            {followUp.followUpType === 'reply' && '返信'}
                            {followUp.followUpType === 'quote' && '引用'}
                            {followUp.followUpType === 'new_post' && '新規投稿'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCancelFollowUp(followUp.id)}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          キャンセル
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                        {followUp.followUpContent}
                      </p>
                      {followUp.scheduledAt && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>
                            {followUp.scheduledAt.toLocaleString('ja-JP', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  フォローアップのポイント
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  高エンゲージメント投稿を自動検知
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  返信・引用・新規投稿から選択
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
                  最適なタイミングで自動投稿
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-1.5 flex-shrink-0" />
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
