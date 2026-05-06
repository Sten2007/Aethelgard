export class Player {
    constructor(x, y, charClass) {
        this.x = x; // Target X (tile)
        this.y = y; // Target Y (tile)
        this.realX = x; // Interpolated X
        this.realY = y; // Interpolated Y
        this.size = 64;
        this.speed = 0.15;
        this.moved = false;
        
        this.stats = {
            hp: 100, maxHp: 100,
            mp: 50, maxMp: 50,
            atk: 10, def: 5,
            level: 1, exp: 0, expToNext: 20, gold: 0,
            spells: [],
            charClass: charClass || 'knight',
            worldId: 1,
            dragonDefeated: false,
            kills: 0,
            timePlayed: 0,
            armor: null,
            weapon: null,
            skillPoints: 0,
            masteries: {
                guardian: 0, // Defense & Effect Chance
                arcane: 0,   // Spell Dmg & Duration
                slayer: 0    // Atk & Crit
            },
            discoveredWeapons: [] // Track unique finds
        };
        
        if (this.stats.charClass === 'berserker') {
            this.stats.maxHp = 120; this.stats.hp = 120;
            this.stats.atk = 15; this.stats.def = 2;
        } else if (this.stats.charClass === 'rogue') {
            this.stats.maxHp = 70; this.stats.hp = 70;
            this.stats.atk = 7; this.stats.def = 4;
        } else if (this.stats.charClass === 'mage') {
            this.stats.maxHp = 60; this.stats.hp = 60;
            this.stats.maxMp = 100; this.stats.mp = 100;
            this.stats.atk = 4; this.stats.def = 2;
            this.stats.spells.push({ id: 'fireball', name: 'Fireball', mp: 10, dmg: 20 });
        } else if (this.stats.charClass === 'paladin') {
            this.stats.maxHp = 150; this.stats.hp = 150;
            this.stats.maxMp = 30; this.stats.mp = 30;
            this.stats.atk = 8; this.stats.def = 8;
        }
        
        this.load();
        
        // Ensure numeric fields are valid after load
        this.stats.gold = Math.max(0, Math.floor(Number(this.stats.gold || 0)));
        this.stats.skillPoints = Math.max(0, Math.floor(Number(this.stats.skillPoints || 0)));
        
        // Sync real coords with potentially loaded layout coords
        this.realX = this.x;
        this.realY = this.y;
    }

    addGold(amount) {
        const val = Math.floor(Number(amount) || 0);
        if (val === 0) return;
        this.stats.gold += val;
        if (this.stats.gold < 0) this.stats.gold = 0;
    }

    addSkillPoint(amount = 1) {
        this.stats.skillPoints += amount;
    }

    save() {
        const data = {
            x: this.x,
            y: this.y,
            stats: this.stats
        };
        localStorage.setItem('aethelgard_save', JSON.stringify(data));
    }

    load() {
        const saved = localStorage.getItem('aethelgard_save');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.x = data.x;
                this.y = data.y;
                this.stats = {
                    ...this.stats,
                    ...data.stats,
                    // Ensure nested objects are also merged safely
                    masteries: {
                        ...this.stats.masteries,
                        ...(data.stats ? data.stats.masteries : {})
                    }
                };
            } catch (e) {
                console.error("Save state corrupted", e);
            }
        }
    }

    addExp(amount, messagesOut) {
        if (this.stats.level < 50) {
            this.stats.exp += amount;
            while (this.stats.exp >= this.stats.expToNext && this.stats.level < 50) {
                this.stats.exp -= this.stats.expToNext;
                this.levelUp(messagesOut);
            }
            if (this.stats.level >= 50) {
                this.stats.exp = 0;
            }
        }
    }

    levelUp(messagesOut) {
        this.stats.level++;
        this.stats.expToNext = Math.floor(this.stats.expToNext * 1.5);
        this.stats.maxHp += 10;
        this.stats.hp = this.stats.maxHp;
        this.stats.maxMp += 5;
        this.stats.mp = this.stats.maxMp;
        this.stats.atk += 2;
        this.stats.def += 1;
        this.addSkillPoint(1);
        if (messagesOut) messagesOut.push(`Level Up! Reached level ${this.stats.level}! +1 Skill Point!`);
    }

    update(keys, map, deltaTime) {
        this.moved = false;
        
        // Smooth interpolation
        this.realX += (this.x - this.realX) * this.speed;
        this.realY += (this.y - this.realY) * this.speed;

        // Check if we reached the target tile (mostly)
        if (Math.abs(this.x - this.realX) < 0.01 && Math.abs(this.y - this.realY) < 0.01) {
            let nextX = this.x;
            let nextY = this.y;

            if (keys['KeyW'] || keys['KeyZ'] || keys['ArrowUp']) nextY--;
            else if (keys['KeyS'] || keys['ArrowDown']) nextY++;
            else if (keys['KeyA'] || keys['KeyQ'] || keys['ArrowLeft']) nextX--;
            else if (keys['KeyD'] || keys['ArrowRight']) nextX++;

            if (nextX !== this.x || nextY !== this.y) {
                if (map.isWalkable(nextX, nextY)) {
                    this.lastX = this.x;
                    this.lastY = this.y;
                    this.x = nextX;
                    this.y = nextY;
                    this.moved = true;
                    this.save(); // Save after taking a successful step
                }
            }
        }
    }

    revertMove() {
        if (this.lastX !== undefined && this.lastY !== undefined) {
            this.x = this.lastX;
            this.y = this.lastY;
        } else {
            this.x -= 1;
        }
        this.realX = this.x;
        this.realY = this.y;
    }

    render(ctx, state) {
        let drawX, drawY;
        
        if (state === 'BATTLE') {
            drawX = window.innerWidth * 0.25;
            drawY = window.innerHeight * 0.5;
        } else {
            // Screen center is window.innerWidth / 2, window.innerHeight / 2
            // We want to draw our 64x64 player centered there.
            drawX = window.innerWidth / 2 - 32;
            drawY = window.innerHeight / 2 - 32;
        }

        ctx.save();
        ctx.translate(drawX, drawY);
        
        // Character Body (Pixel Art Hero)
        ctx.fillStyle = '#6366f1'; // Indigo tunic
        ctx.fillRect(16, 20, 32, 28);
        
        // Head / Skin
        ctx.fillStyle = '#fcd34d'; // Skin tone
        ctx.fillRect(18, 6, 28, 20);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(24, 14, 4, 4); // Left eye
        ctx.fillRect(36, 14, 4, 4); // Right eye
        
        // Hair / Helmet
        ctx.fillStyle = '#1e293b'; 
        ctx.fillRect(16, 4, 32, 6);
        ctx.fillRect(14, 8, 4, 10);
        ctx.fillRect(46, 8, 4, 10);
        
        // Legs
        ctx.fillStyle = '#334155';
        ctx.fillRect(20, 48, 8, 10); // Left leg
        ctx.fillRect(36, 48, 8, 10); // Right leg
        
        // Weapon
        if (this.stats.charClass === 'knight') {
            // Sword
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(48, 16, 4, 24); // Blade
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(44, 40, 12, 4); // Hilt crossguard
            ctx.fillStyle = '#451a03';
            ctx.fillRect(48, 44, 4, 8); // Handle
            
            // Shield
            ctx.fillStyle = '#475569';
            ctx.fillRect(4, 24, 12, 20);
            ctx.fillStyle = '#cbd5e0';
            ctx.fillRect(6, 26, 8, 16);
        } else if (this.stats.charClass === 'berserker') {
            // Big Axe
            ctx.fillStyle = '#451a03';
            ctx.fillRect(48, 12, 4, 36); // Handle
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(38, 12, 24, 16); // Axe head
            ctx.fillStyle = '#cbd5e0';
            ctx.fillRect(54, 12, 8, 16); // Blade edge
        } else if (this.stats.charClass === 'rogue') {
            // Dual Daggers
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(48, 24, 4, 12); // Right dagger
            ctx.fillStyle = '#451a03';
            ctx.fillRect(46, 36, 8, 2);
            ctx.fillRect(48, 38, 4, 4);
            
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(0, 24, 4, 12); // Left dagger
            ctx.fillStyle = '#451a03';
            ctx.fillRect(-2, 36, 8, 2);
            ctx.fillRect(0, 38, 4, 4);
        } else if (this.stats.charClass === 'mage') {
            // Staff
            ctx.fillStyle = '#78350f';
            ctx.fillRect(48, 8, 4, 40); // Wooden staff
            ctx.fillStyle = '#3b82f6';
            ctx.fillRect(44, 4, 12, 12); // Crystal
            ctx.fillStyle = '#93c5fd';
            ctx.fillRect(46, 6, 8, 8); // Crystal core
        } else if (this.stats.charClass === 'paladin') {
            // Big Hammer
            ctx.fillStyle = '#451a03';
            ctx.fillRect(48, 20, 4, 28); // Handle
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(40, 8, 20, 12); // Hammer head
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(42, 10, 16, 8); // Gold trim
        }
        
        ctx.restore();
    }
}
