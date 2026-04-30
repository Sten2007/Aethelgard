export class AudioSystem {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.isMuted = false;
        this.currentSequence = null;
        this.isPlaying = false;
        this.lastBeatTime = 0;
        this.beatDuration = 0.2; // 120 BPM
        this.notes = {
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
            'G3': 196.00, 'A3': 220.00, 'B3': 246.94
        };

        this.worldMelody = [
            'G4', null, 'B4', 'D5', 'C5', null, 'A4', null,
            'G4', null, 'B4', 'D5', 'E5', 'D5', 'B4', 'G4',
            'A4', null, 'C5', null, 'B4', null, 'G4', null,
            'A4', 'B4', 'C5', 'A4', 'G4', null, null, null
        ];

        this.battleMelody = [
            'E4', 'E4', 'G4', 'E4', 'A4', 'E4', 'B4', 'E4',
            'C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'B3'
        ];

        this.introMelody = [
            'C4', 'G4', 'C5', 'G4', 'E4', 'C4', 'G4', 'E4',
            'F4', 'A4', 'C5', 'A4', 'F4', 'D4', 'A4', 'F4',
            'G4', 'B4', 'D5', 'B4', 'G4', 'E4', 'B4', 'G4',
            'C5', 'G4', 'E4', 'G4', 'C5', null, null, null
        ];
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.2;
        this.isPlaying = true;
        this.tick();
    }

    tick() {
        if (!this.isPlaying || this.isMuted) {
            setTimeout(() => this.tick(), 100);
            return;
        }

        const now = this.ctx.currentTime;
        if (now > this.lastBeatTime + this.beatDuration) {
            this.playBeat();
            this.lastBeatTime = now;
        }
        requestAnimationFrame(() => this.tick());
    }

    playBeat() {
        if (!this.currentSequence) return;
        
        const index = Math.floor(this.ctx.currentTime / this.beatDuration) % this.currentSequence.length;
        const noteName = this.currentSequence[index];
        
        if (noteName) {
            const freq = this.notes[noteName];
            this.playTone(freq, this.currentMode === 'world' ? 'sine' : 'square', 0.15);
        }

        // Bass/Percussion
        if (this.currentMode === 'battle') {
            if (index % 2 === 0) this.playTone(80, 'sawtooth', 0.1, 0.1); // Bass
            if (index % 4 === 2) this.playNoise(0.05); // Snare-ish noise
        } else {
            if (index % 8 === 0) this.playTone(98, 'sine', 0.2, 0.05); // Low G
        }
    }

    playTone(freq, type, duration, volume = 0.1) {
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        g.gain.setValueAtTime(volume, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        osc.connect(g);
        g.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playNoise(duration) {
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 1000;
        
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.05, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        
        source.connect(filter);
        filter.connect(g);
        g.connect(this.masterGain);
        source.start();
    }

    playWorldMusic() {
        this.currentMode = 'world';
        this.currentSequence = this.worldMelody;
        this.beatDuration = 0.25; // Slower
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    playBattleMusic() {
        this.currentMode = 'battle';
        this.currentSequence = this.battleMelody;
        this.beatDuration = 0.15; // Faster
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    playIntroMusic() {
        this.currentMode = 'battle';
        this.currentSequence = this.introMelody;
        this.beatDuration = 0.2; // Marching heroic tempo
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.isMuted ? 0 : 0.2;
        }
        return this.isMuted;
    }
}
