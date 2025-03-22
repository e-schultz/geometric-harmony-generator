
import { Point3D, Line } from './types';

// Convert 3D coordinates to 2D screen coordinates
export const project = (point: Point3D, perspective: number, width: number, height: number): [number, number] => {
  const factor = perspective / (perspective + point.z);
  const x = point.x * factor + width / 2;
  const y = point.y * factor + height / 2;
  return [x, y];
};

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
    const rotatedCorners = corners.map(corner => ({
      x: corner.x * Math.cos(t) - corner.z * Math.sin(t),
      y: corner.y,
      z: corner.x * Math.sin(t) + corner.z * Math.cos(t)
    }));
    
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
      
      const rotatedNextCorners = nextCorners.map(corner => ({
        x: corner.x * Math.cos(t) - corner.z * Math.sin(t),
        y: corner.y,
        z: corner.x * Math.sin(t) + corner.z * Math.cos(t)
      }));
      
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
  
  // Create horizontal and vertical lines
  for (let i = -lineCount / 2; i <= lineCount / 2; i++) {
    const t = rotation * time / 1000;
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
    const rotatePoint = (point: Point3D): Point3D => ({
      x: point.x * Math.cos(t) - point.z * Math.sin(t),
      y: point.y,
      z: point.x * Math.sin(t) + point.z * Math.cos(t)
    });
    
    return {
      start: rotatePoint(line.start),
      end: rotatePoint(line.end),
      opacity: line.opacity
    };
  });
};

// Generate polyhedron visualization lines
export const generatePolyhedronLines = (
  lineCount: number,
  depth: number,
  width: number,
  height: number,
  rotation: number,
  time: number
): Line[] => {
  const lines: Line[] = [];
  const t = rotation * time / 1000;
  
  // Create a simple polyhedron (octahedron)
  const size = 150;
  const vertices: Point3D[] = [
    { x: 0, y: -size, z: 0 },       // top
    { x: 0, y: size, z: 0 },        // bottom
    { x: -size, y: 0, z: 0 },       // left
    { x: size, y: 0, z: 0 },        // right
    { x: 0, y: 0, z: -size },       // front
    { x: 0, y: 0, z: size },        // back
  ];
  
  // Define edges
  const edges = [
    [0, 2], [0, 3], [0, 4], [0, 5], // top to sides
    [1, 2], [1, 3], [1, 4], [1, 5], // bottom to sides
    [2, 4], [4, 3], [3, 5], [5, 2]  // middle connections
  ];
  
  // Apply rotation based on time
  const rotateX = (point: Point3D, angle: number): Point3D => ({
    x: point.x,
    y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
    z: point.y * Math.sin(angle) + point.z * Math.cos(angle)
  });
  
  const rotateY = (point: Point3D, angle: number): Point3D => ({
    x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
    y: point.y,
    z: point.x * Math.sin(angle) + point.z * Math.cos(angle)
  });
  
  const rotateZ = (point: Point3D, angle: number): Point3D => ({
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
    z: point.z
  });
  
  const rotatedVertices = vertices.map(v => {
    let point = { ...v };
    point = rotateX(point, t * 0.5);
    point = rotateY(point, t);
    point = rotateZ(point, t * 0.3);
    return point;
  });
  
  // Create lines from edges
  edges.forEach(([i, j]) => {
    lines.push({
      start: rotatedVertices[i],
      end: rotatedVertices[j],
      opacity: 0.8
    });
  });
  
  // Add extra vertices and edges based on lineCount for more complex polyhedron
  if (lineCount > 10) {
    // Create extra points and connections for more complex shapes
    for (let i = 0; i < lineCount - 10; i++) {
      const angle = (i / (lineCount - 10)) * Math.PI * 2;
      const height = Math.sin(angle + time / 1000) * size * 0.5;
      const radius = Math.cos(angle + time / 1000) * size * 0.5;
      
      const newVertex: Point3D = {
        x: Math.cos(angle) * radius,
        y: height,
        z: Math.sin(angle) * radius
      };
      
      let rotatedVertex = { ...newVertex };
      rotatedVertex = rotateX(rotatedVertex, t * 0.5);
      rotatedVertex = rotateY(rotatedVertex, t);
      rotatedVertex = rotateZ(rotatedVertex, t * 0.3);
      
      // Connect to closest vertices
      for (let j = 0; j < Math.min(4, rotatedVertices.length); j++) {
        lines.push({
          start: rotatedVertex,
          end: rotatedVertices[j],
          opacity: 0.6
        });
      }
    }
  }
  
  return lines;
};

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
    default:
      return generateTunnelLines(lineCount, depth, width, height, rotation, time);
  }
};
