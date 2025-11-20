import { useEffect, useRef } from 'preact/hooks';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  minSwipeDistance?: number;
  maxSwipeTime?: number;
}

/**
 * Custom hook for detecting swipe gestures
 * @param handlers - Callback functions for different swipe directions
 * @param config - Configuration for swipe sensitivity
 * @returns Ref to attach to the element you want to detect swipes on
 */
export function useSwipe<T extends HTMLElement>(
  handlers: SwipeHandlers,
  config: SwipeConfig = {}
) {
  const { minSwipeDistance = 50, maxSwipeTime = 500 } = config;
  const elementRef = useRef<T>(null);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      touchStartTime.current = Date.now();
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();

      const deltaX = touchEndX - touchStartX.current;
      const deltaY = touchEndY - touchStartY.current;
      const deltaTime = touchEndTime - touchStartTime.current;

      // Check if swipe was fast enough
      if (deltaTime > maxSwipeTime) return;

      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      // Horizontal swipe
      if (absX > absY && absX > minSwipeDistance) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.();
        } else {
          handlers.onSwipeLeft?.();
        }
      }
      // Vertical swipe
      else if (absY > absX && absY > minSwipeDistance) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.();
        } else {
          handlers.onSwipeUp?.();
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, minSwipeDistance, maxSwipeTime]);

  return elementRef;
}
