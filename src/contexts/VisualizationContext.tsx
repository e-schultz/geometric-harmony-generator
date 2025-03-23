
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VisualizationConfig, VisualizationType } from '@/lib/types';
import { DEFAULT_CONFIG } from '@/lib/constants';
import { toast } from 'sonner';

interface VisualizationContextType {
  config: VisualizationConfig;
  updateConfig: (newConfig: Partial<VisualizationConfig>) => void;
  resetConfig: () => void;
  showTimer: boolean;
  toggleTimer: () => void;
}

const VisualizationContext = createContext<VisualizationContextType | undefined>(undefined);

export const useVisualization = (): VisualizationContextType => {
  const context = useContext(VisualizationContext);
  if (!context) {
    throw new Error('useVisualization must be used within a VisualizationProvider');
  }
  return context;
};

interface VisualizationProviderProps {
  children: ReactNode;
}

export const VisualizationProvider: React.FC<VisualizationProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<VisualizationConfig>(DEFAULT_CONFIG);
  const [showTimer, setShowTimer] = useState(false);
  
  const updateConfig = (newConfig: Partial<VisualizationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    
    // Show toast when visualization type changes
    if (newConfig.type && newConfig.type !== config.type) {
      toast(`Switched to ${newConfig.type} visualization`, {
        position: 'top-center',
        duration: 2000,
        className: 'bg-black/70 backdrop-blur-md border border-white/10',
      });
    }
  };
  
  const resetConfig = () => {
    setConfig(DEFAULT_CONFIG);
    toast('Reset to default settings', {
      position: 'top-center',
      duration: 2000,
      className: 'bg-black/70 backdrop-blur-md border border-white/10',
    });
  };
  
  const toggleTimer = () => {
    setShowTimer(prev => !prev);
    toast(showTimer ? 'Timer hidden' : 'Timer displayed', {
      position: 'top-center',
      duration: 2000,
      className: 'bg-black/70 backdrop-blur-md border border-white/10',
    });
  };
  
  return (
    <VisualizationContext.Provider 
      value={{ 
        config, 
        updateConfig, 
        resetConfig, 
        showTimer,
        toggleTimer
      }}
    >
      {children}
    </VisualizationContext.Provider>
  );
};
