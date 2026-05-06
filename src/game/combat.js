import { showModal } from '../ui/modal.js';
export class CombatSystem {
    constructor(player, uiLayer) {
        this.player = player;
        this.uiLayer = uiLayer;
        this.active = false;
        this.enemy = null;
        this.turn = 'PLAYER'; // PLAYER OR ENEMY
        this.activeEffect = null;
        
        this.enemyImg = new Image();
        this.enemyImg.src = 'enemy.png';
        this.dragonImg = new Image();
        this.dragonImg.src = 'dragon.png';

        this.playerEffects = [];
        this.enemyEffects = [];

        // --- Orc sprite cache ---
        const load = src => { const img = new Image(); img.src = src; return img; };
        this.orcSprites = {
            idle:   load('orc-idle.png'),
            walk:   load('orc-walk.png'),
            attack: load('orc-attack.png'),
            hurt:   load('orc-hurt.png'),
            death:  load('orc-death.png'),
        };

        this.golemImg = new Image();
        this.golemImg.src = 'sprite-64x64px.png';

        // Enemy animation state
        this.enemyAnimState = 'idle';
        this.enemyAnimStateTimer = 0;
    }

    initBattle(encounterType = 'random', worldId = 1) {
        this.active = true;
        this.encounterType = encounterType;
        this.escapeChance = 40;
        this.floatingNumbers = [];
        this.playerEffects = [];
        this.enemyEffects = [];
        this.enemyAnimState = 'idle';
        this.enemyAnimStateTimer = 0;
        
        let config;
        
        if (encounterType === 'dragon') {
            if (worldId === 1) config = { name: "Stone Guardian Behemoth", hp: 500, maxHp: 500, atk: 40, def: 20, type: "golem", drop: { name: 'Guardian Plate', def: 10, chance: 100 } };
            if (worldId === 2) config = { name: "Inferno Phoenix", hp: 800, maxHp: 800, atk: 55, def: 15, type: "phoenix", drop: { name: 'Ashen Cloak', def: 25, chance: 100 } };
            if (worldId === 3) config = { name: "Crystal Hydra", hp: 1200, maxHp: 1200, atk: 70, def: 30, type: "hydra", drop: { name: 'Hydra Scale', def: 50, chance: 100 } };
            if (worldId === 4) config = { name: "Nether Fiend", hp: 2000, maxHp: 2000, atk: 110, def: 45, type: "demon", drop: { name: 'Nether Mantle', def: 120, chance: 100 } };
            if (worldId === 5) config = { name: "Celestial Dragon", hp: 5000, maxHp: 5000, atk: 200, def: 80, type: "dragon", drop: { name: 'Celestial Aegis', def: 300, chance: 100 } };
            if (worldId === 6) config = { name: "Void Watcher", hp: 10000, maxHp: 10000, atk: 300, def: 150, type: "watcher", drop: { name: 'Eternity Crown', def: 600, chance: 100 } };
        } else {
            let pool = [];
            if (worldId === 1) {
                pool = [
                    { name: "Slime", hp: 30, maxHp: 30, atk: 6, def: 2, type: "slime", drop: { name: 'Leather Armor', def: 5, chance: 10 } },
                    { name: "Skeleton", hp: 60, maxHp: 60, atk: 12, def: 5, type: "skeleton", drop: { name: 'Leather Armor', def: 5, chance: 15 } },
                    { name: "Orc Raider", hp: 120, maxHp: 120, atk: 18, def: 8, type: "orc", drop: { name: 'Iron Armor', def: 15, chance: 8 } }
                ];
            } else if (worldId === 2) {
                pool = [
                    { name: "Ash Wraith", hp: 150, maxHp: 150, atk: 25, def: 8, type: "ash_wraith", drop: { name: 'Iron Armor', def: 15, chance: 10 } },
                    { name: "Lava Golem", hp: 300, maxHp: 300, atk: 15, def: 25, type: "lava_golem", drop: { name: 'Steel Armor', def: 30, chance: 5 } },
                    { name: "Hellhound", hp: 180, maxHp: 180, atk: 35, def: 5, type: "hellhound", drop: { name: 'Iron Armor', def: 15, chance: 15 } }
                ];
            } else if (worldId === 3) {
                pool = [
                    { name: "Frost Sprite", hp: 200, maxHp: 200, atk: 40, def: 10, type: "slime", drop: { name: 'Steel Armor', def: 30, chance: 10 } },
                    { name: "Ice Troll", hp: 400, maxHp: 400, atk: 30, def: 20, type: "demon", drop: { name: 'Steel Armor', def: 30, chance: 15 } },
                    { name: "Yeti", hp: 500, maxHp: 500, atk: 45, def: 15, type: "skeleton", drop: { name: 'Obsidian Armor', def: 80, chance: 5 } }
                ];
            } else if (worldId === 4) {
                pool = [
                    { name: "Shadow Stalker", hp: 800, maxHp: 800, atk: 80, def: 35, type: "skeleton", drop: { name: 'Obsidian Armor', def: 80, chance: 10 } },
                    { name: "Void Horror", hp: 1200, maxHp: 1200, atk: 65, def: 55, type: "slime", drop: { name: 'Obsidian Armor', def: 80, chance: 15 } },
                    { name: "Soul Eater", hp: 1000, maxHp: 1000, atk: 100, def: 40, type: "demon", drop: { name: 'Divine Armor', def: 200, chance: 2 } }
                ];
            } else if (worldId === 5) {
                pool = [
                    { name: "Seraph", hp: 1500, maxHp: 1500, atk: 130, def: 60, type: "skeleton", drop: { name: 'Divine Armor', def: 200, chance: 10 } },
                    { name: "Archon", hp: 2200, maxHp: 2200, atk: 120, def: 90, type: "demon", drop: { name: 'Divine Armor', def: 200, chance: 15 } },
                    { name: "Light Bearer", hp: 1800, maxHp: 1800, atk: 160, def: 50, type: "slime", drop: { name: 'Divine Armor', def: 200, chance: 20 } }
                ];
            } else if (worldId === 6) {
                pool = [
                    { name: "Void Minion", hp: 3000, maxHp: 3000, atk: 200, def: 150, type: "slime", drop: { name: 'Eternity Armor', def: 500, chance: 10 } },
                    { name: "Void Knight", hp: 4000, maxHp: 4000, atk: 180, def: 200, type: "skeleton", drop: { name: 'Eternity Armor', def: 500, chance: 15 } },
                    { name: "Void Terror", hp: 5000, maxHp: 5000, atk: 250, def: 100, type: "demon", drop: { name: 'Eternity Armor', def: 500, chance: 20 } }
                ];
            }
            config = pool[Math.floor(Math.random() * pool.length)];
        }
        
        this.enemy = {
            ...config,
            x: window.innerWidth * 0.7,
            y: window.innerHeight * 0.4
        };
        this.renderMenu();
    }

    render(ctx) {
        if (!this.active || !this.enemy) return;

        const bounce = Math.sin(Date.now() / 200) * 10;
        ctx.save();
        ctx.translate(this.enemy.x, this.enemy.y + bounce);
        
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(0, 50, 60, 20, 0, 0, Math.PI * 2);
        ctx.fill();

        const s = 4; // Pixel scale
        
        if (this.enemy.type === "orc") {
            this._renderOrcSprite(ctx, false);
        } else if (this.enemy.type === "demon") {
            const isIceTroll = this.enemy.name === "Ice Troll";
            if (isIceTroll) {
                // Glacier Behemoth (Ice Troll - Lava Golem Style)
                const time = Date.now() / 1000;
                
                // Staggered Ice Slabs (Main Body)
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#3b82f6';
                ctx.fillRect(-12*s, -12*s, 24*s, 24*s); // Main slab
                ctx.fillStyle = '#60a5fa';
                ctx.fillRect(-15*s, -5*s, 10*s, 15*s);  // Side slab left
                ctx.fillRect(5*s, -8*s, 12*s, 12*s);   // Side slab right
                
                // Internal White Glow (The "Lava Golem" Core)
                const pulse = (Math.sin(time * 3) + 1) / 2;
                ctx.globalAlpha = 1.0;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + pulse * 0.5})`;
                ctx.fillRect(-6*s, -6*s, 12*s, 12*s);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-2*s, -2*s, 4*s, 4*s);

                // Embedded Stone Armor
                ctx.fillStyle = '#1c1917';
                ctx.fillRect(-14*s, -14*s, 6*s, 6*s); // Shoulder plate
                ctx.fillRect(8*s, -10*s, 5*s, 5*s);

                // Head (Recessed Crystal)
                ctx.fillStyle = '#1d4ed8';
                ctx.fillRect(-5*s, -18*s, 10*s, 8*s);
                ctx.fillStyle = '#ffffff'; // Tiny glowing eyes
                ctx.fillRect(-3*s, -16*s, 2*s, 2*s);
                ctx.fillRect(1*s, -16*s, 2*s, 2*s);

                // Falling Icicle Shards (The "Lava Drips")
                ctx.fillStyle = '#bae6fd';
                for(let i=0; i<3; i++) {
                    const dropY = ((time * 0.8 + i * 0.3) % 1) * 30*s;
                    ctx.beginPath();
                    ctx.moveTo(-10*s + i*10*s, -5*s + dropY);
                    ctx.lineTo(-8*s + i*10*s, 5*s + dropY);
                    ctx.lineTo(-12*s + i*10*s, 5*s + dropY);
                    ctx.fill();
                }

                // Massive Ice Hammer
                ctx.save();
                ctx.rotate(Math.sin(time*1.5)*0.08);
                ctx.fillStyle = '#44403c'; // Handle
                ctx.fillRect(16*s, -10*s, 4*s, 30*s);
                ctx.fillStyle = '#38bdf8'; // Hammer Head (Translucent)
                ctx.globalAlpha = 0.7;
                ctx.fillRect(12*s, -22*s, 12*s, 12*s);
                ctx.restore();

            } else {
                // Standard Demon
                ctx.fillStyle = '#991b1b';
                ctx.fillRect(-8*s, -8*s, 16*s, 16*s);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(-6*s, 0, 12*s, 8*s);
                ctx.fillStyle = '#b91c1c';
                ctx.fillRect(-6*s, -14*s, 12*s, 6*s);
                ctx.fillStyle = '#fde047';
                ctx.fillRect(-8*s, -16*s, 2*s, 6*s);
                ctx.fillRect(-10*s, -18*s, 2*s, 4*s);
                ctx.fillRect(6*s, -16*s, 2*s, 6*s);
                ctx.fillRect(8*s, -18*s, 2*s, 4*s);
                ctx.fillStyle = '#facc15';
                ctx.fillRect(-4*s, -12*s, 2*s, 2*s);
                ctx.fillRect(2*s, -12*s, 2*s, 2*s);
                ctx.fillStyle = '#171717';
                ctx.fillRect(-4*s, -10*s, 8*s, 2*s);
                ctx.fillStyle = '#451a03';
                ctx.fillRect(-12*s, -8*s, 4*s, 6*s);
                ctx.fillRect(8*s, -8*s, 4*s, 6*s);
                ctx.fillStyle = '#991b1b';
                ctx.fillRect(-10*s, -2*s, 2*s, 8*s);
                ctx.fillRect(8*s, -2*s, 2*s, 8*s);
                ctx.fillStyle = '#d4d4d8';
                ctx.fillRect(-16*s, -12*s, 4*s, 20*s);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(-16*s, -12*s, 4*s, 4*s);
                ctx.fillStyle = '#27272a';
                ctx.fillRect(-18*s, 8*s, 8*s, 2*s);
                ctx.fillRect(-16*s, 10*s, 4*s, 4*s);
            }
        } else if (this.enemy.type === "slime") {
            const isFrostSprite = this.enemy.name === "Frost Sprite";
            if (isFrostSprite) {
                // Crystalline Eye (Frost Sprite - Lava Golem Style)
                const time = Date.now() / 1000;
                const bob = Math.sin(time * 3) * 8;
                
                ctx.save();
                ctx.translate(0, bob);
                
                // Diamond Casing (Main Body)
                ctx.fillStyle = '#0ea5e9';
                ctx.beginPath();
                ctx.moveTo(0, -12*s); ctx.lineTo(-10*s, 0); ctx.lineTo(0, 12*s); ctx.lineTo(10*s, 0);
                ctx.closePath();
                ctx.fill();
                
                // Pulsing Iris (The Core)
                const eyePulse = (Math.sin(time * 4) + 1) / 2;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + eyePulse * 0.6})`;
                ctx.fillRect(-4*s, -4*s, 8*s, 8*s);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-1.5*s, -1.5*s, 3*s, 3*s);

                // Orbiting Shards
                for(let i=0; i<3; i++) {
                    const angle = time * 3 + (i * Math.PI * 2 / 3);
                    const ox = Math.cos(angle) * 18*s;
                    const oy = Math.sin(angle) * 6*s;
                    ctx.fillStyle = '#bae6fd';
                    ctx.fillRect(ox - 2*s, oy - 2*s, 4*s, 4*s);
                }

                // Shimmering Frost Dust (Trailing Particles)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                for(let i=0; i<5; i++) {
                    const tx = Math.sin(time*5 + i)*15*s;
                    const ty = ((time*6 + i*4) % 40);
                    ctx.fillRect(tx, ty, 3, 3);
                }
                
                ctx.restore();
            } else {
                // Standard Slime
                ctx.fillStyle = '#22c55e';
                ctx.fillRect(-10*s, -2*s, 20*s, 10*s);
                ctx.fillRect(-8*s, -6*s, 16*s, 4*s);
                ctx.fillRect(-4*s, -8*s, 8*s, 2*s);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-6*s, -2*s, 2*s, 2*s);
                ctx.fillRect(4*s, -2*s, 2*s, 2*s);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-6*s, -4*s, 2*s, 2*s);
                ctx.fillRect(4*s, -4*s, 2*s, 2*s);
            }
        } else if (this.enemy.type === "skeleton") {
            if (this.enemy.name === "Yeti") {
                // Yeti (Lava Golem Style: Frost Heart Beast)
                const time = Date.now() / 1000;
                
                // Basalt Skin (Main Torso)
                ctx.fillStyle = '#334155';
                ctx.fillRect(-16*s, -10*s, 32*s, 22*s);
                
                // Pulsing Frost Heart (The "Lava" Core)
                const corePulse = (Math.sin(time * 4) + 1) / 2;
                ctx.fillStyle = `rgba(34, 211, 238, ${0.4 + corePulse * 0.6})`;
                ctx.fillRect(-6*s, -2*s, 12*s, 10*s);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(-2*s, 2*s, 4*s, 4*s);

                // Layered Fur Plates (The "Rock" Detail)
                ctx.fillStyle = '#f8fafc';
                ctx.fillRect(-18*s, -12*s, 36*s, 6*s);  // Shoulder fur
                ctx.fillRect(-14*s, 8*s, 28*s, 6*s);   // Belly fur
                ctx.fillRect(-18*s, -8*s, 6*s, 16*s);  // Left side fur
                ctx.fillRect(12*s, -8*s, 6*s, 16*s);   // Right side fur
                
                // Recessed Head
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(-7*s, -18*s, 14*s, 10*s);
                ctx.fillStyle = '#ffffff'; // Glowing eyes
                ctx.fillRect(-4*s, -14*s, 3*s, 3*s);
                ctx.fillRect(1*s, -14*s, 3*s, 3*s);
                
                // Falling Snow Particles (The "Lava Drips")
                ctx.fillStyle = '#ffffff';
                for(let i=0; i<4; i++) {
                    const snowY = ((time * 0.6 + i * 0.25) % 1) * 30*s;
                    ctx.fillRect(-12*s + i*8*s, -8*s + snowY, 4, 4);
                }

                // Massive Arms
                ctx.fillStyle = '#334155';
                ctx.fillRect(-24*s, -4*s, 8*s, 18*s); // Left arm
                ctx.fillRect(16*s, -4*s, 8*s, 18*s);  // Right arm
                ctx.fillStyle = '#f8fafc'; // Fur tops
                ctx.fillRect(-24*s, -6*s, 8*s, 6*s);
                ctx.fillRect(16*s, -6*s, 8*s, 6*s);

                // Cold Mist (The "Ash" Effect)
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                const mistX = Math.sin(time*2)*5*s;
                ctx.fillRect(mistX - 10*s, -5*s, 20*s, 10*s);

            } else {
                // Standard Skeleton
                ctx.fillStyle = '#e2e8f0';
                ctx.fillRect(-6*s, -16*s, 12*s, 10*s);
                ctx.fillStyle = '#000000';
                ctx.fillRect(-4*s, -14*s, 3*s, 3*s);
                ctx.fillRect(1*s, -14*s, 3*s, 3*s);
                ctx.fillRect(-2*s, -10*s, 4*s, 2*s);
                ctx.fillStyle = '#e2e8f0';
                ctx.fillRect(-4*s, -4*s, 8*s, 8*s);
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(-2*s, -2*s, 4*s, 2*s);
                ctx.fillStyle = '#cbd5e1';
                ctx.fillRect(-8*s, -4*s, 2*s, 10*s);
                ctx.fillRect(6*s, -4*s, 2*s, 10*s);
            }
            
        } else if (this.enemy.type === "golem") {
            // High-Resolution Golem Boss Sprite
            const s = 6; // Adjusted scale for 64x64 sprite
            const size = 64 * s;
            
            // Draw original shadow
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 20*s, 24*s, 8*s, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw the Golem Sprite
            if (this.golemImg.complete && this.golemImg.naturalWidth > 0) {
                ctx.imageSmoothingEnabled = false; // Keep it pixelated
                ctx.drawImage(
                    this.golemImg, 
                    -size / 2, 
                    -size / 2 - 10, // Slight offset up
                    size, 
                    size
                );
            } else {
                // Fallback to a simplified procedural version if image fails to load
                ctx.fillStyle = '#475569';
                ctx.fillRect(-15*s, -15*s, 30*s, 30*s);
                ctx.fillStyle = '#38bdf8';
                ctx.fillRect(-10*s, -5*s, 5*s, 5*s);
                ctx.fillRect(5*s, -5*s, 5*s, 5*s);
            }
        } else if (this.enemy.type === "phoenix") {
            const s = 6;
            
            // Shadow on ground
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.beginPath();
            ctx.ellipse(0, 32*s, 20*s, 6*s, 0, 0, Math.PI * 2);
            ctx.fill();

            // Bobbing animation for flying
            const bob = Math.sin(Date.now() / 300) * 4 * s;
            ctx.translate(0, bob);

            const drawBlock = (x, y, w, h, baseClr, lightClr, darkClr) => {
                ctx.fillStyle = '#450a0a'; // Dark Outline
                ctx.fillRect(x - s, y - s, w + 2*s, h + 2*s);
                ctx.fillStyle = baseClr; // Main color
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = lightClr; // Top/Left Highlight
                ctx.fillRect(x, y, w, 2*s);
                ctx.fillRect(x, y, 2*s, h);
                ctx.fillStyle = darkClr; // Bottom/Right Shadow
                ctx.fillRect(x, y + h - 2*s, w, 2*s);
                ctx.fillRect(x + w - 2*s, y, 2*s, h);
            };

            const redB = '#ef4444'; const redL = '#f87171'; const redD = '#b91c1c';
            const orangeB = '#f97316'; const orangeL = '#fb923c'; const orangeD = '#c2410c';
            const goldB = '#facc15'; const goldL = '#fef08a'; const goldD = '#ca8a04';

            // Tail feathers
            drawBlock(-4*s, 16*s, 8*s, 14*s, redB, redL, redD);
            drawBlock(-12*s, 10*s, 6*s, 16*s, orangeB, orangeL, orangeD);
            drawBlock(6*s, 10*s, 6*s, 16*s, orangeB, orangeL, orangeD);

            // Back wings (inner)
            drawBlock(-24*s, -12*s, 12*s, 16*s, redB, redL, redD);
            drawBlock(12*s, -12*s, 12*s, 16*s, redB, redL, redD);
            
            // Outer wing tips (large spread)
            const wingFlap = Math.sin(Date.now() / 150) * 4 * s; // Quick flap
            drawBlock(-38*s, -20*s + wingFlap, 16*s, 10*s, orangeB, orangeL, orangeD);
            drawBlock(-46*s, -28*s + wingFlap*1.5, 10*s, 8*s, goldB, goldL, goldD);
            
            drawBlock(22*s, -20*s + wingFlap, 16*s, 10*s, orangeB, orangeL, orangeD);
            drawBlock(36*s, -28*s + wingFlap*1.5, 10*s, 8*s, goldB, goldL, goldD);

            // Body
            drawBlock(-14*s, -8*s, 28*s, 24*s, redB, redL, redD);
            
            // Belly (Gold)
            drawBlock(-8*s, 0, 16*s, 14*s, goldB, goldL, goldD);

            // Neck/Head
            drawBlock(-8*s, -20*s, 16*s, 14*s, redB, redL, redD);

            // Beak
            drawBlock(-4*s, -14*s, 8*s, 6*s, goldB, goldL, goldD);
            drawBlock(-2*s, -8*s, 4*s, 4*s, goldB, goldL, goldD); // beak tip

            // Eyes
            ctx.fillStyle = '#450a0a'; // Sockets
            ctx.fillRect(-6*s, -18*s, 4*s, 4*s);
            ctx.fillRect(2*s, -18*s, 4*s, 4*s);
            ctx.fillStyle = '#ffffff'; // White glow
            ctx.fillRect(-5*s, -17*s, 2*s, 2*s);
            ctx.fillRect(3*s, -17*s, 2*s, 2*s);

            // Head crest (flames on head)
            drawBlock(-4*s, -30*s, 8*s, 10*s, goldB, goldL, goldD);
            drawBlock(-10*s, -26*s, 6*s, 8*s, orangeB, orangeL, orangeD);
            drawBlock(4*s, -26*s, 6*s, 8*s, orangeB, orangeL, orangeD);
            
            // Undo bobbing
            ctx.translate(0, -bob);
        } else if (this.enemy.type === "hydra") {
            // High-Fidelity Crystal Hydra (World 3 Boss)
            const time = Date.now() / 1000;
            const s = 6; // Reduced Scale from 8 to 6
            
            // Draw Block Utility (Matching World 2 style)
            const drawBlock = (x, y, w, h, baseClr, lightClr, darkClr) => {
                ctx.fillStyle = baseClr;
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = lightClr;
                ctx.fillRect(x, y, w, 2*s);
                ctx.fillRect(x, y, 2*s, h);
                ctx.fillStyle = darkClr;
                ctx.fillRect(x, y + h - 2*s, w, 2*s);
                ctx.fillRect(x + w - 2*s, y, 2*s, h);
            };

            const blueB = '#2563eb'; const blueL = '#60a5fa'; const blueD = '#1e3a8a';
            const cyanB = '#0891b2'; const cyanL = '#22d3ee'; const cyanD = '#164e63';
            
            // Base Crystal Cluster (Foundation)
            drawBlock(-30*s, 10*s, 60*s, 20*s, blueB, blueL, blueD);
            drawBlock(-20*s, 0, 40*s, 15*s, cyanB, cyanL, cyanD);

            // Glowing Heart (Core)
            const pulse = (Math.sin(time * 3) + 1) / 2;
            ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + pulse * 0.6})`;
            ctx.beginPath();
            ctx.arc(0, 5*s, 10*s, 0, Math.PI * 2);
            ctx.fill();

            // Three Heads
            for (let i = 0; i < 3; i++) {
                const hOffset = (i - 1) * 35 * s;
                const hBob = Math.sin(time * 2 + i * 1.5) * 15;
                const hX = hOffset;
                const hY = -30 * s + hBob;

                // Neck Segments
                for (let j = 0; j < 5; j++) {
                    const nY = -5*s - (j * 6*s) + (hBob * (j/5));
                    const nX = hOffset * (j/5);
                    const nSize = (8 - j) * s;
                    drawBlock(nX - nSize/2, nY, nSize, 6*s, blueB, blueL, blueD);
                }

                // Head
                ctx.save();
                ctx.translate(hX, hY);
                drawBlock(-8*s, -8*s, 16*s, 16*s, cyanB, cyanL, cyanD); // Main Head
                drawBlock(-6*s, 0, 12*s, 10*s, blueB, blueL, blueD);     // Lower Jaw
                
                // Snout
                drawBlock(2*s, -4*s, 14*s, 8*s, cyanB, cyanL, cyanD);
                
                // Eyes
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(4*s, -5*s, 3*s, 3*s);
                
                // Fins/Horns
                ctx.fillStyle = blueL;
                ctx.beginPath();
                ctx.moveTo(-8*s, -8*s); ctx.lineTo(-15*s, -20*s); ctx.lineTo(-2*s, -8*s); ctx.fill();
                
                ctx.restore();
            }

            // Cold Mist / Crystal Dust
            ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for (let i = 0; i < 6; i++) {
                const mx = Math.sin(time * 2 + i) * 40*s;
                const my = 20*s + Math.cos(time + i) * 10*s;
                ctx.fillRect(mx, my, 8, 8);
            }
        } else if (this.enemy.type === "watcher") {
            const s = 10;
            const grid = [
                "        ######        ",
                "      ##PPPPPP##      ",
                "    ##PPPPPPPPPP##    ",
                "   #PPPPEEEEEEPPPP#   ",
                "  #PPPPEEEEEEEEEPPP#  ",
                " #PPPPEECCCCCCEEPPPP# ",
                " #PPPPEECCCCCCCCEPPPP#",
                " #PPPPEECCCCCCCCEPPPP#",
                " #PPPPEECCCCCCEEPPPP# ",
                "  #PPPPEEEEEEEEEPPP#  ",
                "   #PPPPEEEEEEPPPP#   ",
                "    ##PPPPPPPPPP##    ",
                "      ##PPPPPP##      ",
                "        ######        ",
                "    ####VVVVVV####    ",
                "  ##VVVVVVVVVVVVVV##  ",
                " #VVVV##########VVVV# ",
                " #VVV#          #VVV# ",
                "#VVV#            #VVV#",
                "#VV#              #VV#",
                "###                ###",
                "                      "
            ];
            const colors = { 
                '#': '#1e1b4b', 
                'V': '#4c1d95', 
                'E': '#ffffff', 
                'P': '#7e22ce',
                'C': '#000000'
            };
            this.drawPixelSprite(ctx, -11 * s, -22 * s, grid, colors, s);
        } else if (this.enemy.type === "dragon") {
            // High-Resolution Procedural Pixel Art Dragon
            const s = 10; // Pixel size
            
            // Dynamic Palette based on world tier
            let wingClr = '#991b1b';
            let bodyClr = '#b91c1c';
            let bellyClr = '#fef08a';
            let eyeClr = '#facc15';
            let hornClr = '#fef08a';
            
            if (this.enemy.name.includes("Inferno")) {
                wingClr = '#ea580c'; bodyClr = '#450a0a'; bellyClr = '#fb923c'; eyeClr = '#ef4444'; hornClr = '#f97316';
            } else if (this.enemy.name.includes("Crystal")) {
                wingClr = '#38bdf8'; bodyClr = '#f1f5f9'; bellyClr = '#e0f2fe'; eyeClr = '#0284c7'; hornClr = '#0ea5e9';
            } else if (this.enemy.name.includes("Void")) {
                wingClr = '#4c1d95'; bodyClr = '#1e1b4b'; bellyClr = '#a855f7'; eyeClr = '#d8b4fe'; hornClr = '#c084fc';
            } else if (this.enemy.name.includes("Celestial")) {
                wingClr = '#fde68a'; bodyClr = '#fff7ed'; bellyClr = '#ffffff'; eyeClr = '#fbbf24'; hornClr = '#fef3c7';
            }

            const dragonGrid = [
                "                    ######      ",
                "                  ##WWWWWW##    ",
                "    ###          #WWWWWWWWWW#   ",
                "   #HHH##       #WWWWWWWWWWWW#  ",
                "  #HHRRRR#      #WWWWW##WWWWWW# ",
                " #HRRE ER#     #WWWWW#  #WWWWW# ",
                " #RRRTRRRR#    #WWWW#    #WWWW# ",
                " #RRRRRRRRR#  #WWWW#      #WWW# ",
                "  #RRRRRRRRR##WWWW#       #WWW# ",
                "    #RRRRRRRRRWWWW#       #WW#  ",
                "     #RRRRRRRRRRRWW#      #W#   ",
                "     #RRRRRYYYYYYRRW#    #W#    ",
                "     #RRRRYYYYYYYYRRW#  #W#     ",
                "    #RRRRYYYYYYYYYYRRW##W#      ",
                "   #RRRRYYYYYYYYYYYYRRWW#       ",
                "  #RRRRYYYYYYYYYYYYRRRW#        ",
                " #RRRRRYYYYYYYYYYRRRRR#         ",
                "#RRRRRRRRRRRRRRRRRRRR#          ",
                "#RRRRR##RRRRRRRRRRRRR#  ##      ",
                " #RRR#  #RRR##RRRRRRRR##R#      ",
                " #RRR#  #RRR# #RRRRRRRRRR#      ",
                " #RRR#  #RRR#  ##RRRRRR##       ",
                " #####  #####    ######         "
            ];

            const colors = {
                '#': '#1a0d0d', // Outline
                'R': bodyClr,   // Body
                'Y': bellyClr,  // Belly
                'E': eyeClr,    // Eyes
                'W': wingClr,   // Wings
                'H': hornClr,   // Horns
                'T': '#ffffff'  // Teeth
            };

            this.drawPixelSprite(ctx, -14 * s, -22 * s, dragonGrid, colors, s);
        } else if (this.enemy.type === "ash_wraith") {
            // Ash Wraith — ghostly translucent spirit with tattered cloak
            const s = 4;
            ctx.save();
            ctx.globalAlpha = 0.82;

            // Flowing body/robe (tattered bottom)
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(-8*s, 0, 16*s, 14*s);
            ctx.fillStyle = '#64748b';
            ctx.fillRect(-10*s, 8*s, 4*s, 8*s);
            ctx.fillRect(-4*s, 10*s, 4*s, 10*s);
            ctx.fillRect(2*s, 9*s, 4*s, 11*s);
            ctx.fillRect(6*s, 7*s, 4*s, 9*s);

            // Upper body
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(-6*s, -6*s, 12*s, 8*s);

            // Head (floating, slightly above)
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-5*s, -16*s, 10*s, 10*s);

            // Hood shadow
            ctx.fillStyle = '#475569';
            ctx.fillRect(-5*s, -16*s, 10*s, 3*s);
            ctx.fillRect(-5*s, -13*s, 2*s, 3*s);
            ctx.fillRect(3*s, -13*s, 2*s, 3*s);

            // Glowing eyes
            ctx.fillStyle = '#7dd3fc';
            ctx.fillRect(-3*s, -13*s, 2*s, 2*s);
            ctx.fillRect(1*s, -13*s, 2*s, 2*s);
            ctx.fillStyle = '#bae6fd'; // Bright inner
            ctx.fillRect(-3*s, -13*s, 1*s, 1*s);
            ctx.fillRect(2*s, -13*s, 1*s, 1*s);

            // Wispy arms
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(-12*s, -4*s, 4*s, 6*s);
            ctx.fillRect(-14*s, 0, 2*s, 4*s);
            ctx.fillRect(8*s, -4*s, 4*s, 6*s);
            ctx.fillRect(12*s, 0, 2*s, 4*s);

            // Soul particles floating around
            const time = Date.now() / 400;
            ctx.fillStyle = 'rgba(186, 230, 253, 0.7)';
            for (let i = 0; i < 5; i++) {
                const px = Math.sin(time + i * 1.2) * 22*s;
                const py = Math.cos(time * 0.7 + i * 0.9) * 12*s - 5*s;
                ctx.beginPath();
                ctx.arc(px, py, s * 0.8, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

        } else if (this.enemy.type === "lava_golem") {
            // Lava Golem — hulking molten rock creature
            const s = 5;

            const drawBlock = (x, y, w, h, base, light, dark) => {
                ctx.fillStyle = '#1a0a00';
                ctx.fillRect(x - s, y - s, w + 2*s, h + 2*s);
                ctx.fillStyle = base;
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = light;
                ctx.fillRect(x, y, w, 2*s);
                ctx.fillRect(x, y, 2*s, h);
                ctx.fillStyle = dark;
                ctx.fillRect(x, y + h - 2*s, w, 2*s);
                ctx.fillRect(x + w - 2*s, y, 2*s, h);
            };

            const rockBase = '#44403c'; const rockLight = '#78716c'; const rockDark = '#292524';
            const lavaBase = '#f97316'; const lavaLight = '#fed7aa'; const lavaDark = '#c2410c';

            // Legs
            drawBlock(-10*s, 16*s, 8*s, 10*s, rockBase, rockLight, rockDark);
            drawBlock(2*s,   16*s, 8*s, 10*s, rockBase, rockLight, rockDark);
            // Lava cracks on legs
            ctx.fillStyle = lavaBase;
            ctx.fillRect(-8*s, 20*s, 2*s, 4*s);
            ctx.fillRect(4*s, 18*s, 1*s, 6*s);

            // Torso
            drawBlock(-14*s, -6*s, 28*s, 22*s, rockBase, rockLight, rockDark);

            // Lava chest glow / cracks
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-6*s, 2*s, 12*s, 8*s);
            ctx.fillStyle = lavaBase;
            ctx.fillRect(-4*s, 4*s, 8*s, 4*s);
            ctx.fillStyle = lavaLight;
            ctx.fillRect(-2*s, 5*s, 4*s, 2*s);

            // Arms
            drawBlock(-26*s, -10*s, 12*s, 18*s, rockBase, rockLight, rockDark);
            drawBlock(14*s, -10*s, 12*s, 18*s, rockBase, rockLight, rockDark);
            // Fists
            drawBlock(-28*s, 6*s, 14*s, 14*s, rockBase, rockLight, rockDark);
            drawBlock(14*s, 6*s, 14*s, 14*s, rockBase, rockLight, rockDark);

            // Lava on arms
            ctx.fillStyle = lavaBase;
            ctx.fillRect(-24*s, -4*s, 4*s, 2*s);
            ctx.fillRect(18*s, 0, 4*s, 2*s);

            // Head
            drawBlock(-12*s, -22*s, 24*s, 16*s, rockBase, rockLight, rockDark);

            // Glowing lava eyes
            ctx.fillStyle = '#1a0a00';
            ctx.fillRect(-8*s, -18*s, 6*s, 4*s);
            ctx.fillRect(2*s, -18*s, 6*s, 4*s);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(-7*s, -17*s, 4*s, 2*s);
            ctx.fillRect(3*s, -17*s, 4*s, 2*s);
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(-6*s, -17*s, 2*s, 1*s);
            ctx.fillRect(4*s, -17*s, 2*s, 1*s);

            // Lava drips (animated)
            const drip = Math.sin(Date.now() / 300) * 2*s;
            ctx.fillStyle = lavaBase;
            ctx.fillRect(-2*s, 14*s, 2*s, 4*s + drip);
            ctx.fillRect(6*s, 12*s, 2*s, 3*s + drip * 0.6);
            ctx.fillRect(-8*s, 13*s, 2*s, 2*s + drip * 1.2);

        } else if (this.enemy.type === "hellhound") {
            // Hellhound — dark demonic four-legged hound with fire eyes
            const s = 4;

            const drawBlock = (x, y, w, h, clr) => {
                ctx.fillStyle = '#0f0000';
                ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
                ctx.fillStyle = clr;
                ctx.fillRect(x, y, w, h);
            };

            const body = '#292524'; const bodyMid = '#44403c'; const bodyLight = '#57534e';
            const fireClr = '#f97316'; const fireHot = '#fef08a';

            // Tail (curved, angled up)
            drawBlock(10*s, -8*s, 2*s, 10*s, bodyMid);
            drawBlock(11*s, -14*s, 2*s, 8*s, bodyMid);
            drawBlock(12*s, -18*s, 3*s, 4*s, bodyMid);
            // Tail flame tip (animated)
            const t2 = Date.now() / 200;
            for (let i = 0; i < 6; i++) {
                const fx = 13*s + Math.sin(t2 + i) * 2*s;
                const fy = -22*s - i * 4*s + Math.cos(t2 * 0.8 + i * 0.5) * 2*s;
                const alpha = 1 - i / 6;
                ctx.fillStyle = `rgba(249, 115, 22, ${alpha * 0.9})`;
                ctx.beginPath();
                ctx.arc(fx, fy, (3 - i * 0.4) * s, 0, Math.PI * 2);
                ctx.fill();
            }

            // Body
            drawBlock(-10*s, -6*s, 20*s, 10*s, body);
            drawBlock(-8*s, -8*s, 16*s, 4*s, bodyMid); // Back ridge
            // Fur highlights
            ctx.fillStyle = bodyLight;
            ctx.fillRect(-8*s, -4*s, 4*s, 2*s);
            ctx.fillRect(4*s, -5*s, 4*s, 2*s);

            // Legs (four)
            drawBlock(-8*s, 4*s, 4*s, 8*s, body);
            drawBlock(-2*s, 4*s, 4*s, 8*s, body);
            drawBlock(2*s,  4*s, 4*s, 7*s, body);
            drawBlock(6*s,  4*s, 4*s, 8*s, body);
            // Paws
            drawBlock(-9*s, 10*s, 5*s, 3*s, bodyMid);
            drawBlock(-2*s, 10*s, 5*s, 3*s, bodyMid);
            drawBlock(2*s,  10*s, 5*s, 3*s, bodyMid);
            drawBlock(6*s,  10*s, 5*s, 3*s, bodyMid);

            // Neck
            drawBlock(-14*s, -10*s, 8*s, 8*s, body);

            // Head
            drawBlock(-18*s, -18*s, 14*s, 10*s, body);

            // Snout
            drawBlock(-22*s, -14*s, 8*s, 5*s, bodyMid);
            // Teeth
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(-22*s, -12*s, 2*s, 3*s);
            ctx.fillRect(-18*s, -12*s, 2*s, 3*s);
            ctx.fillRect(-20*s, -12*s, 2*s, 2*s);

            // Ears (jagged)
            drawBlock(-16*s, -24*s, 4*s, 8*s, body);
            drawBlock(-18*s, -26*s, 2*s, 6*s, bodyMid);
            drawBlock(-8*s, -22*s, 4*s, 6*s, body);

            // Glowing fire eyes
            ctx.fillStyle = '#0f0000';
            ctx.fillRect(-16*s, -16*s, 4*s, 3*s);
            ctx.fillRect(-10*s, -16*s, 4*s, 3*s);
            ctx.fillStyle = fireClr;
            ctx.fillRect(-15*s, -15*s, 2*s, 1*s);
            ctx.fillRect(-9*s, -15*s, 2*s, 1*s);
            ctx.fillStyle = fireHot;
            ctx.fillRect(-15*s, -15*s, 1*s, 1*s);
            ctx.fillRect(-9*s, -15*s, 1*s, 1*s);


        }
        
        ctx.restore();
        
        // Draw active spell visual effect
        this.renderEffect(ctx);

        // --- Floating Damage/Heal Numbers ---
        const now = Date.now();
        this.floatingNumbers = this.floatingNumbers.filter(n => now - n.startTime < 1500); // Stay for 1.5s
        
        ctx.save();
        ctx.font = "bold 32px 'Press Start 2P'"; // Larger font
        this.floatingNumbers.forEach(n => {
            const elapsed = now - n.startTime;
            const progress = elapsed / 1500;
            const dy = progress * 150; // Fly higher
            const alpha = 1 - progress;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = n.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 6;
            ctx.textAlign = "center";
            ctx.strokeText(n.value, n.x, n.y - dy);
            ctx.fillText(n.value, n.x, n.y - dy);
        });
        ctx.restore();
    }

    /** Renders the orc using the Orc sprite sheet (100×100 frames). */
    _renderOrcSprite(ctx) {
        const sp = this.orcSprites;
        if (!sp) return;

        let sheet, frameCount, fps;
        if (this.enemyAnimState === 'attack' && this.enemyAnimStateTimer > 0) {
            sheet = sp.attack; frameCount = 6; fps = 10;
        } else if (this.enemyAnimState === 'hurt' && this.enemyAnimStateTimer > 0) {
            sheet = sp.hurt;   frameCount = 4; fps = 8;
        } else if (this.enemyAnimState === 'death') {
            sheet = sp.death;  frameCount = 4; fps = 6;
        } else {
            sheet = sp.idle;   frameCount = 6; fps = 6;
        }

        if (!sheet || !sheet.complete || sheet.naturalWidth === 0) return;

        const frame = Math.floor(Date.now() / (1000 / fps)) % frameCount;
        
        // Disable smoothing for crisp pixel art
        ctx.save();
        ctx.scale(-1, 1); // Flip to face player (left)
        ctx.imageSmoothingEnabled = false;
        
        // Scale to 700x700 to make it look like a formidable World 1 elite.
        // dx = -350 perfectly centers the 700px flipped sprite
        // dy = -335 keeps his feet aligned with the shadow at the new scale
        ctx.drawImage(sheet, frame * 100, 0, 100, 100, -350, -335, 700, 700);
        
        ctx.imageSmoothingEnabled = true;
        ctx.restore();
    }

    update(deltaTime) {
        if (!this.active) return;

        // Decay enemy animation state
        if (this.enemyAnimStateTimer > 0) {
            this.enemyAnimStateTimer -= (deltaTime || 16);
            if (this.enemyAnimStateTimer <= 0) {
                this.enemyAnimState = 'idle';
                this.enemyAnimStateTimer = 0;
            }
        }
    }
    
    renderEffect(ctx) {
        if (!this.activeEffect) return;
        
        const t = (Date.now() - this.activeEffect.startTime) / this.activeEffect.duration; // 0 to 1
        if (t > 1) return;

        const pX = window.innerWidth * 0.25;
        const pY = window.innerHeight * 0.5;
        const eX = this.enemy.x;
        const eY = this.enemy.y;

        ctx.save();
        
        if (this.activeEffect.id === 'fireball') {
            const currentX = pX + (eX - pX) * t;
            const currentY = pY + (eY - pY) * t;
            // Draw a trailing tail using past steps
            for (let i = 0; i < 10; i++) {
                const trailT = Math.max(0, t - i * 0.05);
                const trX = pX + (eX - pX) * trailT;
                const trY = pY + (eY - pY) * trailT + Math.sin(trailT * 20) * 20;
                ctx.fillStyle = `rgba(234, 88, 12, ${1 - i * 0.1})`;
                ctx.beginPath();
                ctx.arc(trX, trY, 30 - i * 2, 0, Math.PI*2);
                ctx.fill();
            }
            // Main sphere
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(currentX, currentY, 20, 0, Math.PI*2);
            ctx.fill();
        } else if (this.activeEffect.id === 'slash') {
            // Phase 1 (0-0.35): Player dashes toward enemy — bright white flash
            if (t < 0.35) {
                const progress = t / 0.35;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.25 * progress})`;
                ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
            }
            
            // Phase 2 (0.2 - 0.75): Draw two diagonal slashes carving across enemy
            if (t >= 0.2 && t <= 0.85) {
                const p2 = Math.min(1, (t - 0.2) / 0.35);
                
                // Slash glow layers (draw widest first for glow effect)
                const slashAlpha = t < 0.65 ? 1 : 1 - (t - 0.65) / 0.2;
                
                [[22, 'rgba(148,163,184,'], [14, 'rgba(226,232,240,'], [6, 'rgba(255,255,255,']].forEach(([lw, clr]) => {
                    ctx.strokeStyle = clr + slashAlpha + ')';
                    ctx.lineWidth = lw;
                    ctx.lineCap = 'round';
                    
                    // First slash: top-left to bottom-right
                    const s1x = eX - 120 + p2 * 240;
                    const s1y = eY - 100 + p2 * 200;
                    ctx.beginPath();
                    ctx.moveTo(eX - 120, eY - 100);
                    ctx.lineTo(s1x, s1y);
                    ctx.stroke();
                    
                    // Second slash: top-right to bottom-left (delayed)
                    if (t >= 0.35) {
                        const p3 = Math.min(1, (t - 0.35) / 0.3);
                        const s2x = eX + 120 - p3 * 240;
                        const s2y = eY - 100 + p3 * 200;
                        ctx.beginPath();
                        ctx.moveTo(eX + 120, eY - 100);
                        ctx.lineTo(s2x, s2y);
                        ctx.stroke();
                    }
                });
            }

            // Phase 3 (0.65 - 1.0): Shockwave ring expanding from impact point
            if (t >= 0.65) {
                const p4 = (t - 0.65) / 0.35;
                const ringRadius = p4 * 180;
                const ringAlpha = 1 - p4;
                ctx.strokeStyle = `rgba(226,232,240,${ringAlpha * 0.8})`;
                ctx.lineWidth = 12 * (1 - p4);
                ctx.beginPath();
                ctx.arc(eX, eY, ringRadius, 0, Math.PI * 2);
                ctx.stroke();
                // Inner ring slightly behind
                ctx.strokeStyle = `rgba(255,255,255,${ringAlpha * 0.4})`;
                ctx.lineWidth = 6 * (1 - p4);
                ctx.beginPath();
                ctx.arc(eX, eY, ringRadius * 0.6, 0, Math.PI * 2);
                ctx.stroke();
            }
        } else if (this.activeEffect.id === 'heal' || this.activeEffect.id === 'holy' || this.activeEffect.id === 'g_heal') {
            const radius1 = t * 150;
            const radius2 = Math.max(0, (t - 0.2) * 150);
            const radius3 = Math.max(0, (t - 0.4) * 150);
            ctx.strokeStyle = this.activeEffect.id !== 'heal' ? '#fde047' : '#22c55e';
            
            [radius1, radius2, radius3].forEach(r => {
                if(r > 0) {
                    ctx.lineWidth = 20 * (1 - t);
                    ctx.beginPath();
                    ctx.arc(pX, pY, r, 0, Math.PI*2);
                    ctx.stroke();
                }
            });
            // Float glowing crosses upwards
            ctx.fillStyle = 'rgba(255, 255, 255, ' + (1-t) + ')';
            for(let i=0; i<5; i++) {
                let offX = Math.sin(i * Math.PI) * 100;
                let climbY = pY - (t * 200) + (i * 30);
                ctx.fillRect(pX + offX - 5, climbY - 15, 10, 30);
                ctx.fillRect(pX + offX - 15, climbY - 5, 30, 10);
            }
        } else if (this.activeEffect.id === 'lightning') {
            if (t > 0.1 && t < 0.9) {
                ctx.strokeStyle = '#fef08a';
                ctx.lineWidth = 20;
                ctx.lineCap = 'round';
                ctx.beginPath();
                let lastX = eX;
                let lastY = eY - 600;
                ctx.moveTo(lastX, lastY);
                for (let i = 1; i <= 6; i++) {
                    let nextY = eY - 600 + (100 * i);
                    let nextX = eX + (Math.random() - 0.5) * 150;
                    if(i === 6) { nextX = eX; nextY = eY; }
                    ctx.lineTo(nextX, nextY);
                    lastX = nextX;
                }
                if (Math.random() > 0.3) ctx.stroke(); // Flicker effect
            }
        } else if (this.activeEffect.id === 'inferno') {
            // Pillars of fire shooting up
            for (let i=0; i<3; i++) {
                let pilarWidth = 60;
                let pilarX = eX - 100 + i * 100;
                let pilarH = t * 600;
                ctx.fillStyle = `rgba(239, 68, 68, ${0.8 - t})`;
                ctx.fillRect(pilarX - pilarWidth/2, eY + 100 - pilarH, pilarWidth, pilarH);
                ctx.fillStyle = `rgba(253, 224, 71, ${0.9 - t})`;
                ctx.fillRect(pilarX - pilarWidth/4, eY + 100 - pilarH + 20, pilarWidth/2, pilarH);
            }
        } else if (this.activeEffect.id === 'crystal') {
            // Cyan beam
            ctx.fillStyle = '#22d3ee';
            ctx.fillRect(pX, eY - 20, (eX - pX) * t, 40);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(pX, eY - 10, (eX - pX) * t, 20);
            if (t > 0.8) {
                // Shard explosion on enemy
                for (let i=0; i<8; i++) {
                    const angle = i * Math.PI / 4 + t*10;
                    const r = (t-0.8) * 500;
                    ctx.fillStyle = '#e0f2fe';
                    ctx.fillRect(eX + Math.cos(angle)*r, eY + Math.sin(angle)*r, 15, 15);
                }
            }
        } else if (this.activeEffect.id === 'meteor') {
            const mX = eX - 400 + t * 400;
            const mY = eY - 600 + t * 600;
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(mX - 60, mY - 60, 120, 120); // Massive rock
            // Fiery tail
            ctx.fillStyle = 'rgba(234, 88, 12, 0.5)'; 
            for(let i=0; i<4; i++) {
                ctx.fillRect(mX - 60 - i*40, mY - 60 - i*60, 120 - i*20, 120 - i*20);
            }
            ctx.fillStyle = '#fef08a';
            ctx.fillRect(mX - 30, mY - 30, 60, 60); 
        } else if (this.activeEffect.id === 'ice_shard') {
            // Ice block forming and shattering
            if (t < 0.7) {
                // Form ice block around enemy
                const formProgress = Math.min(1, t / 0.4);
                ctx.fillStyle = `rgba(186, 230, 253, ${0.6 * formProgress})`; // Light blue, semi-transparent
                ctx.fillRect(eX - 80, eY - 100, 160, 180 * formProgress); // Ice block grows up
                
                // Inner frost core
                ctx.fillStyle = `rgba(224, 242, 254, ${0.8 * formProgress})`;
                ctx.fillRect(eX - 60, eY - 80, 120, 140 * formProgress);
                
                // Sharp edges/spikes of the ice block
                ctx.strokeStyle = `rgba(125, 211, 252, ${0.9 * formProgress})`;
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(eX - 80, eY - 100);
                ctx.lineTo(eX - 100, eY - 120);
                ctx.moveTo(eX + 80, eY - 100);
                ctx.lineTo(eX + 100, eY - 120);
                ctx.moveTo(eX, eY - 100);
                ctx.lineTo(eX, eY - 140);
                ctx.stroke();

                // Freezing mist
                for (let i = 0; i < 15; i++) {
                    const mistX = eX + (Math.random() - 0.5) * 200;
                    const mistY = eY + (Math.random() - 0.5) * 200;
                    ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * formProgress})`;
                    ctx.beginPath();
                    ctx.arc(mistX, mistY, Math.random() * 20 + 10, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else {
                // Shatter into pieces
                const shatterP = (t - 0.7) / 0.3;
                for (let i = 0; i < 20; i++) {
                    const angle = (i / 20) * Math.PI * 2 + Math.random();
                    const dist = shatterP * (300 + Math.random() * 100);
                    const size = (1 - shatterP) * (10 + Math.random() * 20);
                    
                    const shardX = eX + Math.cos(angle) * dist;
                    const shardY = eY - 20 + Math.sin(angle) * dist;
                    
                    ctx.fillStyle = '#bae6fd';
                    
                    ctx.save();
                    ctx.translate(shardX, shardY);
                    ctx.rotate(angle + shatterP * Math.PI * 4);
                    // Draw shard shape
                    ctx.beginPath();
                    ctx.moveTo(0, -size);
                    ctx.lineTo(size/2, size);
                    ctx.lineTo(-size/2, size);
                    ctx.fill();
                    
                    // Highlight
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.moveTo(0, -size);
                    ctx.lineTo(0, size);
                    ctx.lineTo(-size/4, size*0.8);
                    ctx.fill();
                    
                    ctx.restore();
                }
                
                // Flash explosion
                if (shatterP < 0.3) {
                    ctx.fillStyle = `rgba(255, 255, 255, ${(0.3 - shatterP) / 0.3})`;
                    ctx.beginPath();
                    ctx.arc(eX, eY - 20, 150, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (this.activeEffect.id === 'enemy_attack') {
            // Generic fallback: red claw marks
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            const offsets = [-30, 0, 30];
            offsets.forEach(off => {
                ctx.beginPath();
                ctx.moveTo(pX - 60 + off, pY - 80);
                const mark = t < 0.5 ? t * 2 : 1;
                ctx.lineTo(pX - 60 + off + mark*120, pY - 80 + mark*160);
                ctx.stroke();
            });

        } else if (this.activeEffect.id === 'enemy_arrow') {
            // Skeleton shoots an arrow from its position to the player
            const arrowX = eX + (pX - eX) * t;
            const arrowY = eY + (pY - eY) * t;
            const angle = Math.atan2(pY - eY, pX - eX);
            
            ctx.save();
            ctx.translate(arrowX, arrowY);
            ctx.rotate(angle);
            
            // Arrow shaft
            ctx.strokeStyle = '#a16207';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(30, 0);
            ctx.stroke();
            
            // Arrowhead
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(30, 0);
            ctx.lineTo(14, -8);
            ctx.lineTo(14, 8);
            ctx.fill();
            
            // Fletching
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.moveTo(-30, 0);
            ctx.lineTo(-16, -10);
            ctx.lineTo(-20, 0);
            ctx.lineTo(-16, 10);
            ctx.fill();
            
            ctx.restore();
            
            // Impact flash at player on arrival
            if (t > 0.85) {
                const impactAlpha = (1 - t) / 0.15;
                ctx.strokeStyle = `rgba(251,191,36,${impactAlpha})`;
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.arc(pX, pY, (1-t)*80, 0, Math.PI*2);
                ctx.stroke();
            }

        } else if (this.activeEffect.id === 'enemy_acid') {
            // Slime spits an acid glob that splatters on impact
            if (t < 0.7) {
                // Glob in flight (bounces in arc)
                const globX = eX + (pX - eX) * (t / 0.7);
                const arcY  = eY + (pY - eY) * (t / 0.7) - Math.sin((t / 0.7) * Math.PI) * 160;
                
                // Outer blob
                ctx.fillStyle = 'rgba(34,197,94,0.85)';
                ctx.beginPath();
                ctx.arc(globX, arcY, 24, 0, Math.PI*2);
                ctx.fill();
                
                // Inner shine
                ctx.fillStyle = 'rgba(187,247,208,0.7)';
                ctx.beginPath();
                ctx.arc(globX - 6, arcY - 6, 10, 0, Math.PI*2);
                ctx.fill();
                
                // Drip trail
                ctx.fillStyle = 'rgba(74,222,128,0.3)';
                ctx.beginPath();
                ctx.arc(globX + 10, arcY + 14, 8, 0, Math.PI*2);
                ctx.fill();
            } else {
                // Splatter on impact
                const sp = (t - 0.7) / 0.3;
                for (let i = 0; i < 8; i++) {
                    const angle = (i / 8) * Math.PI * 2;
                    const dist = sp * 100;
                    const sx = pX + Math.cos(angle) * dist;
                    const sy = pY + Math.sin(angle) * dist;
                    ctx.fillStyle = `rgba(34,197,94,${0.8 * (1 - sp)})`;
                    ctx.beginPath();
                    ctx.arc(sx, sy, 14 * (1 - sp), 0, Math.PI*2);
                    ctx.fill();
                }
                // Center pool
                ctx.fillStyle = `rgba(22,163,74,${0.6*(1-sp)})`;
                ctx.beginPath();
                ctx.arc(pX, pY, 40 * sp, 0, Math.PI*2);
                ctx.fill();
            }

        } else if (this.activeEffect.id === 'enemy_cleave') {
            // Demon leaps and slams a massive ground cleave
            if (t < 0.45) {
                // Wind-up: dark aura building around enemy
                const auraAlpha = t / 0.45;
                ctx.fillStyle = `rgba(127,29,29,${auraAlpha * 0.4})`;
                ctx.beginPath();
                ctx.arc(eX, eY, 80 + auraAlpha * 40, 0, Math.PI*2);
                ctx.fill();
                
                ctx.strokeStyle = `rgba(239,68,68,${auraAlpha * 0.8})`;
                ctx.lineWidth = 6;
                ctx.beginPath();
                ctx.arc(eX, eY, 80 + auraAlpha * 40, 0, Math.PI*2);
                ctx.stroke();
            } else {
                // Slam: shockwave erupts from the player
                const sp = (t - 0.45) / 0.55;
                
                // Ground crack lines radiating outward
                ctx.strokeStyle = `rgba(239,68,68,${1 - sp})`;
                ctx.lineWidth = 10 * (1 - sp * 0.7);
                ctx.lineCap = 'round';
                for (let i = 0; i < 5; i++) {
                    const angle = (i / 5) * Math.PI - Math.PI/2 + (Math.random()-0.5)*0.3;
                    ctx.beginPath();
                    ctx.moveTo(pX, pY + 20);
                    ctx.lineTo(pX + Math.cos(angle) * sp * 200, pY + 20 + Math.sin(angle) * sp * 140);
                    ctx.stroke();
                }
                
                // Flash explosion at player
                if (sp < 0.5) {
                    ctx.fillStyle = `rgba(239,68,68,${(0.5-sp)/0.5 * 0.6})`;
                    ctx.beginPath();
                    ctx.arc(pX, pY, sp * 120, 0, Math.PI*2);
                    ctx.fill();
                }
            }

        } else if (this.activeEffect.id === 'enemy_tail_swipe') {
            // Dragon swivels and slams tail
            const sp = t;
            const swingX = eX + 100;
            const swingY = eY;
            
            // Draw a big tail arc
            ctx.strokeStyle = '#3d2b1f';
            ctx.lineWidth = 30 * (1 - sp);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(swingX, swingY);
            // S-curve for tail
            ctx.bezierCurveTo(
                swingX + 100 * sp, swingY - 150 * sp,
                swingX - 400 * sp, swingY - 50 * sp,
                pX, pY
            );
            ctx.stroke();

            // Impact dust
            if (sp > 0.6) {
                const dp = (sp - 0.6) / 0.4;
                ctx.fillStyle = `rgba(100,100,100,${0.5 * (1-dp)})`;
                for(let i=0; i<6; i++) {
                    ctx.beginPath();
                    ctx.arc(pX + (i-3)*30, pY + 20, 20*dp, 0, Math.PI*2);
                    ctx.fill();
                }
            }
        } else if (this.activeEffect.id === 'enemy_dragon_nova') {
            // Massive magical pulse
            const sp = t;
            const pulseRadius = sp * 800;
            const alpha = 1 - sp;
            
            // Determining color based on enemy name
            let coreColor = 'rgba(239, 68, 68,'; // Red
            if (this.enemy.name.includes("Crystal")) coreColor = 'rgba(34, 211, 238,';
            if (this.enemy.name.includes("Void")) coreColor = 'rgba(168, 85, 247,';
            if (this.enemy.name.includes("Celestial")) coreColor = 'rgba(255, 255, 255,';

            ctx.strokeStyle = coreColor + alpha + ')';
            ctx.lineWidth = 40 * (1 - sp);
            ctx.beginPath();
            ctx.arc(eX, eY, pulseRadius, 0, Math.PI * 2);
            ctx.stroke();
            
            // Screen shake effect for Nova
            const shake = Math.sin(t * 50) * 10 * (1 - t);
            this.uiLayer.style.transform = `translate(${shake}px, ${shake}px)`;
            if (t > 0.95) this.uiLayer.style.transform = 'none';

            // Particles
            for (let i = 0; i < 10; i++) {
                const angle = (i / 10) * Math.PI * 2 + t * 5;
                const r = pulseRadius * 0.8;
                ctx.fillStyle = coreColor + (alpha * 0.5) + ')';
                ctx.fillRect(eX + Math.cos(angle) * r - 10, eY + Math.sin(angle) * r - 10, 20, 20);
            }
        } else if (this.activeEffect.id === 'enemy_breath') {
            // Dragon breathes a fire cone from mouth to player
            if (t > 0.1) {
                const coneProgress = Math.min(1, (t - 0.1) / 0.6);
                const tipX = eX - 60;
                const targetX = pX;
                const targetY = pY;
                const currentEndX = tipX + (targetX - tipX) * coneProgress;
                const currentEndY = eY + (targetY - eY) * coneProgress;
                
                // Draw cone as filled triangle with gradient opacity
                const spread = coneProgress * 120;
                ctx.fillStyle = `rgba(239,68,68,${0.7 - t * 0.3})`;
                ctx.beginPath();
                ctx.moveTo(tipX, eY);
                ctx.lineTo(currentEndX, currentEndY - spread/2);
                ctx.lineTo(currentEndX, currentEndY + spread/2);
                ctx.fill();
                
                // Inner bright core
                const innerSpread = spread * 0.4;
                ctx.fillStyle = `rgba(253,224,71,${0.8 - t * 0.4})`;
                ctx.beginPath();
                ctx.moveTo(tipX, eY);
                ctx.lineTo(currentEndX, currentEndY - innerSpread/2);
                ctx.lineTo(currentEndX, currentEndY + innerSpread/2);
                ctx.fill();
                
                // Embers floating off the cone
                for (let i = 0; i < 6; i++) {
                    const embT = (t * 3 + i * 0.4) % 1;
                    const embX = tipX + (currentEndX - tipX) * embT + (Math.random()-0.5)*40;
                    const embY = eY + (currentEndY - eY) * embT + (Math.random()-0.5)*40;
                    ctx.fillStyle = `rgba(251,146,60,${0.6 * (1-embT)})`;
                    ctx.beginPath();
                    ctx.arc(embX, embY, 8*(1-embT), 0, Math.PI*2);
                    ctx.fill();
                }
            }
            
            // Final linger: fire pool at player
            if (t > 0.75) {
                const lp = (t - 0.75) / 0.25;
                ctx.fillStyle = `rgba(239,68,68,${0.5 * (1-lp)})`;
                ctx.beginPath();
                ctx.ellipse(pX, pY + 20, 70 * lp, 30 * lp, 0, 0, Math.PI*2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    renderMenu() {
        const h = this.player.stats;
        const e = this.enemy;
        this.uiLayer.innerHTML = `
            <div class="hud glass-panel">
                <h3 style="color: #fbbf24; margin-bottom: 10px; border-bottom: 1px solid rgba(251,191,36,0.3); padding-bottom: 5px;">THE HERO</h3>
                <div class="stat-bar">
                    <div class="stat-fill hp-fill" style="width:${(h.hp/h.maxHp)*100}%"></div>
                    <div class="stat-label">HEALTH: ${h.hp} / ${h.maxHp}</div>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill mp-fill" style="width:${(h.mp/h.maxMp)*100}%"></div>
                    <div class="stat-label">MANA: ${h.mp} / ${h.maxMp}</div>
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; margin-top:12px;">
                    ${h.armor ? `<div style="font-size:0.6rem; color:#94a3b8; font-family:var(--font-pixel);">🛡️ ${h.armor.name}</div>` : ''}
                    ${h.weapon ? `<div style="font-size:0.6rem; color:#6366f1; font-family:var(--font-pixel);">⚔️ ${h.weapon.name}</div>` : ''}
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:12px;">
                    ${this.playerEffects.map(ef => `<span style="font-size:0.5rem; background:rgba(0,0,0,0.4); border:1px solid ${this.getEffectColor(ef.id)}; padding:3px 6px; color:${this.getEffectColor(ef.id)}; font-family:var(--font-pixel);">${ef.id.toUpperCase()} (${ef.duration})</span>`).join('')}
                </div>
            </div>
            
            <div class="battle-menu glass-panel" style="display: flex; flex-direction: row; gap: 20px; padding: 20px 40px; justify-content: center; align-items: center;">
                <button class="battle-btn" id="atk-btn" style="min-width: 180px; margin-bottom: 0;">ATTACK</button>
                <button class="battle-btn" id="mag-btn" style="min-width: 180px; margin-bottom: 0;">MAGIC</button>
                <button class="battle-btn" id="run-btn" style="min-width: 180px; margin-bottom: 0;">FLEE</button>
            </div>
            
            <div class="enemy-hud glass-panel" style="position: absolute; top: 30px; right: 30px; min-width: 280px; padding: 25px;">
                <h3 style="color: #f87171; margin-bottom: 15px; border-bottom: 2px solid rgba(248,113,113,0.3); padding-bottom: 10px;">${e.name.toUpperCase()}</h3>
                <div class="stat-bar">
                    <div class="stat-fill hp-fill" style="width:${(e.hp/e.maxHp)*100}%"></div>
                    <div class="stat-label">HEALTH: ${Math.max(0, e.hp)} / ${e.maxHp}</div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:15px; min-height: 20px;">
                    ${this.enemyEffects.map(ef => `<span style="font-size:0.5rem; background:rgba(0,0,0,0.4); border:1px solid ${this.getEffectColor(ef.id)}; padding:3px 6px; color:${this.getEffectColor(ef.id)}; font-family:var(--font-pixel);">${ef.id.toUpperCase()} (${ef.duration})</span>`).join('')}
                </div>
                ${e.drop ? `<div style="font-size:0.6rem; margin-top:20px; color:#fbbf24; font-family:var(--font-pixel); border-top: 1px solid rgba(251,191,36,0.2); padding-top: 10px;">PROBABLE DROP: ${e.drop.name}</div>` : ''}
            </div>
        `;

        document.getElementById('atk-btn').onclick = () => this.attack();
        document.getElementById('mag-btn').onclick = () => this.showMagicMenu();
        document.getElementById('run-btn').onclick = () => this.tryEscape();
    }

    addFloatingNumber(x, y, value, color) {
        this.floatingNumbers.push({
            x, y, value, color,
            startTime: Date.now()
        });
    }

    getEffectColor(id) {
        return {
            'poison': '#4ade80',
            'burn': '#f97316',
            'stun': '#fde047',
            'bleed': '#f87171',
            'weakness': '#a855f7',
            'holy': '#ffffff'
        }[id] || '#fff';
    }

    applyStatusEffect(target, id, duration) {
        const effects = target === 'PLAYER' ? this.playerEffects : this.enemyEffects;
        const existing = effects.find(e => e.id === id);
        
        // Arcane Mastery bonus for player applying effects
        if (target === 'ENEMY') {
            duration += this.player.stats.masteries.arcane;
            
            // Eternity Blade Bonus (+2 Duration)
            if (this.player.stats.weapon && this.player.stats.weapon.id === 'eternity_blade') {
                duration += 2;
            }
        }

        if (existing) {
            existing.duration = Math.max(existing.duration, duration);
        } else {
            effects.push({ id, duration });
        }
    }

    processStatusEffects(target) {
        const effects = target === 'PLAYER' ? this.playerEffects : this.enemyEffects;
        const stats = target === 'PLAYER' ? this.player.stats : this.enemy;
        const x = target === 'PLAYER' ? window.innerWidth * 0.25 : this.enemy.x;
        const y = target === 'PLAYER' ? window.innerHeight * 0.5 : this.enemy.y;

        let messages = [];

        effects.forEach((ef, index) => {
            if (ef.id === 'poison') {
                const dmg = Math.floor(stats.maxHp * 0.05) + 2;
                stats.hp -= dmg;
                this.addFloatingNumber(x, y - 60, `-${dmg}`, '#4ade80');
                messages.push(`${target} took ${dmg} poison damage!`);
            } else if (ef.id === 'burn') {
                const dmg = Math.floor(stats.maxHp * 0.08);
                stats.hp -= dmg;
                this.addFloatingNumber(x, y - 60, `-${dmg}`, '#f97316');
                messages.push(`${target} is burning for ${dmg} damage!`);
            } else if (ef.id === 'bleed') {
                const dmg = 10 + Math.floor(stats.hp * 0.1);
                stats.hp -= dmg;
                this.addFloatingNumber(x, y - 60, `-${dmg}`, '#f87171');
                messages.push(`${target} bleeds for ${dmg} damage!`);
            } else if (ef.id === 'weakness') {
                messages.push(`${target} is weakened!`);
            } else if (ef.id === 'stun') {
                messages.push(`${target} is stunned!`);
            }

            ef.duration--;
        });

        // Clean up expired effects
        const remaining = effects.filter(e => e.duration > 0);
        if (target === 'PLAYER') this.playerEffects = remaining;
        else this.enemyEffects = remaining;

        return messages;
    }

    tryEscape() {
        if (this.turn !== 'PLAYER' || this.activeEffect) return;

        if (this.encounterType === 'dragon') {
            showModal("You cannot flee from the Great Guardian!");
            return;
        }

        // Guaranteed success at 100% to avoid any floating point edge cases
        if (this.escapeChance >= 100 || Math.random() * 100 < this.escapeChance) {
            // Success: trigger "run off screen" animation
            this.player.isEscaping = true;
            this.uiLayer.innerHTML = '<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:#fff; font-family:var(--font-heading); font-size:2rem; text-shadow:0 0 10px #000;">ESCAPING...</div>'; 
            
            setTimeout(() => {
                this.endBattle("You managed to escape with your life!");
            }, 800);
        } else {
            this.escapeChance = Math.min(100, this.escapeChance + 20);
            showModal(`Escape Failed!\nThe enemy blocks your path.\n\nNext attempt chance: ${this.escapeChance}%`, () => {
                this.turn = 'ENEMY';
                this.enemyTurn();
            });
        }
    }

    showMagicMenu() {
        if (this.turn !== 'PLAYER' || this.player.stats.spells.length === 0) {
            if (this.player.stats.spells.length === 0) alert("You don't know any spells yet! Visit a Shop.");
            return;
        }
        
        let spellButtons = this.player.stats.spells.map(s => {
            let cost = s.mp;
            if (this.player.stats.charClass === 'mage' && s.id === 'fireball') cost = Math.max(1, Math.floor(cost / 2));
            return `<button class="battle-btn spell-btn ${this.player.stats.mp < cost ? 'disabled' : ''}" data-id="${s.id}">
                ${s.name} (${cost} MP)
            </button>`;
        }).join('');
        
        spellButtons += `<button class="battle-btn" id="back-btn">BACK</button>`;
        
        document.querySelector('.battle-menu').innerHTML = spellButtons;
        
        document.querySelectorAll('.spell-btn:not(.disabled)').forEach(btn => {
            btn.onclick = (e) => {
                const spellId = e.target.getAttribute('data-id');
                const spell = this.player.stats.spells.find(s => s.id === spellId);
                this.castSpell(spell);
            }
        });
        
        document.getElementById('back-btn').onclick = () => this.renderMenu();
    }

    castSpell(spell) {
        if (this.turn !== 'PLAYER' || this.activeEffect) return;
        
        let cost = spell.mp;
        if (this.player.stats.charClass === 'mage' && spell.id === 'fireball') cost = Math.max(1, Math.floor(cost / 2));
        this.player.stats.mp -= cost;
        this.activeEffect = { id: spell.id, startTime: Date.now(), duration: 800 };
        this.uiLayer.innerHTML = ''; 
        
        setTimeout(() => {
            // Arcane Mastery: +2 Spell Power per level
            const arcane = this.player.stats.masteries.arcane;
            let dmg = spell.dmg !== undefined ? (spell.dmg + (arcane * 2)) : 0;
            
            // Arcane Mastery Level 10 Perk: Overload (+50% Magic DMG)
            if (arcane >= 10 && dmg > 0) {
                dmg = Math.floor(dmg * 1.5);
            }
            
            const pX = window.innerWidth * 0.25;
            const pY = window.innerHeight * 0.5;
            const eX = this.enemy.x;
            const eY = this.enemy.y;

            if (spell.type === 'lifesteal') {
                this.enemy.hp -= dmg;
                const healAmt = Math.floor(dmg / 2);
                this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + healAmt);
                this.addFloatingNumber(eX, eY - 50, `-${dmg}`, "#8b5cf6");
                setTimeout(() => this.addFloatingNumber(pX, pY - 50, `+${healAmt}`, "#22c55e"), 400);
            } else if (dmg > 0) {
                this.enemy.hp -= dmg;
                this.addFloatingNumber(eX, eY - 50, `-${dmg}`, "#ef4444");
                
                // Status application
                if (spell.id === 'fireball' || spell.id === 'inferno') {
                    this.applyStatusEffect('ENEMY', 'burn', 2);
                } else if (spell.id === 'crystal') {
                    this.applyStatusEffect('ENEMY', 'stun', 1);
                }
            } else if (spell.dmg < 0) {
                const healAmt = Math.abs(spell.dmg) + (arcane * 5);
                this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + healAmt);
                this.addFloatingNumber(pX, pY - 50, `+${healAmt}`, "#22c55e");
            }
            
            this.activeEffect = null;
            this.checkWin();
            
            if (this.active) {
                this.turn = 'ENEMY';
                this.processTurnTransition();
            }
        }, 800);
    }

    attack() {
        if (this.turn !== 'PLAYER' || this.activeEffect) return;

        // Trigger knight sprite attack animation
        if (this.player.stats.charClass === 'knight') this.player.setAnimState('attack', 700);
        
        // Trigger enemy hurt animation if it's an orc
        if (this.enemy.type === 'orc') {
            this.enemyAnimState = 'hurt';
            this.enemyAnimStateTimer = 700;
        }

        this.activeEffect = { id: 'slash', startTime: Date.now(), duration: 700 };
        this.uiLayer.innerHTML = '';
        
        setTimeout(() => {
            // slayer Mastery: +1 Atk per level, +1% Crit
            const slayer = this.player.stats.masteries.slayer;
            const critChance = (this.player.stats.charClass === 'berserker' ? 0.20 : 0.05) + (slayer * 0.01);
            
            let targetDef = this.enemy.def;
            // Burn defense shred (50% reduction)
            if (this.enemyEffects.find(e => e.id === 'burn')) {
                targetDef = Math.floor(targetDef * 0.5);
            }
            
            let dmg = Math.max(1, this.player.stats.atk - targetDef);
            let isCrit = Math.random() < critChance;
            
            if (isCrit) {
                const critMult = (this.player.stats.masteries.slayer >= 5) ? 2.5 : 2.0;
                dmg = Math.floor(dmg * critMult);
                this.addFloatingNumber(this.enemy.x, this.enemy.y - 100, "CRITICAL!", "#fbbf24");
                
                // Burn defense shred visual indicator if active during crit
                if (this.enemyEffects.find(e => e.id === 'burn')) {
                    this.addFloatingNumber(this.enemy.x, this.enemy.y - 130, "SHREDDED!", "#f97316");
                }
            }

            // Slayer Mastery Level 10 Perk: Ruthless (Execute <25% HP)
            if (this.player.stats.masteries.slayer >= 10 && (this.enemy.hp / this.enemy.maxHp) < 0.25) {
                dmg = this.enemy.hp;
                this.addFloatingNumber(this.enemy.x, this.enemy.y - 80, "RUTHLESS!", "#ef4444");
            }

            // Weapon Effects
            const w = this.player.stats.weapon;
            const guardian = this.player.stats.masteries.guardian;
            
            if (w) {
                const procChance = (w.chance || 0) + (guardian * 0.05);
                if (Math.random() < procChance || w.effect === 'lifesteal' || w.effect === 'bleed_crit' || w.effect === 'execute') {
                    if (w.effect === 'poison') {
                        this.applyStatusEffect('ENEMY', 'poison', 3);
                    } else if (w.effect === 'burn') {
                        this.applyStatusEffect('ENEMY', 'burn', 2);
                    } else if (w.effect === 'stun') {
                        this.applyStatusEffect('ENEMY', 'stun', 1);
                    } else if (w.effect === 'weakness') {
                        this.applyStatusEffect('ENEMY', 'weakness', 4);
                    } else if (w.effect === 'holy') {
                        dmg += 20;
                        this.addFloatingNumber(this.enemy.x, this.enemy.y - 30, "+20 HOLY", "#fff");
                    } else if (w.effect === 'lifesteal') {
                        const heal = Math.floor(dmg * w.value);
                        this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + heal);
                        this.addFloatingNumber(this.enemy.x - 40, this.enemy.y, `+${heal} LIFE`, "#22c55e");
                    } else if (w.effect === 'bleed_crit' && isCrit) {
                        this.applyStatusEffect('ENEMY', 'bleed', 3);
                    } else if (w.effect === 'execute' && (this.enemy.hp / this.enemy.maxHp) < w.value) {
                        dmg = this.enemy.hp;
                        this.addFloatingNumber(this.enemy.x, this.enemy.y - 80, "EXECUTE!", "#ef4444");
                    }
                }
            }

            this.enemy.hp -= dmg;
            this.addFloatingNumber(this.enemy.x + (Math.random()*40-20), this.enemy.y - 50, `-${dmg}`, "#ef4444");

            // Rogue Passive (Double Attack)
            let willHitAgain = false;
            if (this.player.stats.charClass === 'rogue' && !this.rogueSecondHitDone && this.enemy.hp > 0) {
                willHitAgain = true;
                this.rogueSecondHitDone = true;
            } else {
                this.rogueSecondHitDone = false;
            }
            
            this.activeEffect = null;
            this.checkWin();
            
            if (this.active) {
                if (willHitAgain) {
                    this.attack(); 
                } else {
                    this.turn = 'ENEMY';
                    this.processTurnTransition();
                }
            }
        }, 700);
    }

    processTurnTransition() {
        if (!this.active) return;
        
        let messages = [];
        if (this.turn === 'PLAYER') {
            // Arcane Mastery Level 5 Perk: Mana Flow
            if (this.player.stats.masteries.arcane >= 5) {
                const recover = 5;
                this.player.stats.mp = Math.min(this.player.stats.maxMp, this.player.stats.mp + recover);
                this.addFloatingNumber(window.innerWidth * 0.25, window.innerHeight * 0.5 - 50, `+${recover} MP`, "#60a5fa");
            }
            messages = this.processStatusEffects('PLAYER');
        } else {
            messages = this.processStatusEffects('ENEMY');
        }

        if (messages.length > 0) {
            // Small delay to show status damage before next move
            setTimeout(() => {
                this.checkWin();
                if (this.active) {
                    if (this.turn === 'PLAYER') this.renderMenu();
                    else this.enemyTurn();
                }
            }, 600);
        } else {
            this.checkWin();
            if (this.active) {
                if (this.turn === 'PLAYER') this.renderMenu();
                else this.enemyTurn();
            }
        }
    }

    enemyTurn() {
        this.uiLayer.innerHTML = '';
        
        // Stun check
        if (this.enemyEffects.find(e => e.id === 'stun')) {
            this.addFloatingNumber(this.enemy.x, this.enemy.y - 80, "STUNNED!", "#fde047");
            setTimeout(() => {
                this.turn = 'PLAYER';
                this.processTurnTransition();
            }, 1000);
            return;
        }

        // Pick a unique effect per enemy type
        const enemyEffectMap = {
            skeleton: ['enemy_arrow'],
            slime:    ['enemy_acid'],
            demon:    ['enemy_cleave'],
            orc:      ['enemy_attack'],
            golem:    ['enemy_cleave'],
            phoenix:  ['enemy_breath'],
            hydra:    ['enemy_acid'],
            watcher:  ['enemy_dragon_nova'],
            dragon:   ['enemy_breath', 'enemy_tail_swipe', 'enemy_dragon_nova']
        };
        
        const possibleEffects = enemyEffectMap[this.enemy.type] || ['enemy_attack'];
        const effectId = possibleEffects[Math.floor(Math.random() * possibleEffects.length)];
        
        this.activeEffect = { id: effectId, startTime: Date.now(), duration: 1000 };
        
        setTimeout(() => {
            // guardian Mastery: +1 Def per level
            const guardianBonus = this.player.stats.masteries.guardian;
            let totalDef = this.player.stats.def + (this.player.stats.armor ? this.player.stats.armor.def : 0) + guardianBonus;
            
            // Player Burn defense shred (consistency)
            if (this.playerEffects.find(e => e.id === 'burn')) {
                totalDef = Math.floor(totalDef * 0.5);
            }

            let dmg = Math.max(1, this.enemy.atk - totalDef);
            
            // Enemy Weakness Status (25% reduction)
            if (this.enemyEffects.find(e => e.id === 'weakness')) {
                dmg = Math.floor(dmg * 0.75);
            }

            // Guardian Mastery Level 5 Perk: Bastion
            if (this.player.stats.masteries.guardian >= 5) {
                dmg = Math.floor(dmg * 0.9);
            }

            // Adjust damage based on attack type
            if (effectId === 'enemy_dragon_nova') dmg = Math.floor(dmg * 1.5);
            if (effectId === 'enemy_tail_swipe') dmg = Math.floor(dmg * 0.8);

            // Knight Passive (25% Block)
            if (this.player.stats.charClass === 'knight' && Math.random() < 0.25) {
                dmg = Math.floor(dmg / 2);
            }
            
            this.player.stats.hp -= dmg;
            this.addFloatingNumber(window.innerWidth * 0.25 + (Math.random()*40-20), window.innerHeight * 0.5 - 50, `-${dmg}`, "#ef4444");

            // Trigger knight sprite hurt animation
            if (this.player.stats.charClass === 'knight') this.player.setAnimState('hurt', 600);

            // Trigger enemy attack animation if it's an orc
            if (this.enemy.type === 'orc') {
                this.enemyAnimState = 'attack';
                this.enemyAnimStateTimer = 600;
            }

            this.activeEffect = null;
            this.checkWin();
            if (this.active) {
                // Paladin Passive (+5 HP regen)
                if (this.player.stats.charClass === 'paladin' && this.player.stats.hp < this.player.stats.maxHp) {
                    const heal = Math.min(5, this.player.stats.maxHp - this.player.stats.hp);
                    this.player.stats.hp += heal;
                    this.addFloatingNumber(window.innerWidth * 0.25, window.innerHeight * 0.5 - 70, `+${heal}`, "#22c55e");
                }
                this.turn = 'PLAYER';
                this.processTurnTransition();
            }
        }, 800);
    }


    checkWin() {
        if (this.enemy.hp <= 0) {
            let messages = [];
            if (this.encounterType === 'dragon') {
                this.player.stats.dragonDefeated = true;
                messages.push(`⭐ YOU SLAIN THE BOSS! THE GATE UNSEALS ⭐`);
            }
            this.player.stats.kills = (this.player.stats.kills || 0) + 1;
            const expReward = Math.floor(this.enemy.maxHp * 0.3) + Math.floor(Math.random() * 10) + 5;
            const goldReward = Math.floor(this.enemy.maxHp * 0.1) + Math.floor(Math.random() * 10) + 5;
            messages.push(`Victory! Gained ${expReward} EXP and ${goldReward} Gold.`);
            
            this.player.stats.gold = Number(this.player.stats.gold || 0) + Number(goldReward);
            this.player.addExp(expReward, messages);
            
            // Item Drop Logic
            if (this.enemy.drop && Math.random() * 100 <= this.enemy.drop.chance) {
                messages.push(`\n🎁 The enemy dropped: ${this.enemy.drop.name}!`);
                if (!this.player.stats.armor || this.enemy.drop.def > this.player.stats.armor.def) {
                    this.player.stats.armor = { name: this.enemy.drop.name, def: this.enemy.drop.def, id: this.enemy.drop.name };
                    messages.push(`Equipped ${this.enemy.drop.name} (+${this.enemy.drop.def} DEF)`);
                } else {
                    messages.push(`(Kept current armor since it is stronger)`);
                }
            }
            
            this.endBattle(messages.join('\n'));
        } else if (this.player.stats.hp <= 0) {
            // Save leaderboard entry before wiping the save
            const entry = {
                charClass: this.player.stats.charClass,
                kills: this.player.stats.kills || 0,
                timePlayed: Math.floor(this.player.stats.timePlayed || 0),
                worldId: this.player.stats.worldId || 1,
                level: this.player.stats.level || 1,
                date: new Date().toLocaleDateString()
            };
            const board = JSON.parse(localStorage.getItem('aethelgard_leaderboard') || '[]');
            board.push(entry);
            board.sort((a, b) => b.kills - a.kills);
            board.splice(10); // Keep top 10 runs
            localStorage.setItem('aethelgard_leaderboard', JSON.stringify(board));
            
            const gameOverMsg = `Your ${entry.charClass} fell on World ${entry.worldId}.\nKills: ${entry.kills} | Time: ${Math.floor(entry.timePlayed/60)}m ${entry.timePlayed%60}s | Level: ${entry.level}\n\nYour run has been recorded.`;
            showModal(gameOverMsg, () => {
                localStorage.removeItem('aethelgard_save');
                localStorage.setItem('aethelgard_skip_intro', 'true');
                window.location.reload();
            }, "VALIANT EFFORT", "RETRY");
        }
    }

    drawPixelSprite(ctx, startX, startY, grid, colors, size) {
        grid.forEach((row, y) => {
            [...row].forEach((char, x) => {
                if (colors[char]) {
                    ctx.fillStyle = colors[char];
                    ctx.fillRect(startX + x * size, startY + y * size, size, size);
                }
            });
        });
    }

    endBattle(msg) {
        this.active = false;
        this.player.isEscaping = false;
        this.player.battleOffset = 0;
        this.player.stats.hp = this.player.stats.maxHp;
        this.uiLayer.innerHTML = '';
        showModal(msg, () => {
            window.dispatchEvent(new CustomEvent('battleEnd'));
        });
    }
}
