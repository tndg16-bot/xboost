export interface ViralPost {
  id: string;
  content: string;
  postedAt: Date;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  engagementRate: number;
}

export interface AutoSelfRetweet {
  id: string;
  postId: string;
  postContent: string;
  retweetScheduledAt?: Date;
  retweetSentAt?: Date;
  status: 'pending' | 'scheduled' | 'sent' | 'skipped';
  notes?: string;
}

export interface SelfRetweetConfig {
  enabled: boolean;
  minEngagementRate: number;
  minLikes: number;
  minRetweets: number;
  minHoursSincePost: number;
  maxRetweetsPerDay: number;
  excludeHashtags: string[];
}

export const DEFAULT_SELF_RETWEET_CONFIG: SelfRetweetConfig = {
  enabled: true,
  minEngagementRate: 5.0,
  minLikes: 100,
  minRetweets: 20,
  minHoursSincePost: 24,
  maxRetweetsPerDay: 3,
  excludeHashtags: [],
};

export function isPostViral(
  post: ViralPost,
  config: SelfRetweetConfig
): boolean {
  const engagementRate = post.engagementRate;
  const hoursSincePost = (Date.now() - post.postedAt.getTime()) / (1000 * 60 * 60);

  const meetsEngagementRate = engagementRate >= config.minEngagementRate;
  const meetsMinLikes = post.likes >= config.minLikes;
  const meetsMinRetweets = post.retweets >= config.minRetweets;
  const meetsMinHours = hoursSincePost >= config.minHoursSincePost;
  const notInExcludedHashtags = !config.excludeHashtags.some(tag =>
    post.content.includes(tag)
  );

  return (
    meetsEngagementRate &&
    meetsMinLikes &&
    meetsMinRetweets &&
    meetsMinHours &&
    notInExcludedHashtags
  );
}

export function calculateOptimalRetweetTime(postDate: Date): Date {
  const hoursSincePost = (Date.now() - postDate.getTime()) / (1000 * 60 * 60);

  if (hoursSincePost < 24) {
    const nextDay = new Date(postDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
  } else if (hoursSincePost < 72) {
    const nextDay = new Date(postDate);
    nextDay.setDate(nextDay.getDate() + 3);
    return nextDay;
  } else if (hoursSincePost < 168) {
    const nextDay = new Date(postDate);
    nextDay.setDate(nextDay.getDate() + 7);
    return nextDay;
  } else {
    const nextDay = new Date(postDate);
    nextDay.setDate(nextDay.getDate() + 30);
    return nextDay;
  }
}

export function generateMockViralPosts(count: number = 10): ViralPost[] {
  const posts: ViralPost[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 90) + 1;
    const postedAt = new Date(now - daysAgo * 24 * 60 * 60 * 1000);
    const impressions = Math.floor(Math.random() * 100000) + 5000;
    const likes = Math.floor(Math.random() * 5000) + 100;
    const retweets = Math.floor(Math.random() * 1000) + 10;
    const replies = Math.floor(Math.random() * 200) + 5;

    const engagementRate =
      ((likes + retweets * 2 + replies * 3) / impressions) * 100;

    posts.push({
      id: `post-${i}`,
      content: generateMockContent(),
      postedAt,
      impressions,
      likes,
      retweets,
      replies,
      engagementRate,
    });
  }

  return posts.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
}

function generateMockContent(): string {
  const templates = [
    '【共有】今日学んだことを共有します。\n\n#学び #知識共有',
    '【ノウハウ】〇〇のやり方を解説します。\n\n#ノウハウ #解説',
    '【質問】〇〇について、皆さんはどう考えていますか？\n\n#質問',
    '【実践】〇〇の実践記録。\n\n成果：〇〇\n学び：〇〇\n\n#実践記録',
    '【比較】〇〇vs〇〇、どちらがおすすめ？\n\n#比較 #おすすめ',
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

export function getViralScore(post: ViralPost): number {
  const weights = {
    impressions: 0.3,
    likes: 0.4,
    retweets: 0.25,
    replies: 0.05,
  };

  const normalizedImpressions = Math.min(post.impressions / 100000, 1);
  const normalizedLikes = Math.min(post.likes / 5000, 1);
  const normalizedRetweets = Math.min(post.retweets / 1000, 1);
  const normalizedReplies = Math.min(post.replies / 200, 1);

  const score =
    (normalizedImpressions * weights.impressions +
      normalizedLikes * weights.likes +
      normalizedRetweets * weights.retweets +
      normalizedReplies * weights.replies) *
    100;

  return Math.round(score);
}
