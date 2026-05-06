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
                this.data[y][x] = 0; // Back to Grass
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

        // Place 3-5 Chests (8) in the wild
        let chestsPlaced = 0;
        const targetChests = 3 + Math.floor(Math.random() * 3);
        while (chestsPlaced < targetChests) {
            const rx = Math.floor(Math.random() * (this.width - 2)) + 1;
            const ry = Math.floor(Math.random() * (this.height - 2)) + 1;
            // Place only on grass (0) or forest (4) outside town
            if ((this.data[ry][rx] === 0 || this.data[ry][rx] === 4) && (rx < 5 || rx > 15 || ry < 5 || ry > 15)) {
                this.data[ry][rx] = 8;
                chestsPlaced++;
            }
        }
    }

    isWalkable(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
        const t = this.data[y][x];
        // 0(Floor), 2(Shop), 3(Path), 4(Flora), 6(Teleporter), 7(BossLair)
        // Note: World 2 magmas acting as flora/obstacles are unwalkable. Let's make 4 always WALKABLE except visually it could be magma. Wait, magma should block. If World 2, t=4 blocks.
        if (this.worldId === 2 && t === 4) return false; // Magma blocks in world 2
        if (this.worldId === 5 && t === 4) return false; // Pillars block in world 5
        // 8 is Chest (Walkable)
        return t === 0 || t === 2 || t === 3 || t === 4 || t === 6 || t === 7 || t === 8;
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
                
                ctx.save();
                ctx.translate(offsetX + x * this.tileSize, offsetY + y * this.tileSize);
                
                if (type === 0) {
                    ctx.fillStyle = basePath;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    const seed = (x * 7 + y * 13) % 10;
                    
                    if (this.worldId === 2) {
                        // W2 Burnt Ground Details (Embers and Ash)
                        ctx.fillStyle = 'rgba(0,0,0,0.2)';
                        if (seed > 7) {
                            ctx.fillRect(10, 10, 12, 4); // Ash patch
                        }
                        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'; // Red glow/embers
                        if (seed % 4 === 0) {
                            ctx.fillRect(40, 20, 4, 4);
                            ctx.fillRect(15, 45, 3, 3);
                        }
                    } else if (this.worldId === 3) {
                        // W3 Snowy Ground Details (Snowflakes and Ice)
                        ctx.fillStyle = '#ffffff';
                        if (seed > 6) {
                            // Small snowflake-like cross
                            ctx.fillRect(20, 20, 4, 1);
                            ctx.fillRect(21, 19, 1, 4);
                        }
                        ctx.fillStyle = 'rgba(186, 230, 253, 0.3)';
                        if (seed % 3 === 0) {
                            ctx.fillRect(40, 40, 6, 2); // Ice patch
                        }
                    } else {
                        // Original Grass Details
                        ctx.fillStyle = 'rgba(0,0,0,0.08)';
                        if (seed > 7) {
                            ctx.fillRect(10, 10, 6, 4);
                            ctx.fillRect(40, 40, 6, 4);
                        } else if (seed > 4) {
                            ctx.fillRect(20, 30, 4, 6);
                            ctx.fillRect(45, 12, 4, 6);
                        }
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                        if (seed % 3 === 0) {
                            ctx.fillRect(32, 32, 2, 2);
                            ctx.fillRect(8, 50, 2, 2);
                        }
                    }
                } else if (type === 1) {
                    ctx.fillStyle = basePath;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    if (this.worldId === 1) {
                        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                            // Ambient Ground Shadow
                            ctx.fillStyle = 'rgba(0,0,0,0.2)';
                            ctx.beginPath();
                            ctx.ellipse(32, 58, 30, 8, 0, 0, Math.PI * 2);
                            ctx.fill();

                            // Back/Secondary Peak (Left)
                            ctx.fillStyle = '#475569';
                            ctx.beginPath();
                            ctx.moveTo(0, 60); ctx.lineTo(16, 20); ctx.lineTo(36, 60); ctx.fill();
                            
                            // Main Peak
                            ctx.fillStyle = '#334155'; // Dark slate
                            ctx.beginPath();
                            ctx.moveTo(10, 60);
                            ctx.lineTo(36, 4); // Tall peak
                            ctx.lineTo(60, 60);
                            ctx.closePath();
                            ctx.fill();

                            // Main Peak Right Shading
                            ctx.fillStyle = '#1e293b'; // Even darker
                            ctx.beginPath();
                            ctx.moveTo(36, 4);
                            ctx.lineTo(60, 60);
                            ctx.lineTo(34, 60);
                            ctx.lineTo(34, 40); // slight jaggedness down the middle
                            ctx.lineTo(38, 30);
                            ctx.closePath();
                            ctx.fill();

                            // Snow Cap (Main Peak)
                            ctx.fillStyle = '#f8fafc'; // Pure white snow
                            ctx.beginPath();
                            ctx.moveTo(36, 4);
                            ctx.lineTo(26, 26);
                            ctx.lineTo(31, 21);
                            ctx.lineTo(36, 28);
                            ctx.lineTo(42, 20);
                            ctx.lineTo(46, 26);
                            ctx.closePath();
                            ctx.fill();

                            // Snow Cap Shadow (Right side)
                            ctx.fillStyle = '#cbd5e1'; 
                            ctx.beginPath();
                            ctx.moveTo(36, 4);
                            ctx.lineTo(36, 28);
                            ctx.lineTo(42, 20);
                            ctx.lineTo(46, 26);
                            ctx.closePath();
                            ctx.fill();
                            
                            // Snow Cap (Secondary Peak)
                            ctx.fillStyle = '#f8fafc';
                            ctx.beginPath();
                            ctx.moveTo(16, 20);
                            ctx.lineTo(10, 32);
                            ctx.lineTo(16, 28);
                            ctx.lineTo(22, 32);
                            ctx.closePath();
                            ctx.fill();
                        } else {
                            // Classic Scattered Stone
                            ctx.fillStyle = 'rgba(0,0,0,0.2)';
                            ctx.beginPath();
                            ctx.ellipse(32, 54, 28, 10, 0, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillStyle = '#475569';
                            ctx.beginPath();
                            ctx.moveTo(10, 55);
                            ctx.lineTo(15, 30);
                            ctx.lineTo(32, 10);
                            ctx.lineTo(50, 25);
                            ctx.lineTo(58, 55);
                            ctx.closePath();
                            ctx.fill();
                            ctx.fillStyle = '#1e293b';
                            ctx.beginPath();
                            ctx.moveTo(32, 10);
                            ctx.lineTo(50, 25);
                            ctx.lineTo(58, 55);
                            ctx.lineTo(32, 55);
                            ctx.closePath();
                            ctx.fill();
                            ctx.fillStyle = '#94a3b8';
                            ctx.beginPath();
                            ctx.moveTo(10, 55);
                            ctx.lineTo(15, 30);
                            ctx.lineTo(32, 10);
                            ctx.lineTo(32, 35);
                            ctx.lineTo(15, 55);
                            ctx.closePath();
                            ctx.fill();
                            ctx.strokeStyle = '#0f172a';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(25, 25); ctx.lineTo(35, 45);
                            ctx.moveTo(45, 35); ctx.lineTo(40, 50);
                            ctx.fill();
                        }
                    } else if (this.worldId === 2) {
                        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                            // Volcanic Mountain Border (Massive Peaks)
                            ctx.fillStyle = 'rgba(0,0,0,0.4)';
                            ctx.beginPath();
                            ctx.ellipse(32, 60, 32, 10, 0, 0, Math.PI * 2);
                            ctx.fill();

                            // Far Peak (Darker)
                            ctx.fillStyle = '#1c1917';
                            ctx.beginPath();
                            ctx.moveTo(-10, 60); ctx.lineTo(15, 10); ctx.lineTo(40, 60); ctx.fill();

                            // Main Peak
                            ctx.fillStyle = '#292524';
                            ctx.beginPath();
                            ctx.moveTo(10, 64); ctx.lineTo(36, -10); ctx.lineTo(70, 64); ctx.closePath();
                            ctx.fill();

                            // Lava Flow on Main Peak
                            ctx.fillStyle = '#ea580c';
                            ctx.beginPath();
                            ctx.moveTo(36, -10); ctx.lineTo(40, 20); ctx.lineTo(32, 40); ctx.lineTo(36, 64);
                            ctx.lineTo(32, 64); ctx.lineTo(28, 40); ctx.lineTo(34, 20); ctx.closePath();
                            ctx.fill();
                            
                            // Smoke Particles
                            const time = Date.now() / 800;
                            ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
                            for(let i=0; i<3; i++) {
                                const sy = (time + i * 0.4) % 1;
                                const sx = Math.sin(time * 2 + i) * 10;
                                ctx.beginPath();
                                ctx.arc(36 + sx, -10 - sy * 40, 10 * (1-sy), 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Shading
                            ctx.fillStyle = 'rgba(0,0,0,0.3)';
                            ctx.beginPath();
                            ctx.moveTo(36, -10); ctx.lineTo(70, 64); ctx.lineTo(36, 64); ctx.closePath();
                            ctx.fill();
                        } else {
                            // Volcanic Jagged Rocks (Inner Map)
                            ctx.fillStyle = 'rgba(0,0,0,0.3)';
                            ctx.beginPath();
                            ctx.ellipse(32, 54, 28, 10, 0, 0, Math.PI * 2);
                            ctx.fill();

                            ctx.fillStyle = '#1c1917';
                            ctx.beginPath();
                            ctx.moveTo(8, 55); ctx.lineTo(12, 25); ctx.lineTo(32, 8);
                            ctx.lineTo(52, 22); ctx.lineTo(58, 55); ctx.closePath();
                            ctx.fill();

                            ctx.strokeStyle = '#ea580c';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(25, 30); ctx.lineTo(35, 50);
                            ctx.moveTo(45, 35); ctx.lineTo(40, 52);
                            ctx.stroke();

                            ctx.fillStyle = '#44403c';
                            ctx.beginPath();
                            ctx.moveTo(8, 55); ctx.lineTo(12, 25); ctx.lineTo(32, 8);
                            ctx.lineTo(32, 35); ctx.lineTo(12, 55); ctx.closePath();
                            ctx.fill();
                        }
                    } else if (this.worldId === 3) {
                        if (x === 0 || x === this.width - 1 || y === 0 || y === this.height - 1) {
                            // W3 Frozen Mountain Border
                            ctx.fillStyle = 'rgba(186, 230, 253, 0.3)';
                            ctx.beginPath();
                            ctx.ellipse(32, 60, 30, 8, 0, 0, Math.PI * 2);
                            ctx.fill();

                            // Back Peak
                            ctx.fillStyle = '#7dd3fc';
                            ctx.beginPath();
                            ctx.moveTo(0, 60); ctx.lineTo(16, 15); ctx.lineTo(36, 60); ctx.fill();

                            // Main Peak
                            ctx.fillStyle = '#e0f2fe';
                            ctx.beginPath();
                            ctx.moveTo(10, 64); ctx.lineTo(36, 2); ctx.lineTo(60, 64); ctx.closePath();
                            ctx.fill();

                            // Ice Shading
                            ctx.fillStyle = '#38bdf8';
                            ctx.beginPath();
                            ctx.moveTo(36, 2); ctx.lineTo(60, 64); ctx.lineTo(34, 64); ctx.closePath();
                            ctx.fill();
                        } else {
                            // W3 Ice Blocks (Inner)
                            ctx.fillStyle = 'rgba(186, 230, 253, 0.6)'; // Translucent blue
                            ctx.fillRect(4, 4, 56, 56);
                            
                            // Frosty edges
                            ctx.strokeStyle = '#ffffff';
                            ctx.lineWidth = 2;
                            ctx.strokeRect(6, 6, 52, 52);
                            
                            // Internal cracks
                            ctx.strokeStyle = 'rgba(255,255,255,0.4)';
                            ctx.beginPath();
                            ctx.moveTo(10, 15); ctx.lineTo(30, 45);
                            ctx.moveTo(40, 10); ctx.lineTo(20, 50);
                            ctx.stroke();

                            // Shine
                            ctx.fillStyle = 'rgba(255,255,255,0.8)';
                            ctx.fillRect(12, 12, 10, 3);
                            ctx.fillRect(12, 15, 3, 10);
                        }
                    }
                } else if (type === 3) {
                    ctx.fillStyle = roadColor;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    ctx.fillStyle = 'rgba(0,0,0,0.15)';
                    for (let i = 0; i < 3; i++) {
                        const px = ((x * 17 + i * 23) % 40) + 12;
                        const py = ((y * 11 + i * 31) % 40) + 12;
                        ctx.fillRect(px, py, 8, 5);
                    }
                    ctx.fillStyle = 'rgba(255,255,255,0.05)';
                    for (let i = 0; i < 2; i++) {
                        const px = ((x * 3 + i * 47) % 40) + 12;
                        const py = ((y * 5 + i * 19) % 40) + 12;
                        ctx.fillRect(px, py, 6, 3);
                    }
                } else if (type === 4) {
                    ctx.fillStyle = basePath;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    if (this.worldId === 1) {
                        // Soft round shadow for tree
                        ctx.fillStyle = 'rgba(0,0,0,0.25)';
                        ctx.beginPath();
                        ctx.ellipse(32, 58, 26, 12, 0, 0, Math.PI * 2);
                        ctx.fill();
                        
                        const sway = Math.sin(Date.now() / 1000 + (x * 7 + y * 3)) * 2;
                        ctx.save();
                        ctx.translate(32, 60);
                        ctx.rotate(sway * Math.PI / 180);
                        ctx.translate(-32, -60);
                        ctx.fillStyle = '#451a03';
                        ctx.fillRect(26, 40, 12, 20);
                        ctx.fillStyle = '#78350f';
                        ctx.fillRect(26, 40, 8, 20);
                        const drawLeafLayer = (yOff, width, height, clr, clrDark) => {
                            ctx.fillStyle = clrDark;
                            ctx.fillRect(32 - width/2, yOff, width, height);
                            ctx.fillStyle = clr;
                            ctx.fillRect(32 - width/2, yOff, width * 0.7, height);
                        };
                        drawLeafLayer(30, 52, 16, '#166534', '#064e3b');
                        drawLeafLayer(18, 40, 14, '#15803d', '#14532d');
                        drawLeafLayer(4, 24, 16, '#22c55e', '#15803d');
                        ctx.fillStyle = '#4ade80';
                        ctx.fillRect(28, 8, 4, 4);
                        ctx.fillRect(20, 22, 4, 4);
                        ctx.fillRect(16, 34, 4, 4);
                        ctx.restore();
                    } else if (this.worldId === 2) {
                        // Premium Animated Magma Pool
                        const time = Date.now() / 1000;
                        const pulse = Math.sin(time + (x * 0.5 + y * 0.3)) * 4;
                        
                        // Dark Volcanic Rock Border
                        ctx.fillStyle = '#1c1917';
                        ctx.fillRect(2, 2, 60, 60);
                        
                        // Molten Base
                        ctx.fillStyle = '#ea580c';
                        ctx.fillRect(6, 6, 52, 52);
                        
                        // Glowing Core
                        ctx.fillStyle = '#fb923c';
                        ctx.fillRect(12 + pulse/2, 12 + pulse/2, 40 - pulse, 40 - pulse);
                        
                        // Animated Bubbles
                        ctx.fillStyle = '#fef08a';
                        for(let i=0; i<2; i++) {
                            const bSeed = (x * 13 + y * 17 + i * 31);
                            const bTime = (time * 1.5 + bSeed * 0.1) % 4;
                            if (bTime < 2) { // Only show bubble for part of the cycle
                                const bx = 15 + (bSeed % 34);
                                const by = 15 + ((bSeed * 7) % 34);
                                const bSize = Math.sin(bTime * Math.PI) * 4;
                                if (bSize > 0) {
                                    ctx.beginPath();
                                    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                        }
                        
                        // Heat distortion highlights
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(10, 10); ctx.lineTo(20, 10);
                        ctx.moveTo(10, 10); ctx.lineTo(10, 20);
                        ctx.stroke();
                    } else if (this.worldId === 3) {
                        // Premium Crystal Spires
                        const time = Date.now() / 1000;
                        const pulse = Math.sin(time * 2 + (x * 0.3 + y * 0.7)) * 4;
                        
                        ctx.fillStyle = 'rgba(0,0,0,0.1)';
                        ctx.beginPath();
                        ctx.ellipse(32, 58, 20, 8, 0, 0, Math.PI * 2);
                        ctx.fill();

                        // Main Crystal Body
                        const drawCrystal = (xOff, yOff, w, h, clr, clrL) => {
                            ctx.fillStyle = clr;
                            ctx.beginPath();
                            ctx.moveTo(xOff, yOff + h);
                            ctx.lineTo(xOff - w/2, yOff + h/2);
                            ctx.lineTo(xOff, yOff);
                            ctx.lineTo(xOff + w/2, yOff + h/2);
                            ctx.closePath();
                            ctx.fill();
                            
                            ctx.fillStyle = clrL;
                            ctx.beginPath();
                            ctx.moveTo(xOff, yOff);
                            ctx.lineTo(xOff, yOff + h);
                            ctx.lineTo(xOff + w/2, yOff + h/2);
                            ctx.closePath();
                            ctx.fill();
                        };

                        // Central Spire
                        drawCrystal(32, 4 + pulse, 24, 52, '#0ea5e9', '#7dd3fc');
                        // Smaller Side Crystals
                        drawCrystal(16, 24 - pulse, 12, 30, '#0284c7', '#38bdf8');
                        drawCrystal(48, 20 + pulse, 14, 34, '#0284c7', '#38bdf8');

                        // Magical sparkles
                        ctx.fillStyle = '#ffffff';
                        if (Math.sin(time * 4 + x) > 0.8) {
                            ctx.fillRect(30 + Math.cos(time*5)*10, 20 + Math.sin(time*5)*10, 2, 2);
                        }
                    } else if (this.worldId === 4) {
                        ctx.fillStyle = '#1e1b4b';
                        ctx.beginPath();
                        ctx.arc(32, 40, 20, 0, Math.PI*2);
                        ctx.fill();
                        ctx.fillStyle = '#4c1d95';
                        ctx.beginPath();
                        ctx.arc(32, 32, 12, 0, Math.PI*2);
                        ctx.fill();
                    } else if (this.worldId === 5) {
                        ctx.fillStyle = '#d97706';
                        ctx.fillRect(16, 8, 32, 56);
                        ctx.fillStyle = '#fde047';
                        ctx.fillRect(20, 0, 24, 64);
                        ctx.fillStyle = '#fffbeb';
                        ctx.fillRect(24, 20, 16, 4);
                        ctx.fillRect(24, 40, 16, 4);
                    }
                } else if (type === 2 || type === 5) {
                    // Premium Village House / Shop
                    ctx.fillStyle = (type === 2) ? roadColor : basePath;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);

                    // Ambient Occlusion / Soft Ground Shadow
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.beginPath();
                    ctx.ellipse(32, 58, 35, 12, 0, 0, Math.PI * 2);
                    ctx.fill();

                    // Main Foundation / Base
                    ctx.fillStyle = '#451a03';
                    ctx.fillRect(6, 52, 52, 8);

                    // Main Walls (Timber-frame style)
                    ctx.fillStyle = (type === 2) ? '#fef3c7' : '#f4f4f5'; 
                    ctx.fillRect(8, 26, 48, 30);
                    
                    // Detailed Wood Framing
                    ctx.fillStyle = '#451a03';
                    ctx.fillRect(8, 26, 4, 34);  // Left beam
                    ctx.fillRect(52, 26, 4, 34); // Right beam
                    ctx.fillRect(8, 42, 48, 3);  // Middle crossbeam
                    ctx.fillRect(28, 26, 8, 34); // Vertical center beam

                    // Windows (with glowing glass)
                    ctx.fillStyle = '#1e293b'; // Frame
                    ctx.fillRect(14, 30, 10, 10);
                    ctx.fillRect(40, 30, 10, 10);
                    ctx.fillStyle = '#fbbf24'; // Inner glow
                    ctx.fillRect(15, 31, 3, 3);
                    ctx.fillRect(41, 31, 3, 3);

                    // Door (Detailed)
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(26, 44, 12, 16);
                    ctx.fillStyle = '#fbbf24'; // Handle
                    ctx.fillRect(35, 52, 2, 2);

                    // Roof (Detailed Shingles)
                    const roofClr = (type === 2) ? '#991b1b' : '#1e3a8a';
                    const roofDark = (type === 2) ? '#7f1d1d' : '#1e1b4b';
                    
                    ctx.beginPath();
                    ctx.moveTo(32, 2);
                    ctx.lineTo(0, 28);
                    ctx.lineTo(64, 28);
                    ctx.closePath();
                    
                    ctx.fillStyle = roofClr;
                    ctx.fill();
                    
                    // Roof Shading & Shingles (Clipped to roof triangle)
                    ctx.save();
                    ctx.clip();
                    
                    ctx.fillStyle = roofDark;
                    for (let i = 0; i < 6; i++) {
                        ctx.fillRect(2 + i * 12, 22, 8, 2);
                        ctx.fillRect(8 + i * 12, 16, 8, 2);
                        ctx.fillRect(14 + i * 12, 10, 8, 2);
                        ctx.fillRect(20 + i * 12, 4, 8, 2);
                    }
                    
                    ctx.restore();

                    // Shop Signboard
                    if (type === 2) {
                        ctx.fillStyle = '#451a03';
                        ctx.fillRect(48, 12, 2, 14);
                        ctx.fillStyle = '#fbbf24';
                        ctx.fillRect(44, 10, 10, 8);
                        ctx.fillStyle = '#000000';
                        ctx.fillRect(46, 12, 6, 2);
                    }
                } else if (type === 3) {
                    // Premium Road / Dirt Path
                    ctx.fillStyle = roadColor;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    
                    // Road Edges (Stone lined)
                    ctx.fillStyle = 'rgba(0,0,0,0.15)';
                    ctx.fillRect(0, 0, 8, 64);
                    ctx.fillRect(56, 0, 8, 64);
                    
                    // Gravel & Puddles
                    ctx.fillStyle = 'rgba(69, 26, 3, 0.2)';
                    for (let i = 0; i < 4; i++) {
                        const px = ((x * 13 + i * 17) % 40) + 12;
                        const py = ((y * 7 + i * 29) % 40) + 12;
                        ctx.fillRect(px, py, 10, 6);
                    }
                    
                    // Stone Pebbles
                    ctx.fillStyle = '#94a3b8';
                    const sSeed = (x * 7 + y * 11) % 6;
                    if (sSeed > 3) {
                        ctx.fillRect(12, 12, 4, 4);
                        ctx.fillRect(48, 48, 4, 4);
                    }
                } else if (type === 6) {
                    // Teleporter (Glowing Portal)
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    const pulse = Math.sin(Date.now() / 300) * 5;
                    ctx.fillStyle = '#7c3aed'; // Purple glow
                    ctx.beginPath();
                    ctx.arc(32, 32, 20 + pulse, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = '#c084fc'; // Core
                    ctx.beginPath();
                    ctx.arc(32, 32, 10, 0, Math.PI * 2);
                    ctx.fill();
                } else if (type === 7) {
                    // Boss Lair (Ominous Gate)
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    const intensity = 0.5 + Math.sin(Date.now() / 200) * 0.2;
                    ctx.fillStyle = `rgba(239, 68, 68, ${intensity})`; // Red
                    ctx.fillRect(28, 10, 8, 44);
                    ctx.fillRect(10, 28, 44, 8);
                    ctx.strokeStyle = '#fbbf24';
                    ctx.lineWidth = 4;
                    ctx.strokeRect(4, 4, 56, 56);
                } else if (type === 8) {
                    // Ancient Chest (Redesigned)
                    ctx.fillStyle = basePath;
                    ctx.fillRect(0, 0, this.tileSize, this.tileSize);
                    ctx.fillStyle = 'rgba(0,0,0,0.2)';
                    ctx.beginPath();
                    ctx.ellipse(32, 54, 24, 8, 0, 0, Math.PI * 2);
                    ctx.fill();

                    const bob = Math.sin(Date.now() / 400) * 2;
                    ctx.translate(0, bob);
                    ctx.fillStyle = '#451a03';
                    ctx.fillRect(12, 32, 40, 22);
                    ctx.fillStyle = '#78350f';
                    ctx.fillRect(14, 34, 36, 18);
                    ctx.fillStyle = '#451a03';
                    ctx.fillRect(18, 38, 12, 2);
                    ctx.fillRect(35, 45, 10, 2);
                    ctx.fillStyle = '#78350f';
                    ctx.beginPath();
                    ctx.moveTo(10, 32);
                    ctx.quadraticCurveTo(32, 12, 54, 32);
                    ctx.fill();
                    ctx.fillStyle = '#92400e';
                    ctx.beginPath();
                    ctx.moveTo(14, 30);
                    ctx.quadraticCurveTo(32, 18, 50, 30);
                    ctx.fill();
                    ctx.fillStyle = '#fbbf24';
                    ctx.fillRect(14, 24, 4, 30);
                    ctx.fillRect(46, 24, 4, 30);
                    ctx.fillRect(28, 30, 8, 10);
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(31, 34, 2, 4);
                    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
                    ctx.beginPath();
                    ctx.arc(32, 35, 10 + bob, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.translate(0, -bob);
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
