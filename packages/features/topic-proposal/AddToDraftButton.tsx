import React from 'react';
import type { TopicSuggestion } from './mockData';

interface AddToDraftButtonProps {
  topic: TopicSuggestion;
  onAdd: (content: string) => void;
  isAdded?: boolean;
}

export const AddToDraftButton: React.FC<AddToDraftButtonProps> = ({
  topic,
  onAdd,
  isAdded = false
}) => {
  const handleClick = () => {
    onAdd(topic.examplePost);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isAdded}
      className="w-full py-2.5 px-4 text-white text-sm font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500 flex items-center justify-center gap-2"
      style={{
        backgroundColor: isAdded ? '#9CA3AF' : '#1DA1F2'
      }}
    >
      {isAdded ? (
        <>
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          追加済み
        </>
      ) : (
        <>
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
        </>
      )}
    </button>
  );
};
