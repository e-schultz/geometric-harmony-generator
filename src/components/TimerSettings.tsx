
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface TimerSettingsProps {
  currentDuration: number;
  onDurationChange: (minutes: number) => void;
}

interface TimerFormValues {
  duration: number;
}

const TimerSettings: React.FC<TimerSettingsProps> = ({ 
  currentDuration, 
  onDurationChange 
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TimerFormValues>({
    defaultValues: {
      duration: currentDuration
    }
  });

  const handleSubmit = (values: TimerFormValues) => {
    const duration = Math.max(1, Math.min(120, values.duration));
    
    if (duration !== values.duration) {
      form.setValue('duration', duration);
      toast({
        title: "Duration adjusted",
        description: "Timer duration must be between 1 and 120 minutes."
      });
    }
    
    onDurationChange(duration);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="fixed top-20 right-8 bg-black/30 backdrop-blur-md rounded-full px-4 py-2 text-white/90 flex items-center gap-2 border border-white/10 shadow-md opacity-70 hover:opacity-100 transition-all duration-300 z-50">
        <Clock className="w-4 h-4" />
        <span>{currentDuration} min</span>
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-7 px-2 text-xs"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed top-20 right-8 bg-black/50 backdrop-blur-md rounded-lg p-4 border border-white/10 shadow-lg z-50 w-64">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white/90">Timer Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    max={120} 
                    {...field} 
                    onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                    className="bg-black/20 border-white/20 text-white/90"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="flex gap-2 justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => setIsEditing(false)}
              className="text-white/70 hover:text-white/90"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              size="sm"
            >
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TimerSettings;
