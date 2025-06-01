import { create } from 'zustand';

interface TrainingPreset {
  id: string;
  name: string;
  exerciseDuration: number;
  restDuration: number;
  numberOfSets: number;
  readyDuration?: number; // Optional for backward compatibility
}

interface TimerStore {
  // Training presets
  trainingPresets: TrainingPreset[];
  addPreset: (preset: Omit<TrainingPreset, 'id'>) => void;
  removePreset: (id: string) => void;
  updatePreset: (id: string, preset: Partial<TrainingPreset>) => void;
  
  // Settings
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  
  // Recent countdown times (for quick access)
  recentCountdowns: number[];
  addRecentCountdown: (duration: number) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
  trainingPresets: [
    {
      id: 'default-hiit',
      name: 'HIIT Workout',
      exerciseDuration: 30,
      restDuration: 10,
      numberOfSets: 8,
      readyDuration: 10
    },
    {
      id: 'default-tabata',
      name: 'Tabata',
      exerciseDuration: 20,
      restDuration: 10,
      numberOfSets: 8,
      readyDuration: 10
    }
  ],
  
  addPreset: (preset) => {
    const id = `preset-${Date.now()}`;
    set((state) => ({
      trainingPresets: [...state.trainingPresets, { ...preset, id }]
    }));
  },
  
  removePreset: (id) => {
    set((state) => ({
      trainingPresets: state.trainingPresets.filter(p => p.id !== id)
    }));
  },
  
  updatePreset: (id, updates) => {
    set((state) => ({
      trainingPresets: state.trainingPresets.map(p => 
        p.id === id ? { ...p, ...updates } : p
      )
    }));
  },
  
  soundEnabled: true,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  
  recentCountdowns: [],
  addRecentCountdown: (duration) => {
    set((state) => {
      const recent = [duration, ...state.recentCountdowns.filter(d => d !== duration)];
      return { recentCountdowns: recent.slice(0, 5) }; // Keep only 5 recent
    });
  }
}));