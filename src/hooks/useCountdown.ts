import { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from './useSound';

interface UseCountdownProps {
  onComplete?: () => void;
}

export const useCountdown = ({ onComplete }: UseCountdownProps = {}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(0);
  
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);
  const { playAlert } = useSound();

  const updateCountdown = useCallback(() => {
    if (!isRunning || timeLeft <= 0) return;

    const elapsed = performance.now() - startTimeRef.current;
    const remaining = Math.max(0, initialTime - elapsed);
    
    setTimeLeft(remaining);
    
    if (remaining <= 0) {
      setIsRunning(false);
      playAlert();
      onComplete?.();
      return;
    }
    
    rafRef.current = requestAnimationFrame(updateCountdown);
  }, [isRunning, timeLeft, initialTime, onComplete, playAlert]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      startTimeRef.current = performance.now() - (initialTime - timeLeft);
      rafRef.current = requestAnimationFrame(updateCountdown);
    }
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning, updateCountdown]);

  const start = (duration: number) => {
    setInitialTime(duration);
    setTimeLeft(duration);
    setIsRunning(true);
  };

  const pause = () => setIsRunning(false);
  const resume = () => setIsRunning(true);
  const reset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  const progress = initialTime > 0 ? (initialTime - timeLeft) / initialTime : 0;

  return {
    timeLeft,
    isRunning,
    progress,
    start,
    pause,
    resume,
    reset
  };
};