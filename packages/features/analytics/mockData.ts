export type MonthlyData = {
  month: string;
  impressions: number;
  profileVisits: number;
  mentions: number;
  newFollowers: number;
  totalFollowers: number;
  likes: number;
  retweets: number;
  replies: number;
};

export type PostPerformance = {
  id: string;
  date: string;
  content: string;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  profileClicks: number;
  engagementRate: number;
};

export type TimeOfDayData = {
  hour: number;
  impressions: number;
  engagementRate: number;
};

// Mock data for 12 months of analytics
export const monthlyData: MonthlyData[] = [
  {
    month: 'Jan',
    impressions: 125000,
    profileVisits: 3200,
    mentions: 45,
    newFollowers: 520,
    totalFollowers: 8520,
    likes: 4500,
    retweets: 890,
    replies: 320,
  },
  {
    month: 'Feb',
    impressions: 145000,
    profileVisits: 3800,
    mentions: 58,
    newFollowers: 680,
    totalFollowers: 9200,
    likes: 5200,
    retweets: 1120,
    replies: 410,
  },
  {
    month: 'Mar',
    impressions: 165000,
    profileVisits: 4200,
    mentions: 72,
    newFollowers: 750,
    totalFollowers: 9950,
    likes: 6100,
    retweets: 1450,
    replies: 520,
  },
  {
    month: 'Apr',
    impressions: 142000,
    profileVisits: 3600,
    mentions: 48,
    newFollowers: 510,
    totalFollowers: 10460,
    likes: 4800,
    retweets: 920,
    replies: 380,
  },
  {
    month: 'May',
    impressions: 188000,
    profileVisits: 5200,
    mentions: 95,
    newFollowers: 1120,
    totalFollowers: 11580,
    likes: 7200,
    retweets: 2100,
    replies: 780,
  },
  {
    month: 'Jun',
    impressions: 225000,
    profileVisits: 6800,
    mentions: 128,
    newFollowers: 1450,
    totalFollowers: 13030,
    likes: 9200,
    retweets: 3200,
    replies: 1120,
  },
  {
    month: 'Jul',
    impressions: 210000,
    profileVisits: 6100,
    mentions: 102,
    newFollowers: 1180,
    totalFollowers: 14210,
    likes: 8400,
    retweets: 2650,
    replies: 920,
  },
  {
    month: 'Aug',
    impressions: 195000,
    profileVisits: 5500,
    mentions: 88,
    newFollowers: 920,
    totalFollowers: 15130,
    likes: 7600,
    retweets: 2180,
    replies: 750,
  },
  {
    month: 'Sep',
    impressions: 245000,
    profileVisits: 7200,
    mentions: 142,
    newFollowers: 1680,
    totalFollowers: 16810,
    likes: 10500,
    retweets: 3800,
    replies: 1350,
  },
  {
    month: 'Oct',
    impressions: 285000,
    profileVisits: 8400,
    mentions: 168,
    newFollowers: 2100,
    totalFollowers: 18910,
    likes: 12800,
    retweets: 4500,
    replies: 1680,
  },
  {
    month: 'Nov',
    impressions: 268000,
    profileVisits: 7800,
    mentions: 152,
    newFollowers: 1850,
    totalFollowers: 20760,
    likes: 11600,
    retweets: 3980,
    replies: 1450,
  },
  {
    month: 'Dec',
    impressions: 325000,
    profileVisits: 9600,
    mentions: 195,
    newFollowers: 2450,
    totalFollowers: 23210,
    likes: 15200,
    retweets: 5800,
    replies: 2100,
  },
];

// Mock post performance data (sorted by impressions)
export const postPerformance: PostPerformance[] = [
  {
    id: '1',
    date: '2025-10-15',
    content: 'Just launched a new feature that will transform how you build products! 🚀 Read more...',
    impressions: 458000,
    likes: 24500,
    retweets: 8500,
    replies: 3200,
    profileClicks: 12500,
    engagementRate: 7.8,
  },
  {
    id: '2',
    date: '2025-11-08',
    content: 'The secret to 10x productivity: Less work, more impact. Here\'s my framework...',
    impressions: 312000,
    likes: 15800,
    retweets: 5200,
    replies: 1800,
    profileClicks: 8900,
    engagementRate: 7.2,
  },
  {
    id: '3',
    date: '2025-09-22',
    content: 'Thread: How I went from 0 to 100K followers in 6 months. 🧵',
    impressions: 285000,
    likes: 14200,
    retweets: 4800,
    replies: 2200,
    profileClicks: 7800,
    engagementRate: 7.6,
  },
  {
    id: '4',
    date: '2025-12-03',
    content: 'Most people overestimate what they can do in a day and underestimate what they can do in a decade.',
    impressions: 245000,
    likes: 11800,
    retweets: 3800,
    replies: 1200,
    profileClicks: 6200,
    engagementRate: 6.9,
  },
  {
    id: '5',
    date: '2025-10-28',
    content: 'Building in public changed everything for me. Here\'s what I learned...',
    impressions: 198000,
    likes: 9200,
    retweets: 2900,
    replies: 950,
    profileClicks: 4800,
    engagementRate: 6.6,
  },
  {
    id: '6',
    date: '2025-08-14',
    content: 'The best time to start was yesterday. The second best time is now.',
    impressions: 168000,
    likes: 7800,
    retweets: 2200,
    replies: 720,
    profileClicks: 3800,
    engagementRate: 6.4,
  },
  {
    id: '7',
    date: '2025-11-19',
    content: '5 books that changed my thinking about business and life: 📚',
    impressions: 145000,
    likes: 6500,
    retweets: 1850,
    replies: 580,
    profileClicks: 3100,
    engagementRate: 6.1,
  },
  {
    id: '8',
    date: '2025-09-05',
    content: 'Why I stopped optimizing for vanity metrics and started focusing on impact.',
    impressions: 128000,
    likes: 5800,
    retweets: 1600,
    replies: 520,
    profileClicks: 2800,
    engagementRate: 6.0,
  },
  {
    id: '9',
    date: '2025-12-12',
    content: 'Your network is your net worth. Here\'s how to build meaningful relationships online.',
    impressions: 112000,
    likes: 5200,
    retweets: 1450,
    replies: 480,
    profileClicks: 2400,
    engagementRate: 6.3,
  },
  {
    id: '10',
    date: '2025-07-30',
    content: 'The difference between good and great is consistency. Show up every day.',
    impressions: 98000,
    likes: 4500,
    retweets: 1200,
    replies: 380,
    profileClicks: 2100,
    engagementRate: 5.9,
  },
  {
    id: '11',
    date: '2025-10-01',
    content: 'New product update: Faster exports, better analytics, and dark mode is finally here! ✨',
    impressions: 89000,
    likes: 4100,
    retweets: 1150,
    replies: 350,
    profileClicks: 1900,
    engagementRate: 6.2,
  },
  {
    id: '12',
    date: '2025-08-25',
    content: 'Quick tip: Use templates to save hours of work every week. Here are my favorites:',
    impressions: 76000,
    likes: 3500,
    retweets: 950,
    replies: 290,
    profileClicks: 1600,
    engagementRate: 5.9,
  },
];

// Mock time of day data (best posting times)
export const timeOfDayData: TimeOfDayData[] = [
  { hour: 0, impressions: 5200, engagementRate: 4.2 },
  { hour: 1, impressions: 3800, engagementRate: 3.8 },
  { hour: 2, impressions: 2100, engagementRate: 3.2 },
  { hour: 3, impressions: 1200, engagementRate: 2.8 },
  { hour: 4, impressions: 900, engagementRate: 2.5 },
  { hour: 5, impressions: 1100, engagementRate: 2.9 },
  { hour: 6, impressions: 2800, engagementRate: 3.5 },
  { hour: 7, impressions: 5200, engagementRate: 4.1 },
  { hour: 8, impressions: 8900, engagementRate: 4.8 },
  { hour: 9, impressions: 12500, engagementRate: 5.2 },
  { hour: 10, impressions: 15800, engagementRate: 5.5 },
  { hour: 11, impressions: 18200, engagementRate: 5.8 },
  { hour: 12, impressions: 19500, engagementRate: 6.1 },
  { hour: 13, impressions: 18800, engagementRate: 5.9 },
  { hour: 14, impressions: 17200, engagementRate: 5.6 },
  { hour: 15, impressions: 16800, engagementRate: 5.7 },
  { hour: 16, impressions: 18200, engagementRate: 5.9 },
  { hour: 17, impressions: 21500, engagementRate: 6.3 },
  { hour: 18, impressions: 24800, engagementRate: 6.5 },
  { hour: 19, impressions: 26500, engagementRate: 6.7 },
  { hour: 20, impressions: 25800, engagementRate: 6.6 },
  { hour: 21, impressions: 22500, engagementRate: 6.2 },
  { hour: 22, impressions: 17200, engagementRate: 5.4 },
  { hour: 23, impressions: 9800, engagementRate: 4.6 },
];

// Get viral posts (impressions > 100k)
export const getViralPosts = () => postPerformance.filter(post => post.impressions > 100000);

// Calculate totals
export const calculateTotals = () => {
  const totalImpressions = monthlyData.reduce((sum, month) => sum + month.impressions, 0);
  const totalLikes = monthlyData.reduce((sum, month) => sum + month.likes, 0);
  const totalRetweets = monthlyData.reduce((sum, month) => sum + month.retweets, 0);
  const totalReplies = monthlyData.reduce((sum, month) => sum + month.replies, 0);
  const followerGrowth = monthlyData[monthlyData.length - 1].totalFollowers - monthlyData[0].totalFollowers;

  return {
    totalImpressions,
    totalLikes,
    totalRetweets,
    totalReplies,
    followerGrowth,
    averageEngagementRate: ((totalLikes + totalRetweets + totalReplies) / totalImpressions) * 100,
  };
};
