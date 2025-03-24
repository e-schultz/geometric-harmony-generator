
import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
  duration: number; // Duration in minutes
  speedMultiplier?: number; // Speed multiplier for testing (higher = faster)
  onComplete?: () => void; // Optional callback when timer completes
}

/**
 * Custom hook for timer functionality
 * Provides time tracking, formatting, and control functions
 */
export const useTimer = ({ 
  duration, 
  speedMultiplier = 1,
  onComplete 
}: UseTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Start/pause the timer
  const toggleTimer = useCallback(() => {
    try {
      setIsRunning(prev => !prev);
      setError(null); // Clear any previous errors when user interacts
    } catch (err) {
      setError('Failed to toggle timer');
      console.error('Toggle timer error:', err);
    }
  }, []);
  
  // Reset the timer
  const resetTimer = useCallback(() => {
    try {
      setIsRunning(false);
      setTimeRemaining(duration * 60);
      setError(null); // Clear any previous errors when user interacts
    } catch (err) {
      setError('Failed to reset timer');
      console.error('Reset timer error:', err);
    }
  }, [duration]);
  
  // Update time when duration changes
  useEffect(() => {
    try {
      setTimeRemaining(duration * 60);
    } catch (err) {
      setError('Failed to update timer duration');
      console.error('Update duration error:', err);
    }
  }, [duration]);
  
  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    try {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } catch (err) {
      console.error('Format time error:', err);
      return '--:--'; // Fallback display if formatting fails
    }
  }, []);
  
  // Timer effect with performance optimization
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isRunning && timeRemaining > 0) {
      // Use requestAnimationFrame for smoother updates and better battery performance
      let lastUpdateTime = performance.now();
      const updateInterval = 1000 / speedMultiplier; // ms between updates
      
      const updateTimer = (currentTime: number) => {
        if (!isRunning) return;
        
        const elapsed = currentTime - lastUpdateTime;
        
        if (elapsed >= updateInterval) {
          lastUpdateTime = currentTime;
          setTimeRemaining(prev => {
            const newTime = Math.max(0, prev - 1);
            
            // Call onComplete callback when timer reaches zero
            if (newTime === 0 && onComplete) {
              onComplete();
            }
            
            return newTime;
          });
        }
        
        if (timeRemaining > 0) {
          timerId = requestAnimationFrame(updateTimer);
        }
      };
      
      timerId = requestAnimationFrame(updateTimer);
    }
    
    return () => {
      if (timerId) cancelAnimationFrame(timerId);
    };
  }, [isRunning, timeRemaining, speedMultiplier, onComplete]);
  
  // Calculate progress from 0 to 1
  const progress = 1 - (timeRemaining / (duration * 60));
  
  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    progress,
    toggleTimer,
    resetTimer,
    error
  };
};
