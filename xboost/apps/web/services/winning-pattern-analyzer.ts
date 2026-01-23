/**
 * Enum definitions (temporary until Prisma Client is properly installed)
 */
export enum PostFormat {
  SINGLE = 'SINGLE',
  THREAD = 'THREAD',
  QUOTE = 'QUOTE',
  REPLY = 'REPLY',
  POLL = 'POLL',
}

export enum ContentType {
  EDUCATIONAL = 'EDUCATIONAL',
  ENTERTAINMENT = 'ENTERTAINMENT',
  PROMOTIONAL = 'PROMOTIONAL',
  PERSONAL = 'PERSONAL',
  NEWS = 'NEWS',
  OPINION = 'OPINION',
  OTHER = 'OTHER',
}

export interface Post {
  id: string;
  userId: string;
  twitterAccountId?: string | null;
  content: string;
  mediaUrls: string[];
  twitterPostId?: string | null;
  status: string;
  format: PostFormat;
  contentType?: ContentType | null;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  isViral?: boolean;
  viralThreshold?: number;
  engagementRate?: number | null;
  hook?: string | null;
  contentLength?: number | null;
  characterCount?: number | null;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 投稿のエンゲージメント率を計算
 */
export const calculateEngagementRate = (post: {
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  impressions: number;
}): number => {
  if (post.impressions === 0) return 0;
  const totalEngagements = post.likes + post.retweets + post.replies + post.quotes;
  return ((totalEngagements / post.impressions) * 100);
};

/**
 * 投稿をバズ投稿かどうか判定
 */
export const isViralPost = (post: {
  impressions: number;
  viralThreshold?: number;
}): boolean => {
  const threshold = post.viralThreshold || 100000;
  return post.impressions >= threshold;
};

/**
 * 投稿の冒頭の掴み（hook）を抽出
 */
export const extractHook = (content: string): string => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const firstLines = lines.slice(0, 2); // 最初の1-2行を取得
  return firstLines.join('\n');
};

/**
 * 投稿のフォーマットを推測（Xの特性から）
 */
export const detectPostFormat = (content: string): PostFormat => {
  const lines = content.split('\n').filter(line => line.trim() !== '');

  // スレッド判定（3行以上、または 🧵 emoji）
  if (lines.length >= 3 || content.includes('🧵')) {
    return PostFormat.THREAD;
  }

  // 引用リツイート判定（引用記号またはRT）
  if (content.match(/^RT|引用|引用RT|🔁/)) {
    return PostFormat.QUOTE;
  }

  // 返信判定（@mentionで始まる）
  if (content.match(/^@/)) {
    return PostFormat.REPLY;
  }

  // 投票判定
  if (content.includes('投票') || content.includes('poll') || content.includes('📊')) {
    return PostFormat.POLL;
  }

  return PostFormat.SINGLE;
};

/**
 * 投稿のコンテンツタイプを分類（キーワードベース）
 */
export const detectContentType = (content: string): ContentType | null => {
  const lowerContent = content.toLowerCase();

  // 教育的
  if (lowerContent.match(/tips|方法|やり方|how to|tutorial|ガイド|学ぶ|知ってる/)) {
    return ContentType.EDUCATIONAL;
  }

  // エンタメ
  if (lowerContent.match(/笑|w|草|lol|面白|funny|interesting|話題|news|ニュース/)) {
    return ContentType.ENTERTAINMENT;
  }

  // プロモーション
  if (lowerContent.match(/販売|buy|購入|sale|discount|offer|produc|サービス|ツール/)) {
    return ContentType.PROMOTIONAL;
  }

  // 個人的
  if (lowerContent.match(/私|僕|俺|I|my|自分|今日|yesterday|thought|think/)) {
    return ContentType.PERSONAL;
  }

  // ニュース
  if (lowerContent.match(/速報|breaking|news|発表|launch|release/)) {
    return ContentType.NEWS;
  }

  // 意見
  if (lowerContent.match(/思う|考える|opinion|believe|should|need|important/)) {
    return ContentType.OPINION;
  }

  return ContentType.OTHER;
};

/**
 * 勝ちパターン分析結果の型
 */
export interface WinningPatternAnalysis {
  viralPosts: Post[];
  normalPosts: Post[];
  viralStats: {
    count: number;
    avgImpressions: number;
    avgEngagementRate: number;
    commonFormats: { format: PostFormat; count: number }[];
    commonContentTypes: { type: ContentType | null; count: number }[];
    avgContentLength: number;
    avgCharacterCount: number;
    sampleHooks: string[];
  };
  normalStats: {
    count: number;
    avgImpressions: number;
    avgEngagementRate: number;
    commonFormats: { format: PostFormat; count: number }[];
    commonContentTypes: { type: ContentType | null; count: number }[];
    avgContentLength: number;
    avgCharacterCount: number;
    sampleHooks: string[];
  };
  insights: {
    bestPerformingFormat?: PostFormat;
    bestPerformingContentType?: ContentType | null;
    optimalContentLength?: { min: number; max: number };
    hookPatterns?: string[];
  };
}

/**
 * 勝ちパターン分析を実行
 */
export const analyzeWinningPatterns = (posts: Post[]): WinningPatternAnalysis => {
  // バズ投稿と通常投稿を分類
  const viralPosts: Post[] = [];
  const normalPosts: Post[] = [];

  for (const post of posts) {
    if (isViralPost(post)) {
      viralPosts.push(post);
    } else {
      normalPosts.push(post);
    }
  }

  // バズ投稿の統計
  const viralStats = {
    count: viralPosts.length,
    avgImpressions: viralPosts.length > 0
      ? viralPosts.reduce((sum, p) => sum + p.impressions, 0) / viralPosts.length
      : 0,
    avgEngagementRate: viralPosts.length > 0
      ? viralPosts.reduce((sum, p) => {
          const rate = calculateEngagementRate(p);
          return sum + rate;
        }, 0) / viralPosts.length
      : 0,
    commonFormats: getCommonFormats(viralPosts),
    commonContentTypes: getCommonContentTypes(viralPosts),
    avgContentLength: getAverageContentLength(viralPosts),
    avgCharacterCount: getAverageCharacterCount(viralPosts),
    sampleHooks: getSampleHooks(viralPosts, 3),
  };

  // 通常投稿の統計
  const normalStats = {
    count: normalPosts.length,
    avgImpressions: normalPosts.length > 0
      ? normalPosts.reduce((sum, p) => sum + p.impressions, 0) / normalPosts.length
      : 0,
    avgEngagementRate: normalPosts.length > 0
      ? normalPosts.reduce((sum, p) => {
          const rate = calculateEngagementRate(p);
          return sum + rate;
        }, 0) / normalPosts.length
      : 0,
    commonFormats: getCommonFormats(normalPosts),
    commonContentTypes: getCommonContentTypes(normalPosts),
    avgContentLength: getAverageContentLength(normalPosts),
    avgCharacterCount: getAverageCharacterCount(normalPosts),
    sampleHooks: getSampleHooks(normalPosts, 3),
  };

  // インサイト生成
  const insights = generateInsights(viralPosts, normalPosts, viralStats, normalStats);

  return {
    viralPosts,
    normalPosts,
    viralStats,
    normalStats,
    insights,
  };
};

/**
 * 共通の投稿フォーマットを取得
 */
const getCommonFormats = (posts: Post[]): { format: PostFormat; count: number }[] => {
  const formatCounts: Record<PostFormat, number> = {
    [PostFormat.SINGLE]: 0,
    [PostFormat.THREAD]: 0,
    [PostFormat.QUOTE]: 0,
    [PostFormat.REPLY]: 0,
    [PostFormat.POLL]: 0,
  };

  for (const post of posts) {
    if (post.format) {
      formatCounts[post.format]++;
    }
  }

  return Object.entries(formatCounts)
    .map(([format, count]) => ({ format: format as PostFormat, count }))
    .sort((a, b) => b.count - a.count)
    .filter((item) => item.count > 0);
};

/**
 * 共通のコンテンツタイプを取得
 */
const getCommonContentTypes = (posts: Post[]): { type: ContentType | null; count: number }[] => {
  const typeCounts: Record<string, number> = {};

  for (const post of posts) {
    const type = post.contentType || 'NULL';
    typeCounts[type] = (typeCounts[type] || 0) + 1;
  }

  return Object.entries(typeCounts)
    .map(([type, count]) => ({
      type: type === 'NULL' ? null : (type as ContentType),
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .filter((item) => item.count > 0);
};

/**
 * 平均コンテンツ長（行数）を取得
 */
const getAverageContentLength = (posts: Post[]): number => {
  if (posts.length === 0) return 0;

  const total = posts.reduce((sum, post) => {
    if (!post.content) return sum;
    return sum + post.content.split('\n').length;
  }, 0);

  return total / posts.length;
};

/**
 * 平均文字数を取得
 */
const getAverageCharacterCount = (posts: Post[]): number => {
  if (posts.length === 0) return 0;

  const total = posts.reduce((sum, post) => {
    if (!post.content) return sum;
    return sum + post.content.length;
  }, 0);

  return total / posts.length;
};

/**
 * サンプルのフック（冒頭の掴み）を取得
 */
const getSampleHooks = (posts: Post[], limit: number): string[] => {
  return posts
    .filter((post) => post.hook && post.hook.trim() !== '')
    .map((post) => post.hook!)
    .slice(0, limit);
};

/**
 * インサイトを生成
 */
const generateInsights = (
  viralPosts: Post[],
  normalPosts: Post[],
  viralStats: WinningPatternAnalysis['viralStats'],
  normalStats: WinningPatternAnalysis['normalStats']
): WinningPatternAnalysis['insights'] => {
  const insights: WinningPatternAnalysis['insights'] = {};

  // ベストパフォーマンスのフォーマット
  if (viralStats.commonFormats.length > 0) {
    insights.bestPerformingFormat = viralStats.commonFormats[0].format;
  }

  // ベストパフォーマンスのコンテンツタイプ
  if (viralStats.commonContentTypes.length > 0) {
    insights.bestPerformingContentType = viralStats.commonContentTypes[0].type;
  }

  // 最適なコンテンツ長（バズ投稿の平均から推定）
  if (viralStats.avgContentLength > 0) {
    const min = Math.max(1, Math.floor(viralStats.avgContentLength * 0.8));
    const max = Math.ceil(viralStats.avgContentLength * 1.2);
    insights.optimalContentLength = { min, max };
  }

  // フックのパターン（サンプルフックから推定）
  if (viralStats.sampleHooks.length > 0) {
    insights.hookPatterns = viralStats.sampleHooks;
  }

  return insights;
};
