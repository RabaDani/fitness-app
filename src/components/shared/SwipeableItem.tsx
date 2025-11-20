import { h, ComponentChildren } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Trash2 } from 'lucide-preact';

interface SwipeableItemProps {
  children: ComponentChildren;
  onDelete: () => void;
  disabled?: boolean;
}

/**
 * Swipeable item component for swipe-to-delete functionality
 * Swipe left to reveal delete button, swipe right to cancel
 * @param children - The content to wrap
 * @param onDelete - Callback when delete is confirmed
 * @param disabled - If true, swiping is disabled
 */
export function SwipeableItem({ children, onDelete, disabled = false }: SwipeableItemProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);

  const deleteButtonWidth = 80;
  const swipeThreshold = 60;

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      currentX.current = translateX;
      setIsSwiping(true);
      // Prevent parent swipe handlers from triggering
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;

      const deltaX = e.touches[0].clientX - startX.current;
      const newTranslateX = currentX.current + deltaX;

      // Only allow swiping left (negative values)
      if (newTranslateX <= 0 && newTranslateX >= -deleteButtonWidth) {
        setTranslateX(newTranslateX);
        // Prevent parent swipe handlers from triggering
        e.stopPropagation();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      setIsSwiping(false);

      if (translateX < -swipeThreshold) {
        // Swiped enough - trigger delete immediately
        handleDelete();
        // Prevent parent swipe handlers from triggering
        e.stopPropagation();
      } else {
        // Not swiped enough, reset
        setTranslateX(0);
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isSwiping, translateX, disabled]);

  const handleDelete = () => {
    // Animate out before deleting
    setTranslateX(-300);
    setTimeout(() => {
      onDelete();
    }, 200);
  };

  return (
    <div class="relative overflow-hidden">
      {/* Red background indicator when swiping */}
      <div class="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-end bg-red-500 dark:bg-red-600">
        <Trash2 size={20} class="mr-6 text-white" />
      </div>

      {/* Swipeable content */}
      <div
        ref={elementRef}
        class="relative bg-white dark:bg-gray-800"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}
