
import React from 'react';
import { VisualizationConfig } from '@/lib/types';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { 
  MAX_LINE_COUNT, 
  MIN_LINE_COUNT, 
  MAX_SPEED, 
  MIN_SPEED, 
  MAX_ROTATION, 
  MIN_ROTATION, 
  MAX_PERSPECTIVE, 
  MIN_PERSPECTIVE, 
  MAX_LINE_OPACITY, 
  MIN_LINE_OPACITY 
} from '@/lib/constants';

interface SettingsPanelProps {
  config: VisualizationConfig;
  onChange: (config: Partial<VisualizationConfig>) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onChange }) => {
  return (
    <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-md rounded-lg p-4 flex flex-col gap-4 w-80 animate-fade-in border border-white/10 shadow-lg z-40">
      <p className="text-sm text-center font-medium flex items-center justify-center gap-2">
        <Eye className="w-4 h-4" /> Visualization Settings
      </p>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Speed</span>
            <span>{config.speed.toFixed(1)}</span>
          </div>
          <Slider
            value={[config.speed]}
            min={MIN_SPEED}
            max={MAX_SPEED}
            step={0.1}
            onValueChange={([value]) => onChange({ speed: value })}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Rotation</span>
            <span>{config.rotation.toFixed(1)}</span>
          </div>
          <Slider
            value={[config.rotation]}
            min={MIN_ROTATION}
            max={MAX_ROTATION}
            step={0.1}
            onValueChange={([value]) => onChange({ rotation: value })}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Perspective</span>
            <span>{config.perspective}</span>
          </div>
          <Slider
            value={[config.perspective]}
            min={MIN_PERSPECTIVE}
            max={MAX_PERSPECTIVE}
            step={10}
            onValueChange={([value]) => onChange({ perspective: value })}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Line Count</span>
            <span>{config.lineCount}</span>
          </div>
          <Slider
            value={[config.lineCount]}
            min={MIN_LINE_COUNT}
            max={MAX_LINE_COUNT}
            step={1}
            onValueChange={([value]) => onChange({ lineCount: value })}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Line Opacity</span>
            <span>{config.lineOpacity.toFixed(1)}</span>
          </div>
          <Slider
            value={[config.lineOpacity]}
            min={MIN_LINE_OPACITY}
            max={MAX_LINE_OPACITY}
            step={0.1}
            onValueChange={([value]) => onChange({ lineOpacity: value })}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs">Pulse Effect</span>
          <Button
            variant={config.pulseEffect ? "default" : "secondary"}
            size="sm"
            onClick={() => onChange({ pulseEffect: !config.pulseEffect })}
            className="text-xs h-7"
          >
            {config.pulseEffect ? "On" : "Off"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
