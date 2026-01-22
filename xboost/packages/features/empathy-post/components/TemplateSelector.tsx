'use client';

import { useState } from 'react';

export interface EmpathyPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  examples: string[];
}

export interface EmpathyTemplate {
  id: string;
  patternId: string;
  title: string;
  template: string;
  customizations: {
    key: string;
    label: string;
    type: string;
    default: string;
  }[];
}

interface TemplateSelectorProps {
  patterns: EmpathyPattern[];
  templates: EmpathyTemplate[];
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  patterns,
  templates,
  selectedTemplate,
  onSelectTemplate,
}) => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  const filteredTemplates = selectedPattern
    ? templates.filter(t => t.patternId === selectedPattern)
    : templates;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">共感系パターン</h2>

      {/* Pattern Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {patterns.map(pattern => (
          <button
            key={pattern.id}
            onClick={() => setSelectedPattern(pattern.id)}
            className={`p-3 rounded-lg border-2 transition-all text-left ${
              selectedPattern === pattern.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-1">{pattern.icon}</div>
            <div className="font-medium text-sm text-gray-900">{pattern.name}</div>
            <div className="text-xs text-gray-500 mt-1">{pattern.description}</div>
          </button>
        ))}
      </div>

      {/* Template Selection */}
      {selectedPattern && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {patterns.find(p => p.id === selectedPattern)?.name}のテンプレート
          </h3>
          <div className="space-y-3">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">{template.title}</div>
                <div className="text-sm text-gray-600 mt-1">{template.template}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!selectedPattern && (
        <p className="text-sm text-gray-500">パターンを選択するとテンプレートが表示されます</p>
      )}

      {/* Pattern Examples */}
      {selectedPattern && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {patterns.find(p => p.id === selectedPattern)?.name}の例
          </h3>
          <div className="space-y-2">
            {patterns.find(p => p.id === selectedPattern)?.examples.map((example, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                {example}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
