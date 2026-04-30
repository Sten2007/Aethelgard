export class TileMap {
    constructor(worldId = 1) {
        this.worldId = worldId;
        this.tileSize = 64;
        this.width = 50;
        this.height = 50;
        
        this.data = [];
        // Initialize with default grass and outer wall
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                    row.push(1); // Wall
                } else {
                    row.push(0); // Grass
                }
            }
            this.data.push(row);
        }
        
        // Town Area (x: 5-15, y: 5-15)
        for (let y = 5; y <= 15; y++) {
            for (let x = 5; x <= 15; x++) {
                this.data[y][x] = 0; // Default Grass
            }
        }
        
        // Connect paths into specific intersecting streets grid
        const streetH1 = 8, streetH2 = 13;
        const streetV1 = 8, streetV2 = 13;
        
        for (let y = 5; y <= 15; y++) {
            for (let x = 5; x <= 15; x++) {
                if (x === streetV1 || x === streetV2 || y === streetH1 || y === streetH2) {
                    this.data[y][x] = 3; // Connected Road
                } else if (Math.random() < 0.4) {
                    this.data[y][x] = 5; // Generic House
                }
            }
        }
        
        // Random Town Shop placement on one of the inner street intersections
        const shopPositions = [ [8,8], [13,8], [8,13], [13,13] ];
        const randomPos = shopPositions[Math.floor(Math.random() * shopPositions.length)];
        this.data[randomPos[1]][randomPos[0]] = 2;

        // Forest Area (everywhere else)
        for (let y = 1; y < this.height - 1; y++) {
            for (let x = 1; x < this.width - 1; x++) {
                // If outside the town bounds
                if (x < 5 || x > 15 || y < 5 || y > 15) {
                    const rnd = Math.random();
                    if (rnd < 0.25) {
                        this.data[y][x] = 4; // Tree
                    } else if (rnd < 0.28) {
                        this.data[y][x] = 1; // Rock
                    }
                }
            }
        }
        
        // Place Boss Lair (7) and Teleporter (6) near bottom right
        this.data[40][40] = 7;
        this.data[40][42] = 6;
    }

    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        const t = this.data[y][x];
        // 0(Floor), 2(Shop), 3(Path), 4(Flora), 6(Teleporter), 7(BossLair)
        // Note: World 2 magmas acting as flora/obstacles are unwalkable. Let's make 4 always WALKABLE except visually it could be magma. Wait, magma should block. If World 2, t=4 blocks.
        if (this.worldId === 2 && t === 4) return false; // Magma blocks in world 2
        if (this.worldId === 5 && t === 4) return false; // Pillars block in world 5
        return t === 0 || t === 2 || t === 3 || t === 4 || t === 6 || t === 7;
    }

    render(ctx, player, state) {
        let basePath = '#4ade80'; // W1 Grass
        let borderPath = '#064e3b';
        let roadColor = '#854d0e'; // W1 Dirt
        let houseBase = '#1e3a8a';
        
        if (this.worldId === 2) {
            basePath = '#451a03'; // W2 Burnt ground
            borderPath = '#27272a';
            roadColor = '#a1a1aa'; // W2 Ash path
            houseBase = '#7f1d1d'; // W2 Blood red brick
        } else if (this.worldId === 3) {
            basePath = '#e0f2fe'; // W3 Snow
            borderPath = '#38bdf8';
            roadColor = '#10b981'; // W3 magic teal road
            houseBase = '#1e40af'; // W3 Ice house
        } else if (this.worldId === 4) {
            basePath = '#2e1065'; // W4 Void Purple
            borderPath = '#0f172a';
            roadColor = '#171717'; // Obsidian path
            houseBase = '#4c1d95'; // Dark portal houses
        } else if (this.worldId === 5) {
            basePath = '#fffbeb'; // W5 Celestial Gold
            borderPath = '#fbbf24';
            roadColor = '#ffffff'; // Pristine Marble
            houseBase = '#fef3c7'; // Golden palaces
        }
        if (state === 'BATTLE') {
            this.renderBattleBackground(ctx);
            return;
        }

        const offsetX = window.innerWidth / 2 - player.realX * this.tileSize - this.tileSize / 2;
        const offsetY = window.innerHeight / 2 - player.realY * this.tileSize - this.tileSize / 2;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const type = this.data[y][x];
                
                // Procedural Tile Drawing
                ctx.save();
                ctx.translate(offsetX + x * this.tileSize, offsetY + y * this.tileSize);
                
                if (type === 0) {
                    // Base floor fill
                    ctx.fillStyle = basePath;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    
                    if (this.worldId === 1) {
                        // Subtle grass variation: darker patches within tile bounds
                        ctx.fillStyle = 'rgba(34,197,94,0.25)';
                        // Use coords as seed for stable noise-like variation
                        const sx = ((x * 7 + y * 3) % 5) * 10;
                        const sy = ((x * 3 + y * 11) % 5) * 10;
                        ctx.fillRect(sx + 2, sy + 2, 14, 10);
                        ctx.fillRect((sx + 20) % 52, (sy + 15) % 52, 10, 8);
                        // Small grass blades (all within 0-64 range)
                        ctx.fillStyle = 'rgba(22,163,74,0.4)';
                        ctx.fillRect(sx + 4, sy + 8, 3, 6);
                        ctx.fillRect((sx + 28) % 56, (sy + 22) % 56, 3, 5);
                    } else if (this.worldId === 2) {
                        // Burnt cracks
                        ctx.fillStyle = 'rgba(0,0,0,0.2)';
                        const cx = ((x * 5 + y * 7) % 6) * 8;
                        const cy = ((x * 11 + y * 5) % 6) * 8;
                        ctx.fillRect(cx + 4, cy + 4, 12, 2);
                        ctx.fillRect((cx + 24) % 56, (cy + 18) % 56, 8, 2);
                    } else if (this.worldId === 3) {
                        // Snow sparkles
                        ctx.fillStyle = 'rgba(255,255,255,0.35)';
                        const sx = ((x * 13 + y * 7) % 6) * 8;
                        const sy = ((x * 7 + y * 13) % 6) * 8;
                        ctx.fillRect(sx + 2, sy + 2, 4, 4);
                        ctx.fillRect((sx + 22) % 56, (sy + 28) % 56, 3, 3);
                    } else if (this.worldId === 4) {
                        // Void pulses
                        ctx.fillStyle = 'rgba(168,85,247,0.15)';
                        const vx = ((x * 9 + y * 17) % 8) * 6;
                        const vy = ((x * 17 + y * 9) % 8) * 6;
                        ctx.beginPath();
                        ctx.arc(vx + 10, vy + 10, 4, 0, Math.PI*2);
                        ctx.fill();
                    } else if (this.worldId === 5) {
                        // Golden aura
                        ctx.fillStyle = 'rgba(251,191,36,0.1)';
                        const gx = ((x * 11 + y * 3) % 4) * 12;
                        const gy = ((x * 3 + y * 11) % 4) * 12;
                        ctx.fillRect(gx, gy, 20, 20);
                    }
                } else if (type === 1) {
                    // Wall/Rock/Ice
                    const grad = ctx.createLinearGradient(0, 0, 0, this.tileSize);
                    grad.addColorStop(0, borderPath);
                    grad.addColorStop(1, '#1e293b');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    
                    if (this.worldId === 1) {
                        ctx.fillStyle = '#94a3b8';
                        ctx.fillRect(4, 4, this.tileSize - 8, this.tileSize - 8);
                    } else if (this.worldId === 3) {
                        ctx.fillStyle = '#bae6fd'; // Ice shard
                        ctx.fillRect(28, 16, 8, 32);
                    }
                } else if (type === 2) {
                    // Town/Shop
                    ctx.fillStyle = roadColor; // Brown path
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    
                    // Shop House
                    ctx.fillStyle = '#dc2626'; // Red roof
                    ctx.beginPath();
                    ctx.moveTo(this.tileSize / 2, 8);
                    ctx.lineTo(8, 24);
                    ctx.lineTo(this.tileSize - 8, 24);
                    ctx.fill();
                    
                    ctx.fillStyle = '#fef08a'; // Yellow walls
                    ctx.fillRect(12, 24, this.tileSize - 24, this.tileSize - 32);
                    
                    // Door
                    ctx.fillStyle = '#451a03';
                    ctx.fillRect(24, 40, 16, 16);
                    
                    // Shop Sign
                    ctx.fillStyle = '#fde047'; 
                    ctx.fillRect(24, 32, 16, 16);
                } else if (type === 3) {
                    // Road
                    ctx.fillStyle = roadColor;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                } else if (type === 4) {
                    // Flora / Obstacles
                    ctx.fillStyle = basePath; // Floor base
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    
                    if (this.worldId === 1) {
                        ctx.fillStyle = '#14532d'; // Shadow base
                        ctx.fillRect(16, 32, 24, 8); 
                        
                        // Trunk
                        ctx.fillStyle = '#78350f';
                        ctx.fillRect(24, 32, 16, 24);
                        
                        // Pine Leaves 
                        ctx.fillStyle = '#166534';
                        ctx.fillRect(16, 24, 32, 16);
                        ctx.fillRect(8, 32, 48, 8); 
                        ctx.fillStyle = '#15803d'; // Highlights
                        ctx.fillRect(24, 16, 16, 16);
                        ctx.fillRect(32, 8, 4, 8);
                    } else if (this.worldId === 2) {
                        // Magma
                        ctx.fillStyle = '#f97316';
                        ctx.fillRect(8, 8, 48, 48);
                        ctx.fillStyle = '#fef08a';
                        ctx.fillRect(16, 16, 16, 16);
                    } else if (this.worldId === 3) {
                        // Crystals
                        ctx.fillStyle = '#0ea5e9';
                        ctx.fillRect(16, 20, 24, 40);
                        ctx.fillStyle = '#38bdf8';
                        ctx.fillRect(20, 10, 16, 30);
                        ctx.fillStyle = '#bae6fd';
                        ctx.fillRect(24, 0, 8, 20);
                    } else if (this.worldId === 4) {
                        // Shadow Orbs
                        ctx.fillStyle = '#1e1b4b';
                        ctx.beginPath();
                        ctx.arc(32, 40, 20, 0, Math.PI*2);
                        ctx.fill();
                        ctx.fillStyle = '#4c1d95';
                        ctx.beginPath();
                        ctx.arc(32, 32, 12, 0, Math.PI*2);
                        ctx.fill();
                    } else if (this.worldId === 5) {
                        // Golden Pillars
                        ctx.fillStyle = '#d97706';
                        ctx.fillRect(16, 8, 32, 56);
                        ctx.fillStyle = '#fde047';
                        ctx.fillRect(20, 0, 24, 64);
                        ctx.fillStyle = '#fffbeb';
                        ctx.fillRect(24, 20, 16, 4);
                        ctx.fillRect(24, 40, 16, 4);
                    }
                } else if (type === 5) {
                    // Generic House
                    ctx.fillStyle = basePath; // Floor
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    
                    // Walls
                    ctx.fillStyle = '#d4d4d8';
                    ctx.fillRect(8, 24, 48, 32);
                    
                    // Roof
                    ctx.fillStyle = houseBase; // Dynamic roof color
                    ctx.beginPath();
                    ctx.moveTo(32, 4);
                    ctx.lineTo(0, 24);
                    ctx.lineTo(64, 24);
                    ctx.fill();
                    
                    // Door
                    ctx.fillStyle = '#451a03';
                    ctx.fillRect(24, 40, 16, 16);
                } else if (type === 6) {
                    // Teleporter
                    ctx.fillStyle = '#2e1065';
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    ctx.fillStyle = '#c084fc';
                    ctx.fillRect(16, 16, 32, 32);
                    ctx.fillStyle = '#fdf4ff';
                    ctx.fillRect(24, 24, 16, 16);
                } else if (type === 7) {
                    // Boss Lair
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    ctx.fillStyle = '#ef4444'; // Red glowing cracks
                    ctx.fillRect(30, 10, 4, 40);
                    ctx.fillRect(10, 30, 40, 4);
                }
                
                ctx.restore();
            }
        }
    }

    renderBattleBackground(ctx) {
        const grad = ctx.createRadialGradient(
            window.innerWidth/2, window.innerHeight/2, 10,
            window.innerWidth/2, window.innerHeight/2, window.innerWidth/2
        );
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

        // Draw some "floor" circle
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.beginPath();
        ctx.ellipse(window.innerWidth/2, window.innerHeight*0.7, 300, 100, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}
