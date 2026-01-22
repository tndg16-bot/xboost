'use client';

import { useState } from 'react';
import { TemplateSelector } from './components/TemplateSelector';
import { IdeaBrainstorming } from './components/IdeaBrainstorming';
import { EmotionWordSuggestions } from './components/EmotionWordSuggestions';
import { SituationHints } from './components/SituationHints';
import { empathyPatterns, empathyTemplates } from './mockData';

type TabType = 'template' | 'brainstorming' | 'emotions' | 'hints';

const colors = {
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
} as const;

export const EmpathyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customizedContent, setCustomizedContent] = useState('');

  const tabs = [
    { id: 'template' as TabType, label: 'テンプレート', icon: '📝' },
    { id: 'brainstorming' as TabType, label: 'ブレインストーミング', icon: '💡' },
    { id: 'emotions' as TabType, label: '感情語', icon: '😊' },
    { id: 'hints' as TabType, label: '状況ヒント', icon: '💭' },
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = empathyTemplates.find(t => t.id === templateId);
    if (template) {
      let content = template.template;
      template.customizations.forEach(custom => {
        content = content.replace(`{${custom.key}}`, custom.default);
      });
      setCustomizedContent(content);
    }
  };

  const handleCustomize = (key: string, value: string) => {
    if (!selectedTemplate) return;

    const template = empathyTemplates.find(t => t.id === selectedTemplate);
    if (template) {
      let content = template.template;
      template.customizations.forEach(custom => {
        const customValue = custom.key === key ? value : custom.default;
        content = content.replace(`{${custom.key}}`, customValue);
      });
      setCustomizedContent(content);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors['gray-50'] }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">共感系ポスト作成支援</h1>
          <p className="text-sm text-gray-500 mt-1">アイデアのブレインストーミングと共感系テンプレート</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-2 border-b border-gray-200">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'template' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TemplateSelector
              patterns={empathyPatterns}
              templates={empathyTemplates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
            />
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">カスタマイズ</h2>
              {selectedTemplate && (
                <div className="space-y-4">
                  {empathyTemplates
                    .find(t => t.id === selectedTemplate)
                    ?.customizations.map(custom => (
                      <div key={custom.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {custom.label}
                        </label>
                        <input
                          type="text"
                          defaultValue={custom.default}
                          onChange={(e) => handleCustomize(custom.key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    ))}
                  <div className="pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      プレビュー
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-900">{customizedContent}</p>
                    </div>
                  </div>
                </div>
              )}
              {!selectedTemplate && (
                <p className="text-gray-500">テンプレートを選択してください</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'brainstorming' && (
          <IdeaBrainstorming />
        )}

        {activeTab === 'emotions' && (
          <EmotionWordSuggestions />
        )}

        {activeTab === 'hints' && (
          <SituationHints />
        )}
      </div>
    </div>
  );
};
