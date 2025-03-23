
// LFO wave generators - create smooth oscillating values for animations
export const sineWave = (time: number, frequency: number, amplitude: number, offset: number = 0): number => {
  return offset + amplitude * Math.sin(time * frequency);
};

export const triangleWave = (time: number, frequency: number, amplitude: number, offset: number = 0): number => {
  const period = 1 / frequency;
  const t = (time % period) / period;
  const value = t < 0.5 ? 2 * t : 2 * (1 - t);
  return offset + amplitude * value;
};
