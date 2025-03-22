
import React from 'react';
import { VisualizationType } from '@/lib/types';
import VisualizationButtons from './VisualizationButtons';
import ControlButtons from './ControlButtons';

interface ControlPanelProps {
  visualizationTypes: VisualizationType[];
  currentType: VisualizationType;
  isPaused: boolean;
  onTypeChange: (type: VisualizationType) => void;
  onTogglePause: () => void;
  onReset: () => void;
  isActive: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  visualizationTypes,
  currentType,
  isPaused,
  onTypeChange,
  onTogglePause,
  onReset,
  isActive
}) => {
  return (
    <div className={`control-panel ${isActive ? 'active' : ''} z-40`}>
      <VisualizationButtons 
        types={visualizationTypes}
        currentType={currentType}
        onTypeChange={onTypeChange}
      />
      
      <ControlButtons
        isPaused={isPaused}
        onTogglePause={onTogglePause}
        onReset={onReset}
      />
    </div>
  );
};

export default ControlPanel;
