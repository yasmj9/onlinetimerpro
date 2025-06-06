// components/timers/IntervalTimer.js
import { useState, useEffect, useRef } from 'react';
import useAudio from '../../hooks/useAudio';
import styles from '../../styles/index.module.css';

const IntervalTimer = ({ config, onComplete, onReset }) => {
    const [timerState, setTimerState] = useState({
        currentPhase: 'ready', // 'ready', 'train', 'rest', 'complete'
        timeRemaining: config.getReadyTime,
        currentSet: 1,
        totalSets: config.numberOfSets,
        isPaused: false,
        isActive: false
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
        if (prev.currentPhase === 'ready') {
            playAudio('startTraining');
            return {
                ...prev,
                currentPhase: 'train',
                timeRemaining: config.trainingTime
            };
        } else if (prev.currentPhase === 'train') {
            if (prev.currentSet < config.numberOfSets) {
                playAudio('rest');
                return {
                    ...prev,
                    currentPhase: 'rest',
                    timeRemaining: config.restTime
                };
            } else {
                // Workout complete
                onComplete();
                return {
                    ...prev,
                    currentPhase: 'complete',
                    timeRemaining: 0,
                    isActive: false
                };
            }
        } else if (prev.currentPhase === 'rest') {
            playAudio('startTraining');
            return {
                ...prev,
                currentPhase: 'train',
                timeRemaining: config.trainingTime,
                currentSet: prev.currentSet + 1
            };
        }
        return prev;
    };

    const startTimer = () => {
        playAudio('getReady');
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
            currentPhase: 'ready',
            timeRemaining: config.getReadyTime,
            currentSet: 1,
            totalSets: config.numberOfSets,
            isPaused: false,
            isActive: false
        });
        onReset();
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getPhaseInfo = () => {
        switch (timerState.currentPhase) {
            case 'ready':
                return { text: 'GET READY', icon: '⏰', color: styles.phaseReady };
            case 'train':
                return { text: 'TRAIN', icon: '💪', color: styles.phaseTrain };
            case 'rest':
                return { text: 'REST', icon: '😌', color: styles.phaseRest };
            case 'complete':
                return { text: 'WORKOUT COMPLETE!', icon: '🎉', color: styles.phaseComplete };
            default:
                return { text: '', icon: '', color: '' };
        }
    };

    const getProgressPercentage = () => {
        let totalTime;
        if (timerState.currentPhase === 'ready') {
            totalTime = config.getReadyTime;
        } else if (timerState.currentPhase === 'train') {
            totalTime = config.trainingTime;
        } else {
            totalTime = config.restTime;
        }
        const elapsed = totalTime - timerState.timeRemaining;
        return totalTime > 0 ? (elapsed / totalTime) * 100 : 0;
    };

    const phaseInfo = getPhaseInfo();

    return (
        <div className={`${styles.timerDisplay} ${styles.intervalMode}`}>
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

            {/* Set Counter */}
            {timerState.currentPhase !== 'complete' && (
                <div className={styles.setCounter}>
                    <span className={styles.setText}>
                        Set {timerState.currentSet} of {timerState.totalSets}
                    </span>
                </div>
            )}

            {/* Session Info */}
            <div className={styles.sessionInfo}>
                <div className={styles.modeIndicator}>
                    <span className={styles.modeIcon}>💪</span>
                    <span className={styles.modeName}>Interval Training</span>
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
                        {audioReady ? '▶ Start Workout' : 'Loading...'}
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

            {/* Development Audio Preview */}
            {process.env.NODE_ENV === 'development' && audioReady && (
                <div className={styles.audioPreview}>
                    <h4>Audio Preview (Dev Only)</h4>
                    <button onClick={() => playAudio('getReady')} className={styles.previewButton}>
                        Test "Get Ready"
                    </button>
                    <button onClick={() => playAudio('startTraining')} className={styles.previewButton}>
                        Test "Start Training"
                    </button>
                    <button onClick={() => playAudio('rest')} className={styles.previewButton}>
                        Test "Rest"
                    </button>
                </div>
            )}
        </div>
    );
};

export default IntervalTimer;