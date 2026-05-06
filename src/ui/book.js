export class Book {
    constructor(parent) {
        this.parent = parent;
        this.currentPage = 1; // Pre-flip cover so Mechanics shows on left, World I on right

        const bossBox = (color, name, stats, drop) => `
            <div style="background:rgba(0,0,0,0.08);padding:15px;border-radius:6px;border-left:5px solid ${color};margin-top:15px;box-shadow: 2px 2px 5px rgba(0,0,0,0.05);">
                <p style="margin:0;color:#991b1b;font-weight:bold;font-size:1.1rem;font-family:var(--font-heading);">${name}</p>
                <p style="margin:8px 0 0 0;font-size:0.9rem;line-height:1.4;opacity:0.9;">${stats}</p>
                <p style="margin:8px 0 0 0;font-size:0.9rem;color:#b45309;font-weight:bold;">${drop}</p>
            </div>`;

        const denizensTable = (rows) => `
            <table style="font-size:0.85rem;width:100%;margin-top:15px;border-spacing:0 8px;">
                <tr style="color:#1e40af;font-family:var(--font-heading);border-bottom:2px solid #d4af37;">
                    <th style="text-align:left;padding-bottom:5px;">Monster</th>
                    <th style="text-align:center;padding-bottom:5px;">HP</th>
                    <th style="text-align:center;padding-bottom:5px;">ATK</th>
                    <th style="text-align:right;padding-bottom:5px;">Drop</th>
                </tr>
                ${rows}
            </table>`;

        this.pages = [
            {   // Page 0: Cover / Game Mechanics
                isCover: true,
                front: `
                    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;border:4px double #d4af37;padding:20px;">
                        <h1 style="font-size:1.8rem;text-align:center;color:#d4af37;margin-bottom:20px;">GAME<br/>GUIDE</h1>
                        <div style="font-size:4rem;">📜</div>
                        <p style="margin-top:40px;color:#d4af37;font-size:0.8rem;letter-spacing:0.2em;">AETHELGARD</p>
                    </div>`,
                back: `
                    <h2 style="font-size:1.4rem;color:#991b1b;font-family:var(--font-heading);margin-bottom:15px;border-bottom:2px solid #d4af37;padding-bottom:5px;">GAME MECHANICS</h2>
                    <p style="font-size:0.95rem;line-height:1.6;margin-bottom:15px;">Welcome, Traveler. Master these laws to survive Aethelgard.</p>
                    <h3 style="font-size:1.1rem;margin-top:20px;color:#b45309;font-family:var(--font-heading);">MOVEMENT</h3>
                    <ul style="font-size:0.9rem;line-height:1.8;padding-left:20px;">
                        <li><b>WASD:</b> Move through the world tiles.</li>
                        <li><b>Yellow tiles:</b> Enter Towns to shop & heal.</li>
                        <li><b>Purple tiles:</b> Teleporters to next world.</li>
                        <li><b>Black tiles:</b> Boss Lairs — enter at your own risk!</li>
                    </ul>
                    <h3 style="font-size:1.1rem;margin-top:20px;color:#b45309;font-family:var(--font-heading);">COMBAT & LOOT</h3>
                    <ul style="font-size:0.9rem;line-height:1.8;padding-left:20px;">
                        <li>Combat is turn-based. Attack or cast Magic.</li>
                        <li><b>LIFESTEAL:</b> Drain spells deal damage and heal you for 50% of it!</li>
                        <li><b>DROPS:</b> Enemies rarely drop Armor. Bosses always drop legendary gear!</li>
                        <li><b>ARMOR:</b> Equipped armor reduces all incoming damage.</li>
                    </ul>`
            },
            {   // Page 1: World I (front) / World II (back)
                front: `
                    <h2 style="font-size:1.3rem;color:#d4af37;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WORLD I: FOREST</h2>
                    <p style="font-size:0.9rem;line-height:1.5;margin:10px 0;">A dense, emerald expanse where sunlight barely touches the floor.</p>
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">GUARDIAN</h3>
                    ${bossBox('#d4af37','Stone Guardian Behemoth','HP 500 | ATK 40 | DEF 20','Drops: Guardian Plate (+10 DEF)')}
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Slime</td><td style="text-align:center">30</td><td style="text-align:center">6</td><td style="text-align:right">Leather Armor</td></tr>
                        <tr><td>Skeleton</td><td style="text-align:center">60</td><td style="text-align:center">12</td><td style="text-align:right">Leather Armor</td></tr>
                        <tr><td>Orc Raider</td><td style="text-align:center">120</td><td style="text-align:center">18</td><td style="text-align:right">Iron Armor</td></tr>`)}`,
                back: `
                    <h2 style="font-size:1.3rem;color:#ef4444;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WORLD II: PEAKS</h2>
                    <p style="font-size:0.9rem;line-height:1.5;margin:10px 0;">A realm of scorched earth and rivers of molten rock.</p>
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">GUARDIAN</h3>
                    ${bossBox('#ef4444','Inferno Phoenix','HP 800 | ATK 55 | DEF 15','Drops: Ashen Cloak (+25 DEF)')}
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Ash Wraith</td><td style="text-align:center">150</td><td style="text-align:center">25</td><td style="text-align:right">Iron Armor</td></tr>
                        <tr><td>Lava Golem</td><td style="text-align:center">300</td><td style="text-align:center">15</td><td style="text-align:right">Steel Armor</td></tr>
                        <tr><td>Hellhound</td><td style="text-align:center">180</td><td style="text-align:center">35</td><td style="text-align:right">Iron Armor</td></tr>`)}`
            },
            {   // Page 2: World III (front) / World IV (back)
                front: `
                    <h2 style="font-size:1.3rem;color:#38bdf8;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WORLD III: WASTES</h2>
                    <p style="font-size:0.9rem;line-height:1.5;margin:10px 0;">A frozen tundra where giant crystals hum with ancient energy.</p>
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">GUARDIAN</h3>
                    ${bossBox('#38bdf8','Crystal Hydra','HP 1200 | ATK 70 | DEF 30','Drops: Hydra Scale (+50 DEF)')}
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Frost Sprite</td><td style="text-align:center">200</td><td style="text-align:center">40</td><td style="text-align:right">Steel Armor</td></tr>
                        <tr><td>Ice Troll</td><td style="text-align:center">400</td><td style="text-align:center">30</td><td style="text-align:right">Steel Armor</td></tr>
                        <tr><td>Yeti</td><td style="text-align:center">500</td><td style="text-align:center">45</td><td style="text-align:right">Obsidian Armor</td></tr>`)}`,
                back: `
                    <h2 style="font-size:1.3rem;color:#7e22ce;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WORLD IV: ABYSS</h2>
                    <p style="font-size:0.9rem;line-height:1.5;margin:10px 0;">Where reality breaks and pure darkness flows.</p>
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">GUARDIAN</h3>
                    ${bossBox('#7e22ce','Nether Fiend','HP 2000 | ATK 110 | DEF 45','Drops: Nether Mantle (+120 DEF)')}
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Shadow Stalker</td><td style="text-align:center">800</td><td style="text-align:center">80</td><td style="text-align:right">Obsidian Armor</td></tr>
                        <tr><td>Void Horror</td><td style="text-align:center">1200</td><td style="text-align:center">65</td><td style="text-align:right">Obsidian Armor</td></tr>
                        <tr><td>Soul Eater</td><td style="text-align:center">1000</td><td style="text-align:center">100</td><td style="text-align:right">Divine Armor</td></tr>`)}`
            },
            {   // Page 3: World V (front) / World VI (back)
                front: `
                    <h2 style="font-size:1.3rem;color:#475569;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WORLD V: SPIRE</h2>
                    <p style="font-size:0.9rem;line-height:1.5;margin:10px 0;">High above the clouds, where the light of Aethelgard is purest.</p>
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">GUARDIAN</h3>
                    ${bossBox('#475569','Celestial Dragon','HP 5000 | ATK 200 | DEF 80','Drops: Celestial Aegis (+300 DEF)')}
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Seraph</td><td style="text-align:center">1500</td><td style="text-align:center">130</td><td style="text-align:right">Divine Armor</td></tr>
                        <tr><td>Archon</td><td style="text-align:center">2200</td><td style="text-align:center">120</td><td style="text-align:right">Divine Armor</td></tr>
                        <tr><td>Light Bearer</td><td style="text-align:center">1800</td><td style="text-align:center">160</td><td style="text-align:right">Divine Armor</td></tr>`)}`,
                back: `
                    <h2 style="font-size:1.3rem;color:#a855f7;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WORLD VI: WATCHER</h2>
                    <p style="font-size:0.9rem;line-height:1.5;margin:10px 0;">The true end of all things. The Watcher observes from eternity.</p>
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">GUARDIAN</h3>
                    ${bossBox('#a855f7','Void Watcher','HP 10000 | ATK 300 | DEF 150','Drops: Eternity Crown (+600 DEF)')}
                    <h3 style="font-size:1.05rem;margin-top:15px;font-family:var(--font-heading);">DENIZENS</h3>
                    ${denizensTable(`
                        <tr><td>Void Minion</td><td style="text-align:center">3000</td><td style="text-align:center">200</td><td style="text-align:right">Eternity Armor</td></tr>
                        <tr><td>Void Knight</td><td style="text-align:center">4000</td><td style="text-align:center">180</td><td style="text-align:right">Eternity Armor</td></tr>
                        <tr><td>Void Terror</td><td style="text-align:center">5000</td><td style="text-align:center">250</td><td style="text-align:right">Eternity Armor</td></tr>`)}`
            },
            {   // Page 4: Spells I-III (front) / Spells IV-VI (back)
                front: `
                    <h2 style="font-size:1.3rem;font-family:var(--font-heading);border-bottom:2px solid #d4af37;padding-bottom:5px;">SPELLS: WORLDS I - III</h2>
                    <table style="font-size:0.8rem;width:100%;line-height:1.7;margin-top:10px;">
                        <tr style="color:#b45309;font-family:var(--font-heading);border-bottom:1px solid #d4af37;">
                            <th style="text-align:left;">Spell</th><th style="text-align:center;">MP</th><th style="text-align:center;">Effect</th><th style="text-align:center;">Cost</th><th style="text-align:right;">W</th>
                        </tr>
                        <tr><td>Fireball</td><td style="text-align:center">10</td><td style="text-align:center">25 DMG</td><td style="text-align:center">10G</td><td style="text-align:right">I</td></tr>
                        <tr><td>Heal</td><td style="text-align:center">15</td><td style="text-align:center">20 Heal</td><td style="text-align:center">15G</td><td style="text-align:right">I</td></tr>
                        <tr><td>Power Slash</td><td style="text-align:center">0</td><td style="text-align:center">35 DMG</td><td style="text-align:center">25G</td><td style="text-align:right">I</td></tr>
                        <tr><td>Ice Shard</td><td style="text-align:center">15</td><td style="text-align:center">35 DMG</td><td style="text-align:center">20G</td><td style="text-align:right">I</td></tr>
                        <tr><td>Vamp Touch</td><td style="text-align:center">20</td><td style="text-align:center">25 Drain</td><td style="text-align:center">40G</td><td style="text-align:right">I</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:5px 0;"></td></tr>
                        <tr><td>Inferno</td><td style="text-align:center">30</td><td style="text-align:center">60 DMG</td><td style="text-align:center">50G</td><td style="text-align:right">II</td></tr>
                        <tr><td>Lightning</td><td style="text-align:center">35</td><td style="text-align:center">75 DMG</td><td style="text-align:center">60G</td><td style="text-align:right">II</td></tr>
                        <tr><td>Greater Heal</td><td style="text-align:center">25</td><td style="text-align:center">75 Heal</td><td style="text-align:center">70G</td><td style="text-align:right">II</td></tr>
                        <tr><td>Earthquake</td><td style="text-align:center">45</td><td style="text-align:center">85 DMG</td><td style="text-align:center">80G</td><td style="text-align:right">II</td></tr>
                        <tr><td>Blood Strike</td><td style="text-align:center">35</td><td style="text-align:center">70 Drain</td><td style="text-align:center">100G</td><td style="text-align:right">II</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:5px 0;"></td></tr>
                        <tr><td>Meteor Swarm</td><td style="text-align:center">50</td><td style="text-align:center">150 DMG</td><td style="text-align:center">120G</td><td style="text-align:right">III</td></tr>
                        <tr><td>Holy Light</td><td style="text-align:center">40</td><td style="text-align:center">120 Heal</td><td style="text-align:center">140G</td><td style="text-align:right">III</td></tr>
                        <tr><td>Crystal Beam</td><td style="text-align:center">60</td><td style="text-align:center">250 DMG</td><td style="text-align:center">200G</td><td style="text-align:right">III</td></tr>
                        <tr><td>Blizzard</td><td style="text-align:center">65</td><td style="text-align:center">200 DMG</td><td style="text-align:center">180G</td><td style="text-align:right">III</td></tr>
                        <tr><td>Soul Siphon</td><td style="text-align:center">70</td><td style="text-align:center">180 Drain</td><td style="text-align:center">250G</td><td style="text-align:right">III</td></tr>
                    </table>`,
                back: `
                    <h2 style="font-size:1.3rem;font-family:var(--font-heading);border-bottom:2px solid #d4af37;padding-bottom:5px;">SPELLS: WORLDS IV - VI</h2>
                    <table style="font-size:0.8rem;width:100%;line-height:1.7;margin-top:10px;">
                        <tr style="color:#b45309;font-family:var(--font-heading);border-bottom:1px solid #d4af37;">
                            <th style="text-align:left;">Spell</th><th style="text-align:center;">MP</th><th style="text-align:center;">Effect</th><th style="text-align:center;">Cost</th><th style="text-align:right;">W</th>
                        </tr>
                        <tr><td>Void Pulse</td><td style="text-align:center">80</td><td style="text-align:center">500 DMG</td><td style="text-align:center">400G</td><td style="text-align:right">IV</td></tr>
                        <tr><td>Dark Pact</td><td style="text-align:center">100</td><td style="text-align:center">700 DMG</td><td style="text-align:center">450G</td><td style="text-align:right">IV</td></tr>
                        <tr><td>Abyss Heal</td><td style="text-align:center">60</td><td style="text-align:center">400 Heal</td><td style="text-align:center">500G</td><td style="text-align:right">IV</td></tr>
                        <tr><td>Shadow Scythe</td><td style="text-align:center">90</td><td style="text-align:center">600 DMG</td><td style="text-align:center">450G</td><td style="text-align:right">IV</td></tr>
                        <tr><td>Nether Drain</td><td style="text-align:center">110</td><td style="text-align:center">500 Drain</td><td style="text-align:center">550G</td><td style="text-align:right">IV</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:5px 0;"></td></tr>
                        <tr><td>God Ray</td><td style="text-align:center">150</td><td style="text-align:center">1200 DMG</td><td style="text-align:center">1000G</td><td style="text-align:right">V</td></tr>
                        <tr><td>Heaven's Gate</td><td style="text-align:center">200</td><td style="text-align:center">2500 DMG</td><td style="text-align:center">1500G</td><td style="text-align:right">V</td></tr>
                        <tr><td>Divine Breath</td><td style="text-align:center">100</td><td style="text-align:center">2000 Heal</td><td style="text-align:center">2000G</td><td style="text-align:right">V</td></tr>
                        <tr><td>Supernova</td><td style="text-align:center">180</td><td style="text-align:center">2200 DMG</td><td style="text-align:center">1800G</td><td style="text-align:right">V</td></tr>
                        <tr><td>Divine Siphon</td><td style="text-align:center">150</td><td style="text-align:center">1800 Drain</td><td style="text-align:center">2220G</td><td style="text-align:right">V</td></tr>
                        <tr><td colspan="5"><hr style="border-color:#ccc;margin:5px 0;"></td></tr>
                        <tr><td>Void Crush</td><td style="text-align:center">300</td><td style="text-align:center">5000 DMG</td><td style="text-align:center">5000G</td><td style="text-align:right">VI</td></tr>
                        <tr><td>Oblivion</td><td style="text-align:center">500</td><td style="text-align:center">8000 DMG</td><td style="text-align:center">8000G</td><td style="text-align:right">VI</td></tr>
                        <tr><td>Eternity Heal</td><td style="text-align:center">400</td><td style="text-align:center">5000 Heal</td><td style="text-align:center">10000G</td><td style="text-align:right">VI</td></tr>
                        <tr><td>Reality Tear</td><td style="text-align:center">400</td><td style="text-align:center">7000 DMG</td><td style="text-align:center">8000G</td><td style="text-align:right">VI</td></tr>
                        <tr><td>Eternity Drain</td><td style="text-align:center">500</td><td style="text-align:center">6000 Drain</td><td style="text-align:center">12000G</td><td style="text-align:right">VI</td></tr>
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
        closeBtn.innerHTML = '✕ CLOSE GAME GUIDE';
        closeBtn.onclick = () => overlay.remove();

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

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
