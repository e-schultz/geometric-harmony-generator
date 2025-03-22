
import React, { useState, useRef } from 'react';
import { ControlsProps } from '@/lib/types';
import { VISUALIZATION_TYPES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';
import ControlPanel from './controls/ControlPanel';
import SettingsPanel from './controls/SettingsPanel';

const Controls: React.FC<ControlsProps> = ({ config, onChange, onReset }) => {
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const originalSpeed = useRef(config.speed);
  
  const togglePause = () => {
    if (isPaused) {
      onChange({ speed: originalSpeed.current });
    } else {
      originalSpeed.current = config.speed;
      onChange({ speed: 0 });
    }
    setIsPaused(!isPaused);
  };
  
  const handleVisualizationChange = (type: string) => {
    onChange({ type: type as any });
  };
  
  return (
    <>
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 w-10 h-10 bg-black/30 backdrop-blur-md border border-white/10 shadow-md opacity-50 hover:opacity-100 transition-opacity duration-300 z-50"
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
        onReset={onReset}
        isActive={showControls}
      />
      
      {showControls && (
        <SettingsPanel config={config} onChange={onChange} />
      )}
    </>
  );
};

export default Controls;
