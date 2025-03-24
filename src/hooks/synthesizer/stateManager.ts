
import { useState, useRef, MutableRefObject } from 'react';
import { SynthesizerParams } from './types';

interface ParameterState {
  // State values
  frequency: number;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  isPlaying: boolean;
  bpm: number;
  pattern: number[];
  filterCutoff: number;
  filterResonance: number;
  
  // State setters
  setFrequencyState: React.Dispatch<React.SetStateAction<number>>;
  setAttackState: React.Dispatch<React.SetStateAction<number>>;
  setDecayState: React.Dispatch<React.SetStateAction<number>>;
  setSustainState: React.Dispatch<React.SetStateAction<number>>;
  setReleaseState: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setBpmState: React.Dispatch<React.SetStateAction<number>>;
  setPattern: React.Dispatch<React.SetStateAction<number[]>>;
  setFilterCutoffState: React.Dispatch<React.SetStateAction<number>>;
  setFilterResonanceState: React.Dispatch<React.SetStateAction<number>>;
  
  // Parameter refs
  frequencyRef: MutableRefObject<number>;
  attackRef: MutableRefObject<number>;
  decayRef: MutableRefObject<number>;
  sustainRef: MutableRefObject<number>;
  releaseRef: MutableRefObject<number>;
  bpmRef: MutableRefObject<number>;
  isPlayingRef: MutableRefObject<boolean>;
  filterCutoffRef: MutableRefObject<number>;
  filterResonanceRef: MutableRefObject<number>;
  
  // Throttling refs
  lastUpdateTimeRef: MutableRefObject<number>;
  throttleTimeRef: MutableRefObject<number>;
}

export const setupParameterState = (params: SynthesizerParams): ParameterState => {
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

  return {
    // State values
    frequency,
    attack,
    decay,
    sustain,
    release,
    isPlaying,
    bpm,
    pattern,
    filterCutoff,
    filterResonance,
    
    // State setters
    setFrequencyState,
    setAttackState,
    setDecayState,
    setSustainState,
    setReleaseState,
    setIsPlaying,
    setBpmState,
    setPattern,
    setFilterCutoffState,
    setFilterResonanceState,
    
    // Parameter refs
    frequencyRef,
    attackRef,
    decayRef,
    sustainRef,
    releaseRef,
    bpmRef,
    isPlayingRef,
    filterCutoffRef,
    filterResonanceRef,
    
    // Throttling refs
    lastUpdateTimeRef,
    throttleTimeRef
  };
};
