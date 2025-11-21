export enum AppState {
  LANDING = 'LANDING',
  COUNTDOWN = 'COUNTDOWN',
  SHOOTING = 'SHOOTING',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT'
}

export interface PhotoData {
  id: string;
  dataUrl: string;
  timestamp: number;
}

export interface FilterConfig {
  sepia: number;
  contrast: number;
  brightness: number;
  saturation: number;
  noise: number;
}