import React from 'react';

interface CISLogoProps {
  className?: string;
  light?: boolean;
}

export function CISLogo({ className = "h-12 w-auto", light = false }: CISLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="https://raw.githubusercontent.com/Anand-kumar-Saini/CIS-Logo/refs/heads/main/cis-logo.png"
        alt="CIS Logo"
        className={`h-full w-auto object-contain max-h-full ${
          light 
            ? 'brightness-0 invert' // Simple crisp white version for dark background contrast
            : ''
        }`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

