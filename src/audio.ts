type HumNodes = {
  readonly main: OscillatorNode;
  readonly high: OscillatorNode;
  readonly sub: OscillatorNode;
  readonly gain: GainNode;
};

const MASTER_ENABLED_GAIN = 0.3;
const HUM_GAIN = 0.45;
const RAMP_TIME = 0.4;

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private hum: HumNodes | null = null;
  private targetGain = 0;

  init(): void {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    try {
      const ctx = new Ctor();
      void ctx.resume();
      this.ctx = ctx;
      const master = ctx.createGain();
      master.gain.value = 0;
      master.connect(ctx.destination);
      this.masterGain = master;
      this.startHum();
      this.applyGain();
    } catch {
      this.ctx = null;
    }
  }

  setEnabled(on: boolean): void {
    this.targetGain = on ? MASTER_ENABLED_GAIN : 0;
    this.applyGain();
  }

  private applyGain(): void {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const g = this.masterGain.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.targetGain, now + RAMP_TIME);
  }

  private startHum(): void {
    if (this.hum || !this.ctx || !this.masterGain) return;
    const ctx = this.ctx;

    const main = ctx.createOscillator();
    main.type = "sine";
    main.frequency.value = 82.5;

    const high = ctx.createOscillator();
    high.type = "sine";
    high.frequency.value = 165;

    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 41.25;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 260;
    filter.Q.value = 0.5;

    const mainGain = ctx.createGain();
    mainGain.gain.value = 0.55;
    const highGain = ctx.createGain();
    highGain.gain.value = 0.12;
    const subGain = ctx.createGain();
    subGain.gain.value = 0.45;

    main.connect(mainGain);
    high.connect(highGain);
    sub.connect(subGain);
    mainGain.connect(filter);
    highGain.connect(filter);
    subGain.connect(filter);

    const gain = ctx.createGain();
    gain.gain.value = HUM_GAIN;
    filter.connect(gain);
    gain.connect(this.masterGain);

    main.start();
    high.start();
    sub.start();

    this.hum = { main, high, sub, gain };
  }

  playWhoosh(intensity = 1): void {
    if (!this.ctx || !this.masterGain || this.targetGain <= 0) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const clamped = Math.max(0.2, Math.min(1, intensity));
    const duration = 0.4 + 0.3 * clamped;
    const buffer = this.createNoiseBuffer(duration);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 6;
    const startFreq = 400 + 2200 * clamped;
    filter.frequency.setValueAtTime(startFreq, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + duration);
    const gain = ctx.createGain();
    const vol = 0.25 * clamped;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
    src.stop(now + duration + 0.05);
  }

  private createNoiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ctx;
    if (!ctx) throw new Error("Audio context unavailable");
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}

export const audioEngine = new AudioEngine();
