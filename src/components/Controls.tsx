
import React, { useState, useRef } from 'react';
import { VISUALIZATION_TYPES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import ControlPanel from './controls/ControlPanel';
import SettingsPanel from './controls/SettingsPanel';
import { useVisualization } from '@/contexts/VisualizationContext';

const Controls: React.FC = () => {
  const { config, updateConfig, resetConfig } = useVisualization();
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const originalSpeed = useRef(config.speed);
  
  const togglePause = () => {
    if (isPaused) {
      updateConfig({ speed: originalSpeed.current });
    } else {
      originalSpeed.current = config.speed;
      updateConfig({ speed: 0 });
    }
    setIsPaused(!isPaused);
  };
  
  const handleVisualizationChange = (type: string) => {
    updateConfig({ type: type as any });
  };
  
  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 left-8 w-10 h-10 bg-black/30 backdrop-blur-md border border-white/10 shadow-md opacity-50 hover:opacity-100 transition-opacity duration-300 z-50"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
      </Button>
      
      <ControlPanel
        visualizationTypes={VISUALIZATION_TYPES}
        currentType={config.type}
        isPaused={isPaused}
        onTypeChange={handleVisualizationChange}
        onTogglePause={togglePause}
        onReset={resetConfig}
        isActive={showControls}
      />
      
      {showControls && (
        <SettingsPanel />
      )}
    </>
  );
};

export default Controls;
