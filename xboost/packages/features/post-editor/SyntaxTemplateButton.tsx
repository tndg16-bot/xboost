'use client';

import { useState, useEffect } from 'react';

export interface SyntaxTemplateButtonProps {
  onSelectTemplate: (template: string) => void;
}

type Category = 'all' | '断言型' | '問いかけ型' | '共感型' | '情報提供型' | '読み物型';

interface Template {
  id: string;
  name: string;
  category: Category;
  template: string;
  description: string;
}

const templates: Template[] = [
  // 断言型
  {
    id: 'assertion-1',
    name: '断言宣言',
    category: '断言型',
    template: '断言しますが、{内容}です。',
    description: '強い自信を持って意見を述べる',
  },
  {
    id: 'assertion-2',
    name: '絶対に',
    category: '断言型',
    template: '絶対に、{内容}。',
    description: '絶対的な表現で強調',
  },
  {
    id: 'assertion-3',
    name: '100%',
    category: '断言型',
    template: '100%、{内容}。',
    description: '数字で確信を表現',
  },
  // 問いかけ型
  {
    id: 'question-1',
    name: '意見を聞く',
    category: '問いかけ型',
    template: '{テーマ}だと思いますか？',
    description: '読者の意見を聞く',
  },
  {
    id: 'question-2',
    name: 'わかりますか',
    category: '問いかけ型',
    template: '{状況}、わかりますか？',
    description: '読者の同意を求める',
  },
  {
    id: 'question-3',
    name: '気づいていない',
    category: '問いかけ型',
    template: '{現象}に気づいていない人が多いんです。',
    description: '読者の気づきを促す',
  },
  // 共感型
  {
    id: 'empathy-1',
    name: '手を挙げて',
    category: '共感型',
    template: '{状況}な人、手を挙げて。',
    description: '共感を呼ぶ問いかけ',
  },
  {
    id: 'empathy-2',
    name: '一人は',
    category: '共感型',
    template: '一人は{状況}、もう一人は{状況2}。',
    description: '対比で共感を呼ぶ',
  },
  {
    id: 'empathy-3',
    name: '思ってる',
    category: '共感型',
    template: '{感情}って思っている人いませんか？',
    description: '感情に寄り添う',
  },
  // 情報提供型
  {
    id: 'info-1',
    name: '知っているか',
    category: '情報提供型',
    template: '{トピック}を知っていますか？',
    description: '知識の共有',
  },
  {
    id: 'info-2',
    name: '教えます',
    category: '情報提供型',
    template: '{トピック}について教えます。',
    description: '価値を提供する宣言',
  },
  {
    id: 'info-3',
    name: '驚きの事実',
    category: '情報提供型',
    template: '{トピック}について知ってました？衝撃なのですが、{事実}。',
    description: '驚きと価値の提供',
  },
  // 読み物型
  {
    id: 'story-1',
    name: '唐突に',
    category: '読み物型',
    template: '唐突ですが、{物語}。',
    description: '唐突な入りで惹きつける',
  },
  {
    id: 'story-2',
    name: '昨日あったこと',
    category: '読み物型',
    template: '昨日、{出来事}がありました。',
    description: '日常的なエピソード',
  },
  {
    id: 'story-3',
    name: '3年前',
    category: '読み物型',
    template: '3年前、{出来事}があったんです。',
    description: '過去のエピソード',
  },
];

const categories: Category[] = [
  'all',
  '断言型',
  '問いかけ型',
  '共感型',
  '情報提供型',
  '読み物型',
];

export function SyntaxTemplateButton({ onSelectTemplate }: SyntaxTemplateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('syntax-template-favorites');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFavorites(new Set(parsed));
      } catch (e) {
        console.error('Failed to load favorites', e);
      }
    }
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('syntax-template-favorites', JSON.stringify([...favorites]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([...favorites])]);

  const toggleFavorite = (templateId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(templateId)) {
      newFavorites.delete(templateId);
    } else {
      newFavorites.add(templateId);
    }
    setFavorites(newFavorites);
  };

  const filteredTemplates = templates.filter((template) => {
    // Filter by category
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;

    // Filter by search
    const searchMatch =
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by favorites
    const favoritesMatch = !showFavoritesOnly || favorites.has(template.id);

    return categoryMatch && searchMatch && favoritesMatch;
  });

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-800 hover:bg-teal-200 dark:bg-teal-900 dark:text-teal-200 dark:hover:bg-teal-800"
      >
        <span>📚</span>
        <span>構文テンプレート</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-96 rounded-xl border-2 border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
          <div className="p-4">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                📚 構文テンプレート
              </h3>
              {favorites.size > 0 && (
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    showFavoritesOnly
                      ? 'bg-rose-500 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  ⭐ お気に入り
                  {showFavoritesOnly && 'のみ'}
                </button>
              )}
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-4 w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-teal-500 dark:focus:bg-zinc-800"
            />

            {/* Categories */}
            <div className="mb-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    selectedCategory === category
                      ? 'bg-teal-500 text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
                  }`}
                >
                  {category === 'all' ? 'すべて' : category}
                </button>
              ))}
            </div>

            {/* Templates */}
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredTemplates.length === 0 ? (
                <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  該当するテンプレートがありません
                </p>
              ) : (
                filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTemplate(t.template);
                      setIsOpen(false);
                    }}
                    className="group w-full rounded-lg border-2 border-zinc-200 bg-zinc-50 px-3 py-2 text-left text-sm hover:border-teal-500 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-teal-500 dark:hover:bg-zinc-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-semibold text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                            {t.category}
                          </span>
                          <p className="font-medium text-zinc-900 dark:text-zinc-50">
                            {t.name}
                          </p>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400">
                          {t.template}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                          {t.description}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(t.id);
                        }}
                        className="flex-shrink-0 transition-transform hover:scale-110"
                      >
                        {favorites.has(t.id) ? '⭐' : '☆'}
                      </button>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
              <span>{filteredTemplates.length}件のテンプレート</span>
              {favorites.size > 0 && (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                    setShowFavoritesOnly(true);
                  }}
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                >
                  お気に入りを見る ({favorites.size})
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
