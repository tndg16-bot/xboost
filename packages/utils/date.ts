/**
 * Date and time utilities
 */

/**
 * Format date to ISO string without timezone
 */
export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date to localized string (Japanese by default)
 */
export function formatDate(
  date: Date,
  locale: string = 'ja-JP',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
): string {
  return date.toLocaleDateString(locale, options);
}

/**
 * Format date and time to localized string
 */
export function formatDateTime(
  date: Date,
  locale: string = 'ja-JP',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  return date.toLocaleString(locale, options);
}

/**
 * Format relative time (e.g., "5 minutes ago", "2 hours ago")
 */
export function formatRelativeTime(date: Date, locale: string = 'ja-JP'): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return locale === 'ja-JP' ? 'たった今' : 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return locale === 'ja-JP'
      ? `${diffInMinutes}分前`
      : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return locale === 'ja-JP'
      ? `${diffInHours}時間前`
      : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return locale === 'ja-JP'
      ? `${diffInDays}日前`
      : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return locale === 'ja-JP'
      ? `${diffInMonths}ヶ月前`
      : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return locale === 'ja-JP'
    ? `${diffInYears}年前`
    : `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is within last n days
 */
export function isWithinLastDays(date: Date, days: number): boolean {
  const now = new Date();
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffInDays <= days && diffInDays >= 0;
}

/**
 * Get date range for period (last 7 days, 30 days, 90 days, 1 year)
 */
export function getDateRange(period: '7d' | '30d' | '90d' | '1y'): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date();

  switch (period) {
    case '7d':
      start.setDate(end.getDate() - 7);
      break;
    case '30d':
      start.setDate(end.getDate() - 30);
      break;
    case '90d':
      start.setDate(end.getDate() - 90);
      break;
    case '1y':
      start.setFullYear(end.getFullYear() - 1);
      break;
  }

  return { start, end };
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add hours to date
 */
export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

/**
 * Parse ISO string to Date with timezone handling
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format duration in seconds to human readable format
 */
export function formatDuration(seconds: number, locale: string = 'ja-JP'): string {
  if (seconds < 60) {
    return locale === 'ja-JP' ? `${seconds}秒` : `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return locale === 'ja-JP' ? `${minutes}分` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return locale === 'ja-JP' ? `${hours}時間` : `${hours}h`;
  }

  const days = Math.floor(hours / 24);
  return locale === 'ja-JP' ? `${days}日` : `${days}d`;
}
