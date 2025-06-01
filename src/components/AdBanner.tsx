import React from 'react';
import { AdSense } from './AdSense';

interface AdBannerProps {
  position: 'top' | 'bottom' | 'sidebar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ position, className = '' }) => {
  const getAdConfig = () => {
    switch (position) {
      case 'top':
        return {
          adSlot: '1234567890', // Replace with your ad slot ID
          adFormat: 'banner' as const,
          style: { width: '100%', height: '90px' }
        };
      case 'bottom':
        return {
          adSlot: '1234567891', // Replace with your ad slot ID
          adFormat: 'banner' as const,
          style: { width: '100%', height: '90px' }
        };
      case 'sidebar':
        return {
          adSlot: '1234567892', // Replace with your ad slot ID
          adFormat: 'rectangle' as const,
          style: { width: '300px', height: '250px' }
        };
      default:
        return {
          adSlot: '1234567890',
          adFormat: 'auto' as const
        };
    }
  };

  const config = getAdConfig();

  return (
    <div className={`ad-banner ad-banner-${position} ${className}`}>
      <div className="text-xs text-gray-400 text-center mb-1">Advertisement</div>
      <AdSense {...config} />
    </div>
  );
};