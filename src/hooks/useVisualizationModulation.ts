
import { useEffect } from 'react';
import { VisualizationConfig, VisualizationType } from '@/lib/types';
import { sineWave, triangleWave } from '@/lib/waveGenerators';

interface UseVisualizationModulationProps {
  timeDuration: number;
  timeRemaining: number;
  currentVisualization: VisualizationType;
  onVisualizationChange: (config: Partial<VisualizationConfig>) => void;
}

export const useVisualizationModulation = ({
  timeDuration,
  timeRemaining,
  currentVisualization,
  onVisualizationChange
}: UseVisualizationModulationProps) => {
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
};
