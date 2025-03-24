
import { MutableRefObject } from 'react';

export const createThrottleUpdate = (
  lastUpdateTimeRef: MutableRefObject<number>,
  throttleTimeRef: MutableRefObject<number>
) => {
  return (
    value: number, 
    ref: MutableRefObject<number>, 
    setState: React.Dispatch<React.SetStateAction<number>>
  ): void => {
    const now = Date.now();
    ref.current = value; // Always update ref immediately
    
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      setState(value);
    } else {
      // Schedule a delayed state update
      setTimeout(() => {
        setState(ref.current);
      }, throttleTimeRef.current);
    }
  };
};
