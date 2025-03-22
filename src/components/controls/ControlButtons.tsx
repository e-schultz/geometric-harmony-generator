
import React from 'react';
import { Button } from '@/components/ui/button';
import { Pause, Play, RefreshCw } from 'lucide-react';

interface ControlButtonsProps {
  isPaused: boolean;
  onTogglePause: () => void;
  onReset: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ 
  isPaused, 
  onTogglePause, 
  onReset 
}) => {
  return (
    <>
      <div className="h-6 w-px bg-white/20" />
      
      <Button
        variant="secondary"
        size="icon"
        className="w-8 h-8"
        onClick={onTogglePause}
        title={isPaused ? "Resume" : "Pause"}
      >
        {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
      </Button>
      
      <Button
        variant="secondary"
        size="icon"
        className="w-8 h-8"
        onClick={onReset}
        title="Reset settings"
      >
        <RefreshCw className="w-4 h-4" />
      </Button>
    </>
  );
};

export default ControlButtons;
