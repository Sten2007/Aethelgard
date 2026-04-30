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
        this.enemyImg.src = '/enemy.png';
        this.dragonImg = new Image();
        this.dragonImg.src = '/dragon.png';
    }

    initBattle(encounterType = 'random', worldId = 1) {
        this.active = true;
        this.encounterType = encounterType;
        this.escapeChance = 40;
        this.floatingNumbers = [];
        
        let config;
        
        if (encounterType === 'dragon') {
            if (worldId === 1) config = { name: "Stone Guardian", hp: 500, maxHp: 500, atk: 40, def: 20, type: "golem", drop: { name: 'Guardian Plate', def: 10, chance: 100 } };
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
                    { name: "Demon Knight", hp: 140, maxHp: 140, atk: 22, def: 10, type: "demon", drop: { name: 'Iron Armor', def: 15, chance: 5 } }
                ];
            } else if (worldId === 2) {
                pool = [
                    { name: "Ash Wraith", hp: 150, maxHp: 150, atk: 25, def: 8, type: "skeleton", drop: { name: 'Iron Armor', def: 15, chance: 10 } },
                    { name: "Lava Golem", hp: 300, maxHp: 300, atk: 15, def: 25, type: "demon", drop: { name: 'Steel Armor', def: 30, chance: 5 } },
                    { name: "Hellhound", hp: 180, maxHp: 180, atk: 35, def: 5, type: "slime", drop: { name: 'Iron Armor', def: 15, chance: 15 } }
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
        
        if (this.enemy.type === "demon") {
            // Cool Procedural Pixel Art Enemy (Dark Knight / Demon)
            
            // Body (Dark Red/Crimson)
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(-8*s, -8*s, 16*s, 16*s);
            ctx.fillStyle = '#7f1d1d';
            ctx.fillRect(-6*s, 0, 12*s, 8*s);
            
            // Head
            ctx.fillStyle = '#b91c1c';
            ctx.fillRect(-6*s, -14*s, 12*s, 6*s);
            
            // Horns
            ctx.fillStyle = '#fde047';
            ctx.fillRect(-8*s, -16*s, 2*s, 6*s);
            ctx.fillRect(-10*s, -18*s, 2*s, 4*s);
            ctx.fillRect(6*s, -16*s, 2*s, 6*s);
            ctx.fillRect(8*s, -18*s, 2*s, 4*s);

            // Glowing Eyes
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-4*s, -12*s, 2*s, 2*s);
            ctx.fillRect(2*s, -12*s, 2*s, 2*s);
            
            // Jaw / Mask
            ctx.fillStyle = '#171717';
            ctx.fillRect(-4*s, -10*s, 8*s, 2*s);
            
            // Shoulders / Armor
            ctx.fillStyle = '#451a03';
            ctx.fillRect(-12*s, -8*s, 4*s, 6*s);
            ctx.fillRect(8*s, -8*s, 4*s, 6*s);
            
            // Arms
            ctx.fillStyle = '#991b1b';
            ctx.fillRect(-10*s, -2*s, 2*s, 8*s);
            ctx.fillRect(8*s, -2*s, 2*s, 8*s);
            
            // Big Sword (Left Hand)
            ctx.fillStyle = '#d4d4d8';
            ctx.fillRect(-16*s, -12*s, 4*s, 20*s);
            ctx.fillStyle = '#ef4444'; // Blood on sword
            ctx.fillRect(-16*s, -12*s, 4*s, 4*s);
            ctx.fillStyle = '#27272a'; // Hilt
            ctx.fillRect(-18*s, 8*s, 8*s, 2*s);
            ctx.fillRect(-16*s, 10*s, 4*s, 4*s);
        } else if (this.enemy.type === "slime") {
            // Bouncing Slime
            ctx.fillStyle = '#22c55e'; // Green
            ctx.fillRect(-10*s, -2*s, 20*s, 10*s); // Base
            ctx.fillRect(-8*s, -6*s, 16*s, 4*s); // Mid
            ctx.fillRect(-4*s, -8*s, 8*s, 2*s); // Top
            
            // Eyes
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-6*s, -2*s, 2*s, 2*s);
            ctx.fillRect(4*s, -2*s, 2*s, 2*s);
            ctx.fillStyle = '#ffffff'; // Shine
            ctx.fillRect(-6*s, -4*s, 2*s, 2*s);
            ctx.fillRect(4*s, -4*s, 2*s, 2*s);
        } else if (this.enemy.type === "skeleton") {
            // Skeleton
            ctx.fillStyle = '#e2e8f0'; // Bone white
            // Skull
            ctx.fillRect(-6*s, -16*s, 12*s, 10*s);
            ctx.fillStyle = '#000000'; // Eyes
            ctx.fillRect(-4*s, -14*s, 3*s, 3*s);
            ctx.fillRect(1*s, -14*s, 3*s, 3*s);
            ctx.fillRect(-2*s, -10*s, 4*s, 2*s); // Teeth gap
            
            // Body / Ribs
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(-4*s, -4*s, 8*s, 8*s);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-2*s, -2*s, 4*s, 2*s); // Hollow rib
            
            // Arms
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(-8*s, -4*s, 2*s, 10*s);
            ctx.fillRect(6*s, -4*s, 2*s, 10*s);
            
            // Rusty Sword
            ctx.fillStyle = '#a16207';
            ctx.fillRect(-10*s, 0*s, 2*s, 14*s);
        } else if (this.enemy.type === "golem") {
            const s = 10;
            const grid = [
                "                    ",
                "      ########      ",
                "     ##RRRRRR##     ",
                "  ####RRRRRRRR####  ",
                " ##RR##RREERR##RR## ",
                " #RRRR#RREERR#RRRR# ",
                " #RRRRRRRRRRRRRRRR# ",
                "##RRRR########RRRR##",
                "#RRRRR#RRRRRR#RRRRR#",
                "#RRRRR#RCCCCR#RRRRR#",
                "#RRRRR#RCCCCR#RRRRR#",
                "#######RRRRRR#######",
                "      #RRRRRR#      ",
                "      ##RRRR##      ",
                "      ##RRRR##      ",
                "     ###RRRR###     ",
                "     #RR####RR#     ",
                "     #RR#  #RR#     ",
                "     ####  ####     ",
                "                    "
            ];
            const colors = { 
                '#': '#0f172a', // Darkest
                'R': '#475569', // Main stone
                'E': '#38bdf8', // Glow
                'C': '#0ea5e9'  // Core glow / Crystals
            };
            this.drawPixelSprite(ctx, -10 * s, -20 * s, grid, colors, s);
        } else if (this.enemy.type === "phoenix") {
            const s = 10;
            const grid = [
                "           ##           ",
                "          #RR#          ",
                "         #RRYR#         ",
                " #       #RYYR#       # ",
                " #R#    #RYYYYR#    #R# ",
                " #YR#   #RYYYYR#   #RY# ",
                " #YYR#  #RYWWYR#  #RYY# ",
                " #YYYR# #RWWWWWR# #RYYY#",
                "  #YYYR##RWWWWWR##RYYY# ",
                "   #YYYRRRWWWWWRRRYYY#  ",
                "    #YYYYYWWWWYYYYYY#   ",
                "     #YYYYYYYYYYYYY#    ",
                "      #YYYYYYYYYYY#     ",
                "        ##RRRRR##       ",
                "         #RRRRR#        ",
                "          #RRR#         ",
                "           #R#          ",
                "           #R#          ",
                "            #           ",
                "                        "
            ];
            const colors = { 
                '#': '#450a0a', 
                'R': '#ef4444', 
                'W': '#ffffff', 
                'Y': '#facc15'
            };
            this.drawPixelSprite(ctx, -12 * s, -20 * s, grid, colors, s);
        } else if (this.enemy.type === "hydra") {
            const s = 10;
            const grid = [
                "  ####   ####   ####  ",
                " #CCCC# #CCCC# #CCCC# ",
                " #CEEC# #CEEC# #CEEC# ",
                " #CCCC# #CCCC# #CCCC# ",
                "  #CC#   #CC#   #CC#  ",
                "  #CC#   #CC#   #CC#  ",
                "   #CC#  #CC#  #CC#   ",
                "   #CC#  #CC#  #CC#   ",
                "    #CC##CCCC##CC#    ",
                "    #CCCCCCCCCCCC#    ",
                "   #CCCCCCCCCCCCCC#   ",
                "  #CCCCLLLLLLLLCCCC#  ",
                "  #CCCCLLLLLLLLCCCC#  ",
                "  #CCCCLLLLLLLLCCCC#  ",
                "   #CCCLLLLLLLLCCC#   ",
                "    #CCCCCCCCCCCC#    ",
                "     #CCCCCCCCCC#     ",
                "      #CCCCCCCC#      ",
                "       #CCCCCC#       ",
                "        #CCCC#        ",
                "         #CC#         ",
                "          ##          "
            ];
            const colors = { 
                '#': '#082f49', 
                'C': '#0ea5e9', 
                'L': '#7dd3fc', 
                'E': '#f43f5e'
            };
            this.drawPixelSprite(ctx, -12 * s, -22 * s, grid, colors, s);
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
                "   ###                ####  ",
                "  #HHH#              #WWWW# ",
                " #RRRRR#   ######   #WWWWWW#",
                " #RRE ER# #RRRRRR#  #WWWWWW#",
                " #RRRTRRR##RRRRRRRR##WWWWWW#",
                " #RRRRRRR#RRRRRRRRRR#WWWWWW#",
                "  #RRRRRRRRRRRRRRRRR#WWWWW# ",
                "   #RRRRRRRRRRRRRRRR##WWW#  ",
                "    #RRRRRRRRRRRRRRRR##W#   ",
                "     #RRRRRRYYYYRRRRR##     ",
                "      #RRRRYYYYYYRRRR#      ",
                "      #RRRYYYYYYYYRRR#      ",
                "      #RRYYYYYYYYYYRR#      ",
                "      #RYYYYYYYYYYYYRR#     ",
                "      #RRYYYYYYYYYYRRR#     ",
                "      #RRRRRRRRRRRRRRR#     ",
                "       #RRRRR##RRRRRR#      ",
                "       #RRRR#  #RRRR#       ",
                "       #RRRR#  #RRRR#       ",
                "       ######  ######       ",
                "                            ",
                "                            "
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
        }
        
        ctx.restore();
        
        // Draw active spell visual effect
        this.renderEffect(ctx);

        // --- Floating Damage/Heal Numbers ---
        const now = Date.now();
        this.floatingNumbers = this.floatingNumbers.filter(n => now - n.startTime < 1000);
        
        ctx.save();
        ctx.font = "bold 24px 'Press Start 2P'";
        this.floatingNumbers.forEach(n => {
            const elapsed = now - n.startTime;
            const progress = elapsed / 1000;
            const dy = progress * 100;
            const alpha = 1 - progress;
            
            ctx.globalAlpha = alpha;
            ctx.fillStyle = n.color;
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 4;
            ctx.textAlign = "center";
            ctx.strokeText(n.value, n.x, n.y - dy);
            ctx.fillText(n.value, n.x, n.y - dy);
        });
        ctx.restore();
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
                <h3>Hero</h3>
                <div class="stat-bar">
                    <div class="stat-fill hp-fill" style="width:${(h.hp/h.maxHp)*100}%"></div>
                    <div class="stat-label">HP: ${h.hp} / ${h.maxHp}</div>
                </div>
                <div class="stat-bar">
                    <div class="stat-fill mp-fill" style="width:${(h.mp/h.maxMp)*100}%"></div>
                    <div class="stat-label">MP: ${h.mp} / ${h.maxMp}</div>
                </div>
                ${h.armor ? `<div style="font-size:0.6rem; margin-top:5px; color:#94a3b8;">Armor: ${h.armor.name} (+${h.armor.def} DEF)</div>` : ''}
            </div>
            
            <div class="battle-menu glass-panel">
                <button class="battle-btn" id="atk-btn">ATTACK</button>
                <button class="battle-btn" id="mag-btn">MAGIC</button>
                <button class="battle-btn" id="run-btn">RUN</button>
            </div>
            
            <div class="enemy-hud glass-panel" style="position: absolute; top: 20px; right: 20px; min-width: 200px;">
                <h3>${e.name}</h3>
                <div class="stat-bar">
                    <div class="stat-fill hp-fill" style="width:${(e.hp/e.maxHp)*100}%"></div>
                    <div class="stat-label">HP: ${Math.max(0, e.hp)} / ${e.maxHp}</div>
                </div>
                ${e.drop ? `<div style="font-size:0.6rem; margin-top:5px; color:#fbbf24;">Possible Drop: ${e.drop.name} (${e.drop.chance}%)</div>` : ''}
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

    tryEscape() {
        if (this.turn !== 'PLAYER' || this.activeEffect) return;

        if (this.encounterType === 'dragon') {
            showModal("You cannot flee from the Great Guardian!");
            return;
        }

        const roll = Math.random() * 100;
        if (roll < this.escapeChance) {
            this.endBattle("You managed to escape with your life!");
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
            if (this.player.stats.charClass === 'mage') cost = Math.max(1, Math.floor(cost / 2));
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
        if (this.player.stats.charClass === 'mage') cost = Math.max(1, Math.floor(cost / 2));
        this.player.stats.mp -= cost;
        this.activeEffect = { id: spell.id, startTime: Date.now(), duration: 800 };
        this.uiLayer.innerHTML = ''; // Hide UI while casting
        
        setTimeout(() => {
            const pX = window.innerWidth * 0.25;
            const pY = window.innerHeight * 0.5;
            const eX = this.enemy.x;
            const eY = this.enemy.y;

            if (spell.type === 'lifesteal') {
                this.enemy.hp -= spell.dmg;
                const healAmt = Math.floor(spell.dmg / 2);
                this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + healAmt);
                this.addFloatingNumber(eX + (Math.random()*40-20), eY - 50, `-${spell.dmg}`, "#8b5cf6");
                setTimeout(() => this.addFloatingNumber(pX + (Math.random()*40-20), pY - 50, `+${healAmt}`, "#22c55e"), 400);
                console.log(`Lifesteal! Dealt ${spell.dmg} and healed ${healAmt}!`);
            } else if (spell.dmg >= 0) {
                // Damage
                this.enemy.hp -= spell.dmg;
                this.addFloatingNumber(eX + (Math.random()*40-20), eY - 50, `-${spell.dmg}`, "#ef4444");
                console.log(`You cast ${spell.name} for ${spell.dmg} damage!`);
            } else {
                // Heal
                const healAmt = Math.abs(spell.dmg);
                this.player.stats.hp = Math.min(this.player.stats.maxHp, this.player.stats.hp + healAmt);
                this.addFloatingNumber(pX + (Math.random()*40-20), pY - 50, `+${healAmt}`, "#22c55e");
                console.log(`You cast ${spell.name} and healed ${healAmt} HP!`);
            }
            
            this.activeEffect = null;
            this.checkWin();
            
            if (this.active) {
                this.turn = 'ENEMY';
                this.renderMenu();
                this.enemyTurn();
            }
        }, 800);
    }

    attack() {
        if (this.turn !== 'PLAYER' || this.activeEffect) return;
        
        this.activeEffect = { id: 'slash', startTime: Date.now(), duration: 700 };
        this.uiLayer.innerHTML = '';
        
        setTimeout(() => {
            let dmg = Math.max(1, this.player.stats.atk - this.enemy.def);
            let msg = `Dealt ${dmg} damage!`;
            
            // Berserker Passive (20% Crit)
            if (this.player.stats.charClass === 'berserker' && Math.random() < 0.20) {
                dmg *= 2;
                msg = `CRITICAL HIT! Dealt ${dmg} damage!`;
            }

            this.enemy.hp -= dmg;
            this.addFloatingNumber(this.enemy.x + (Math.random()*40-20), this.enemy.y - 50, `-${dmg}`, "#ef4444");
            console.log(msg);

            // Rogue Passive (Double Attack)
            let willHitAgain = false;
            if (this.player.stats.charClass === 'rogue' && !this.rogueSecondHitDone && this.enemy.hp > 0) {
                willHitAgain = true;
                this.rogueSecondHitDone = true;
                console.log("Rogue strikes again!");
            } else {
                this.rogueSecondHitDone = false; // reset
            }
            
            this.activeEffect = null;
            this.checkWin();
            
            if (this.active) {
                if (willHitAgain) {
                    this.attack(); // Instantly chain into 2nd attack logic
                } else {
                    this.turn = 'ENEMY';
                    this.enemyTurn();
                }
            }
        }, 700); // extended for cinematic slash effect
    }

    enemyTurn() {
        this.uiLayer.innerHTML = '';
        // Pick a unique effect per enemy type
        const enemyEffectMap = {
            skeleton: ['enemy_arrow'],
            slime:    ['enemy_acid'],
            demon:    ['enemy_cleave'],
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
            let totalDef = this.player.stats.def + (this.player.stats.armor ? this.player.stats.armor.def : 0);
            let dmg = Math.max(1, this.enemy.atk - totalDef);
            
            // Adjust damage based on attack type
            if (effectId === 'enemy_dragon_nova') dmg = Math.floor(dmg * 1.5);
            if (effectId === 'enemy_tail_swipe') dmg = Math.floor(dmg * 0.8);

            // Knight Passive (25% Block)
            if (this.player.stats.charClass === 'knight' && Math.random() < 0.25) {
                dmg = Math.floor(dmg / 2);
                console.log(`🛡️ Blocked! Enemy used ${effectId.replace('enemy_', '')} and dealt only ${dmg} damage!`);
            } else {
                console.log(`Enemy used ${effectId.replace('enemy_', '')} and dealt ${dmg} damage!`);
            }
            
            this.player.stats.hp -= dmg;
            this.addFloatingNumber(window.innerWidth * 0.25 + (Math.random()*40-20), window.innerHeight * 0.5 - 50, `-${dmg}`, "#ef4444");
            
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
                this.renderMenu();
            }
        }, 800);
    }

    checkWin() {
        if (this.enemy.hp <= 0) {
            let messages = [];
            if (this.enemy.type === 'dragon') {
                this.player.stats.dragonDefeated = true;
                messages.push(`⭐ YOU SLAIN THE BOSS! THE GATE UNSEALS ⭐`);
            }
            this.player.stats.kills = (this.player.stats.kills || 0) + 1;
            const expReward = Math.floor(Math.random() * 10) + 10;
            const goldReward = Math.floor(Math.random() * 5) + 5;
            messages.push(`Victory! Gained ${expReward} EXP and ${goldReward} Gold.`);
            
            this.player.stats.gold += goldReward;
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
            
            const gameOverMsg = `GAME OVER\n\nYour ${entry.charClass} fell on World ${entry.worldId}.\nKills: ${entry.kills} | Time: ${Math.floor(entry.timePlayed/60)}m ${entry.timePlayed%60}s | Level: ${entry.level}\n\nYour run has been recorded.`;
            showModal(gameOverMsg, () => {
                localStorage.removeItem('aethelgard_save');
                window.location.reload();
            });
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
        this.player.stats.hp = this.player.stats.maxHp;
        this.uiLayer.innerHTML = '';
        showModal(msg, () => {
            window.dispatchEvent(new CustomEvent('battleEnd'));
        });
    }
}
