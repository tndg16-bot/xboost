export interface FollowerBasedSuggestion {
  id: string;
  followerRange: string;
  title: string;
  description: string;
  templates: string[];
  postingFrequency: string;
  bestPractices: string[];
}

export interface FollowerAnalysis {
  currentRange: string;
  suggestions: FollowerBasedSuggestion[];
  nextMilestone?: string;
  tips: string[];
}

export const FOLLOWER_RANGES = {
  beginner: {
    label: '初心者 (0〜1,000フォロワー)',
    range: '0-1000',
    color: 'blue',
  },
  intermediate: {
    label: '中級者 (1,000〜10,000フォロワー)',
    range: '1000-10000',
    color: 'green',
  },
  advanced: {
    label: '上級者 (10,000〜50,000フォロワー)',
    range: '10000-50000',
    color: 'orange',
  },
  expert: {
    label: '専門家 (50,000+フォロワー)',
    range: '50000+',
    color: 'purple',
  },
} as const;

const SUGGESTIONS: Record<string, FollowerBasedSuggestion> = {
  beginner: {
    id: 'beginner',
    followerRange: '0-1000',
    title: 'まずはコネクション作り',
    description: 'アカウントの信頼を築き、ターゲット層との関係を構築する段階です。',
    templates: [
      '【紹介】はじめまして！〇〇分野で情報発信を始めました。よろしくお願いします！\n\n#はじめまして #〇〇',
      '【質問】〇〇について、皆さんはどう考えていますか？\n\nコメントで教えていただけると嬉しいです！\n\n#質問 #〇〇',
      '【共有】今日学んだこと：〇〇についてまとめてみました。\n\nコメントで感想やご意見をお待ちしています！\n\n#学び #知識共有',
    ],
    postingFrequency: '1日1〜2回',
    bestPractices: [
      '他者への返信やいいねを積極的に行う',
      '質問型投稿でコメントを促す',
      '自己紹介を充実させる',
      '一貫したトーンで投稿する',
    ],
  },
  intermediate: {
    id: 'intermediate',
    followerRange: '1000-10000',
    title: '価値提供と成長',
    description: '自分の専門性を示しながら、フォロワーのニーズに応える段階です。',
    templates: [
      '【実践】〇〇の実践記録3日目。\n\n成果：〇〇\n学び：〇〇\n\n明日は〇〇に挑戦します！\n\n#実践記録 #成長記録',
      '【比較】〇〇vs〇〇、どちらがおすすめ？\n\n〇〇のメリット：〇〇\n〇〇のメリット：〇〇\n\n#比較 #おすすめ',
      '【ノウハウ】〇〇のやり方を解説します。\n\n1. 〇〇\n2. 〇〇\n3. 〇〇\n\nこれで誰でも簡単にできます！\n\n#ノウハウ #解説',
    ],
    postingFrequency: '1日2〜3回',
    bestPractices: [
      '専門知識を活かした投稿を増やす',
      'スレッド（連投）を活用する',
      '統計やデータを含める',
      'CTA（行動喚起）を明確にする',
    ],
  },
  advanced: {
    id: 'advanced',
    followerRange: '10000-50000',
    title: '影響力拡大',
    description: 'より多くの人に届けつつ、コミュニティ形成を深める段階です。',
    templates: [
      '【視点】〇〇について考えてみた。\n\n従来の考え方：〇〇\n新しい視点：〇〇\n\n#視点 #新しい価値観',
      '【議論】〇〇について議論しましょう。\n\n前提：〇〇\n\n私は〜〜と思います。皆さんは？\n\n#議論 #思考実験',
      '【予測】2025年の〇〇はどうなる？\n\n予測1：〇〇\n予測2：〇〇\n\n1年後に検証します！\n\n#予測 #未来',
    ],
    postingFrequency: '1日3〜5回',
    bestPractices: [
      '独自の視点や予測を発信する',
      '議論や対話を促す投稿をする',
      '他のインフルエンサーと関わる',
      '商品・サービスの紹介を組み込む',
    ],
  },
  expert: {
    id: 'expert',
    followerRange: '50000+',
    title: 'リーダーシップとビジネス',
    description: '影響力を活かしてビジネスや社会課題に取り組む段階です。',
    templates: [
      '【提言】〇〇の課題解決について。\n\n現状：〇〇\n解決策：〇〇\n\n誰かと一緒に動きたいです！\n\n#提言 #社会課題',
      '【事例】〇〇企業の成功事例。\n\n背景：〇〇\n施策：〇〇\n結果：〇〇\n\n#事例 #成功例',
      '【声明】〇〇についての私の考え。\n\nスタンス：〇〇\n行動：〇〇\n\n#声明 #方針',
    ],
    postingFrequency: '1日5回以上',
    bestPractices: [
      '社会課題や業界課題について発信する',
      '提言や声明を出す',
      '成功事例を共有する',
      'ビジネスへの導線を最適化する',
    ],
  },
};

const MILESTONES = {
  '1000': '1,000フォロワー達成で影響力が見えてくる',
  '10000': '10,000フォロワーで影響力が確立される',
  '50000': '50,000フォロワーでリーダーシップが認められる',
} as const;

export function getFollowerRange(followerCount: number): keyof typeof FOLLOWER_RANGES {
  if (followerCount < 1000) return 'beginner';
  if (followerCount < 10000) return 'intermediate';
  if (followerCount < 50000) return 'advanced';
  return 'expert';
}

export function analyzeByFollowerCount(followerCount: number): FollowerAnalysis {
  const rangeKey = getFollowerRange(followerCount);
  const suggestion = SUGGESTIONS[rangeKey];

  const nextMilestone = getNextMilestone(followerCount);

  const tips = getTipsForRange(FOLLOWER_RANGES[rangeKey].range);

  return {
    currentRange: FOLLOWER_RANGES[rangeKey].label,
    suggestions: [suggestion],
    nextMilestone,
    tips,
  };
}

function getNextMilestone(currentFollowers: number): string | undefined {
  if (currentFollowers < 1000) return MILESTONES['1000'];
  if (currentFollowers < 10000) return MILESTONES['10000'];
  if (currentFollowers < 50000) return MILESTONES['50000'];
  return undefined;
}

function getTipsForRange(range: string): string[] {
  const tips: Record<string, string[]> = {
    '0-1000': [
      'まずは「誰に届けたいか」を明確にする',
      '固定ツイートで自分の価値を伝える',
      'プロフィールを充実させる',
    ],
    '1000-10000': [
      'データや実績を活用して信頼性を高める',
      'スレッド投稿で深い情報を届ける',
      'CTA（フォロー、リンクなど）を効果的に配置',
    ],
    '10000-50000': [
      '独自の視点を提供し続ける',
      '業界トレンドをいち早くキャッチする',
      '他のクリエイターとのコラボを検討',
    ],
    '50000+': [
      'ビジネスへの導線を意識する',
      '社会課題への関心を示す',
      '長期的なビジョンを共有する',
    ],
  };

  return tips[range] || [];
}

export function getAllSuggestionCategories(): FollowerBasedSuggestion[] {
  return Object.values(SUGGESTIONS);
}
