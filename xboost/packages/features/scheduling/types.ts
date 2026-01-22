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
