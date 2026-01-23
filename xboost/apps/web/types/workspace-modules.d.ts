declare module '@xboost/ai-profile-creation';
declare module '@xboost/analytics';
declare module '@xboost/automation';
declare module '@xboost/empathy-post';
declare module '@xboost/empathy-posts';
declare module '@xboost/follower-based-suggestions';
declare module '@xboost/multi-account';
declare module '@xboost/personal-brand';
declare module '@xboost/post-editor';
declare module '@xboost/profile-correction';
declare module '@xboost/profile-editing';
declare module '@xboost/scheduling' {
  export type PostStatus = 'normal' | 'needs-review' | 'scheduled' | 'posted' | 'failed';
  export interface ScheduledPost {
    id: string;
    content: string;
    scheduledAt: Date;
    status: PostStatus;
    platform: 'x';
    createdAt: Date;
    updatedAt: Date;
    mediaUrls?: string[];
    hashtags?: string[];
    characterCount: number;
  }
  export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    posts: ScheduledPost[];
  }
  export interface ReservationFormData {
    content: string;
    scheduledDate: string;
    scheduledTime: string;
    hashtags?: string;
  }
  export const mockScheduledPosts: ScheduledPost[];
  export function CalendarView(props: Record<string, unknown>): JSX.Element;
  export function PostList(props: Record<string, unknown>): JSX.Element;
}
declare module '@xboost/topic-proposal';
