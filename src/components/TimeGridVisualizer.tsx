
import React, { useState, useEffect } from 'react';

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
  // Calculate grid dimensions based on viewport aspect ratio
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [gridDimensions, setGridDimensions] = useState({ cols: 1, rows: 1 });
  
  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });
      
      // Calculate grid dimensions based on aspect ratio and total squares
      const aspectRatio = width / height;
      let cols = Math.ceil(Math.sqrt(totalSquares * aspectRatio));
      let rows = Math.ceil(totalSquares / cols);
      
      // Adjust if we have too few in either dimension
      if (cols < 3 && totalSquares >= 3) cols = 3;
      if (rows < 3 && totalSquares >= 3) rows = 3;
      
      setGridDimensions({ cols, rows });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [totalSquares]);
  
  // Calculate how filled each square should be
  const getSquareFilledPercentage = (squareIndex: number) => {
    const totalSeconds = timeDuration * 60;
    const elapsedSeconds = totalSeconds - timeRemaining;
    
    // Calculate which minute we're on (which square should be filling)
    const currentFillingSquare = Math.floor(elapsedSeconds / 60);
    
    // For squares before the current one, they should be 100% filled
    if (squareIndex < currentFillingSquare) {
      return 100;
    }
    
    // For the current square being filled, calculate the percentage
    if (squareIndex === currentFillingSquare) {
      const secondsInCurrentMinute = elapsedSeconds % 60;
      return (secondsInCurrentMinute / 60) * 100;
    }
    
    // For squares after the current one, they should be 0% filled
    return 0;
  };
  
  return (
    <div 
      className="absolute inset-0 grid gap-1"
      style={{ 
        gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`
      }}
    >
      {Array.from({ length: totalSquares }).map((_, idx) => {
        const fillPercentage = getSquareFilledPercentage(idx);
        
        return (
          <div 
            key={idx}
            className="relative rounded-sm border border-white/60 overflow-hidden"
          >
            {/* Filled area - uses a dynamic height based on fill percentage with increased transparency */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-white/40 transition-all duration-300 ease-linear"
              style={{ height: `${fillPercentage}%` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default TimeGridVisualizer;
