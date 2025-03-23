
import { useRef, useState, useEffect } from 'react';

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
  const [frequency, setFrequency] = useState(params.frequency);
  const [attack, setAttack] = useState(params.attack);
  const [decay, setDecay] = useState(params.decay);
  const [sustain, setSustain] = useState(params.sustain);
  const [release, setRelease] = useState(params.release);
  const [isPlaying, setIsPlaying] = useState(params.isPlaying);
  const [bpm, setBpm] = useState(params.bpm);
  const [pattern, setPattern] = useState(params.pattern);

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);

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

    // Create ADSR envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(1, time + attack);
    gain.gain.linearRampToValueAtTime(sustain, time + attack + decay);
    gain.gain.setValueAtTime(sustain, time + attack + decay);
    gain.gain.linearRampToValueAtTime(0, time + attack + decay + release);

    // Start and stop the oscillator
    osc.start(time);
    osc.stop(time + attack + decay + release + 0.1);

    // Store refs for cleanup
    oscRef.current = osc;
    gainRef.current = gain;
  };

  // Start the sequencer
  const startSequencer = () => {
    if (!audioContextRef.current || isPlaying) return;

    setIsPlaying(true);
    const ctx = audioContextRef.current;
    const stepTime = 60 / bpm / 2; // 16th notes (4 steps per beat)
    
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
        createNote(currentTime, frequency);
      }
      
      // Advance to next step
      stepRef.current++;
      
      // Schedule next loop
      intervalRef.current = window.setTimeout(loop, stepTime * 1000);
    };
    
    // Start the loop
    loop();
  };

  // Stop the sequencer
  const stopSequencer = () => {
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
  };

  // Toggle sequencer
  const toggleSequencer = () => {
    if (isPlaying) {
      stopSequencer();
    } else {
      startSequencer();
    }
  };

  // Update pattern
  const togglePatternStep = (index: number) => {
    const newPattern = [...pattern];
    newPattern[index] = newPattern[index] === 1 ? 0 : 1;
    setPattern(newPattern);
  };

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
