export class SkillTree {
    constructor(player, uiLayer, onExit) {
        this.player = player;
        this.uiLayer = uiLayer;
        this.onExit = onExit;
    }

    render() {
        const s = this.player.stats;
        const mastered = s.masteries;
        
        this.uiLayer.innerHTML = `
            <div class="skill-tree-overlay" style="position: fixed; inset: 0; background: rgba(2, 6, 23, 0.95); animation: fadeIn 0.5s ease; display: flex; justify-content: center; align-items: center; z-index: 1000;">
                <div style="position:relative; display:flex; gap:0px; align-items:center;">
                    <!-- Side Banners -->
                    <div class="side-banner banner-left" style="height: 500px;"><div class="banner-crown">👑</div><div class="torch"><div class="fire"></div></div></div>
                    <div class="side-banner banner-right" style="height: 500px;"><div class="banner-crown">👑</div><div class="torch"><div class="fire"></div></div></div>

                    <div class="glass-panel" style="display: flex; flex-direction: column; align-items: center; max-width: 1000px; padding: 40px;">
                        <h1 style="font-size: 2.5rem; margin-bottom: 10px; color: #fbbf24; text-shadow: 4px 4px 0px #000; font-family: var(--font-heading);">THE ALTAR OF MASTERY</h1>
                        <p class="sp-indicator" style="color: #fbbf24; font-size: 1.1rem; margin-bottom: 3.5rem; font-family: var(--font-heading); letter-spacing: 2px; font-weight: bold; text-transform: uppercase;">AVAILABLE ESSENCE: ${s.skillPoints}</p>

                        <div style="display: flex; gap: 30px;">
                            <!-- Guardian -->
                            <div class="glass-panel" style="width: 290px; text-align: center; padding: 30px; ${mastered.guardian >= 5 ? 'filter: drop-shadow(0 0 15px #4ade80); border-color: #4ade80;' : ''}">
                                <h2 style="color: #4ade80; font-size: 1.4rem; margin-bottom: 15px; font-family: var(--font-heading);">🛡️ GUARDIAN</h2>
                                <p style="font-size: 1rem; margin: 20px 0; line-height: 1.6; color: #cbd5e1; font-family: var(--font-body); font-weight: bold;">
                                    MASTERY LEVEL: ${mastered.guardian}<br/><br/>
                                    • +1 Defense per level<br/>
                                    • +5% Weapon Proc chance
                                </p>
                                <div style="font-size: 0.8rem; text-align: left; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-family: var(--font-heading);">
                                    <div style="color: ${mastered.guardian >= 5 ? '#4ade80' : '#475569'}; margin-bottom: 10px; font-weight: bold;">[Lvl 5] BASTION: -10% DMG</div>
                                    <div style="color: ${mastered.guardian >= 10 ? '#4ade80' : '#475569'}; font-weight: bold;">[Lvl 10] RESOLVE: +20% HP</div>
                                </div>
                                <button class="battle-btn upgrade-btn" data-mastery="guardian" ${s.skillPoints <= 0 ? 'disabled' : ''} style="width: 100%; background: #e2e8f0; color: #1e293b; border: 2px solid #94a3b8; box-shadow: 4px 4px 0px #000;">ASCEND</button>
                            </div>
        
                            <!-- Arcane -->
                            <div class="glass-panel" style="width: 290px; text-align: center; padding: 30px; ${mastered.arcane >= 5 ? 'filter: drop-shadow(0 0 15px #60a5fa); border-color: #60a5fa;' : ''}">
                                <h2 style="color: #60a5fa; font-size: 1.4rem; margin-bottom: 15px; font-family: var(--font-heading);">✨ ARCANE</h2>
                                <p style="font-size: 1rem; margin: 20px 0; line-height: 1.6; color: #cbd5e1; font-family: var(--font-body); font-weight: bold;">
                                    MASTERY LEVEL: ${mastered.arcane}<br/><br/>
                                    • +5 Essence per level<br/>
                                    • +1 Spell duration
                                </p>
                                <div style="font-size: 0.8rem; text-align: left; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-family: var(--font-heading);">
                                    <div style="color: ${mastered.arcane >= 5 ? '#60a5fa' : '#475569'}; margin-bottom: 10px; font-weight: bold;">[Lvl 5] FLOW: +5 Essence/Turn</div>
                                    <div style="color: ${mastered.arcane >= 10 ? '#60a5fa' : '#475569'}; font-weight: bold;">[Lvl 10] OVERLOAD: +50% MGK</div>
                                </div>
                                <button class="battle-btn upgrade-btn" data-mastery="arcane" ${s.skillPoints <= 0 ? 'disabled' : ''} style="width: 100%; background: #e2e8f0; color: #1e293b; border: 2px solid #94a3b8; box-shadow: 4px 4px 0px #000;">ASCEND</button>
                            </div>
        
                            <!-- Slayer -->
                            <div class="glass-panel" style="width: 290px; text-align: center; padding: 30px; ${mastered.slayer >= 5 ? 'filter: drop-shadow(0 0 15px #f87171); border-color: #f87171;' : ''}">
                                <h2 style="color: #f87171; font-size: 1.4rem; margin-bottom: 15px; font-family: var(--font-heading);">🗡️ SLAYER</h2>
                                <p style="font-size: 1rem; margin: 20px 0; line-height: 1.6; color: #cbd5e1; font-family: var(--font-body); font-weight: bold;">
                                    MASTERY LEVEL: ${mastered.slayer}<br/><br/>
                                    • +1 Attack per level<br/>
                                    • +1% Critical Chance
                                </p>
                                <div style="font-size: 0.8rem; text-align: left; margin: 25px 0; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px; font-family: var(--font-heading);">
                                    <div style="color: ${mastered.slayer >= 5 ? '#f87171' : '#475569'}; margin-bottom: 10px; font-weight: bold;">[Lvl 5] PRECISION: 2.5x Crits</div>
                                    <div style="color: ${mastered.slayer >= 10 ? '#f87171' : '#475569'}; font-weight: bold;">[Lvl 10] RUTHLESS: Execute</div>
                                </div>
                                <button class="battle-btn upgrade-btn" data-mastery="slayer" ${s.skillPoints <= 0 ? 'disabled' : ''} style="width: 100%; background: #e2e8f0; color: #1e293b; border: 2px solid #94a3b8; box-shadow: 4px 4px 0px #000;">ASCEND</button>
                            </div>
                        </div>

                        <button id="exit-skill-btn" class="battle-btn" style="margin-top: 50px; min-width: 300px; filter: sepia(0.3);">RETURN TO REALM</button>
                    </div>
                </div>
            </div>
        `;

        document.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.onclick = () => {
                const mastery = btn.dataset.mastery;
                if (this.player.stats.skillPoints > 0) {
                    this.applyUpgrade(mastery);
                }
            };
        });

        document.getElementById('exit-skill-btn').onclick = () => this.onExit();
        
        // Listen for ESC to close
        this.keyHandler = (e) => {
            if (e.code === 'Escape') this.onExit();
        };
        window.addEventListener('keydown', this.keyHandler);
    }

    applyUpgrade(mastery) {
        this.player.stats.skillPoints--;
        this.player.stats.masteries[mastery]++;

        // Apply immediate stat bonuses
        if (mastery === 'guardian') {
            this.player.stats.def += 1;
        } else if (mastery === 'arcane') {
            this.player.stats.maxMp += 5;
            this.player.stats.mp += 5;

            // Arcane Awakening: Learn first spell if none
            if (this.player.stats.masteries.arcane === 1 && this.player.stats.spells.length === 0) {
                const starterSpell = { id: 'fireball', name: 'Fireball', mp: 10, dmg: 25, type: 'magic' };
                this.player.stats.spells.push(starterSpell);
                
                // Nest the notification modal
                import('../ui/modal.js').then(({showModal}) => {
                    showModal("✨ ARCANE AWAKENING ✨\n\nYou have learned your first spell: Fireball!");
                });
            }
        } else if (mastery === 'slayer') {
            this.player.stats.atk += 1;
        }

        // Level 10 Milestone: Resolve (+20% HP)
        if (mastery === 'guardian' && this.player.stats.masteries.guardian === 10) {
            const bonus = Math.floor(this.player.stats.maxHp * 0.2);
            this.player.stats.maxHp += bonus;
            this.player.stats.hp += bonus;
            import('../ui/modal.js').then(({showModal}) => {
                showModal("🛡 GUARDIAN RESOLVE 🛡\n\nYou reached Level 10! Max HP increased by 20%!");
            });
        }

        this.player.save();
        this.render(); // Re-render to update SP and levels
    }

    destroy() {
        window.removeEventListener('keydown', this.keyHandler);
    }
}
