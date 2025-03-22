
import { Line } from '../types';
import { project } from './utils';
import { generateTunnelLines } from './tunnel';
import { generateGridLines } from './grid';
import { generatePolyhedronLines } from './polyhedron';
import { generateParticleLines } from './particles';

// Generate lines based on visualization type
export const generateLines = (
  type: string,
  lineCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  switch (type) {
    case 'tunnel':
      return generateTunnelLines(lineCount, depth, width, height, rotation, time);
    case 'grid':
      return generateGridLines(lineCount, depth, width, height, rotation, time);
    case 'polyhedron':
      return generatePolyhedronLines(lineCount, depth, width, height, rotation, time);
    case 'particles':
      return generateParticleLines(lineCount, depth, width, height, rotation, time);
    default:
      return generateTunnelLines(lineCount, depth, width, height, rotation, time);
  }
};

// Re-export the project function
export { project };
