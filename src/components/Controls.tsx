
import React, { useState } from 'react';
import { ControlsProps } from '@/lib/types';
import { VISUALIZATION_TYPES, MAX_LINE_COUNT, MIN_LINE_COUNT, MAX_SPEED, MIN_SPEED, MAX_ROTATION, MIN_ROTATION, MAX_PERSPECTIVE, MIN_PERSPECTIVE, MAX_LINE_OPACITY, MIN_LINE_OPACITY } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Pause, 
  Play, 
  RefreshCw, 
  Grid, 
  Cube, 
  LayoutDashboard,
  SlidersHorizontal,
  Eye,
  X
} from 'lucide-react';

const Controls: React.FC<ControlsProps> = ({ config, onChange, onReset }) => {
  const [showControls, setShowControls] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  const originalSpeed = React.useRef(config.speed);
  
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
  
  const renderVisualizationButton = (type: string) => {
    let icon;
    switch (type) {
      case 'tunnel':
        icon = <LayoutDashboard className="w-4 h-4" />;
        break;
      case 'grid':
        icon = <Grid className="w-4 h-4" />;
        break;
      case 'polyhedron':
        icon = <Cube className="w-4 h-4" />;
        break;
      default:
        icon = <LayoutDashboard className="w-4 h-4" />;
    }
    
    return (
      <Button
        variant={config.type === type ? "default" : "secondary"}
        size="icon"
        className="w-8 h-8"
        onClick={() => handleVisualizationChange(type)}
        title={`Switch to ${type} visualization`}
      >
        {icon}
      </Button>
    );
  };
  
  return (
    <>
      {/* Floating button to toggle controls */}
      <Button
        variant="secondary"
        size="icon"
        className="fixed bottom-8 right-8 w-10 h-10 bg-black/30 backdrop-blur-md border border-white/10 shadow-md opacity-50 hover:opacity-100 transition-opacity duration-300 z-50"
        onClick={() => setShowControls(!showControls)}
      >
        {showControls ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
      </Button>
      
      {/* Main control panel */}
      <div className={`control-panel ${showControls ? 'active' : ''} z-40`}>
        <div className="flex gap-2">
          {VISUALIZATION_TYPES.map(type => renderVisualizationButton(type))}
        </div>
        
        <div className="h-6 w-px bg-white/20" />
        
        <Button
          variant="secondary"
          size="icon"
          className="w-8 h-8"
          onClick={togglePause}
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
      </div>
      
      {/* Expanded controls panel */}
      {showControls && (
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
      )}
    </>
  );
};

export default Controls;
