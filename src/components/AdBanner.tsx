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
          adSlot: '5888973072', // Replace with your ad slot ID
          adFormat: 'banner' as const,
          style: {}
        };
      case 'bottom':
        return {
          adSlot: '5888973072', // Replace with your ad slot ID
          adFormat: 'auto' as const,
          style: { width: '100%', height: '90px' }
        };
      case 'sidebar':
        return {
          adSlot: '7568660910', // Replace with your ad slot ID
          adFormat: 'auto' as const,
          style: {}
        };
      default:
        return {
          adSlot: '5888973072',
          adFormat: 'auto' as const,
          style: {}
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