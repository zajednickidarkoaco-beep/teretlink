import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  /** Trenutna ocena (0-5). Podržava i decimale za prikaz proseka. */
  value: number;
  /** Kad je interaktivno, poziva se sa novom ocenom. */
  onChange?: (rating: number) => void;
  /** Veličina zvezdice u px. */
  size?: number;
  /** Prikaz samo — ne reaguje na hover/click. */
  readOnly?: boolean;
  /** Prikaži broj recenzija pored. */
  count?: number;
  /** Prikaži numerički prosek (npr. "4.2"). */
  showValue?: boolean;
  className?: string;
}

/**
 * StarRating — zvezdice za prikaz ili unos ocene.
 * - readOnly=true: samo prikaz (npr. prosek na profilu)
 * - readOnly=false + onChange: interaktivno (ReviewForm)
 */
export const StarRating: React.FC<StarRatingProps> = ({
  value,
  onChange,
  size = 20,
  readOnly = false,
  count,
  showValue = false,
  className = '',
}) => {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = display >= n;
          const halfFilled = !filled && display >= n - 0.5;

          const starEl = (
            <div
              className="relative"
              style={{ width: size, height: size }}
            >
              {/* Prazna zvezda (pozadina) */}
              <Star
                className="absolute inset-0 text-border"
                style={{ width: size, height: size }}
                strokeWidth={1.5}
              />
              {/* Popunjena zvezda (preko) */}
              {(filled || halfFilled) && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: halfFilled ? size / 2 : size, height: size }}
                >
                  <Star
                    className="text-amber-400 fill-amber-400"
                    style={{ width: size, height: size }}
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          );

          if (readOnly) {
            return <span key={n}>{starEl}</span>;
          }

          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange?.(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
              className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-400/40 rounded"
              aria-label={`${n} zvezdic${n === 1 ? 'a' : 'e'}`}
            >
              {starEl}
            </button>
          );
        })}
      </div>

      {showValue && value > 0 && (
        <span className="text-sm font-semibold text-text-main">
          {value.toFixed(1)}
        </span>
      )}

      {typeof count === 'number' && (
        <span className="text-xs text-text-muted">
          ({count} {count === 1 ? 'recenzija' : count >= 2 && count <= 4 ? 'recenzije' : 'recenzija'})
        </span>
      )}
    </div>
  );
};
