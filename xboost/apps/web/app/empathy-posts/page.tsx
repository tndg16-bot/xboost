'use client';

import { useState } from 'react';

interface EmpathyTemplate {
  id: string;
  category: string;
  title: string;
  template: string;
  placeholder: string[];
  example: string;
  engagementTips: string[];
}

const EMPATHY_CATEGORIES = [
  {
    id: 'shared-experience',
    label: '共通体験',
    description: '読み手が自分ごと感じる体験を共有',
    color: 'blue',
  },
  {
    id: 'vulnerability',
    label: '弱さの共有',
    description: '失敗や課題について正直に語る',
    color: 'purple',
  },
  {
    id: 'understanding',
    label: '理解・共感',
    description: '読み手の気持ちを理解し共感を示す',
    color: 'green',
  },
  {
    id: 'support',
    label: 'サポート・励まし',
    description: '読み手を励ます感謝を伝える',
    color: 'orange',
  },
  {
    id: 'learning',
    label: '学びの共有',
    description: '失敗から学んだことを共有',
    color: 'teal',
  },
] as const;

const TEMPLATES: EmpathyTemplate[] = [
  {
    id: 'shared-experience-1',
    category: 'shared-experience',
    title: 'みんなもこんなことあるよね',
    template: '【共有】{topic}について。\n\nこういうこと、ありますよね？\n\n{personal_story}\n\n同じような経験ある方、コメントで教えてください！\n\n#共通体験 #{hashtag}',
    placeholder: ['topic（テーマ）', 'personal_story（自分の経験）', 'hashtag（ハッシュタグ）'],
    example: '【共有】遅刻について。\n\nこういうこと、ありますよね？\n\n昨日朝起きたらスマホのアラームが鳴らなくて、大慌てて出勤しました。結局遅刻しちゃって...😅\n\n同じような経験ある方、コメントで教えてください！\n\n#共通体験 #遅刻',
    engagementTips: [
      '読み手が「あるある！」と思える具体的なエピソードを入れる',
      '絵文字を効果的に使用して親しみやすくする',
      '質問でコメントを促す',
    ],
  },
  {
    id: 'vulnerability-1',
    category: 'vulnerability',
    title: '正直に言います...',
    template: '【告白】{topic}について。\n\n正直に言います。{vulnerable_statement}\n\nこんなことあるの、私だけじゃないよね？\n\n誰か同じことあるなら、声かけてください😊\n\n#告白 #相談 #{hashtag}',
    placeholder: ['topic（テーマ）', 'vulnerable_statement（正直な発言）', 'hashtag（ハッシュタグ）'],
    example: '【告白】仕事のプレッシャーについて。\n\n正直に言います。たまに「もう無理...」って思っちゃう🥹\n\nこんなことあるの、私だけじゃないよね？\n\n誰か同じことあるなら、声かけてください😊\n\n#告白 #相談 #仕事',
    engagementTips: [
      '弱さを認めることで信頼性を高める',
      '「私だけ」ではないと示して読み手を安心させる',
      '共感を得るための質問を含める',
    ],
  },
  {
    id: 'understanding-1',
    category: 'understanding',
    title: 'みんな大変だよね',
    template: '【理解】{topic}について。\n\n状況：{situation}\n\nみんな大変だよね💦\n\nでもこう考えたら少し楽になるかも👇\n{positive_perspective}\n\n一緒に乗り越えていきましょう！\n\n#共感 #応援 #{hashtag}',
    placeholder: ['topic（テーマ）', 'situation（状況）', 'positive_perspective（前向きな視点）', 'hashtag（ハッシュタグ）'],
    example: '【理解】仕事の忙しさについて。\n\n状況：今仕事立て込んでて、全然休めない😅\n\nみんな大変だよね💦\n\nでもこう考えたら少し楽になるかも👇\n「今は経験値を溜めてる時期」って考える！\n\n一緒に乗り越えていきましょう！\n\n#共感 #応援 #仕事',
    engagementTips: [
      '読み手の状況を正確に理解していることを示す',
      '前向きな視点を提案する',
      '一緒に乗り越える姿勢を見せる',
    ],
  },
  {
    id: 'support-1',
    category: 'support',
    title: '応援メッセージ',
    template: '【応援】{topic}頑張る人たちへ。\n\n知ってる？{supportive_message}\n\nだから大丈夫！応援してます💪\n\n一緒に頑張りましょう！\n\n#応援 #エール #{hashtag}',
    placeholder: ['topic（テーマ）', 'supportive_message（励ましのメッセージ）', 'hashtag（ハッシュタグ）'],
    example: '【応援】新規開業頑張る人たちへ。\n\n知ってる？最初は誰でも不安なこと😊\n\nだから大丈夫！応援してます💪\n\n一緒に頑張りましょう！\n\n#応援 #エール #開業',
    engagementTips: [
      '読み手の不安を理解していることを示す',
      '励ましの言葉を伝える',
      '「一緒に頑張ろう」という姿勢を見せる',
    ],
  },
  {
    id: 'learning-1',
    category: 'learning',
    title: '失敗から学んだこと',
    template: '【教訓】{failure}失敗から学んだこと。\n\n失敗内容：{failure_details}\n\nそこから学んだのは「{lesson}」\n\nこれからはこうする！👇\n{action_plan}\n\n誰か似たようなことある？\n\n#教訓 #学び #{hashtag}',
    placeholder: ['failure（失敗）', 'failure_details（失敗内容）', 'lesson（学び）', 'action_plan（今後のアクション）', 'hashtag（ハッシュタグ）'],
    example: '【教訓】SNS運用の失敗から学んだこと。\n\n失敗内容：投稿回数減らしたらインプレッション減った💦\n\nそこから学んだのは「継続が一番大事」\n\nこれからはこうする！👇\n「毎日最低1回は投稿する」\n\n誰か似たようなことある？\n\n#教訓 #学び #SNS運用',
    engagementTips: [
      '失敗を素直に認める',
      'そこから学んだ教訓を明確にする',
      '今後の改善案を具体的に示す',
    ],
  },
];

function getCategoryColor(color: string): string {
  const colors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  };
  return colors[color] || 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
}

export default function EmpathyPostsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<EmpathyTemplate | null>(null);
  const [customValues, setCustomValues] = useState<Record<string, string>>({});
  const [previewText, setPreviewText] = useState('');

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedTemplate(null);
    setCustomValues({});
    setPreviewText('');
  };

  const handleSelectTemplate = (template: EmpathyTemplate) => {
    setSelectedTemplate(template);
    setCustomValues({});
    setPreviewText('');
  };

  const handleValueChange = (placeholder: string, value: string) => {
    setCustomValues(prev => ({ ...prev, [placeholder]: value }));
    generatePreview();
  };

  const generatePreview = () => {
    if (!selectedTemplate) return;

    let text = selectedTemplate.template;
    selectedTemplate.placeholder.forEach(placeholder => {
      const key = placeholder.split('（')[0];
      text = text.replace(`{${key}}`, customValues[key] || placeholder);
    });
    setPreviewText(text);
  };

  const handleCopy = () => {
    if (previewText) {
      navigator.clipboard.writeText(previewText);
      alert('テンプレートをコピーしました！');
    }
  };

  const templatesByCategory = selectedCategory
    ? TEMPLATES.filter(t => t.category === selectedCategory)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            共感系ポスト作成支援
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            読み手の心に響く、共感を生むポストを作成するためのテンプレート
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                カテゴリを選択
              </h2>

              <div className="space-y-2">
                {EMPATHY_CATEGORIES.map(category => (
                  <button
                    key={category.id}
                    onClick={() => handleSelectCategory(category.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {category.label}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {category.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(
                        category.color
                      )}`}>
                        {category.id === 'shared-experience' && '共有'}
                        {category.id === 'vulnerability' && '弱さ'}
                        {category.id === 'understanding' && '理解'}
                        {category.id === 'support' && '応援'}
                        {category.id === 'learning' && '学び'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {selectedCategory && (
              <>
                <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    テンプレートを選択
                  </h2>

                  {templatesByCategory.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      テンプレートがありません
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {templatesByCategory.map(template => (
                        <button
                          key={template.id}
                          onClick={() => handleSelectTemplate(template)}
                          className={`text-left p-4 rounded-lg border transition-all ${
                            selectedTemplate?.id === template.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                            {template.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                            {template.example.substring(0, 80)}...
                          </p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedTemplate && (
                  <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      カスタマイズ
                    </h2>

                    <div className="space-y-4">
                      {selectedTemplate.placeholder.map(placeholder => {
                        const key = placeholder.split('（')[0];
                        return (
                          <div key={key}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                              {placeholder}
                            </label>
                            <textarea
                              value={customValues[key] || ''}
                              onChange={e => handleValueChange(placeholder, e.target.value)}
                              placeholder={`ここに${key}を入力...`}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                            />
                          </div>
                        );
                      })}
                    </div>

                    {selectedTemplate.engagementTips && (
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          エンゲージメントを上げるヒント
                        </h3>
                        <ul className="space-y-1.5">
                          {selectedTemplate.engagementTips.map((tip, index) => (
                            <li
                              key={index}
                              className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {previewText && (
                  <div className="bg-white rounded-lg p-6 shadow-sm dark:bg-gray-800">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        プレビュー
                      </h2>
                      <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                          />
                        </svg>
                        コピー
                      </button>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                        {previewText}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}

            {!selectedCategory && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                <svg
                  className="h-16 w-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  カテゴリを選択
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  左のカテゴリから、作成したいポストの種類を選択してください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
