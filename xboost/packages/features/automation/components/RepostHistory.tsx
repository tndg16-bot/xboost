'use client';

import { getRepostHistory, getViralPosts } from '../mockData';

export const RepostHistory = () => {
  const history = getRepostHistory();
  const posts = getViralPosts();

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    if (num === undefined) return '-';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">再投稿履歴</h3>
        <p className="text-sm text-gray-500">全 {history.length} 件の再投稿記録</p>
      </div>

      <div className="divide-y divide-gray-100">
        {history.map((item) => {
          const post = posts.find(p => p.id === item.postId);
          return (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        item.result === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.result === 'success' ? '✅ 成功' : '❌ 失敗'}
                    </span>
                    <span className="text-xs text-gray-500">
                      投稿ID: {item.postId}
                    </span>
                    {post && (
                      <span className="text-xs text-gray-500 max-w-[200px] truncate">
                        {post.content.substring(0, 50)}...
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>📅 {formatDate(item.repostedAt)}</span>
                    {item.impressions && (
                      <span>👁️ {formatNumber(item.impressions)} インプレ</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
