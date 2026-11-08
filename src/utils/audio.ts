/**
 * Web Audio API synthesizer for realistic Diwali firecracker sounds,
 * sparkler hisses, and melodic festive ambience without external MP3 dependencies.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private ambientTimer: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.getContext()?.currentTime || 0);
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound of burning fuse: sharp white noise clicks and hiss
   */
  public playFuseSound(durationMs: number = 3000): { stop: () => void } {
    if (this.isMuted) return { stop: () => {} };
    const ctx = this.getContext();
    if (!ctx) return { stop: () => {} };

    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2800, ctx.currentTime);
    filter.Q.setValueAtTime(4.0, ctx.currentTime);

    // Randomize frequency slightly for sizzle texture
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(14, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(900, ctx.currentTime);
    lfo.connect(filter.frequency);
    lfo.start();

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.3);
    gainNode.gain.linearRampToValueAtTime(0.24, ctx.currentTime + (durationMs / 1000) * 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start();

    const stop = () => {
      try {
        whiteNoise.stop();
        lfo.stop();
        gainNode.disconnect();
      } catch {
        // Already stopped
      }
    };

    setTimeout(stop, durationMs + 200);
    return { stop };
  }

  /**
   * Slow-motion tension heartbeat/whoosh right before the bomb erupts
   */
  public playSlowMoTension() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(70, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 1.2);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.3);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.35);
  }

  /**
   * Massive bomb blast: sub-bass thump + rich explosive rumble + crackles
   */
  public playBombExplosion() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Deep Sub Thump (50Hz down to 20Hz)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.9);

    subGain.gain.setValueAtTime(0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.5);

    // 2. Explosive Noise Burst (White noise with lowpass filter)
    const bufferSize = ctx.sampleRate * 2.5;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.4));
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 1.8);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.8, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);

    // 3. Crisp Secondary Crackles (celebratory Diwali echoes)
    for (let i = 0; i < 7; i++) {
      const delay = 0.2 + i * 0.16 + Math.random() * 0.12;
      this.playSingleCrackle(now + delay, 0.15 - i * 0.015);
    }
  }

  private playSingleCrackle(time: number, volume: number) {
    const ctx = this.getContext();
    if (!ctx) return;
    const crackle = ctx.createOscillator();
    const crackleGain = ctx.createGain();
    crackle.type = 'sawtooth';
    crackle.frequency.setValueAtTime(400 + Math.random() * 900, time);
    crackleGain.gain.setValueAtTime(Math.max(0.01, volume), time);
    crackleGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);

    crackle.connect(crackleGain);
    crackleGain.connect(ctx.destination);
    crackle.start(time);
    crackle.stop(time + 0.1);
  }

  /**
   * Crystalline bell chime when lighting a diya
   */
  public playDiyaLight(index: number = 0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]; // C, D, E, G, A, C5 (Bhoopali pentatonic)
    const freq = notes[index % notes.length];

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm harmonics
    const oscHarmonic = ctx.createOscillator();
    const gainHarmonic = ctx.createGain();
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, ctx.currentTime);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

    gainHarmonic.gain.setValueAtTime(0.08, ctx.currentTime);
    gainHarmonic.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    oscHarmonic.connect(gainHarmonic);
    gainHarmonic.connect(ctx.destination);

    osc.start();
    oscHarmonic.start();
    osc.stop(ctx.currentTime + 1.9);
    oscHarmonic.stop(ctx.currentTime + 1.3);
  }

  /**
   * Sparkler shimmer sound for sparkler drawing wand
   */
  public playSparklerChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200 + Math.random() * 800, ctx.currentTime);
    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.13);
  }

  /**
   * Sizzling fountain sound for Anar (flowerpot cracker)
   */
  public playAnarFountain(durationMs: number = 3500) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (0.3 + 0.7 * Math.sin((i / bufferSize) * Math.PI));
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(2400, ctx.currentTime + (durationMs / 1000) * 0.6);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.28, ctx.currentTime + 1.0);
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + (durationMs / 1000) * 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start();
  }

  /**
   * Ambient warm festive musical background melody
   */
  public startFestiveAmbient() {
    if (this.ambientTimer || this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    // Sequence of festive sitar/harp like pentatonic notes
    const melody = [523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 1046.5, 880.0];
    let noteIdx = 0;

    const playNext = () => {
      if (this.isMuted || !this.ctx) return;
      const freq = melody[noteIdx % melody.length];
      noteIdx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.6);
    };

    playNext();
    this.ambientTimer = window.setInterval(playNext, 2200);
  }

  public stopFestiveAmbient() {
    if (this.ambientTimer) {
      clearInterval(this.ambientTimer);
      this.ambientTimer = null;
    }
  }
}

export const soundFx = new SoundController();
