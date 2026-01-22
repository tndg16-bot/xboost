'use client';

import { useState } from 'react';

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
}

interface BrandTemplate {
  id: string;
  name: string;
  colors: ColorPalette;
  font: string;
  layout: string;
}

const colors = {
  'gray-50': '#F9FAFB',
  'gray-100': '#F3F4F6',
} as const;

// プリセットのブランドテンプレート
const PRESET_TEMPLATES: BrandTemplate[] = [
  {
    id: 'preset-1',
    name: '緑系・エコ',
    colors: {
      primary: '#22C55E',
      secondary: '#16A34A',
      accent: '#86EFAC',
      background: '#F0FDF4',
      text: '#14532D',
    },
    font: 'Noto Sans JP',
    layout: 'centered',
  },
  {
    id: 'preset-2',
    name: 'ブルー系・プロフェッショナル',
    colors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      accent: '#93C5FD',
      background: '#EFF6FF',
      text: '#1E3A8A',
    },
    font: 'Inter',
    layout: 'left-aligned',
  },
  {
    id: 'preset-3',
    name: 'オレンジ系・エネルギック',
    colors: {
      primary: '#F97316',
      secondary: '#EA580C',
      accent: '#FDBA74',
      background: '#FFF7ED',
      text: '#7C2D12',
    },
    font: 'Noto Sans JP',
    layout: 'modern',
  },
];

export const BrandTemplateManager: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customTemplate, setCustomTemplate] = useState<BrandTemplate>({
    id: 'custom',
    name: 'カスタムテンプレート',
    colors: {
      primary: '#3B82F6',
      secondary: '#2563EB',
      accent: '#93C5FD',
      background: '#FFFFFF',
      text: '#1F2937',
    },
    font: 'Inter',
    layout: 'centered',
  });
  const [previewText, setPreviewText] = useState('Xboostで発信をパワーアップ');

  const handleColorChange = (colorKey: keyof ColorPalette, value: string) => {
    setCustomTemplate({
      ...customTemplate,
      colors: {
        ...customTemplate.colors,
        [colorKey]: value,
      },
    });
  };

  const handleFontChange = (font: string) => {
    setCustomTemplate({
      ...customTemplate,
      font,
    });
  };

  const handleLayoutChange = (layout: string) => {
    setCustomTemplate({
      ...customTemplate,
      layout,
    });
  };

  const currentTemplate = selectedTemplate
    ? PRESET_TEMPLATES.find(t => t.id === selectedTemplate) || customTemplate
    : customTemplate;

  const handleSave = () => {
    console.log('Saving template:', currentTemplate);
    alert('ブランドテンプレートを保存しました！');
    // TODO: API call to save template
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors['gray-50'] }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">パーソナルブランドテンプレート</h1>
          <p className="text-sm text-gray-500 mt-1">
            一貫したビジュアルスタイルでサムネイルを生成
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Template Selection */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              テンプレート選択
            </h2>

            <div className="space-y-3">
              <button
                onClick={() => setSelectedTemplate(null)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTemplate === null
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">カスタム</div>
                <div className="text-sm text-gray-600 mt-1">
                  自分で色やフォントをカスタマイズ
                </div>
              </button>

              {PRESET_TEMPLATES.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        フォント: {template.font}
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.colors.primary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.colors.secondary }}
                      />
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: template.colors.accent }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {!selectedTemplate && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  カスタマイズ
                </h3>
                <div className="space-y-4">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      プライマリーカラー
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customTemplate.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTemplate.colors.primary}
                        onChange={(e) => handleColorChange('primary', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Secondary Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      セカンダリーカラー
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customTemplate.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTemplate.colors.secondary}
                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      アクセントカラー
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customTemplate.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTemplate.colors.accent}
                        onChange={(e) => handleColorChange('accent', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Background Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      背景色
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customTemplate.colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTemplate.colors.background}
                        onChange={(e) => handleColorChange('background', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Text Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      テキストカラー
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={customTemplate.colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={customTemplate.colors.text}
                        onChange={(e) => handleColorChange('text', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Font Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      フォント
                    </label>
                    <select
                      value={customTemplate.font}
                      onChange={(e) => handleFontChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Inter">Inter</option>
                      <option value="Noto Sans JP">Noto Sans JP</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                    </select>
                  </div>

                  {/* Layout Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      レイアウト
                    </label>
                    <select
                      value={customTemplate.layout}
                      onChange={(e) => handleLayoutChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="centered">中央揃え</option>
                      <option value="left-aligned">左揃え</option>
                      <option value="modern">モダン</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              プレビュー
            </h2>

            <div className="space-y-4">
              {/* Preview Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  テキスト
                </label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="プレビュー用テキスト"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Card Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="aspect-video flex items-center justify-center"
                  style={{
                    backgroundColor: currentTemplate.colors.background,
                    color: currentTemplate.colors.text,
                  }}
                >
                  <div
                    className={`text-2xl font-bold px-6 ${
                      currentTemplate.layout === 'centered'
                        ? 'text-center'
                        : currentTemplate.layout === 'left-aligned'
                        ? 'text-left'
                        : 'text-center'
                    }`}
                    style={{ fontFamily: currentTemplate.font }}
                  >
                    {previewText}
                  </div>
                </div>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: currentTemplate.colors.primary,
                    color: currentTemplate.colors.background,
                  }}
                >
                  <div className="text-sm font-medium">@username</div>
                  <div className="text-xs opacity-75">{currentTemplate.name}</div>
                </div>
              </div>

              {/* Color Palette Display */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  カラーパレット
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(currentTemplate.colors).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-full h-16 rounded"
                        style={{ backgroundColor: value }}
                      />
                      <div className="text-xs text-gray-500 mt-1">{key}</div>
                      <div className="text-xs text-gray-600 font-mono">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  テンプレートを保存
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 ブランドテンプレートの活用方法
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">一貫性の確保</h4>
              <p className="text-sm text-gray-700">
                同じ配色とフォントを使用することで、視認性とブランド認知を高めます
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">プロフェッショナル感</h4>
              <p className="text-sm text-gray-700">
                統一されたデザインはプロフェッショナルな印象を与えます
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">時間の節約</h4>
              <p className="text-sm text-gray-700">
                テンプレートを保存すれば、毎回ゼロからデザインする必要がありません
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
