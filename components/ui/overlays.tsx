import React from 'react';

export const GrainOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-50">
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
);

export const ScanlineOverlay = () => (
  <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-50 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] animate-scanline"></div>
  </div>
);
