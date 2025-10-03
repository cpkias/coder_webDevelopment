/**
 * LoadingSpinner Component
 * Reusable loading spinner with size variations
 */

import { clsx } from 'clsx';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    small: 'w-4 h-4',
    md: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className={clsx('inline-block', className)}>
      <div
        className={clsx(
          'animate-spin rounded-full border-4 border-gray-200 border-t-primary-600',
          sizes[size]
        )}
      />
    </div>
  );
};

export default LoadingSpinner;
