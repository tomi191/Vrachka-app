// Sound effects using Web Audio API
// No external files needed!

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Get saved preference - DISABLED by default
      const saved = localStorage.getItem('sounds_enabled');
      this.enabled = saved === null ? false : saved === 'true';
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sounds_enabled', enabled.toString());
    }
  }

  isEnabled() {
    return this.enabled;
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Shuffle sound - multiple quick swooshes
  shuffle() {
    if (!this.enabled || !this.audioContext) return;

    const frequencies = [200, 250, 180, 220, 190];
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.1, 'triangle', 0.15);
      }, i * 80);
    });
  }

  // Flip sound - quick whoosh
  flip() {
    if (!this.enabled || !this.audioContext) return;

    const startFreq = 400;
    const endFreq = 200;
    const duration = 0.2;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(startFreq, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.audioContext.currentTime + duration);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Reveal sound - mystical chime
  reveal() {
    if (!this.enabled || !this.audioContext) return;

    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 (major chord)
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.8, 'sine', 0.12);
      }, i * 100);
    });
  }

  // Success sound - positive chime
  success() {
    if (!this.enabled || !this.audioContext) return;

    this.playTone(523.25, 0.15, 'sine', 0.2); // C5
    setTimeout(() => this.playTone(659.25, 0.3, 'sine', 0.2), 100); // E5
  }
}

// Singleton instance
let soundManager: SoundManager | null = null;

export function getSoundManager() {
  if (typeof window === 'undefined') return null;
  if (!soundManager) {
    soundManager = new SoundManager();
  }
  return soundManager;
}

// Convenience functions
export const playShuffleSound = () => getSoundManager()?.shuffle();
export const playFlipSound = () => getSoundManager()?.flip();
export const playRevealSound = () => getSoundManager()?.reveal();
export const playSuccessSound = () => getSoundManager()?.success();
export const toggleSounds = () => {
  const manager = getSoundManager();
  if (manager) {
    manager.setEnabled(!manager.isEnabled());
    return manager.isEnabled();
  }
  return false;
};
export const isSoundsEnabled = () => getSoundManager()?.isEnabled() ?? false;
