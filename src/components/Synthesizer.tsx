import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Square, 
  Volume2, 
  Clock, 
  Waves,
  Music,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSynthesizer } from '@/hooks/useSynthesizer';

interface SynthesizerProps {
  frequency?: number;
  attack?: number;
  decay?: number;
  sustain?: number;
  release?: number;
  filterCutoff?: number;
  filterResonance?: number;
  className?: string;
}

const Synthesizer: React.FC<SynthesizerProps> = ({
  frequency = 60,
  attack = 0.01,
  decay = 0.1,
  sustain = 0.3,
  release = 0.1,
  filterCutoff = 1000,
  filterResonance = 1,
  className,
}) => {
  const {
    frequency: freq,
    setFrequency,
    attack: att,
    setAttack,
    decay: dec,
    setDecay,
    sustain: sus,
    setSustain,
    release: rel,
    setRelease,
    bpm,
    setBpm,
    pattern,
    togglePatternStep,
    isPlaying,
    toggleSequencer,
    filterCutoff: cutoff,
    setFilterCutoff,
    filterResonance: resonance,
    setFilterResonance,
  } = useSynthesizer({
    frequency,
    attack,
    decay,
    sustain,
    release,
    filterCutoff,
    filterResonance,
  });

  return (
    <div className={cn(
      "flex flex-col p-6 rounded-lg bg-black/80 backdrop-blur-lg border border-white/10 shadow-xl w-full",
      className
    )}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Music className="w-5 h-5" /> Techno Synthesizer
        </h2>
        <Button
          variant={isPlaying ? "destructive" : "default"}
          size="sm"
          onClick={toggleSequencer}
          className="ml-2"
        >
          {isPlaying ? <Square className="mr-1" /> : <Play className="mr-1" />}
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>

      <div className="grid grid-cols-8 gap-1 mb-6">
        {pattern.map((step, index) => (
          <button
            key={index}
            className={`h-10 rounded-md ${
              step === 1 
                ? 'bg-primary hover:bg-primary/80' 
                : 'bg-secondary hover:bg-secondary/80'
            } transition-colors`}
            onClick={() => togglePatternStep(index)}
          />
        ))}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> BPM</span>
            <span>{bpm}</span>
          </div>
          <Slider
            value={[bpm]}
            min={60}
            max={180}
            step={1}
            onValueChange={([value]) => setBpm(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1"><Waves className="w-3 h-3" /> Frequency</span>
            <span>{freq} Hz</span>
          </div>
          <Slider
            value={[freq]}
            min={30}
            max={120}
            step={1}
            onValueChange={([value]) => setFrequency(value)}
          />
        </div>

        {/* Filter Controls */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> Filter Cutoff</span>
            <span>{cutoff} Hz</span>
          </div>
          <Slider
            value={[cutoff]}
            min={50}
            max={5000}
            step={10}
            onValueChange={([value]) => setFilterCutoff(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1"><Filter className="w-3 h-3" /> Resonance</span>
            <span>{resonance.toFixed(1)}</span>
          </div>
          <Slider
            value={[resonance]}
            min={0.1}
            max={10}
            step={0.1}
            onValueChange={([value]) => setFilterResonance(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="flex items-center gap-1"><Volume2 className="w-3 h-3" /> Attack</span>
            <span>{att.toFixed(2)}s</span>
          </div>
          <Slider
            value={[att]}
            min={0.01}
            max={0.5}
            step={0.01}
            onValueChange={([value]) => setAttack(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Decay</span>
            <span>{dec.toFixed(2)}s</span>
          </div>
          <Slider
            value={[dec]}
            min={0.01}
            max={1}
            step={0.01}
            onValueChange={([value]) => setDecay(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Sustain</span>
            <span>{sus.toFixed(2)}</span>
          </div>
          <Slider
            value={[sus]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={([value]) => setSustain(value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Release</span>
            <span>{rel.toFixed(2)}s</span>
          </div>
          <Slider
            value={[rel]}
            min={0.01}
            max={1}
            step={0.01}
            onValueChange={([value]) => setRelease(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Synthesizer;
