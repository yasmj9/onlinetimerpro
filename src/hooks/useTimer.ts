import { useState, useEffect, useRef } from 'react';

export const useTimer = () => {
  const [time, setTime] = useState(new Date());
  const rafRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date());
      rafRef.current = requestAnimationFrame(updateTime);
    };
    
    rafRef.current = requestAnimationFrame(updateTime);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return time;
};