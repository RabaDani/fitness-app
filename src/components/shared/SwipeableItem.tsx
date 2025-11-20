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
  const [showDelete, setShowDelete] = useState(false);
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
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isSwiping) return;

      const deltaX = e.touches[0].clientX - startX.current;
      const newTranslateX = currentX.current + deltaX;

      // Only allow swiping left (negative values)
      if (newTranslateX <= 0 && newTranslateX >= -deleteButtonWidth) {
        setTranslateX(newTranslateX);
      }
    };

    const handleTouchEnd = () => {
      setIsSwiping(false);

      if (translateX < -swipeThreshold) {
        // Swiped enough to show delete
        setTranslateX(-deleteButtonWidth);
        setShowDelete(true);
      } else {
        // Not swiped enough, reset
        setTranslateX(0);
        setShowDelete(false);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

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

  const handleCancel = () => {
    setTranslateX(0);
    setShowDelete(false);
  };

  return (
    <div class="relative overflow-hidden">
      {/* Delete button background */}
      {showDelete && (
        <div class="absolute right-0 top-0 bottom-0 flex items-center justify-end bg-red-500 dark:bg-red-600">
          <button
            onClick={handleDelete}
            class="h-full px-6 text-white flex items-center justify-center hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            style={{ width: `${deleteButtonWidth}px` }}
            aria-label="Delete"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}

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

        {/* Tap outside to cancel when delete is showing */}
        {showDelete && (
          <div
            class="absolute inset-0 z-10"
            onClick={handleCancel}
            onTouchStart={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
