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
            drawX = window.innerWidth * 0.25 - 32;
            drawY = window.innerHeight * 0.5 - 32;
        } else {
            drawX = window.innerWidth / 2 - 32;
            drawY = window.innerHeight / 2 - 32;
        }

        ctx.save();
        ctx.translate(drawX, drawY);

        // Bobbing animation for walking
        const isMoving = Math.abs(this.x - this.realX) > 0.01 || Math.abs(this.y - this.realY) > 0.01;
        const time = Date.now();
        const bob = isMoving ? Math.round(Math.sin(time / 100) * 2) * 2 : 0;
        
        // Shadow stays on the floor
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(16, 56, 32, 8); 
        
        ctx.translate(0, bob);

        const colors = {
            'K': '#0f172a', // Outline
            'S': '#fcd34d', // Skin
            's': '#d97706', // Skin shadow
            'T': '#4f46e5', // Tunic base
            't': '#3730a3', // Tunic shadow
            'L': '#451a03', // Leather/Belt
            'C': '#fbbf24', // Gold/Buckle
            'B': '#1e293b', // Pants
            'W': '#ffffff', // White
            'H': '#78350f', // Hair (Brown)
            'h': '#451a03', // Hair dark
            'A': '#94a3b8', // Armor main
            'a': '#64748b', // Armor dark
            'l': '#cbd5e0', // Armor light
            'M': '#1e3a8a', // Mage dark
            'm': '#3b82f6', // Mage light
        };

        const body = [
            "                ",
            "    KKKKKKKK    ",
            "   KSSSSSSSSK   ",
            "   KSWWSSWWSK   ",
            "   KSKKSSKKSK   ",
            "   KSSSSSSSSK   ",
            "   KSSSSSSSSK   ",
            "    KKKKKKKK    ",
            "   KTTTTTTTTK   ",
            "  KTTTTTTTTTTK  ",
            "  KTTTTTTTTTTK  ",
            "  KLLLLLLLLLLK  ",
            "  KLLLLCCLLLLK  ",
            "   KttttttttK   ",
            "   KBBBKKBBBK   ",
            "   KKKK  KKKK   "
        ];

        const hair = {
            'knight': [
                "    KKKKKKKK    ",
                "   KAAAAAAAAK   ",
                "  KAllllaaaaaK  ",
                "  KAAKAAKAAKaa  ",
                "  KAAKAAKAAKaa  ",
                "   KKKKKKKKKK   "
            ],
            'paladin': [
                "      KKKK      ",
                "     KCCCCK     ",
                "    KAAAAAAAAK  ",
                "   KAllllaaaaaK ",
                "   KAAKAAKAAKaa ",
                "   KAAKAAKAAKaa ",
                "    KKKKKKKKKK  "
            ],
            'mage': [
                "      KKK       ",
                "     KMMMKK     ",
                "    KMMmMMMK    ",
                "   KMMMMMMMMK   ",
                "  KCCCCCCCCCCK  ",
                " KKKKKKKKKKKKKK "
            ],
            'rogue': [
                "    KKKKKKKK    ",
                "   KHHHHHHHHK   ",
                "  KHHHHHHHHHhK  ",
                "  KHH      HhK  ",
                "  KHH      HhK  ",
                "   K        K   "
            ],
            'berserker': [
                "    KKKKKKKK    ",
                "   KHHHHHHHHK   ",
                "  KHHHHHHHHHhK  ",
                "  KHHH    HHhK  ",
                "   KHH    HhK   ",
                "   K        K   "
            ]
        };

        const drawSprite = (sprite) => {
            const size = 4;
            for (let y = 0; y < sprite.length; y++) {
                if (!sprite[y]) continue;
                for (let x = 0; x < sprite[y].length; x++) {
                    const char = sprite[y][x];
                    if (char !== ' ') {
                        ctx.fillStyle = colors[char] || '#ff00ff';
                        ctx.fillRect(x * size, y * size, size, size);
                    }
                }
            }
        };

        // Draw character body
        drawSprite(body);
        
        // Draw hair/helmet
        const classHair = hair[this.stats.charClass] || hair['knight'];
        drawSprite(classHair);

        // Helper for weapons (1 unit = 4px)
        const drawPx = (x, y, w, h, colorKey) => {
            ctx.fillStyle = colors[colorKey] || colorKey;
            ctx.fillRect(x * 4, y * 4, w * 4, h * 4);
        };

        // Weapons overlay
        const c = this.stats.charClass;
        if (c === 'knight') {
            // Sword
            drawPx(12, 3, 4, 9, 'K'); 
            drawPx(13, 4, 2, 6, 'l'); 
            drawPx(12, 10, 4, 2, 'K'); 
            drawPx(13, 10, 2, 1, 'C'); 
            drawPx(13, 11, 2, 1, 'L'); 
            
            // Shield
            drawPx(1, 7, 5, 6, 'K'); 
            drawPx(2, 8, 3, 4, 'A'); 
            drawPx(3, 8, 1, 4, 'l'); 
        } else if (c === 'berserker') {
            // Big Axe
            drawPx(12, 2, 4, 12, 'K'); 
            drawPx(13, 3, 2, 10, 'L'); 
            
            drawPx(8, 2, 7, 6, 'K'); 
            drawPx(9, 3, 5, 4, 'a'); 
            drawPx(13, 3, 1, 4, 'l'); 
        } else if (c === 'rogue') {
            // Daggers
            drawPx(13, 7, 3, 5, 'K'); 
            drawPx(14, 8, 1, 2, 'l'); 
            drawPx(14, 10, 1, 1, 'L'); 

            drawPx(0, 7, 3, 5, 'K'); 
            drawPx(1, 8, 1, 2, 'l'); 
            drawPx(1, 10, 1, 1, 'L'); 
        } else if (c === 'mage') {
            // Staff
            drawPx(12, 1, 4, 13, 'K'); 
            drawPx(13, 2, 2, 11, 'L'); 
            
            drawPx(11, 0, 6, 5, 'K'); 
            drawPx(12, 1, 4, 3, 'm'); 
            drawPx(13, 2, 2, 1, '#ffffff'); 
        } else if (c === 'paladin') {
            // Hammer
            drawPx(12, 3, 4, 10, 'K'); 
            drawPx(13, 4, 2, 8, 'L'); 
            
            drawPx(8, 2, 9, 5, 'K'); 
            drawPx(9, 3, 7, 3, 'A'); 
            drawPx(9, 4, 7, 1, 'C'); 
        }

        ctx.restore();
    }
}
