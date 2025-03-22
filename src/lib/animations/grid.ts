
import { Point3D, Line } from '../types';
import { rotateY } from './utils';

// Generate grid visualization lines
export const generateGridLines = (
  lineCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  const lines: Line[] = [];
  const spacing = 50;
  const size = spacing * lineCount / 2;
  const t = rotation * time / 1000;
  
  // Create horizontal and vertical lines
  for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
    const opacity = 0.3 + Math.abs(i) / (lineCount / 2) * 0.7;
    
    // Horizontal lines
    lines.push({
      start: {
        x: -size,
        y: i * spacing,
        z: -depth / 2 + Math.sin(time / 2000 + i) * 20
      },
      end: {
        x: size,
        y: i * spacing,
        z: -depth / 2 + Math.sin(time / 2000 + i) * 20
      },
      opacity
    });
    
    // Vertical lines
    lines.push({
      start: {
        x: i * spacing,
        y: -size,
        z: -depth / 2 + Math.cos(time / 2000 + i) * 20
      },
      end: {
        x: i * spacing,
        y: size,
        z: -depth / 2 + Math.cos(time / 2000 + i) * 20
      },
      opacity
    });
  }
  
  // Apply rotation to all lines
  return lines.map(line => {
    const rotatePoint = (point: Point3D): Point3D => rotateY(point, t);
    
    return {
      start: rotatePoint(line.start),
      end: rotatePoint(line.end),
      opacity: line.opacity
    };
  });
};
