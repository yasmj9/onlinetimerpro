export const updatePageTitle = (title: string) => {
  document.title = title ? `${title} | Online Timer Pro` : 'Online Timer Pro - Beautiful Timer App';
};

export const updateMetaDescription = (description: string) => {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  }
};

export const updateCanonicalUrl = (path: string) => {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', `https://your-domain.com${path}`);
};

// Page-specific SEO data
export const seoData = {
  home: {
    title: 'Online Timer Pro - Beautiful Timer App for Productivity & Workouts',
    description: 'Free online timer with countdown, training intervals, and stopwatch. Perfect for HIIT workouts, Pomodoro technique, and time management. No registration required.',
    path: '/'
  },
  about: {
    title: 'About Online Timer Pro - Our Mission & Features',
    description: 'Learn about Online Timer Pro\'s mission to provide the best free timer app. Discover our features: countdown timers, training intervals, dark mode, and PWA support.',
    path: '/about'
  },
  privacy: {
    title: 'Privacy Policy - How Online Timer Pro Protects Your Data',
    description: 'Online Timer Pro privacy policy: Learn how we protect your data, use local storage, and integrate with Google AdSense while respecting your privacy.',
    path: '/privacy'
  },
  terms: {
    title: 'Terms of Service - Online Timer Pro Usage Guidelines',
    description: 'Online Timer Pro terms of service: acceptable use policy, intellectual property, disclaimers, and legal guidelines for using our free timer application.',
    path: '/terms'
  },
  contact: {
    title: 'Contact Online Timer Pro - Get Support & Send Feedback',
    description: 'Contact the Online Timer Pro team for support, feature requests, bug reports, or general feedback. We love hearing from our users!',
    path: '/contact'
  }
};