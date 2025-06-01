export interface TimerState {
  isRunning: boolean;
  timeLeft: number;
  initialTime: number;
  progress: number;
}

export interface CountdownConfig {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TrainingConfig {
  exerciseDuration: number;
  restDuration: number;
  numberOfSets: number;
}

export interface TrainingState {
  currentSet: number;
  isExercise: boolean;
  isComplete: boolean;
  config: TrainingConfig | null;
}

export type TimerMode = 'default' | 'countdown' | 'training';