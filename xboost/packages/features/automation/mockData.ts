// Types are defined inline to avoid circular imports

export interface ViralPost {
  id: string;
  content: string;
  originalDate: string;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  lastReposted: string | null;
  repostCount: number;
  inQueue: boolean;
}

export interface AutomationSettings {
  autoRepost: boolean;
  repostInterval: number; // days
  autoDelete: boolean;
  deleteAfterDays: number;
  autoPlug: boolean;
  plugMessage: string;
}

export interface RepostHistoryItem {
  id: string;
  postId: string;
  repostedAt: string;
  result: 'success' | 'failed';
  impressions?: number;
}

// Mock viral posts (>100k impressions)
export const mockViralPosts: ViralPost[] = [
  {
    id: '1',
    content: '「失敗は成功の母」っていうけど、実際に失敗しまくってると「成功ってなんだ？」ってなりませんか？\n\n今の僕がまさにそれ。\n\nでも、失敗を記録し続けるだけで、次に進むための羅針盤になる。',
    originalDate: '2026-01-15',
    impressions: 125000,
    likes: 4200,
    retweets: 890,
    replies: 234,
    lastReposted: null,
    repostCount: 0,
    inQueue: true,
  },
  {
    id: '2',
    content: '朝活しないとダメ、みたいな空気あるけど\n\n僕は朝活しない派。\n\n理由は一つ。\n\n「寝てる間の方が、いいアイデア出る」から。\n\n睡眠はクリエイティビティの燃料。',
    originalDate: '2026-01-10',
    impressions: 98000,
    likes: 3100,
    retweets: 720,
    replies: 189,
    lastReposted: '2026-01-24',
    repostCount: 2,
    inQueue: false,
  },
  {
    id: '3',
    content: 'インプット中毒からアウトプット中毒へ。\n\n読むだけじゃダメ。\n見るだけじゃダメ。\n\n「アウトプットしないと死ぬ」ってくらいの感覚で。\n\nアウトプットが、インプットを超える瞬間がある。',
    originalDate: '2026-01-08',
    impressions: 185000,
    likes: 6200,
    retweets: 1450,
    replies: 412,
    lastReposted: null,
    repostCount: 0,
    inQueue: true,
  },
  {
    id: '4',
    content: '「人間関係が疲れる」って言うけど\n\n本当は「自分の期待が疲れる」だけ。\n\n相手を相手のまま受け入れる。\n\nそれが関係を楽にする唯一の方法。',
    originalDate: '2026-01-05',
    impressions: 87000,
    likes: 2800,
    retweets: 540,
    replies: 167,
    lastReposted: '2026-01-19',
    repostCount: 1,
    inQueue: false,
  },
  {
    id: '5',
    content: '「目標」は縛り。\n\n「どうありたいか」を考えるのが自由。\n\n目標設定しないで、「今日の自分が、どう過ごしたいか」だけを問う。\n\nそれが一番遠くまで行ける。',
    originalDate: '2026-01-03',
    impressions: 142000,
    likes: 5100,
    retweets: 1180,
    replies: 301,
    lastReposted: null,
    repostCount: 0,
    inQueue: true,
  },
];

// Default automation settings
export const defaultSettings: AutomationSettings = {
  autoRepost: true,
  repostInterval: 14, // 2 weeks
  autoDelete: false,
  deleteAfterDays: 30,
  autoPlug: false,
  plugMessage: 'プロダクト紹介: https://xboost.now',
};

// Mock repost history
export const mockRepostHistory: RepostHistoryItem[] = [
  {
    id: '1',
    postId: '2',
    repostedAt: '2026-01-24',
    result: 'success',
    impressions: 92000,
  },
  {
    id: '2',
    postId: '2',
    repostedAt: '2026-01-10',
    result: 'success',
    impressions: 88000,
  },
  {
    id: '3',
    postId: '4',
    repostedAt: '2026-01-19',
    result: 'success',
    impressions: 81000,
  },
  {
    id: '4',
    postId: '1',
    repostedAt: '2026-01-25',
    result: 'failed',
  },
];

export const getViralPosts = () => mockViralPosts;
export const getSettings = () => defaultSettings;
export const getRepostHistory = () => mockRepostHistory;
