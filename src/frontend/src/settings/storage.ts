export interface Settings {
  musicEnabled: boolean;
  sfxEnabled: boolean;
}

const SETTINGS_KEY = 'runnerDashSettings';

const DEFAULT_SETTINGS: Settings = {
  musicEnabled: true,
  sfxEnabled: true,
};

export function loadSettings(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}
