export class ShopSystem {
    constructor(player, uiLayer) {
        this.player = player;
        this.uiLayer = uiLayer;
        this.active = false;
        
        this.active = false;
    }

    renderShop(worldId = 1) {
        this.active = true;
        if (worldId === 1) {
            this.spells = [
                { id: 'fireball', name: 'Fireball', cost: 10, mp: 10, dmg: 25, type: 'magic' },
                { id: 'heal', name: 'Heal', cost: 15, mp: 15, dmg: -20, type: 'magic' },
                { id: 'slash', name: 'Power Slash', cost: 25, mp: 0, dmg: 35, type: 'physical' },
                { id: 'ice_shard', name: 'Ice Shard', cost: 20, mp: 15, dmg: 35, type: 'magic' },
                { id: 'vamp_touch', name: 'Vampiric Touch', cost: 40, mp: 20, dmg: 25, type: 'lifesteal' }
            ];
            this.armor = { id: 'leather_armor', name: 'Leather Armor', cost: 30, def: 5 };
        } else if (worldId === 2) {
            this.spells = [
                { id: 'inferno', name: 'Inferno', cost: 50, mp: 30, dmg: 60, type: 'magic' },
                { id: 'lightning', name: 'Lightning Strike', cost: 60, mp: 35, dmg: 75, type: 'magic' },
                { id: 'g_heal', name: 'Greater Heal', cost: 70, mp: 25, dmg: -75, type: 'magic' },
                { id: 'earthquake', name: 'Earthquake', cost: 80, mp: 45, dmg: 85, type: 'magic' },
                { id: 'blood_strike', name: 'Blood Strike', cost: 100, mp: 35, dmg: 70, type: 'lifesteal' }
            ];
            this.armor = { id: 'iron_armor', name: 'Iron Armor', cost: 100, def: 15 };
        } else if (worldId === 3) {
            this.spells = [
                { id: 'meteor', name: 'Meteor Swarm', cost: 120, mp: 50, dmg: 150, type: 'magic' },
                { id: 'holy', name: 'Holy Light', cost: 140, mp: 40, dmg: -120, type: 'magic' },
                { id: 'crystal', name: 'Crystal Beam', cost: 200, mp: 60, dmg: 250, type: 'magic' },
                { id: 'blizzard', name: 'Blizzard', cost: 180, mp: 65, dmg: 200, type: 'magic' },
                { id: 'soul_siphon', name: 'Soul Siphon', cost: 250, mp: 70, dmg: 180, type: 'lifesteal' }
            ];
            this.armor = { id: 'steel_armor', name: 'Steel Armor', cost: 300, def: 30 };
        } else if (worldId === 4) {
            this.spells = [
                { id: 'void_pulse', name: 'Void Pulse', cost: 400, mp: 80, dmg: 500, type: 'magic' },
                { id: 'dark_pact', name: 'Dark Pact', cost: 450, mp: 100, dmg: 700, type: 'magic' },
                { id: 'abyss_heal', name: 'Abyss Heal', cost: 500, mp: 60, dmg: -400, type: 'magic' },
                { id: 'shadow_scythe', name: 'Shadow Scythe', cost: 450, mp: 90, dmg: 600, type: 'magic' },
                { id: 'nether_drain', name: 'Nether Drain', cost: 550, mp: 110, dmg: 500, type: 'lifesteal' }
            ];
            this.armor = { id: 'obsidian_armor', name: 'Obsidian Armor', cost: 800, def: 80 };
        } else if (worldId === 5) {
            this.spells = [
                { id: 'god_ray', name: 'God Ray', cost: 1000, mp: 150, dmg: 1200, type: 'magic' },
                { id: 'heavens_gate', name: "Heaven's Gate", cost: 1500, mp: 200, dmg: 2500, type: 'magic' },
                { id: 'immortality', name: 'Divine Breath', cost: 2000, mp: 100, dmg: -2000, type: 'magic' },
                { id: 'supernova', name: 'Supernova', cost: 1800, mp: 180, dmg: 2200, type: 'magic' },
                { id: 'divine_siphon', name: 'Divine Siphon', cost: 2200, mp: 150, dmg: 1800, type: 'lifesteal' }
            ];
            this.armor = { id: 'divine_armor', name: 'Divine Armor', cost: 2000, def: 200 };
        } else if (worldId === 6) {
            this.spells = [
                { id: 'void_crush', name: 'Void Crush', cost: 5000, mp: 300, dmg: 5000, type: 'magic' },
                { id: 'oblivion', name: 'Oblivion', cost: 8000, mp: 500, dmg: 8000, type: 'magic' },
                { id: 'eternity_heal', name: 'Eternity Heal', cost: 10000, mp: 400, dmg: -5000, type: 'magic' },
                { id: 'reality_tear', name: 'Reality Tear', cost: 8000, mp: 400, dmg: 7000, type: 'magic' },
                { id: 'eternity_drain', name: 'Eternity Drain', cost: 12000, mp: 500, dmg: 6000, type: 'lifesteal' }
            ];
            this.armor = { id: 'eternity_armor', name: 'Eternity Armor', cost: 10000, def: 500 };
        }
        this.renderMenu();
    }

    renderMenu() {
        let spellsHtml = this.spells.map(spell => {
            let alreadyHas = this.player.stats.spells.some(s => s.id === spell.id);
            let btnClass = alreadyHas || this.player.stats.gold < spell.cost ? 'disabled' : '';
            let dmgText = spell.dmg > 0 ? `DMG: ${spell.dmg}` : `Heals ${Math.abs(spell.dmg)}`;
            if (spell.type === 'lifesteal') dmgText = `Drain ${spell.dmg} HP`;
            return `
                <div class="shop-item glass-panel" style="padding: 15px; margin-bottom: 10px; width: 220px;">
                    <h4>${spell.name} (MP: ${spell.mp})</h4>
                    <p style="font-size: 0.7rem; opacity: 0.8; margin: 10px 0;">${dmgText}</p>
                    <button class="battle-btn shop-buy-btn ${btnClass}" data-id="${spell.id}">
                        ${alreadyHas ? 'Owned' : spell.cost + ' Gold'}
                    </button>
                </div>
            `;
        }).join('');

        let armorHtml = '';
        if (this.armor) {
            let alreadyHas = this.player.stats.armor && this.player.stats.armor.id >= this.armor.id; // Just check if they bought this exact one. Actually, wait. It's better to just check exact ID.
            alreadyHas = this.player.stats.armor && this.player.stats.armor.id === this.armor.id;
            let btnClass = alreadyHas || this.player.stats.gold < this.armor.cost ? 'disabled' : '';
            armorHtml = `
                <div class="shop-item glass-panel" style="padding: 15px; border-color: #fbbf24;">
                    <h4 style="color: #fbbf24;">🛡️ ${this.armor.name}</h4>
                    <p style="font-size: 0.7rem; opacity: 0.8; margin: 10px 0;">+${this.armor.def} Defense</p>
                    <button class="battle-btn shop-buy-armor-btn ${btnClass}">
                        ${alreadyHas ? 'Equipped' : this.armor.cost + ' Gold'}
                    </button>
                </div>
            `;
        }

        this.uiLayer.innerHTML = `
            <div class="shop-hud glass-panel" style="position:absolute; top: 10%; left: 10%; width: 80%; height: 80%; overflow-y: auto; background: rgba(0,0,0,0.9);">
                <h2 style="color: #fcd34d; margin-bottom: 10px;">TOWN SHOP</h2>
                <p style="color: #fbbf24; margin-bottom: 30px;">Gold: ${this.player.stats.gold}</p>
                
                <h3 style="color: #93c5fd; font-size: 0.9rem; margin-bottom: 15px;">EQUIPMENT</h3>
                <div class="shop-grid" style="display:flex; gap: 20px; flex-wrap: wrap; margin-bottom: 30px;">
                    ${armorHtml}
                </div>

                <h3 style="color: #fca5a5; font-size: 0.9rem; margin-bottom: 15px;">SPELLS</h3>
                <div class="shop-grid" style="display:flex; gap: 20px; flex-wrap: wrap;">
                    ${spellsHtml}
                </div>
                
                <button class="battle-btn" id="exit-shop-btn" style="margin-top: 40px; border-color: #ef4444; color: #ef4444;">Exit Town</button>
            </div>
        `;

        document.getElementById('exit-shop-btn').onclick = () => this.exitShop();
        
        const armorBtn = document.querySelector('.shop-buy-armor-btn:not(.disabled)');
        if (armorBtn) {
            armorBtn.onclick = () => this.buyArmor();
        }

        document.querySelectorAll('.shop-buy-btn:not(.disabled)').forEach(btn => {
            btn.onclick = (e) => {
                const spellId = e.target.getAttribute('data-id');
                this.buySpell(spellId);
            };
        });
    }

    buyArmor() {
        if (this.armor && this.player.stats.gold >= this.armor.cost) {
            this.player.stats.gold -= this.armor.cost;
            this.player.stats.armor = this.armor;
            this.renderMenu();
        }
    }

    buySpell(id) {
        const spell = this.spells.find(s => s.id === id);
        if (spell && this.player.stats.gold >= spell.cost) {
            this.player.stats.gold -= spell.cost;
            this.player.stats.spells.push(spell);
            this.renderMenu(); // re-render to update owned status and gold
        }
    }

    exitShop() {
        this.active = false;
        this.uiLayer.innerHTML = '';
        // Move player off town tile backwards a bit to avoid re-triggering immediately
        this.player.x -= 1;
        this.player.realX -= 1;
        window.dispatchEvent(new CustomEvent('shopExit'));
    }
}
