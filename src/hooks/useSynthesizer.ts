
import { useRef, useState, useEffect, useCallback } from 'react';
import { SynthesizerParams } from './synthesizer/types';
import { createAudioContext, cleanupAudioNodes } from './synthesizer/audioUtils';
import { startSequencer, stopSequencer } from './synthesizer/sequencer';
import { createThrottleUpdate } from './synthesizer/parameterUtils';
import { setupParameterState } from './synthesizer/stateManager';
import { updateFilterParams } from './synthesizer/filterUtils';

export type { SynthesizerParams };

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

  // Setup state and refs for all parameters
  const {
    // State values
    frequency, attack, decay, sustain, release, isPlaying, bpm, pattern, filterCutoff, filterResonance,
    // State setters
    setFrequencyState, setAttackState, setDecayState, setSustainState, setReleaseState, 
    setIsPlaying, setBpmState, setPattern, setFilterCutoffState, setFilterResonanceState,
    // Parameter refs
    frequencyRef, attackRef, decayRef, sustainRef, releaseRef, bpmRef, isPlayingRef,
    filterCutoffRef, filterResonanceRef,
    // Throttling refs
    lastUpdateTimeRef, throttleTimeRef
  } = setupParameterState(params);

  // Refs for Web Audio API
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeOscillators = useRef<Map<number, import('./synthesizer/types').AudioNodes>>(new Map());
  const intervalRef = useRef<number | null>(null);
  const stepRef = useRef<number>(0);
  
  // Create throttled update function
  const throttleUpdate = useCallback(
    createThrottleUpdate(lastUpdateTimeRef, throttleTimeRef), 
    []
  );
  
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
        handleStopSequencer();
        handleStartSequencer();
      }, 10);
    }
  }, [throttleUpdate]);

  // Filter parameter setters
  const setFilterCutoff = useCallback((value: number) => {
    throttleUpdate(value, filterCutoffRef, setFilterCutoffState);
    
    // Update cutoff frequency for all active oscillators in real-time
    updateFilterParams(
      activeOscillators.current, 
      'frequency', 
      value, 
      audioContextRef.current?.currentTime || 0
    );
  }, [throttleUpdate]);
  
  const setFilterResonance = useCallback((value: number) => {
    throttleUpdate(value, filterResonanceRef, setFilterResonanceState);
    
    // Update resonance for all active oscillators in real-time
    updateFilterParams(
      activeOscillators.current, 
      'Q', 
      value, 
      audioContextRef.current?.currentTime || 0
    );
  }, [throttleUpdate]);

  // Initialize audio context
  useEffect(() => {
    if (!audioContextRef.current) {
      try {
        const { context, masterGain } = createAudioContext();
        audioContextRef.current = context;
        gainNodeRef.current = masterGain;
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
    cleanupAudioNodes(activeOscillators.current);
  }, []);

  // Start the sequencer
  const handleStartSequencer = useCallback(() => {
    startSequencer(
      audioContextRef.current,
      gainNodeRef.current,
      activeOscillators,
      isPlayingRef,
      stepRef,
      pattern,
      bpmRef,
      frequencyRef,
      attackRef,
      decayRef,
      sustainRef,
      releaseRef,
      filterCutoffRef,
      filterResonanceRef,
      intervalRef
    );
    setIsPlaying(true);
  }, [pattern]);

  // Stop the sequencer
  const handleStopSequencer = useCallback(() => {
    stopSequencer(isPlayingRef, intervalRef, cleanupAudio);
    setIsPlaying(false);
  }, [cleanupAudio]);

  // Toggle sequencer
  const toggleSequencer = useCallback(() => {
    if (isPlayingRef.current) {
      handleStopSequencer();
    } else {
      handleStartSequencer();
    }
  }, [handleStartSequencer, handleStopSequencer]);

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
    startSequencer: handleStartSequencer,
    stopSequencer: handleStopSequencer,
    toggleSequencer,
    filterCutoff,
    setFilterCutoff,
    filterResonance,
    setFilterResonance,
  };
};
