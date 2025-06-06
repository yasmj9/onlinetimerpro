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