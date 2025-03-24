
import { MutableRefObject } from 'react';
import { createNote } from './audioUtils';
import { AudioNodes } from './types';

export const startSequencer = (
  audioContext: AudioContext | null,
  masterGain: GainNode | null,
  activeOscillators: MutableRefObject<Map<number, AudioNodes>>,
  isPlaying: MutableRefObject<boolean>,
  stepRef: MutableRefObject<number>,
  pattern: number[],
  bpmRef: MutableRefObject<number>,
  frequencyRef: MutableRefObject<number>,
  attackRef: MutableRefObject<number>,
  decayRef: MutableRefObject<number>,
  sustainRef: MutableRefObject<number>,
  releaseRef: MutableRefObject<number>,
  filterCutoffRef: MutableRefObject<number>,
  filterResonanceRef: MutableRefObject<number>,
  intervalRef: MutableRefObject<number | null>
): void => {
  if (!audioContext || !masterGain || isPlaying.current) return;

  isPlaying.current = true;
  
  // Resume audio context if suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(console.error);
  }

  // Reset step index
  stepRef.current = 0;
  
  // Use a more accurate timing mechanism
  const scheduleAheadTime = 0.1; // Schedule 100ms ahead
  let lastScheduleTime = audioContext.currentTime;
  
  // Start sequencer loop using accurate timing
  const loop = () => {
    if (!isPlaying.current || !audioContext) return;
    
    const currentStepTime = 60 / bpmRef.current / 2; // 16th notes
    const currentTime = audioContext.currentTime;
    
    // Schedule notes ahead of time for more accurate timing
    while (lastScheduleTime < currentTime + scheduleAheadTime) {
      const step = stepRef.current % pattern.length;
      
      // Play note if pattern has a 1 at current step
      if (pattern[step] === 1) {
        createNote(
          audioContext,
          masterGain,
          activeOscillators.current,
          lastScheduleTime,
          frequencyRef.current,
          attackRef.current,
          decayRef.current,
          sustainRef.current,
          releaseRef.current,
          filterCutoffRef.current,
          filterResonanceRef.current
        );
      }
      
      // Advance to next step and update schedule time
      stepRef.current++;
      lastScheduleTime += currentStepTime;
    }
    
    // Schedule next loop call
    intervalRef.current = window.setTimeout(loop, 25); // Check every 25ms
  };
  
  // Start the loop
  loop();
};

export const stopSequencer = (
  isPlaying: MutableRefObject<boolean>,
  intervalRef: MutableRefObject<number | null>,
  cleanupAudio: () => void
): void => {
  if (!isPlaying.current) return;
  
  isPlaying.current = false;
  
  if (intervalRef.current) {
    clearTimeout(intervalRef.current);
    intervalRef.current = null;
  }
  
  cleanupAudio();
};
