import { GameSettings } from '../types';

class AudioManager {
  private static instance: AudioManager;
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientGainNodes: GainNode[] = [];

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

    // Create a rich ambient pad with multiple layers and evolving frequencies
    const baseFrequencies = [55, 110, 165, 220]; // A2, A3, E4, A4 - A minor chord
    const layers = [
      { freq: 55, type: 'sine' as const, detune: 0 },
      { freq: 55.2, type: 'sine' as const, detune: 10 },
      { freq: 110, type: 'triangle' as const, detune: 0 },
      { freq: 110.5, type: 'triangle' as const, detune: -10 },
      { freq: 165, type: 'sine' as const, detune: 0 },
      { freq: 220, type: 'sine' as const, detune: 5 },
    ];

    const masterAmbientGain = this.audioCtx.createGain();
    masterAmbientGain.gain.setValueAtTime(1, this.audioCtx.currentTime);
    masterAmbientGain.connect(this.musicGain);

    layers.forEach((layer, idx) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();
      const lfo = this.audioCtx!.createOscillator();
      const lfoGain = this.audioCtx!.createGain();

      osc.type = layer.type;
      osc.frequency.setValueAtTime(layer.freq, this.audioCtx!.currentTime);
      osc.detune.setValueAtTime(layer.detune, this.audioCtx!.currentTime);

      // LFO (Low Frequency Oscillator) for subtle modulation
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.3 + idx * 0.05, this.audioCtx!.currentTime);
      lfoGain.gain.setValueAtTime(5 + idx * 2, this.audioCtx!.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      // Individual layer gain with envelope
      gain.gain.setValueAtTime(0.08 + (idx % 2) * 0.04, this.audioCtx!.currentTime);

      osc.connect(gain);
      gain.connect(masterAmbientGain);

      osc.start();
      lfo.start();

      this.ambientOscillators.push(osc, lfo);
      this.ambientGainNodes.push(gain, lfoGain);
    });

    // Add bass pad - deeper note
    const bassPad = this.audioCtx.createOscillator();
    const bassPadGain = this.audioCtx.createGain();
    bassPad.type = 'sine';
    bassPad.frequency.setValueAtTime(27.5, this.audioCtx.currentTime); // A1
    bassPadGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);

    bassPad.connect(bassPadGain);
    bassPadGain.connect(masterAmbientGain);
    bassPad.start();

    this.ambientOscillators.push(bassPad);
    this.ambientGainNodes.push(bassPadGain);
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
