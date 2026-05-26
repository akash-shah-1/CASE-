import React from 'react';

interface CISLogoProps {
  className?: string;
  light?: boolean;
}

export function CISLogo({ className = "h-12 w-auto", light = false }: CISLogoProps) {
  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSF2wUk1LF1-zfUWCfAtZT0WoKxcEftOOi9IQ&s"
        alt="CIS Logo"
        className="h-full w-auto object-contain max-h-full"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

