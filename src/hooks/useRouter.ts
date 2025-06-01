import { useState, useCallback } from 'react';

export type PageType = 'home' | 'privacy' | 'terms' | 'about' | 'contact';

export const useRouter = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  const navigate = useCallback((page: PageType) => {
    setCurrentPage(page);
    // Update URL without page refresh
    window.history.pushState({}, '', page === 'home' ? '/' : `/${page}`);
  }, []);

  const goBack = useCallback(() => {
    navigate('home');
  }, [navigate]);

  return {
    currentPage,
    navigate,
    goBack
  };
};