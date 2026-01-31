import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '構文リファレンス',
  description: 'X（Twitter）投稿の構文・記法リファレンス。改行、スレッド、引用、リプライ、ハッシュタグ、メンションの使い方を解説。',
  openGraph: {
    title: '構文リファレンス | Xboost',
    description: 'X投稿の構文・記法リファレンスガイド',
  },
};

interface SyntaxExample {
  title: string;
  description: string;
  example: string;
  tips: string[];
  icon: string;
}

const syntaxSections: { title: string; icon: string; examples: SyntaxExample[] }[] = [
  {
    title: '基本構文',
    icon: '🔤',
    examples: [
      {
        title: '改行の挿入',
        description: 'Enterキーで改行できます。読みやすさのため適度に改行しましょう。',
        example: '1行目の内容\n\n2行目の内容（空行あり）',
        tips: ['適度な改行で視認性向上', '空行を入れると段落が区切れます'],
        icon: '↩️',
      },
      {
        title: 'ハッシュタグ',
        description: '#を付けるとハッシュタグになります。関連するキーワードを付けましょう。',
        example: '今日も素晴らしい1日でした！ #朝活 #モーニングルーティン',
        tips: ['2-3個が適切', '日本語・英語どちらでもOK', 'スペースは使えません'],
        icon: '#️⃣',
      },
      {
        title: 'メンション',
        description: '@ユーザー名 で他のユーザーに通知が届きます。',
        example: '@xboost_now さんのツール、とても便利です！',
        tips: ['文頭に@があるとリプライ扱い', 'フォロワー外にも見える場合あり'],
        icon: '@️⃣',
      },
      {
        title: 'URLの共有',
        description: 'URLを貼り付けると自動でカード表示されます。',
        example: '参考記事です → https://example.com/article',
        tips: ['23文字以上は短縮表示', 'OGP画像が設定されていれば表示'],
        icon: '🔗',
      },
    ],
  },
  {
    title: 'スレッド',
    icon: '🧵',
    examples: [
      {
        title: 'スレッドの作り方',
        description: '複数の投稿を連結して長文を投稿できます。',
        example: '1/5 スレッド投稿の始まりです\n\nここに内容を書きます...',
        tips: ['「1/n」で何連投目か明示', '各投稿は280文字以内', '「↓」や「(続く)」で次への導線'],
        icon: '📝',
      },
      {
        title: 'スレッドの書式',
        description: '見やすいスレッドの書き方の例です。',
        example: '🧵スレッド: X運用のコツまとめ\n\n1/10 まずは基本から\n\n投稿の基本は「共感」と「価値提供」です。',
        tips: ['絵文字で視認性UP', '冒頭にスレッドの概要', '各投稿は完結した内容に'],
        icon: '📋',
      },
    ],
  },
  {
    title: '引用・リプライ',
    icon: '💬',
    examples: [
      {
        title: '引用リツイート',
        description: '他の投稿を引用してコメントを付けます。',
        example: '【引用RT】\n元の投稿がここに表示されます\n\n「本当にその通りですね！私も同じ体験をしました」',
        tips: ['引用元の投稿URLを貼り付け', '自分のコメントを追加', '批判的な引用は慎重に'],
        icon: '🔁',
      },
      {
        title: 'リプライ（返信）',
        description: '特定の投稿に返信します。',
        example: '@username 確かにそうですね！\n\n私の場合は...',
        tips: ['文頭に@があるとリプライ扱い', 'フォロワー外にも見える設定あり', 'リプライはフォロワーのTLに表示されない'],
        icon: '↩️',
      },
    ],
  },
  {
    title: 'メディア',
    icon: '📸',
    examples: [
      {
        title: '画像の添付',
        description: '1投稿につき最大4枚の画像を添付できます。',
        example: '[画像1] [画像2] [画像3] [画像4]\n\n画像の説明テキスト',
        tips: ['4枚まで添付可能', 'ALTテキストを設定推奨', '推奨サイズ: 1200x675px'],
        icon: '🖼️',
      },
      {
        title: '動画の添付',
        description: '動画を添付できます。',
        example: '[動画]\n\n動画の内容を説明するテキスト',
        tips: ['最大512MB', '最長2分20秒', '推奨: 720p以上'],
        icon: '🎬',
      },
    ],
  },
  {
    title: 'コツ・ベストプラクティス',
    icon: '💡',
    examples: [
      {
        title: '読みやすい投稿のコツ',
        description: 'エンゲージメントを上げる書き方。',
        example: '❌ 長文で改行なし\n⭕ 適度に改行して視認性UP',
        tips: ['一文は30文字以内', '段落は3-4行で区切る', '絵文字で視認性向上'],
        icon: '✨',
      },
      {
        title: 'CTA（行動喚起）',
        description: '読者にアクションを促す。',
        example: '「いいねとRTで応援してください！」\n「コメントでご意見をお聞かせください」',
        tips: ['1投稿にCTAは1つまで', '具体的なアクションを指示', '自然な流れで入れる'],
        icon: '🎯',
      },
      {
        title: '絵文字の使い方',
        description: '視認性と印象を上げる絵文字活用。',
        example: '📌 重要ポイント\n💡 ヒント・アイデア\n⚠️ 注意点',
        tips: ['過度な使用は避ける', 'テーマに応じた絵文字選択', '絵文字で区切りを作る'],
        icon: '😊',
      },
    ],
  },
];

export default function SyntaxReferencePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">📚 構文リファレンス</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            X（Twitter）投稿の構文・記法リファレンス。
            読みやすく、エンゲージメントの高い投稿を作成するためのガイドです。
          </p>
        </div>

        {/* ナビゲーション */}
        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          {syntaxSections.map((section) => (
            <a
              key={section.title}
              href={`#${section.title}`}
              className="px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {section.icon} {section.title}
            </a>
          ))}
        </nav>

        {/* セクション */}
        <div className="space-y-8">
          {syntaxSections.map((section) => (
            <section
              key={section.title}
              id={section.title}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <span className="text-2xl">{section.icon}</span>
                  {section.title}
                </h2>
              </div>

              <div className="p-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {section.examples.map((example, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="text-2xl">{example.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">{example.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{example.description}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                          {example.example}
                        </pre>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                          💡 Tips
                        </h4>
                        <ul className="space-y-1">
                          {example.tips.map((tip, tipIndex) => (
                            <li
                              key={tipIndex}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-blue-500 mt-1">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        {/* クイックリンク */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">🎯 次のステップ</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <a
              href="/post-editor"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-3xl mb-2">✍️</div>
              <h3 className="font-semibold mb-1">投稿エディタを開く</h3>
              <p className="text-sm text-white/80">実際に投稿を作成して構文を練習</p>
            </a>

            <a
              href="/ai-rewrite"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-semibold mb-1">AIで改善</h3>
              <p className="text-sm text-white/80">AIが投稿を分析して改善提案</p>
            </a>

            <a
              href="/scheduling"
              className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-colors text-center"
            >
              <div className="text-3xl mb-2">📅</div>
              <h3 className="font-semibold mb-1">予約投稿</h3>
              <p className="text-sm text-white/80">スケジュール管理で継続的運用</p>
            </a>
          </div>
        </div>

        {/* タグ */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {['X運用', '構文', 'リファレンス', 'スレッド', '引用RT', 'リプライ', 'ハッシュタグ', 'メンション'].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
