/**
 * showModal(message, onClose)
 * Renders a stylized fullscreen overlay modal centered on screen.
 * onClose is called when the user dismisses it.
 */
export function showModal(message, onClose) {
    // Remove any existing modal
    const existing = document.getElementById('game-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'game-modal';
    overlay.style.cssText = `
        position: fixed; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.75);
        z-index: 9999;
        font-family: 'Press Start 2P', monospace;
        animation: fadeIn 0.2s ease;
    `;

    // Parse multi-line messages
    const lines = message.split('\n').map(l => 
        `<p style="margin: 6px 0; line-height: 1.8; font-size: ${l.startsWith('⭐') || l.startsWith('🏆') ? '0.85rem' : '0.72rem'};">${l}</p>`
    ).join('');

    overlay.innerHTML = `
        <style>
            @keyframes fadeIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
            @keyframes pulse { 0%,100% { box-shadow: 0 0 30px rgba(99,102,241,0.4); } 50% { box-shadow: 0 0 60px rgba(99,102,241,0.8); } }
        </style>
        <div style="
            background: linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%);
            border: 2px solid rgba(99,102,241,0.5);
            border-radius: 8px;
            padding: 40px 48px;
            max-width: 520px;
            min-width: 300px;
            text-align: center;
            color: #e2e8f0;
            animation: pulse 2s infinite;
            position: relative;
        ">
            <div style="margin-bottom: 20px; min-height: 40px;">
                ${lines}
            </div>
            <button id="modal-ok-btn" style="
                font-family: 'Press Start 2P', monospace;
                font-size: 0.75rem;
                padding: 12px 32px;
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                letter-spacing: 0.1em;
                margin-top: 10px;
                transition: transform 0.1s, brightness 0.1s;
            " onmouseover="this.style.filter='brightness(1.2)'" onmouseout="this.style.filter='brightness(1)'">
                OK
            </button>
        </div>
    `;

    document.body.appendChild(overlay);

    const close = () => {
        overlay.remove();
        if (onClose) onClose();
    };

    document.getElementById('modal-ok-btn').onclick = close;
    // Also close on backdrop click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
}

/**
 * showConfirm(message, onConfirm, onCancel)
 * A Yes/No styled confirm dialog.
 */
export function showConfirm(message, onConfirm, onCancel) {
    const existing = document.getElementById('game-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'game-modal';
    overlay.style.cssText = `
        position: fixed; inset: 0;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,0.75);
        z-index: 9999;
        font-family: 'Press Start 2P', monospace;
        animation: fadeIn 0.2s ease;
    `;

    const lines = message.split('\n').map(l =>
        `<p style="margin: 6px 0; line-height:1.8; font-size:0.72rem;">${l}</p>`
    ).join('');

    overlay.innerHTML = `
        <style>@keyframes fadeIn { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }</style>
        <div style="
            background: linear-gradient(135deg, rgba(15,23,42,0.98) 0%, rgba(30,41,59,0.98) 100%);
            border: 2px solid rgba(99,102,241,0.5);
            border-radius: 8px;
            padding: 40px 48px;
            max-width: 480px;
            text-align: center;
            color: #e2e8f0;
        ">
            ${lines}
            <div style="display:flex; gap:16px; justify-content:center; margin-top:24px;">
                <button id="modal-yes" style="font-family:'Press Start 2P',monospace;font-size:0.7rem;padding:12px 28px;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;border:none;border-radius:4px;cursor:pointer;">YES</button>
                <button id="modal-no" style="font-family:'Press Start 2P',monospace;font-size:0.7rem;padding:12px 28px;background:rgba(255,255,255,0.08);color:#e2e8f0;border:1px solid rgba(255,255,255,0.2);border-radius:4px;cursor:pointer;">NO</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.getElementById('modal-yes').onclick = () => { overlay.remove(); if (onConfirm) onConfirm(); };
    document.getElementById('modal-no').onclick  = () => { overlay.remove(); if (onCancel) onCancel(); };
}
