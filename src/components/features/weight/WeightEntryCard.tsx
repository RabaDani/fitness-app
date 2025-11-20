import { h } from 'preact';
import { Trash2 } from 'lucide-preact';
import { WeightEntry } from '../../../types';
import { useAppContext } from '../../../context/AppContext';

interface WeightEntryCardProps {
  entry: WeightEntry;
  onRemove: () => void;
}

/**
 * Individual weight entry card
 * @param entry - Weight entry to display
 * @param onRemove - Callback when remove button is clicked
 */
export function WeightEntryCard({ entry, onRemove }: WeightEntryCardProps) {
  const { darkMode } = useAppContext();

  const formattedDate = new Date(entry.date).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div class="card-secondary flex justify-between items-center">
      <div>
        <p class="text-primary font-medium text-lg">{formattedDate}</p>
        {entry.note && <p class="text-secondary text-sm">{entry.note}</p>}
      </div>
      <div class="flex items-center space-x-4">
        <div class="text-right">
          <p class="text-accent text-2xl font-bold">{entry.weight}</p>
          <p class="text-secondary text-xs">kg</p>
        </div>
        <button onClick={onRemove} class="btn-icon-danger hidden lg:flex">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
