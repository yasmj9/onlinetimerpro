import { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from './useSound';

interface LaptopWorkConfig {
  workDuration: number; // minutes
  shortBreakDuration: number; // minutes
  longBreakDuration: number; // minutes
  sessionsUntilLongBreak: number;
}

export const useLaptopWorkTimer = () => {
  const [config, setConfig] = useState<LaptopWorkConfig | null>(null);
  const [currentSession, setCurrentSession] = useState(1);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [isWork, setIsWork] = useState(true);
  const [isShortBreak, setIsShortBreak] = useState(false);
  const [isLongBreak, setIsLongBreak] = useState(false);
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
    if (isWork) {
      duration = config.workDuration * 60 * 1000;
    } else if (isShortBreak) {
      duration = config.shortBreakDuration * 60 * 1000;
    } else {
      duration = config.longBreakDuration * 60 * 1000;
    }
    
    const remaining = Math.max(0, duration - elapsed);
    setTimeLeft(remaining);
    
    if (remaining <= 0) {
      if (isWork) {
        // Work session complete
        setCompletedSessions(prev => prev + 1);
        
        // Check if it's time for a long break
        if (currentSession % config.sessionsUntilLongBreak === 0) {
          // Long break time
          restAlert();
          setIsWork(false);
          setIsShortBreak(false);
          setIsLongBreak(true);
          startTimeRef.current = performance.now();
        } else {
          // Short break time
          restAlert();
          setIsWork(false);
          setIsShortBreak(true);
          setIsLongBreak(false);
          startTimeRef.current = performance.now();
        }
      } else {
        // Break complete
        if (currentSession >= getTotalSessions()) {
          // All sessions complete
          setIsRunning(false);
          setIsComplete(true);
          return;
        }
        
        // Start next work session
        startAlert();
        setCurrentSession(prev => prev + 1);
        setIsWork(true);
        setIsShortBreak(false);
        setIsLongBreak(false);
        startTimeRef.current = performance.now();
      }
    }
    
    rafRef.current = requestAnimationFrame(updateTimer);
  }, [isRunning, isWork, isShortBreak, isLongBreak, currentSession, config, startAlert, restAlert]);

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

  const getTotalSessions = () => {
    if (!config) return 0;
    // Calculate total sessions: each cycle has work sessions + breaks
    // For simplicity, we'll count work sessions only
    return config.sessionsUntilLongBreak * 2; // 2 cycles for a good work session
  };

  const start = (laptopWorkConfig: LaptopWorkConfig) => {
    getReadyAlert();
    setConfig(laptopWorkConfig);
    setCurrentSession(1);
    setCompletedSessions(0);
    setIsWork(true);
    setIsShortBreak(false);
    setIsLongBreak(false);
    setTimeLeft(laptopWorkConfig.workDuration * 60 * 1000);
    setIsComplete(false);
    setIsRunning(true);
    startTimeRef.current = performance.now();
  };

  const pause = () => setIsRunning(false);
  
  const resume = () => {
    if (!isRunning && timeLeft > 0 && config) {
      // Adjust start time to account for the pause
      let duration: number;
      if (isWork) {
        duration = config.workDuration * 60 * 1000;
      } else if (isShortBreak) {
        duration = config.shortBreakDuration * 60 * 1000;
      } else {
        duration = config.longBreakDuration * 60 * 1000;
      }
      
      const pausedDuration = duration - timeLeft;
      startTimeRef.current = performance.now() - pausedDuration;
      setIsRunning(true);
    }
  };
  
  const reset = () => {
    setIsRunning(false);
    setCurrentSession(1);
    setCompletedSessions(0);
    setIsWork(true);
    setIsShortBreak(false);
    setIsLongBreak(false);
    setIsComplete(false);
    setConfig(null);
    setTimeLeft(0);
  };

  const skip = () => {
    if (!config || !isRunning) return;
        
    if (isWork) {
      // Skip work, go to appropriate break
      setCompletedSessions(prev => prev + 1);
      
      if (currentSession % config.sessionsUntilLongBreak === 0) {
        // Long break time
        restAlert();
        setIsWork(false);
        setIsShortBreak(false);
        setIsLongBreak(true);
        setTimeLeft(config.longBreakDuration * 60 * 1000);
      } else {
        // Short break time
        restAlert();
        setIsWork(false);
        setIsShortBreak(true);
        setIsLongBreak(false);
        setTimeLeft(config.shortBreakDuration * 60 * 1000);
      }
      startTimeRef.current = performance.now();
    } else {
      // Skip break, go to next work session or finish
      if (currentSession >= getTotalSessions()) {
        setIsRunning(false);
        setIsComplete(true);
        return;
      }
      
      startAlert();
      setCurrentSession(prev => prev + 1);
      setIsWork(true);
      setIsShortBreak(false);
      setIsLongBreak(false);
      setTimeLeft(config.workDuration * 60 * 1000);
      startTimeRef.current = performance.now();
    }
  };

  // Calculate overall progress
  const getTotalProgress = () => {
    if (!config) return 0;
    
    const totalPossibleSessions = getTotalSessions();
    const currentProgress = (completedSessions + (isWork ? 0 : 0.5)) / totalPossibleSessions;
    
    return Math.min(currentProgress, 1);
  };

  // Calculate progress within current phase
  const getPhaseProgress = () => {
    if (!config) return 0;
    
    let totalDuration: number;
    if (isWork) {
      totalDuration = config.workDuration * 60 * 1000;
    } else if (isShortBreak) {
      totalDuration = config.shortBreakDuration * 60 * 1000;
    } else {
      totalDuration = config.longBreakDuration * 60 * 1000;
    }
    
    return totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;
  };

  const totalSessions = getTotalSessions();
  const progress = getPhaseProgress();

  // Get current phase name for screen readers
  const getCurrentPhase = () => {
    if (isWork) return 'Work';
    if (isShortBreak) return 'Short Break';
    if (isLongBreak) return 'Long Break';
    return 'Ready';
  };

  // Get estimated completion time
  const getEstimatedCompletion = () => {
    if (!config) return null;
    
    const now = new Date();
    let remainingTime = timeLeft;
    
    // Add remaining sessions time
    const remainingSessions = totalSessions - currentSession;
    if (remainingSessions > 0) {
      remainingTime += remainingSessions * (config.workDuration * 60 * 1000);
      
      // Add break times
      const remainingShortBreaks = Math.floor(remainingSessions / config.sessionsUntilLongBreak) * (config.sessionsUntilLongBreak - 1);
      const remainingLongBreaks = Math.floor(remainingSessions / config.sessionsUntilLongBreak);
      
      remainingTime += remainingShortBreaks * (config.shortBreakDuration * 60 * 1000);
      remainingTime += remainingLongBreaks * (config.longBreakDuration * 60 * 1000);
    }
    
    return new Date(now.getTime() + remainingTime);
  };

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
    currentSession,
    totalSessions,
    completedSessions,
    isWork,
    isShortBreak,
    isLongBreak,
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
    getEstimatedCompletion,
    getTotalProgress,
    
    // Capability checks
    canStart,
    canPauseResume,
    canReset,
    canSkip
  };
};