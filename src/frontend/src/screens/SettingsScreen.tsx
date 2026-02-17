import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ScreenLayout from '../ui/ScreenLayout';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../settings/useSettings';
import type { AudioManager } from '../audio/AudioManager';

interface SettingsScreenProps {
  onBack: () => void;
  audioManager: AudioManager;
}

export default function SettingsScreen({ onBack, audioManager }: SettingsScreenProps) {
  const { settings, updateSettings } = useSettings();

  const handleMusicToggle = (enabled: boolean) => {
    updateSettings({ musicEnabled: enabled });
    if (enabled) {
      audioManager.setMusicEnabled(true);
    } else {
      audioManager.setMusicEnabled(false);
    }
  };

  const handleSfxToggle = (enabled: boolean) => {
    updateSettings({ sfxEnabled: enabled });
    audioManager.setSfxEnabled(enabled);
  };

  return (
    <ScreenLayout>
      <div className="flex flex-col items-center justify-center min-h-screen gap-8 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-5xl font-black text-amber-500">SETTINGS</h1>
          </div>

          <div className="bg-card border-2 border-border rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="music" className="text-lg font-semibold">
                Background Music
              </Label>
              <Switch
                id="music"
                checked={settings.musicEnabled}
                onCheckedChange={handleMusicToggle}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sfx" className="text-lg font-semibold">
                Sound Effects
              </Label>
              <Switch
                id="sfx"
                checked={settings.sfxEnabled}
                onCheckedChange={handleSfxToggle}
              />
            </div>
          </div>

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
