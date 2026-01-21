import React, { useEffect, useRef } from 'react';
import { shimmerAction } from '../animations';

interface SkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', width, height, circle }) => {
    const skeletonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (skeletonRef.current) {
            shimmerAction(skeletonRef.current);
        }
    }, []);

    return (
        <div
            ref={skeletonRef}
            className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-white/5 dark:via-white/10 dark:to-white/5 bg-[length:200%_100%] ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
            style={{
                width: width || '100%',
                height: height || '1rem',
                display: 'inline-block'
            }}
        />
    );
};

export default Skeleton;
