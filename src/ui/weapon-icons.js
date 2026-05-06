export function getWeaponSVG(weaponId, rarityColor = '#94a3b8') {
    const size = 120;
    let path = '';
    let glowColor = rarityColor;
    let accentColor = '#ffffff';

    switch (weaponId) {
        case 'venom_blade':
            path = `
                <path d="M40 80 L60 20 L80 80 Z" fill="#166534" />
                <path d="M50 70 L60 30 L70 70 Z" fill="#22c55e" />
                <circle cx="60" cy="85" r="3" fill="#4ade80">
                    <animate attributeName="cy" from="85" to="110" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
            `;
            glowColor = '#22c55e';
            break;
        case 'sun_piercer':
            path = `
                <path d="M58 10 L62 10 L65 90 L55 90 Z" fill="#fbbf24" />
                <path d="M45 85 L75 85 L75 95 L45 95 Z" fill="#d97706" />
                <circle cx="60" cy="30" r="15" fill="url(#sunGlow)" />
                <defs>
                    <radialGradient id="sunGlow">
                        <stop offset="0%" stop-color="#fef3c7" />
                        <stop offset="100%" stop-color="transparent" />
                    </radialGradient>
                </defs>
            `;
            glowColor = '#fbbf24';
            break;
        case 'life_drinker':
            path = `
                <path d="M50 20 C 30 20, 20 50, 60 90 C 100 50, 90 20, 70 20 C 60 20, 60 30, 60 30 C 60 30, 60 20, 50 20" fill="#991b1b" />
                <path d="M55 40 L65 40 L60 80 Z" fill="#ef4444" />
            `;
            glowColor = '#ef4444';
            break;
        case 'frost_axe':
            path = `
                <path d="M58 20 L62 20 L62 100 L58 100 Z" fill="#78350f" />
                <path d="M30 30 L60 45 L30 60 Z" fill="#38bdf8" />
                <path d="M90 30 L60 45 L90 60 Z" fill="#38bdf8" />
                <path d="M40 35 L60 45 L40 55 Z" fill="#bae6fd" opacity="0.6" />
            `;
            glowColor = '#0ea5e9';
            break;
        case 'blood_sabers':
            path = `
                <path d="M40 20 L45 90 L35 90 Z" fill="#7f1d1d" transform="rotate(-15, 40, 90)" />
                <path d="M80 20 L85 90 L75 90 Z" fill="#7f1d1d" transform="rotate(15, 80, 90)" />
                <path d="M38 30 L42 80 L38 80 Z" fill="#ef4444" transform="rotate(-15, 40, 90)" />
                <path d="M78 30 L82 80 L78 80 Z" fill="#ef4444" transform="rotate(15, 80, 90)" />
            `;
            glowColor = '#b91c1c';
            break;
        case 'executioner':
            path = `
                <path d="M55 100 L65 100 L65 70 L55 70 Z" fill="#451a03" />
                <path d="M30 20 L90 20 L90 70 L30 70 Z" fill="#475569" />
                <path d="M30 60 L90 60 L90 70 L30 70 Z" fill="#94a3b8" />
            `;
            glowColor = '#1e293b';
            break;
        case 'void_reaver':
            path = `
                <path d="M60 100 L60 20" stroke="#1e1b4b" stroke-width="4" />
                <path d="M60 20 C 20 20, 10 60, 40 80" fill="none" stroke="#4c1d95" stroke-width="8" />
                <path d="M60 20 C 20 20, 15 50, 45 70" fill="none" stroke="#a855f7" stroke-width="3" />
            `;
            glowColor = '#7e22ce';
            break;
        case 'celestial_claymore':
            path = `
                <path d="M50 10 L70 10 L75 90 L45 90 Z" fill="#fde047" />
                <path d="M40 80 L80 80 L80 90 L40 90 Z" fill="#d97706" />
                <path d="M55 20 L65 20 L67 80 L53 80 Z" fill="#ffffff" opacity="0.4" />
            `;
            glowColor = '#fbbf24';
            break;
        case 'eternity_blade':
            path = `
                <path d="M55 5 L65 5 L70 95 L50 95 Z" fill="#ffffff" />
                <circle cx="60" cy="85" r="10" fill="#60a5fa" opacity="0.5" />
                <path d="M58 15 L62 15 L64 75 L56 75 Z" fill="#dbeafe" />
            `;
            glowColor = '#3b82f6';
            break;
        default:
            path = `<path d="M50 20 L70 20 L65 80 L55 80 Z" fill="${rarityColor}" />`;
    }

    return `
        <div style="width: ${size}px; height: ${size}px; margin: 0 auto 20px; position: relative; filter: drop-shadow(0 0 15px ${glowColor}66);">
            <svg viewBox="0 0 120 120" width="${size}" height="${size}">
                ${path}
            </svg>
        </div>
    `;
}
