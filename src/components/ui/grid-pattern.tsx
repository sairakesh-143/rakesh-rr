import React from 'react';

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeWidth?: number;
  spacing?: number;
  patternUnits?: string;
  className?: string;
}

export function GridPattern({
  width = 100,
  height = 100,
  x = 0,
  y = 0,
  strokeWidth = 1,
  spacing = 10,
  patternUnits = 'userSpaceOnUse',
  className = '',
}: GridPatternProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="grid-pattern"
          width={spacing}
          height={spacing}
          patternUnits={patternUnits}
          x={x}
          y={y}
        >
          <path
            d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#grid-pattern)" />
    </svg>
  );
}

export function DotPattern({
  width = 100,
  height = 100,
  x = 0,
  y = 0,
  strokeWidth = 1,
  spacing = 10,
  patternUnits = 'userSpaceOnUse',
  className = '',
}: GridPatternProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern
          id="dot-pattern"
          width={spacing}
          height={spacing}
          patternUnits={patternUnits}
          x={x}
          y={y}
        >
          <circle
            cx={spacing / 2}
            cy={spacing / 2}
            r={strokeWidth}
            fill="currentColor"
          />
        </pattern>
      </defs>
      <rect width={width} height={height} fill="url(#dot-pattern)" />
    </svg>
  );
}
