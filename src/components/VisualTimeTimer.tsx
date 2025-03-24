
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import TimeGridVisualizer from './TimeGridVisualizer';
import TimerControls from './TimerControls';
import TimerSettings from './TimerSettings';
import { useTimer } from '@/hooks/useTimer';
import { useVisualizationModulation } from '@/hooks/useVisualizationModulation';
import { useVisualization } from '@/contexts/VisualizationContext';
import { toast } from 'sonner';

interface VisualTimeTimerProps {
  initialDuration?: number; // Default duration in minutes
  interval: number; // Interval in seconds
  className?: string;
}

const VisualTimeTimer: React.FC<VisualTimeTimerProps> = ({
  initialDuration = 25, // Default to 25 minutes if not specified
  interval,
  className,
}) => {
  const [timerDuration, setTimerDuration] = useState(initialDuration);
  const { config, updateConfig } = useVisualization();
  
  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    toast('Timer complete!', {
      position: 'top-center',
      className: 'bg-black/70 backdrop-blur-md border border-white/10'
    });
  }, []);
  
  // Speed multiplier for testing (higher = faster)
  const speedMultiplier = 5;
  
  // Use our custom timer hook with error handling
  const { 
    timeRemaining, 
    formattedTime, 
    isRunning, 
    toggleTimer, 
    resetTimer,
    error
  } = useTimer({ 
    duration: timerDuration, 
    speedMultiplier,
    onComplete: handleTimerComplete
  });
  
  // Show error message if timer has an error
  React.useEffect(() => {
    if (error) {
      toast.error(`Timer error: ${error}`, {
        position: 'top-center',
        className: 'bg-black/70 backdrop-blur-md border-red-500/20'
      });
    }
  }, [error]);
  
  // Use our visualization modulation hook
  useVisualizationModulation({
    timeDuration: timerDuration,
    timeRemaining,
    currentVisualization: config.type,
    onVisualizationChange: updateConfig
  });
  
  const handleDurationChange = useCallback((minutes: number) => {
    setTimerDuration(minutes);
    // Reset the timer when the duration changes
    resetTimer();
    toast(`Timer set to ${minutes} minutes`, {
      position: 'top-center',
      className: 'bg-black/70 backdrop-blur-md border border-white/10'
    });
  }, [resetTimer]);
  
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10", className)}>
      {/* Full viewport grid overlay */}
      <TimeGridVisualizer 
        totalSquares={timerDuration}
        timeRemaining={timeRemaining}
        timeDuration={timerDuration}
      />
      
      {/* Timer Settings */}
      <div className="pointer-events-auto">
        <TimerSettings 
          currentDuration={timerDuration}
          onDurationChange={handleDurationChange}
        />
      </div>
      
      {/* Overlay UI with timer controls */}
      <TimerControls
        isRunning={isRunning}
        formattedTime={formattedTime}
        onToggle={toggleTimer}
        onReset={resetTimer}
        speedMultiplier={speedMultiplier}
      />
    </div>
  );
};

export default VisualTimeTimer;
