
import { Point3D } from '../types';

// Convert 3D coordinates to 2D screen coordinates
export const project = (point: Point3D, perspective: number, width: number, height: number): [number, number] => {
  const factor = perspective / (perspective + point.z);
  const x = point.x * factor + width / 2;
  const y = point.y * factor + height / 2;
  return [x, y];
};

// Standard rotation functions used by multiple visualizations
export const rotateX = (point: Point3D, angle: number): Point3D => ({
  x: point.x,
  y: point.y * Math.cos(angle) - point.z * Math.sin(angle),
  z: point.y * Math.sin(angle) + point.z * Math.cos(angle)
});

export const rotateY = (point: Point3D, angle: number): Point3D => ({
  x: point.x * Math.cos(angle) - point.z * Math.sin(angle),
  y: point.y,
  z: point.x * Math.sin(angle) + point.z * Math.cos(angle)
});

export const rotateZ = (point: Point3D, angle: number): Point3D => ({
  x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
  y: point.x * Math.sin(angle) + point.y * Math.cos(angle),
  z: point.z
});
