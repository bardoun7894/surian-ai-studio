'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';

export const useGSAP = (
    effect: (context: gsap.Context, contextSafe?: any) => void | (() => void),
    deps: React.DependencyList = []
) => {
    const scope = useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(effect, scope);
        return () => ctx.revert();
    }, deps);

    return { scope };
};
