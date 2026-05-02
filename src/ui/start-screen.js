import { Book } from './book.js';

export class StartScreen {
    constructor(uiLayer, onStart) {
        this.uiLayer = uiLayer;
        this.onStart = onStart;
    }

    render() {
        const hasSave = localStorage.getItem('aethelgard_save') !== null;
        const board = JSON.parse(localStorage.getItem('aethelgard_leaderboard') || '[]');
        
        let buttonsHtml = '';
        if (hasSave) {
            buttonsHtml += `<button id="continue-btn" class="battle-btn menu-btn">▶ CONTINUE</button>`;
        }
        buttonsHtml += `<button id="new-game-btn" class="battle-btn menu-btn">⚔ NEW GAME</button>`;
        buttonsHtml += `<button id="guide-btn" class="battle-btn menu-btn" style="background: rgba(52,211,153,0.2); border-color: #34d399;">📜 GAME GUIDE</button>`;
        buttonsHtml += `<button id="leaderboard-btn" class="battle-btn menu-btn" style="background: rgba(168,85,247,0.2); border-color: #a855f7;">🏆 LEADERBOARDS (soon)</button>`;

        const leaderboardRows = board.length > 0 
            ? board.map((e, i) => {
                const mins = Math.floor(e.timePlayed / 60);
                const secs = e.timePlayed % 60;
                const classIcon = { knight: '🛡️', berserker: '🪓', rogue: '🗡️' }[e.charClass] || '⚔';
                return `<tr style="opacity: ${1 - i * 0.08};">
                    <td style="padding: 6px 12px; color: #fbbf24;">#${i + 1}</td>
                    <td style="padding: 6px 12px;">${classIcon} ${e.charClass}</td>
                    <td style="padding: 6px 12px; color: #f87171;">⚔ ${e.kills}</td>
                    <td style="padding: 6px 12px; color: #34d399;">⏱ ${mins}m ${secs}s</td>
                    <td style="padding: 6px 12px; color: #93c5fd;">W${e.worldId} | Lv${e.level}</td>
                    <td style="padding: 6px 12px; opacity: 0.6; font-size: 0.75rem;">${e.date}</td>
                </tr>`;
            }).join('')
            : `<tr><td colspan="6" style="padding: 20px; text-align: center; opacity: 0.5;">No runs recorded yet. Die bravely!</td></tr>`;

        this.uiLayer.innerHTML = `
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
                .start-screen { width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; background: radial-gradient(ellipse at center, #1e293b 0%, #0f172a 80%); }
                .title-glow { font-family: 'Press Start 2P', monospace; font-size: 2.8rem; color: #e2e8f0; text-shadow: 0 0 30px #6366f1, 0 0 60px rgba(99,102,241,0.4); letter-spacing: 0.05em; margin-bottom: 0.5rem; }
                .subtitle { font-size: 0.8rem; opacity: 0.5; letter-spacing: 0.3em; margin-bottom: 2.5rem; }
                .menu-btn { font-size: 0.85rem; padding: 14px 28px; display: block; width: 100%; margin-bottom: 10px; letter-spacing: 0.1em; }
                .lb-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
                .lb-table th { padding: 8px 12px; color: #a855f7; text-align: left; border-bottom: 1px solid rgba(168,85,247,0.3); }
                .lb-table tr:hover td { background: rgba(255,255,255,0.04); }
                #leaderboard-panel { display: none; }
                #guide-panel { display: none; padding: 30px; }
                .panel-active { display: block !important; }
                .tab-row { display: flex; gap: 10px; margin-bottom: 1rem; }
                .tab-btn { font-size: 0.7rem; padding: 8px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #e2e8f0; cursor: pointer; border-radius: 4px; transition: all 0.2s; }
                .tab-btn:hover, .tab-btn.active { background: rgba(99,102,241,0.3); border-color: #6366f1; }
                .stars { position: fixed; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:0; }
                .update-counter { position: fixed; right: 40px; top: 50%; transform: translateY(-50%); text-align: right; font-family: 'Press Start 2P', monospace; z-index: 10; pointer-events: none; }
            </style>

            <svg class="stars" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                ${Array.from({length:60}).map(() => `<circle cx="${Math.random()*800}" cy="${Math.random()*600}" r="${Math.random()*1.5+0.5}" fill="white" opacity="${Math.random()*0.6+0.2}"/>`).join('')}
            </svg>

            <div class="update-counter glass-panel" style="padding: 20px; border-color: rgba(99,102,241,0.5);">
                <p style="font-size: 0.6rem; color: #94a3b8; margin-bottom: 15px; letter-spacing: 2px;">MAJOR UPDATE IN</p>
                <div id="countdown-timer" style="font-size: 1.2rem; color: #6366f1; text-shadow: 0 0 10px rgba(99,102,241,0.5);">--:--:--:--</div>
                <p style="font-size: 0.5rem; color: #475569; margin-top: 15px;">COMING ON THE 6TH</p>
            </div>

            <div class="start-screen" style="position:relative; z-index:1;">
                <h1 class="title-glow">AETHELGARD</h1>
                <p class="subtitle">SHADOWS OF THE ABYSS</p>

                <div style="display:flex; gap:32px; align-items:flex-start;">
                    <!-- Main Menu -->
                    <div class="glass-panel" style="padding: 32px; text-align: center; min-width: 260px;">
                        <p style="margin-bottom: 1.5rem; opacity: 0.6; font-size: 0.75rem; letter-spacing: 0.15em;">EXPLORE • SURVIVE • CONQUER</p>
                        ${buttonsHtml}
                        <p style="margin-top: 1.5rem; opacity: 0.4; font-size: 0.65rem;">WASD TO MOVE • ENTER TILES</p>
                    </div>

                    <!-- Leaderboard Panel -->
                    <div id="leaderboard-panel" class="glass-panel" style="padding: 24px; min-width: 560px;">
                        <h2 style="margin-bottom: 1rem; font-size: 1rem; color: #a855f7; letter-spacing: 0.15em;">🏆 HALL OF FALLEN HEROES</h2>
                        <div id="lb-sort-row" class="tab-row">
                            <button class="tab-btn active" data-sort="kills">Top Kills</button>
                            <button class="tab-btn" data-sort="timePlayed">Longest Runs</button>
                            <button class="tab-btn" data-sort="level">Highest Level</button>
                        </div>
                        <table class="lb-table">
                            <thead><tr>
                                <th>#</th><th>Class</th><th>Kills</th><th>Time</th><th>Progress</th><th>Date</th>
                            </tr></thead>
                            <tbody id="lb-body">${leaderboardRows}</tbody>
                        </table>
                        ${board.length > 0 ? `<button id="clear-lb-btn" style="margin-top:12px; font-size:0.6rem; padding:6px 12px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#f87171; cursor:pointer; border-radius:4px;">🗑 Clear All Records</button>` : ''}
                    </div>

                    <!-- Book placeholder -->
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

        document.getElementById('leaderboard-btn').onclick = () => {
            const panel = document.getElementById('leaderboard-panel');
            const other = document.getElementById('guide-panel');
            other.classList.remove('panel-active');
            panel.classList.toggle('panel-active');
        };

        document.getElementById('guide-btn').onclick = () => {
            const book = new Book(document.body);
            book.render();
        };

        document.querySelectorAll('.tab-btn[data-sort]').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.tab-btn[data-sort]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const sortKey = btn.getAttribute('data-sort');
                const sorted = [...board].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));
                document.getElementById('lb-body').innerHTML = sorted.length > 0
                    ? sorted.map((e, i) => {
                        const mins = Math.floor(e.timePlayed / 60);
                        const secs = e.timePlayed % 60;
                        const classIcon = { knight: '🛡️', berserker: '🪓', rogue: '🗡️' }[e.charClass] || '⚔';
                        return `<tr><td style="padding:6px 12px;color:#fbbf24">#${i+1}</td><td style="padding:6px 12px">${classIcon} ${e.charClass}</td><td style="padding:6px 12px;color:#f87171">⚔ ${e.kills}</td><td style="padding:6px 12px;color:#34d399">⏱ ${mins}m ${secs}s</td><td style="padding:6px 12px;color:#93c5fd">W${e.worldId} | Lv${e.level}</td><td style="padding:6px 12px;opacity:0.6;font-size:0.75rem">${e.date}</td></tr>`;
                    }).join('')
                    : `<tr><td colspan="6" style="padding:20px;text-align:center;opacity:0.5">No runs yet!</td></tr>`;
            };
        });

        const clearBtn = document.getElementById('clear-lb-btn');
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm('Clear all leaderboard records?')) {
                    localStorage.removeItem('aethelgard_leaderboard');
                    window.location.reload();
                }
            };
        }

        this.startCountdown();
    }

    startCountdown() {
        const updateTimer = () => {
            const now = new Date();
            // Target the 6th of the current month
            const targetDate = new Date(now.getFullYear(), now.getMonth(), 6, 0, 0, 0, 0);
            if (now > targetDate) {
                // If it's already past the 6th, target the 6th of next month
                targetDate.setMonth(targetDate.getMonth() + 1);
            }

            const diff = targetDate - now;
            
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const mins = Math.floor((diff / 1000 / 60) % 60);
            const secs = Math.floor((diff / 1000) % 60);

            const timerEl = document.getElementById('countdown-timer');
            if (timerEl) {
                timerEl.innerText = `${days}d ${hours}h ${mins}m ${secs}s`;
            }
        };

        updateTimer();
        this.countdownInterval = setInterval(updateTimer, 1000);
    }

    renderCharacterSelect() {
        this.uiLayer.innerHTML = `
            <div class="start-screen" style="width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle, #1e293b 0%, #0f172a 100%);">
                <h2 style="font-size: 2rem; margin-bottom: 2rem;">CHOOSE YOUR CLASS</h2>
                <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center; max-width: 900px;">
                    <div class="glass-panel" style="text-align: center; width: 250px;">
                        <h3>🛡 Knight</h3>
                        <p style="font-size: 0.8rem; opacity: 0.8; height: 60px;">Sword & Shield.<br/><br/>Passive: 25% chance to Block half damage.</p>
                        <button class="battle-btn class-select-btn" data-class="knight">SELECT</button>
                    </div>
                    <div class="glass-panel" style="text-align: center; width: 250px;">
                        <h3>🪓 Berserker</h3>
                        <p style="font-size: 0.8rem; opacity: 0.8; height: 60px;">Battle Axe.<br/><br/>Passive: 20% chance to Critical Hit for x2 dmg.</p>
                        <button class="battle-btn class-select-btn" data-class="berserker">SELECT</button>
                    </div>
                    <div class="glass-panel" style="text-align: center; width: 250px;">
                        <h3>🗡 Rogue</h3>
                        <p style="font-size: 0.8rem; opacity: 0.8; height: 60px;">Dual Daggers.<br/><br/>Passive: Attacks twice per turn.</p>
                        <button class="battle-btn class-select-btn" data-class="rogue">SELECT</button>
                    </div>
                    <div class="glass-panel" style="text-align: center; width: 250px;">
                        <h3>✨ Mage</h3>
                        <p style="font-size: 0.8rem; opacity: 0.8; height: 60px;">Magic Staff.<br/><br/>Starts with Fireball. Spells cost half MP.</p>
                        <button class="battle-btn class-select-btn" data-class="mage">SELECT</button>
                    </div>
                    <div class="glass-panel" style="text-align: center; width: 250px;">
                        <h3>🔨 Paladin</h3>
                        <p style="font-size: 0.8rem; opacity: 0.8; height: 60px;">Holy Hammer.<br/><br/>Passive: Regenerates 5 HP per turn.</p>
                        <button class="battle-btn class-select-btn" data-class="paladin">SELECT</button>
                    </div>
                </div>
            </div>
        `;
        document.querySelectorAll('.class-select-btn').forEach(btn => {
            btn.onclick = (e) => {
                const charClass = e.target.getAttribute('data-class');
                localStorage.removeItem('aethelgard_save');
                this.uiLayer.innerHTML = '';
                this.onStart(charClass);
            };
        });
    }
}
