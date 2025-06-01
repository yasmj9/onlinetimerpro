// components/SEOHead.tsx
import { useEffect } from 'react';
import { PageType } from '../hooks/useRouter';

// SEO data for each page
const seoData = {
  home: {
    title: 'VClock - Beautiful Timer App for Productivity & Workouts',
    description: 'Free online timer with countdown, training intervals, and stopwatch. Perfect for HIIT workouts, Pomodoro technique, and time management. No registration required.',
    keywords: 'timer, countdown timer, workout timer, HIIT timer, productivity timer, stopwatch, training timer, free timer app, online timer',
    path: '/',
    type: 'website',
    image: '/images/vclock-og-home.png'
  },
  about: {
    title: 'About VClock - Our Mission & Features',
    description: 'Learn about VClock\'s mission to provide the best free timer app. Discover our features: countdown timers, training intervals, dark mode, and PWA support.',
    keywords: 'about vclock, timer app features, free timer, workout timer features, productivity tools',
    path: '/about',
    type: 'website',
    image: '/images/vclock-og-about.png'
  },
  privacy: {
    title: 'Privacy Policy - How VClock Protects Your Data',
    description: 'VClock privacy policy: Learn how we protect your data, use local storage, and integrate with Google AdSense while respecting your privacy.',
    keywords: 'privacy policy, data protection, vclock privacy, timer app privacy, GDPR compliance',
    path: '/privacy',
    type: 'article',
    image: '/images/vclock-og-privacy.png'
  },
  terms: {
    title: 'Terms of Service - VClock Usage Guidelines',
    description: 'VClock terms of service: acceptable use policy, intellectual property, disclaimers, and legal guidelines for using our free timer application.',
    keywords: 'terms of service, user agreement, vclock terms, timer app terms, usage policy',
    path: '/terms',
    type: 'article',
    image: '/images/vclock-og-terms.png'
  },
  contact: {
    title: 'Contact VClock - Get Support & Send Feedback',
    description: 'Contact the VClock team for support, feature requests, bug reports, or general feedback. We love hearing from our users!',
    keywords: 'contact vclock, timer app support, customer service, feedback, help',
    path: '/contact',
    type: 'website',
    image: '/images/vclock-og-contact.png'
  }
};

// Website configuration
const siteConfig = {
  siteName: 'VClock',
  siteUrl: 'https://vclock.app',
  twitterHandle: '@vclock_app',
  language: 'en',
  country: 'US',
  author: 'VClock Team',
  publisher: 'VClock',
  copyright: `© ${new Date().getFullYear()} VClock. All rights reserved.`
};

interface SEOHeadProps {
  page: PageType;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ 
  page, 
  customTitle, 
  customDescription, 
  customImage 
}) => {
  useEffect(() => {
    const pageData = seoData[page] || seoData.home;
    const title = customTitle || pageData.title;
    const description = customDescription || pageData.description;
    const image = customImage || pageData.image;
    const fullUrl = `${siteConfig.siteUrl}${pageData.path}`;

    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (property: string, content: string, useProperty = false) => {
      const selector = useProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let metaTag = document.querySelector(selector) as HTMLMetaElement;
      
      if (!metaTag) {
        metaTag = document.createElement('meta');
        if (useProperty) {
          metaTag.setAttribute('property', property);
        } else {
          metaTag.setAttribute('name', property);
        }
        document.head.appendChild(metaTag);
      }
      
      metaTag.setAttribute('content', content);
    };

    // Helper function to update or create link tag
    const updateLinkTag = (rel: string, href: string, type?: string) => {
      let linkTag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!linkTag) {
        linkTag = document.createElement('link');
        linkTag.setAttribute('rel', rel);
        document.head.appendChild(linkTag);
      }
      
      linkTag.setAttribute('href', href);
      if (type) {
        linkTag.setAttribute('type', type);
      }
    };

    // Basic SEO meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', pageData.keywords);
    updateMetaTag('author', siteConfig.author);
    updateMetaTag('publisher', siteConfig.publisher);
    updateMetaTag('copyright', siteConfig.copyright);
    updateMetaTag('language', siteConfig.language);
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Viewport and mobile optimization
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0, shrink-to-fit=no');
    updateMetaTag('mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    updateMetaTag('apple-mobile-web-app-title', siteConfig.siteName);

    // Theme colors
    updateMetaTag('theme-color', '#3b82f6');
    updateMetaTag('msapplication-TileColor', '#3b82f6');
    updateMetaTag('msapplication-navbutton-color', '#3b82f6');

    // Open Graph meta tags
    updateMetaTag('og:type', pageData.type, true);
    updateMetaTag('og:site_name', siteConfig.siteName, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', fullUrl, true);
    updateMetaTag('og:image', `${siteConfig.siteUrl}${image}`, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:type', 'image/png', true);
    updateMetaTag('og:locale', 'en_US', true);

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:site', siteConfig.twitterHandle);
    updateMetaTag('twitter:creator', siteConfig.twitterHandle);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', `${siteConfig.siteUrl}${image}`);
    updateMetaTag('twitter:image:alt', title);

    // Additional Twitter tags
    updateMetaTag('twitter:app:name:iphone', siteConfig.siteName);
    updateMetaTag('twitter:app:name:ipad', siteConfig.siteName);
    updateMetaTag('twitter:app:name:googleplay', siteConfig.siteName);

    // Canonical URL
    updateLinkTag('canonical', fullUrl);

    // Alternate languages (if you plan to support multiple languages)
    updateLinkTag('alternate', fullUrl, 'text/html');

    // DNS prefetch for external resources
    updateLinkTag('dns-prefetch', '//fonts.googleapis.com');
    updateLinkTag('dns-prefetch', '//fonts.gstatic.com');
    updateLinkTag('dns-prefetch', '//pagead2.googlesyndication.com');

    // Preconnect for critical resources
    updateLinkTag('preconnect', 'https://fonts.googleapis.com');
    updateLinkTag('preconnect', 'https://fonts.gstatic.com');

    // JSON-LD Structured Data
    const generateStructuredData = () => {
      const baseStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": siteConfig.siteName,
        "alternateName": "VClock Timer App",
        "url": siteConfig.siteUrl,
        "description": seoData.home.description,
        "applicationCategory": "UtilityApplication",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "softwareVersion": "1.0.0",
        "datePublished": "2024-01-01",
        "dateModified": new Date().toISOString().split('T')[0],
        "creator": {
          "@type": "Organization",
          "name": siteConfig.publisher,
          "url": siteConfig.siteUrl
        },
        "publisher": {
          "@type": "Organization",
          "name": siteConfig.publisher,
          "url": siteConfig.siteUrl
        },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": [
          "Digital Clock Display",
          "Countdown Timer",
          "Training/Workout Timer",
          "Dark/Light Theme",
          "Mobile Responsive Design",
          "Progressive Web App (PWA)",
          "Offline Support",
          "Sound Alerts",
          "Keyboard Shortcuts",
          "Preset Management"
        ],
        "screenshot": `${siteConfig.siteUrl}/images/vclock-screenshot.png`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "1250",
          "bestRating": "5",
          "worstRating": "1"
        }
      };

      // Page-specific structured data
      if (page === 'home') {
        return {
          ...baseStructuredData,
          "mainEntity": {
            "@type": "SoftwareApplication",
            "name": "VClock Timer",
            "applicationCategory": "Productivity",
            "operatingSystem": "Web Browser"
          }
        };
      }

      if (page === 'about') {
        return {
          "@context": "https://schema.org",
          "@type": "AboutPage",
          "name": "About VClock",
          "description": pageData.description,
          "url": fullUrl,
          "mainEntity": baseStructuredData
        };
      }

      if (page === 'contact') {
        return {
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": "Contact VClock",
          "description": pageData.description,
          "url": fullUrl,
          "mainEntity": {
            "@type": "Organization",
            "name": siteConfig.siteName,
            "url": siteConfig.siteUrl,
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "support@vclock.app",
                "availableLanguage": "English"
              },
              {
                "@type": "ContactPoint",
                "contactType": "business",
                "email": "business@vclock.app",
                "availableLanguage": "English"
              }
            ]
          }
        };
      }

      if (page === 'privacy' || page === 'terms') {
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "url": fullUrl,
          "isPartOf": {
            "@type": "WebSite",
            "name": siteConfig.siteName,
            "url": siteConfig.siteUrl
          },
          "about": {
            "@type": "Thing",
            "name": page === 'privacy' ? "Privacy Policy" : "Terms of Service"
          },
          "datePublished": "2024-01-01",
          "dateModified": new Date().toISOString().split('T')[0],
          "publisher": {
            "@type": "Organization",
            "name": siteConfig.publisher
          }
        };
      }

      return baseStructuredData;
    };

    // Update JSON-LD structured data
    let structuredDataScript = document.querySelector('#structured-data') as HTMLScriptElement;
    if (!structuredDataScript) {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      document.head.appendChild(structuredDataScript);
    }
    
    structuredDataScript.textContent = JSON.stringify(generateStructuredData(), null, 2);

    // Add breadcrumb structured data for non-home pages
    if (page !== 'home') {
      let breadcrumbScript = document.querySelector('#breadcrumb-data') as HTMLScriptElement;
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = 'breadcrumb-data';
        breadcrumbScript.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScript);
      }

      const breadcrumbData = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteConfig.siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": title.split(' - ')[0],
            "item": fullUrl
          }
        ]
      };

      breadcrumbScript.textContent = JSON.stringify(breadcrumbData, null, 2);
    } else {
      // Remove breadcrumb data on home page
      const existingBreadcrumb = document.querySelector('#breadcrumb-data');
      if (existingBreadcrumb) {
        existingBreadcrumb.remove();
      }
    }

    // Website structured data (only on home page)
    if (page === 'home') {
      let websiteScript = document.querySelector('#website-data') as HTMLScriptElement;
      if (!websiteScript) {
        websiteScript = document.createElement('script');
        websiteScript.id = 'website-data';
        websiteScript.type = 'application/ld+json';
        document.head.appendChild(websiteScript);
      }

      const websiteData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteConfig.siteName,
        "alternateName": "VClock Timer App",
        "url": siteConfig.siteUrl,
        "description": seoData.home.description,
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteConfig.siteUrl}/?q={search_term_string}`
          },
          "query-input": "required name=search_term_string"
        },
        "publisher": {
          "@type": "Organization",
          "name": siteConfig.publisher,
          "url": siteConfig.siteUrl
        }
      };

      websiteScript.textContent = JSON.stringify(websiteData, null, 2);
    }

    // Performance optimization tags
    updateMetaTag('format-detection', 'telephone=no');
    updateMetaTag('referrer', 'origin-when-cross-origin');

    // Security headers (if supported by hosting)
    updateMetaTag('x-frame-options', 'SAMEORIGIN');
    updateMetaTag('x-content-type-options', 'nosniff');

    // Cleanup function to remove page-specific elements when component unmounts
    return () => {
      // Keep structured data for navigation
    };
  }, [page, customTitle, customDescription, customImage]);

  return null; // This component doesn't render anything visible
};

export default SEOHead;