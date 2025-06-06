// components/timers/MeditationTimer.js
import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/index.module.css';

const MeditationTimer = ({ config, onComplete, onReset }) => {
    const [timerState, setTimerState] = useState({
        currentPhase: 'meditation',
        timeRemaining: config.meditationDuration,
        isPaused: false,
        isActive: false,
        isComplete: false
    });

    const intervalRef = useRef(null);
    const [bellEnabled, setBellEnabled] = useState(true);

    // Timer logic
    useEffect(() => {
        if (timerState.isActive && !timerState.isPaused) {
            intervalRef.current = setInterval(() => {
                setTimerState(prev => {
                    if (prev.timeRemaining <= 1) {
                        // Meditation complete
                        onComplete();
                        if (bellEnabled) {
                            playBell();
                        }
                        return {
                            ...prev,
                            timeRemaining: 0,
                            isActive: false,
                            isComplete: true
                        };
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
    }, [timerState.isActive, timerState.isPaused, onComplete, bellEnabled]);

    const playBell = () => {
        // Create a simple bell sound using Web Audio API
        if (typeof window !== 'undefined' && window.AudioContext) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);

                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 1);
            } catch (error) {
                console.log('Audio not available');
            }
        }
    };

    const startTimer = () => {
        setTimerState(prev => ({ ...prev, isActive: true, isPaused: false }));
    };

    const pauseTimer = () => {
        setTimerState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    };

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        setTimerState({
            currentPhase: 'meditation',
            timeRemaining: config.meditationDuration,
            isPaused: false,
            isActive: false,
            isComplete: false
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

    const getProgressPercentage = () => {
        const elapsed = config.meditationDuration - timerState.timeRemaining;
        return config.meditationDuration > 0 ? (elapsed / config.meditationDuration) * 100 : 0;
    };

    const getMeditationQuote = () => {
        const quotes = [
            "Breathe in peace, breathe out stress",
            "The present moment is the only time over which we have dominion",
            "Meditation is a way for nourishing and blossoming the divinity within you",
            "Peace comes from within. Do not seek it without",
            "Your calm mind is the ultimate weapon against your challenges"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    };

    return (
        <div className={`${styles.timerDisplay} ${styles.meditationMode}`}>
            {/* Phase Indicator */}
            <div className={`${styles.phaseIndicator} ${styles.phaseMeditation}`}>
                <div className={styles.phaseIcon}>🧘</div>
                <h2 className={styles.phaseText}>
                    {timerState.isComplete ? 'MEDITATION COMPLETE' : 'MEDITATE'}
                </h2>
            </div>

            {/* Digital Time Display */}
            <div className={styles.timeDisplay}>
                <div className={styles.digitalTime}>
                    <span className={styles.timeNumber}>{formatTime(timerState.timeRemaining)}</span>
                </div>

            </div>



            {/* Session Info */}
            <div className={styles.sessionInfo}>
                <div className={styles.modeIndicator}>
                    <span className={styles.modeIcon}>🧘</span>
                    <span className={styles.modeName}>Meditation Session</span>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controls}>
                {!timerState.isActive ? (
                    <button
                        onClick={startTimer}
                        className={`${styles.controlButton} ${styles.startButton}`}
                    >
                        ▶ Begin Meditation
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
                    onClick={() => setBellEnabled(!bellEnabled)}
                    className={`${styles.controlButton} ${bellEnabled ? styles.soundOn : styles.soundOff}`}
                    title={bellEnabled ? 'Bell On' : 'Bell Off'}
                >
                    {bellEnabled ? '🔔' : '🔕'}
                </button>
            </div>

            {/* Meditation Tips */}
            <div className={styles.meditationTips}>
                <div className={styles.tip}>
                    <h4>💡 Meditation Tips</h4>
                    <ul>
                        <li>Find a comfortable, quiet space</li>
                        <li>Keep your spine straight but relaxed</li>
                        <li>Focus on your breath naturally</li>
                        <li>Gently return focus when mind wanders</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MeditationTimer;