
import { AudioNodes } from './types';

// Initialize audio context and master gain node
export const createAudioContext = (): { 
  context: AudioContext; 
  masterGain: GainNode; 
} => {
  const context = new AudioContext();
  const masterGain = context.createGain();
  masterGain.gain.value = 0.5; // Set master volume to 50%
  masterGain.connect(context.destination);
  
  return { context, masterGain };
};

// Clean up audio nodes
export const cleanupAudioNodes = (
  activeOscillators: Map<number, AudioNodes>
): void => {
  activeOscillators.forEach((node) => {
    try {
      node.osc.stop();
      node.osc.disconnect();
      node.gain.disconnect();
      node.filter.disconnect();
    } catch (error) {
      console.error("Error cleaning up audio node:", error);
    }
  });
  activeOscillators.clear();
};

// Create a note with ADSR envelope and filter
export const createNote = (
  context: AudioContext,
  masterGain: GainNode,
  activeOscillators: Map<number, AudioNodes>,
  time: number,
  freq: number,
  attack: number,
  decay: number,
  sustain: number,
  release: number,
  filterCutoff: number,
  filterResonance: number
): void => {
  try {
    const osc = context.createOscillator();
    const noteGain = context.createGain();
    const filter = context.createBiquadFilter();
    const noteId = Date.now();

    // Set oscillator type and frequency
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    // Configure filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(filterCutoff, time);
    filter.Q.setValueAtTime(filterResonance, time);

    // Connect the signal path: oscillator -> filter -> note gain -> master gain
    osc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(masterGain);

    // Create ADSR envelope
    noteGain.gain.setValueAtTime(0, time);
    noteGain.gain.linearRampToValueAtTime(1, time + attack);
    noteGain.gain.linearRampToValueAtTime(sustain, time + attack + decay);
    noteGain.gain.setValueAtTime(sustain, time + attack + decay);
    noteGain.gain.linearRampToValueAtTime(0, time + attack + decay + release);

    // Store the oscillator and its gain node for cleanup
    activeOscillators.set(noteId, { osc, gain: noteGain, filter });

    // Start and stop the oscillator
    osc.start(time);
    osc.stop(time + attack + decay + release + 0.1);

    // Auto-remove from active oscillators map when done
    setTimeout(() => {
      activeOscillators.delete(noteId);
    }, (attack + decay + release + 0.2) * 1000);
  } catch (error) {
    console.error("Error creating note:", error);
  }
};

// Update filter parameters for active oscillators
export const updateFilterParams = (
  activeOscillators: Map<number, AudioNodes>,
  parameter: 'frequency' | 'Q',
  value: number,
  currentTime: number = 0
): void => {
  activeOscillators.forEach(node => {
    try {
      if (node.filter) {
        node.filter[parameter].setValueAtTime(value, currentTime);
      }
    } catch (error) {
      console.error(`Error updating filter ${parameter}:`, error);
    }
  });
};
