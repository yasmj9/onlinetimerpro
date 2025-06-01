import { useState, useEffect } from 'react';

export const useAdBlockDetector = () => {
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const detectAdBlock = async () => {
      try {
        // Create a test element that ad blockers typically block
        const testElement = document.createElement('div');
        testElement.innerHTML = '&nbsp;';
        testElement.className = 'adsbox';
        testElement.style.position = 'absolute';
        testElement.style.left = '-10000px';
        
        document.body.appendChild(testElement);
        
        // Wait a bit for ad blockers to act
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const isBlocked = testElement.offsetHeight === 0;
        setIsAdBlockActive(isBlocked);
        
        document.body.removeChild(testElement);
      } catch (error) {
        console.warn('Ad block detection failed:', error);
        setIsAdBlockActive(false);
      } finally {
        setIsChecking(false);
      }
    };

    detectAdBlock();
  }, []);

  return { isAdBlockActive, isChecking };
};