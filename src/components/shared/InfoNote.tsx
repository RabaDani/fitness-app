import { h } from 'preact';
import { Info } from 'lucide-preact';

interface InfoNoteProps {
  children: preact.ComponentChildren;
  compact?: boolean;
}

export function InfoNote({ children, compact = false }: InfoNoteProps) {
  return (
    <div
      class={`flex items-start alert-info
        ${compact ? 'p-2 text-xs' : 'p-3 text-sm'}`}
    >
      <Info
        class={`mr-2 flex-shrink-0 ${
          compact ? 'mt-0.5' : 'mt-1'
        }`}
        size={compact ? 14 : 18}
      />
      <p>
        {children}
      </p>
    </div>
  );
}
