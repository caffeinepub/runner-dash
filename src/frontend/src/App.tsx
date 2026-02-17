import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import MainMenuScreen from './screens/MainMenuScreen';
import GameView from './game/GameView';
import GameOverScreen from './screens/GameOverScreen';
import SettingsScreen from './screens/SettingsScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
import ProfileSetupDialog from './auth/ProfileSetupDialog';
import RewardedAdModal from './screens/RewardedAdModal';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { AudioManager } from './audio/AudioManager';
import { Toaster } from '@/components/ui/sonner';

type Screen = 'menu' | 'game' | 'gameover' | 'settings' | 'leaderboard';

export default function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [finalScore, setFinalScore] = useState(0);
  const [showRewardedAd, setShowRewardedAd] = useState(false);
  const [canContinue, setCanContinue] = useState(true);
  const [audioManager] = useState(() => new AudioManager());
  
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    audioManager.initialize();
  }, [audioManager]);

  const handleStartGame = () => {
    setCanContinue(true);
    setScreen('game');
    audioManager.playBackgroundMusic();
  };

  const handleGameOver = (score: number) => {
    setFinalScore(score);
    setScreen('gameover');
    audioManager.stopBackgroundMusic();
    audioManager.playSound('hit');
  };

  const handleRestart = () => {
    setCanContinue(true);
    setScreen('game');
    audioManager.playBackgroundMusic();
  };

  const handleMainMenu = () => {
    setScreen('menu');
    audioManager.stopBackgroundMusic();
  };

  const handleSettings = () => {
    setScreen('settings');
  };

  const handleLeaderboard = () => {
    setScreen('leaderboard');
  };

  const handleWatchAd = () => {
    if (canContinue) {
      setShowRewardedAd(true);
    }
  };

  const handleAdComplete = () => {
    setShowRewardedAd(false);
    setCanContinue(false);
    setScreen('game');
    audioManager.playBackgroundMusic();
  };

  const handleLogout = () => {
    queryClient.clear();
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-background">
      {screen === 'menu' && (
        <MainMenuScreen
          onStartGame={handleStartGame}
          onSettings={handleSettings}
          onLeaderboard={handleLeaderboard}
          onLogout={handleLogout}
        />
      )}
      
      {screen === 'game' && (
        <GameView
          onGameOver={handleGameOver}
          audioManager={audioManager}
          isResuming={!canContinue}
        />
      )}
      
      {screen === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
          onWatchAd={canContinue ? handleWatchAd : undefined}
        />
      )}
      
      {screen === 'settings' && (
        <SettingsScreen
          onBack={handleMainMenu}
          audioManager={audioManager}
        />
      )}
      
      {screen === 'leaderboard' && (
        <LeaderboardScreen onBack={handleMainMenu} />
      )}

      {showRewardedAd && (
        <RewardedAdModal onComplete={handleAdComplete} />
      )}

      {showProfileSetup && <ProfileSetupDialog />}
      
      <Toaster />
    </div>
  );
}
