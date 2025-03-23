
import React, { useState } from 'react';
import Visualizer from '@/components/Visualizer';
import Controls from '@/components/Controls';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisualTimeTimer from '@/components/VisualTimeTimer';
import Synthesizer from '@/components/Synthesizer';
import { VisualizationProvider, useVisualization } from '@/contexts/VisualizationContext';
import { SynthesizerProvider } from '@/contexts/SynthesizerContext';
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet';
import { Music } from 'lucide-react';
import { Button } from '@/components/ui/button';

const IndexContent: React.FC = () => {
  const { config, updateConfig, showTimer, toggleTimer } = useVisualization();
  const [activeTab, setActiveTab] = useState("visualizer");
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Canvas for visualization */}
      <Visualizer />
      
      {/* Timer Overlay (conditionally rendered) */}
      {showTimer && (
        <VisualTimeTimer 
          timeDuration={25} 
          interval={15}
        />
      )}
      
      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <Header />
        <div className="flex-1" />
        <Footer />
      </div>
      
      {/* Timer Toggle Button */}
      <button
        onClick={toggleTimer}
        className="fixed top-8 right-8 bg-black/30 backdrop-blur-md border border-white/20 shadow-lg 
                  rounded-full px-4 py-2 text-white/90 opacity-70 hover:opacity-100 transition-all duration-300 z-50"
      >
        {showTimer ? 'Hide Timer' : 'Show Timer'}
      </button>
      
      {/* Controls */}
      <Controls />
      
      {/* Synthesizer Panel */}
      <div className="fixed left-8 bottom-24 z-40 pointer-events-auto">
        <Sheet>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/10 shadow-md opacity-70 hover:opacity-100 transition-opacity"
            >
              <Music className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent 
            side="left" 
            className="w-[350px] sm:w-[450px] bg-black/80 backdrop-blur-lg border-white/10"
          >
            <div className="py-6">
              <Synthesizer />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <VisualizationProvider>
      <SynthesizerProvider>
        <IndexContent />
      </SynthesizerProvider>
    </VisualizationProvider>
  );
};

export default Index;
