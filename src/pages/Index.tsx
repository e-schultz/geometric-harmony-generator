
import React from 'react';
import Visualizer from '@/components/Visualizer';
import Controls from '@/components/Controls';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VisualTimeTimer from '@/components/VisualTimeTimer';
import { VisualizationProvider, useVisualization } from '@/contexts/VisualizationContext';

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
