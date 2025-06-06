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