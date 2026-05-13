import { GameSettings } from '../types';

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientOsc: OscillatorNode | null = null;

  private constructor() {}

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private init() {
    if (this.audioCtx) return;
    
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.audioCtx.createGain();
    this.sfxGain = this.audioCtx.createGain();
    this.musicGain = this.audioCtx.createGain();

    this.masterGain.connect(this.audioCtx.destination);
    this.sfxGain.connect(this.masterGain);
    this.musicGain.connect(this.masterGain);

    this.updateVolumes();
    this.startAmbient();
  }

  updateVolumes() {
    const saved = localStorage.getItem('cardhaven_settings');
    const settings: GameSettings = saved ? JSON.parse(saved) : { masterVolume: 0.7, musicVolume: 0.5, sfxVolume: 0.8 };

    if (this.masterGain) this.masterGain.gain.setTargetAtTime(settings.masterVolume, this.audioCtx!.currentTime, 0.1);
    if (this.musicGain) this.musicGain.gain.setTargetAtTime(settings.musicVolume, this.audioCtx!.currentTime, 0.1);
    if (this.sfxGain) this.sfxGain.gain.setTargetAtTime(settings.sfxVolume, this.audioCtx!.currentTime, 0.1);
  }

  private startAmbient() {
    if (!this.audioCtx || !this.musicGain) return;

    // Create a dark, low ambient drone
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(40, this.audioCtx.currentTime); // Low E
    
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(40.5, this.audioCtx.currentTime); // Detuned

    gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.musicGain);

    osc1.start();
    osc2.start();
    this.ambientOsc = osc1; // Keep reference to prevent GC
  }

  playSFX(type: 'click' | 'card' | 'hit' | 'block' | 'death') {
    this.init();
    if (!this.audioCtx || !this.sfxGain) return;

    const t = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const env = this.audioCtx.createGain();

    osc.connect(env);
    env.connect(this.sfxGain);

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
        env.gain.setValueAtTime(0.3, t);
        env.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
      case 'card':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(600, t + 0.15);
        env.gain.setValueAtTime(0.2, t);
        env.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(t);
        osc.stop(t + 0.15);
        break;
      case 'hit':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.2);
        env.gain.setValueAtTime(0.4, t);
        env.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        osc.start(t);
        osc.stop(t + 0.2);
        // Add noise burst
        const noise = this.createNoiseBuffer();
        const noiseNode = this.audioCtx.createBufferSource();
        noiseNode.buffer = noise;
        const noiseEnv = this.audioCtx.createGain();
        noiseNode.connect(noiseEnv);
        noiseEnv.connect(this.sfxGain);
        noiseEnv.gain.setValueAtTime(0.2, t);
        noiseEnv.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        noiseNode.start(t);
        noiseNode.stop(t + 0.1);
        break;
      case 'block':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
        env.gain.setValueAtTime(0.3, t);
        env.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(t);
        osc.stop(t + 0.1);
        break;
    }
  }

  private createNoiseBuffer() {
    const bufferSize = this.audioCtx!.sampleRate * 0.5;
    const buffer = this.audioCtx!.createBuffer(1, bufferSize, this.audioCtx!.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}

export const audioManager = AudioManager.getInstance();
