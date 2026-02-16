'use client';

import { motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

interface ScrollAnimationProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function ScrollAnimation({
    children,
    className = '',
    delay = 0,
    direction = 'up'
}: ScrollAnimationProps) {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
        setPrefersReducedMotion(mql.matches);
        const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
        mql.addEventListener('change', handler);
        return () => mql.removeEventListener('change', handler);
    }, []);

    const getVariants = () => {
        if (prefersReducedMotion) {
            return {
                hidden: { opacity: 0 },
                visible: { opacity: 1 }
            };
        }

        switch (direction) {
            case 'up':
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'down':
                return {
                    hidden: { opacity: 0, y: -50 },
                    visible: { opacity: 1, y: 0 }
                };
            case 'left':
                return {
                    hidden: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'right':
                return {
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0 }
                };
            case 'none':
                return {
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                };
            default:
                return {
                    hidden: { opacity: 0, y: 50 },
                    visible: { opacity: 1, y: 0 }
                };
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, delay, ease: "easeOut" }}
            variants={getVariants()}
            className={className}
        >
            {children}
        </motion.div>
    );
}
