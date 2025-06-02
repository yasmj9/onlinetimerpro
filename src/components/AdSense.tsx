import React, { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'leaderboard';
  adLayout?: string;
  adLayoutKey?: string;
  style?: React.CSSProperties;
  className?: string;
  responsive?: boolean;
}

export const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adLayout,
  adLayoutKey,
  style = {},
  className = '',
  responsive = true
}) => {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const adStyle = {
    display: 'block',
    ...style
  };

  return (
    <div className={`adsense-container ${className}`}>
      <ins className="adsbygoogle"
     style={adStyle}
     data-ad-client="ca-pub-5343898025629047"
     data-ad-slot={adSlot}
     data-ad-format={adFormat}
     data-full-width-responsive="true"></ins>
    </div>
  );
};