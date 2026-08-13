import React from 'react';
import verifyIcon from '../../assets/verify.png';

export default function VerifiedBadge({ size = 16, className = "" }) {
  return (
    <img 
      src={verifyIcon} 
      alt="Verified"
      style={{ width: size, height: size }}
      className={`flex-shrink-0 inline-block align-middle object-contain ${className}`}
      title="Verified Official Community"
    />
  );
}
