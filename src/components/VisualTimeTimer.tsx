
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface VisualTimeTimerProps {
  timeDuration: number; // Total duration in minutes
  interval: number; // Interval in seconds
  className?: string;
}

const VisualTimeTimer: React.FC<VisualTimeTimerProps> = ({
  timeDuration,
  interval,
  className
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeDuration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  
  // Number of squares is equal to the number of minutes
  const totalSquares = timeDuration;
  
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
  
  // Start/pause the timer
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(timeDuration * 60);
  };
  
  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate which squares should be filled based on elapsed time
  const getFilledSquares = () => {
    const totalSeconds = timeDuration * 60;
    const elapsedSeconds = totalSeconds - timeRemaining;
    const filledMinutes = Math.floor(elapsedSeconds / 60);
    return filledMinutes;
  };
  
  const filledSquares = getFilledSquares();
  
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10", className)}>
      {/* Full viewport grid overlay */}
      <div 
        className="absolute inset-0 grid gap-1"
        style={{ 
          gridTemplateColumns: `repeat(${gridDimensions.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`
        }}
      >
        {Array.from({ length: totalSquares }).map((_, idx) => {
          const isFilled = idx < filledSquares;
          
          return (
            <div 
              key={idx}
              className={cn(
                "relative rounded-sm border border-white/60",
                isFilled ? "bg-white/30" : "bg-transparent"
              )}
            />
          );
        })}
      </div>
      
      {/* Overlay UI */}
      <div className="fixed bottom-8 flex flex-col items-center gap-6 pointer-events-auto">
        {/* Timer Display */}
        <div className="text-5xl font-mono text-white/90 tracking-wider backdrop-blur-sm bg-black/10 px-6 py-3 rounded-full border border-white/10 shadow-xl">
          {formatTime(timeRemaining)}
        </div>
        
        {/* Controls */}
        <div className="flex space-x-4">
          <button
            onClick={toggleTimer}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 transition-colors border border-white/10 backdrop-blur-sm text-sm shadow-md"
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 transition-colors border border-white/10 backdrop-blur-sm text-sm shadow-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default VisualTimeTimer;
