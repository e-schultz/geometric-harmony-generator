
import React from 'react';
import { VisualizationType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Grid, Box, Sparkles } from 'lucide-react';

interface VisualizationButtonsProps {
  currentType: VisualizationType;
  onTypeChange: (type: VisualizationType) => void;
  types: VisualizationType[];
}

const VisualizationButtons: React.FC<VisualizationButtonsProps> = ({ 
  currentType, 
  onTypeChange, 
  types 
}) => {
  const renderVisualizationButton = (type: VisualizationType) => {
    let icon;
    switch (type) {
      case 'tunnel':
        icon = <LayoutDashboard className="w-4 h-4" />;
        break;
      case 'grid':
        icon = <Grid className="w-4 h-4" />;
        break;
      case 'polyhedron':
        icon = <Box className="w-4 h-4" />;
        break;
      case 'particles':
        icon = <Sparkles className="w-4 h-4" />;
        break;
      default:
        icon = <LayoutDashboard className="w-4 h-4" />;
    }
    
    return (
      <Button
        key={type}
        variant={currentType === type ? "default" : "secondary"}
        size="icon"
        className="w-8 h-8"
        onClick={() => onTypeChange(type)}
        title={`Switch to ${type} visualization`}
      >
        {icon}
      </Button>
    );
  };

  return (
    <div className="flex gap-2">
      {types.map(renderVisualizationButton)}
    </div>
  );
};

export default VisualizationButtons;
