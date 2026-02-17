import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSubmitScore, useGetBestScore } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import ScreenLayout from '../ui/ScreenLayout';
import { RotateCcw, Home, Trophy, Play } from 'lucide-react';
import { toast } from 'sonner';

interface GameOverScreenProps {
  score: number;
  onRestart: () => void;
  onMainMenu: () => void;
  onWatchAd?: () => void;
}

export default function GameOverScreen({
  score,
  onRestart,
  onMainMenu,
  onWatchAd,
}: GameOverScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const submitScoreMutation = useSubmitScore();
  const { data: bestScore } = useGetBestScore();

  const localBestScore = parseInt(localStorage.getItem('bestScore') || '0');
  const displayBestScore = isAuthenticated && bestScore !== undefined
    ? Number(bestScore)
    : localBestScore;

  if (score > localBestScore) {
    localStorage.setItem('bestScore', score.toString());
  }

  const handleSubmitScore = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to submit your score');
      return;
    }

    try {
      await submitScoreMutation.mutateAsync(BigInt(score));
      setHasSubmitted(true);
      toast.success('Score submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit score');
      console.error('Submit score error:', error);
    }
  };

  return (
    <ScreenLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-black text-destructive">GAME OVER</h1>
          
          <div className="bg-card border-2 border-border rounded-2xl p-8 space-y-4">
            <div>
              <p className="text-muted-foreground text-lg">Your Score</p>
              <p className="text-5xl font-bold text-amber-500">{score.toLocaleString()}</p>
            </div>
            
            <div className="border-t border-border pt-4">
              <p className="text-muted-foreground">Best Score</p>
              <p className="text-3xl font-bold text-foreground">{displayBestScore.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full max-w-md">
          {isAuthenticated && !hasSubmitted && (
            <Button
              size="lg"
              onClick={handleSubmitScore}
              disabled={submitScoreMutation.isPending}
              className="text-lg py-6 bg-amber-500 hover:bg-amber-600"
            >
              <Trophy className="mr-2 h-5 w-5" />
              {submitScoreMutation.isPending ? 'Submitting...' : 'Submit Score'}
            </Button>
          )}

          {!isAuthenticated && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Login to submit your score to the leaderboard
            </div>
          )}

          {onWatchAd && (
            <Button
              size="lg"
              variant="outline"
              onClick={onWatchAd}
              className="text-lg py-6 border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Ad to Continue
            </Button>
          )}

          <Button
            size="lg"
            onClick={onRestart}
            className="text-lg py-6"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Restart
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onMainMenu}
            className="text-lg py-6"
          >
            <Home className="mr-2 h-5 w-5" />
            Main Menu
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
}
