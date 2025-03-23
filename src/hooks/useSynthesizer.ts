
import { useRef, useState, useEffect, useCallback } from 'react';

export interface SynthesizerParams {
  frequency: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  isPlaying: boolean;
  bpm: number;
  pattern: number[];
  filterCutoff: number; // Added filter cutoff parameter
  filterResonance: number; // Added filter resonance parameter
}

export const useSynthesizer = (initialParams: Partial<SynthesizerParams> = {}) => {
  // Default parameters
  const defaultParams: SynthesizerParams = {
    frequency: 60, // Bass frequency in Hz
    attack: 0.01,  // Attack time in seconds
    decay: 0.1,    // Decay time in seconds
    sustain: 0.3,  // Sustain level (0-1)
    release: 0.1,  // Release time in seconds
    isPlaying: false,
    bpm: 120,      // Beats per minute
    pattern: [1, 0, 0, 1, 0, 1, 0, 0], // Default pattern (1 = note, 0 = rest)
    filterCutoff: 1000, // Default cutoff frequency in Hz
    filterResonance: 1, // Default resonance (Q) value
  };

  // Merge defaults with provided params
  const params = { ...defaultParams, ...initialParams };

  // State for parameters
  const [frequency, setFrequencyState] = useState(params.frequency);
  const [attack, setAttackState] = useState(params.attack);
  const [decay, setDecayState] = useState(params.decay);
  const [sustain, setSustainState] = useState(params.sustain);
  const [release, setReleaseState] = useState(params.release);
  const [isPlaying, setIsPlaying] = useState(params.isPlaying);
  const [bpm, setBpmState] = useState(params.bpm);
  const [pattern, setPattern] = useState(params.pattern);
  const [filterCutoff, setFilterCutoffState] = useState(params.filterCutoff);
  const [filterResonance, setFilterResonanceState] = useState(params.filterResonance);

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeOscillators = useRef<Map<number, { osc: OscillatorNode, gain: GainNode, filter: BiquadFilterNode }>>(new Map());
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);
  
  // Refs to hold current parameter values to avoid state updates during playback
  const frequencyRef = useRef(frequency);
  const attackRef = useRef(attack);
  const decayRef = useRef(decay);
  const sustainRef = useRef(sustain);
  const releaseRef = useRef(release);
  const bpmRef = useRef(bpm);
  const isPlayingRef = useRef(isPlaying);
  const filterCutoffRef = useRef(filterCutoff);
  const filterResonanceRef = useRef(filterResonance);
  
  // Throttling mechanism
  const lastUpdateTimeRef = useRef(Date.now());
  const throttleTimeRef = useRef(50); // 50ms throttle for better responsiveness
  
  // Helper function for throttled parameter updates
  const throttleUpdate = useCallback((
    value: number, 
    ref: React.MutableRefObject<number>, 
    setState: React.Dispatch<React.SetStateAction<number>>
  ) => {
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
  }, []);
  
  // Throttled parameter setters
  const setFrequency = useCallback((value: number) => {
    throttleUpdate(value, frequencyRef, setFrequencyState);
  }, [throttleUpdate]);
  
  const setAttack = useCallback((value: number) => {
    throttleUpdate(value, attackRef, setAttackState);
  }, [throttleUpdate]);
  
  const setDecay = useCallback((value: number) => {
    throttleUpdate(value, decayRef, setDecayState);
  }, [throttleUpdate]);
  
  const setSustain = useCallback((value: number) => {
    throttleUpdate(value, sustainRef, setSustainState);
  }, [throttleUpdate]);
  
  const setRelease = useCallback((value: number) => {
    throttleUpdate(value, releaseRef, setReleaseState);
  }, [throttleUpdate]);
  
  const setBpm = useCallback((value: number) => {
    throttleUpdate(value, bpmRef, setBpmState);
    
    // If playing, restart the sequencer to apply new BPM
    if (isPlayingRef.current && intervalRef.current) {
      // Use a minor delay to avoid race conditions
      setTimeout(() => {
        stopSequencer();
        startSequencer();
      }, 10);
    }
  }, [throttleUpdate]);

  // Filter parameter setters
  const setFilterCutoff = useCallback((value: number) => {
    throttleUpdate(value, filterCutoffRef, setFilterCutoffState);
    
    // Update cutoff frequency for all active oscillators in real-time
    activeOscillators.current.forEach(node => {
      try {
        if (node.filter) {
          node.filter.frequency.setValueAtTime(value, audioContextRef.current?.currentTime || 0);
        }
      } catch (error) {
        console.error("Error updating filter cutoff:", error);
      }
    });
  }, [throttleUpdate]);
  
  const setFilterResonance = useCallback((value: number) => {
    throttleUpdate(value, filterResonanceRef, setFilterResonanceState);
    
    // Update resonance for all active oscillators in real-time
    activeOscillators.current.forEach(node => {
      try {
        if (node.filter) {
          node.filter.Q.setValueAtTime(value, audioContextRef.current?.currentTime || 0);
        }
      } catch (error) {
        console.error("Error updating filter resonance:", error);
      }
    });
  }, [throttleUpdate]);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new AudioContext();
        // Create main gain node for master volume
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.value = 0.5; // Set master volume to 50%
        gainNodeRef.current.connect(audioContextRef.current.destination);
      } catch (error) {
        console.error("Failed to initialize audio context:", error);
      }
    }

    return () => {
      cleanupAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
        audioContextRef.current = null;
      }
    };
  }, []);

  // Thorough audio cleanup function
  const cleanupAudio = useCallback(() => {
    // Stop all active oscillators
    activeOscillators.current.forEach((node, id) => {
      try {
        node.osc.stop();
        node.osc.disconnect();
        node.gain.disconnect();
        node.filter.disconnect();
      } catch (error) {
        console.error("Error cleaning up audio node:", error);
      }
    });
    activeOscillators.current.clear();
  }, []);

  // Create a note with ADSR envelope and filter
  const createNote = useCallback((time: number, freq: number) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    try {
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      const noteId = Date.now();

      // Set oscillator type and frequency
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, time);

      // Configure filter
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterCutoffRef.current, time);
      filter.Q.setValueAtTime(filterResonanceRef.current, time);

      // Connect the signal path: oscillator -> filter -> note gain -> master gain
      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNodeRef.current);

      // Create ADSR envelope - use ref values for most up-to-date parameters
      const a = attackRef.current;
      const d = decayRef.current;
      const s = sustainRef.current;
      const r = releaseRef.current;

      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(1, time + a);
      noteGain.gain.linearRampToValueAtTime(s, time + a + d);
      noteGain.gain.setValueAtTime(s, time + a + d);
      noteGain.gain.linearRampToValueAtTime(0, time + a + d + r);

      // Store the oscillator and its gain node for cleanup
      activeOscillators.current.set(noteId, { osc, gain: noteGain, filter });

      // Start and stop the oscillator
      osc.start(time);
      osc.stop(time + a + d + r + 0.1);

      // Auto-remove from active oscillators map when done
      setTimeout(() => {
        activeOscillators.current.delete(noteId);
      }, (a + d + r + 0.2) * 1000);
    } catch (error) {
      console.error("Error creating note:", error);
    }
  }, []);

  // Start the sequencer
  const startSequencer = useCallback(() => {
    if (!audioContextRef.current || isPlayingRef.current) return;

    setIsPlaying(true);
    isPlayingRef.current = true;
    
    const ctx = audioContextRef.current;
    
    // Resume audio context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume().catch(console.error);
    }

    // Reset step index
    stepRef.current = 0;
    
    // Use a more accurate timing mechanism
    const scheduleAheadTime = 0.1; // Schedule 100ms ahead
    let lastScheduleTime = ctx.currentTime;
    
    // Start sequencer loop using accurate timing
    const loop = () => {
      if (!isPlayingRef.current || !audioContextRef.current) return;
      
      const currentStepTime = 60 / bpmRef.current / 2; // 16th notes
      const currentTime = audioContextRef.current.currentTime;
      
      // Schedule notes ahead of time for more accurate timing
      while (lastScheduleTime < currentTime + scheduleAheadTime) {
        const step = stepRef.current % pattern.length;
        
        // Play note if pattern has a 1 at current step
        if (pattern[step] === 1) {
          createNote(lastScheduleTime, frequencyRef.current);
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
  }, [createNote, pattern]);

  // Stop the sequencer
  const stopSequencer = useCallback(() => {
    if (!isPlayingRef.current) return;
    
    setIsPlaying(false);
    isPlayingRef.current = false;
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    
    cleanupAudio();
  }, [cleanupAudio]);

  // Toggle sequencer
  const toggleSequencer = useCallback(() => {
    if (isPlayingRef.current) {
      stopSequencer();
    } else {
      startSequencer();
    }
  }, [startSequencer, stopSequencer]);

  // Update pattern
  const togglePatternStep = useCallback((index: number) => {
    const newPattern = [...pattern];
    newPattern[index] = newPattern[index] === 1 ? 0 : 1;
    setPattern(newPattern);
  }, [pattern]);

  // Effect to cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Update refs when state changes
  useEffect(() => { frequencyRef.current = frequency; }, [frequency]);
  useEffect(() => { attackRef.current = attack; }, [attack]);
  useEffect(() => { decayRef.current = decay; }, [decay]);
  useEffect(() => { sustainRef.current = sustain; }, [sustain]);
  useEffect(() => { releaseRef.current = release; }, [release]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
  useEffect(() => { filterCutoffRef.current = filterCutoff; }, [filterCutoff]);
  useEffect(() => { filterResonanceRef.current = filterResonance; }, [filterResonance]);

  return {
    frequency,
    setFrequency,
    attack,
    setAttack,
    decay,
    setDecay,
    sustain,
    setSustain,
    release,
    setRelease,
    bpm,
    setBpm,
    pattern,
    setPattern,
    togglePatternStep,
    isPlaying,
    startSequencer,
    stopSequencer,
    toggleSequencer,
    filterCutoff,
    setFilterCutoff,
    filterResonance,
    setFilterResonance,
  };
};
