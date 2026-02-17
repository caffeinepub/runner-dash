import { loadSettings } from '../settings/storage';

export class AudioManager {
  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    const settings = loadSettings();
    this.musicEnabled = settings.musicEnabled;
    this.sfxEnabled = settings.sfxEnabled;
  }

  public initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
  }

  public setSfxEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  public playSound(soundId: string): void {
    if (!this.sfxEnabled) return;
    // Simple beep sound simulation using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (soundId === 'jump') {
        oscillator.frequency.value = 440;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      } else if (soundId === 'hit') {
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      }
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }

  public playBackgroundMusic(): void {
    // Background music would be implemented here
    // For now, we'll skip it to keep the implementation simple
  }

  public stopBackgroundMusic(): void {
    // Stop background music
  }
}
