import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins once globally
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Set sensible defaults for government portal animations
gsap.defaults({
  ease: 'power2.out',
  duration: 0.6,
});

// Configure ScrollTrigger defaults
ScrollTrigger.defaults({
  toggleActions: 'play none none none',
});

export { gsap, ScrollTrigger };
