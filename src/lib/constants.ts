import { VisualizationConfig, VisualizationType } from './types';

export const VISUALIZATION_TYPES: VisualizationType[] = ['tunnel', 'grid', 'polyhedron', 'particles'];

export const DEFAULT_CONFIG: VisualizationConfig = {
  type: 'tunnel',
  speed: 5,
  rotation: 0.5,
  perspective: 800,
  lineCount: 15,
  lineOpacity: 0.8,
  pulseEffect: true
};

export const MAX_LINE_COUNT = 30;
export const MIN_LINE_COUNT = 5;

export const MAX_SPEED = 10;
export const MIN_SPEED = 1;

export const MAX_ROTATION = 2;
export const MIN_ROTATION = 0;

export const MAX_PERSPECTIVE = 1500;
export const MIN_PERSPECTIVE = 200;

export const MAX_LINE_OPACITY = 1;
export const MIN_LINE_OPACITY = 0.1;
