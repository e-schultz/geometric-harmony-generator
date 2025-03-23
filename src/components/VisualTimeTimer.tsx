
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { VisualizationConfig, VisualizationType } from '@/lib/types';

interface VisualTimeTimerProps {
  timeDuration: number; // Total duration in minutes
  interval: number; // Interval in seconds
  className?: string;
  currentVisualization: VisualizationType; // Current visualization type chosen by user
  onVisualizationChange?: (config: Partial<VisualizationConfig>) => void;
}

const VisualTimeTimer: React.FC<VisualTimeTimerProps> = ({
  timeDuration,
  interval,
  className,
  currentVisualization,
  onVisualizationChange
}) => {
  const [timeRemaining, setTimeRemaining] = useState(timeDuration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  
  // Number of squares is equal to the number of minutes
  const totalSquares = timeDuration;
  
  // Calculate grid dimensions based on viewport aspect ratio
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [gridDimensions, setGridDimensions] = useState({ cols: 1, rows: 1 });
  
  // Speed multiplier for testing (higher = faster)
  const speedMultiplier = 5;
  
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
  
  // LFO wave generators - create smooth oscillating values
  const sineWave = (time: number, frequency: number, amplitude: number, offset: number = 0): number => {
    return offset + amplitude * Math.sin(time * frequency);
  };
  
  const triangleWave = (time: number, frequency: number, amplitude: number, offset: number = 0): number => {
    const period = 1 / frequency;
    const t = (time % period) / period;
    const value = t < 0.5 ? 2 * t : 2 * (1 - t);
    return offset + amplitude * value;
  };
  
  // Modulate visualization based on timer progress using LFO patterns
  useEffect(() => {
    if (!onVisualizationChange) return;
    
    // Calculate progress from 0 to 1
    const totalSeconds = timeDuration * 60;
    const progress = 1 - (timeRemaining / totalSeconds);
    
    // Current time in seconds (for LFO calculations)
    const currentTime = (totalSeconds - timeRemaining) / 10;
    
    // Use LFO waves with different frequencies to create evolving patterns
    // Each parameter has its own independent LFO
    const newConfig: Partial<VisualizationConfig> = {
      // Use the current visualization type selected by the user
      type: currentVisualization,
      
      // Rotation: slow sine wave + increase with progress
      rotation: sineWave(currentTime, 0.05, 0.5, 0.5 + progress * 0.7),
      
      // Perspective: medium triangle wave decreasing with progress
      perspective: triangleWave(currentTime, 0.03, 150, 800 - progress * 150),
      
      // Line count: slow triangle wave + slight increase with progress
      lineCount: Math.floor(triangleWave(currentTime, 0.02, 5, 15 + progress * 3)),
      
      // Always have pulse effect on
      pulseEffect: true,
      
      // Line opacity: very slow sine wave with slight increase over time
      lineOpacity: sineWave(currentTime, 0.01, 0.1, 0.8 + progress * 0.1),
    };
    
    onVisualizationChange(newConfig);
  }, [timeRemaining, timeDuration, onVisualizationChange, currentVisualization]);
  
  // Timer effect - now runs faster based on speedMultiplier
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000 / speedMultiplier); // Run faster by dividing the interval by speedMultiplier
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, speedMultiplier]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
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
        
        {/* Speed indicator */}
        <div className="text-xs text-white/70 backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
          Testing Mode: {speedMultiplier}x Speed
        </div>
      </div>
    </div>
  );
};

export default VisualTimeTimer;
