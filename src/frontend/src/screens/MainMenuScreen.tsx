import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import ScreenLayout from '../ui/ScreenLayout';
import { Play, Settings, Trophy, LogOut, LogIn } from 'lucide-react';

interface MainMenuScreenProps {
  onStartGame: () => void;
  onSettings: () => void;
  onLeaderboard: () => void;
  onLogout: () => void;
}

export default function MainMenuScreen({
  onStartGame,
  onSettings,
  onLeaderboard,
  onLogout,
}: MainMenuScreenProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      onLogout();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <ScreenLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
        <div className="text-center space-y-4">
          <h1 className="text-7xl font-black tracking-tight text-amber-500 drop-shadow-lg">
            RUNNER DASH
          </h1>
          <p className="text-xl text-muted-foreground">
            Jump, dodge, survive!
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-md">
          <Button
            size="lg"
            onClick={onStartGame}
            className="text-xl py-8 bg-amber-500 hover:bg-amber-600 text-white font-bold"
          >
            <Play className="mr-2 h-6 w-6" />
            Start Game
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onLeaderboard}
            className="text-lg py-6"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={onSettings}
            className="text-lg py-6"
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleAuth}
            disabled={isLoggingIn}
            className="text-lg py-6"
          >
            {isLoggingIn ? (
              'Logging in...'
            ) : isAuthenticated ? (
              <>
                <LogOut className="mr-2 h-5 w-5" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </ScreenLayout>
  );
}
