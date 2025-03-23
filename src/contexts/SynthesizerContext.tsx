
import React, { createContext, useContext, ReactNode } from 'react';
import { useSynthesizer } from '@/hooks/useSynthesizer';

// Create context with default undefined value
const SynthesizerContext = createContext<ReturnType<typeof useSynthesizer> | undefined>(undefined);

// Provider component that wraps the app
export const SynthesizerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use the hook to get all synthesizer functionality
  const synthesizer = useSynthesizer({
    frequency: 60,
    attack: 0.01,
    decay: 0.1,
    sustain: 0.3,
    release: 0.1,
    filterCutoff: 1000,
    filterResonance: 1,
  });

  return (
    <SynthesizerContext.Provider value={synthesizer}>
      {children}
    </SynthesizerContext.Provider>
  );
};

// Custom hook to use the synthesizer context
export const useSynthesizerContext = () => {
  const context = useContext(SynthesizerContext);
  if (context === undefined) {
    throw new Error('useSynthesizerContext must be used within a SynthesizerProvider');
  }
  return context;
};
