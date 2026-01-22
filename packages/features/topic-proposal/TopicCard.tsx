import React from 'react';
import type { TopicSuggestion } from './mockData';

interface TopicCardProps {
  topic: TopicSuggestion;
  onAddToDraft?: (topic: TopicSuggestion) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onAddToDraft }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ホンネで書き出す':
        return { bg: '#FCE7F3', text: '#DB2777', border: '#FBCFE8' };
      case '逆張り':
        return { bg: '#F3E8FF', text: '#9333EA', border: '#E9D5FF' };
      case '共感':
        return { bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' };
      default:
        return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
    }
  };

  const getEngagementColor = (potential: string) => {
    switch (potential) {
      case 'high':
        return { bg: '#ECFDF5', text: '#059669' };
      case 'medium':
        return { bg: '#FFFBEB', text: '#D97706' };
      case 'low':
        return { bg: '#F9FAFB', text: '#4B5563' };
      default:
        return { bg: '#F9FAFB', text: '#4B5563' };
    }
  };

  const getEngagementLabel = (potential: string) => {
    switch (potential) {
      case 'high':
        return '高い';
      case 'medium':
        return '中程度';
      case 'low':
        return '低い';
      default:
        return '-';
    }
  };

  const categoryColors = getCategoryColor(topic.category);
  const engagementColors = getEngagementColor(topic.engagementPotential);

  return (
    <div
      className="rounded-lg border bg-white transition-all duration-200 p-6 h-full flex flex-col group hover:shadow-lg hover:border-gray-300 cursor-pointer"
      style={{ borderColor: '#E5E7EB' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
          style={{
            backgroundColor: categoryColors.bg,
            color: categoryColors.text,
            borderColor: categoryColors.border
          }}
        >
          {topic.category}
        </span>
        <div
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
          style={{ backgroundColor: engagementColors.bg, color: engagementColors.text }}
        >
          <span
            className="w-2 h-2 rounded-full bg-current mr-1.5"
            style={{ color: engagementColors.text }}
          />
          {getEngagementLabel(topic.engagementPotential)}
        </div>
      </div>

      {/* Title */}
      <h3
        className="text-base font-semibold mb-2 group-hover:text-blue-600 transition-colors"
        style={{ color: '#111827' }}
      >
        {topic.title}
      </h3>

      {/* Description */}
      <p className="text-sm mb-3 flex-1" style={{ color: '#4B5563' }}>
        {topic.description}
      </p>

      {/* Example Post Preview */}
      <div
        className="rounded-lg p-3 mb-3"
        style={{ backgroundColor: '#F9FAFB' }}
      >
        <p className="text-xs mb-1" style={{ color: '#6B7280' }}>
          例文：
        </p>
        <p className="text-xs line-clamp-3" style={{ color: '#374151' }}>
          {topic.examplePost.substring(0, 120)}
          {topic.examplePost.length > 120 && '...'}
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {topic.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs"
            style={{ color: '#4B5563', backgroundColor: '#F3F4F6' }}
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      {onAddToDraft && (
        <button
          onClick={() => onAddToDraft(topic)}
          className="w-full py-2.5 px-4 text-white text-sm font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: '#1DA1F2' }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          下書きに追加
        </button>
      )}
    </div>
  );
};
