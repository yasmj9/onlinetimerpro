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