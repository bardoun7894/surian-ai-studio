'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse'
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-white/10';

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: ''
  };

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl'
  };

  const style: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined
  };

  // Default dimensions based on variant
  if (!width) {
    if (variant === 'text') style.width = '100%';
    if (variant === 'circular') style.width = style.height || '40px';
  }
  if (!height) {
    if (variant === 'text') style.height = '1em';
    if (variant === 'circular') style.height = style.width || '40px';
  }

  return (
    <div
      className={`${baseClasses} ${animationClasses[animation]} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
};

// Predefined skeleton patterns
export const CardSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-gov-card/10 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gov-border/15">
    <Skeleton variant="rounded" height={200} className="mb-4" />
    <Skeleton variant="text" className="mb-2" height={24} width="60%" />
    <Skeleton variant="text" className="mb-2" height={16} />
    <Skeleton variant="text" height={16} width="80%" />
  </div>
);

export const ArticleSkeleton: React.FC = () => (
  <div className="flex gap-4 p-4">
    <Skeleton variant="rounded" width={120} height={80} />
    <div className="flex-1">
      <Skeleton variant="text" height={20} className="mb-2" width="80%" />
      <Skeleton variant="text" height={14} className="mb-1" />
      <Skeleton variant="text" height={14} width="60%" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 py-4 border-b border-gray-100 dark:border-gov-border/15">
    <Skeleton variant="circular" width={40} height={40} />
    <Skeleton variant="text" width="30%" height={16} />
    <Skeleton variant="text" width="20%" height={16} />
    <Skeleton variant="text" width="15%" height={16} />
    <Skeleton variant="rounded" width={80} height={28} />
  </div>
);

export default Skeleton;
