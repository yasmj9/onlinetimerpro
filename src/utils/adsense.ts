export const loadAdSenseScript = () => {
  if (typeof window === 'undefined') return;
  
  // Check if script is already loaded
  if (document.querySelector('script[src*="adsbygoogle"]')) return;
  
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX'; // Replace with your Publisher ID
  script.crossOrigin = 'anonymous';
  
  script.onerror = () => {
    console.warn('Failed to load AdSense script');
  };
  
  document.head.appendChild(script);
};

export const refreshAds = () => {
  if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error refreshing ads:', err);
    }
  }
};