
export interface SynthesizerParams {
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
}

export interface AudioNodes {
  osc: OscillatorNode;
  gain: GainNode;
  filter: BiquadFilterNode;
}
