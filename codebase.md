# components\Footer.js

```js
// components/Footer.js
import Link from 'next/link';
import styles from '../styles/index.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <p>&copy; {currentYear} Online Timer Pro. Free interval training timer for fitness enthusiasts.</p>
            <div className={styles.footerLinks}>
                <Link href="/">Home</Link>
                <Link href="/about">About</Link>
                <Link href="/contact">Contact</Link>
                <Link href="/privacy">Privacy Policy</Link>
            </div>
            <div className={styles.footerInfo}>
                <p>Perfect for HIIT, Tabata, Circuit Training & Pomodoro Technique</p>
            </div>
        </footer>
    );
};

export default Footer;
```

# components\Header.js

```js
// components/Header.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/index.module.css';

const Header = () => {
    const router = useRouter();

    const isActivePage = (pathname) => {
        return router.pathname === pathname;
    };

    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <Link href="/" className={styles.logo}>
                    Online Timer Pro
                </Link>
                <div className={styles.navLinks}>
                    <Link
                        href="/"
                        className={isActivePage('/') ? styles.activeNavLink : ''}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={isActivePage('/about') ? styles.activeNavLink : ''}
                    >
                        About
                    </Link>
                    <Link
                        href="/contact"
                        className={isActivePage('/contact') ? styles.activeNavLink : ''}
                    >
                        Contact
                    </Link>
                    <Link
                        href="/privacy"
                        className={isActivePage('/privacy') ? styles.activeNavLink : ''}
                    >
                        Privacy
                    </Link>
                </div>
            </nav>
        </header>
    );
};

export default Header;
```

# components\index.js

```js
// components/index.js
export { default as Header } from './Header';
export { default as Footer } from './Footer';
export { default as Layout } from './Layout';
export { default as TimerForm } from './TimerForm';
export { default as TimerWrapper } from './TimerWrapper';
export { default as AdSenseBox } from './AdSenseBox';

// Timer Components
export { default as IntervalTimer } from './timers/IntervalTimer';
export { default as MeditationTimer } from './timers/MeditationTimer';
export { default as FocusTimer } from './timers/FocusTimer';
```

# components\Layout.js

```js
// components/Layout.js
import Header from './Header';
import Footer from './Footer';
import styles from '../styles/index.module.css';

const Layout = ({ children }) => {
    return (
        <div className={styles.container}>
            <Header />
            <main className={styles.main}>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
```

# components\TimerDisplay.js

```js
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
```

# components\TimerForm.js

```js
// components/TimerForm.js
import { useState } from 'react';
import styles from '../styles/index.module.css';

const TimerForm = ({ selectedMode, onStartTimer }) => {
    const [formData, setFormData] = useState({
        // Interval Training
        getReadyTime: 10,
        trainingTime: 30,
        restTime: 15,
        numberOfSets: 8,
        // Meditation
        meditationDuration: 600, // 10 minutes
        // Focus Work (Pomodoro)
        focusTime: 1500, // 25 minutes
        shortBreak: 300, // 5 minutes
        longBreak: 900, // 15 minutes
        pomodoroSets: 4
    });

    const [errors, setErrors] = useState({});

    const timerModeConfig = {
        interval: {
            name: 'Interval Training',
            icon: '💪',
            fields: ['getReadyTime', 'trainingTime', 'restTime', 'numberOfSets']
        },
        meditation: {
            name: 'Meditation Timer',
            icon: '🧘',
            fields: ['meditationDuration']
        },
        focus: {
            name: 'Focus Work Timer',
            icon: '☕',
            fields: ['focusTime', 'shortBreak', 'longBreak', 'pomodoroSets']
        }
    };

    const presetConfigs = {
        interval: [
            {
                name: 'Classic Tabata',
                getReadyTime: 10,
                trainingTime: 20,
                restTime: 10,
                numberOfSets: 8
            },
            {
                name: 'HIIT Beginner',
                getReadyTime: 10,
                trainingTime: 30,
                restTime: 30,
                numberOfSets: 6
            },
            {
                name: 'Advanced HIIT',
                getReadyTime: 15,
                trainingTime: 45,
                restTime: 15,
                numberOfSets: 12
            },
            {
                name: 'Quick Burn',
                getReadyTime: 5,
                trainingTime: 40,
                restTime: 20,
                numberOfSets: 5
            }
        ],
        meditation: [
            { name: '5 Minutes', meditationDuration: 300 },
            { name: '10 Minutes', meditationDuration: 600 },
            { name: '15 Minutes', meditationDuration: 900 },
            { name: '20 Minutes', meditationDuration: 1200 },
            { name: '30 Minutes', meditationDuration: 1800 }
        ],
        focus: [
            {
                name: 'Classic Pomodoro',
                focusTime: 1500,
                shortBreak: 300,
                longBreak: 900,
                pomodoroSets: 4
            },
            {
                name: 'Extended Focus',
                focusTime: 2700,
                shortBreak: 600,
                longBreak: 1800,
                pomodoroSets: 3
            },
            {
                name: 'Quick Sessions',
                focusTime: 900,
                shortBreak: 180,
                longBreak: 600,
                pomodoroSets: 6
            },
            {
                name: 'Deep Work',
                focusTime: 3600,
                shortBreak: 900,
                longBreak: 2700,
                pomodoroSets: 2
            }
        ]
    };

    const fieldLabels = {
        getReadyTime: 'Get Ready Time',
        trainingTime: 'Training Time',
        restTime: 'Rest Time',
        numberOfSets: 'Number of Sets',
        meditationDuration: 'Meditation Duration',
        focusTime: 'Focus Time',
        shortBreak: 'Short Break',
        longBreak: 'Long Break',
        pomodoroSets: 'Pomodoro Cycles'
    };

    const fieldPlaceholders = {
        getReadyTime: '0:10',
        trainingTime: '0:30',
        restTime: '0:15',
        numberOfSets: '8',
        meditationDuration: '10:00',
        focusTime: '25:00',
        shortBreak: '5:00',
        longBreak: '15:00',
        pomodoroSets: '4'
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const parseTimeInput = (value) => {
        if (typeof value === 'string' && value.includes(':')) {
            const parts = value.split(':').map(Number);
            if (parts.length === 2) {
                return parts[0] * 60 + parts[1]; // MM:SS
            } else if (parts.length === 3) {
                return parts[0] * 3600 + parts[1] * 60 + parts[2]; // HH:MM:SS
            }
        }
        return parseInt(value) || 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue;

        const timeFields = [
            'getReadyTime', 'trainingTime', 'restTime',
            'meditationDuration', 'focusTime', 'shortBreak', 'longBreak'
        ];

        if (timeFields.includes(name)) {
            processedValue = parseTimeInput(value);
        } else {
            processedValue = parseInt(value) || 0;
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const applyPreset = (preset) => {
        setFormData(prev => ({
            ...prev,
            ...preset
        }));
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};
        const fields = timerModeConfig[selectedMode]?.fields || [];

        fields.forEach(field => {
            if (formData[field] < 1) {
                newErrors[field] = 'Must be at least 1 second';
            }
            if (field === 'numberOfSets' && formData[field] > 50) {
                newErrors[field] = 'Maximum 50 sets allowed';
            }
            if (field === 'pomodoroSets' && formData[field] > 20) {
                newErrors[field] = 'Maximum 20 cycles allowed';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const config = {
                mode: selectedMode,
                ...formData
            };
            onStartTimer(config);
        }
    };

    const isNumberField = (field) => {
        return ['numberOfSets', 'pomodoroSets'].includes(field);
    };

    const currentMode = timerModeConfig[selectedMode];
    const currentPresets = presetConfigs[selectedMode] || [];

    if (!currentMode) {
        return <div>Invalid timer mode selected</div>;
    }

    return (
        <div className={styles.formContainer}>
            {/* Presets Section */}
            <div className={styles.presetsSection}>
                <h3>
                    <span className={styles.presetIcon}>{currentMode.icon}</span>
                    Quick Presets for {currentMode.name}
                </h3>
                <div className={styles.presetButtons}>
                    {currentPresets.map((preset, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => applyPreset(preset)}
                            className={styles.presetButton}
                        >
                            {preset.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Configuration Form */}
            <form onSubmit={handleSubmit} className={styles.timerForm}>
                <h3 className={styles.formTitle}>Custom Configuration</h3>

                {currentMode.fields.map(field => (
                    <div key={field} className={styles.inputGroup}>
                        <label htmlFor={field} className={styles.label}>
                            {fieldLabels[field]}
                        </label>

                        {isNumberField(field) ? (
                            <input
                                type="number"
                                id={field}
                                name={field}
                                value={formData[field]}
                                onChange={handleInputChange}
                                placeholder={fieldPlaceholders[field]}
                                min="1"
                                max={field === 'numberOfSets' ? 50 : 20}
                                className={`${styles.input} ${errors[field] ? styles.inputError : ''}`}
                            />
                        ) : (
                            <div className={styles.timeInputGroup}>
                                <input
                                    type="text"
                                    id={field}
                                    name={field}
                                    value={formatTime(formData[field])}
                                    onChange={handleInputChange}
                                    placeholder={fieldPlaceholders[field]}
                                    className={`${styles.input} ${styles.timeInput} ${errors[field] ? styles.inputError : ''}`}
                                />
                                <span className={styles.timeFormat}>MM:SS</span>
                            </div>
                        )}

                        {errors[field] && (
                            <span className={styles.errorText}>{errors[field]}</span>
                        )}
                    </div>
                ))}

                <button type="submit" className={styles.startButton}>
                    <span className={styles.startIcon}>▶</span>
                    Start {currentMode.name}
                </button>
            </form>

            {/* Help Section */}
            <div className={styles.helpSection}>
                <h4>💡 Quick Tips</h4>
                {selectedMode === 'interval' && (
                    <p>Perfect for HIIT, Tabata, and circuit training. Start with shorter intervals and build up gradually.</p>
                )}
                {selectedMode === 'meditation' && (
                    <p>Find a quiet space and comfortable position. Focus on your breath and let thoughts pass naturally.</p>
                )}
                {selectedMode === 'focus' && (
                    <p>Use the Pomodoro technique: 25 minutes of focused work followed by 5-minute breaks. Eliminate distractions during focus time.</p>
                )}
            </div>
        </div>
    );
};

export default TimerForm;
```

# components\timers\FocusTimer.js

```js
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
```

# components\timers\IntervalTimer.js

```js
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
```

# components\timers\MeditationTimer.js

```js
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
```

# components\TimerWrapper.js

```js
// components/TimerWrapper.js
import IntervalTimer from './timers/IntervalTimer';
import MeditationTimer from './timers/MeditationTimer';
import FocusTimer from './timers/FocusTimer';

const TimerWrapper = ({ timerConfig, onComplete, onReset }) => {
    const renderTimer = () => {
        switch (timerConfig.mode) {
            case 'interval':
                return (
                    <IntervalTimer
                        config={timerConfig}
                        onComplete={onComplete}
                        onReset={onReset}
                    />
                );
            case 'meditation':
                return (
                    <MeditationTimer
                        config={timerConfig}
                        onComplete={onComplete}
                        onReset={onReset}
                    />
                );
            case 'focus':
                return (
                    <FocusTimer
                        config={timerConfig}
                        onComplete={onComplete}
                        onReset={onReset}
                    />
                );
            default:
                return (
                    <div>
                        <p>Invalid timer mode: {timerConfig.mode}</p>
                        <button onClick={onReset}>Go Back</button>
                    </div>
                );
        }
    };

    return renderTimer();
};

export default TimerWrapper;
```

# hooks\useAudio.js

```js
// hooks/useAudio.js
import { useEffect, useRef, useState } from 'react';

const useAudio = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [audioReady, setAudioReady] = useState(false);

    const audioRefs = useRef({
        getReady: null,
        startTraining: null,
        rest: null
    });

    // Initialize audio files
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                // Initialize audio objects
                audioRefs.current.getReady = new Audio('/audios/get-ready.mp3');
                audioRefs.current.startTraining = new Audio('/audios/start-training.mp3');
                audioRefs.current.rest = new Audio('/audios/rest.mp3');

                // Set audio properties
                Object.values(audioRefs.current).forEach(audio => {
                    if (audio) {
                        audio.preload = 'auto';
                        audio.volume = 0.8; // Adjust volume as needed

                        // Handle audio loading
                        audio.addEventListener('canplaythrough', () => {
                            setIsLoading(false);
                            setAudioReady(true);
                        });

                        // Handle audio errors
                        audio.addEventListener('error', (e) => {
                            console.warn('Audio file failed to load:', e);
                            setIsLoading(false);
                        });
                    }
                });

                // Load audio files
                Promise.all([
                    audioRefs.current.getReady?.load(),
                    audioRefs.current.startTraining?.load(),
                    audioRefs.current.rest?.load()
                ]).catch(error => {
                    console.warn('Some audio files failed to load:', error);
                    setIsLoading(false);
                });

            } catch (error) {
                console.warn('Audio initialization failed:', error);
                setIsLoading(false);
            }
        }

        // Cleanup
        return () => {
            Object.values(audioRefs.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.currentTime = 0;
                }
            });
        };
    }, []);

    const playAudio = async (type) => {
        if (!soundEnabled || !audioReady) return;

        const audio = audioRefs.current[type];
        if (!audio) return;

        try {
            // Reset audio to beginning
            audio.currentTime = 0;

            // Play audio
            await audio.play();
        } catch (error) {
            console.warn(`Failed to play ${type} audio:`, error);

            // Fallback to system beep if available
            if (window.navigator && window.navigator.vibrate) {
                window.navigator.vibrate(200);
            }
        }
    };

    const stopAllAudio = () => {
        Object.values(audioRefs.current).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    };

    const toggleSound = () => {
        setSoundEnabled(prev => !prev);
        if (!soundEnabled) {
            stopAllAudio();
        }
    };

    return {
        soundEnabled,
        audioReady,
        isLoading,
        playAudio,
        stopAllAudio,
        toggleSound
    };
};

export default useAudio;
```

# next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    // SEO and performance optimizations
    compress: true,

    // Image optimization
    images: {
        domains: [],
        formats: ['image/webp', 'image/avif'],
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                ],
            },
        ]
    },

    // Generate sitemap and robots.txt
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
            },
        ]
    },
}

module.exports = nextConfig
```

# package.json

```json
{
    "name": "online-timer-pro",
    "version": "1.0.0",
    "description": "Free customizable interval training timer",
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "export": "next export"
    },
    "dependencies": {
        "next": "^15.3.3",
        "react": "^19.1.0",
        "react-dom": "^19.1.0"
    },
    "devDependencies": {
        "eslint": "^9.28.0",
        "eslint-config-next": "^15.3.3"
    }
}
```

# pages\_app.js

```js
import '../styles/globals.css'
import Head from 'next/head'
import Script from 'next/script'


// Google Analytics (optional)
function MyApp({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                {/* Google AdSense */}
                <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
                    crossOrigin="anonymous"
                />

                {/* Favicon and PWA */}
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#667eea" />
            </Head>
            <Component {...pageProps} />
        </>
    )
}

export default MyApp
```

# pages\_document.js

```js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* Additional head elements for SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />

                {/* Structured Data for Fitness Tool */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "Interval Training Timer",
                            "description": "Free customizable interval training timer for HIIT, Tabata, and fitness workouts",
                            "url": "https://onlinetimerpro.com",
                            "applicationCategory": "HealthApplication",
                            "operatingSystem": "Any",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "author": {
                                "@type": "Organization",
                                "name": "OnlineTimerPro"
                            }
                        })
                    }}
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
```

# pages\about.js

```js
// pages/about.js
import Head from 'next/head';
import Layout from '../components/Layout';  // ✅ Using Layout component
import styles from '../styles/index.module.css';

export default function About() {
    return (
        <>
            <Head>
                <title>About Us - Free Multi-Purpose Timer</title>
                <meta
                    name="description"
                    content="Learn about our mission to provide free, accessible timer tools for fitness, meditation, and productivity. Discover why we created this application."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* ✅ Layout component wraps Header + Content + Footer */}
            <Layout>
                <div className={styles.benefits}>
                    <h1>About Our Multi-Purpose Timer</h1>

                    <section>
                        <h2>Our Mission</h2>
                        <p>
                            We believe that effective tools for health, wellness, and productivity should be
                            accessible to everyone, regardless of budget or technical expertise. Our multi-purpose
                            timer was created to eliminate barriers between you and your goals by providing
                            professional-grade timing tools that are completely free and easy to use.
                        </p>
                    </section>

                    <section>
                        <h2>Why We Built This Application</h2>
                        <p>
                            Traditional timing solutions often require expensive equipment, gym memberships,
                            or complicated apps with subscription fees. We recognized that many people were
                            using basic stopwatches or phone timers, which lack the specific features needed
                            for effective interval training, meditation practice, and focused work sessions.
                        </p>
                        <p>
                            Our timer bridges this gap by offering three specialized modes with customizable
                            settings, clear visual cues, audio notifications, and progress tracking - all the
                            features you need for successful HIIT workouts, peaceful meditation sessions,
                            and productive work using the Pomodoro technique.
                        </p>
                    </section>

                    <section>
                        <h2>Built for Everyone</h2>
                        <div className={styles.benefitGrid}>
                            <div className={styles.benefitCard}>
                                <h3>💪 Fitness Enthusiasts</h3>
                                <p>
                                    Whether you're a beginner starting your first HIIT routine or an experienced
                                    athlete training for competition, our interval timer adapts to your needs with
                                    customizable work/rest periods and audio coaching.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🧘 Mindfulness Practitioners</h3>
                                <p>
                                    From quick 5-minute breathing exercises to extended meditation sessions, our
                                    peaceful interface provides gentle guidance without distractions, helping you
                                    develop a consistent practice.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>📚 Productivity Seekers</h3>
                                <p>
                                    Students, professionals, and anyone looking to improve focus can benefit from
                                    our Pomodoro timer, designed to help you work in focused sprints with proper
                                    break management.
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🏫 Educators & Trainers</h3>
                                <p>
                                    Teachers, fitness instructors, and wellness coaches can integrate our timer
                                    into their programs, providing students and clients with a reliable timing
                                    solution.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>Technology & Performance</h2>
                        <p>
                            Built with Next.js and React, our timer leverages modern web technologies to
                            deliver a fast, reliable experience across all devices. The application works
                            offline once loaded, requires no registration or personal data collection, and
                            runs efficiently on phones, tablets, and computers.
                        </p>
                        <p>
                            We've optimized every aspect of the user experience, from the intuitive interface
                            design to the precise timing algorithms, ensuring that our timer performs
                            consistently whether you're doing a quick workout or a long study session.
                        </p>
                    </section>

                    <section>
                        <h2>Privacy-First Design</h2>
                        <p>
                            Your privacy is paramount to us. Our timer operates entirely in your browser,
                            storing preferences locally on your device. We don't collect personal data,
                            require accounts, or track your usage patterns. You have complete control over
                            your information and can use our timer with confidence.
                        </p>
                    </section>

                    <section>
                        <h2>Community Impact</h2>
                        <p>
                            Since launching, thousands of users have completed millions of training intervals,
                            meditation sessions, and focused work periods using our timer. We're proud to
                            support the wellness and productivity journeys of people worldwide, from students
                            using it for study sessions to professional trainers incorporating it into their
                            programs.
                        </p>
                    </section>

                    <section>
                        <h2>Continuous Improvement</h2>
                        <p>
                            We regularly update our timer based on user feedback and the latest research in
                            interval training methodologies, meditation practices, and productivity techniques.
                            Our goal is to remain the most useful and user-friendly multi-purpose timer
                            available online.
                        </p>
                        <p>
                            Every feature we add is carefully considered to ensure it enhances the user
                            experience without adding unnecessary complexity. We believe in doing a few
                            things exceptionally well rather than trying to be everything to everyone.
                        </p>
                    </section>

                    <section>
                        <h2>Looking Forward</h2>
                        <p>
                            As we continue to grow, we remain committed to our core values: accessibility,
                            privacy, and excellence. We're exploring new ways to help people achieve their
                            health and productivity goals while maintaining our commitment to providing free,
                            high-quality tools for everyone.
                        </p>
                    </section>

                    <section>
                        <h2>Get Involved</h2>
                        <p>
                            We'd love to hear from you! Whether you have feedback, suggestions, or just want
                            to share how our timer has helped you, please don't hesitate to reach out through
                            our contact page. Your input helps us create better tools for our entire community.
                        </p>
                    </section>
                </div>
            </Layout>  {/* ✅ Layout automatically includes Header and Footer */}
        </>
    );
}
```

# pages\api\contact.js

```js
// pages/api/contact.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        // Here you would typically:
        // 1. Save to database
        // 2. Send email notification
        // 3. Send confirmation email to user

        // Example using a service like SendGrid, Nodemailer, or similar:
        /*
        const sgMail = require('@sendgrid/mail');
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
        const msg = {
          to: 'support@intervaltimer.com',
          from: 'noreply@intervaltimer.com',
          subject: `Contact Form: ${subject}`,
          html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          `,
        };
    
        await sgMail.send(msg);
        */

        // For now, just log the submission (in production, implement proper handling)
        console.log('Contact form submission:', {
            name,
            email,
            subject,
            message,
            timestamp: new Date().toISOString()
        });

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
}

// Rate limiting helper (optional)
const submissions = new Map();

function isRateLimited(ip) {
    const now = Date.now();
    const userSubmissions = submissions.get(ip) || [];

    // Remove submissions older than 1 hour
    const recentSubmissions = userSubmissions.filter(time => now - time < 3600000);

    // Allow max 5 submissions per hour
    if (recentSubmissions.length >= 5) {
        return true;
    }

    // Update submissions
    recentSubmissions.push(now);
    submissions.set(ip, recentSubmissions);

    return false;
}
```

# pages\api\sitemap.js

```js
export default function handler(req, res) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://onlinetimerpro.com</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://onlinetimerpro.com/about</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
      </url>
      <url>
        <loc>https://onlinetimerpro.com/contact</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
      <url>
        <loc>https://onlinetimerpro.com/privacy</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>yearly</changefreq>
        <priority>0.4</priority>
      </url>
    </urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()
}
```

# pages\contact.js

```js
// pages/contact.js
import Head from 'next/head';
import Layout from '../components/Layout';  // ✅ Using Layout component
import styles from '../styles/index.module.css';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact Us - Free Multi-Purpose Timer</title>
                <meta
                    name="description"
                    content="Get in touch with us about our free timer application. We'd love to hear your feedback and suggestions."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* ✅ Layout component wraps Header + Content + Footer */}
            <Layout>
                <div className={styles.benefits}>
                    <h1>Contact Us</h1>

                    <section>
                        <h2>We'd Love to Hear From You</h2>
                        <p>
                            Thank you for using our multi-purpose timer application! Your feedback,
                            suggestions, and questions help us improve and create better tools for
                            fitness, meditation, and productivity enthusiasts worldwide.
                        </p>
                    </section>

                    <section>
                        <h2>How to Reach Us</h2>
                        <p>
                            Since we value privacy and don't collect user data, we don't have a
                            built-in contact form. However, you can reach us through the following methods:
                        </p>

                        <div className={styles.benefitGrid}>
                            <div className={styles.benefitCard}>
                                <h3>📧 Email Support</h3>
                                <p>
                                    Send us your questions, feedback, or suggestions at:
                                    <br />
                                    <strong>support@onlinetimerpro.com</strong>
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🐛 Bug Reports</h3>
                                <p>
                                    Found a bug or technical issue? Please include:
                                    <br />
                                    • Your browser and version
                                    <br />
                                    • Steps to reproduce the issue
                                    <br />
                                    • What you expected to happen
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>💡 Feature Requests</h3>
                                <p>
                                    Have ideas for new timer modes or features? We'd love to hear them!
                                    <br />
                                    • Describe your use case
                                    <br />
                                    • Explain how it would help
                                    <br />
                                    • Share any specific requirements
                                </p>
                            </div>

                            <div className={styles.benefitCard}>
                                <h3>🤝 Partnerships</h3>
                                <p>
                                    Interested in collaborating or integrating our timer?
                                    <br />
                                    • Fitness instructors
                                    <br />
                                    • Educational institutions
                                    <br />
                                    • Wellness organizations
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2>What We Can Help With</h2>
                        <ul>
                            <li><strong>Technical Support:</strong> Issues with timer functionality, audio, or browser compatibility</li>
                            <li><strong>Feature Questions:</strong> How to use specific timer modes or features</li>
                            <li><strong>Accessibility:</strong> Making our timer work better for users with disabilities</li>
                            <li><strong>Integration:</strong> Using our timer in educational or fitness programs</li>
                            <li><strong>Privacy Concerns:</strong> Questions about our privacy practices</li>
                            <li><strong>General Feedback:</strong> Your thoughts on improving the user experience</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Response Times</h2>
                        <p>
                            We typically respond to emails within 24-48 hours during business days.
                            For urgent technical issues, please include "URGENT" in your subject line
                            and we'll prioritize your message.
                        </p>
                    </section>

                    <section>
                        <h2>Contributing to Our Mission</h2>
                        <p>
                            Our goal is to provide free, accessible tools that help people improve
                            their fitness, mindfulness, and productivity. If you have expertise in
                            any of these areas and would like to contribute content, advice, or
                            guidance, we'd love to collaborate.
                        </p>
                    </section>

                    <section>
                        <h2>Community Guidelines</h2>
                        <p>
                            When contacting us, please:
                        </p>
                        <ul>
                            <li>Be respectful and constructive in your communication</li>
                            <li>Provide specific details when reporting issues</li>
                            <li>Understand that we're a small team focused on quality</li>
                            <li>Be patient as we work to address your concerns</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Thank You</h2>
                        <p>
                            Thank you for being part of our community and for helping us create
                            better tools for health, wellness, and productivity. Every message
                            helps us understand how to serve our users better.
                        </p>
                    </section>
                </div>
            </Layout>  {/* ✅ Layout automatically includes Header and Footer */}
        </>
    );
}
```

# pages\index.js

```js
// pages/index.js
import { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import TimerForm from '../components/TimerForm';
import TimerWrapper from '../components/TimerWrapper';
import styles from '../styles/index.module.css';

export default function HomePage() {
    const [currentView, setCurrentView] = useState('modes'); // 'modes', 'config', 'timer'
    const [selectedMode, setSelectedMode] = useState(null);
    const [timerConfig, setTimerConfig] = useState(null);

    const timerModes = {
        interval: {
            name: 'Interval Training',
            description: 'HIIT, Tabata, Circuit Training & Fitness Workouts',
            icon: '💪',
            gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            features: [
                'Customizable work/rest intervals',
                'Set counting & progression tracking',
                'Audio coaching with voice cues',
                'Perfect for HIIT, Tabata & circuit training'
            ]
        },
        meditation: {
            name: 'Meditation Timer',
            description: 'Mindfulness, Breathing Exercises & Relaxation',
            icon: '🧘',
            gradient: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
            features: [
                'Silent, peaceful interface design',
                'Breathing guide with animations',
                'Inspirational meditation quotes',
                'Gentle bell completion notifications'
            ]
        },
        focus: {
            name: 'Focus Work Timer',
            description: 'Pomodoro Technique for Productivity & Study',
            icon: '☕',
            gradient: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)',
            features: [
                '25-minute focused work sessions',
                'Smart break management system',
                'Visual progress tracking',
                'Productivity tips & guidance'
            ]
        }
    };

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setCurrentView('config');
    };

    const handleStartTimer = (config) => {
        setTimerConfig(config);
        setCurrentView('timer');
    };

    const handleTimerComplete = () => {
        console.log('Session completed successfully!');
    };

    const handleTimerReset = () => {
        setCurrentView('config');
        setTimerConfig(null);
    };

    const handleBackToModes = () => {
        setCurrentView('modes');
        setSelectedMode(null);
        setTimerConfig(null);
    };

    const renderModeSelection = () => (
        <>
            <h1 className={styles.title}>
                Choose Your Perfect Timer
            </h1>

            <section className={styles.intro}>
                <p className={styles.introText}>
                    Select the ideal timer for your needs. Whether you're building fitness habits,
                    practicing mindfulness, or boosting productivity, we have the perfect tool to help you succeed.
                </p>
            </section>

            <div className={styles.modeSelectionGrid}>
                {Object.entries(timerModes).map(([key, mode]) => (
                    <div
                        key={key}
                        className={styles.modeCard}
                        onClick={() => handleModeSelect(key)}
                    >
                        <div
                            className={styles.modeCardHeader}
                            style={{ background: mode.gradient }}
                        >
                            <div className={styles.modeCardIcon}>{mode.icon}</div>
                            <h2 className={styles.modeCardTitle}>{mode.name}</h2>
                            <p className={styles.modeCardDescription}>{mode.description}</p>
                        </div>

                        <div className={styles.modeCardBody}>
                            <h3>Key Features:</h3>
                            <ul className={styles.featureList}>
                                {mode.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                            <button className={styles.selectModeButton}>
                                Choose {mode.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <section className={styles.benefits}>
                <h2>Why Choose Our Multi-Purpose Timer Suite?</h2>

                <div className={styles.benefitGrid}>
                    <div className={styles.benefitCard}>
                        <h3>🚀 Lightning Fast</h3>
                        <p>Instant loading with no downloads required. Works perfectly offline once loaded on any device.</p>
                    </div>

                    <div className={styles.benefitCard}>
                        <h3>🎯 Purpose-Built</h3>
                        <p>Each timer mode is specifically designed for its use case with relevant features and optimizations.</p>
                    </div>

                    <div className={styles.benefitCard}>
                        <h3>📱 Universal Access</h3>
                        <p>Works seamlessly on phones, tablets, laptops, and desktops with responsive design.</p>
                    </div>

                    <div className={styles.benefitCard}>
                        <h3>🔒 Privacy First</h3>
                        <p>No registration, no data collection, no tracking. Your sessions stay completely private.</p>
                    </div>
                </div>
            </section>
        </>
    );

    const renderTimerConfig = () => (
        <>
            <div className={styles.timerHeader}>
                <button onClick={handleBackToModes} className={styles.backButton}>
                    ← Back to Timer Modes
                </button>
                <h1 className={styles.configTitle}>
                    Configure Your {timerModes[selectedMode]?.name}
                </h1>
            </div>

            <div className={styles.selectedModeInfo}>
                <div className={styles.selectedModeCard}>
                    <span className={styles.selectedModeIcon}>
                        {timerModes[selectedMode]?.icon}
                    </span>
                    <div>
                        <h3>{timerModes[selectedMode]?.name}</h3>
                        <p>{timerModes[selectedMode]?.description}</p>
                    </div>
                </div>
            </div>

            <div className={styles.timerSection}>
                <TimerForm
                    selectedMode={selectedMode}
                    onStartTimer={handleStartTimer}
                />
            </div>
        </>
    );

    const renderActiveTimer = () => (
        <>
            <div className={styles.timerHeader}>
                <button onClick={handleBackToModes} className={styles.backButton}>
                    ← Back to Modes
                </button>
                <button onClick={handleTimerReset} className={styles.backButton}>
                    ⚙️ Reconfigure
                </button>
                <h1 className={styles.activeTimerTitle}>
                    {timerModes[timerConfig?.mode]?.name} Session
                </h1>
            </div>

            <div className={styles.timerSection}>
                <TimerWrapper
                    timerConfig={timerConfig}
                    onComplete={handleTimerComplete}
                    onReset={handleTimerReset}
                />
            </div>
        </>
    );

    return (
        <>
            <Head>
                <title>Free Multi-Purpose Timer - HIIT, Meditation & Focus Work</title>
                <meta
                    name="description"
                    content="Choose from 3 powerful timer modes: Interval Training for fitness, Meditation Timer for mindfulness, and Focus Work for productivity. Free, no registration required."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="keywords" content="interval timer, HIIT timer, meditation timer, pomodoro timer, focus timer, fitness timer, productivity timer" />
                <link rel="icon" href="/favicon.ico" />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content="Free Multi-Purpose Timer - HIIT, Meditation & Focus" />
                <meta property="og:description" content="Professional timer suite for fitness, mindfulness, and productivity. No registration required." />
                <meta property="og:type" content="website" />

                {/* Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "Multi-Purpose Timer Suite",
                            "description": "Free timer application for interval training, meditation, and focus work",
                            "url": "https://onlinetimerpro.com",
                            "applicationCategory": "HealthApplication",
                            "operatingSystem": "Any",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            }
                        })
                    }}
                />
            </Head>

            <Layout>
                {currentView === 'modes' && renderModeSelection()}
                {currentView === 'config' && renderTimerConfig()}
                {currentView === 'timer' && renderActiveTimer()}
            </Layout>
        </>
    );
}
```

# pages\privacy.js

```js
// pages/privacy.js
import Head from 'next/head';
import Layout from '../components/Layout';  // ✅ Using Layout component
import styles from '../styles/index.module.css';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Privacy Policy - Free Multi-Purpose Timer</title>
                <meta
                    name="description"
                    content="Privacy policy for our free timer application. We respect your privacy and don't collect personal data."
                />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            {/* ✅ Layout component wraps Header + Content + Footer */}
            <Layout>
                <div className={styles.benefits}>
                    <h1>Privacy Policy</h1>

                    <section>
                        <h2>Our Commitment to Privacy</h2>
                        <p>
                            We are committed to protecting your privacy. This timer application is designed
                            with privacy as a core principle. We believe that your personal information and
                            usage patterns should remain private and under your control.
                        </p>
                    </section>

                    <section>
                        <h2>Information We Don't Collect</h2>
                        <p>
                            <strong>We do not collect, store, or transmit any personal information.</strong>
                            This includes:
                        </p>
                        <ul>
                            <li>No user accounts or registration required</li>
                            <li>No personal identification information</li>
                            <li>No email addresses or contact information</li>
                            <li>No workout data or timer settings</li>
                            <li>No location or device information</li>
                            <li>No usage analytics or tracking</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Local Storage</h2>
                        <p>
                            All timer settings and preferences are stored locally on your device using
                            your browser's local storage. This data never leaves your device and is not
                            accessible to us or any third parties. You can clear this data at any time
                            through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2>Cookies</h2>
                        <p>
                            We do not use cookies to track users or collect personal information. Any
                            cookies that may be present are strictly functional and necessary for the
                            application to work properly (such as maintaining your timer settings during
                            your session).
                        </p>
                    </section>

                    <section>
                        <h2>Third-Party Services</h2>
                        <p>
                            Our timer application may be hosted on third-party platforms (such as Vercel,
                            Netlify, or similar). These platforms may have their own privacy policies
                            regarding basic web analytics (such as page views and traffic patterns).
                            However, no personally identifiable information is shared with these services.
                        </p>
                    </section>

                    <section>
                        <h2>Audio Files</h2>
                        <p>
                            The timer uses audio files for notifications (such as "Get Ready", "Start Training",
                            and "Rest" cues). These audio files are loaded directly in your browser and no
                            information about your audio usage is collected or transmitted.
                        </p>
                    </section>

                    <section>
                        <h2>Children's Privacy</h2>
                        <p>
                            Our service is appropriate for users of all ages. Since we don't collect any
                            personal information from anyone, we comply with children's privacy protection
                            regulations including COPPA (Children's Online Privacy Protection Act).
                        </p>
                    </section>

                    <section>
                        <h2>Security</h2>
                        <p>
                            Since we don't collect or store personal data, there are no personal data
                            security concerns. The application runs entirely in your browser, and any
                            settings you configure are stored locally on your device.
                        </p>
                    </section>

                    <section>
                        <h2>Your Rights</h2>
                        <p>
                            Since we don't collect personal data, there's no personal data to access,
                            modify, or delete from our servers. You have complete control over any local
                            data through your browser settings. You can:
                        </p>
                        <ul>
                            <li>Clear all local storage data through your browser</li>
                            <li>Use the timer in incognito/private browsing mode</li>
                            <li>Use the application without any data persistence</li>
                        </ul>
                    </section>

                    <section>
                        <h2>Changes to This Policy</h2>
                        <p>
                            We may update this privacy policy occasionally to reflect any changes to our
                            application or legal requirements. Any changes will be posted on this page.
                            Since we don't collect contact information, we cannot notify users directly
                            of changes.
                        </p>
                    </section>

                    <section>
                        <h2>Contact Information</h2>
                        <p>
                            If you have questions about this privacy policy or our privacy practices,
                            you can contact us through the contact page on this website. We're committed
                            to addressing any privacy concerns you may have.
                        </p>
                    </section>

                    <section>
                        <h2>Effective Date</h2>
                        <p>
                            This privacy policy is effective as of January 1, 2025, and applies to all
                            users of our timer application.
                        </p>
                    </section>
                </div>
            </Layout>  {/* ✅ Layout automatically includes Header and Footer */}
        </>
    );
}
```

# public\audios\get-ready.mp3

This is a binary file of the type: Binary

# public\audios\rest.mp3

This is a binary file of the type: Binary

# public\audios\start-training.mp3

This is a binary file of the type: Binary

# public\favicon.ico

```ico

```

# public\images\logo_192.png

This is a binary file of the type: Image

# public\robots.txt

```txt
User-agent: *
Allow: /

Sitemap: https://onlinetimerpro.com/sitemap.xml
```

# styles\base.module.css

```css
/* styles/base.module.css - Layout, Header, Footer, Navigation */

/* ===================================
   LAYOUT COMPONENTS
   =================================== */

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(74, 144, 226, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(53, 122, 189, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.container > * {
  position: relative;
  z-index: 1;
}

/* ===================================
   HEADER & NAVIGATION
   =================================== */

.header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-xl);
}

.logo {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-light);
  text-decoration: none;
  background: linear-gradient(135deg, #ffffff 0%, #e3e3e3 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all var(--transition-fast);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.navLinks {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.navLinks a {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.navLinks a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--glass-bg);
  transition: left var(--transition-normal);
  z-index: -1;
}

.navLinks a:hover::before {
  left: 0;
}

.navLinks a:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.activeNavLink {
  background: var(--glass-bg) !important;
  box-shadow: var(--shadow-sm) !important;
}

/* ===================================
   MAIN CONTENT
   =================================== */

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  width: 100%;
  animation: fadeInUp 0.8s ease-out;
}

/* ===================================
   FOOTER
   =================================== */

.footer {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: var(--text-light);
  text-align: center;
  padding: var(--spacing-2xl);
  margin-top: auto;
  border-top: 1px solid var(--glass-border);
}

.footer p {
  margin-bottom: var(--spacing-md);
  opacity: 0.9;
}

.footerLinks {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.footerLinks a {
  color: var(--text-light);
  text-decoration: none;
  opacity: 0.8;
  transition: all var(--transition-fast);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.footerLinks a:hover {
  opacity: 1;
  background: var(--glass-bg);
  transform: translateY(-2px);
}

.footerInfo {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--glass-border);
}

.footerInfo p {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
}

/* ===================================
   RESPONSIVE DESIGN
   =================================== */

@media (max-width: 1024px) {
  .nav {
    padding: 0 var(--spacing-lg);
  }
  
  .main {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  .navLinks {
    gap: var(--spacing-md);
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main {
    padding: var(--spacing-md);
  }
  
  .footerLinks {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}

@media (max-width: 480px) {
  .nav {
    padding: var(--spacing-sm);
  }
  
  .main {
    padding: var(--spacing-sm);
  }
}
```

# styles\globals.css

```css
/* styles/globals.css */

/* CSS Variables - Comfortable Blue Theme */
:root {
  --primary-gradient: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  --secondary-gradient: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  --success-gradient: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  --danger-gradient: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
  --warning-gradient: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  
  --glass-bg: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
  --glass-shadow: 0 8px 32px rgba(52, 152, 219, 0.3);
  
  --text-light: #ffffff;
  --text-dark: #2c3e50;
  --text-muted: #7f8c8d;
  
  --border-radius-sm: 8px;
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
  --border-radius-xl: 20px;
  
  --spacing-xs: 0.5rem;
  --spacing-sm: 0.75rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.15);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.25);
  
  --transition-fast: 0.2s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Comfortable Blue Background */
  --bg-primary: linear-gradient(135deg, #4a90e2 0%, #357abd 50%, #2471a3 100%);
  --bg-accent: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
}

/* Global Reset and Base Styles */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  scroll-behavior: smooth;
  background: var(--bg-primary);
  color: var(--text-dark);
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
}

/* Global Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shakeError {
  0%, 100% { 
    transform: translateX(0); 
  }
  25% { 
    transform: translateX(-4px); 
  }
  75% { 
    transform: translateX(4px); 
  }
}

@keyframes pulseGlow {
  from {
    box-shadow: var(--shadow-xl);
  }
  to {
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 30px rgba(52, 152, 219, 0.2);
  }
}

@keyframes shimmer {
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
}

@keyframes countdownPulse {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05); 
  }
}

@keyframes spin {
  0% { 
    transform: rotate(0deg); 
  }
  100% { 
    transform: rotate(360deg); 
  }
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0); 
  }
  50% { 
    transform: translateY(-10px); 
  }
}

@keyframes breathingAnimation {
  0%, 100% { 
    transform: scale(1); 
    opacity: 0.5; 
  }
  50% { 
    transform: scale(1.2); 
    opacity: 1; 
  }
}

@keyframes pulse {
  0% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05); 
  }
  100% { 
    transform: scale(1); 
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --bg-primary: linear-gradient(135deg, #1a365d 0%, #2a4a6b 100%);
    --glass-bg: rgba(255, 255, 255, 0.3);
    --text-light: #ffffff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  html {
    scroll-behavior: auto;
  }
}

/* Dark mode preference */
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }
}
```

# styles\index.module.css

```css
/* styles/index.module.css */

/* Layout Components */
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
}

.container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(74, 144, 226, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(53, 122, 189, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.container > * {
  position: relative;
  z-index: 1;
}

/* Header and Navigation */
.header {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  padding: var(--spacing-md) 0;
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
}

.nav {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-xl);
}

.logo {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-light);
  text-decoration: none;
  background: linear-gradient(135deg, #ffffff 0%, #e3e3e3 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: all var(--transition-fast);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo:hover {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.navLinks {
  display: flex;
  gap: var(--spacing-xl);
  align-items: center;
}

.navLinks a {
  color: var(--text-light);
  text-decoration: none;
  font-weight: 500;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.navLinks a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--glass-bg);
  transition: left var(--transition-normal);
  z-index: -1;
}

.navLinks a:hover::before {
  left: 0;
}

.navLinks a:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.activeNavLink {
  background: var(--glass-bg) !important;
  box-shadow: var(--shadow-sm) !important;
}

/* Main Content */
.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-xl);
  width: 100%;
  animation: fadeInUp 0.8s ease-out;
}

.title {
  text-align: center;
  color: var(--text-light);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  margin-bottom: var(--spacing-2xl);
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.2;
  background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Glass Morphism Content Sections */
.intro,
.benefits {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-xl);
  margin: var(--spacing-2xl) 0;
  color: var(--text-light);
  box-shadow: var(--glass-shadow);
  transition: all var(--transition-normal);
}

.intro:hover,
.benefits:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(52, 152, 219, 0.4);
}

.introText {
  font-size: 1.125rem;
  line-height: 1.7;
  text-align: center;
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
}

.benefits h2 {
  color: var(--text-light);
  margin-bottom: var(--spacing-lg);
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

/* Mode Selection Grid */
.modeSelectionGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  margin: var(--spacing-2xl) 0;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.modeCard {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  transition: all var(--transition-normal);
  cursor: pointer;
  border: 2px solid transparent;
}

.modeCard:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border-color: rgba(52, 152, 219, 0.3);
}

.modeCardHeader {
  padding: var(--spacing-2xl) var(--spacing-xl);
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.modeCardHeader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
}

.modeCardIcon {
  font-size: 4rem;
  margin-bottom: var(--spacing-md);
  display: block;
  animation: float 3s ease-in-out infinite;
}

.modeCardTitle {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: var(--spacing-sm);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.modeCardDescription {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
  font-weight: 500;
}

.modeCardBody {
  padding: var(--spacing-xl);
  background: white;
}

.modeCardBody h3 {
  color: var(--text-dark);
  margin-bottom: var(--spacing-md);
  font-size: 1.2rem;
  font-weight: 700;
}

.featureList {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-xl) 0;
}

.featureList li {
  padding: var(--spacing-sm) 0;
  position: relative;
  padding-left: var(--spacing-lg);
  color: var(--text-dark);
  line-height: 1.5;
}

.featureList li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #00b894;
  font-weight: bold;
  font-size: 1.1rem;
}

.selectModeButton {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background: var(--primary-gradient);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.selectModeButton:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* Benefit Grid */
.benefitGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-top: var(--spacing-xl);
}

.benefitCard {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-normal);
}

.benefitCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.3);
}

.benefitCard h3 {
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: var(--spacing-sm);
  font-size: 1.25rem;
  font-weight: 700;
}

.benefitCard p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

/* Timer Header Navigation */
.timerHeader {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
}

.backButton {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-weight: 500;
  backdrop-filter: blur(10px);
  font-size: 0.9rem;
}

.backButton:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-2px);
}

.activeTimerTitle,
.configTitle {
  color: white;
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Selected Mode Info */
.selectedModeInfo {
  margin-bottom: var(--spacing-xl);
}

.selectedModeCard {
  background: var(--glass-bg);
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
}

.selectedModeIcon {
  font-size: 3rem;
}

.selectedModeCard h3 {
  color: white;
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.selectedModeCard p {
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-size: 1rem;
}

/* Timer Section */
.timerSection {
  display: flex;
  justify-content: center;
  margin: var(--spacing-2xl) 0;
  animation: slideInFromBottom 0.6s ease-out 0.3s both;
}

/* Timer Form Styles */
.formContainer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-normal);
}

.formContainer:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.presetsSection {
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(52, 152, 219, 0.05);
  border-radius: var(--border-radius-lg);
  border: 1px solid rgba(52, 152, 219, 0.1);
}

.presetsSection h3 {
  color: var(--text-dark);
  margin-bottom: var(--spacing-md);
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.presetIcon {
  font-size: 1.5rem;
}

.presetButtons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--spacing-sm);
}

.presetButton {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid #3498db;
  border-radius: var(--border-radius-sm);
  background: white;
  color: #3498db;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 0.9rem;
}

.presetButton:hover {
  background: #3498db;
  color: white;
  transform: translateY(-1px);
}

.timerForm {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.formTitle {
  color: var(--text-dark);
  font-size: 1.3rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid rgba(52, 152, 219, 0.1);
}

.inputGroup {
  display: flex;
  flex-direction: column;
  position: relative;
}

.label {
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-dark);
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.input {
  padding: var(--spacing-md) var(--spacing-lg);
  border: 2px solid #e1e8ed;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  transition: all var(--transition-normal);
  background: #ffffff;
  color: var(--text-dark);
  font-weight: 500;
}

.input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
  transform: translateY(-2px);
}

.input:hover:not(:focus) {
  border-color: #b8c6db;
}

.inputError {
  border-color: #e74c3c !important;
  box-shadow: 0 0 0 4px rgba(231, 76, 60, 0.1) !important;
}

.errorText {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: var(--spacing-xs);
  font-weight: 500;
  animation: shakeError 0.3s ease-in-out;
}

.timeInputGroup {
  position: relative;
  display: flex;
  align-items: center;
}

.timeInput {
  font-family: 'Courier New', monospace !important;
  font-size: 1.1rem !important;
  letter-spacing: 1px !important;
  text-align: center !important;
}

.timeFormat {
  position: absolute;
  right: var(--spacing-md);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 500;
  pointer-events: none;
}

.startButton {
  background: var(--primary-gradient);
  color: var(--text-light);
  border: none;
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: 1.2rem;
  font-weight: 700;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--transition-normal);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: var(--shadow-md);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.startButton::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  transition: left var(--transition-normal);
}

.startButton:hover::before {
  left: 100%;
}

.startButton:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.startButton:active {
  transform: translateY(-1px);
}

.startIcon {
  font-size: 1rem;
}

.helpSection {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-md);
  background: rgba(52, 152, 219, 0.05);
  border-radius: var(--border-radius-md);
  border-left: 4px solid #3498db;
}

.helpSection h4 {
  color: var(--text-dark);
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
  font-weight: 600;
}

.helpSection p {
  color: var(--text-muted);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Enhanced Timer Display */
.timerDisplay {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: var(--spacing-2xl);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  text-align: center;
  min-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: pulseGlow 2s ease-in-out infinite alternate;
}

.phaseIndicator {
  padding: var(--spacing-lg);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-xl);
  position: relative;
  overflow: hidden;
  transition: all var(--transition-normal);
}

.phaseIndicator::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  animation: shimmer 3s linear infinite;
}

.phaseIcon {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

.phaseText {
  font-size: 2.25rem;
  font-weight: 900;
  margin: 0;
  position: relative;
  z-index: 1;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.phaseReady {
  background: var(--warning-gradient);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(253, 187, 45, 0.4);
}

.phaseTrain {
  background: var(--danger-gradient);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(252, 70, 107, 0.4);
}

.phaseRest {
  background: var(--secondary-gradient);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(79, 172, 254, 0.4);
}

.phaseMeditation {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.phaseFocus {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
}

.phaseShortBreak {
  background: linear-gradient(135deg, #26de81 0%, #20bf6b 100%);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(38, 222, 129, 0.4);
}

.phaseLongBreak {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(162, 155, 254, 0.4);
}

.phaseComplete {
  background: var(--success-gradient);
  color: var(--text-light);
  box-shadow: 0 8px 24px rgba(17, 153, 142, 0.4);
}

.timeDisplay {
  margin: var(--spacing-xl) 0;
  position: relative;
}

.digitalTime {
  position: relative;
  margin: var(--spacing-xl) 0;
}

.timeNumber {
  font-family: 'Courier New', monospace;
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  color: var(--text-dark);
  text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.1em;
  display: block;
  text-align: center;
  animation: countdownPulse 1s ease-in-out infinite;
}

.progressCircle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  z-index: -1;
}

.progressSvg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progressBar {
  stroke-dasharray: 339.29;
  stroke-dashoffset: calc(339.29 * (1 - var(--progress, 0) / 100));
  transition: stroke-dashoffset 1s ease-in-out;
}

.setCounter {
  margin: var(--spacing-lg) 0;
  padding: var(--spacing-md);
  background: var(--glass-bg);
  border-radius: var(--border-radius-md);
  backdrop-filter: blur(10px);
}

.setText {
  font-size: 1.25rem;
  color: var(--text-dark);
  font-weight: 600;
  letter-spacing: 0.5px;
}

/* Mode-specific Timer Styles */
.intervalMode {
  border: 3px solid #e74c3c;
}

.meditationMode {
  border: 3px solid #667eea;
  background: #ffffff !important;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.1) !important;
}

.meditationMode .phaseIndicator {
  color: var(--text-light);
}

.meditationMode .timeNumber {
  color: #2c3e50 !important;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.meditationMode .setText {
  color: #2c3e50 !important;
}

.meditationMode .sessionCount {
  color: #2c3e50 !important;
}

.meditationMode .modeIndicator .modeName {
  color: #2c3e50 !important;
}

.meditationMode .meditationQuote {
  background: rgba(102, 126, 234, 0.1) !important;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.meditationMode .quoteText {
  color: #2c3e50 !important;
  font-style: italic;
}

.meditationMode .meditationTips {
  background: rgba(102, 126, 234, 0.05) !important;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.meditationMode .meditationTips h4 {
  color: #2c3e50 !important;
}

.meditationMode .meditationTips li {
  color: #555 !important;
}

.meditationMode .meditationTips li::before {
  color: #667eea;
}

.meditationMode .startButton {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  color: #2c3e50 !important;
  border: 2px solid #667eea !important;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3) !important;
}

.meditationMode .startButton:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: #2c3e50 !important;
  border-color: #5a6fd8 !important;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4) !important;
}

.meditationMode .startButton::before {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, transparent 100%) !important;
}

.focusMode {
  border: 3px solid #ff6b6b;
  background: #ffffff !important;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.1) !important;
}

.focusMode .phaseIndicator {
  color: var(--text-light);
}

.focusMode .timeNumber {
  color: #2c3e50 !important;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.focusMode .setText {
  color: #2c3e50 !important;
}

.focusMode .sessionCount {
  color: #2c3e50 !important;
}

.focusMode .modeIndicator .modeName {
  color: #2c3e50 !important;
}

.focusMode .tipCard {
  background: rgba(255, 107, 107, 0.1) !important;
  border-left: 4px solid #ff6b6b;
}

.focusMode .tipCard h4 {
  color: #2c3e50 !important;
}

.focusMode .tipCard p {
  color: #555 !important;
}

.focusMode .pomodoroTracker {
  background: rgba(255, 107, 107, 0.05) !important;
}

.focusMode .pomodoroTracker h4 {
  color: #2c3e50 !important;
}

.focusMode .startButton {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  color: #2c3e50 !important;
  border: 2px solid #e67e22 !important;
  box-shadow: 0 4px 16px rgba(230, 126, 34, 0.3) !important;
}

.focusMode .startButton:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: #2c3e50 !important;
  border-color: #d35400 !important;
  box-shadow: 0 8px 24px rgba(230, 126, 34, 0.4) !important;
}

.focusMode .startButton::before {
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, transparent 100%) !important;
}

.sessionInfo {
  margin: var(--spacing-lg) 0;
  text-align: center;
}

.modeIndicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background: var(--glass-bg);
  border-radius: var(--border-radius-lg);
  backdrop-filter: blur(10px);
}

.modeIndicator .modeIcon {
  font-size: 1.5rem;
}

.modeIndicator .modeName {
  font-weight: 600;
  color: var(--text-dark);
  font-size: 1.1rem;
}

.controls {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.controlButton {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--border-radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  background: var(--primary-gradient);
  color: var(--text-light);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  text-transform: none;
  letter-spacing: 0.5px;
}

.controlButton::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all var(--transition-normal);
  transform: translate(-50%, -50%);
}

.controlButton:hover::before {
  width: 300px;
  height: 300px;
}

.controlButton:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.controlButton:active {
  transform: translateY(-1px);
}

.controlButton:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.controlButton:disabled:hover {
  transform: none;
  box-shadow: var(--shadow-sm);
}

.startButton {
  background: var(--success-gradient) !important;
  font-size: 1.1rem !important;
  padding: var(--spacing-lg) var(--spacing-xl) !important;
}

.pauseButton {
  background: var(--warning-gradient) !important;
}

.resumeButton {
  background: var(--success-gradient) !important;
}

.resetButton {
  background: var(--danger-gradient) !important;
}

.soundOn {
  background: var(--success-gradient);
}

.soundOff {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
}

/* Audio Status and Preview Styles */
.audioStatus {
  margin: var(--spacing-md) 0;
  text-align: center;
}

.audioLoading {
  color: var(--text-muted);
  font-size: 0.9rem;
  font-style: italic;
}

.audioPreview {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: rgba(255, 235, 59, 0.1);
  border: 2px dashed #ffc107;
  border-radius: var(--border-radius-md);
  text-align: center;
}

.audioPreview h4 {
  color: #f57c00;
  margin-bottom: var(--spacing-md);
  font-size: 0.9rem;
}

.previewButton {
  background: #ffc107;
  color: #333;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  margin: 0 var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.previewButton:hover {
  background: #ffb300;
  transform: translateY(-1px);
}

/* Meditation-specific Styles */
.meditationQuote {
  margin: var(--spacing-lg) 0;
  text-align: center;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--border-radius-md);
  backdrop-filter: blur(10px);
}

.quoteText {
  font-style: italic;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.breathingGuide {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  pointer-events: none;
}

.breathingCircle {
  width: 150px;
  height: 150px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: breathingAnimation 4s ease-in-out infinite;
}

.breathingText {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  font-weight: 600;
}

.meditationTips {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.meditationTips h4 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
}

.meditationTips ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.meditationTips li {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  padding: var(--spacing-xs) 0;
  padding-left: var(--spacing-md);
  position: relative;
}

.meditationTips li::before {
  content: '•';
  color: #667eea;
  position: absolute;
  left: 0;
}

/* Focus Timer Styles */
.completedSessions {
  margin-top: var(--spacing-sm);
}

.sessionCount {
  font-size: 0.9rem;
  color: var(--text-dark);
  font-weight: 500;
}

.focusTips {
  margin: var(--spacing-lg) 0;
}

.tipCard {
  background: rgba(255, 255, 255, 0.1);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border-left: 4px solid #ff6b6b;
  backdrop-filter: blur(10px);
}

.tipCard h4 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-sm);
  font-size: 1rem;
}

.tipCard p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.pomodoroTracker {
  margin-top: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--border-radius-md);
}

.pomodoroTracker h4 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-md);
  font-size: 1rem;
}

.pomodoroGrid {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.focusMode .startButton {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%) !important;
  color: #2c3e50 !important;
  border: 2px solid #e67e22 !important;
  box-shadow: 0 4px 16px rgba(230, 126, 34, 0.3) !important;
}

.focusMode .startButton:hover {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
  color: #2c3e50 !important;
  border-color: #d35400 !important;
  box-shadow: 0 8px 24px rgba(230, 126, 34, 0.4) !important;
}

.focusMode .startButton::before {
  background: linear-gradient(135deg, rgba(230, 126, 34, 0.1) 0%, transparent 100%) !important;
}

.pomodoroItem.completed {
  background: rgba(46, 204, 113, 0.2);
  border: 2px solid #2ecc71;
  transform: scale(1.1);
}

.pomodoroItem.current {
  background: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
  animation: pulse 2s infinite;
}

.pomodoroItem.pending {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  opacity: 0.6;
}

/* Footer */
.footer {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  color: var(--text-light);
  text-align: center;
  padding: var(--spacing-2xl);
  margin-top: auto;
  border-top: 1px solid var(--glass-border);
}

.footer p {
  margin-bottom: var(--spacing-md);
  opacity: 0.9;
}

.footerLinks {
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.footerLinks a {
  color: var(--text-light);
  text-decoration: none;
  opacity: 0.8;
  transition: all var(--transition-fast);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
}

.footerLinks a:hover {
  opacity: 1;
  background: var(--glass-bg);
  transform: translateY(-2px);
}

.footerInfo {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--glass-border);
}

.footerInfo p {
  font-size: 0.85rem;
  opacity: 0.7;
  margin: 0;
}

/* Loading States */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

/* Focus and Accessibility */
.controlButton:focus,
.input:focus,
.startButton:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav {
    padding: 0 var(--spacing-lg);
  }
  
  .main {
    padding: var(--spacing-lg);
  }
  
  .modeSelectionGrid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .timerDisplay {
    min-width: auto;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-lg);
  }
  
  .nav {
    flex-direction: column;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
  }
  
  .navLinks {
    gap: var(--spacing-md);
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .main {
    padding: var(--spacing-md);
  }
  
  .intro,
  .benefits {
    padding: var(--spacing-lg);
    margin: var(--spacing-lg) 0;
  }
  
  .formContainer {
    padding: var(--spacing-lg);
  }
  
  .timerDisplay {
    padding: var(--spacing-lg);
  }
  
  .timeNumber {
    font-size: 3.5rem;
  }
  
  .phaseText {
    font-size: 1.75rem;
  }
  
  .controls {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .modeSelectionGrid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
  
  .benefitGrid {
    grid-template-columns: 1fr;
  }
  
  .timerHeader {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }
  
  .presetButtons {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
  
  .footerLinks {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .breathingCircle {
    width: 120px;
    height: 120px;
  }
  
  .breathingText {
    font-size: 1rem;
  }
  
  .pomodoroGrid {
    gap: var(--spacing-xs);
  }
  
  .pomodoroItem {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 2rem;
  }
  
  .nav {
    padding: var(--spacing-sm);
  }
  
  .main {
    padding: var(--spacing-sm);
  }
  
  .intro,
  .benefits {
    padding: var(--spacing-md);
  }
  
  .formContainer,
  .timerDisplay {
    padding: var(--spacing-md);
  }
  
  .timeNumber {
    font-size: 3rem;
  }
  
  .phaseText {
    font-size: 1.5rem;
  }
  
  .modeCardHeader {
    padding: var(--spacing-xl) var(--spacing-md);
  }
  
  .modeCardIcon {
    font-size: 3rem;
  }
  
  .selectedModeCard {
    flex-direction: column;
    text-align: center;
  }
  
  .meditationTips, 
  .focusTips, 
  .pomodoroTracker {
    padding: var(--spacing-sm);
  }
  
  .tipCard {
    padding: var(--spacing-sm);
  }
  
  .pomodoroItem {
    width: 30px;
    height: 30px;
    font-size: 1rem;
  }
}
```

