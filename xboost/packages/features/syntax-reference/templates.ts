export interface SyntaxTemplate {
  id: string;
  category: string;
  name: string;
  description: string;
  template: string;
  example: string;
  isFavorite?: boolean;
}

export const SYNTAX_CATEGORIES = [
  '断言型',
  '問いかけ型',
  '共感型',
  '情報提供型',
  '読み物型',
] as const;

export const SYNTAX_TEMPLATES: SyntaxTemplate[] = [
  {
    id: 'assertion-1',
    category: '断言型',
    name: '断言宣言',
    description: '意見をはっきり述べるスタイル',
    template: '断言しますが、{内容}です。',
    example: '断言しますが、AIはただのツールです。本質は人間の判断です。',
  },
  {
    id: 'assertion-2',
    category: '断言型',
    name: '体験談断言',
    description: '自分の経験を断定するスタイル',
    template: '私が{期間}{行動}した結果、{結果}がわかりました。',
    example: '私が3ヶ月毎日投稿した結果、フォロワーは増えるがエンゲージメントが変わらないことがわかりました。',
  },
  {
    id: 'question-1',
    category: '問いかけ型',
    name: '意見を聞く',
    description: '読者の意見を引き出すスタイル',
    template: '{テーマ}だと思いますか？',
    example: 'AIが人間の仕事を奪うと思いますか？',
  },
  {
    id: 'question-2',
    category: '問いかけ型',
    name: '選択を迫る',
    description: '二択で意見を聞くスタイル',
    template: '{選択肢A}派か{選択肢B}派どっち？',
    example: '早起き派か夜更かし派どっち？',
  },
  {
    id: 'empathy-1',
    category: '共感型',
    name: '共感を呼ぶ',
    description: '読者の感情に訴えるスタイル',
    template: '{状況}な人、手を挙げて。',
    example: '毎日投稿してるけど、イマイチ伸びない人、手を挙げて。',
  },
  {
    id: 'empathy-2',
    category: '共感型',
    name: '悩み共感',
    description: '読者の悩みに寄り添うスタイル',
    template: '〜という悩み、実は{自分の経験}。',
    example: '「フォロワーが増えない」という悩み、実は私も半年間悩んでいました。',
  },
  {
    id: 'info-1',
    category: '情報提供型',
    name: '知っているか',
    description: '知識を提供するスタイル',
    template: '{トピック}を知っていますか？',
    example: 'Xのアルゴリズムで優遇される投稿時間を知っていますか？',
  },
  {
    id: 'info-2',
    category: '情報提供型',
    name: '裏情報',
    description: '意外な情報を提供するスタイル',
    template: '{トピック}の裏側を教えます。',
    example: '発信者だけが知っているインプレッション爆増の裏側を教えます。',
  },
  {
    id: 'story-1',
    category: '読み物型',
    name: '唐突に',
    description: '突然物語を始めるスタイル',
    template: '唐突ですが、{物語}。',
    example: '唐突ですが、昨日出会った社長の言葉が刺さりました。',
  },
  {
    id: 'story-2',
    category: '読み物型',
    name: '数字で語る',
    description: '数字を交えて語るスタイル',
    template: '{数字}{単位}の話。',
    example: '3週間で1,000万インプレッションの話。',
  },
];
