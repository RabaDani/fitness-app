import { useState } from 'preact/hooks';
import { Food } from '../../../types';
import { Salad } from 'lucide-preact';


/**
 * Food image component with fallback to placeholder
 * Displays food image or a placeholder icon if image is unavailable or fails to load
 */
export function FoodImage({ food, size, iconSize }: {
  food: Food;
  size: 12 | 20;
  iconSize: number;
}) {
  const [imageError, setImageError] = useState(false);

  if (!food.image || imageError) {
    return <Salad fill="#b8bfccff" size={iconSize} />;
  }

  const sizeClass = size === 12 ? 'w-12 h-12 rounded' : 'w-20 h-20 rounded-lg';

  return (
    <img
      src={food.image}
      alt={food.name}
      class={`${sizeClass} object-cover`}
      onError={() => setImageError(true)}
    />
  );
}
