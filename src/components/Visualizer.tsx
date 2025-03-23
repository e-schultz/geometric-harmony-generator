
import React, { useRef, useEffect, useState } from 'react';
import { Line } from '@/lib/types';
import { project, generateLines } from '@/lib/animations';
import { useVisualization } from '@/contexts/VisualizationContext';

const Visualizer: React.FC = () => {
  const { config } = useVisualization();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  
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
  
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    const depth = config.perspective;
    
    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const lines = generateLines(
        config.type,
        config.lineCount,
        depth,
        dimensions.width,
        dimensions.height,
        config.rotation,
        time * config.speed
      );
      
      ctx.lineCap = 'round';
      
      lines.sort((a, b) => (a.start.z + a.end.z) / 2 - (b.start.z + b.end.z) / 2);
      
      lines.forEach((line: Line) => {
        const [x1, y1] = project(line.start, config.perspective, dimensions.width, dimensions.height);
        const [x2, y2] = project(line.end, config.perspective, dimensions.width, dimensions.height);
        
        if (
          x1 < -100 || x1 > dimensions.width + 100 ||
          y1 < -100 || y1 > dimensions.height + 100 ||
          x2 < -100 || x2 > dimensions.width + 100 ||
          y2 < -100 || y2 > dimensions.height + 100
        ) {
          return;
        }
        
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
