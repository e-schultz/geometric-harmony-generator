
import { Point3D, Line } from '../types';
import { rotateX, rotateY, rotateZ } from './utils';

// Function to generate a single hexagon with given parameters
const generateHexagon = (
  centerX: number,
  centerY: number,
  centerZ: number,
  radius: number,
  rotation: number,
  opacity: number
): Line[] => {
  const lines: Line[] = [];
  const sides = 6;
  
  for (let i = 0; i < sides; i++) {
    const angle1 = (i / sides) * Math.PI * 2 + rotation;
    const angle2 = ((i + 1) / sides) * Math.PI * 2 + rotation;
    
    const x1 = centerX + radius * Math.cos(angle1);
    const y1 = centerY + radius * Math.sin(angle1);
    const x2 = centerX + radius * Math.cos(angle2);
    const y2 = centerY + radius * Math.sin(angle2);
    
    lines.push({
      start: { x: x1, y: y1, z: centerZ },
      end: { x: x2, y: y2, z: centerZ },
      opacity
    });
  }
  
  return lines;
};

// Function to generate nested hexagons with recursive collapsing effect
export const generateHexGridLines = (
  lineCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  const lines: Line[] = [];
  const t = time / 1000;
  const maxRadius = Math.min(width, height) * 0.4;
  
  // Calculate how many hexagon rings to create based on lineCount
  // We'll create multiple hexagons at different scales to create the recursive effect
  const hexagonCount = Math.max(3, Math.min(10, Math.floor(lineCount / 3)));
  
  // Create animation parameters
  const baseRotation = t * rotation * 0.5;
  const pulseSpeed = t * 0.5;
  const collapsePhase = (Math.sin(pulseSpeed) + 1) / 2; // 0 to 1 value for collapse animation
  
  // Generate multiple nested hexagons with progressive scaling and rotation
  for (let i = 0; i < hexagonCount; i++) {
    const ringRatio = i / hexagonCount;
    const hexRotation = baseRotation + ringRatio * Math.PI / 3; // Each ring has slightly different rotation
    
    // Calculate radius with pulsing effect
    // Larger hexagons collapse faster than smaller ones
    const ringCollapsePhase = (collapsePhase + ringRatio) % 1;
    const scaleFactor = 1 - 0.5 * Math.pow(ringCollapsePhase, 2);
    const radius = maxRadius * (1 - ringRatio * 0.8) * scaleFactor;
    
    // Calculate depth position (z) with oscillation to create dynamic 3D effect
    const zPosition = -depth * 0.5 + Math.sin(t + ringRatio * Math.PI * 2) * 50;
    
    // Calculate opacity (inner rings are more transparent)
    const opacity = 0.3 + 0.7 * ringRatio;
    
    // Generate the hexagon
    const hexLines = generateHexagon(0, 0, zPosition, radius, hexRotation, opacity);
    
    // Apply 3D rotations to each hexagon
    const rotatedLines = hexLines.map(line => {
      // Apply different rotation angles to create a more interesting 3D effect
      const rotate = (p: Point3D): Point3D => {
        let rotated = { ...p };
        rotated = rotateX(rotated, baseRotation * 0.2);
        rotated = rotateY(rotated, baseRotation * 0.3);
        rotated = rotateZ(rotated, hexRotation * 0.1);
        return rotated;
      };
      
      return {
        start: rotate(line.start),
        end: rotate(line.end),
        opacity: line.opacity
      };
    });
    
    lines.push(...rotatedLines);
    
    // Add connecting lines between adjacent rings to emphasize the recursive nature
    if (i > 0 && i < hexagonCount - 1) {
      const connectCount = 3; // Number of connection lines between rings
      for (let j = 0; j < connectCount; j++) {
        const angle = (j / connectCount) * Math.PI * 2 + hexRotation;
        const innerRadius = maxRadius * (1 - (ringRatio + 1/hexagonCount) * 0.8) * scaleFactor;
        const outerRadius = radius;
        
        const x1 = outerRadius * Math.cos(angle);
        const y1 = outerRadius * Math.sin(angle);
        const x2 = innerRadius * Math.cos(angle);
        const y2 = innerRadius * Math.sin(angle);
        
        const connectLine = {
          start: { x: x1, y: y1, z: zPosition },
          end: { x: x2, y: y2, z: zPosition - 10 },
          opacity: opacity * 0.7
        };
        
        const rotatedConnectLine = {
          start: rotateX(rotateY(rotateZ(connectLine.start, hexRotation * 0.1), baseRotation * 0.3), baseRotation * 0.2),
          end: rotateX(rotateY(rotateZ(connectLine.end, hexRotation * 0.1), baseRotation * 0.3), baseRotation * 0.2),
          opacity: connectLine.opacity
        };
        
        lines.push(rotatedConnectLine);
      }
    }
  }
  
  return lines;
};
