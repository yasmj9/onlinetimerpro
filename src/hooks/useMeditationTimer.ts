import { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from './useSound';

interface MeditationConfig {
  meditationDuration: number; // minutes
  preparationTime: number; // seconds
  bellInterval: number; // seconds (0 = no bells)
  sessionType: 'guided' | 'silent' | 'breathing';
}

type MeditationPhase = 'preparation' | 'meditation' | 'complete';
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

interface BreathingPattern {
  inhale: number;
  hold: number;
  exhale: number;
  pause: number;
}

export const useMeditationTimer = () => {
  // Core timer state
  const [config, setConfig] = useState<MeditationConfig | null>(null);
  const [currentPhase, setCurrentPhase] = useState<MeditationPhase>('preparation');
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Breathing-specific state
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [breathingCycle, setBreathingCycle] = useState(1);
  
  // Refs for timer management
  const startTimeRef = useRef<number>(0);
  const phaseStartTimeRef = useRef<number>(0);
  const rafRef = useRef<number | undefined>(undefined);
  const lastBellTimeRef = useRef<number>(0);
  const breathingPatternRef = useRef<BreathingPattern>({
    inhale: 4000,   // 4 seconds
    hold: 7000,     // 7 seconds  
    exhale: 8000,   // 8 seconds
    pause: 1000     // 1 second
  });
  
  const { getReadyAlert, startAlert, restAlert } = useSound();

  // Get current phase duration in milliseconds
  const getCurrentPhaseDuration = useCallback(() => {
    if (!config) return 0;
    
    switch (currentPhase) {
      case 'preparation':
        return config.preparationTime * 1000;
      case 'meditation':
        return config.meditationDuration * 60 * 1000;
      default:
        return 0;
    }
  }, [config, currentPhase]);

  // Get total breathing cycle duration
  const getBreathingCycleDuration = useCallback(() => {
    const pattern = breathingPatternRef.current;
    return pattern.inhale + pattern.hold + pattern.exhale + pattern.pause;
  }, []);

  // Update breathing phase based on elapsed time
  const updateBreathingPhase = useCallback((elapsed: number) => {
    const pattern = breathingPatternRef.current;
    const cycleDuration = getBreathingCycleDuration();
    const cyclePosition = elapsed % cycleDuration;
    
    let newPhase: BreathingPhase;
    
    if (cyclePosition < pattern.inhale) {
      newPhase = 'inhale';
    } else if (cyclePosition < pattern.inhale + pattern.hold) {
      newPhase = 'hold';
    } else if (cyclePosition < pattern.inhale + pattern.hold + pattern.exhale) {
      newPhase = 'exhale';
    } else {
      newPhase = 'pause';
    }
    
    // Update phase and cycle count
    if (newPhase !== breathingPhase) {
      setBreathingPhase(newPhase);
      
      // Increment cycle when completing a full cycle (entering new inhale)
      if (newPhase === 'inhale' && breathingPhase === 'pause') {
        setBreathingCycle(prev => prev + 1);
      }
    }
  }, [breathingPhase, getBreathingCycleDuration]);

  // Handle bell intervals
  const handleBellInterval = useCallback((currentTime: number) => {
    if (!config || config.bellInterval <= 0 || currentPhase !== 'meditation') return;
    
    const timeSinceLastBell = currentTime - lastBellTimeRef.current;
    const bellIntervalMs = config.bellInterval * 1000;
    
    if (timeSinceLastBell >= bellIntervalMs) {
      restAlert(); // Use rest alert as meditation bell
      lastBellTimeRef.current = currentTime;
    }
  }, [config, currentPhase, restAlert]);

  // Transition to next phase
  const transitionToNextPhase = useCallback(() => {
    if (!config) return;
    
    if (currentPhase === 'preparation') {
      // Move from preparation to meditation
      startAlert();
      setCurrentPhase('meditation');
      const meditationDuration = config.meditationDuration * 60 * 1000;
      setTimeLeft(meditationDuration);
      setTotalDuration(meditationDuration);
      startTimeRef.current = performance.now();
      phaseStartTimeRef.current = performance.now();
      lastBellTimeRef.current = performance.now();
      
      // Initialize breathing if needed
      if (config.sessionType === 'breathing') {
        setBreathingPhase('inhale');
        setBreathingCycle(1);
      }
    } else if (currentPhase === 'meditation') {
      // Meditation complete
      restAlert(); // Final completion bell
      setCurrentPhase('complete');
      setIsRunning(false);
      setIsComplete(true);
    }
  }, [config, currentPhase, startAlert, restAlert]);

  // Main timer update function
  const updateTimer = useCallback(() => {
    if (!isRunning || !config || currentPhase === 'complete') return;

    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const phaseDuration = getCurrentPhaseDuration();
    const remaining = Math.max(0, phaseDuration - elapsed);
    
    setTimeLeft(remaining);
    
    // Handle breathing pattern for breathing sessions
    if (config.sessionType === 'breathing' && currentPhase === 'meditation') {
      const meditationElapsed = now - phaseStartTimeRef.current;
      updateBreathingPhase(meditationElapsed);
    }
    
    // Handle bell intervals
    if (currentPhase === 'meditation') {
      handleBellInterval(now);
    }
    
    // Check if phase is complete
    if (remaining <= 0) {
      transitionToNextPhase();
      return;
    }
    
    rafRef.current = requestAnimationFrame(updateTimer);
  }, [
    isRunning, 
    config, 
    currentPhase, 
    getCurrentPhaseDuration,
    updateBreathingPhase,
    handleBellInterval,
    transitionToNextPhase
  ]);

  // Start timer effect
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

  // Public methods
  const start = useCallback((meditationConfig: MeditationConfig) => {
    getReadyAlert();
    setConfig(meditationConfig);
    setIsComplete(false);
    setIsRunning(true);
    
    // Determine starting phase
    const hasPreparation = meditationConfig.preparationTime > 0;
    const startingPhase: MeditationPhase = hasPreparation ? 'preparation' : 'meditation';
    
    setCurrentPhase(startingPhase);
    
    // Set initial time and duration
    if (hasPreparation) {
      const prepDuration = meditationConfig.preparationTime * 1000;
      setTimeLeft(prepDuration);
      setTotalDuration(prepDuration);
    } else {
      const medDuration = meditationConfig.meditationDuration * 60 * 1000;
      setTimeLeft(medDuration);
      setTotalDuration(medDuration);
      
      // Initialize breathing for direct meditation start
      if (meditationConfig.sessionType === 'breathing') {
        setBreathingPhase('inhale');
        setBreathingCycle(1);
      }
    }
    
    // Initialize timing references
    const now = performance.now();
    startTimeRef.current = now;
    phaseStartTimeRef.current = now;
    lastBellTimeRef.current = now;
  }, [getReadyAlert]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const resume = useCallback(() => {
    if (!isRunning && timeLeft > 0 && !isComplete && config) {
      const now = performance.now();
      const phaseDuration = getCurrentPhaseDuration();
      const pausedDuration = phaseDuration - timeLeft;
      
      // Adjust timing references to account for pause
      startTimeRef.current = now - pausedDuration;
      
      if (currentPhase === 'meditation') {
        phaseStartTimeRef.current = now - pausedDuration;
        
        // Adjust bell timing
        if (config.bellInterval > 0) {
          const bellIntervalMs = config.bellInterval * 1000;
          const bellOffset = pausedDuration % bellIntervalMs;
          lastBellTimeRef.current = now - bellOffset;
        }
      }
      
      setIsRunning(true);
    }
  }, [isRunning, timeLeft, isComplete, config, currentPhase, getCurrentPhaseDuration]);
  
  const reset = useCallback(() => {
    setIsRunning(false);
    setCurrentPhase('preparation');
    setIsComplete(false);
    setConfig(null);
    setTimeLeft(0);
    setTotalDuration(0);
    setBreathingPhase('inhale');
    setBreathingCycle(1);
    
    // Clear timer reference
    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
    }
  }, []);

  // Calculate progress within current phase
  const progress = totalDuration > 0 ? Math.min((totalDuration - timeLeft) / totalDuration, 1) : 0;

  // Calculate overall session progress
  const getOverallProgress = useCallback(() => {
    if (!config) return 0;
    
    const prepDuration = config.preparationTime * 1000;
    const medDuration = config.meditationDuration * 60 * 1000;
    const totalSessionDuration = prepDuration + medDuration;
    
    if (totalSessionDuration === 0) return 0;
    
    if (currentPhase === 'preparation') {
      return (prepDuration - timeLeft) / totalSessionDuration;
    } else if (currentPhase === 'meditation') {
      const prepComplete = prepDuration / totalSessionDuration;
      const medProgress = (medDuration - timeLeft) / totalSessionDuration;
      return prepComplete + medProgress;
    }
    
    return 1;
  }, [config, currentPhase, timeLeft]);

  // Get breathing phase progress (for visual indicators)
  const getBreathingPhaseProgress = useCallback(() => {
    if (!config || config.sessionType !== 'breathing' || currentPhase !== 'meditation') {
      return 0;
    }
    
    const pattern = breathingPatternRef.current;
    const now = performance.now();
    const meditationElapsed = now - phaseStartTimeRef.current;
    const cycleDuration = getBreathingCycleDuration();
    const cyclePosition = meditationElapsed % cycleDuration;
    
    let phaseStart = 0;
    let phaseDuration = 0;
    
    if (cyclePosition < pattern.inhale) {
      phaseStart = 0;
      phaseDuration = pattern.inhale;
    } else if (cyclePosition < pattern.inhale + pattern.hold) {
      phaseStart = pattern.inhale;
      phaseDuration = pattern.hold;
    } else if (cyclePosition < pattern.inhale + pattern.hold + pattern.exhale) {
      phaseStart = pattern.inhale + pattern.hold;
      phaseDuration = pattern.exhale;
    } else {
      phaseStart = pattern.inhale + pattern.hold + pattern.exhale;
      phaseDuration = pattern.pause;
    }
    
    const phaseProgress = (cyclePosition - phaseStart) / phaseDuration;
    return Math.min(Math.max(phaseProgress, 0), 1);
  }, [config, currentPhase, getBreathingCycleDuration]);

  // Get estimated completion time
  const getEstimatedEndTime = useCallback(() => {
    if (!config) return null;
    
    const now = new Date();
    let remainingMs = timeLeft;
    
    // Add remaining phases
    if (currentPhase === 'preparation') {
      remainingMs += config.meditationDuration * 60 * 1000;
    }
    
    return new Date(now.getTime() + remainingMs);
  }, [config, currentPhase, timeLeft]);

  // Get contextual guidance text for guided sessions
  const getGuidanceText = useCallback(() => {
    if (!config || config.sessionType !== 'guided') return '';
    
    if (currentPhase === 'preparation') {
      return 'Find a comfortable seated position. Close your eyes and take three deep breaths to center yourself.';
    }
    
    const sessionProgress = progress;
    
    if (sessionProgress < 0.15) {
      return 'Begin by focusing on your natural breath. Notice the gentle rise and fall of your chest.';
    } else if (sessionProgress < 0.35) {
      return 'When thoughts arise, acknowledge them gently and return your attention to your breathing.';
    } else if (sessionProgress < 0.65) {
      return 'Rest in the space of awareness. You are not trying to stop thoughts, just observing them.';
    } else if (sessionProgress < 0.85) {
      return 'Continue to breathe naturally. Feel the peace and stillness within you.';
    } else {
      return 'Slowly begin to bring your attention back. Wiggle your fingers and toes gently.';
    }
  }, [config, currentPhase, progress]);

  // Capability checks
  const canStart = !isRunning && !isComplete;
  const canPauseResume = isRunning || (!isRunning && timeLeft > 0 && !isComplete);
  const canReset = config !== null;

  return {
    // Core state
    config,
    currentPhase,
    timeLeft,
    totalDuration,
    isRunning,
    isComplete,
    progress,
    
    // Breathing state
    breathingPhase,
    breathingCycle,
    
    // Actions
    start,
    pause,
    resume,
    reset,
    
    // Computed values
    getOverallProgress,
    getBreathingPhaseProgress,
    getEstimatedEndTime,
    getGuidanceText,
    
    // Capability checks
    canStart,
    canPauseResume,
    canReset
  };
};