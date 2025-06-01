import { useCallback } from 'react';

export const useSound = () => {
  const playAlert = useCallback(() => {
    try {
      const audio = new Audio('/sounds/alert.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  }, []);

  const startAlert = useCallback(() => {
    try {
      const audio = new Audio('/sounds/starts.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  }, []);

  const restAlert = useCallback(() => {
    try {
      const audio = new Audio('/sounds/rest.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  }, []);

  const getReadyAlert = useCallback(() => {
    try {
      const audio = new Audio('/sounds/get_ready.mp3');
      audio.volume = 0.5;
      audio.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play alert sound:', error);
    }
  }, []);

  return { getReadyAlert, startAlert, restAlert, playAlert };
};
