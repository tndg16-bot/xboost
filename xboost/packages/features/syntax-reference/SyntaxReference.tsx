'use client';

import { useState } from 'react';
import { SYNTAX_TEMPLATES, SYNTAX_CATEGORIES, SyntaxTemplate } from './templates';

export interface SyntaxReferenceProps {
  onSelectTemplate: (template: string) => void;
}

export function SyntaxReference({ onSelectTemplate }: SyntaxReferenceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('すべて');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = ['すべて', ...SYNTAX_CATEGORIES];
  const filteredTemplates = selectedCategory === 'すべて'
    ? SYNTAX_TEMPLATES
    : SYNTAX_TEMPLATES.filter((t) => t.category === selectedCategory);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 px-4 py-12 font-sans dark:from-black dark:to-zinc-900">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            構文テンプレート
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            バズ投稿の構文パターンを学び、活用しよう
          </p>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              const favoriteTemplates = SYNTAX_TEMPLATES.filter((t) => favorites.has(t.id));
              const sortedFavorites = favoriteTemplates.sort((a, b) => {
                const aIndex = Array.from(favorites).indexOf(a.id);
                const bIndex = Array.from(favorites).indexOf(b.id);
                return aIndex - bIndex;
              });
              setSelectedCategory('お気に入り');
            }}
            className="rounded-full border-2 border-rose-500 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-400 dark:text-rose-400 dark:hover:bg-rose-950"
          >
            ★ お気に入り ({favorites.size})
          </button>
        </div>

        {selectedCategory === 'お気に入り' ? (
          <div className="grid gap-4 md:grid-cols-2">
            {SYNTAX_TEMPLATES.filter((t) => favorites.has(t.id)).map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={favorites.has(template.id)}
                onToggleFavorite={(e) => toggleFavorite(template.id, e)}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isFavorite={favorites.has(template.id)}
                onToggleFavorite={(e) => toggleFavorite(template.id, e)}
                onSelect={onSelectTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: SyntaxTemplate;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onSelect: (template: string) => void;
}

function TemplateCard({ template, isFavorite, onToggleFavorite, onSelect }: TemplateCardProps) {
  return (
    <div className="rounded-xl border-2 border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-teal-500 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500">
      <div className="mb-4 flex items-start justify-between">
        <span className="inline-flex rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
          {template.category}
        </span>
        <button
          onClick={onToggleFavorite}
          className="text-2xl hover:text-rose-600 dark:hover:text-rose-400"
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {template.name}
      </h3>
      <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
        {template.description}
      </p>

      <div className="mb-4 rounded-lg bg-zinc-50 p-3 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          テンプレート: {template.template}
        </p>
      </div>

      <div className="mb-4 rounded-lg border-l-4 border-zinc-300 bg-zinc-50 p-3 dark:border-zinc-600 dark:bg-zinc-900">
        <p className="text-sm italic text-zinc-700 dark:text-zinc-300">
          例: {template.example}
        </p>
      </div>

      <button
        onClick={() => onSelect(template.template)}
        className="w-full rounded-lg bg-teal-600 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-700 dark:hover:bg-teal-500"
      >
        使ってみる
      </button>
    </div>
  );
}
