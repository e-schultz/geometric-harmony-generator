
export type VisualizationType = 'tunnel' | 'grid' | 'polyhedron' | 'particles' | 'hexGrid';

export interface VisualizationConfig {
  type: VisualizationType;
  speed: number;
  rotation: number;
  perspective: number;
  lineCount: number;
  lineOpacity: number;
  pulseEffect: boolean;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Line {
  start: Point3D;
  end: Point3D;
  opacity: number;
}

export interface ControlsProps {
  config: VisualizationConfig;
  onChange: (config: Partial<VisualizationConfig>) => void;
  onReset: () => void;
}

export interface VisualizerProps {
  config: VisualizationConfig;
}
