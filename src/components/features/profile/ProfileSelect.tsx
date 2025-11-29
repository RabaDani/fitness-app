interface ProfileSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: Record<string, string>;
  compact?: boolean;
  labelClass?: string;
}

/**
 * Reusable select dropdown for profile forms
 * Eliminates duplication across ProfileSetup and EditProfileModal
 * Supports compact mode for modal layouts
 */
export function ProfileSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  compact = false,
  labelClass
}: ProfileSelectProps<T>) {
  const defaultLabelClass = labelClass || 'label';
  const selectClass = compact ? 'input-field-sm' : 'select-field';

  return (
    <div>
      <label class={defaultLabelClass}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value as T)}
        class={selectClass}
      >
        {Object.entries(options).map(([key, displayLabel]) => (
          <option key={key} value={key}>
            {displayLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
