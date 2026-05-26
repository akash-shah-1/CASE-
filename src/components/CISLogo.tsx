import React from 'react';

interface CISLogoProps {
  className?: string;
  light?: boolean;
}

export function CISLogo({ className = "h-12 w-auto", light = false }: CISLogoProps) {
  const brandTeal = light ? "#FFFFFF" : "#023D4A";
  const brandOrange = "#F25B24";
  const taglineColor = light ? "rgba(255,255,255,0.8)" : "#023D4A";

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Container SVG representing the CIS logo exactly as attached */}
      <svg
        viewBox="0 0 320 160"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 'C' character - chunky rounded sans-serif curve */}
        <path
          d="M 104,30 H 60 C 35.15,30 15,50.15 15,75 v 10 c 0,24.85 20.15,45 45,45 h 44 V 104 H 60 C 49.5,104 41,95.5 41,85 v -10 c 0,-10.5 8.5,-19 19,-19 h 44 V 30 Z"
          fill={brandTeal}
        />

        {/* 'I' character - split with upward-pointing chevron connector gap */}
        {/* Bottom vertical teal bar with triangular pointed arrow-head tip */}
        <path
          d="M 120,130 H 150 V 78 L 135,65 L 120,78 V 130 Z"
          fill={brandTeal}
        />
        {/* Top vertical orange bar with bottom-edge upward triangular cut-out (fits with bottom's chevron tip, separated by gap) */}
        <path
          d="M 120,30 V 58 L 135,45 L 150,58 V 30 H 120 Z"
          fill={brandOrange}
        />

        {/* 'S' character - chunky double bend custom S curve */}
        <path
          d="M 235,30 H 175 V 56 h 43 c 4.97,0 9,4.03 9,9 v 4 c 0,4.97 -4.03,9 -9,9 h -43 v 42 h 60 V 94 h -41 C 189,94 185,89.97 185,85 v -4 c 0,-4.97 4.03,-9 9,-9 h 41 c 24.85,0 45,-20.15 45,-45 V 30 Z"
          fill={brandTeal}
        />

        {/* Sub-Tagline below: "We make IT possible!" */}
        <text
          x="145"
          y="152"
          textAnchor="middle"
          fontFamily="Inter, system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="0.04em"
        >
          <tspan fill={taglineColor}>We make IT </tspan>
          <tspan fill={brandOrange}>possible!</tspan>
        </text>
      </svg>
    </div>
  );
}
