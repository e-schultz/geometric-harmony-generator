
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

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);
  
  // Refs to hold current parameter values to avoid state updates during playback
  const frequencyRef = useRef(frequency);
  const attackRef = useRef(attack);
  const decayRef = useRef(decay);
  const sustainRef = useRef(sustain);
  const releaseRef = useRef(release);
  const bpmRef = useRef(bpm);
  
  // Throttling mechanism
  const lastUpdateTimeRef = useRef(Date.now());
  const throttleTimeRef = useRef(100); // 100ms throttle
  
  // Throttled parameter setters
  const setFrequency = useCallback((value: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      frequencyRef.current = value;
      setFrequencyState(value);
    } else {
      // Just update the ref if we're throttling
      frequencyRef.current = value;
      // Schedule a delayed state update
      setTimeout(() => {
        setFrequencyState(frequencyRef.current);
      }, throttleTimeRef.current);
    }
  }, []);
  
  const setAttack = useCallback((value: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      attackRef.current = value;
      setAttackState(value);
    } else {
      attackRef.current = value;
      setTimeout(() => {
        setAttackState(attackRef.current);
      }, throttleTimeRef.current);
    }
  }, []);
  
  const setDecay = useCallback((value: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      decayRef.current = value;
      setDecayState(value);
    } else {
      decayRef.current = value;
      setTimeout(() => {
        setDecayState(decayRef.current);
      }, throttleTimeRef.current);
    }
  }, []);
  
  const setSustain = useCallback((value: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      sustainRef.current = value;
      setSustainState(value);
    } else {
      sustainRef.current = value;
      setTimeout(() => {
        setSustainState(sustainRef.current);
      }, throttleTimeRef.current);
    }
  }, []);
  
  const setRelease = useCallback((value: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      releaseRef.current = value;
      setReleaseState(value);
    } else {
      releaseRef.current = value;
      setTimeout(() => {
        setReleaseState(releaseRef.current);
      }, throttleTimeRef.current);
    }
  }, []);
  
  const setBpm = useCallback((value: number) => {
    const now = Date.now();
    if (now - lastUpdateTimeRef.current > throttleTimeRef.current) {
      lastUpdateTimeRef.current = now;
      bpmRef.current = value;
      setBpmState(value);
    } else {
      bpmRef.current = value;
      setTimeout(() => {
        setBpmState(bpmRef.current);
      }, throttleTimeRef.current);
    }
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  // Create a note with ADSR envelope
  const createNote = (time: number, freq: number) => {
    if (!audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Set oscillator type and frequency
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    // Connect oscillator to gain node
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Create ADSR envelope - use ref values for most up-to-date parameters
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + attackRef.current);
    gain.gain.linearRampToValueAtTime(sustainRef.current, time + attackRef.current + decayRef.current);
    gain.gain.setValueAtTime(sustainRef.current, time + attackRef.current + decayRef.current);
    gain.gain.linearRampToValueAtTime(0, time + attackRef.current + decayRef.current + releaseRef.current);

    // Start and stop the oscillator
    osc.start(time);
    osc.stop(time + attackRef.current + decayRef.current + releaseRef.current + 0.1);

    // Store refs for cleanup
    oscRef.current = osc;
    gainRef.current = gain;
  };

  // Start the sequencer
  const startSequencer = useCallback(() => {
    if (!audioContextRef.current || isPlaying) return;

    setIsPlaying(true);
    const ctx = audioContextRef.current;
    const stepTime = 60 / bpmRef.current / 2; // 16th notes (4 steps per beat)
    
    // Resume audio context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Reset step index
    stepRef.current = 0;
    
    // Start sequencer loop
    const loop = () => {
      const currentTime = ctx.currentTime;
      const step = stepRef.current % pattern.length;
      
      // Play note if pattern has a 1 at current step
      if (pattern[step] === 1) {
        // Use the most up-to-date frequency from ref
        createNote(currentTime, frequencyRef.current);
      }
      
      // Advance to next step
      stepRef.current++;
      
      // Calculate new step time based on current BPM
      const currentStepTime = 60 / bpmRef.current / 2;
      
      // Schedule next loop
      intervalRef.current = window.setTimeout(loop, currentStepTime * 1000);
    };
    
    // Start the loop
    loop();
  }, [isPlaying, pattern]);

  // Stop the sequencer
  const stopSequencer = useCallback(() => {
    if (!isPlaying) return;
    
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (oscRef.current) {
      oscRef.current.stop();
      oscRef.current = null;
    }
  }, [isPlaying]);

  // Toggle sequencer
  const toggleSequencer = useCallback(() => {
    if (isPlaying) {
      stopSequencer();
    } else {
      startSequencer();
    }
  }, [isPlaying, startSequencer, stopSequencer]);

  // Update pattern
  const togglePatternStep = useCallback((index: number) => {
    const newPattern = [...pattern];
    newPattern[index] = newPattern[index] === 1 ? 0 : 1;
    setPattern(newPattern);
  }, [pattern]);

  // Effect to update BPM in real-time, now using refs
  useEffect(() => {
    if (isPlaying && intervalRef.current) {
      // Reset the sequencer to apply the new BPM
      stopSequencer();
      startSequencer();
    }
  }, [bpm, isPlaying, startSequencer, stopSequencer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (oscRef.current) {
        oscRef.current.stop();
      }
    };
  }, []);

  // Update refs when state changes
  useEffect(() => {
    frequencyRef.current = frequency;
  }, [frequency]);
  
  useEffect(() => {
    attackRef.current = attack;
  }, [attack]);
  
  useEffect(() => {
    decayRef.current = decay;
  }, [decay]);
  
  useEffect(() => {
    sustainRef.current = sustain;
  }, [sustain]);
  
  useEffect(() => {
    releaseRef.current = release;
  }, [release]);
  
  useEffect(() => {
    bpmRef.current = bpm;
  }, [bpm]);

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
  };
};
