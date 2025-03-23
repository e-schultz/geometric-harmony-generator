
import React from 'react';
import { cn } from '@/lib/utils';
import { VisualizationConfig, VisualizationType } from '@/lib/types';
import TimeGridVisualizer from './TimeGridVisualizer';
import TimerControls from './TimerControls';
import { useTimer } from '@/hooks/useTimer';
import { useVisualizationModulation } from '@/hooks/useVisualizationModulation';

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
  // Speed multiplier for testing (higher = faster)
  const speedMultiplier = 5;
  
  // Use our custom timer hook
  const { 
    timeRemaining, 
    formattedTime, 
    isRunning, 
    toggleTimer, 
    resetTimer 
  } = useTimer({ 
    duration: timeDuration, 
    speedMultiplier 
  });
  
  // Use our visualization modulation hook
  useVisualizationModulation({
    timeDuration,
    timeRemaining,
    currentVisualization,
    onVisualizationChange
  });
  
  return (
    <div className={cn("fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10", className)}>
      {/* Full viewport grid overlay */}
      <TimeGridVisualizer 
        totalSquares={timeDuration}
        timeRemaining={timeRemaining}
        timeDuration={timeDuration}
      />
      
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
