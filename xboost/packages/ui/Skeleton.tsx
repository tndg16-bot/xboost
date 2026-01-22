import { Loader2 } from 'lucide-react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
          style={{
            height: count === 1 ? '60px' : '40px'
          }}
        />
      ))}
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
          style={{
            height: '16px',
            width: i === 0 ? '80%' : '60%'
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border-2 border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
        <div className="flex-1 space-y-3">
          <div className="h-6 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700 w-3/4" />
          <div className="h-4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700 w-1/2" />
          <div className="h-4 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border-2 border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
      <div className="space-y-3">
        <div className="h-10 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900 w-full" />
              <div className="h-4 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-teal-600 dark:text-teal-400`} />
    </div>
  );
}
