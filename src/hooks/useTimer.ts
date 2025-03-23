
import { useState, useEffect } from 'react';

interface UseTimerProps {
  duration: number; // Duration in minutes
  speedMultiplier?: number; // Speed multiplier for testing (higher = faster)
}

export const useTimer = ({ duration, speedMultiplier = 1 }: UseTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  
  // Start/pause the timer
  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };
  
  // Reset the timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(duration * 60);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isRunning && timeRemaining > 0) {
      timerId = window.setInterval(() => {
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000 / speedMultiplier);
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, timeRemaining, speedMultiplier]);
  
  // Calculate progress from 0 to 1
  const progress = 1 - (timeRemaining / (duration * 60));
  
  return {
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isRunning,
    progress,
    toggleTimer,
    resetTimer
  };
};
