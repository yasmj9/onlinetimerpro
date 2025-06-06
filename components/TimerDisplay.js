// components/TimerDisplay.js
import { useState, useEffect, useRef } from 'react';
import useAudio from '../hooks/useAudio';
import styles from '../styles/index.module.css';

const TimerDisplay = ({ timerConfig, onComplete, onReset }) => {
    const [timerState, setTimerState] = useState({
        currentPhase: 'ready', // 'ready', 'train', 'rest', 'complete'
        timeRemaining: timerConfig.getReadyTime,
        currentSet: 1,
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
                        // Determine next phase and play appropriate sound
                        if (prev.currentPhase === 'ready') {
                            playAudio('startTraining');
                            return {
                                ...prev,
                                currentPhase: 'train',
                                timeRemaining: timerConfig.trainingTime
                            };
                        } else if (prev.currentPhase === 'train') {
                            if (prev.currentSet < timerConfig.numberOfSets) {
                                playAudio('rest');
                                return {
                                    ...prev,
                                    currentPhase: 'rest',
                                    timeRemaining: timerConfig.restTime
                                };
                            } else {
                                // Workout complete - could play completion sound here
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
                                timeRemaining: timerConfig.trainingTime,
                                currentSet: prev.currentSet + 1
                            };
                        }
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
    }, [timerState.isActive, timerState.isPaused, timerConfig, playAudio, onComplete]);

    const startTimer = () => {
        // Play get ready sound when starting
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
            timeRemaining: timerConfig.getReadyTime,
            currentSet: 1,
            isPaused: false,
            isActive: false
        });
        onReset();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : secs.toString();
    };

    const getPhaseText = () => {
        switch (timerState.currentPhase) {
            case 'ready': return 'GET READY';
            case 'train': return 'TRAIN';
            case 'rest': return 'REST';
            case 'complete': return 'WORKOUT COMPLETE!';
            default: return '';
        }
    };

    const getPhaseColor = () => {
        switch (timerState.currentPhase) {
            case 'ready': return styles.phaseReady;
            case 'train': return styles.phaseTrain;
            case 'rest': return styles.phaseRest;
            case 'complete': return styles.phaseComplete;
            default: return '';
        }
    };

    return (
        <div className={styles.timerDisplay}>
            <div className={`${styles.phaseIndicator} ${getPhaseColor()}`}>
                <h2 className={styles.phaseText}>{getPhaseText()}</h2>
            </div>

            <div className={styles.timeDisplay}>
                <div className={styles.timeNumber}>{formatTime(timerState.timeRemaining)}</div>
            </div>

            {timerState.currentPhase !== 'complete' && (
                <div className={styles.setCounter}>
                    <span className={styles.setText}>
                        Set {timerState.currentSet} of {timerConfig.numberOfSets}
                    </span>
                </div>
            )}

            {/* Audio Status Indicator */}
            {!audioReady && (
                <div className={styles.audioStatus}>
                    <span className={styles.audioLoading}>🔊 Loading audio...</span>
                </div>
            )}

            <div className={styles.controls}>
                {!timerState.isActive ? (
                    <button
                        onClick={startTimer}
                        className={styles.controlButton}
                        disabled={!audioReady}
                    >
                        {audioReady ? 'Start' : 'Loading...'}
                    </button>
                ) : (
                    <button onClick={pauseTimer} className={styles.controlButton}>
                        {timerState.isPaused ? 'Resume' : 'Pause'}
                    </button>
                )}

                <button onClick={resetTimer} className={styles.controlButton}>
                    Reset
                </button>

                <button
                    onClick={toggleSound}
                    className={`${styles.controlButton} ${soundEnabled ? styles.soundOn : styles.soundOff}`}
                    title={soundEnabled ? 'Sound On' : 'Sound Off'}
                >
                    {soundEnabled ? '🔊' : '🔇'}
                </button>
            </div>

            {/* Audio Preview Buttons (for testing) */}
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

export default TimerDisplay;