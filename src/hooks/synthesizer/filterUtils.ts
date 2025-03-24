
import { AudioNodes } from './types';

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
