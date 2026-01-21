export type TopicCategory = 'ホンネで書き出す' | '逆張り' | '共感';

export type TopicSuggestion = {
  id: string;
  category: TopicCategory;
  title: string;
  description: string;
  engagementPotential: 'high' | 'medium' | 'low';
  examplePost: string;
  tags: string[];
};

export type TrendTopic = {
  id: string;
  topic: string;
  trendingScore: number;
  relatedPosts: number;
  avgImpressions: number;
  category: TopicCategory;
  timeframe: '24h' | '7d' | '30d';
};

export type WritingFeedback = {
  id: string;
  rule: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestion?: string;
};

export type PastPostInsight = {
  id: string;
  content: string;
  impressions: number;
  engagementRate: number;
  topic: string;
  category: TopicCategory;
  date: string;
  successFactors: string[];
};

// Mock data: 15 topic suggestions across 3 categories (5 per category)
export const topicSuggestions: TopicSuggestion[] = [
  // ホンネで書き出す (Write from the heart)
  {
    id: 'hon-1',
    category: 'ホンネで書き出す',
    title: '失敗から学んだ教訓を公開する',
    description: '最近の失敗経験をシェアし、そこから得た学びを伝えることで信頼を築く',
    engagementPotential: 'high',
    examplePost: '先月プロダクトのリリースに失敗した。売上が0円だった。でもこの失敗が私を変えた。\n\n教訓1：完璧を求めすぎるな\n教訓2：早めにフィードバックを得ろ\n\n失敗こそが最高の先生。',
    tags: ['失敗', '学び', '成長']
  },
  {
    id: 'hon-2',
    category: 'ホンネで書き出す',
    title: '今の悩みを正直に話す',
    description: '悩みを共有することで、同じ悩みを持つ人とつながる',
    engagementPotential: 'high',
    examplePost: '正直に言うと、最近焦りがある。\n\nフォロワー数は増えているのに、ビジネスへの転換率が悪い。\n\n何を改善すべきか？\n\n皆さんはどうやって収益化に成功しましたか？',
    tags: ['悩み', '相談', 'リアル']
  },
  {
    id: 'hon-3',
    category: 'ホンネで書き出す',
    title: '仕事と私生活のバランスについて',
    description: '働き方や生活のバランスについて率直に語る',
    engagementPotential: 'medium',
    examplePost: '去年は週7日仕事してた。でも今年は変えた。\n\n土日は完全にオフに。\n\n驚くことに、生産性が上がった。\n\n休むことはサボりじゃない。戦略だ。',
    tags: ['ワークライフバランス', '生産性']
  },
  {
    id: 'hon-4',
    category: 'ホンネで書き出す',
    title: '自分の弱さを認める',
    description: '自身の弱点や苦手を開示することで親近感を高める',
    engagementPotential: 'medium',
    examplePost: '実は私、人前で話すのが超苦手。\n\nでもだからこそ、毎日Xで発信してる。\n\n苦手なことこそ続ける価値がある。\n\nさあ、あなたの「苦手」は何？',
    tags: ['自己開示', '成長']
  },
  {
    id: 'hon-5',
    category: 'ホンネで書き出す',
    title: '価値観の変遷を語る',
    description: '過去と現在の価値観の変化を共有する',
    engagementPotential: 'medium',
    examplePost: '3年前と今では、全く価値観が違う。\n\n3年前：稼ぐこと最優先\n今：影響を与えること最優先\n\nお金は結果としてついてくる。\n\n「何のために」こそが重要。',
    tags: ['価値観', '変化']
  },
  // 逆張り (Counter-intuitive/contrarian)
  {
    id: 'gyaku-1',
    category: '逆張り',
    title: '朝活は不要論',
    description: '早起きこそ正義という風潮に疑問を投げかける',
    engagementPotential: 'high',
    examplePost: '「朝活しろ」って言うのやめろ。\n\n私、夜型だ。\n\n深夜2時から6時までが一番集中できる。\n\n重要なのは「いつやるか」じゃない。\n\n「自分のリズムでやるか」だ。',
    tags: ['逆説', '個性', '生産性']
  },
  {
    id: 'gyaku-2',
    category: '逆張り',
    title: '読書量よりもアウトプット量',
    description: 'インプット偏重ではなくアウトプットの重要性を説く',
    engagementPotential: 'high',
    examplePost: '年間100冊読む必要ない。\n\n1冊読んで100回アウトプットする方が、100倍価値がある。\n\n知識は使って初めて知識になる。\n\n読むな。書け。',
    tags: ['アウトプット', '実践']
  },
  {
    id: 'gyaku-3',
    category: '逆張り',
    title: '目標設定は逆効果の場合がある',
    description: '目標達成プレッシャーの弊害を指摘する',
    engagementPotential: 'medium',
    examplePost: '「1ヶ月で1万人フォロワー」って目標、やめた方がいい。\n\n目標を達成できなかった時の挫折感で、発信辞める人多い。\n\n数値目標より、楽しむことを目標にしろ。',
    tags: ['目標設定', 'マインドセット']
  },
  {
    id: 'gyaku-4',
    category: '逆張り',
    title: '専門性よりも汎用性',
    description: 'ニッチ専門特化よりも汎用的なスキルの価値を説く',
    engagementPotential: 'medium',
    examplePost: '「極めろ」って言うけど、実は「広げろ」も大事。\n\n市場が変われば、ニッチ専門は消える。\n\n応用のきく汎用スキルこそが、長期的な武器になる。',
    tags: ['キャリア', 'スキル']
  },
  {
    id: 'gyaku-5',
    category: '逆張り',
    title: '完璧主義を捨てろ',
    description: '「ちゃんとやる」マインドの弊害を訴える',
    engagementPotential: 'high',
    examplePost: '完璧主義は最悪の敵だ。\n\n「ちゃんとやろう」が「やらない言い訳」になる。\n\n60点でいい。まず終わらせろ。\n\n完璧なんてない。あるのは「終わったかどうか」だけ。',
    tags: ['実行', 'マインドセット']
  },
  // 共感 (Empathy/relatable)
  {
    id: 'kyo-1',
    category: '共感',
    title: '「何もやる気が出ない」時の対処法',
    description: 'モチベーションが低下した時の乗り切り方をシェア',
    engagementPotential: 'high',
    examplePost: '今日、何もしたくない。\n\nだから言う。「今日やること」は1つだけ。\n\n小さすぎるタスクでいい。\n\n朝起きて、コーヒー1杯飲むだけでOK。\n\n1つできれば、あとは勝手に動ける。',
    tags: ['モチベーション', '対処法']
  },
  {
    id: 'kyo-2',
    category: '共感',
    title: '孤独感との向き合い方',
    description: 'クリエイティブな孤独の共有と対処',
    engagementPotential: 'medium',
    examplePost: '一人で作業するのが好き。\n\nでもたまに寂しい。\n\nそんな時はXでつぶやく。\n\n同じ時間に、どこかで誰かが読んでる。\n\nそれだけで十分。',
    tags: ['孤独', '繋がり']
  },
  {
    id: 'kyo-3',
    category: '共感',
    title: '誰もが通る壁',
    description: '挫折や停滞期は誰にでもあることを伝える',
    engagementPotential: 'high',
    examplePost: '伸び悩んでる？\n\nあの有名な人も通った道だ。\n\n停滞期こそが、次のレベルへ行く準備期間。\n\n諦めないで。ただ続けるだけでいい。',
    tags: ['停滞期', '励まし']
  },
  {
    id: 'kyo-4',
    category: '共感',
    title: '他人の成功を見て焦る気持ち',
    description: '比較による焦りを共感する投稿',
    engagementPotential: 'high',
    examplePost: '他人の成功を見て焦る。\n\n「なんで自分は...」\n\nでも気づいた。他人のタイムラインと自分のを比べても無駄。\n\n大事なのは「昨日の自分より進んでるか」だけ。',
    tags: ['焦り', '比較']
  },
  {
    id: 'kyo-5',
    category: '共感',
    title: '小さな幸せを見つける',
    description: '日常の小さな喜びを共有する',
    engagementPotential: 'medium',
    examplePost: '今日の小さな幸せ。\n\n・朝のコーヒーが美味しかった\n・いいねが1つ増えた\n・予定より早く仕事が終わった\n\n幸せは、気づく人にだけ見える。',
    tags: ['幸福感', '日常']
  }
];

// Trending topics from past analysis
export const trendingTopics: TrendTopic[] = [
  {
    id: 'trend-1',
    topic: '失敗談と学び',
    trendingScore: 95,
    relatedPosts: 24,
    avgImpressions: 185000,
    category: 'ホンネで書き出す',
    timeframe: '7d'
  },
  {
    id: 'trend-2',
    topic: '生産性hack',
    trendingScore: 88,
    relatedPosts: 18,
    avgImpressions: 142000,
    category: '逆張り',
    timeframe: '7d'
  },
  {
    id: 'trend-3',
    topic: '悩み相談・シェア',
    trendingScore: 85,
    relatedPosts: 15,
    avgImpressions: 128000,
    category: 'ホンネで書き出す',
    timeframe: '24h'
  },
  {
    id: 'trend-4',
    topic: '停滞期の乗り越え方',
    trendingScore: 82,
    relatedPosts: 12,
    avgImpressions: 112000,
    category: '共感',
    timeframe: '30d'
  },
  {
    id: 'trend-5',
    topic: '逆説的な視点',
    trendingScore: 78,
    relatedPosts: 10,
    avgImpressions: 98000,
    category: '逆張り',
    timeframe: '7d'
  }
];

// Past post insights for analysis
export const pastPostInsights: PastPostInsight[] = [
  {
    id: 'past-1',
    content: '先月プロダクトのリリースに失敗した。売上が0円だった。でもこの失敗が私を変えた。',
    impressions: 245000,
    engagementRate: 7.8,
    topic: '失敗談と学び',
    category: 'ホンネで書き出す',
    date: '2025-10-15',
    successFactors: ['正直な自己開示', '教訓を含めている', '短く伝わる文章']
  },
  {
    id: 'past-2',
    content: '「朝活しろ」って言うのやめろ。私、夜型だ。深夜2時から6時までが一番集中できる。',
    impressions: 312000,
    engagementRate: 7.2,
    topic: '逆説的な視点',
    category: '逆張り',
    date: '2025-11-08',
    successFactors: ['反骨精神', '具体的なエピソード', '意見の明確な提示']
  },
  {
    id: 'past-3',
    content: '伸び悩んでる？あの有名な人も通った道だ。停滞期こそが、次のレベルへの準備期間。',
    impressions: 198000,
    engagementRate: 6.6,
    topic: '停滞期の乗り越え方',
    category: '共感',
    date: '2025-10-28',
    successFactors: ['共感の呼びかけ', '励ましのメッセージ', '読み手への配慮']
  }
];

// Writing feedback rules
export const getWritingFeedback = (content: string): WritingFeedback[] => {
  const feedback: WritingFeedback[] = [];

  // Check first line length
  const firstLine = content.split('\n')[0];
  if (firstLine.length > 50) {
    feedback.push({
      id: 'fb-1',
      rule: 'first_line_length',
      severity: 'warning',
      message: '1行目が長いです（50文字以内が推奨）',
      suggestion: '1行目を短くして、興味を引きつけましょう'
    });
  }

  // Check for empty content
  if (!content.trim()) {
    feedback.push({
      id: 'fb-2',
      rule: 'empty_content',
      severity: 'error',
      message: '投稿内容が空です'
    });
  }

  // Check for hashtag usage
  const hashtagCount = (content.match(/#/g) || []).length;
  if (hashtagCount === 0) {
    feedback.push({
      id: 'fb-3',
      rule: 'no_hashtags',
      severity: 'info',
      message: 'ハッシュタグがありません',
      suggestion: '関連するハッシュタグを追加すると、より見つけられやすくなります'
    });
  } else if (hashtagCount > 3) {
    feedback.push({
      id: 'fb-4',
      rule: 'too_many_hashtags',
      severity: 'warning',
      message: `ハッシュタグが多すぎます（${hashtagCount}個）`,
      suggestion: 'ハッシュタグは2-3個程度に絞りましょう'
    });
  }

  // Check for line breaks
  const lineBreaks = content.split('\n').length;
  if (lineBreaks === 1 && content.length > 100) {
    feedback.push({
      id: 'fb-5',
      rule: 'no_line_breaks',
      severity: 'info',
      message: '改行がありません',
      suggestion: '適度に改行を入れると読みやすくなります'
    });
  }

  // Check content length
  if (content.length > 280) {
    feedback.push({
      id: 'fb-6',
      rule: 'content_too_long',
      severity: 'warning',
      message: '文字数が多いです（280文字超え）',
      suggestion: 'スレッド化を検討するか、内容を整理しましょう'
    });
  }

  return feedback;
};

// Get topics by category
export const getTopicsByCategory = (category: TopicCategory): TopicSuggestion[] => {
  return topicSuggestions.filter(topic => topic.category === category);
};

// Get high engagement topics
export const getHighEngagementTopics = (): TopicSuggestion[] => {
  return topicSuggestions.filter(topic => topic.engagementPotential === 'high');
};

// Get trending topics by timeframe
export const getTrendingTopicsByTimeframe = (timeframe: '24h' | '7d' | '30d'): TrendTopic[] => {
  return trendingTopics.filter(topic => topic.timeframe === timeframe);
};
