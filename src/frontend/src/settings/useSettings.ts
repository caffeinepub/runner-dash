import { useState, useEffect } from 'react';
import { loadSettings, saveSettings, type Settings } from './storage';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(loadSettings);

  const updateSettings = (partial: Partial<Settings>) => {
    const newSettings = { ...settings, ...partial };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
  }, []);

  return {
    settings,
    updateSettings,
  };
}
