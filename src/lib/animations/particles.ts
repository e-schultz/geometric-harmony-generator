
import { Line, Point3D } from '../types';
import { rotateX, rotateY, rotateZ } from './utils';

// Helper function to create a random 3D point within given bounds
const randomPoint = (maxDist: number): Point3D => {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI * 2;
  const r = Math.random() * maxDist;
  
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi)
  };
};

// Generate particle system visualization lines
export const generateParticleLines = (
  particleCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  const lines: Line[] = [];
  const t = time / 1000;
  const maxDist = Math.min(width, height) * 0.4;
  
  // Generate particles
  const particles: Point3D[] = Array.from({ length: particleCount }, () => randomPoint(maxDist));
  
  // Create connections between nearby particles
  const connectionThreshold = maxDist * 0.3;
  
  // Update particle positions based on time
  const updatedParticles = particles.map((p, i) => {
    // Use unique offsets for each particle to create varied movement
    const offset = i * 0.1;
    const noiseScale = 0.2;
    
    // Create smooth oscillating motion
    const xOffset = Math.sin(t * 0.5 + offset) * noiseScale * maxDist;
    const yOffset = Math.cos(t * 0.7 + offset * 2) * noiseScale * maxDist;
    const zOffset = Math.sin(t * 0.3 + offset * 3) * noiseScale * maxDist;
    
    // Apply rotations
    let rotated = {
      x: p.x + xOffset,
      y: p.y + yOffset,
      z: p.z + zOffset
    };
    
    rotated = rotateX(rotated, t * rotation * 0.2);
    rotated = rotateY(rotated, t * rotation * 0.1);
    rotated = rotateZ(rotated, t * rotation * 0.05);
    
    return rotated;
  });
  
  // Create connections between nearby particles
  for (let i = 0; i < updatedParticles.length; i++) {
    for (let j = i + 1; j < updatedParticles.length; j++) {
      const p1 = updatedParticles[i];
      const p2 = updatedParticles[j];
      
      // Calculate distance
      const dx = p1.x - p2.x;
      const dy = p1.y - p2.y;
      const dz = p1.z - p2.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      // Connect particles if they're close enough
      if (distance < connectionThreshold) {
        // Calculate opacity based on distance
        const opacity = 1.0 - (distance / connectionThreshold);
        
        lines.push({
          start: p1,
          end: p2,
          opacity: opacity * 0.8 // Adjust for visual clarity
        });
      }
    }
  }
  
  return lines;
};
