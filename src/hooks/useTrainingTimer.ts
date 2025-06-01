import { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from './useSound';

interface TrainingConfig {
  exerciseDuration: number;
  restDuration: number;
  numberOfSets: number;
  readyDuration: number;
}

export const useTrainingTimer = () => {
  const [config, setConfig] = useState<TrainingConfig | null>(null);
  const [currentSet, setCurrentSet] = useState(1);
  const [isExercise, setIsExercise] = useState(true);
  const [isReady, setIsReady] = useState(true);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);
  const { getReadyAlert, startAlert, restAlert } = useSound();

  const updateTimer = useCallback(() => {
    if (!isRunning || !config) return;

    const elapsed = performance.now() - startTimeRef.current;
    
    let duration: number;
    if (isReady) {
      duration = config.readyDuration * 1000;
    } else {
      duration = isExercise ? config.exerciseDuration * 1000 : config.restDuration * 1000;
    }
    
    const remaining = Math.max(0, duration - elapsed);
    setTimeLeft(remaining);
    
    if (remaining <= 0) {
      
      if (isReady) {
        startAlert()
        // Ready phase complete, start first exercise
        setIsReady(false);
        setIsExercise(true);
        setCurrentSet(1);
        startTimeRef.current = performance.now();
      } else if (isExercise) {
        restAlert()
        // Exercise complete, switch to rest
        setIsExercise(false);
        startTimeRef.current = performance.now();
      } else {
        // Rest complete, move to next set or finish
        if (currentSet >= config.numberOfSets) {
          setIsRunning(false);
          setIsComplete(true);
          return;
        }
        
        startAlert()
        setCurrentSet(prev => prev + 1);
        setIsExercise(true);
        startTimeRef.current = performance.now();
      }
    }
    
    rafRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isReady, isExercise, currentSet, config, startAlert]);

  useEffect(() => {
    if (isRunning) {
      rafRef.current = requestAnimationFrame(updateTimer);
    }
    
    return () => {
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isRunning, updateTimer]);

  const start = (trainingConfig: TrainingConfig) => {
    getReadyAlert()
    setConfig(trainingConfig);
    setCurrentSet(1);
    setIsExercise(true);
    setIsReady(trainingConfig.readyDuration > 0); // Skip ready phase if duration is 0
    setTimeLeft(trainingConfig.readyDuration > 0 ? trainingConfig.readyDuration * 1000 : trainingConfig.exerciseDuration * 1000);
    setIsComplete(false);
    setIsRunning(true);
    startTimeRef.current = performance.now();
  };

  const pause = () => setIsRunning(false);
  
  const resume = () => {
    if (!isRunning && timeLeft > 0) {
      // Adjust start time to account for the pause
      const pausedDuration = isReady 
        ? (config?.readyDuration || 0) * 1000 - timeLeft
        : (isExercise ? (config?.exerciseDuration || 0) : (config?.restDuration || 0)) * 1000 - timeLeft;
      
      startTimeRef.current = performance.now() - pausedDuration;
      setIsRunning(true);
    }
  };
  
  const reset = () => {
    setIsRunning(false);
    setCurrentSet(1);
    setIsExercise(true);
    setIsReady(true);
    setIsComplete(false);
    if (config) {
      setTimeLeft(config.readyDuration > 0 ? config.readyDuration * 1000 : config.exerciseDuration * 1000);
    }
  };

  const skip = () => {
    if (!config || !isRunning) return;
        
    if (isReady) {
      // Skip ready phase, go directly to exercise
      setIsReady(false);
      setIsExercise(true);
      setCurrentSet(1);
      setTimeLeft(config.exerciseDuration * 1000);
      startTimeRef.current = performance.now();
    } else if (isExercise) {
      // Skip exercise, go to rest
      setIsExercise(false);
      setTimeLeft(config.restDuration * 1000);
      startTimeRef.current = performance.now();
    } else {
      // Skip rest, go to next set or finish
      if (currentSet >= config.numberOfSets) {
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      
      setCurrentSet(prev => prev + 1);
      setIsExercise(true);
      setTimeLeft(config.exerciseDuration * 1000);
      startTimeRef.current = performance.now();
    }
  };

  // Calculate overall progress including ready phase
  const getTotalProgress = () => {
    if (!config) return 0;
    
    if (isReady) return 0;
    
    const completedSets = currentSet - 1;
    const totalPhases = config.numberOfSets * 2; // Each set has work + rest
    const completedPhases = completedSets * 2 + (isExercise ? 0 : 1);
    
    return Math.min(completedPhases / totalPhases, 1);
  };

  const totalSets = config?.numberOfSets || 0;
  const progress = getTotalProgress();

  // Get current phase name for screen readers
  const getCurrentPhase = () => {
    if (isReady) return 'Get Ready';
    return isExercise ? 'Exercise' : 'Rest';
  };

  // Get time remaining in current phase
  const getPhaseTimeRemaining = () => timeLeft;

  // Check if timer can be started
  const canStart = () => !isRunning && !isComplete;

  // Check if timer can be paused/resumed
  const canPauseResume = () => isRunning || (!isRunning && timeLeft > 0 && !isComplete);

  // Check if timer can be reset
  const canReset = () => config !== null;

  // Check if current phase can be skipped
  const canSkip = () => isRunning && !isComplete;

  return {
    // State
    config,
    currentSet,
    totalSets,
    isExercise,
    isReady,
    timeLeft,
    isRunning,
    isComplete,
    progress,
    
    // Actions
    start,
    pause,
    resume,
    reset,
    skip,
    
    // Computed properties
    getCurrentPhase,
    getPhaseTimeRemaining,
    
    // Capability checks
    canStart,
    canPauseResume,
    canReset,
    canSkip
  };
};