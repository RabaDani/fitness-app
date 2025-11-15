import { h } from 'preact';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  color: string;
}

/**
 * Stat card component for displaying key metrics
 * @param title - Card title
 * @param value - Numeric value to display
 * @param unit - Unit of measurement
 * @param color - Tailwind color class for the accent bar
 */
export function StatCard({ title, value, unit, color }: StatCardProps) {
  return (
    <div class="card">
      <p class="text-secondary text-sm mb-2">{title}</p>
      <div class="flex items-end space-x-2">
        <p class="text-primary text-4xl font-bold">{value}</p>
        <p class="text-secondary text-xl mb-1">{unit}</p>
      </div>
      <div class={`${color} h-2 rounded-full mt-3`}></div>
    </div>
  );
}
