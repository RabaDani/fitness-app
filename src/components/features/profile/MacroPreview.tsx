import { h } from 'preact';
import { Info, TrendingUp } from 'lucide-preact';
import { Profile } from '../../../types';

interface MacroPreviewProps {
  currentMacros?: Profile['macros'];
  newMacros: Profile['macros'];
  showComparison?: boolean;
}

/**
 * Macros display with optional comparison mode
 * - Comparison mode: shows old vs new values
 * - Single value mode: shows just the macro values
 */
export function MacroPreview({
  currentMacros,
  newMacros,
  showComparison = true
}: MacroPreviewProps) {
  // Single value mode
  if (!showComparison || currentMacros === undefined) {
    return (
      <div class="card-preview-green-lg">
        <h3 class="text-sm font-semibold mb-3 flex items-center space-x-1 text-primary">
          <TrendingUp size={16} class="text-green-500" />
          <span>Napi Makró Eloszlás</span>
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary">Fehérje</span>
            <span class="text-lg font-bold text-primary">
              {newMacros.protein}g
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary">Szénhidrát</span>
            <span class="text-lg font-bold text-primary">
              {newMacros.carbs}g
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary">Zsír</span>
            <span class="text-lg font-bold text-primary">
              {newMacros.fat}g
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Comparison mode
  return (
    <div class="card-preview-green">
      <h3 class="text-xs font-semibold mb-2 flex items-center space-x-1 text-primary">
        <Info size={14} />
        <span>Makrók</span>
      </h3>
      <div class="space-y-2 text-xs">
        <div class="flex justify-between items-center">
          <span class="text-secondary">Fehérje</span>
          <div class="flex items-center space-x-2">
            <span class="text-tertiary">{currentMacros.protein}g</span>
            <span class="text-tertiary">→</span>
            <span class="font-bold text-primary">{newMacros.protein}g</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-secondary">Szénhidrát</span>
          <div class="flex items-center space-x-2">
            <span class="text-tertiary">{currentMacros.carbs}g</span>
            <span class="text-tertiary">→</span>
            <span class="font-bold text-primary">{newMacros.carbs}g</span>
          </div>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-secondary">Zsír</span>
          <div class="flex items-center space-x-2">
            <span class="text-tertiary">{currentMacros.fat}g</span>
            <span class="text-tertiary">→</span>
            <span class="font-bold text-primary">{newMacros.fat}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
