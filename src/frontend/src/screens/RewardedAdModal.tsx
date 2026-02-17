import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

interface RewardedAdModalProps {
  onComplete: () => void;
}

export default function RewardedAdModal({ onComplete }: RewardedAdModalProps) {
  const [countdown, setCountdown] = useState(5);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => {
        setIsOpen(false);
        onComplete();
      }, 500);
    }
  }, [countdown, onComplete]);

  const progress = ((5 - countdown) / 5) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Rewarded Continue</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-6">
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold text-amber-500">{countdown}</div>
            <p className="text-muted-foreground">
              {countdown > 0 ? 'Please wait...' : 'Resuming game!'}
            </p>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <div className="text-xs text-center text-muted-foreground">
            This is a simulated ad experience
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
