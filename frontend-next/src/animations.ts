import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standard Entrance Animation (Fade In + Slide Up)
 */
export const fadeInUp = (element: string | HTMLElement, delay: number = 0) => {
    return gsap.from(element, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay,
        ease: 'power3.out'
    });
};

/**
 * Staggered Entrance for Collections (Cards, List Items)
 */
export const staggerEntrance = (elements: string | HTMLElement[], stagger: number = 0.1) => {
    return gsap.from(elements, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: Array.isArray(elements) ? elements[0] : elements,
            start: 'top 85%',
        }
    });
};

/**
 * Page Transition (Fade Out/In)
 */
export const pageIn = (container: string | HTMLElement) => {
    return gsap.fromTo(container,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
    );
};

/**
 * Button Hover / Scale Effect
 */
export const hoverScale = (element: string | HTMLElement) => {
    const el = typeof element === 'string' ? document.querySelector(element) : element;
    if (!el) return;

    el.addEventListener('mouseenter', () => {
        gsap.to(el, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
};

/**
 * Button Ripple Effect
 */
export const rippleEffect = (element: string | HTMLElement) => {
    const el = (typeof element === 'string' ? document.querySelector(element) : element) as HTMLElement;
    if (!el) return;

    el.addEventListener('click', (e: Event) => {
        const mouseEvent = e as MouseEvent;
        const rect = el.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left;
        const y = mouseEvent.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '2px';
        ripple.style.height = '2px';
        ripple.style.background = 'rgba(255, 255, 255, 0.4)';
        ripple.style.borderRadius = '50%';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.transform = 'scale(0)';
        ripple.style.pointerEvents = 'none';

        el.style.position = 'relative';
        el.style.overflow = 'hidden';
        el.appendChild(ripple);

        gsap.to(ripple, {
            scale: 500,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
        });
    });
};

/**
 * Skeleton Loader Shimmer
 */
export const shimmerAction = (element: string | HTMLElement) => {
    return gsap.to(element, {
        backgroundPosition: '200% 0',
        duration: 1.5,
        repeat: -1,
        ease: 'linear'
    });
};

/**
 * Input Focus Pulse
 */
export const focusPulse = (element: HTMLInputElement | HTMLTextAreaElement) => {
    element.addEventListener('focus', () => {
        gsap.to(element, { boxShadow: '0 0 0 4px rgba(66, 129, 119, 0.2)', duration: 0.3 });
    });
    element.addEventListener('blur', () => {
        gsap.to(element, { boxShadow: 'none', duration: 0.3 });
    });
};

/**
 * Emblem Spinner (for loading states)
 */
export const rotateEmblem = (element: string | HTMLElement) => {
    return gsap.to(element, {
        rotation: 360,
        duration: 2,
        repeat: -1,
        ease: 'none'
    });
};
/**
 * Section Header Animation
 * Badge → Title → Underline → Description
 */
export const sectionHeaderEntrance = (container: HTMLElement) => {
    if (!container) return null;

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: container,
            start: 'top 80%',
        }
    });

    const badge = container.querySelector('.header-badge');
    const title = container.querySelector('.header-title');
    const underline = container.querySelector('.header-underline');
    const description = container.querySelector('.header-description');

    if (badge) {
        tl.from(badge, {
            opacity: 0,
            scale: 0.8,
            duration: 0.4,
            ease: 'power2.out'
        });
    }

    if (title) {
        tl.from(title, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, badge ? '-=0.2' : 0);
    }

    if (underline) {
        tl.from(underline, {
            width: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, title ? '-=0.3' : 0);
    }

    if (description) {
        tl.from(description, {
            opacity: 0,
            y: 10,
            duration: 0.5,
            ease: 'power2.out'
        }, underline ? '-=0.3' : 0);
    }

    return tl;
};

/**
 * Card Lift on Hover
 */
export const cardLift = (element: HTMLElement) => {
    element.addEventListener('mouseenter', () => {
        gsap.to(element, {
            y: -8,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            y: 0,
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
};

/**
 * Icon Rotate on Hover
 */
export const iconRotate = (element: HTMLElement) => {
    element.addEventListener('mouseenter', () => {
        gsap.to(element, {
            rotation: 15,
            duration: 0.3,
            ease: 'back.out(1.7)'
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            rotation: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
};

/**
 * Form Field Focus Animation
 */
export const formFieldFocus = (element: HTMLInputElement | HTMLTextAreaElement) => {
    element.addEventListener('focus', () => {
        gsap.to(element, {
            borderColor: '#428177',
            boxShadow: '0 0 0 3px rgba(66, 129, 119, 0.1)',
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    element.addEventListener('blur', () => {
        gsap.to(element, {
            borderColor: '#e5e7eb',
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.out'
        });
    });
};

/**
 * Checkmark Animation for Success States
 */
export const checkmarkAnimate = (element: SVGElement) => {
    const path = element.querySelector('path');
    if (!path) return;

    gsap.set(path, {
        strokeDasharray: path.getTotalLength(),
        strokeDashoffset: path.getTotalLength()
    });

    return gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.6,
        ease: 'power2.out'
    });
};

/**
 * Pin Drop Animation
 */
export const pinDrop = (element: HTMLElement) => {
    return gsap.fromTo(element,
        { y: -100, opacity: 0, rotation: -10 },
        {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }
    );
};

/**
 * Badge Pulse Animation
 */
export const badgePulse = (element: HTMLElement) => {
    return gsap.to(element, {
        scale: 1.1,
        boxShadow: '0 0 20px rgba(200, 16, 46, 0.4)',
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
};
export default gsap;
