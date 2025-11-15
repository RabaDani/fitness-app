import { h } from 'preact';

interface ProfileFieldProps {
  label: string;
  value: string;
}

/**
 * Profile field display component
 * Simple two-line display for profile information
 * @param label - Field label (e.g., "Életkor", "Magasság")
 * @param value - Field value to display
 */
export function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div>
      <p class="text-sm text-secondary">{label}</p>
      <p class="text-lg font-semibold text-primary">{value}</p>
    </div>
  );
}
