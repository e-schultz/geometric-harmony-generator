
import React from 'react';
import Visualizer from '@/components/Visualizer';
import Controls from '@/components/Controls';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisualTimeTimer from '@/components/VisualTimeTimer';
import Synthesizer from '@/components/Synthesizer';
import { VisualizationProvider, useVisualization } from '@/contexts/VisualizationContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IndexContent: React.FC = () => {
  const { config, updateConfig, showTimer, toggleTimer } = useVisualization();
  
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
      
      {/* Synthesizer */}
      <div className="fixed left-8 bottom-24 z-40 w-80 pointer-events-auto">
        <Tabs defaultValue="visualizer" className="w-full">
          <TabsList className="w-full bg-black/50 backdrop-blur-md">
            <TabsTrigger value="visualizer" className="flex-1">Visualizer</TabsTrigger>
            <TabsTrigger value="synth" className="flex-1">Synthesizer</TabsTrigger>
          </TabsList>
          <TabsContent value="visualizer">
            {/* Visualizer controls remain here */}
          </TabsContent>
          <TabsContent value="synth">
            <Synthesizer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <VisualizationProvider>
      <IndexContent />
    </VisualizationProvider>
  );
};

export default Index;
