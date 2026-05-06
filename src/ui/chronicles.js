export class Chronicles {
    constructor(parent) {
        this.parent = parent;
        this.currentPage = 1;

        this.pages = [
            {   // Cover
                isCover: true,
                front: `
                    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;border:4px double #991b1b;padding:20px;">
                        <h1 style="font-size:1.8rem;text-align:center;color:#991b1b;margin-bottom:20px;">UPDATE<br/>LOG</h1>
                        <div style="font-size:4rem;">📜</div>
                        <p style="margin-top:40px;color:#991b1b;font-size:0.8rem;letter-spacing:0.2em;">OF AETHELGARD</p>
                        <p style="margin-top:10px;color:#64748b;font-size:0.6rem;">LATEST UPDATES</p>
                    </div>`,
                back: `
                    <h2 style="font-size:1.4rem;color:#991b1b;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">WELCOME, CHAMPION</h2>
                    <p style="font-size:0.95rem;line-height:1.6;margin-top:15px;">The realm of Aethelgard is ever-evolving. This volume documents the most recent shifts in the fabric of our world.</p>
                    <div style="margin-top:25px;padding:20px;background:rgba(153,27,27,0.05);border-radius:8px;border:1px solid rgba(153,27,27,0.1);">
                        <h3 style="font-size:1.1rem;margin-top:0;color:#991b1b;font-family:var(--font-heading);">SUMMARY</h3>
                        <ul style="font-size:0.85rem;line-height:1.8;padding-left:20px;margin-bottom:0;">
                            <li>Stone Guardian Boss Overhaul</li>
                            <li>Orc Raiders in World I</li>
                            <li>Enhanced Battle Animations</li>
                            <li>UI & Readability Overhaul</li>
                            <li>Combat Status Effects</li>
                        </ul>
                    </div>`
            },
            {   // Boss Overhaul & Orc Raiders
                front: `
                    <h2 style="font-size:1.3rem;color:#475569;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">BOSS OVERHAUL</h2>
                    <p style="font-size:0.9rem;line-height:1.6;margin-top:10px;">The legendary <b>Stone Guardian</b> has been visually remastered into a high-resolution Mechanical Behemoth.</p>
                    <div style="margin-top:15px;padding:12px;background:rgba(0,0,0,0.05);border-radius:8px;border:1px solid rgba(0,0,0,0.1);">
                        <ul style="font-size:0.85rem;line-height:1.8;padding-left:20px;margin:0;">
                            <li><b>HD Textures:</b> New 64x64px sprite.</li>
                            <li><b>Energy Core:</b> Radiant green glowing core.</li>
                            <li><b>Armored Design:</b> Reinforced plating for a true guardian look.</li>
                        </ul>
                    </div>
                    <p style="font-size:0.85rem;margin-top:10px;text-align:center;font-style:italic;color:#64748b;">"The Guardian of the Forest has never looked more imposing."</p>`,
                back: `
                    <h2 style="font-size:1.3rem;color:#166534;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">ORC RAIDERS</h2>
                    <p style="font-size:0.9rem;line-height:1.6;margin-top:10px;">The Whispering Forest (World I) has become more dangerous. Orc Raiders have been spotted near the edges of the town.</p>
                    <div style="margin-top:15px;padding:12px;border:2px solid #166534;background:rgba(22,101,52,0.05);border-radius:6px;">
                        <h4 style="margin:0;font-size:1rem;color:#166534;">THREAT LEVEL: HIGH</h4>
                        <p style="font-size:0.85rem;margin:8px 0 0 0;line-height:1.5;">Orcs possess significantly higher Health and Attack than Skeletons or Slimes.</p>
                    </div>`
            },
            {   // Battle Animations & UI
                front: `
                    <h2 style="font-size:1.3rem;color:#1e3a8a;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">BATTLE ANIMATIONS</h2>
                    <p style="font-size:0.9rem;line-height:1.6;margin-top:10px;">Combat has been visually overhauled with the introduction of high-fidelity sprite animations for the Soldier (Knight) class.</p>
                    <ul style="font-size:0.85rem;line-height:1.8;padding-left:20px;margin-top:15px;">
                        <li><b>Dynamic Idle:</b> Characters breathe and shift.</li>
                        <li><b>Impact Frames:</b> Unique "hurt" animations.</li>
                        <li><b>Tactical Retreat:</b> Heroes run off-screen.</li>
                    </ul>`,
                back: `
                    <h2 style="font-size:1.3rem;color:#1e293b;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">UI REFINEMENTS</h2>
                    <p style="font-size:0.9rem;line-height:1.6;margin-top:10px;">The interface of Aethelgard has been polished for a more premium and readable experience.</p>
                    <ul style="font-size:0.8rem;line-height:1.7;padding-left:20px;margin-top:10px;">
                        <li><b>Standardized Labels:</b> Game Guide, Update Log, etc.</li>
                        <li><b>Timer Position:</b> Countdown is now on the right.</li>
                        <li><b>Book Overhaul:</b> Larger fonts and improved layouts.</li>
                        <li><b>Typography:</b> Integrated MedievalSharp font.</li>
                    </ul>`
            },
            {   // Loot & Status
                front: `
                    <h2 style="font-size:1.3rem;color:#ca8a04;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">LOOT REFORGED</h2>
                    <p style="font-size:0.9rem;line-height:1.6;margin-top:10px;">The treasure system has been completely redesigned to provide more meaningful rewards.</p>
                    <h3 style="font-size:1.1rem;margin-top:20px;font-family:var(--font-heading);">WEAPON RARITY</h3>
                    <ul style="font-size:0.85rem;line-height:1.8;padding-left:20px;margin-top:10px;">
                        <li><b style="color:#64748b;">COMMON</b> | <b style="color:#1d4ed8;">RARE</b></li>
                        <li><b style="color:#7e22ce;">EPIC</b> | <b style="color:#b45309;">LEGENDARY</b></li>
                    </ul>`,
                back: `
                    <h2 style="font-size:1.3rem;color:#ef4444;font-family:var(--font-heading);border-bottom:2px solid rgba(0,0,0,0.1);padding-bottom:5px;">STATUS EFFECTS</h2>
                    <p style="font-size:0.9rem;line-height:1.6;margin-top:10px;">Combat is no longer just about raw damage. Managing effects is key to victory.</p>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:0.75rem;margin-top:15px;">
                        <div style="color:#166534;"><b>POISON:</b> DoT.</div>
                        <div style="color:#9a3412;"><b>BURN:</b> Def Shred.</div>
                        <div style="color:#854d0e;"><b>STUN:</b> Skip Turn.</div>
                        <div style="color:#991b1b;"><b>BLEED:</b> % HP Dmg.</div>
                    </div>`
            },
            {   // Future
                front: `
                    <div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;">
                        <h2 style="border:none;font-size:1.6rem;font-family:var(--font-heading);color:#991b1b;">THE FUTURE</h2>
                        <p style="font-size:0.95rem;line-height:1.7;margin-top:25px;">Aethelgard continues to expand. Next update arriving soon with new classes, worlds, and the "Abyssal Gate" challenge.</p>
                        <div style="font-size:3rem;margin-top:30px;opacity:0.8;">🏆</div>
                        <p style="font-size:0.75rem;color:#64748b;margin-top:30px;letter-spacing:1px;">v1.2.0 - STABLE BUILD</p>
                    </div>`,
                back: ``
            }
        ];
    }

    render() {
        const overlay = document.createElement('div');
        overlay.className = 'book-overlay';
        overlay.id = 'chronicles-ui';
        overlay.style.zIndex = "10000"; // Ensure it's on top
        
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
            <button class="book-btn" id="prev-chronicle">◀ PREV</button>
            <button class="book-btn" id="next-chronicle">NEXT ▶</button>
        `;

        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-book';
        closeBtn.innerHTML = '✕ CLOSE UPDATE LOG';
        closeBtn.onclick = () => overlay.remove();

        overlay.onclick = (e) => {
            if (e.target === overlay) overlay.remove();
        };

        overlay.appendChild(book);
        overlay.appendChild(nav);
        overlay.appendChild(closeBtn);
        this.parent.appendChild(overlay);

        const pageElements = book.querySelectorAll('.book-page');
        const nextBtn = nav.querySelector('#next-chronicle');
        const prevBtn = nav.querySelector('#prev-chronicle');

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
