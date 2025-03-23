
import React from 'react';

interface TimerControlsProps {
  isRunning: boolean;
  formattedTime: string;
  onToggle: () => void;
  onReset: () => void;
  speedMultiplier: number;
}

const TimerControls: React.FC<TimerControlsProps> = ({
  isRunning,
  formattedTime,
  onToggle,
  onReset,
  speedMultiplier
}) => {
  return (
    <div className="fixed bottom-8 flex flex-col items-center gap-6 pointer-events-auto">
      {/* Timer Display */}
      <div className="text-5xl font-mono text-white/90 tracking-wider backdrop-blur-sm bg-black/10 px-6 py-3 rounded-full border border-white/10 shadow-xl">
        {formattedTime}
      </div>
      
      {/* Controls */}
      <div className="flex space-x-4">
        <button
          onClick={onToggle}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 transition-colors border border-white/10 backdrop-blur-sm text-sm shadow-md"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white/90 transition-colors border border-white/10 backdrop-blur-sm text-sm shadow-md"
        >
          Reset
        </button>
      </div>
      
      {/* Speed indicator */}
      <div className="text-xs text-white/70 backdrop-blur-sm bg-black/10 px-3 py-1 rounded-full">
        Testing Mode: {speedMultiplier}x Speed
      </div>
    </div>
  );
};

export default TimerControls;
