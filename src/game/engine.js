import { TileMap } from './map.js';
import { Player } from './player.js';
import { CombatSystem } from './combat.js';
import { ShopSystem } from './shop.js';
import { AudioSystem } from './audio.js';
import { showModal, showConfirm } from '../ui/modal.js';

export class Game {
    constructor(canvas, uiLayer, charClass) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.uiLayer = uiLayer;
        
        this.state = 'MENU'; // MENU, WORLD, BATTLE, SHOP
        this.player = new Player(39, 40, charClass); 
        this.map = new TileMap(this.player.stats.worldId || 1);
        this.combat = new CombatSystem(this.player, this.uiLayer);
        this.shop = new ShopSystem(this.player, this.uiLayer);
        this.audio = new AudioSystem();
        
        this.lastTime = 0;
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.keys = {};
        window.addEventListener('keydown', (e) => this.keys[e.code] = true);
        window.addEventListener('keyup', (e) => this.keys[e.code] = false);

        window.addEventListener('battleEnd', () => {
            this.state = 'WORLD';
            this.audio.playWorldMusic();
            this.keys = {}; // Clear inputs to prevent frozen keys after alert()
            this.updateHUD();
            this.player.save();
        });

        window.addEventListener('shopExit', () => {
            this.state = 'WORLD';
            this.updateHUD();
            this.player.save();
        });

        this.updateHUD();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;

        this.update(deltaTime);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(deltaTime) {
        if (this.state === 'WORLD') {
            this.player.stats.timePlayed += (deltaTime / 1000);
            this.player.update(this.keys, this.map, deltaTime);
            
            if (this.player.moved) {
                this.updateHUD();
                const tileType = this.map.data[this.player.y][this.player.x];
                
                // 7 = Boss Tile
                if (tileType === 7 && !this.player.stats.dragonDefeated) {
                    this.state = 'BATTLE';
                    this.combat.initBattle('dragon', this.player.stats.worldId);
                    return;
                }
                
                if (tileType === 6) {
                    if (!this.player.stats.dragonDefeated) {
                        showModal("A fearsome aura seals this gate.\nSlay the guardian first!", () => {
                            this.player.x -= 1;
                            this.player.realX = this.player.x;
                        });
                    } else if (this.player.stats.worldId === 6) {
                        showModal("🏆 YOU CONQUERED AETHELGARD!\n\nYou have freed the realm from darkness.\n\nThank you, Champion.", () => {
                            this.player.x -= 1;
                            this.player.realX = this.player.x;
                        });
                    } else {
                        showConfirm(
                            `Travel to the next Dimension?\nYou cannot return!`,
                            () => {
                                this.player.stats.worldId++;
                                this.player.stats.dragonDefeated = false;
                                this.map = new TileMap(this.player.stats.worldId);
                                this.player.x = 5; this.player.y = 5;
                                this.player.realX = 5; this.player.realY = 5;
                                this.player.save();
                                this.updateHUD();
                            },
                            () => {
                                this.player.x -= 1;
                                this.player.realX = this.player.x;
                            }
                        );
                    }
                    return;
                }

                // Boss Proximity Hint
                const distToBoss = Math.abs(this.player.x - 40) + Math.abs(this.player.y - 40);
                if (distToBoss < 5 && !this.player.stats.dragonDefeated) {
                    const recLevels = [0, 5, 12, 22, 32, 42, 50];
                    const rec = recLevels[this.player.stats.worldId] || 1;
                    if (this.player.stats.level < rec) {
                        console.log(`%c WARNING: Recommended Level for this Boss: ${rec}`, 'color: #ef4444; font-weight: bold;');
                    }
                }

                if (tileType === 2) {
                    this.startShop();
                } else if (tileType !== 2 && tileType !== 3 && tileType !== 5 && tileType !== 6 && tileType !== 7) {
                    // Random encounters exclude town spaces, boss, and teleporters
                    if (Math.random() < 0.15) {
                        this.startBattle();
                    }
                }
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'WORLD' || this.state === 'BATTLE') {
            this.map.render(this.ctx, this.player, this.state);
            this.player.render(this.ctx, this.state);
            if (this.state === 'BATTLE') {
                this.combat.render(this.ctx);
            }
        }
    }

    startBattle() {
        console.log("Battle started!");
        this.state = 'BATTLE';
        this.audio.playBattleMusic();
        this.combat.initBattle();
    }

    startShop() {
        console.log("Welcome to the Shop!");
        this.state = 'SHOP';
        this.shop.renderShop(this.player.stats.worldId || 1);
    }

    updateHUD() {
        if (this.state === 'WORLD') {
            const h = this.player.stats;
            this.uiLayer.innerHTML = `
                <div class="hud glass-panel">
                    <button id="mute-btn" style="position:absolute; top: 10px; right: 10px; background:none; border:none; color:white; cursor:pointer; font-size:1.2rem;">${this.audio.isMuted ? '🔇' : '🔊'}</button>
                    <h3>Hero (Lvl ${h.level})</h3>
                    <p style="margin: 4px 0; font-size: 0.8em; color: #fbbf24;">Gold: ${h.gold} | World: ${h.worldId}</p>
                    <div class="stat-bar"><div class="stat-fill hp-fill" style="width:${(h.hp/h.maxHp)*100}%"></div></div>
                    <div class="stat-bar"><div class="stat-fill mp-fill" style="width:${(h.mp/h.maxMp)*100}%"></div></div>
                    <div class="stat-bar" style="height: 4px; background: rgba(0,0,0,0.5);">
                        <div class="stat-fill" style="background: #a855f7; width:${(h.exp/h.expToNext)*100}%"></div>
                    </div>
                </div>
            `;
            document.getElementById('mute-btn').onclick = (e) => {
                e.stopPropagation();
                this.audio.toggleMute();
                this.updateHUD();
            };
        }
    }
}
