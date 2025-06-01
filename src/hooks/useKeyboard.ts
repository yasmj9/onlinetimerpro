import { useEffect } from 'react';

interface UseKeyboardProps {
  onSpace?: () => void;
  onReset?: () => void;
}

export const useKeyboard = ({ onSpace, onReset }: UseKeyboardProps) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      
      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onSpace?.();
          break;
        case 'KeyR':
          event.preventDefault();
          onReset?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [onSpace, onReset]);
};