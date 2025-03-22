
import { Point3D, Line } from '../types';
import { rotateX, rotateY, rotateZ } from './utils';

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
