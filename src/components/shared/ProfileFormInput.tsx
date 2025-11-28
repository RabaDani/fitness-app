import { useState, useEffect } from 'preact/hooks';

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
 * Allows decimal input with transitional states (e.g., "70.")
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
  // Use string state to allow transitional input states like "70."
  const [localValue, setLocalValue] = useState(value.toString());

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleInput = (e: Event): void => {
    const rawValue = (e.target as HTMLInputElement).value;
    setLocalValue(rawValue);

    // Parse and update parent only if it's a valid number
    const numValue = Number.parseFloat(rawValue);
    if (!Number.isNaN(numValue)) {
      onChange(numValue);
      if (onValidate) {
        onValidate(numValue);
      }
    }
  };

  const handleBlur = (): void => {
    // Clean up value on blur - ensure it's a valid number
    const numValue = Number.parseFloat(localValue);
    if (Number.isNaN(numValue)) {
      setLocalValue('0');
      onChange(0);
    } else {
      setLocalValue(numValue.toString());
      onChange(numValue);
      if (onValidate) {
        onValidate(numValue);
      }
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
        value={localValue}
        onInput={handleInput}
        onBlur={handleBlur}
        step="any"
        min={min}
        max={max}
        class={error ? 'input-field-error' : inputClass}
      />
      {error && (
        <p class={`text-red-500 ${errorSizeClass}`}>{error}</p>
      )}
    </div>
  );
}
