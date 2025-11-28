interface GlassProps {
  fillPercentage: number; // 0 to 100
  index: number;
}

/**
 * Glass component for water tracker
 * Displays a realistic glass - narrower at bottom, wider at top
 */
export function Glass({ fillPercentage, index }: GlassProps) {
  // Calculate water shape that follows glass trapezoid
  const waterHeight = (fillPercentage * 49) / 100;
  const waterTopY = 51 - waterHeight;

  // Linear interpolation for water width at top position
  // Glass is wider at top (8 to 36) and slightly narrower at bottom (12 to 32) - minimal contrast
  const glassTopLeft = 8;
  const glassTopRight = 36;
  const glassBottomLeft = 12;
  const glassBottomRight = 32;

  const ratio = waterTopY / 46; // ratio from top (0) to bottom curve start (46)
  const waterTopLeft = glassTopLeft + (glassBottomLeft - glassTopLeft) * ratio;
  const waterTopRight = glassTopRight - (glassTopRight - glassBottomRight) * ratio;

  return (
    <div class="relative flex-shrink-0">
      <svg width="44" height="54" viewBox="0 0 44 54" class="overflow-visible">
        <defs>
          {/* Gradient for water */}
          <linearGradient id={`water-gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" class="text-blue-400 dark:text-blue-300" stop-color="currentColor" stop-opacity="0.85" />
            <stop offset="100%" class="text-blue-500 dark:text-blue-400" stop-color="currentColor" stop-opacity="0.8" />
          </linearGradient>
        </defs>

        {/* Glass outline - no top border, wider top, slightly narrower bottom */}
        <path
          d="M 8 0 L 36 0 L 32 46 Q 32 51 22 51 Q 12 51 12 46 L 8 0"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-blue-300 dark:text-blue-400"
        />

        {/* Water fill with gradient - follows trapezoid shape */}
        {fillPercentage > 0 && (
          <path
            d={`M ${waterTopLeft} ${waterTopY} L ${waterTopRight} ${waterTopY} L 32 46 Q 32 51 22 51 Q 12 51 12 46 L ${waterTopLeft} ${waterTopY} Z`}
            fill={`url(#water-gradient-${index})`}
            class="transition-all duration-300 ease-out"
          />
        )}

        {/* Glass shine effect */}
        <ellipse
          cx="14"
          cy="24"
          rx="3"
          ry="12"
          fill="white"
          opacity="0.15"
          class="pointer-events-none"
        />
      </svg>
    </div>
  );
}
