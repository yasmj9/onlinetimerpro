// components/timers/FocusTimer.js
import { useState, useEffect, useRef } from 'react';
import useAudio from '../../hooks/useAudio';
import styles from '../../styles/index.module.css';

const FocusTimer = ({ config, onComplete, onReset }) => {
    const [timerState, setTimerState] = useState({
        currentPhase: 'focus', // 'focus', 'shortBreak', 'longBreak', 'complete'
        timeRemaining: config.focusTime,
        currentCycle: 1,
        totalCycles: config.pomodoroSets,
        isPaused: false,
        isActive: false,
        completedFocusSessions: 0
    });

    const intervalRef = useRef(null);
    const { soundEnabled, audioReady, playAudio, stopAllAudio, toggleSound } = useAudio();

    // Timer logic
    useEffect(() => {
        if (timerState.isActive && !timerState.isPaused) {
            intervalRef.current = setInterval(() => {
                setTimerState(prev => {
                    if (prev.timeRemaining <= 1) {
                        return handlePhaseTransition(prev);
                    }
                    return {
                        ...prev,
                        timeRemaining: prev.timeRemaining - 1
                    };
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }

        return () => clearInterval(intervalRef.current);
    }, [timerState.isActive, timerState.isPaused, config, playAudio, onComplete]);

    const handlePhaseTransition = (prev) => {
        if (prev.currentPhase === 'focus') {
            // Focus session complete
            const newCompletedSessions = prev.completedFocusSessions + 1;

            if (prev.currentCycle < config.pomodoroSets) {
                // Determine break type (long break every 4 cycles)
                const isLongBreak = newCompletedSessions % 4 === 0;
                const breakTime = isLongBreak ? config.longBreak : config.shortBreak;
                playAudio('rest');

                return {
                    ...prev,
                    currentPhase: isLongBreak ? 'longBreak' : 'shortBreak',
                    timeRemaining: breakTime,
                    completedFocusSessions: newCompletedSessions
                };
            } else {
                // All cycles complete
                onComplete();
                return {
                    ...prev,
                    currentPhase: 'complete',
                    timeRemaining: 0,
                    isActive: false,
                    completedFocusSessions: newCompletedSessions
                };
            }
        } else {
            // Break complete, start next focus session
            playAudio('startTraining');
            return {
                ...prev,
                currentPhase: 'focus',
                timeRemaining: config.focusTime,
                currentCycle: prev.currentCycle + 1
            };
        }
    };

    const startTimer = () => {
        playAudio('startTraining');
        setTimerState(prev => ({ ...prev, isActive: true, isPaused: false }));
    };

    const pauseTimer = () => {
        setTimerState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        if (!timerState.isPaused) {
            stopAllAudio();
        }
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        stopAllAudio();
        setTimerState({
            currentPhase: 'focus',
            timeRemaining: config.focusTime,
            currentCycle: 1,
            totalCycles: config.pomodoroSets,
            isPaused: false,
            isActive: false,
            completedFocusSessions: 0
        });
        onReset();
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getPhaseInfo = () => {
        switch (timerState.currentPhase) {
            case 'focus':
                return { text: 'FOCUS TIME', icon: '☕', color: styles.phaseFocus };
            case 'shortBreak':
                return { text: 'SHORT BREAK', icon: '☕', color: styles.phaseShortBreak };
            case 'longBreak':
                return { text: 'LONG BREAK', icon: '🌟', color: styles.phaseLongBreak };
            case 'complete':
                return { text: 'SESSION COMPLETE!', icon: '🎉', color: styles.phaseComplete };
            default:
                return { text: '', icon: '', color: '' };
        }
    };

    const getProgressPercentage = () => {
        let totalTime;
        if (timerState.currentPhase === 'focus') {
            totalTime = config.focusTime;
        } else if (timerState.currentPhase === 'shortBreak') {
            totalTime = config.shortBreak;
        } else {
            totalTime = config.longBreak;
        }
        const elapsed = totalTime - timerState.timeRemaining;
        return totalTime > 0 ? (elapsed / totalTime) * 100 : 0;
    };

    const getFocusTip = () => {
        const tips = [
            "Eliminate distractions - close unnecessary tabs",
            "Define a clear goal for this focus session",
            "Keep a notepad for capturing random thoughts",
            "Stay hydrated but avoid heavy meals",
            "Use this time for your most important task"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    };

    const getBreakTip = () => {
        const tips = [
            "Step away from your workspace",
            "Do some light stretching or movement",
            "Hydrate and rest your eyes",
            "Avoid checking social media",
            "Take a few deep breaths"
        ];
        return tips[Math.floor(Math.random() * tips.length)];
    };

    const phaseInfo = getPhaseInfo();

    return (
        <div className={`${styles.timerDisplay} ${styles.focusMode}`}>
            {/* Phase Indicator */}
            <div className={`${styles.phaseIndicator} ${phaseInfo.color}`}>
                <div className={styles.phaseIcon}>{phaseInfo.icon}</div>
                <h2 className={styles.phaseText}>{phaseInfo.text}</h2>
            </div>

            {/* Digital Time Display */}
            <div className={styles.timeDisplay}>
                <div className={styles.digitalTime}>
                    <span className={styles.timeNumber}>{formatTime(timerState.timeRemaining)}</span>
                </div>
            </div>

            {/* Cycle Counter */}
            {timerState.currentPhase !== 'complete' && (
                <div className={styles.setCounter}>
                    <span className={styles.setText}>
                        Pomodoro {timerState.currentCycle} of {timerState.totalCycles}
                    </span>
                    <div className={styles.completedSessions}>
                        <span className={styles.sessionCount}>
                            ☕ Completed: {timerState.completedFocusSessions}
                        </span>
                    </div>
                </div>
            )}

            {/* Session Info */}
            <div className={styles.sessionInfo}>
                <div className={styles.modeIndicator}>
                    <span className={styles.modeIcon}>☕</span>
                    <span className={styles.modeName}>Pomodoro Technique</span>
                </div>
            </div>

            {/* Tips */}
            <div className={styles.focusTips}>
                <div className={styles.tipCard}>
                    <h4>💡 {timerState.currentPhase === 'focus' ? 'Focus Tip' : 'Break Tip'}</h4>
                    <p>{timerState.currentPhase === 'focus' ? getFocusTip() : getBreakTip()}</p>
                </div>
            </div>

            {/* Audio Status */}
            {!audioReady && (
                <div className={styles.audioStatus}>
                    <span className={styles.audioLoading}>🔊 Loading audio...</span>
                </div>
            )}

            {/* Controls */}
            <div className={styles.controls}>
                {!timerState.isActive ? (
                    <button
                        onClick={startTimer}
                        className={`${styles.controlButton} ${styles.startButton}`}
                        disabled={!audioReady}
                    >
                        {audioReady ? '▶ Start Focus' : 'Loading...'}
                    </button>
                ) : (
                    <button
                        onClick={pauseTimer}
                        className={`${styles.controlButton} ${timerState.isPaused ? styles.resumeButton : styles.pauseButton}`}
                    >
                        {timerState.isPaused ? '▶ Resume' : '⏸ Pause'}
                    </button>
                )}

                <button onClick={resetTimer} className={`${styles.controlButton} ${styles.resetButton}`}>
                    🔄 Reset
                </button>

                <button
                    onClick={toggleSound}
                    className={`${styles.controlButton} ${soundEnabled ? styles.soundOn : styles.soundOff}`}
                    title={soundEnabled ? 'Sound On' : 'Sound Off'}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </button>
            </div>

            {/* Pomodoro Progress Tracker */}
            <div className={styles.pomodoroTracker}>
                <h4>Session Progress</h4>
                <div className={styles.pomodoroGrid}>
                    {Array.from({ length: config.pomodoroSets }, (_, index) => (
                        <div
                            key={index}
                            className={`${styles.pomodoroItem} ${index < timerState.completedFocusSessions ? styles.completed :
                                index === timerState.currentCycle - 1 ? styles.current : styles.pending
                                }`}
                        >
                            ☕
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FocusTimer;