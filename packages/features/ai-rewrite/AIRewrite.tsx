'use client';

import { useState } from 'react';

interface AIRewriteProps {
  content: string;
  onRewrite: (rewrittenContent: string) => void;
}

export function AIRewrite({ content, onRewrite }: AIRewriteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const rewriteOptions = [
    { id: 'more-engaging', label: 'より魅力的に', description: 'エンゲージメントを増やすための表現に変換' },
    { id: 'more-concise', label: 'より簡潔に', description: '要点を絞って短くする' },
    { id: 'more-emotional', label: 'より感情的に', description: '共感を呼ぶ表現を加える' },
    { id: 'more-professional', label: 'より専門的に', description: '専門用語やフォーマルな表現に' },
    { id: 'more-casual', label: 'よりカジュアルに', description: '親しみやすい表現に変換' },
    { id: 'more-urgent', label: 'より緊急性を', description: '行動を促す表現に強化' },
  ];

  const handleRewrite = async (option: string) => {
    if (!content.trim()) return;

    setLoading(true);
    setSelectedOption(option);

    try {
      // TODO: Implement actual AI rewrite API call
      // For now, simulate API call with mock response
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock rewritten content based on option
      let rewrittenContent = content;

      switch (option) {
        case 'more-engaging':
          rewrittenContent = `🔥 ${content}\n\nみなさんどう思いますか？`;
          break;
        case 'more-concise':
          rewrittenContent = content.split('\n').filter(line => line.trim()).join(' ').substring(0, content.length * 0.7);
          break;
        case 'more-emotional':
          rewrittenContent = `😭 ${content}\n\nこれ、本当に大切だと思う...`;
          break;
        case 'more-professional':
          rewrittenContent = `【重要】${content}\n\n詳細はリンク先をご確認ください。`;
          break;
        case 'more-casual':
          rewrittenContent = content.replace(/です/g, 'だ').replace(/ます/g, 'る').replace(/。/g, '！');
          break;
        case 'more-urgent':
          rewrittenContent = `⚡️ 今すぐチェック！\n\n${content}\n\nお見逃しなく！`;
          break;
        default:
          rewrittenContent = content;
      }

      onRewrite(rewrittenContent);
      setIsOpen(false);
    } catch (error) {
      console.error('Rewrite failed:', error);
    } finally {
      setLoading(false);
      setSelectedOption('');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors font-medium"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
        AIリライト
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-4">
            <h3 className="font-semibold text-lg mb-3">リライトオプション</h3>
            <div className="space-y-2">
              {rewriteOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleRewrite(option.id)}
                  disabled={loading}
                  className={`w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all ${
                    loading && selectedOption === option.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{option.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                    </div>
                    {loading && selectedOption === option.id && (
                      <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            {!content.trim() && (
              <div className="mt-4 text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                テキストを入力してからリライトを選択してください
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
