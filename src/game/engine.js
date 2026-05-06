import { TileMap } from './map.js';
import { Player } from './player.js';
import { CombatSystem } from './combat.js';
import { ShopSystem } from './shop.js';
import { SkillTree } from '../ui/skill-tree.js';
import { AudioSystem } from './audio.js';
import { showModal, showConfirm } from '../ui/modal.js';

import { getWeaponSVG } from '../ui/weapon-icons.js';

export class Game {
    constructor(canvas, uiLayer, charClass) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.uiLayer = uiLayer;
        
        this.state = 'MENU'; // MENU, WORLD, BATTLE, SHOP
        this.player = new Player(10, 10, charClass); 
        this.map = new TileMap(this.player.stats.worldId || 1);
        this.combat = new CombatSystem(this.player, this.uiLayer);
        this.shop = new ShopSystem(this.player, this.uiLayer);
        this.skills = new SkillTree(this.player, this.uiLayer, () => {
            this.state = 'WORLD';
            this.skills.destroy();
            this.updateHUD();
        });
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
        this.player.updateAnimation(deltaTime);
        
        if (this.state === 'WORLD') {
            this.player.stats.timePlayed += (deltaTime / 1000);
            
            if (this.keys['KeyK']) {
                this.state = 'SKILL_TREE';
                this.skills.render();
                return;
            }

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
                            this.player.revertMove();
                        });
                    } else if (this.player.stats.worldId === 6) {
                        showModal("🏆 YOU CONQUERED AETHELGARD!\n\nYou have freed the realm from darkness.\n\nThank you, Champion.", () => {
                            this.player.revertMove();
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
                                this.player.revertMove();
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
                } else if (tileType === 8) {
                    this.openChest();
                } else if (tileType !== 2 && tileType !== 3 && tileType !== 5 && tileType !== 6 && tileType !== 7 && tileType !== 8) {
                    // Random encounters exclude town spaces, boss, teleporters and chests
                    if (Math.random() < 0.08) {
                        this.startBattle();
                    }
                }
            }
        } else if (this.state === 'BATTLE') {
            this.combat.update(deltaTime);
        }
    }

    openChest() {
        // Remove chest from map immediately
        const x = this.player.x;
        const y = this.player.y;
        this.map.data[y][x] = 0; // Back to grass/floor
        
        const worldId = this.player.stats.worldId;
        const masteries = this.player.stats.masteries;
        const roll = Math.random();
        
        // Strategy: Masteries increase the quality/odds of loot
        const discoveryBonus = masteries.guardian * 0.02 + masteries.slayer * 0.01;
        
        let lootType = 'GOLD';
        if (roll < (0.30 + discoveryBonus)) lootType = 'WEAPON';
        else if (roll < (0.60 + discoveryBonus)) lootType = 'EXP';
        
        if (lootType === 'WEAPON') {
            const rarities = [
                { name: 'Common', color: '#94a3b8', weight: 60 },
                { name: 'Rare', color: '#60a5fa', weight: 25 },
                { name: 'Epic', color: '#a855f7', weight: 10 },
                { name: 'Legendary', color: '#fbbf24', weight: 5 }
            ];

            // Better luck with higher Slayer/Guardian levels and World Tier
            const luckScore = discoveryBonus * 100 + (worldId * 2);
            let rRoll = Math.random() * 100 - luckScore;
            
            let rarity = rarities[0];
            let cumulative = 0;
            // Iterate weights
            for (const r of rarities) {
                cumulative += r.weight;
                if (rRoll <= cumulative) {
                    rarity = r;
                    break;
                }
            }
            // Ensure we don't pick common if we roll very high
            if (rRoll > 100) rarity = rarities[3];

            const weaponsByTier = {
                1: [
                    { id: 'venom_blade', name: 'Venom Blade', effect: 'poison', chance: 0.3, type: 'weapon' },
                    { id: 'sun_piercer', name: 'Sun Piercer', effect: 'burn', chance: 0.2, type: 'weapon' },
                    { id: 'life_drinker', name: 'Life Drinker', effect: 'lifesteal', value: 0.15, type: 'weapon' }
                ],
                2: [
                    { id: 'frost_axe', name: 'Frost Axe', effect: 'stun', chance: 0.25, type: 'weapon' },
                    { id: 'blood_sabers', name: 'Blood Sabers', effect: 'bleed_crit', type: 'weapon' },
                    { id: 'executioner', name: 'Executioner', effect: 'execute', value: 0.5, type: 'weapon' }
                ],
                3: [
                    { id: 'void_reaver', name: 'Void Reaver', effect: 'weakness', chance: 0.5, type: 'weapon' },
                    { id: 'celestial_claymore', name: 'Celestial Claymore', effect: 'holy', chance: 0.15, type: 'weapon' },
                    { id: 'eternity_blade', name: 'Eternity Blade', effect: 'buff_duration', value: 2, type: 'weapon' }
                ]
            };
            
            const tier = Math.min(3, Math.ceil(worldId / 2));
            const pool = weaponsByTier[tier];
            const baseWeapon = pool[Math.floor(Math.random() * pool.length)];
            
            // Apply rarity modifiers
            const found = { ...baseWeapon, rarity: rarity.name };
            if (rarity.name === 'Rare') found.name = `Refined ${found.name}`;
            if (rarity.name === 'Epic') found.name = `Exalted ${found.name}`;
            if (rarity.name === 'Legendary') found.name = `GOD-SLAYER ${found.name}`;

            const weaponIcon = getWeaponSVG(found.id, rarity.color);

            showModal(`
                <div style="display: flex; flex-direction: column; align-items: center; gap: 4px;">
                    <div style="transform: scale(1.2);">${weaponIcon}</div>
                    <div style="color: ${rarity.color}; font-family: var(--font-pixel); font-size: 0.7rem;">${rarity.name.toUpperCase()}</div>
                    <div style="font-family: var(--font-heading); font-size: 1.2rem; color: #1e293b;">${found.name}</div>
                    <div style="font-size: 0.8rem; color: #64748b;">${found.effect.toUpperCase()}</div>
                </div>
            `, () => {
                this.player.stats.weapon = found;
                this.player.save();
                this.updateHUD();
            });
        } else if (lootType === 'EXP') {
            const amount = 25 * worldId + (masteries.arcane * 5);
            showModal(`🎁 CHEST OPENED!\n\nYou found ${amount} Experience Points!`, () => {
                this.player.addExp(amount);
                this.player.save();
                this.updateHUD();
            });
        } else {
            const amount = 50 * worldId + Math.floor(Math.random() * 100);
            showModal(`🎁 CHEST OPENED!\n\nYou found ${amount} Gold!`, () => {
                this.player.addGold(amount);
                this.player.save();
                this.updateHUD();
            });
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
        this.combat.initBattle('random', this.player.stats.worldId || 1);
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
                <div class="hud glass-panel" style="padding: 15px; max-width: 280px;">
                    <button id="mute-btn" style="position:absolute; top: 10px; right: 10px; background:none; border:none; color:var(--gold-accent); cursor:pointer; font-size:1.2rem; transition: transform 0.2s;">${this.audio.isMuted ? '🔇' : '🔊'}</button>
                    <h3 style="color: var(--gold-accent); margin-bottom: 8px; font-size: 1.1rem; border-bottom: 2px solid rgba(251,191,36,0.3); padding-bottom: 4px;">${h.charClass.toUpperCase()} (LVL ${h.level})</h3>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-family: var(--font-heading); font-size: 0.85rem; font-weight: bold;">
                        <span style="color: var(--gold-accent);">💰 ${h.gold} GOLD</span>
                        <span style="color: #94a3b8;">🌍 WORLD ${h.worldId}</span>
                    </div>
                    ${h.skillPoints > 0 ? `<div style="text-align: center; color: #4ade80; font-family: var(--font-heading); font-size: 0.7rem; margin-bottom: 8px; font-weight: bold; animation: pulse 1s infinite;">★ ${h.skillPoints} MASTERY POINTS [K] ★</div>` : ''}
                    
                    <div class="stat-bar" style="margin-bottom: 6px;">
                        <div class="stat-fill hp-fill" style="width:${(h.hp/h.maxHp)*100}%"></div>
                        <div class="stat-label" style="font-size: 0.8rem;">HEALTH: ${h.hp} / ${h.maxHp}</div>
                    </div>
                    <div class="stat-bar" style="margin-bottom: 8px;">
                        <div class="stat-fill mp-fill" style="width:${(h.mp/h.maxMp)*100}%"></div>
                        <div class="stat-label" style="font-size: 0.8rem;">MANA: ${h.mp} / ${h.maxMp}</div>
                    </div>
                    <div class="stat-bar" style="height: 12px; background: #0f172a; border-radius: 0; margin-top: 5px; border-width: 2px;">
                        <div class="stat-fill" style="background: linear-gradient(90deg, #a855f7, #6366f1); width:${(h.exp/h.expToNext)*100}%"></div>
                        <div class="stat-label" style="font-size: 0.7rem; line-height: 12px;">EXP: ${h.exp} / ${h.expToNext}</div>
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
