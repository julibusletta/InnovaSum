import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  onIntersect?: (isIntersecting: boolean) => void;
}

/**
 * Custom hook for Intersection Observer
 * Triggers animation class when element enters viewport
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add visible class for animations
          entry.target.classList.add('visible', 'in-view');
          options.onIntersect?.(true);

          // Stop observing after first intersection to prevent repeat animations
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return ref;
}

/**
 * Initialize global intersection observer for all data-aos elements
 * Call this once in layout or useEffect
 */
export function initializeGlobalIntersectionObserver() {
  if (typeof window === 'undefined') return;

  const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible', 'in-view');
        // Stop observing once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with data-aos attribute
  document.querySelectorAll('[data-aos]').forEach((el) => {
    observer.observe(el);
  });

  // Also observe sections
  document.querySelectorAll('section').forEach((el) => {
    observer.observe(el);
  });
}
