import { Book } from './book.js';
import { Chronicles } from './chronicles.js';

export class StartScreen {
    constructor(uiLayer, onStart) {
        this.uiLayer = uiLayer;
        this.onStart = onStart;
    }

    render() {
        const hasSave = localStorage.getItem('aethelgard_save') !== null;
        const board = JSON.parse(localStorage.getItem('aethelgard_leaderboard') || '[]');
        
        const leaderboardRows = board.length > 0 
            ? board.map((e, i) => {
                const mins = Math.floor(e.timePlayed / 60);
                const secs = e.timePlayed % 60;
                const classIcon = { knight: '🛡️', berserker: '🪓', rogue: '🗡️', mage: '✨', paladin: '🔨' }[e.charClass] || '⚔';
                return `<tr style="opacity: ${1 - i * 0.08}; font-family: var(--font-heading); font-size: 0.9rem; font-weight: bold; letter-spacing: 0.05em;">
                    <td style="padding:10px; color:#fbbf24">#${i + 1}</td>
                    <td style="padding:10px">${classIcon} ${e.charClass.toUpperCase()}</td>
                    <td style="padding:10px; color:#f87171">⚔ ${e.kills}</td>
                    <td style="padding:10px; color:#34d399">⏱ ${mins}m ${secs}s</td>
                    <td style="padding:10px; color:#93c5fd">W${e.worldId} • LV${e.level}</td>
                </tr>`;
            }).join('')
            : `<tr><td colspan="5" style="padding: 30px; text-align: center; opacity: 0.5; font-family: var(--font-body);">No records yet.</td></tr>`;

        this.uiLayer.innerHTML = `
            <style>
                .start-screen { 
                    width: 100%; height: 100%; 
                    display: flex; flex-direction: column; 
                    align-items: center; justify-content: center; 
                    background: #020617; overflow: hidden; 
                }
                .title-container { text-align: center; margin-bottom: 2rem; }
                .title-glow { font-family: var(--font-heading); font-size: 4.5rem; letter-spacing: 0.15em; margin-bottom: 0.2rem; text-shadow: 4px 4px 0px #000; color: #fbbf24; }
                .subtitle { font-family: var(--font-heading); font-size: 1.1rem; opacity: 0.9; letter-spacing: 0.4em; color: #94a3b8; text-transform: uppercase; }
                
                .main-layout { 
                    display: flex; align-items: center; justify-content: center; 
                    gap: 30px; position: relative; 
                }
                .menu-panel { min-width: 380px; text-align: center; z-index: 10; padding: 30px; }
                #leaderboard-panel { 
                    display: none; width: 650px; padding: 35px; 
                    max-height: 80vh; overflow-y: auto; 
                    position: fixed; left: 50%; top: 50%; 
                    transform: translate(-50%, -50%) scale(0.9);
                    z-index: 5000; box-shadow: 0 0 100px rgba(0,0,0,0.9);
                    animation: modalPop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes modalPop {
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                .panel-active { display: block !important; opacity: 1 !important; }
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 4000; display: none; }
            </style>

            <div id="leaderboard-overlay" class="modal-overlay"></div>

            <div class="start-screen" style="animation: fadeIn 1s ease;">
                <div class="title-container">
                    <h1 class="title-glow">AETHELGARD</h1>
                    <p class="subtitle">SHADOWS OF THE ABYSS</p>
                </div>

                <div class="main-layout">
                    <div class="side-banner banner-left">
                        <div class="banner-crown">👑</div>
                        <div class="torch"><div class="fire"></div></div>
                    </div>

                    <div class="glass-panel menu-panel">
                        <p style="margin-bottom: 1.5rem; color: #fbbf24; font-size: 0.75rem; letter-spacing: 0.3em; font-family: var(--font-heading); font-weight: bold;">[ DESTINY AWAITS ]</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${hasSave ? `<button id="continue-btn" class="battle-btn" style="width: 100%;"><span>▶</span> CONTINUE JOURNEY <span>◀</span></button>` : ''}
                            <button id="new-game-btn" class="battle-btn" style="width: 100%;"><span>⚔</span> NEW ADVENTURE</button>
                            <button id="guide-btn" class="battle-btn" style="width: 100%;"><span>📜</span> GAME GUIDE</button>
                            <button id="leaderboard-btn" class="battle-btn" style="width: 100%;"><span>🏆</span> LEADERBOARDS</button>
                            <button id="update-log-btn" class="battle-btn" style="width: 100%;"><span>📝</span> UPDATE LOG</button>
                        </div>

                        <p style="margin-top: 1.5rem; opacity: 0.7; font-size: 0.55rem; color: #94a3b8; font-family: var(--font-heading); letter-spacing: 1px;">WASD TO MOVE • ENTER REALM</p>
                    </div>

                    <div class="side-banner banner-right">
                        <div class="banner-crown">👑</div>
                        <div class="torch"><div class="fire"></div></div>
                    </div>


                    <div id="leaderboard-panel" class="glass-panel">
                        <h2 style="margin-bottom: 1.5rem; color: #fbbf24; text-align: center; font-size: 1.6rem;">🏆 LEADERBOARDS</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead><tr style="color: #fbbf24; text-align: left; border-bottom: 2px solid rgba(251,191,36,0.2); font-size: 0.9rem;">
                                <th>RANK</th><th>CLASS</th><th>KILLS</th><th>TIME</th><th>TIER</th>
                            </tr></thead>
                            <tbody style="font-size: 0.95rem;">${leaderboardRows}</tbody>
                        </table>
                        <div style="text-align: center; margin-top: 30px;">
                            <button id="close-leaderboard" class="battle-btn" style="min-width: 200px;">CLOSE</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        if (hasSave) {
            document.getElementById('continue-btn').onclick = () => {
                this.uiLayer.innerHTML = '';
                this.onStart(null);
            };
        }

        document.getElementById('new-game-btn').onclick = () => this.renderCharacterSelect();
        
        const leaderboard = document.getElementById('leaderboard-panel');
        const overlay = document.getElementById('leaderboard-overlay');
        const closeBtn = document.getElementById('close-leaderboard');

        const toggleLeaderboard = () => {
            const isActive = leaderboard.classList.toggle('panel-active');
            overlay.style.display = isActive ? 'block' : 'none';
        };

        document.getElementById('leaderboard-btn').onclick = toggleLeaderboard;
        closeBtn.onclick = toggleLeaderboard;
        overlay.onclick = toggleLeaderboard;
        document.getElementById('guide-btn').onclick = () => {
            const book = new Book(document.body);
            book.render();
        };
        document.getElementById('update-log-btn').onclick = () => this.renderUpdateLog();

    }

    renderUpdateLog() {
        const chronicles = new Chronicles(document.body);
        chronicles.render();
    }


    renderCharacterSelect() {
        this.uiLayer.innerHTML = `
            <div class="start-screen" style="display:flex; flex-direction:column; align-items:center; min-height:100%; animation: fadeIn 0.5s ease; padding: 1rem 0;">
                <h2 style="font-size: 2.2rem; margin-bottom: 1.5rem; color: #fbbf24; text-shadow: 4px 4px 0px #000; font-family: var(--font-heading); letter-spacing: 6px;">CHOOSE YOUR LEGACY</h2>
                
                <div style="display: flex; align-items: flex-start; justify-content: center; gap: 30px; width: 100%; max-width: 1400px;">
                    <!-- Left Banner -->
                    <div class="side-banner banner-left" style="height: 500px; flex-shrink: 0; margin-top: 20px;">
                        <div class="banner-crown">👑</div>
                        <div class="torch" style="margin-top: 150px;"><div class="fire"></div></div>
                    </div>

                    <!-- Class Cards Container -->
                    <div style="display:flex; gap:15px; flex-wrap: wrap; justify-content: center; align-items: stretch; max-width: 1100px;">
                        <div class="glass-panel" style="text-align: center; width: 190px; padding: 20px; display: flex; flex-direction: column; border-bottom: 4px solid #4ade80;">
                            <h3 style="color: #4ade80; font-size: 1.1rem; margin-bottom: 12px; font-family: var(--font-heading);">🛡️ KNIGHT</h3>
                            <p style="font-size: 0.75rem; color: #cbd5e1; flex-grow: 1; line-height: 1.5; font-family: var(--font-body); font-weight: bold; margin-bottom: 15px;">Master of the Shield.<br/><br/>25% Block Chance.</p>
                            <button class="battle-btn class-select-btn" data-class="knight" style="width: 100%; font-size: 0.7rem;">SELECT</button>
                        </div>
                        <div class="glass-panel" style="text-align: center; width: 190px; padding: 20px; display: flex; flex-direction: column; border-bottom: 4px solid #f87171;">
                            <h3 style="color: #f87171; font-size: 1.1rem; margin-bottom: 12px; font-family: var(--font-heading);">🪓 BERSERKER</h3>
                            <p style="font-size: 0.75rem; color: #cbd5e1; flex-grow: 1; line-height: 1.5; font-family: var(--font-body); font-weight: bold; margin-bottom: 15px;">Fury Incarnate.<br/><br/>20% Critical Strike.</p>
                            <button class="battle-btn class-select-btn" data-class="berserker" style="width: 100%; font-size: 0.7rem;">SELECT</button>
                        </div>
                        <div class="glass-panel" style="text-align: center; width: 190px; padding: 20px; display: flex; flex-direction: column; border-bottom: 4px solid #60a5fa;">
                            <h3 style="color: #60a5fa; font-size: 1.1rem; margin-bottom: 12px; font-family: var(--font-heading);">🗡️ ROGUE</h3>
                            <p style="font-size: 0.75rem; color: #cbd5e1; flex-grow: 1; line-height: 1.5; font-family: var(--font-body); font-weight: bold; margin-bottom: 15px;">Shadow Dancer.<br/><br/>Strikes twice.</p>
                            <button class="battle-btn class-select-btn" data-class="rogue" style="width: 100%; font-size: 0.7rem;">SELECT</button>
                        </div>
                        <div class="glass-panel" style="text-align: center; width: 190px; padding: 20px; display: flex; flex-direction: column; border-bottom: 4px solid #a855f7;">
                            <h3 style="color: #a855f7; font-size: 1.1rem; margin-bottom: 12px; font-family: var(--font-heading);">✨ MAGE</h3>
                            <p style="font-size: 0.75rem; color: #cbd5e1; flex-grow: 1; line-height: 1.5; font-family: var(--font-body); font-weight: bold; margin-bottom: 15px;">Master of Arcana.<br/><br/>Half MP costs.</p>
                            <button class="battle-btn class-select-btn" data-class="mage" style="width: 100%; font-size: 0.7rem;">SELECT</button>
                        </div>
                        <div class="glass-panel" style="text-align: center; width: 190px; padding: 20px; display: flex; flex-direction: column; border-bottom: 4px solid #fbbf24;">
                            <h3 style="color: #fbbf24; font-size: 1.1rem; margin-bottom: 12px; font-family: var(--font-heading);">🔨 PALADIN</h3>
                            <p style="font-size: 0.75rem; color: #cbd5e1; flex-grow: 1; line-height: 1.5; font-family: var(--font-body); font-weight: bold; margin-bottom: 15px;">Holy Crusader.<br/><br/>5 Vit regen / turn.</p>
                            <button class="battle-btn class-select-btn" data-class="paladin" style="width: 100%; font-size: 0.7rem;">SELECT</button>
                        </div>
                    </div>

                    <!-- Right Banner -->
                    <div class="side-banner banner-right" style="height: 500px; flex-shrink: 0; margin-top: 20px;">
                        <div class="banner-crown">👑</div>
                        <div class="torch" style="margin-top: 150px;"><div class="fire"></div></div>
                    </div>
                </div>
            </div>
        `;
        document.querySelectorAll('.class-select-btn').forEach(btn => {
            btn.onclick = (e) => {
                const charClass = e.target.closest('button').getAttribute('data-class');
                localStorage.removeItem('aethelgard_save');
                this.uiLayer.innerHTML = '';
                this.onStart(charClass);
            };
        });
    }
}
