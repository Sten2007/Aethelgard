export function showModal(content, onConfirm = null, title = "ANCIENT FIND", btnText = "CLAIM") {
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 3000; animation: fadeIn 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div class="parchment-panel" style="animation: scrollOpen 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative;">
            <div class="wax-seal" style="position: absolute; top: -20px; right: -20px; width: 45px; height: 45px; background: #991b1b; border-radius: 50%; border: 3px solid #7f1d1d; box-shadow: 0 0 10px rgba(0,0,0,0.5); z-index: 10;"></div>
            <div style="text-align: center; margin-bottom: 20px; font-family: var(--font-heading); font-size: 1.4rem; color: #78350f; border-bottom: 2px solid rgba(120,53,15,0.2); padding-bottom: 8px; letter-spacing: 2px;">
                ${title}
            </div>
            <div style="line-height: 1.6; margin-bottom: 25px; white-space: pre-wrap; font-size: 1.1rem; text-align: center;">${content}</div>
            <div style="text-align: center;">
                <button class="battle-btn modal-ok-btn" style="min-width: 160px; margin: 0 auto;">${btnText}</button>
            </div>
        </div>
        <style>
            @keyframes scrollOpen {
                from { transform: scaleY(0); opacity: 0; }
                to { transform: scaleY(1); opacity: 1; }
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        </style>
    `;
    
    document.body.appendChild(overlay);
    
    const close = () => {
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 200);
        if (onConfirm) onConfirm();
    };
    
    overlay.querySelector('.modal-ok-btn').onclick = close;
    overlay.onclick = (e) => { if(e.target === overlay) close(); };
}

export function showConfirm(content, onYes, onNo = null) {
    const overlay = document.createElement('div');
    overlay.style = `
        position: fixed; inset: 0; background: rgba(0,0,0,0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 2000; animation: fadeIn 0.3s ease;
    `;
    
    overlay.innerHTML = `
        <div class="parchment-panel" style="animation: scrollOpen 0.5s ease-out; position: relative;">
            <div class="wax-seal" style="position: absolute; top: -25px; left: -25px; width: 50px; height: 50px; background: #1e3a8a; border-radius: 50%; border: 4px solid #172554; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>
            <div style="text-align: center; margin-bottom: 30px; font-family: var(--font-heading); font-size: 1.8rem; border-bottom: 2px double rgba(49,46,129,0.2); padding-bottom: 10px;">
                ROYAL DECREE
            </div>
            <div style="line-height: 1.8; margin-bottom: 40px; white-space: pre-wrap; font-size: 1.2rem;">${content}</div>
            <div style="display: flex; gap: 20px; justify-content: center;">
                <button id="modal-yes" class="battle-btn" style="min-width: 140px; background-color: #065f46;">YES</button>
                <button id="modal-no" class="battle-btn" style="min-width: 140px; background-color: #991b1b;">NO</button>
            </div>
        </div>
        <style>
            @keyframes scrollOpen {
                from { transform: scaleY(0); opacity: 0; }
                to { transform: scaleY(1); opacity: 1; }
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        </style>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('modal-yes').onclick = () => { overlay.remove(); onYes(); };
    document.getElementById('modal-no').onclick = () => { overlay.remove(); if(onNo) onNo(); };
}
