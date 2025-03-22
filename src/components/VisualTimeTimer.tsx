
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
  
  // Calculate the total number of squares needed
  const totalSquares = Math.ceil(timeDuration * 60 / interval);
  
  // Calculate the number of active squares
  const activeSquares = Math.ceil(timeRemaining / interval);
  
  // Calculate grid dimensions to make it as square as possible
  const cols = Math.ceil(Math.sqrt(totalSquares));
  const rows = Math.ceil(totalSquares / cols);
  
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
  
  // Calculate completion percentage
  const completionPercentage = ((timeDuration * 60 - timeRemaining) / (timeDuration * 60)) * 100;
  
  return (
    <div className={cn("flex flex-col items-center p-4 space-y-4 bg-black/20 backdrop-blur-sm rounded-lg border border-white/10", className)}>
      {/* Timer Display */}
      <div className="text-3xl font-mono text-white">
        {formatTime(timeRemaining)}
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>
      
      {/* Grid of Squares */}
      <div 
        className="grid gap-1 w-full"
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          aspectRatio: `${cols}/${rows}`
        }}
      >
        {Array.from({ length: totalSquares }).map((_, idx) => {
          // Calculate if the square should be active
          const isActive = idx < activeSquares;
          
          // Calculate progress within the current active square
          const isCurrentActive = idx === activeSquares - 1;
          const squareProgress = isCurrentActive
            ? (timeRemaining % interval) / interval
            : 1;
          
          return (
            <div 
              key={idx}
              className={cn(
                "relative rounded-md transition-colors duration-300 ease-in-out aspect-square",
                isActive 
                  ? "bg-gradient-to-br from-blue-500 to-purple-500" 
                  : "bg-white/10"
              )}
            >
              {isCurrentActive && (
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-black/20 transition-all duration-1000 ease-linear"
                  style={{ height: `${(1 - squareProgress) * 100}%` }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={toggleTimer}
          className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default VisualTimeTimer;
