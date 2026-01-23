import React from 'react';
import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../utils/cn';

const skeletonVariants = cva(
  'animate-pulse rounded-[4px]',
  {
    variants: {
      variant: {
        default: 'bg-zinc-100 dark:bg-zinc-800',
        card: 'bg-zinc-100 dark:bg-zinc-800',
        text: 'bg-zinc-200 dark:bg-zinc-700',
        avatar: 'bg-zinc-200 dark:bg-zinc-700 rounded-full',
        button: 'bg-zinc-200 dark:bg-zinc-700',
      },
      size: {
        sm: 'h-4',
        md: 'h-6',
        lg: 'h-8',
        full: 'h-full',
        auto: 'h-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string;
  count?: number;
  className?: string;
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, width, count = 1, ...props }, ref) => {
    const skeletons = Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        ref={i === 0 ? ref : undefined}
        className={cn(skeletonVariants({ variant, size }), className)}
        style={{ width: i === 0 ? width : undefined }}
        {...props}
      />
    ));

    return <>{skeletons}</>;
  }
);

Skeleton.displayName = 'Skeleton';
export { Skeleton, skeletonVariants };

// Preset skeleton components for common patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('rounded-lg border border-[#E1E8ED] bg-white p-4', className)}>
    <div className="flex items-start gap-3 mb-3">
      <Skeleton variant="avatar" className="h-10 w-10" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton variant="text" className="h-4 w-full" />
    <Skeleton variant="text" className="h-4 w-5/6" />
    <Skeleton variant="text" className="h-4 w-4/5" />
  </div>
);

export const SkeletonList: React.FC<{ count?: number; className?: string }> = ({
  count = 3,
  className,
}) => (
  <div className={cn('space-y-4', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonPost: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('rounded-lg border border-[#E1E8ED] bg-white p-6', className)}>
    <div className="flex items-start gap-3 mb-4">
      <Skeleton variant="avatar" className="h-12 w-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-5 w-40" />
        <Skeleton variant="text" className="h-3 w-24" />
      </div>
    </div>
    <div className="space-y-3 mb-4">
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-full" />
      <Skeleton variant="text" className="h-4 w-2/3" />
    </div>
    <div className="flex gap-2">
      <Skeleton variant="button" className="h-8 w-16" />
      <Skeleton variant="button" className="h-8 w-16" />
    </div>
  </div>
);

export const SkeletonProfile: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('rounded-lg border border-[#E1E8ED] bg-white p-6', className)}>
    <div className="flex flex-col items-center text-center space-y-4">
      <Skeleton variant="avatar" className="h-24 w-24" />
      <div className="w-full space-y-2">
        <Skeleton variant="text" className="h-6 w-48 mx-auto" />
        <Skeleton variant="text" className="h-4 w-32 mx-auto" />
      </div>
      <div className="flex gap-4 pt-4">
        <div className="text-center">
          <Skeleton variant="text" className="h-6 w-12 mx-auto" />
          <Skeleton variant="text" className="h-3 w-16 mx-auto mt-1" />
        </div>
        <div className="text-center">
          <Skeleton variant="text" className="h-6 w-12 mx-auto" />
          <Skeleton variant="text" className="h-3 w-16 mx-auto mt-1" />
        </div>
        <div className="text-center">
          <Skeleton variant="text" className="h-6 w-12 mx-auto" />
          <Skeleton variant="text" className="h-3 w-16 mx-auto mt-1" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonLoadingScreen: React.FC<{
  message?: string;
  subMessage?: string;
  className?: string;
}> = ({ message = '読み込み中...', subMessage, className }) => (
  <div
    className={cn(
      'flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900',
      className
    )}
  >
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-zinc-200 border-t-blue-500" />
      {message && (
        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {message}
        </p>
      )}
      {subMessage && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{subMessage}</p>
      )}
    </div>
  </div>
);
