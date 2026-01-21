import React from 'react';
import { getWritingFeedback } from './mockData';

interface WritingFeedbackProps {
  content: string;
}

export const WritingFeedback: React.FC<WritingFeedbackProps> = ({ content }) => {
  const feedbacks = getWritingFeedback(content);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return { bg: 'bg-red-50', border: 'border-red-200', icon: 'text-red-500', text: 'text-red-700' };
      case 'warning':
        return { bg: 'bg-yellow-50', border: 'border-yellow-200', icon: 'text-yellow-500', text: 'text-yellow-700' };
      case 'info':
        return { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-500', text: 'text-blue-700' };
      default:
        return { bg: 'bg-gray-50', border: 'border-gray-200', icon: 'text-gray-500', text: 'text-gray-700' };
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'エラー';
      case 'warning':
        return '注意';
      case 'info':
        return '情報';
      default:
        return '';
    }
  };

  return (
    <div
      className="rounded-lg border bg-white p-6 h-full shadow-sm hover:shadow-md transition-shadow"
      style={{ borderColor: '#E5E7EB' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
            ライティングフィードバック
          </h2>
        </div>
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ backgroundColor: '#DBEAFE', color: '#1D4ED8' }}
        >
          {feedbacks.length}件のフィードバック
        </span>
      </div>

      {feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: '#ECFDF5' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: '#059669' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-base font-semibold mb-1" style={{ color: '#111827' }}>
            素晴らしい投稿です！
          </h3>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            改善点はありません。このまま投稿しましょう。
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => {
            const colors = getSeverityColor(feedback.severity);
            return (
              <div
                key={feedback.id}
                className={`p-3 rounded-lg border ${colors.bg} ${colors.border}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 mt-0.5 ${colors.icon}`}>
                    {getSeverityIcon(feedback.severity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium ${colors.icon}`}>
                        {getSeverityLabel(feedback.severity)}
                      </span>
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {feedback.message}
                      </span>
                    </div>
                    {feedback.suggestion && (
                      <p className="text-xs mt-1" style={{ color: '#4B5563' }}>
                        💡 {feedback.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      {feedbacks.length > 0 && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: '1px solid #F3F4F6' }}
        >
          <h4 className="text-sm font-medium mb-2" style={{ color: '#374151' }}>
            📝 投稿のコツ
          </h4>
          <ul className="space-y-1.5 text-xs" style={{ color: '#4B5563' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1DA1F2' }}>•</span>
              <span>1行目はフックとして短く、興味を引きつけましょう</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1DA1F2' }}>•</span>
              <span>適度な改行で読みやすさを確保しましょう</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1DA1F2' }}>•</span>
              <span>関連するハッシュタグを2-3個追加しましょう</span>
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#1DA1F2' }}>•</span>
              <span>280文字を超える場合はスレッド化を検討しましょう</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
