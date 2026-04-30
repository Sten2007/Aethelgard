export class Book {
    constructor(parent) {
        this.parent = parent;
        this.currentPage = 1; // Pre-flip cover so Mechanics shows on left, World I on right

        const bossBox = (color, name, stats, drop) => `
            <div style="background:rgba(0,0,0,0.15);padding:12px;border-radius:4px;border-left:4px solid ${color};margin-top:10px;">
                <p style="margin:0;color:#ef4444;font-weight:bold;font-size:0.95rem;">${name}</p>
                <p style="margin:6px 0 0 0;font-size:0.78rem;opacity:0.8;">${stats}</p>
                <p style="margin:6px 0 0 0;font-size:0.78rem;color:#facc15;">${drop}</p>
            </div>`;

        const denizensTable = (rows) => `
            <table style="font-size:0.75rem;width:100%;margin-top:10px;border-spacing:0 6px;">
                <tr style="color:#93c5fd;"><th>Monster</th><th>HP</th><th>ATK</th><th>Drop</th></tr>
                ${rows}
            </table>`;

        this.pages = [
            {   // Page 0: Cover / Game Mechanics
                isCover: true,
                front: `
                    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;border:4px double #d4af37;padding:20px;">
                        <h1 style="font-size:1.8rem;text-align:center;color:#d4af37;margin-bottom:20px;">THE SAGE'S<br/>CHRONICLE</h1>
                        <div style="font-size:4rem;">📜</div>
                        <p style="margin-top:40px;color:#d4af37;font-size:0.8rem;letter-spacing:0.2em;">AETHELGARD</p>
                    </div>`,
                back: `
                    <h2 style="font-size:1.2rem;">GAME MECHANICS</h2>
                    <p style="font-size:0.82rem;line-height:1.5;">Welcome, Traveler. Master these laws to survive Aethelgard.</p>
                    <h3 style="font-size:0.95rem;margin-top:14px;">MOVEMENT</h3>
                    <ul style="font-size:0.78rem;line-height:1.7;">
                        <li><b>WASD:</b> Move through the world tiles.</li>
                        <li><b>Yellow tiles:</b> Enter Towns to shop & heal.</li>
                        <li><b>Purple tiles:</b> Teleporters to next world.</li>
                        <li><b>Black tiles:</b> Boss Lairs — enter at your own risk!</li>
                    </ul>
                    <h3 style="font-size:0.95rem;margin-top:14px;">COMBAT & LOOT</h3>
                    <ul style="font-size:0.78rem;line-height:1.7;">
                        <li>Combat is turn-based. Attack or cast Magic.</li>
                        <li><b>LIFESTEAL:</b> Drain spells deal damage and heal you for 50% of it!</li>
                        <li><b>DROPS:</b> Enemies rarely drop Armor. Bosses always drop legendary gear!</li>
                        <li><b>ARMOR:</b> Equipped armor reduces all incoming damage.</li>
                    </ul>`
            },
            {   // Page 1: World I (front) / World II (back)
                front: `
                    <h2 style="font-size:1.05rem;color:#d4af37;">WORLD I: WHISPERING FOREST</h2>
                    <p style="font-size:0.8rem;line-height:1.4;">A dense, emerald expanse where sunlight barely touches the mossy floor.</p>
                    <h3 style="font-size:0.85rem;margin-top:12px;">GUARDIAN</h3>
                    ${bossBox('#d4af37','Stone Guardian','HP 500 | ATK 40 | DEF 20','Drops: Guardian Plate (+10 DEF)')}
                    <h3 style="font-size:0.85rem;margin-top:12px;">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Slime</td><td>30</td><td>6</td><td>Leather Armor</td></tr>
                        <tr><td>Skeleton</td><td>60</td><td>12</td><td>Leather Armor</td></tr>
                        <tr><td>Demon Knight</td><td>140</td><td>22</td><td>Iron Armor</td></tr>`)}`,
                back: `
                    <h2 style="font-size:1.05rem;color:#ef4444;">WORLD II: INFERNO PEAKS</h2>
                    <p style="font-size:0.8rem;line-height:1.4;">A realm of scorched earth and rivers of molten rock.</p>
                    <h3 style="font-size:0.85rem;margin-top:12px;">GUARDIAN</h3>
                    ${bossBox('#ef4444','Inferno Phoenix','HP 800 | ATK 55 | DEF 15','Drops: Ashen Cloak (+25 DEF)')}
                    <h3 style="font-size:0.85rem;margin-top:12px;">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Ash Wraith</td><td>150</td><td>25</td><td>Iron Armor</td></tr>
                        <tr><td>Lava Golem</td><td>300</td><td>15</td><td>Steel Armor</td></tr>
                        <tr><td>Hellhound</td><td>180</td><td>35</td><td>Iron Armor</td></tr>`)}`
            },
            {   // Page 2: World III (front) / World IV (back)
                front: `
                    <h2 style="font-size:1.05rem;color:#38bdf8;">WORLD III: CRYSTAL WASTES</h2>
                    <p style="font-size:0.8rem;line-height:1.4;">A frozen tundra where giant crystals hum with ancient energy.</p>
                    <h3 style="font-size:0.85rem;margin-top:12px;">GUARDIAN</h3>
                    ${bossBox('#38bdf8','Crystal Hydra','HP 1200 | ATK 70 | DEF 30','Drops: Hydra Scale (+50 DEF)')}
                    <h3 style="font-size:0.85rem;margin-top:12px;">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Frost Sprite</td><td>200</td><td>40</td><td>Steel Armor</td></tr>
                        <tr><td>Ice Troll</td><td>400</td><td>30</td><td>Steel Armor</td></tr>
                        <tr><td>Yeti</td><td>500</td><td>45</td><td>Obsidian Armor</td></tr>`)}`,
                back: `
                    <h2 style="font-size:1.05rem;color:#7e22ce;">WORLD IV: VOID ABYSS</h2>
                    <p style="font-size:0.8rem;line-height:1.4;">Where reality breaks and pure darkness flows.</p>
                    <h3 style="font-size:0.85rem;margin-top:12px;">GUARDIAN</h3>
                    ${bossBox('#7e22ce','Nether Fiend','HP 2000 | ATK 110 | DEF 45','Drops: Nether Mantle (+120 DEF)')}
                    <h3 style="font-size:0.85rem;margin-top:12px;">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Shadow Stalker</td><td>800</td><td>80</td><td>Obsidian Armor</td></tr>
                        <tr><td>Void Horror</td><td>1200</td><td>65</td><td>Obsidian Armor</td></tr>
                        <tr><td>Soul Eater</td><td>1000</td><td>100</td><td>Divine Armor</td></tr>`)}`
            },
            {   // Page 3: World V (front) / World VI (back)
                front: `
                    <h2 style="font-size:1.05rem;color:#e2e8f0;">WORLD V: CELESTIAL SPIRE</h2>
                    <p style="font-size:0.8rem;line-height:1.4;">High above the clouds, where the light of Aethelgard is purest.</p>
                    <h3 style="font-size:0.85rem;margin-top:12px;">GUARDIAN</h3>
                    ${bossBox('#e2e8f0','Celestial Dragon','HP 5000 | ATK 200 | DEF 80','Drops: Celestial Aegis (+300 DEF)')}
                    <h3 style="font-size:0.85rem;margin-top:12px;">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Seraph</td><td>1500</td><td>130</td><td>Divine Armor</td></tr>
                        <tr><td>Archon</td><td>2200</td><td>120</td><td>Divine Armor</td></tr>
                        <tr><td>Light Bearer</td><td>1800</td><td>160</td><td>Divine Armor</td></tr>`)}`,
                back: `
                    <h2 style="font-size:1.05rem;color:#a855f7;">WORLD VI: REALM OF THE WATCHER</h2>
                    <p style="font-size:0.8rem;line-height:1.4;">The true end of all things. The Watcher observes from the edge of eternity.</p>
                    <h3 style="font-size:0.85rem;margin-top:12px;">GUARDIAN</h3>
                    ${bossBox('#a855f7','Void Watcher','HP 10000 | ATK 300 | DEF 150','Drops: Eternity Crown (+600 DEF)')}
                    <h3 style="font-size:0.85rem;margin-top:12px;">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Void Minion</td><td>3000</td><td>200</td><td>Eternity Armor</td></tr>
                        <tr><td>Void Knight</td><td>4000</td><td>180</td><td>Eternity Armor</td></tr>
                        <tr><td>Void Terror</td><td>5000</td><td>250</td><td>Eternity Armor</td></tr>`)}`
            },
            {   // Page 4: Spells I-III (front) / Spells IV-VI (back)
                front: `
                    <h2 style="font-size:1.05rem;">SPELLS: WORLDS I - III</h2>
                    <table style="font-size:0.72rem;width:100%;line-height:1.55;">
                        <tr style="color:#d4af37;"><th>Spell</th><th>MP</th><th>Effect</th><th>Cost</th><th>W</th></tr>
                        <tr><td>Fireball</td><td>10</td><td>25 DMG</td><td>10G</td><td>I</td></tr>
                        <tr><td>Heal</td><td>15</td><td>20 Heal</td><td>15G</td><td>I</td></tr>
                        <tr><td>Power Slash</td><td>0</td><td>35 DMG</td><td>25G</td><td>I</td></tr>
                        <tr><td>Ice Shard</td><td>15</td><td>35 DMG</td><td>20G</td><td>I</td></tr>
                        <tr><td>Vamp Touch</td><td>20</td><td>25 Drain</td><td>40G</td><td>I</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:2px 0;"></td></tr>
                        <tr><td>Inferno</td><td>30</td><td>60 DMG</td><td>50G</td><td>II</td></tr>
                        <tr><td>Lightning</td><td>35</td><td>75 DMG</td><td>60G</td><td>II</td></tr>
                        <tr><td>Greater Heal</td><td>25</td><td>75 Heal</td><td>70G</td><td>II</td></tr>
                        <tr><td>Earthquake</td><td>45</td><td>85 DMG</td><td>80G</td><td>II</td></tr>
                        <tr><td>Blood Strike</td><td>35</td><td>70 Drain</td><td>100G</td><td>II</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:2px 0;"></td></tr>
                        <tr><td>Meteor Swarm</td><td>50</td><td>150 DMG</td><td>120G</td><td>III</td></tr>
                        <tr><td>Holy Light</td><td>40</td><td>120 Heal</td><td>140G</td><td>III</td></tr>
                        <tr><td>Crystal Beam</td><td>60</td><td>250 DMG</td><td>200G</td><td>III</td></tr>
                        <tr><td>Blizzard</td><td>65</td><td>200 DMG</td><td>180G</td><td>III</td></tr>
                        <tr><td>Soul Siphon</td><td>70</td><td>180 Drain</td><td>250G</td><td>III</td></tr>
                    </table>`,
                back: `
                    <h2 style="font-size:1.05rem;">SPELLS: WORLDS IV - VI</h2>
                    <table style="font-size:0.72rem;width:100%;line-height:1.55;">
                        <tr style="color:#d4af37;"><th>Spell</th><th>MP</th><th>Effect</th><th>Cost</th><th>W</th></tr>
                        <tr><td>Void Pulse</td><td>80</td><td>500 DMG</td><td>400G</td><td>IV</td></tr>
                        <tr><td>Dark Pact</td><td>100</td><td>700 DMG</td><td>450G</td><td>IV</td></tr>
                        <tr><td>Abyss Heal</td><td>60</td><td>400 Heal</td><td>500G</td><td>IV</td></tr>
                        <tr><td>Shadow Scythe</td><td>90</td><td>600 DMG</td><td>450G</td><td>IV</td></tr>
                        <tr><td>Nether Drain</td><td>110</td><td>500 Drain</td><td>550G</td><td>IV</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:2px 0;"></td></tr>
                        <tr><td>God Ray</td><td>150</td><td>1200 DMG</td><td>1000G</td><td>V</td></tr>
                        <tr><td>Heaven's Gate</td><td>200</td><td>2500 DMG</td><td>1500G</td><td>V</td></tr>
                        <tr><td>Divine Breath</td><td>100</td><td>2000 Heal</td><td>2000G</td><td>V</td></tr>
                        <tr><td>Supernova</td><td>180</td><td>2200 DMG</td><td>1800G</td><td>V</td></tr>
                        <tr><td>Divine Siphon</td><td>150</td><td>1800 Drain</td><td>2200G</td><td>V</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:2px 0;"></td></tr>
                        <tr><td>Void Crush</td><td>300</td><td>5000 DMG</td><td>5000G</td><td>VI</td></tr>
                        <tr><td>Oblivion</td><td>500</td><td>8000 DMG</td><td>8000G</td><td>VI</td></tr>
                        <tr><td>Eternity Heal</td><td>400</td><td>5000 Heal</td><td>10000G</td><td>VI</td></tr>
                        <tr><td>Reality Tear</td><td>400</td><td>7000 DMG</td><td>8000G</td><td>VI</td></tr>
                        <tr><td>Eternity Drain</td><td>500</td><td>6000 Drain</td><td>12000G</td><td>VI</td></tr>
                    </table>`
            },
            {   // Page 5: Epiphany
                front: `
                    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;border:4px double #1a1a1a;">
                        <h2 style="border:none;font-size:1.5rem;letter-spacing:0.2em;">EPIPHANY</h2>
                        <p style="font-size:0.9rem;line-height:1.6;margin-top:20px;">You have reached the end of the Sage's knowledge.<br/>May your blade stay sharp and your mana never fail.</p>
                        <div style="font-size:3rem;margin-top:30px;">⚔️</div>
                    </div>`,
                back: ``
            }
        ];
    }

    render() {
        const overlay = document.createElement('div');
        overlay.className = 'book-overlay';
        overlay.id = 'book-ui';
        
        const book = document.createElement('div');
        book.className = 'book';
        
        this.pages.forEach((pageData, index) => {
            const page = document.createElement('div');
            const isFlipped = index < this.currentPage;
            page.className = `book-page ${pageData.isCover ? 'cover-front' : ''} ${index === this.pages.length - 1 ? 'cover-back' : ''} ${isFlipped ? 'flipped' : ''}`;
            page.style.zIndex = isFlipped ? index + 1 : this.pages.length - index;
            page.innerHTML = `
                <div class="page-side page-front">${pageData.front}</div>
                <div class="page-side page-back">${pageData.back}</div>
            `;
            book.appendChild(page);
        });

        const nav = document.createElement('div');
        nav.className = 'book-nav';
        nav.innerHTML = `
            <button class="book-btn" id="prev-page">◀ PREV PAGE</button>
            <button class="book-btn" id="next-page">NEXT PAGE ▶</button>
        `;

        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-book';
        closeBtn.innerHTML = '✕ CLOSE GUIDE';
        closeBtn.onclick = () => overlay.remove();

        overlay.appendChild(book);
        overlay.appendChild(nav);
        overlay.appendChild(closeBtn);
        this.parent.appendChild(overlay);

        const pageElements = book.querySelectorAll('.book-page');
        const nextBtn = nav.querySelector('#next-page');
        const prevBtn = nav.querySelector('#prev-page');

        nextBtn.onclick = () => {
            if (this.currentPage < pageElements.length) {
                const el = pageElements[this.currentPage];
                el.classList.add('flipped');
                el.style.zIndex = this.currentPage + 1;
                this.currentPage++;
                this.updateButtons(prevBtn, nextBtn, pageElements.length);
            }
        };

        prevBtn.onclick = () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                const el = pageElements[this.currentPage];
                el.classList.remove('flipped');
                el.style.zIndex = this.pages.length - this.currentPage;
                this.updateButtons(prevBtn, nextBtn, pageElements.length);
            }
        };

        this.updateButtons(prevBtn, nextBtn, pageElements.length);

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    updateButtons(prev, next, total) {
        prev.disabled = this.currentPage === 0;
        next.disabled = this.currentPage === total;
    }
}
