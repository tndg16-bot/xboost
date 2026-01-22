'use client';

import { useState, useEffect } from 'react';
import { FileText, Quote, Plus, Trash2, Send, Clock, Edit3 } from 'lucide-react';

interface DraftPost {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  category?: string;
}

interface QuoteRetweet {
  id: string;
  draftId: string;
  quotedContent: string;
  comment: string;
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent';
}

export default function QuoteRetweetPage() {
  const [drafts, setDrafts] = useState<DraftPost[]>([]);
  const [quoteRetweets, setQuoteRetweets] = useState<QuoteRetweet[]>([]);
  const [newDraftContent, setNewDraftContent] = useState('');
  const [selectedDraft, setSelectedDraft] = useState<DraftPost | null>(null);
  const [quoteComment, setQuoteComment] = useState('');
  const [showDraftForm, setShowDraftForm] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const handleCreateDraft = () => {
    if (!newDraftContent.trim()) return;

    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      content: newDraftContent,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setDrafts(prev => [draft, ...prev]);
    setNewDraftContent('');
    setShowDraftForm(false);
  };

  const handleDeleteDraft = (draftId: string) => {
    setDrafts(prev => prev.filter(d => d.id !== draftId));
  };

  const handleEditDraft = (draft: DraftPost) => {
    setNewDraftContent(draft.content);
    setSelectedDraft(draft);
    setShowDraftForm(true);
  };

  const handleCreateQuote = () => {
    if (!selectedDraft || !quoteComment.trim()) return;

    const quote: QuoteRetweet = {
      id: `quote-${Date.now()}`,
      draftId: selectedDraft.id,
      quotedContent: selectedDraft.content,
      comment: quoteComment,
      status: 'draft',
    };

    setQuoteRetweets(prev => [quote, ...prev]);
    setSelectedDraft(null);
    setQuoteComment('');
  };

  const handleScheduleQuote = (quote: QuoteRetweet) => {
    const scheduleQuote = () => {
      const hoursAhead = Math.floor(Math.random() * 24) + 1;
      const scheduledAt = new Date(Date.now() + hoursAhead * 60 * 60 * 1000);

      setQuoteRetweets(prev =>
        prev.map(q =>
          q.id === quote.id ? { ...q, scheduledAt, status: 'scheduled' as const } : q
        )
      );
    };

    scheduleQuote();
  };

  const handleDeleteQuote = (quoteId: string) => {
    setQuoteRetweets(prev => prev.filter(q => q.id !== quoteId));
  };

  const formatDate = (date: Date, now: number): string => {
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}日前`;
    if (hours > 0) return `${hours}時間前`;
    if (minutes > 0) return `${minutes}分前`;
    return 'たった今';
  };

  const generateMockDrafts = () => {
    const mockDrafts: DraftPost[] = [
      {
        id: 'mock-1',
        content: '【共有】今日学んだことを共有します。\n\n#学び #知識共有',
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 60 * 60 * 1000),
      },
      {
        id: 'mock-2',
        content: '【質問】〇〇について、皆さんはどう考えていますか？\n\n#質問',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: 'mock-3',
        content: '【ノウハウ】〇〇のやり方を解説します。\n\n1. 〇〇\n2. 〇〇\n3. 〇〇\n\n#ノウハウ #解説',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    ];

    setDrafts(mockDrafts);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
            <Quote className="h-8 w-8 text-blue-600" />
            未投稿ポストの引用リツイート
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            下書きから引用リツイートを作成・予約する機能
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  下書き一覧
                </h2>
                <button
                  onClick={() => {
                    generateMockDrafts();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  サンプル読込
                </button>
              </div>

              {showDraftForm ? (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <textarea
                    value={newDraftContent}
                    onChange={e => setNewDraftContent(e.target.value)}
                    placeholder="新しい下書きを入力..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleCreateDraft}
                      disabled={!newDraftContent.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus className="h-4 w-4 inline" />
                      {selectedDraft ? '更新' : '追加'}
                    </button>
                    <button
                      onClick={() => {
                        setShowDraftForm(false);
                        setNewDraftContent('');
                        setSelectedDraft(null);
                      }}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowDraftForm(true)}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <Plus className="h-5 w-5 inline" />
                  新しい下書きを追加
                </button>
              )}

              {drafts.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    下書きはありません
                  </p>
                </div>
              ) : (
                <div className="space-y-3 mt-4">
                  {drafts.map(draft => (
                    <div
                      key={draft.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedDraft(draft)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                            {draft.content}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                            <span>{formatDate(draft.createdAt, now)}に作成</span>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleEditDraft(draft);
                              }}
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              編集
                            </button>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                handleDeleteDraft(draft.id);
                              }}
                              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedDraft && (
              <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Quote className="h-5 w-5 text-blue-600" />
                  引用リツイートを作成
                </h2>

                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    引用元：
                  </p>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {selectedDraft.content}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      追加コメント
                    </label>
                    <textarea
                      value={quoteComment}
                      onChange={e => setQuoteComment(e.target.value)}
                      placeholder="この投稿を引用して付け加えるコメント..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateQuote}
                      disabled={!quoteComment.trim()}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 inline" />
                      作成
                    </button>
                    <button
                      onClick={() => setSelectedDraft(null)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      キャンセル
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <Send className="h-5 w-5 text-green-600" />
                予約済引用リツイート
              </h2>

              {quoteRetweets.length === 0 ? (
                <div className="text-center py-8">
                  <Quote className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    予約された引用リツイートはありません
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {quoteRetweets.map(quote => {
                    const statusColors = {
                      draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
                      scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
                      sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
                    };

                    return (
                      <div key={quote.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${statusColors[quote.status]}`}>
                            {quote.status === 'draft' && '下書き'}
                            {quote.status === 'scheduled' && '予約済'}
                            {quote.status === 'sent' && '送信済'}
                          </span>
                          {quote.status === 'draft' && (
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleScheduleQuote(quote)}
                                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                              >
                                予約する
                              </button>
                              <button
                                onClick={() => handleDeleteQuote(quote.id)}
                                className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                削除
                              </button>
                            </div>
                          )}
                          {quote.status === 'scheduled' && (
                            <button
                              onClick={() => handleDeleteQuote(quote.id)}
                              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              キャンセル
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                          {quote.comment}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 p-2 bg-gray-50 dark:bg-gray-900 rounded">
                          <span className="text-gray-600 dark:text-gray-300">引用:</span> {quote.quotedContent.substring(0, 50)}...
                        </div>
                        {quote.scheduledAt && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              {quote.scheduledAt.toLocaleString('ja-JP', {
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

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700 mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Quote className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  引用リツイートのポイント
                </h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  下書きを再利用して引用
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  オリジナル投稿に独自コメントを追加
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                  最適なタイミングで予約投稿
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
