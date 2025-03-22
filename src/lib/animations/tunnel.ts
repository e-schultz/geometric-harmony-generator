
import { Point3D, Line } from '../types';
import { rotateY } from './utils';

// Generate tunnel visualization lines
export const generateTunnelLines = (
  lineCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  const lines: Line[] = [];
  const centerX = 0;
  const centerY = 0;
  
  // Create perspective tunnel effect with rectangles
  for (let i = 0; i < lineCount; i++) {
    const z = -depth + (i / lineCount) * depth * 2;
    const size = 150 - (i / lineCount) * 100;
    const opacity = 0.2 + (i / lineCount) * 0.8;
    
    // Add time-based animation
    const adjustedZ = z + Math.sin(time / 1000) * 20;
    const t = rotation * time / 1000;
    
    // Calculate corners of the rectangle
    const corners: Point3D[] = [
      { x: centerX - size, y: centerY - size, z: adjustedZ },
      { x: centerX + size, y: centerY - size, z: adjustedZ },
      { x: centerX + size, y: centerY + size, z: adjustedZ },
      { x: centerX - size, y: centerY + size, z: adjustedZ },
    ];
    
    // Apply rotation
    const rotatedCorners = corners.map(corner => rotateY(corner, t));
    
    // Create four lines forming a rectangle
    for (let j = 0; j < 4; j++) {
      lines.push({
        start: rotatedCorners[j],
        end: rotatedCorners[(j + 1) % 4],
        opacity
      });
    }
    
    // Add diagonal lines for better 3D effect
    if (i % 3 === 0 && i < lineCount - 1) {
      const nextZ = -depth + ((i + 1) / lineCount) * depth * 2;
      const nextSize = 150 - ((i + 1) / lineCount) * 100;
      const nextAdjustedZ = nextZ + Math.sin(time / 1000) * 20;
      
      const nextCorners: Point3D[] = [
        { x: centerX - nextSize, y: centerY - nextSize, z: nextAdjustedZ },
        { x: centerX + nextSize, y: centerY - nextSize, z: nextAdjustedZ },
        { x: centerX + nextSize, y: centerY + nextSize, z: nextAdjustedZ },
        { x: centerX - nextSize, y: centerY + nextSize, z: nextAdjustedZ },
      ];
      
      const rotatedNextCorners = nextCorners.map(corner => rotateY(corner, t));
      
      for (let j = 0; j < 4; j++) {
        lines.push({
          start: rotatedCorners[j],
          end: rotatedNextCorners[j],
          opacity
        });
      }
    }
  }
  
  return lines;
};
