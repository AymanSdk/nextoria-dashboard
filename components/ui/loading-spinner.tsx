import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-[#894DEF]',
          sizeClasses[size],
          className
        )}
      />
      <p className="text-sm text-gray-600">Loading...</p>
    </div>
  );
}