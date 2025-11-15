import { h } from 'preact';

interface ProfileFormInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  onValidate?: (value: number) => void;
  error?: string;
  min?: number;
  max?: number;
  hint?: string;
  darkMode?: boolean;
  compact?: boolean;
  labelClass?: string;
}

/**
 * Reusable number input component for profile forms
 * Handles validation, error display, and optional hints
 * Supports both regular and compact sizes, with dark mode
 */
export function ProfileFormInput({
  label,
  value,
  onChange,
  onValidate,
  error,
  min,
  max,
  hint,
  darkMode = false,
  compact = false,
  labelClass
}: ProfileFormInputProps) {
  const handleInput = (e: Event): void => {
    const inputValue = parseInt((e.target as HTMLInputElement).value) || 0;
    onChange(inputValue);
    if (onValidate) {
      onValidate(inputValue);
    }
  };

  const inputClass = compact ? 'input-field-sm' : 'input-field';
  const labelDefaultClass = compact ? 'label-sm' : 'label';
  const errorSizeClass = compact ? 'text-xs mt-0.5' : 'text-sm mt-1';

  return (
    <div>
      <label class={labelClass || labelDefaultClass}>
        {label}
        {hint && (
          <span class="text-tertiary text-xs ml-1">
            {hint}
          </span>
        )}
      </label>
      <input
        type="number"
        value={value}
        onInput={handleInput}
        class={error ? 'input-field-error' : inputClass}
      />
      {error && (
        <p class={`text-red-500 ${errorSizeClass}`}>{error}</p>
      )}
    </div>
  );
}
