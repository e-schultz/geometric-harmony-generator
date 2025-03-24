
import React, { useState, useEffect, useMemo } from 'react';

interface TimeGridVisualizerProps {
  totalSquares: number;
  timeRemaining: number;
  timeDuration: number;
  className?: string;
}

const TimeGridVisualizer: React.FC<TimeGridVisualizerProps> = ({
  totalSquares,
  timeRemaining,
  timeDuration,
  className
}) => {
  // State to track viewport dimensions
  const [dimensions, setDimensions] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });
  
  // Calculate grid dimensions with useMemo to avoid recalculating on every render
  const gridDimensions = useMemo(() => {
    const aspectRatio = dimensions.width / dimensions.height;
    let cols = Math.ceil(Math.sqrt(totalSquares * aspectRatio));
    let rows = Math.ceil(totalSquares / cols);
    
    // Ensure minimum dimensions for better visualization
    if (cols < 3 && totalSquares >= 3) cols = 3;
    if (rows < 3 && totalSquares >= 3) rows = 3;
    
    return { cols, rows };
  }, [dimensions.width, dimensions.height, totalSquares]);
  
  // Handle window resize with debounce for performance
  useEffect(() => {
    let resizeTimeout: number;
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 150); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);
  
  // Calculate all square fill percentages at once to avoid recalculation in render loop
  const squareFillPercentages = useMemo(() => {
    const totalSeconds = timeDuration * 60;
    const elapsedSeconds = totalSeconds - timeRemaining;
    const currentFillingSquare = Math.floor(elapsedSeconds / 60);
    const secondsInCurrentMinute = elapsedSeconds % 60;
    const currentSquarePercentage = (secondsInCurrentMinute / 60) * 100;
    
    return Array.from({ length: totalSquares }).map((_, idx) => {
      if (idx < currentFillingSquare) return 100;
      if (idx === currentFillingSquare) return currentSquarePercentage;
      return 0;
    });
  }, [timeRemaining, timeDuration, totalSquares]);
  
  return (
    <div 
      className="absolute inset-0 grid gap-1"
      style={{ 
        gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`
      }}
    >
      {squareFillPercentages.map((fillPercentage, idx) => (
        <div 
          key={idx}
          className="relative rounded-sm border border-white/60 overflow-hidden"
        >
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white/40 transition-all duration-300 ease-linear"
            style={{ height: `${fillPercentage}%` }}
          />
        </div>
      ))}
    </div>
  );
};

export default React.memo(TimeGridVisualizer);
