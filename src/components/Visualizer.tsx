
import React, { useRef, useEffect, useState } from 'react';
import { VisualizerProps, Line } from '@/lib/types';
import { project, generateLines } from '@/lib/animations';

const Visualizer: React.FC<VisualizerProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  
  // Set up canvas and dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Main animation loop
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Calculate depth based on perspective
    const depth = config.perspective;
    
    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Generate lines based on current config
      const lines = generateLines(
        config.type,
        config.lineCount,
        depth,
        dimensions.width,
        dimensions.height,
        config.rotation,
        time * config.speed
      );
      
      // Draw lines
      ctx.lineCap = 'round';
      
      // Sort lines by z-index for proper rendering (back to front)
      lines.sort((a, b) => (a.start.z + a.end.z) / 2 - (b.start.z + b.end.z) / 2);
      
      // Draw each line
      lines.forEach((line: Line) => {
        const [x1, y1] = project(line.start, config.perspective, dimensions.width, dimensions.height);
        const [x2, y2] = project(line.end, config.perspective, dimensions.width, dimensions.height);
        
        // Skip if outside canvas
        if (
          x1 < -100 || x1 > dimensions.width + 100 ||
          y1 < -100 || y1 > dimensions.height + 100 ||
          x2 < -100 || x2 > dimensions.width + 100 ||
          y2 < -100 || y2 > dimensions.height + 100
        ) {
          return;
        }
        
        // Apply pulse effect if enabled
        let opacity = line.opacity * config.lineOpacity;
        if (config.pulseEffect) {
          opacity *= 0.7 + 0.3 * Math.sin(time / 1000);
        }
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });
      
      animationRef.current = requestAnimationFrame(draw);
    };
    
    animationRef.current = requestAnimationFrame(draw);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [config, dimensions]);
  
  return (
    <div ref={containerRef} className="viz-canvas w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Visualizer;
