import { useEffect, useState, useRef } from 'preact/hooks';

interface PullToRefreshOptions {
  /** Callback to execute when refresh is triggered */
  onRefresh: () => Promise<void> | void;
  /** Minimum pull distance to trigger refresh (default: 80px) */
  threshold?: number;
  /** Maximum pull distance for visual feedback (default: 120px) */
  maxPullDistance?: number;
  /** Whether pull to refresh is enabled */
  enabled?: boolean;
}

/**
 * Hook to enable pull-to-refresh functionality on a scrollable element
 * Returns a ref to attach to the container element
 *
 * @param options - Pull to refresh configuration
 * @returns ref to attach to the scrollable container
 */
export function usePullToRefresh<T extends HTMLElement>({
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  enabled = true
}: PullToRefreshOptions) {
  const containerRef = useRef<T>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if we're at the top of the scroll
      if (container.scrollTop === 0 && !isRefreshing) {
        touchStartY.current = e.touches[0].clientY;
        setIsPulling(true);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return;

      touchCurrentY.current = e.touches[0].clientY;
      const distance = touchCurrentY.current - touchStartY.current;

      // Only allow pulling down
      if (distance > 0 && container.scrollTop === 0) {
        // Prevent default scrolling
        e.preventDefault();

        // Apply resistance curve (diminishing returns as you pull further)
        const resistanceFactor = 0.5;
        const actualDistance = Math.min(
          distance * resistanceFactor,
          maxPullDistance
        );

        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          setPullDistance(actualDistance);
        });
      }
    };

    const handleTouchEnd = async () => {
      if (!isPulling) return;

      setIsPulling(false);

      if (pullDistance >= threshold && !isRefreshing) {
        setIsRefreshing(true);

        try {
          await onRefresh();
        } catch (error) {
          console.error('Error during refresh:', error);
        } finally {
          // Keep the refreshing state for a minimum duration for better UX
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 500);
        }
      } else {
        // Didn't reach threshold, reset
        setPullDistance(0);
      }

      touchStartY.current = 0;
      touchCurrentY.current = 0;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [enabled, isPulling, isRefreshing, pullDistance, threshold, maxPullDistance, onRefresh]);

  return {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance
  };
}
