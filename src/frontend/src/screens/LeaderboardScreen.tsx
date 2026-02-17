import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetTopScores, useGetBestScore } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import ScreenLayout from '../ui/ScreenLayout';
import { ArrowLeft, Trophy, Crown } from 'lucide-react';

interface LeaderboardScreenProps {
  onBack: () => void;
}

export default function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const { data: topScores, isLoading: scoresLoading } = useGetTopScores(10);
  const { data: bestScore } = useGetBestScore();

  const currentPrincipal = identity?.getPrincipal().toString();

  return (
    <ScreenLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4 py-12">
        <div className="w-full max-w-2xl space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-black text-amber-500 flex items-center justify-center gap-3">
              <Trophy className="h-12 w-12" />
              LEADERBOARD
            </h1>
          </div>

          {isAuthenticated && bestScore !== undefined && (
            <div className="bg-amber-500/10 border-2 border-amber-500 rounded-xl p-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Your Best Score</p>
                <p className="text-4xl font-bold text-amber-500">{Number(bestScore).toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="bg-card border-2 border-border rounded-2xl overflow-hidden">
            {scoresLoading ? (
              <div className="p-12 text-center text-muted-foreground">
                Loading scores...
              </div>
            ) : topScores && topScores.length > 0 ? (
              <div className="divide-y divide-border">
                {topScores.map((entry, index) => {
                  const isCurrentUser = entry.principal.toString() === currentPrincipal;
                  return (
                    <div
                      key={entry.principal.toString()}
                      className={`flex items-center gap-4 p-4 ${
                        isCurrentUser ? 'bg-amber-500/10' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted font-bold text-lg">
                        {index === 0 ? (
                          <Crown className="h-6 w-6 text-amber-500" />
                        ) : (
                          <span className="text-muted-foreground">#{index + 1}</span>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-muted-foreground truncate">
                          {entry.principal.toString().slice(0, 20)}...
                        </p>
                      </div>
                      
                      <div className="text-2xl font-bold text-amber-500">
                        {Number(entry.score).toLocaleString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                No scores yet. Be the first!
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <div className="text-center text-muted-foreground">
              Login to submit your scores and compete!
            </div>
          )}

          <Button
            size="lg"
            variant="outline"
            onClick={onBack}
            className="w-full text-lg py-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Menu
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
}
