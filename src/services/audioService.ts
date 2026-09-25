class EspionageAudioEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private currentMusicOscs: Array<OscillatorNode | AudioNode> = [];
  private musicInterval: any = null;
  private currentTrack: 'none' | 'suspense' | 'flight' | 'pursuit' | 'victory' = 'none';

  private musicEnabled: boolean = true;
  private sfxEnabled: boolean = true;
  private voiceEnabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicEnabled ? 0.25 : 0, this.ctx.currentTime);
        this.musicGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.sfxEnabled ? 0.4 : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSettings(music: boolean, sfx: boolean, voice: boolean) {
    this.musicEnabled = music;
    this.sfxEnabled = sfx;
    this.voiceEnabled = voice;

    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(music ? 0.25 : 0, this.ctx.currentTime, 0.1);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(sfx ? 0.4 : 0, this.ctx.currentTime, 0.1);
    }
    if (!music) {
      this.stopMusic();
    }
  }

  // Play Sound Effects
  public playClick() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playTeletype() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }

  public playRadarPing() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1500, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  public playAlertSiren() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.25);
    osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 0.5);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.55);
  }

  public playFlightWhoosh() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Filtered noise swoosh
    const bufferSize = this.ctx.sampleRate * 1.2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.6);
    filter.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 1.2);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    noise.start();
    noise.stop(this.ctx.currentTime + 1.25);
  }

  public playSuccess() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(this.ctx.currentTime + idx * 0.08);
      osc.stop(this.ctx.currentTime + idx * 0.08 + 0.45);
    });
  }

  public playWrong() {
    if (!this.sfxEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.setValueAtTime(140, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Procedural Music Atmospheres
  public playAtmosphere(type: 'suspense' | 'flight' | 'pursuit' | 'victory') {
    if (!this.musicEnabled) return;
    if (this.currentTrack === type) return;
    this.stopMusic();
    this.initContext();
    if (!this.ctx || !this.musicGain) return;

    this.currentTrack = type;

    if (type === 'suspense') {
      // Deep espionage drone with subtle modal notes
      const rootFreq = 65.41; // C2
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(rootFreq, this.ctx.currentTime);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(rootFreq * 1.5, this.ctx.currentTime); // G2

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);

      const localGain = this.ctx.createGain();
      localGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(localGain);
      localGain.connect(this.musicGain);

      osc1.start();
      osc2.start();
      this.currentMusicOscs.push(osc1, osc2, filter, localGain);

      // Pulse interval
      let step = 0;
      const notes = [130.81, 155.56, 174.61, 196.00]; // C3, Eb3, F3, G3
      this.musicInterval = setInterval(() => {
        if (!this.ctx || !this.musicGain) return;
        const pOsc = this.ctx.createOscillator();
        const pGain = this.ctx.createGain();
        pOsc.type = 'sine';
        pOsc.frequency.setValueAtTime(notes[step % notes.length], this.ctx.currentTime);
        pGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        pGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);
        pOsc.connect(pGain);
        pGain.connect(this.musicGain);
        pOsc.start();
        pOsc.stop(this.ctx.currentTime + 1.3);
        step++;
      }, 2000);
    } else if (type === 'flight') {
      // Adventurous arpeggiation
      const chord = [220, 277.18, 329.63, 440]; // A major
      let noteIndex = 0;
      this.musicInterval = setInterval(() => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(chord[noteIndex % chord.length], this.ctx.currentTime);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.35);
        noteIndex++;
      }, 350);
    } else if (type === 'pursuit') {
      // Fast ticking pulse with tension
      let beat = 0;
      this.musicInterval = setInterval(() => {
        if (!this.ctx || !this.musicGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const freq = beat % 4 === 0 ? 300 : 180;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
        beat++;
      }, 180);
    } else if (type === 'victory') {
      this.playSuccess();
    }
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.currentMusicOscs.forEach(node => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch (e) {
        // ignore disconnect on already stopped node
      }
    });
    this.currentMusicOscs = [];
    this.currentTrack = 'none';
  }

  // Text-To-Speech Reader
  public speakText(text: string) {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.05;
    utterance.pitch = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const audioEngine = new EspionageAudioEngine();
