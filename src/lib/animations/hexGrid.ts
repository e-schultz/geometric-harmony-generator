
import { Point3D, Line } from '../types';
import { rotateX, rotateY, rotateZ } from './utils';
import { sineWave } from '../waveGenerators';

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

// Function to generate Super Hexagon style with expanding outward effect (reverse)
export const generateHexGridLines = (
  lineCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  let lines: Line[] = [];
  const t = time / 1000;
  const maxRadius = Math.min(width, height) * 0.45;
  
  // Calculate how many hexagon rings to create based on lineCount
  const hexagonCount = Math.max(3, Math.min(12, Math.floor(lineCount / 2)));
  
  // Create animation parameters
  const baseRotation = t * rotation;
  
  // Super Hexagon style: layers of hexagons with alternating rotation
  for (let i = 0; i < hexagonCount; i++) {
    // Calculate a normalized position in the sequence (0 to 1)
    const ringRatio = i / hexagonCount;
    
    // Super Hexagon style: create a spinning effect with alternating directions
    const hexRotation = baseRotation + (i % 2 === 0 ? 1 : -1) * ringRatio * Math.PI / 3;
    
    // Expansion animation (reverse of collapse)
    // As time progresses, hexagons expand outward from center
    const expansionPhase = ((t * 0.5) % 1 + ringRatio) % 1; // Creates a staggered expansion
    const expansionScale = Math.pow(expansionPhase, 1.5); // Accelerating outward
    
    // Radius grows as the expansion progresses (Super Hexagon style)
    const radius = maxRadius * expansionScale;
    
    // Smaller hexagons are closer to viewer (higher z) for perspective effect
    const zPosition = -depth * 0.8 + depth * 0.6 * (1 - expansionScale);
    
    // Opacity fades as hexagons expand outward
    const opacity = 1 - 0.7 * expansionScale;
    
    // Generate the primary hexagon at this layer
    const mainHex = generateHexagon(0, 0, zPosition, radius, hexRotation, opacity);
    lines.push(...mainHex);
    
    // Super Hexagon style: Add inner structure with different rotation
    if (radius > 10) {
      const innerHex = generateHexagon(
        0, 0, zPosition + 5, 
        radius * 0.7, 
        hexRotation + Math.PI / 6, 
        opacity * 0.8
      );
      lines.push(...innerHex);
      
      // Add spokes connecting the hexagons (typical in Super Hexagon)
      if (i % 2 === 0) {
        for (let j = 0; j < 6; j++) {
          const spokeAngle = (j / 6) * Math.PI * 2 + hexRotation;
          const innerRadius = radius * 0.7;
          const outerRadius = radius;
          
          const x1 = innerRadius * Math.cos(spokeAngle);
          const y1 = innerRadius * Math.sin(spokeAngle);
          const x2 = outerRadius * Math.cos(spokeAngle);
          const y2 = outerRadius * Math.sin(spokeAngle);
          
          lines.push({
            start: { x: x1, y: y1, z: zPosition + 2 },
            end: { x: x2, y: y2, z: zPosition },
            opacity: opacity * 0.9
          });
        }
      }
    }
  }
  
  // Apply subtle 3D rotation to the entire structure
  const rotatedLines = lines.map(line => {
    const rotate = (p: Point3D): Point3D => {
      let rotated = { ...p };
      rotated = rotateX(rotated, sineWave(t, 0.2, 0.1, 0));
      rotated = rotateY(rotated, sineWave(t, 0.3, 0.1, 0));
      return rotated;
    };
    
    return {
      start: rotate(line.start),
      end: rotate(line.end),
      opacity: line.opacity
    };
  });
  
  lines = rotatedLines;
  
  // Add pulsing wall-like obstacles (characteristic of Super Hexagon)
  const wallCount = 6;
  const wallBaseRotation = baseRotation * 0.3;
  
  for (let w = 0; w < wallCount; w++) {
    const wallAngle = (w / wallCount) * Math.PI * 2 + wallBaseRotation;
    const wallPhase = ((t * 0.7 + w / wallCount) % 1);
    
    // Only render walls that are moving outward (reverse of normal Super Hexagon)
    if (wallPhase > 0.2 && wallPhase < 0.8) {
      const wallRadius = maxRadius * 1.2 * wallPhase;
      const wallThickness = maxRadius * 0.15;
      
      const innerPoint1 = {
        x: (wallRadius - wallThickness) * Math.cos(wallAngle - 0.15),
        y: (wallRadius - wallThickness) * Math.sin(wallAngle - 0.15),
        z: -depth * 0.5
      };
      
      const outerPoint1 = {
        x: wallRadius * Math.cos(wallAngle - 0.15),
        y: wallRadius * Math.sin(wallAngle - 0.15),
        z: -depth * 0.5
      };
      
      const innerPoint2 = {
        x: (wallRadius - wallThickness) * Math.cos(wallAngle + 0.15),
        y: (wallRadius - wallThickness) * Math.sin(wallAngle + 0.15),
        z: -depth * 0.5
      };
      
      const outerPoint2 = {
        x: wallRadius * Math.cos(wallAngle + 0.15),
        y: wallRadius * Math.sin(wallAngle + 0.15),
        z: -depth * 0.5
      };
      
      const wallOpacity = 0.7 * (1 - Math.abs(wallPhase - 0.5) * 2);
      
      lines.push(
        { start: innerPoint1, end: outerPoint1, opacity: wallOpacity },
        { start: outerPoint1, end: outerPoint2, opacity: wallOpacity },
        { start: outerPoint2, end: innerPoint2, opacity: wallOpacity },
        { start: innerPoint2, end: innerPoint1, opacity: wallOpacity }
      );
    }
  }
  
  return lines;
};
