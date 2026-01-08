/**
 * @file src/components/common/icons/RiderPromotionIcon.jsx
 * @description A simple SVG icon for partner promotions.
 */

import React from 'react';

const RiderPromotionIcon = () => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 200 100"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      aria-labelledby="riderIconTitle"
    >
      <title id="riderIconTitle">Rider Promotion Illustration</title>
      <g fill="none" stroke="var(--com-color-black, #111827)" strokeWidth="3">
        {/* Ground */}
        <line x1="5" y1="90" x2="195" y2="90" strokeDasharray="5, 5" />

        {/* Scooter Body */}
        <path d="M50 90 L70 50 L110 50 L120 70 L140 70 L150 90 Z" />
        <rect x="70" y="50" width="40" height="25" rx="5" fill="var(--com-color-bg-light, #f8f8f8)" />
        
        {/* Wheels */}
        <circle cx="65" cy="90" r="12" strokeWidth="4" fill="var(--com-color-white, #fff)" />
        <circle cx="155" cy="90" r="12" strokeWidth="4" fill="var(--com-color-white, #fff)" />
        
        {/* Rider */}
        <circle cx="90" cy="35" r="8" fill="var(--com-color-bg-light, #f8f8f8)" />
        <path d="M90 43 L90 70 L105 60" />
        <line x1="75" y1="50" x2="85" y2="40" />

        {/* Speed lines */}
        <line x1="10" y1="65" x2="40" y2="65" />
        <line x1="15" y1="75" x2="35" y2="75" />
      </g>
    </svg>
  );
};

export default RiderPromotionIcon;
