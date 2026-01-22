import React from 'react';
import { topicSuggestions, type TopicCategory } from './mockData';
import { TopicCard } from './TopicCard';
import { AddToDraftButton } from './AddToDraftButton';

interface TopicSuggestionsProps {
  category: TopicCategory;
  onAddToDraft?: (content: string) => void;
  addedTopicIds?: Set<string>;
}

export const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({
  category,
  onAddToDraft,
  addedTopicIds = new Set()
}) => {
  const filteredTopics = topicSuggestions.filter(topic => topic.category === category);

  const handleAddToDraft = (topic: typeof topicSuggestions[0]) => {
    onAddToDraft?.(topic.examplePost);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: '#111827' }}>
          {category}
          <span
            className="ml-2 text-sm font-normal"
            style={{ color: '#6B7280' }}
          >
            ({filteredTopics.length}件)
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.map((topic) => (
          <div
            key={topic.id}
            className="rounded-lg border bg-white p-6 h-full flex flex-col"
            style={{ borderColor: '#E5E7EB' }}
          >
            <TopicCard topic={topic} />
            <div
              className="mt-auto pt-3"
              style={{ borderTop: '1px solid #F3F4F6' }}
            >
              <AddToDraftButton
                topic={topic}
                onAdd={() => handleAddToDraft(topic)}
                isAdded={addedTopicIds.has(topic.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
