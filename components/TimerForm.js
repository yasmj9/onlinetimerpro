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