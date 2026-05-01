import { AudioSystem } from '../game/audio.js';

export class StoryScreen {
    constructor(container, onComplete) {
        this.container = container;
        this.onComplete = onComplete;
        this.audio = new AudioSystem();
        this.lines = [
            "For an eternity, Aethelgard bathed in the light of the Celestial Angel.",
            "But the Void Watcher awoke, breaking the dimensions and corrupting the realms.",
            "Five mighty Guardians fell to the shadows, sealing the path to the Spire.",
            "You must defeat the fallen Guardians and conquer the Void Watcher",
            "...Only then can you enter the True Void and banish the Watcher forever."
        ];
        this.currentLine = 0;
    }

    render() {
        this.container.innerHTML = `
            <div id="story-screen" style="position:absolute;inset:0;background:#000;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:9999;transition:opacity 1s ease;pointer-events:auto;">
                <img id="story-bg" src="intro_bg.png" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 3s ease;image-rendering:pixelated;" />
                
                <div id="start-overlay" style="position:absolute;inset:0;background:#000;display:flex;justify-content:center;align-items:center;z-index:10000;transition:opacity 1s ease;cursor:pointer;">
                    <p style="color:#fff;font-size:1.5rem;animation: pulse 2s infinite;">Click to Enter Aethelgard</p>
                </div>

                <p id="story-text" style="position:relative;z-index:1;color:#fff;font-size:1.5rem;line-height:2;max-width:800px;text-align:center;text-shadow: 3px 3px 6px #000;opacity:0;transition:opacity 1.5s ease-in-out;padding: 40px;"></p>
                
                <button id="skip-btn" style="position:absolute;bottom:40px;right:40px;background:none;border:none;color:#aaa;font-family:'Press Start 2P', monospace;font-size:0.8rem;cursor:pointer;z-index:2;display:none;">Press Space or Click to Skip</button>
            </div>
            <style>
                @keyframes pulse { 0% {opacity:0.5;} 50% {opacity:1;} 100% {opacity:0.5;} }
            </style>
        `;
        
        const overlay = document.getElementById('start-overlay');
        overlay.addEventListener('click', () => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.style.display = 'none';
                document.getElementById('skip-btn').style.display = 'block';
                this.startIntro();
            }, 1000);
        });
    }

    startIntro() {
        // Initialize Audio
        this.audio.init();
        this.audio.playIntroMusic();

        // Fade in background image
        const bg = document.getElementById('story-bg');
        if (bg) {
            bg.src = 'intro_peace.png';
            bg.style.opacity = '0.5';
        }

        this.textEl = document.getElementById('story-text');
        this.boundNext = this.next.bind(this);
        
        window.addEventListener('keydown', this.boundNext);
        document.getElementById('story-screen').addEventListener('click', (e) => {
            if (e.target.id !== 'start-overlay') this.next(e);
        });
        
        setTimeout(() => this.showNextLine(), 500);
    }

    showNextLine() {
        if (this.currentLine >= this.lines.length) {
            this.finish();
            return;
        }

        this.textEl.style.opacity = '0';
        const bg = document.getElementById('story-bg');
        if (bg && this.currentLine === 1) { // Transition on line 1
            bg.style.opacity = '0';
        }
        
        this.fadeTimeout = setTimeout(() => {
            this.textEl.innerText = this.lines[this.currentLine];
            this.textEl.style.opacity = '1';
            
            if (bg) {
                if (this.currentLine === 1) bg.src = 'intro_bg.png';
                bg.style.opacity = '0.5';
            }
            
            // Auto advance after 4.5 seconds
            this.timeout = setTimeout(() => {
                this.currentLine++;
                this.showNextLine();
            }, 4500);
        }, 1500); // Wait for fade out
    }

    next(e) {
        if (e && e.type === 'keydown' && e.code !== 'Space' && e.code !== 'Enter') return;
        
        clearTimeout(this.timeout);
        clearTimeout(this.fadeTimeout);
        this.currentLine++;
        if (this.currentLine >= this.lines.length) {
            this.finish();
        } else {
            // Force quick transition when skipping
            this.textEl.style.transition = 'none';
            this.textEl.style.opacity = '0';
            setTimeout(() => {
                this.textEl.style.transition = 'opacity 1.5s ease-in-out';
                this.showNextLine();
            }, 50);
        }
    }

    finish() {
        if (this.finished) return;
        this.finished = true;
        
        window.removeEventListener('keydown', this.boundNext);
        
        // Stop audio
        if (this.audio && this.audio.ctx) {
            this.audio.ctx.suspend();
        }
        
        const screen = document.getElementById('story-screen');
        if (screen) {
            screen.style.opacity = '0';
            setTimeout(() => {
                this.container.innerHTML = '';
                this.onComplete();
            }, 1000);
        } else {
            this.onComplete();
        }
    }
}
