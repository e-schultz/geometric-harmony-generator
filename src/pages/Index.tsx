
import React, { useState } from 'react';
import Visualizer from '@/components/Visualizer';
import Controls from '@/components/Controls';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DEFAULT_CONFIG } from '@/lib/constants';
import { VisualizationConfig } from '@/lib/types';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const [config, setConfig] = useState<VisualizationConfig>(DEFAULT_CONFIG);
  
  const handleConfigChange = (newConfig: Partial<VisualizationConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
    
    // Show toast when visualization type changes
    if (newConfig.type && newConfig.type !== config.type) {
      toast(`Switched to ${newConfig.type} visualization`, {
        position: 'top-center',
        duration: 2000,
        className: 'bg-black/70 backdrop-blur-md border border-white/10',
      });
    }
  };
  
  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    toast('Reset to default settings', {
      position: 'top-center',
      duration: 2000,
      className: 'bg-black/70 backdrop-blur-md border border-white/10',
    });
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Canvas for visualization */}
      <Visualizer config={config} />
      
      {/* UI Overlay */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <Header />
        <div className="flex-1" />
        <Footer />
      </div>
      
      {/* Controls */}
      <Controls config={config} onChange={handleConfigChange} onReset={handleReset} />
    </div>
  );
};

export default Index;
