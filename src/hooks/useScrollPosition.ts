import { useState, useEffect } from 'preact/hooks';

/**
 * Hook to track scroll position
 * Returns true if scrolled past threshold, false otherwise
 */
export function useScrollPosition(threshold: number = 10): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = globalThis.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > threshold);
    };

    // Check initial position
    handleScroll();

    globalThis.addEventListener('scroll', handleScroll, { passive: true });
    return () => globalThis.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isScrolled;
}
