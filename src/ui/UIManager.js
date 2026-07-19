
export class UIManager {
    static init() {
        const container = document.createElement('div');
        container.id = 'ui-container';
        container.innerHTML = `<div id="portrait-warning"><h2>⚠️ ROTATE DEVICE</h2><p style="color: #88aaff;">Please rotate your phone to portrait mode to play Shatter Space.</p></div>
    <div id="version-tag">v1.3.1 (Stable Release)</div>

    <!-- MAIN MENU -->
    <div id="menu" class="overlay-menu">
        <h1 id="menu-title">SHATTER SPACE</h1>
        <div class="menu-stats" id="menu-stats-display">HIGH SCORE: 0 | CREDITS: \$0.00</div>
        <div class="menu-xp" id="menu-xp-display">LVL 1 | XP: 0 | PRESTIGE: 0</div>
        <div>
            <button id="play-btn" class="btn">LAUNCH</button>
            <button id="open-shop-btn" class="btn">THE HANGAR</button>
        </div>
        <button id="prestige-btn" class="btn">PRESTIGE (+1.0x MULTIPLIER)</button>
        
        <div class="menu-icons">
            <button id="btn-open-patch" class="icon-btn" title="Patch Notes">📄</button>
            <button id="btn-open-ach" class="icon-btn" title="Achievements">🏅</button>
            <button id="btn-open-missions" class="icon-btn" title="Daily Missions" style="color:#ffff00; border-color:#ffff00;">🎯</button>
            <button id="btn-open-coffee" class="icon-btn" title="Support Dev">☕</button>
            <button id="btn-open-settings" class="icon-btn" title="Settings">⚙️</button>
            <button id="btn-open-credits" class="icon-btn" title="Credits">👥</button>
            <button id="btn-open-wipe" class="icon-btn" style="border-color: #ff4444; color: #ff4444; box-shadow: 0 0 10px rgba(255,68,68,0.2);" title="Wipe Save">☠️</button>
        </div>
        <div class="footer-text">Made with ❤️ By Dev</div>
    </div>

    <!-- MODALS -->

    <div id="modal-settings" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2 style="color: #00ffff; text-shadow: 0 0 10px #00ffff;">SETTINGS</h2>
            
            <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #ffaa00; margin-top: 0;">AUDIO</h3>
                <div class="slider-container">
                    <label>MASTER VOLUME</label>
                    <input type="range" id="vol-master" min="0" max="100" value="100">
                </div>
                <div class="slider-container">
                    <label>MUSIC VOLUME</label>
                    <input type="range" id="vol-music" min="0" max="100" value="100">
                </div>
                <div class="slider-container">
                    <label>SFX VOLUME</label>
                    <input type="range" id="vol-sfx" min="0" max="100" value="100">
                </div>
            </div>

            <div style="text-align: left; background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px;">
                <h3 style="color: #ffaa00; margin-top: 0;">GRAPHICS QUALITY</h3>
                <div style="display: flex; gap: 10px;">
                    <button class="btn quality-btn" data-quality="low" style="flex:1;">LOW</button>
                    <button class="btn quality-btn" data-quality="medium" style="flex:1;">MED</button>
                    <button class="btn quality-btn" data-quality="high" style="flex:1; border-color: #00ffff; box-shadow: 0 0 10px rgba(0,255,255,0.5);">HIGH</button>
                </div>
                <p style="font-size: 10px; color: #888; margin-top: 10px;">High enables Full Post-Processing (Bloom, Grain, Chromatic Aberration) and max particle counts.</p>
            </div>
            
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>


    <div id="modal-missions" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2 style="color: #ffff00; text-shadow: 0 0 10px #ffff00;">DAILY MISSIONS</h2>
            <div id="missions-list" style="margin-top: 20px;"></div>
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <div id="modal-achievements" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2>ACHIEVEMENTS</h2>
            
            <div class="ach-tabs">
                <button class="ach-tab-btn active" data-tab="upgrades">UPGRADES</button>
                <button class="ach-tab-btn" data-tab="ships">SHIPS</button>
                <button class="ach-tab-btn" data-tab="bgs">BACKGROUNDS</button>
                <button class="ach-tab-btn" data-tab="progress">PROGRESS</button>
            </div>

            <div id="achievements-list"></div>
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <div id="modal-patch" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2>PATCH NOTES</h2>
            
            <!-- SCROLLABLE PATCH NOTES HISTORY -->
            <div class="patch-notes-container">
                <h3>v1.3.1 (STABLE RELEASE)</h3>
                <ul>
                    <li>🐛 <b>Launch Engine Restored:</b> Fixed a critical missing event binding that caused the main Launch sequence buttons to become completely unresponsive.</li>
                    <li>🐛 <b>Gravity Well Restored:</b> Repaired a missing script class preventing the Black Hole ability from deploying properly.</li>
                    <li>✨ <b>Active Abilities HUD:</b> Added a sleek tactical HUD at the bottom of the screen! EMP is now triggered via HUD alongside new active abilities.</li>
                    <li>✨ <b>New Ability - Gravity Well:</b> Deploy a massive black hole that sucks in enemies and hazards before detonating!</li>
                    <li>✨ <b>New Ability - Phase Shift:</b> Turn ghostly and gain temporary 5-second invulnerability, passing harmlessly through asteroids!</li>
                    <li>🛡️ <b>New Module - Nano-Bots:</b> Passively and continuously repairs your Hull Integrity during combat!</li>
                    <li>💰 <b>New Module - Bounty Hunter:</b> Permanently multiply all physical credit drops by 25%!</li>
                    <li>⚡ <b>New Module - Overdrive:</b> Defeating Bosses now grants a stacking, permanent boost to your firing speed for the rest of the run!</li>
                </ul>

                <h3>v1.2.2 (Minor Update)</h3>
                <ul>
                    <li>🎨 <b>Purchase Animation:</b> Added an expressive spring scaling pop and neon glowing pulse animation when clicking the shop's action button.</li>
                    <li>📐 <b>Centered Terminal:</b> All inner layout bounds within the Mission Report boxes are perfectly aligned to the absolute center.</li>
                    <li>🐛 <b>Close Buttons Fixed:</b> Changed modal close buttons to absolute floating corners to prevent click-blocking layout bugs.</li>
                </ul>
                
                <h3>v1.2.1 (Major Update)</h3>
                <ul>
                    <li>🏆 <b>Comprehensive Achievements:</b> Over 140 new milestones implemented!</li>
                    <li>🗂️ <b>Achievement Tabs:</b> Organized the massive achievement list into compact, filterable tabs (Upgrades, Ships, Progress).</li>
                    <li>⭐ <b>Level-Based Prestige:</b> Reach Level 100 to earn Prestige stars, granting permanent +1.0x Credit multipliers.</li>
                </ul>
            </div>
            
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <div id="modal-coffee" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2>BUY DEV A COFFEE ☕</h2>
            <p style="color: #88aaff; font-size: 14px; line-height: 1.5;">If you enjoy Shatter Space and want to support the development of future features, consider leaving a tip!</p>
            <div class="qr-placeholder" style="border:none; background:transparent;">
                <img src="/qr.jpg" style="width:100%; height:100%; object-fit: contain; border-radius: 5px;">
            </div>
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <div id="modal-credits" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2>CREDITS</h2>
            <div style="font-size: 16px; color: #00ffff; margin-bottom: 5px; font-weight: bold;">CREATOR & LEAD DEV</div>
            <img src="/profile.png" style="width: 100px; height: 100px; border-radius: 50%; border: 2px solid #ffaa00; margin-bottom: 10px; object-fit: cover; display: block; margin-left: auto; margin-right: auto;">
            
            <div style="font-size: 24px; font-weight: 900; color: #ffaa00; margin-bottom: 10px; letter-spacing: 2px; text-shadow: 0 0 10px #ffaa00;">Suraj Sawant</div>
            <div style="display: flex; justify-content: center; gap: 15px; margin-bottom: 30px;">
                <a href="https://suraj1nine.vercel.app/" target="_blank" style="color: #00ffff; text-decoration: none; font-size: 14px; font-weight: bold; background: rgba(0,255,255,0.1); padding: 5px 10px; border-radius: 5px; border: 1px solid #00ffff; transition: 0.2s;">🌐 Portfolio</a>
                <a href="https://github.com/daystar-1nine" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 14px; font-weight: bold; background: rgba(255,255,255,0.1); padding: 5px 10px; border-radius: 5px; border: 1px solid #ffffff; transition: 0.2s;">💻 GitHub</a>
                <a href="https://www.linkedin.com/in/surajsawant19062005/" target="_blank" style="color: #0077b5; text-decoration: none; font-size: 14px; font-weight: bold; background: rgba(0,119,181,0.1); padding: 5px 10px; border-radius: 5px; border: 1px solid #0077b5; transition: 0.2s;">🔗 LinkedIn</a>
                <a href="https://www.instagram.com/daystar.drafts/" target="_blank" style="color: #e1306c; text-decoration: none; font-size: 14px; font-weight: bold; background: rgba(225,48,108,0.1); padding: 5px 10px; border-radius: 5px; border: 1px solid #e1306c; transition: 0.2s;">📸 Insta</a>
            </div>

            
            <div style="font-size: 14px; color: #88aaff; margin-bottom: 5px;">ADVANCED AGENTIC AI & LEAD ARCHITECT</div>
            <div style="font-size: 20px; font-weight: bold; color: #33ff88; text-shadow: 0 0 10px #33ff88; margin-bottom: 20px;">Antigravity</div>
            <div style="font-size: 12px; color: #aaaaaa; margin-bottom: 30px;">
                An improved version of Itzphantomgg's original: <br>
                <a href="https://stellar-drifter.vercel.app/" target="_blank" style="color: #ffaa00; text-decoration: none;">stellar-drifter.vercel.app</a>
            </div>
            
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <div id="modal-wipe" class="info-modal">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content" style="border-color: #ff4444; box-shadow: 0 0 30px rgba(255,68,68,0.2);">
            <h2 style="color: #ff4444; text-shadow: 0 0 10px #ff4444;">SYSTEM PURGE</h2>
            <p style="color: #ff88aa; font-size: 14px; line-height: 1.5;">WARNING: This will permanently delete your High Score, Credits, Prestige levels, and all unlocked items. Are you absolutely sure?</p>
            <button class="btn" id="confirm-wipe-btn" style="border-color: #ff4444; color: #ff4444; width: 100%;">INITIATE PURGE</button>
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <div id="modal-lore" class="info-modal" style="z-index: 60;">
        <button class="btn-close-floating close-modal-btn">X</button>
        <div class="info-modal-content">
            <h2 id="lore-title" style="color: #ffaa00; border: none; margin-bottom: 5px;">TITLE</h2>
            <div class="shop-icon-preview" id="lore-icon" style="justify-content: center; font-size: 50px; margin: 15px 0;">🚀</div>
            <p id="lore-desc" style="color: #88aaff; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">Lore description goes here.</p>
            <div id="lore-cost" style="color: #33ff88; font-size: 22px; font-weight: bold; margin-bottom: 20px; text-shadow: 0 0 5px currentColor;">COST: \$0</div>
            <div style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
                <button id="lore-buy-btn" class="btn" style="padding: 10px 20px; font-size: 14px; width: 100%;">PURCHASE</button>
            </div>
            <div class="footer-text-modal">Made with ❤️ By Dev</div>
        </div>
    </div>

    <!-- UPGRADED CENTERED DEATH SCREEN (MISSION REPORT CARD) -->
    <div id="death-screen" class="overlay-menu" style="display: none;">
        <button id="ds-menu-btn" class="btn" style="position: absolute; top: 15px; left: 15px; padding: 10px 15px; font-size: 24px; margin: 0;">☰</button>
        
        <div class="mission-report-card">
            <div class="report-header">
                <h1 id="ds-title">SHIP DESTROYED</h1>
                <div id="death-cause-pill"><span style="color: #888;">CAUSE:</span> <span id="death-cause">ENEMY FIRE</span></div>
            </div>

            <div class="report-divider"></div>

            <div class="stats-grid">
                <div class="stat-box score-box">
                    <div class="stat-label">FINAL COMBAT SCORE</div>
                    <div class="stat-value" id="ds-final-score">0</div>
                </div>

                <div class="stat-box credits-box">
                    <div class="stat-label">TOTAL CREDITS EARNED</div>
                    <div class="stat-value" id="ds-credits">\$0.00</div>
                    
                    <div id="ds-credits-breakdown" class="breakdown-tag" style="display: none;">
                        <span>BASE: \$<b id="ds-base-credits">0.00</b></span>
                        <span class="mult-badge">x<b id="ds-prestige-mult">1.0</b> PRESTIGE BONUS</span>
                    </div>
                </div>
            </div>

            <div class="report-divider"></div>

            <div class="action-buttons">
                <button id="play-again-btn" class="btn main-action-btn">PLAY AGAIN</button>
                <button id="ds-hangar-btn" class="btn sub-action-btn">THE HANGAR</button>
            </div>
        </div>

        <div class="footer-text">Made with ❤️ By Dev</div>
    </div>

    <!-- SHOP MENU -->
    <div id="shop" class="overlay-menu" style="display: none;">
        <button id="close-shop-btn" class="btn" style="position: absolute; top: 15px; left: 15px; padding: 10px 15px; font-size: 24px; margin: 0;">☰</button>
        <h1>THE HANGAR</h1>
        <div class="menu-stats" id="shop-stats-display">CREDITS: \$0.00</div>
        
        <div class="shop-section-title">SHIP SYSTEMS (MULTI-TIER)</div>
        <div class="shop-items">
            <div class="shop-item"><h3 style="color: #ffaa00;">Weapon Damage</h3><div class="shop-icon-preview">💥</div><div class="progress-dots" id="dmg-dots"></div><button class="btn buy-btn" id="btn-dmg" data-type="multitier" data-val="dmg">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Fire Rate</h3><div class="shop-icon-preview">⚡</div><div class="progress-dots" id="fire-dots"></div><button class="btn buy-btn" id="btn-fire" data-type="multitier" data-val="fire">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Hull Integrity</h3><div class="shop-icon-preview">❤️</div><div class="progress-dots" id="hp-dots"></div><button class="btn buy-btn" id="btn-hp" data-type="multitier" data-val="hp">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Armor Capacity</h3><div class="shop-icon-preview">🔰</div><div class="progress-dots" id="armor-dots"></div><button class="btn buy-btn" id="btn-armor" data-type="multitier" data-val="armor">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Magnet Range</h3><div class="shop-icon-preview">🧲</div><div class="progress-dots" id="magnet-dots"></div><button class="btn buy-btn" id="btn-magnet" data-type="multitier" data-val="magnet">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Loot Luck</h3><div class="shop-icon-preview">🍀</div><div class="progress-dots" id="luck-dots"></div><button class="btn buy-btn" id="btn-luck" data-type="multitier" data-val="luck">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Credit Forge</h3><div class="shop-icon-preview">💰</div><div class="progress-dots" id="forge-dots"></div><button class="btn buy-btn" id="btn-forge" data-type="multitier" data-val="forge">INSPECT</button></div>
        </div>

        <div class="shop-section-title">POWERUP ENHANCEMENTS (MULTI-TIER)</div>
        <div class="shop-items">
            <div class="shop-item"><h3 style="color: #ffaa00;">Spread Power</h3><div class="shop-icon-preview">🔱</div><div class="progress-dots" id="spread-dots"></div><button class="btn buy-btn" id="btn-spread" data-type="multitier" data-val="spread">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Rapid Power</h3><div class="shop-icon-preview">🔫</div><div class="progress-dots" id="rapid-dots"></div><button class="btn buy-btn" id="btn-rapid" data-type="multitier" data-val="rapid">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Laser Power</h3><div class="shop-icon-preview">🔥</div><div class="progress-dots" id="laser-dots"></div><button class="btn buy-btn" id="btn-laser" data-type="multitier" data-val="laser">INSPECT</button></div>
        </div>

        <div class="shop-section-title">DRONE SUBSYSTEMS (MULTI-TIER)</div>
        <div class="shop-items">
            <div class="shop-item"><h3 style="color: #00ffaa;">Drone Fire Rate</h3><div class="shop-icon-preview">🔋</div><div class="progress-dots" id="dronefire-dots"></div><button class="btn buy-btn" id="btn-dronefire" data-type="multitier" data-val="dronefire">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #00ffaa;">Drone Swarm</h3><div class="shop-icon-preview">🛸</div><div class="progress-dots" id="dronecount-dots"></div><button class="btn buy-btn" id="btn-dronecount" data-type="multitier" data-val="dronecount">INSPECT</button></div>
        </div>

        <div class="shop-section-title">SPECIAL TECH (MODULES & ACTIVES)</div>
        <div class="shop-items">
            <div class="shop-item"><h3 style="color: #00ffaa;">Plasma Drone Core</h3><div class="shop-icon-preview">🛸</div><p style="font-size: 10px; margin: 0 0 10px 0;">Auto-fires at foes.</p><button class="btn buy-btn" data-type="upgrade" data-val="drone" data-cost="3000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #33ff88;">Deflector Shield</h3><div class="shop-icon-preview">🛡️</div><p style="font-size: 10px; margin: 0 0 10px 0;">Absorbs 1 fatal hit.</p><button class="btn buy-btn" data-type="upgrade" data-val="shield" data-cost="1000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ff00ff;">EMP Nuke</h3><div class="shop-icon-preview">☢️</div><p style="font-size: 10px; margin: 0 0 10px 0;">Tap HUD to clear.</p><button class="btn buy-btn" data-type="upgrade" data-val="emp" data-cost="2000">INSPECT</button></div>
            
            <div class="shop-item"><h3 style="color: #88aaff;">Gravity Well</h3><div class="shop-icon-preview">🌀</div><p style="font-size: 10px; margin: 0 0 10px 0;">Black hole AOE.</p><button class="btn buy-btn" data-type="upgrade" data-val="gravity_well" data-cost="4000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #00ffff;">Phase Shift</h3><div class="shop-icon-preview">👻</div><p style="font-size: 10px; margin: 0 0 10px 0;">Temp invincibility.</p><button class="btn buy-btn" data-type="upgrade" data-val="phase_shift" data-cost="5000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #33ff88;">Nano-Bots</h3><div class="shop-icon-preview">🦠</div><p style="font-size: 10px; margin: 0 0 10px 0;">Passive HP regen.</p><button class="btn buy-btn" data-type="upgrade" data-val="nano_bots" data-cost="2500">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Overdrive Cap.</h3><div class="shop-icon-preview">⚙️</div><p style="font-size: 10px; margin: 0 0 10px 0;">Boss kill buffs.</p><button class="btn buy-btn" data-type="upgrade" data-val="overdrive" data-cost="3500">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ff0044;">Bounty Hunter</h3><div class="shop-icon-preview">🎯</div><p style="font-size: 10px; margin: 0 0 10px 0;">+25% Credit drops.</p><button class="btn buy-btn" data-type="upgrade" data-val="bounty_hunter" data-cost="3000">INSPECT</button></div>
        </div>

        <div class="shop-section-title">SHIP DESIGNS (HULLS)</div>
        <div class="shop-items">
            <div class="shop-item"><h3 style="color: #00ffff;">Basic (Cyan)</h3><div class="shop-icon-preview">🚀</div><button class="btn buy-btn" data-type="ship" data-val="basic" data-cost="0">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ff0044;">Striker</h3><div class="shop-icon-preview">🛩️</div><button class="btn buy-btn" data-type="ship" data-val="striker" data-cost="500">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Juggernaut</h3><div class="shop-icon-preview">🛸</div><button class="btn buy-btn" data-type="ship" data-val="juggernaut" data-cost="1500">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #33ff88;">Valkyrie</h3><div class="shop-icon-preview">🦅</div><button class="btn buy-btn" data-type="ship" data-val="valkyrie" data-cost="5000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Titan</h3><div class="shop-icon-preview">🪨</div><button class="btn buy-btn" data-type="ship" data-val="titan" data-cost="12000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #b066ff;">Wraith</h3><div class="shop-icon-preview">🦇</div><button class="btn buy-btn" data-type="ship" data-val="wraith" data-cost="18000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #111122;">Phantom</h3><div class="shop-icon-preview">🔺</div><button class="btn buy-btn" data-type="ship" data-val="phantom" data-cost="25000">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ff00ff;">Void-Walker</h3><div class="shop-icon-preview">🌌</div><button class="btn buy-btn" data-type="ship" data-val="void" data-cost="35000">INSPECT</button></div>
        </div>

        <div class="shop-section-title">LIGHTWEIGHT BACKGROUNDS</div>
        <div class="shop-items" style="margin-bottom: 50px;">
            <div class="shop-item"><h3 style="color: #88aaff;">Deep Space</h3><div class="shop-bg-preview" style="background: #050510;"></div><button class="btn buy-btn" data-type="bg" data-val="default" data-cost="0">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #33ff88;">Digital Rain</h3><div class="shop-bg-preview" style="background: #001100; border-bottom: 2px solid #33ff88;"></div><button class="btn buy-btn" data-type="bg" data-val="matrix" data-cost="300">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ff4444;">Crimson Nebula</h3><div class="shop-bg-preview" style="background: radial-gradient(circle, #2a0a18 0%, #0a0005 100%);"></div><button class="btn buy-btn" data-type="bg" data-val="crimson" data-cost="450">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #00ffff;">Synthwave</h3><div class="shop-bg-preview" style="background: #110022; border-bottom: 2px solid #00ffff;"></div><button class="btn buy-btn" data-type="bg" data-val="neon" data-cost="600">INSPECT</button></div>
            <div class="shop-item"><h3 style="color: #ffaa00;">Galactic Core</h3><div class="shop-bg-preview" style="background: radial-gradient(ellipse at bottom, #331100 0%, #050510 100%);"></div><button class="btn buy-btn" data-type="bg" data-val="core" data-cost="800">INSPECT</button></div>
        </div>
    </div>

    <!-- IN-GAME UI -->
    <div id="ui">
        <div class="ui-left">
            <h1 style="color: #88aaff; text-shadow: 0 0 5px #88aaff;">SHATTER SPACE</h1>
            <div class="stats-row">HIGH SCORE: <span id="ui-highscore">0</span></div>
            <div class="round-stats">SCORE: <span id="ui-round-xp">0</span> | EARNED: \$<span id="ui-round-credits">0.00</span></div>
            <div class="bar-container" id="armor-container">
                <span>ARMOR:</span><div class="bar-bg" id="armor-bar-bg"><div id="armor-bar"></div></div>
            </div>
            <div class="bar-container" id="hp-container">
                <span>HULL :</span><div class="bar-bg" id="hp-bar-bg"><div id="hp-bar"></div></div>
            </div>
            <div id="score-container">
                <div>SCORE: <span id="score">0</span></div>
                <div id="multiplier">x1.0</div>
            </div>
            <div id="phase-countdown" style="margin-top: 10px; font-size: 14px; font-weight: bold; color: #ffaa00;"></div>
            <div id="shield-indicator">SHIELD ACTIVE</div>
            <div id="powerup-indicator"></div>
        </div>
        <div class="ui-right">
            <button id="in-game-menu-btn">☰</button>
        </div>
    </div>
    
    <!-- HUD ABILITIES CONTAINER v1.3.1 -->
    <div id="hud-abilities">
        <div class="hud-btn" id="btn-emp" style="color: #ff00ff; display: none;">
            <div class="cooldown-overlay" id="cd-emp"></div>☢️
        </div>
        <div class="hud-btn" id="btn-grav" style="color: #88aaff; display: none;">
            <div class="cooldown-overlay" id="cd-grav"></div>🌀
        </div>
        <div class="hud-btn" id="btn-phase" style="color: #00ffff; display: none;">
            <div class="cooldown-overlay" id="cd-phase"></div>👻
        </div>
    </div>

    <!-- ACHIEVEMENT TOAST POPUP -->
    <div id="achievement-popup">
        <div id="ach-popup-icon">🏆</div>
        <div id="ach-popup-text">
            <h4 id="ach-popup-title">ACHIEVEMENT UNLOCKED</h4>
            <p id="ach-popup-desc">Description here.</p>
        </div>
    </div>

    <!-- CANVAS -->`;
        document.body.insertBefore(container, document.body.firstChild);
    }
}
