import { UIManager } from './ui/UIManager.js';
UIManager.init();
import "./core/Renderer.js";
import { DailyMissions } from "./features/DailyMissions.js";
const dailyMissions = new DailyMissions();
let frameCount = 0;

        // HIDDEN DEV CHEAT CODE (No visible UI mention per request)
        document.getElementById('menu-title').addEventListener('click', () => {
            savedCredits += 500000;
            localStorage.setItem('stellar_credits', savedCredits);
            updateDisplays();
            console.log("Dev Mode hack applied invisibly.");

            if (window.rendererInstance && window.rendererInstance.particles) {
                for (let j = 0; j < count * 2; j++) {
                    let glX = (x - window.innerWidth / 2) / (window.innerWidth / 20);
                    let glY = -(y - window.innerHeight / 2) / (window.innerHeight / 20);
                    window.rendererInstance.particles.spawn(
                        glX, glY, -2,
                        (Math.random() - 0.5) * speedMult,
                        (Math.random() - 0.5) * speedMult,
                        (Math.random() - 0.5) * 5,
                        0.5 + Math.random(),
                        0xffaa00,
                        Math.random() * 0.5 + 0.1
                    );
                }
            }
        });

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let width, height;

        function resizeCanvas() {
            let winW = window.innerWidth; let winH = window.innerHeight;
            if (winW < 768) { width = canvas.width = 800; height = canvas.height = 800 * (winH / winW); } 
            else { width = canvas.width = winW; height = canvas.height = winH; }
            canvas.style.width = winW + 'px'; canvas.style.height = winH + 'px';
        }
        window.addEventListener('resize', resizeCanvas); resizeCanvas();
        function getScale() { return canvas.width / window.innerWidth; }

        let audioCtx = null;
        function initAudio() {
            try {
                if (!audioCtx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) audioCtx = new AudioContext();
                }
                if (audioCtx && audioCtx.state === 'suspended') { audioCtx.resume().catch(()=>{}); }
            } catch (e) { console.warn("Audio Context disabled"); }
        }

        function playSound(type) {
            if (!audioCtx) return;
            try {
                if (audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
                const osc = audioCtx.createOscillator(); const gainNode = audioCtx.createGain();
                osc.connect(gainNode); gainNode.connect(audioCtx.destination);
                
                if (type === 'shoot') { osc.type = 'square'; osc.frequency.setValueAtTime(300, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1); gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1); osc.start(); osc.stop(audioCtx.currentTime + 0.1); } 
                else if (type === 'laser') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(800, audioCtx.currentTime); osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.2); gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime); gainNode.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.2); osc.start(); osc.stop(audioCtx.currentTime + 0.2); } 
                else if (type === 'explosion') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.3); gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3); osc.start(); osc.stop(audioCtx.currentTime + 0.3); } 
                else if (type === 'powerup') { osc.type = 'sine'; osc.frequency.setValueAtTime(600, audioCtx.currentTime); osc.frequency.setValueAtTime(1200, audioCtx.currentTime + 0.2); gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3); osc.start(); osc.stop(audioCtx.currentTime + 0.3); } 
                else if (type === 'emp') { osc.type = 'square'; osc.frequency.setValueAtTime(50, audioCtx.currentTime); osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 1.0); gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0); osc.start(); osc.stop(audioCtx.currentTime + 1.0); }
                else if (type === 'achievement') { osc.type = 'sine'; osc.frequency.setValueAtTime(400, audioCtx.currentTime); osc.frequency.setValueAtTime(600, audioCtx.currentTime + 0.1); osc.frequency.setValueAtTime(800, audioCtx.currentTime + 0.2); gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5); osc.start(); osc.stop(audioCtx.currentTime + 0.5); }
            } catch(e) {}
        }

        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', (e) => { 
                const modal = e.target.closest('.info-modal');
                if(modal) modal.style.display = 'none'; 
            });
        });
        document.getElementById('btn-open-patch').addEventListener('click', () => { document.getElementById('modal-patch').style.display = 'flex'; });
        document.getElementById('btn-open-missions').addEventListener('click', () => { 
            let html = '';
            dailyMissions.missions.forEach(m => { 
                let pct = Math.min(100, Math.round((m.current / m.target) * 100));
                let isDone = m.current >= m.target;
                html += `<div class='ach-item' style='border-color: ${isDone?'#33ff88':'#555'}'><div class='ach-icon'>${isDone?'✅':'🎯'}</div><div class='ach-info'><h4>${m.desc}</h4><p>Reward: ${m.reward}</p></div><div style='color: ${isDone?'#33ff88':'#fff'}; font-weight: bold;'>${pct}%</div></div>`; 
            });
            document.getElementById('missions-list').innerHTML = html;
            document.getElementById('modal-missions').style.display = 'flex'; 
        });
        document.getElementById('btn-open-ach').addEventListener('click', () => { renderAchievements(); document.getElementById('modal-achievements').style.display = 'flex'; });
        document.getElementById('btn-open-coffee').addEventListener('click', () => { document.getElementById('modal-coffee').style.display = 'flex'; });
        document.getElementById('btn-open-credits').addEventListener('click', () => { document.getElementById('modal-credits').style.display = 'flex'; });
        document.getElementById('btn-open-wipe').addEventListener('click', () => { document.getElementById('modal-wipe').style.display = 'flex'; });

        const LORE = {
            'dmg': { title: 'Weapon Damage', icon: '💥', desc: "Boosts your base cannon damage, shredding enemy armor faster with every shot." },
            'fire': { title: 'Fire Rate', icon: '⚡', desc: "Overclocks your blasters cooling systems to fire significantly faster." },
            'hp': { title: 'Hull Integrity', icon: '❤️', desc: "Reinforces the titanium chassis for more maximum health points." },
            'armor': { title: 'Armor Capacity', icon: '🔰', desc: "Upgrades your regenerative energy plating. Absorbs minor hits instantly." },
            'magnet': { title: 'Magnet Range', icon: '🧲', desc: "Enhances your scoop, pulling in credits and powerups from much further away." },
            'luck': { title: 'Loot Luck', icon: '🍀', desc: "Hacks the enemy loot tables, increasing the drop rate of powerups." },
            'forge': { title: 'Credit Forge', icon: '💰', desc: "Generates extra physical credits internally with every loot drop." },
            'spread': { title: 'Spread Power', icon: '🔱', desc: "Increases the raw damage multiplier of the Spread Shot powerup." },
            'rapid': { title: 'Rapid Power', icon: '🔫', desc: "Further decreases the firing delay when Rapid Fire is active." },
            'laser': { title: 'Laser Power', icon: '🔥', desc: "Massively amplifies the melting damage of the continuous Laser Beam." },
            'dronefire': { title: 'Drone Fire Rate', icon: '🔋', desc: "Increases the speed at which your companion drones blast enemies." },
            'dronecount': { title: 'Drone Swarm', icon: '🛸', desc: "Deploys an additional companion drone to flank your ship (Max 4 Drones)." },
            'drone': { title: 'Plasma Drone Core', icon: '🛸', desc: "Installs the core AI subsystem, deploying your first companion drone." },
            'shield': { title: 'Deflector Shield', icon: '🛡️', desc: "Generates a one-time energy barrier that completely absorbs a fatal meteor hit." },
            'emp': { title: 'EMP Nuke', icon: '☢️', desc: "Tap the HUD ability to unleash a shockwave that instantly clears all minor hazards." },
            'gravity_well': { title: 'Gravity Well Generator', icon: '🌀', desc: "Deploy a temporary singularity that sucks in enemies and debris before detonating." },
            'nano_bots': { title: 'Nano-Bot Repair Kit', icon: '🦠', desc: "Passive microscopic bots that continually reconstruct your hull integrity mid-combat." },
            'overdrive': { title: 'Overdrive Capacitor', icon: '⚙️', desc: "Absorbs residual energy from destroyed Phase Bosses, permanently boosting fire rate for the run." },
            'phase_shift': { title: 'Phase Shift Engine', icon: '👻', desc: "Temporarily shift out of standard reality, passing harmlessly through all hazards." },
            'bounty_hunter': { title: 'Bounty Hunter Module', icon: '🎯', desc: "Hacks local sector feeds, permanently boosting all physical credit drops by 25%." },
            'basic': { title: 'Basic Hull', icon: '🚀', desc: "The standard Federation scout ship. Mass-produced for planetary defense, it is reliable and deeply nostalgic." },
            'striker': { title: 'Striker', icon: '🛩️', desc: "A sleek, aerodynamic fighter stripped of heavy armor to achieve terrifying sub-light speeds." },
            'juggernaut': { title: 'Juggernaut', icon: '🛸', desc: "Originally designed for asteroid mining, this dreadnought chassis was weaponized to ram through enemy blockades." },
            'valkyrie': { title: 'Valkyrie', icon: '🦅', desc: "An elite interceptor flown by the Royal Guard. Its forward-swept wings slice through atmospheric entry heat." },
            'titan': { title: 'Titan', icon: '🪨', desc: "A massive, blocky armored fortress. It trades all agility for the ability to shrug off direct missile impacts." },
            'wraith': { title: 'Wraith', icon: '🦇', desc: "An experimental stealth ship reverse-engineered from captured alien geometry. It absorbs radar waves perfectly." },
            'phantom': { title: 'Phantom', icon: '🔺', desc: "The ultimate apex predator. Dedicated to Itzphantomgg, this ship is a ghost that haunts the deepest sectors of space." },
            'void': { title: 'Void-Walker', icon: '🌌', desc: "A legendary anomaly forged from dark matter. It does not fly through space; it folds the universe around it." },
            'default': { title: 'Deep Space', icon: '🌌', desc: "The cold, vast, and quiet emptiness of standard space. A reminder of how small we really are." },
            'matrix': { title: 'Digital Rain', icon: '🟩', desc: "A tactical HUD simulation displaying the raw environmental code in real-time." },
            'neon': { title: 'Synthwave', icon: '🟪', desc: "A retro-futuristic grid of neon cyan and deep purple, pulsing to the beat of an unseen synthesizer." },
            'crimson': { title: 'Crimson Nebula', icon: '🔴', desc: "A violent, blood-red storm of cosmic gas and radiation left behind by a dying star." },
            'core': { title: 'Galactic Core', icon: '🔥', desc: "The supermassive, glowing center of the galaxy, where gravity is so intense that time begins to warp." }
        };

        const safeParseArray = (key, fallback) => { 
            try { 
                let v = localStorage.getItem(key); 
                if (v === null || v === 'undefined') return fallback;
                let parsed = JSON.parse(v);
                return Array.isArray(parsed) ? parsed : fallback;
            } catch(e) { return fallback; } 
        };

        let totalXP = parseInt(localStorage.getItem('stellar_xp')) || 0;
        if (isNaN(totalXP)) totalXP = 0;
        
        let prestigeCount = parseInt(localStorage.getItem('stellar_prestige')) || 0;
        if (isNaN(prestigeCount)) prestigeCount = 0;

        let savedHighScore = parseInt(localStorage.getItem('stellar_highscore')) || 0;
        if (isNaN(savedHighScore)) savedHighScore = 0;

        let savedCredits = parseFloat(localStorage.getItem('stellar_credits')) || 0;
        if (savedCredits < 0 || isNaN(savedCredits)) { savedCredits = 0; localStorage.setItem('stellar_credits', 0); }
        
        let equippedShip = localStorage.getItem('stellar_ship_design') || 'basic';
        let equippedBG = localStorage.getItem('stellar_bg') || 'default';
        
        let unlockedShips = safeParseArray('stellar_unlocks_ships', ['basic']);
        let unlockedBGs = safeParseArray('stellar_bg_unlocks', ['default']);
        let unlockedUpgrades = safeParseArray('stellar_upgrades', []);
        
        const tierCosts = [250, 500, 1000, 2000, 4000, 8000, 15000, 25000];
        let weaponDamageLvl = parseInt(localStorage.getItem('stellar_dmg_lvl')) || 0;
        let fireRateLvl = parseInt(localStorage.getItem('stellar_fire_lvl')) || 0;
        let hpLvl = parseInt(localStorage.getItem('stellar_hp_lvl')) || 0;
        let armorLvl = parseInt(localStorage.getItem('stellar_armor_lvl')) || 0;
        let magnetLvl = parseInt(localStorage.getItem('stellar_magnet_lvl')) || 0;
        let luckLvl = parseInt(localStorage.getItem('stellar_luck_lvl')) || 0;
        let forgeLvl = parseInt(localStorage.getItem('stellar_forge_lvl')) || 0;
        
        let spreadLvl = parseInt(localStorage.getItem('stellar_spread_lvl')) || 0;
        let rapidLvl = parseInt(localStorage.getItem('stellar_rapid_lvl')) || 0;
        let laserLvl = parseInt(localStorage.getItem('stellar_laser_lvl')) || 0;

        let droneFireLvl = parseInt(localStorage.getItem('stellar_dronefire_lvl')) || 0;
        let droneCountLvl = parseInt(localStorage.getItem('stellar_dronecount_lvl')) || 0;

        let achievements = {};
        try {
            let a = localStorage.getItem('stellar_achievements');
            if (a) achievements = JSON.parse(a);
            if (typeof achievements !== 'object' || achievements === null) achievements = {};
        } catch(e) { achievements = {}; }

        const achList = [];
        let silentAchievementUnlock = true; 
        
        const sysMap = { 'dmg': 'Weapon Damage', 'fire': 'Fire Rate', 'hp': 'Hull Integrity', 'armor': 'Armor Capacity', 'magnet': 'Magnet Range', 'luck': 'Loot Luck', 'forge': 'Credit Forge', 'spread': 'Spread Power', 'rapid': 'Rapid Power', 'laser': 'Laser Power', 'dronefire': 'Drone Fire Rate', 'dronecount': 'Drone Swarm' };
        for(let key in sysMap) {
            let max = (key === 'dronecount') ? 3 : 8;
            for(let i=1; i<=max; i++) { achList.push({ id: `ach_${key}_${i}`, tab: 'upgrades', name: `${sysMap[key]} Mk.${i}`, desc: `Upgrade ${sysMap[key]} to Level ${i}.`, icon: '🔧' }); }
        }

        achList.push({ id: `ach_tech_drone`, tab: 'upgrades', name: `Plasma Drone Core`, desc: `Install the core AI subsystem.`, icon: '🛸' });
        achList.push({ id: `ach_tech_shield`, tab: 'upgrades', name: `Deflector Shield`, desc: `Equip the deflector shield.`, icon: '🛡️' });
        achList.push({ id: `ach_tech_emp`, tab: 'upgrades', name: `EMP Nuke`, desc: `Install the EMP nuke system.`, icon: '☢️' });
        achList.push({ id: `ach_tech_gravity_well`, tab: 'upgrades', name: `Gravity Well`, desc: `Purchase the Gravity Well Generator.`, icon: '🌀' });
        achList.push({ id: `ach_tech_nano_bots`, tab: 'upgrades', name: `Nano-Bots`, desc: `Purchase the Nano-Bot Repair Kit.`, icon: '🦠' });
        achList.push({ id: `ach_tech_overdrive`, tab: 'upgrades', name: `Overdrive Capacitor`, desc: `Purchase the Overdrive Capacitor.`, icon: '⚙️' });
        achList.push({ id: `ach_tech_phase_shift`, tab: 'upgrades', name: `Phase Shift`, desc: `Purchase the Phase Shift Engine.`, icon: '👻' });
        achList.push({ id: `ach_tech_bounty_hunter`, tab: 'upgrades', name: `Bounty Hunter`, desc: `Purchase the Bounty Hunter Module.`, icon: '🎯' });

        const hullsMap = { 'striker': 'Striker', 'juggernaut': 'Juggernaut', 'valkyrie': 'Valkyrie', 'titan': 'Titan', 'wraith': 'Wraith', 'phantom': 'Phantom', 'void': 'Void-Walker' };
        for(let key in hullsMap) achList.push({ id: `ach_hull_${key}`, tab: 'ships', name: `Unlock ${hullsMap[key]}`, desc: `Purchase the ${hullsMap[key]} hull.`, icon: '🚀' });
        
        const bgsMap = { 'matrix': 'Digital Rain', 'crimson': 'Crimson Nebula', 'neon': 'Synthwave', 'core': 'Galactic Core' };
        for(let key in bgsMap) achList.push({ id: `ach_bg_${key}`, tab: 'bgs', name: `Unlock ${bgsMap[key]}`, desc: `Purchase the ${bgsMap[key]} background.`, icon: '🌌' });
        
        for(let i=1; i<=10; i++) achList.push({ id: `ach_phase_${i}`, tab: 'progress', name: `Sector ${i} Cleared`, desc: `Defeat the Phase ${i} Boss.`, icon: '💀' });
        for(let i=1; i<=30; i++) achList.push({ id: `ach_prestige_${i}`, tab: 'progress', name: `Prestige Level ${i}`, desc: `Prestige your ship ${i} times.`, icon: '🌟' });

        let currentAchTab = 'upgrades';
        let popupQueue = [];
        let isPopupShowing = false;

        function showAchievementPopup(ach) {
            popupQueue.push(ach);
            if (!isPopupShowing) processPopupQueue();
        }

        function processPopupQueue() {
            if (popupQueue.length === 0) { isPopupShowing = false; return; }
            isPopupShowing = true;
            const ach = popupQueue.shift();
            
            document.getElementById('ach-popup-icon').innerText = ach.icon;
            document.getElementById('ach-popup-title').innerText = "ACHIEVEMENT UNLOCKED: " + ach.name;
            document.getElementById('ach-popup-desc').innerText = ach.desc;
            
            const popup = document.getElementById('achievement-popup');
            popup.classList.add('show');
            playSound('achievement');
            
            setTimeout(() => {
                popup.classList.remove('show');
                setTimeout(processPopupQueue, 600);
            }, 3000);
        }

        function checkAchievements() {
            try {
                let changed = false;
                const checkAndUnlock = (id, condition) => {
                    if (!achievements[id] && condition) {
                        achievements[id] = true; changed = true;
                        let achDetails = achList.find(a => a.id === id);
                        if (achDetails && !silentAchievementUnlock) showAchievementPopup(achDetails);
                    }
                };

                const upgradeMap = { 'dmg': weaponDamageLvl, 'fire': fireRateLvl, 'hp': hpLvl, 'armor': armorLvl, 'magnet': magnetLvl, 'luck': luckLvl, 'forge': forgeLvl, 'spread': spreadLvl, 'rapid': rapidLvl, 'laser': laserLvl, 'dronefire': droneFireLvl, 'dronecount': droneCountLvl };
                for(let key in upgradeMap) { for(let i=1; i<=upgradeMap[key]; i++) checkAndUnlock(`ach_${key}_${i}`, true); }

                unlockedShips.forEach(h => { if(h !== 'basic') checkAndUnlock(`ach_hull_${h}`, true); });
                unlockedBGs.forEach(b => { if(b !== 'default') checkAndUnlock(`ach_bg_${b}`, true); });
                unlockedUpgrades.forEach(u => { checkAndUnlock(`ach_tech_${u}`, true); });

                let maxPhase = parseInt(localStorage.getItem('stellar_max_phase')) || 0;
                for(let i=1; i<=maxPhase; i++) checkAndUnlock(`ach_phase_${i}`, true);
                for(let i=1; i<=prestigeCount; i++) checkAndUnlock(`ach_prestige_${i}`, true);
                
                if (changed) localStorage.setItem('stellar_achievements', JSON.stringify(achievements));
            } catch(e) { console.warn("Achievement check error suppressed."); }
        }

        function renderAchievements() {
            checkAchievements();
            const container = document.getElementById('achievements-list');
            let filteredList = achList.filter(a => a.tab === currentAchTab);

            let sortedList = filteredList.sort((a, b) => {
                let aUnl = achievements[a.id] ? 1 : 0;
                let bUnl = achievements[b.id] ? 1 : 0;
                return bUnl - aUnl;
            });

            let htmlString = '';
            sortedList.forEach(ach => {
                let isUnlocked = achievements[ach.id];
                htmlString += `
                    <div class="ach-item ${isUnlocked ? 'unlocked' : ''}">
                        <div class="ach-icon">${ach.icon}</div>
                        <div class="ach-text">
                            <h4>${ach.name}</h4>
                            <p>${ach.desc}</p>
                        </div>
                    </div>`;
            });
            container.innerHTML = htmlString;
            
            document.querySelectorAll('.ach-tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-tab') === currentAchTab);
            });
        }

        document.querySelectorAll('.ach-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentAchTab = e.target.getAttribute('data-tab');
                renderAchievements();
            });
        });

        let gameActive = false;
        let score = 0, roundCredits = 0;
        let comboMultiplier = 1.0;
        let prestigeMult = 1.0 + prestigeCount; 
        let globalSpeed = 1.0; 
        let screenShake = 0;
        let activePowerup = null;
        let powerupTimer = 0;
        
        let phase = 1;
        let phaseTimer = 0; 
        let phaseFramesRemaining = 3600; 
        
        let empCooldown = 0;
        let gravCooldown = 0;
        let phaseCooldown = 0;
        
        let phaseShiftActive = false;
        let overdriveStacks = 0;

        let droneAngle = 0;
        let droneLastShot = 0;

        let maxArmor = 100, playerArmor = 100, maxHP = 100, playerHP = 100, shieldActive = false, droneActive = false;

        const stars = [], trailParticles = [], particles = [], asteroids = [], meteors = [], diamonds = [], bullets = [], droppedPowerups = [], enemies = [], bosses = [], floatingTexts = [], gravityWells = [];
        let mouse = { x: width / 2, y: height / 2, clicked: false, angle: -Math.PI / 2 };
        let lastShotTime = 0;

        const scoreEl = document.getElementById('score');
        const multiplierEl = document.getElementById('multiplier');
        const uiHighscore = document.getElementById('ui-highscore');
        const uiRoundXp = document.getElementById('ui-round-xp');
        const uiRoundCredits = document.getElementById('ui-round-credits');
        const phaseCountdownEl = document.getElementById('phase-countdown');

        function calcLevel() { return Math.floor(Math.sqrt(totalXP / 1000)) + 1; }

        function updateInputPos(clientX, clientY) {
            let scale = getScale(); let scaledX = clientX * scale; let scaledY = clientY * scale;
            let dx = scaledX - mouse.x; let dy = scaledY - mouse.y;
            if (dx !== 0 || dy !== 0) mouse.angle = Math.atan2(dy, dx);
            mouse.x = scaledX; mouse.y = scaledY;
        }

        function triggerEMP() {
            if (Date.now() - empCooldown < 30000 || !gameActive) return;
            empCooldown = Date.now();
            createExplosion(width/2, height/2, 150, 280, 60, 100, 70, 30); triggerShake(40); playSound('emp');
            meteors.forEach(m => m.spawn(Math.random() * 2000 + 1000));
            asteroids.forEach(a => { score += 30; createExplosion(a.x, a.y, 10, 20, 30, 80, 50, 4); a.spawn(Math.random() * 800); });
            enemies.length = 0; bullets.length = 0; flashScoreBoard(); uiRoundXp.innerText = score;
            floatingTexts.push(new FloatingText(width/2, height/2 - 50, "EMP DEPLOYED", "#ff00ff"));
        }

        function triggerGrav() {
            if (Date.now() - gravCooldown < 45000 || !gameActive) return;
            gravCooldown = Date.now();
            playSound('powerup');
            gravityWells.push(new GravityWell(mouse.x, mouse.y));
            floatingTexts.push(new FloatingText(mouse.x, mouse.y - 40, "GRAVITY WELL", "#88aaff"));
        }

        function triggerPhase() {
            if (Date.now() - phaseCooldown < 40000 || !gameActive) return;
            phaseCooldown = Date.now();
            phaseShiftActive = true;
            playSound('powerup');
            floatingTexts.push(new FloatingText(mouse.x, mouse.y - 40, "PHASE SHIFT", "#00ffff"));
            setTimeout(() => { phaseShiftActive = false; }, 5000); 
        }

        ['touchstart', 'mousedown'].forEach(evt => {
            document.getElementById('btn-emp').addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); triggerEMP(); });
            document.getElementById('btn-grav').addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); triggerGrav(); });
            document.getElementById('btn-phase').addEventListener(evt, (e) => { e.preventDefault(); e.stopPropagation(); triggerPhase(); });
        });

        canvas.addEventListener('touchstart', (e) => { e.preventDefault(); updateInputPos(e.touches[0].clientX, e.touches[0].clientY); mouse.clicked = true; }, { passive: false });
        canvas.addEventListener('touchmove', (e) => { e.preventDefault(); updateInputPos(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
        canvas.addEventListener('touchend', (e) => { e.preventDefault(); mouse.clicked = false; }, { passive: false });
        window.addEventListener('mousemove', (e) => updateInputPos(e.clientX, e.clientY));
        window.addEventListener('mousedown', (e) => { if(e.target === canvas) mouse.clicked = true; });
        window.addEventListener('mouseup', () => mouse.clicked = false);

        function triggerShake(amount) { screenShake = Math.max(screenShake, amount); }

        function renderDots(containerId, level, maxLevel) {
            const container = document.getElementById(containerId);
            if(!container) return;
            container.innerHTML = '';
            for(let i=0; i<maxLevel; i++) {
                const dot = document.createElement('div');
                dot.className = 'dot' + (i < level ? ' filled' : '');
                container.appendChild(dot);
            }
        }

        function updateDisplays() {
            document.getElementById('menu-stats-display').innerText = `HIGH SCORE: ${savedHighScore} | CREDITS: $${savedCredits.toFixed(2)}`;
            document.getElementById('shop-stats-display').innerText = `CREDITS: $${savedCredits.toFixed(2)}`;
            let lvl = calcLevel();
            document.getElementById('menu-xp-display').innerText = `LVL ${lvl} | XP: ${totalXP} | PRESTIGE: ${prestigeCount}/30`;
            
            const pBtn = document.getElementById('prestige-btn');
            if (lvl >= 100 && prestigeCount < 30) {
                pBtn.style.display = 'inline-block';
                pBtn.innerText = `PRESTIGE (+1.0x MULTIPLIER) - REQ: LVL 100`;
            } else { 
                pBtn.style.display = 'none'; 
            }

            if(uiHighscore) uiHighscore.innerText = savedHighScore;

            document.querySelectorAll('.buy-btn:not([data-type="multitier"])').forEach(btn => {
                const type = btn.getAttribute('data-type'); const val = btn.getAttribute('data-val'); const cost = parseInt(btn.getAttribute('data-cost'));
                let isUnlocked = (type === 'ship' && unlockedShips.includes(val)) || (type === 'bg' && unlockedBGs.includes(val)) || (type === 'upgrade' && unlockedUpgrades.includes(val));
                let isEquipped = (type === 'ship' && equippedShip === val) || (type === 'bg' && equippedBG === val) || (type === 'upgrade' && isUnlocked);
                btn.innerText = "INSPECT"; 
                if(isEquipped) { btn.style.borderColor = '#fff'; btn.style.color = '#fff'; }
                else if(isUnlocked) { btn.style.borderColor = '#88aaff'; btn.style.color = '#88aaff'; }
                else if(savedCredits >= cost) { btn.style.borderColor = '#33ff88'; btn.style.color = '#33ff88'; }
                else { btn.style.borderColor = '#ff4444'; btn.style.color = '#ff4444'; }
            });

            const updateTierBtn = (btnId, currentLvl, maxLvl, dotId) => {
                const btn = document.getElementById(btnId); if(!btn) return;
                btn.innerText = "INSPECT";
                if(currentLvl >= maxLvl) { btn.style.borderColor = '#fff'; btn.style.color = '#fff'; }
                else {
                    let cost = tierCosts[currentLvl];
                    if (savedCredits >= cost) { btn.style.borderColor = '#33ff88'; btn.style.color = '#33ff88'; }
                    else { btn.style.borderColor = '#ff4444'; btn.style.color = '#ff4444'; }
                }
                renderDots(dotId, currentLvl, maxLvl);
            };

            updateTierBtn('btn-dmg', weaponDamageLvl, 8, 'dmg-dots');
            updateTierBtn('btn-fire', fireRateLvl, 8, 'fire-dots');
            updateTierBtn('btn-hp', hpLvl, 8, 'hp-dots');
            updateTierBtn('btn-armor', armorLvl, 8, 'armor-dots');
            updateTierBtn('btn-magnet', magnetLvl, 8, 'magnet-dots');
            updateTierBtn('btn-luck', luckLvl, 8, 'luck-dots');
            updateTierBtn('btn-forge', forgeLvl, 8, 'forge-dots');
            
            updateTierBtn('btn-spread', spreadLvl, 8, 'spread-dots');
            updateTierBtn('btn-rapid', rapidLvl, 8, 'rapid-dots');
            updateTierBtn('btn-laser', laserLvl, 8, 'laser-dots');
            
            updateTierBtn('btn-dronefire', droneFireLvl, 8, 'dronefire-dots');
            updateTierBtn('btn-dronecount', droneCountLvl, 3, 'dronecount-dots');
            
            checkAchievements();
        }

        let currentShopItem = null;
        
        function openLoreModal(type, val, costAttr) {
            let lore = LORE[val] || {title: val, icon: '📦', desc: 'Unknown item.'};
            document.getElementById('lore-title').innerText = lore.title;
            document.getElementById('lore-icon').innerText = lore.icon;
            document.getElementById('lore-desc').innerText = lore.desc;
            
            let cost = 0; let isMaxed = false; let isOwned = false; let isEquipped = false;

            if (type === 'multitier') {
                const upgradeMap = {
                    'dmg': {lvl: weaponDamageLvl, max: 8}, 'fire': {lvl: fireRateLvl, max: 8}, 'hp': {lvl: hpLvl, max: 8},
                    'armor': {lvl: armorLvl, max: 8}, 'magnet': {lvl: magnetLvl, max: 8}, 'luck': {lvl: luckLvl, max: 8},
                    'forge': {lvl: forgeLvl, max: 8}, 'spread': {lvl: spreadLvl, max: 8}, 'rapid': {lvl: rapidLvl, max: 8}, 'laser': {lvl: laserLvl, max: 8},
                    'dronefire': {lvl: droneFireLvl, max: 8}, 'dronecount': {lvl: droneCountLvl, max: 3}
                };
                let tgt = upgradeMap[val];
                if (tgt.lvl >= tgt.max) isMaxed = true; else cost = tierCosts[tgt.lvl];
            } else {
                cost = parseInt(costAttr);
                let isUnlocked = (type === 'ship' && unlockedShips.includes(val)) || (type === 'bg' && unlockedBGs.includes(val)) || (type === 'upgrade' && unlockedUpgrades.includes(val));
                isEquipped = (type === 'ship' && equippedShip === val) || (type === 'bg' && equippedBG === val) || (type === 'upgrade' && isUnlocked);
                if (isUnlocked) isOwned = true;
            }

            let buyBtn = document.getElementById('lore-buy-btn');
            let costDisplay = document.getElementById('lore-cost');
            
            if (isMaxed) {
                costDisplay.innerText = "MAX LEVEL"; costDisplay.style.color = "#ffaa00";
                buyBtn.disabled = true; buyBtn.innerText = "MAXED"; buyBtn.style.borderColor = '#555'; buyBtn.style.color = '#555';
            } else if (isEquipped) {
                costDisplay.innerText = "EQUIPPED"; costDisplay.style.color = "#88aaff";
                buyBtn.disabled = true; buyBtn.innerText = type === 'upgrade' ? "OWNED" : "EQUIPPED"; buyBtn.style.borderColor = '#555'; buyBtn.style.color = '#555';
            } else if (isOwned) {
                costDisplay.innerText = "IN INVENTORY"; costDisplay.style.color = "#88aaff";
                buyBtn.disabled = false; buyBtn.innerText = "EQUIP"; buyBtn.style.borderColor = '#88aaff'; buyBtn.style.color = '#88aaff';
            } else {
                costDisplay.innerText = `COST: $${cost}`; costDisplay.style.color = (savedCredits >= cost) ? "#33ff88" : "#ff4444";
                buyBtn.disabled = (savedCredits < cost); buyBtn.innerText = "PURCHASE"; 
                buyBtn.style.borderColor = (savedCredits >= cost) ? "#33ff88" : "#555";
                buyBtn.style.color = (savedCredits >= cost) ? "#33ff88" : "#555";
            }

            currentShopItem = { type, val, costAttr, isOwned };
            document.getElementById('modal-lore').style.display = 'flex';
        }

        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.target.getAttribute('data-type'); 
                const val = e.target.getAttribute('data-val');
                const costAttr = e.target.getAttribute('data-cost');
                openLoreModal(type, val, costAttr);
            });
        });

        document.getElementById('lore-buy-btn').addEventListener('click', (e) => {
            if (!currentShopItem) return;
            const { type, val, costAttr, isOwned } = currentShopItem;
            let costToDeduct = 0;

            e.target.classList.remove('btn-buy-flash'); void e.target.offsetWidth; e.target.classList.add('btn-buy-flash');

            if (type === 'multitier') {
                const upgradeMap = {
                    'dmg': {lvl: weaponDamageLvl, key: 'stellar_dmg_lvl', max: 8}, 'fire': {lvl: fireRateLvl, key: 'stellar_fire_lvl', max: 8},
                    'hp': {lvl: hpLvl, key: 'stellar_hp_lvl', max: 8}, 'armor': {lvl: armorLvl, key: 'stellar_armor_lvl', max: 8},
                    'magnet': {lvl: magnetLvl, key: 'stellar_magnet_lvl', max: 8}, 'luck': {lvl: luckLvl, key: 'stellar_luck_lvl', max: 8},
                    'forge': {lvl: forgeLvl, key: 'stellar_forge_lvl', max: 8}, 'spread': {lvl: spreadLvl, key: 'stellar_spread_lvl', max: 8},
                    'rapid': {lvl: rapidLvl, key: 'stellar_rapid_lvl', max: 8}, 'laser': {lvl: laserLvl, key: 'stellar_laser_lvl', max: 8},
                    'dronefire': {lvl: droneFireLvl, key: 'stellar_dronefire_lvl', max: 8}, 'dronecount': {lvl: droneCountLvl, key: 'stellar_dronecount_lvl', max: 3}
                };
                let tgt = upgradeMap[val];
                if (tgt.lvl >= tgt.max) return;
                
                costToDeduct = tierCosts[tgt.lvl];
                if (savedCredits < costToDeduct) return; 
                
                savedCredits -= costToDeduct; 
                
                if(val==='dmg') weaponDamageLvl++; else if(val==='fire') fireRateLvl++; else if(val==='hp') hpLvl++; else if(val==='armor') armorLvl++; else if(val==='magnet') magnetLvl++; else if(val==='luck') luckLvl++; else if(val==='forge') forgeLvl++; else if(val==='spread') spreadLvl++; else if(val==='rapid') rapidLvl++; else if(val==='laser') laserLvl++; else if(val==='dronefire') droneFireLvl++; else if(val==='dronecount') droneCountLvl++;
                
                localStorage.setItem(tgt.key, tgt.lvl + 1); 
                localStorage.setItem('stellar_credits', savedCredits); 
            } else {
                costToDeduct = parseInt(costAttr);
                if (isOwned) {
                    if (type === 'ship') { equippedShip = val; localStorage.setItem('stellar_ship_design', equippedShip); } 
                    else if (type === 'bg') { equippedBG = val; localStorage.setItem('stellar_bg', equippedBG); }
                } else {
                    if (savedCredits < costToDeduct) return; 
                    savedCredits -= costToDeduct; localStorage.setItem('stellar_credits', savedCredits);
                    if (type === 'ship') { unlockedShips.push(val); equippedShip = val; localStorage.setItem('stellar_unlocks_ships', JSON.stringify(unlockedShips)); localStorage.setItem('stellar_ship_design', equippedShip); } 
                    else if (type === 'bg') { unlockedBGs.push(val); equippedBG = val; localStorage.setItem('stellar_bg_unlocks', JSON.stringify(unlockedBGs)); localStorage.setItem('stellar_bg', equippedBG); } 
                    else if (type === 'upgrade') { unlockedUpgrades.push(val); localStorage.setItem('stellar_upgrades', JSON.stringify(unlockedUpgrades)); }
                }
            }
            
            updateDisplays();
            openLoreModal(type, val, costAttr); 
        });

        function startGame() {
            try {
                initAudio(); 
                document.getElementById('menu').style.display = 'none'; 
                document.getElementById('death-screen').style.display = 'none';
                document.getElementById('ui').style.display = 'block'; 
                document.body.style.cursor = 'none'; 
                
                score = 0; roundCredits = 0; comboMultiplier = 1.0; globalSpeed = 1.0; 
                
                phase = 1; phaseTimer = 180;
                phaseFramesRemaining = 3600;

                activePowerup = null; powerupTimer = 0; 
                
                empCooldown = 0; gravCooldown = 0; phaseCooldown = 0;
                phaseShiftActive = false; overdriveStacks = 0; gravityWells.length = 0;

                mouse.x = width / 2; mouse.y = height / 2;

                maxArmor = 100 + (armorLvl * 30); maxHP = 100 + (hpLvl * 40);
                playerArmor = maxArmor; playerHP = maxHP;
                document.getElementById('armor-bar').style.width = "100%"; document.getElementById('hp-bar').style.width = "100%";
                
                shieldActive = unlockedUpgrades.includes('shield'); document.getElementById('shield-indicator').style.display = shieldActive ? 'block' : 'none';
                droneActive = unlockedUpgrades.includes('drone');
                
                document.getElementById('hud-abilities').style.display = 'flex';
                document.getElementById('btn-emp').style.display = unlockedUpgrades.includes('emp') ? 'flex' : 'none';
                document.getElementById('btn-grav').style.display = unlockedUpgrades.includes('gravity_well') ? 'flex' : 'none';
                document.getElementById('btn-phase').style.display = unlockedUpgrades.includes('phase_shift') ? 'flex' : 'none';
                
                if(uiRoundXp) uiRoundXp.innerText = score; 
                if(uiRoundCredits) uiRoundCredits.innerText = "0.00";
                if(scoreEl) scoreEl.innerText = score; 
                updateMultiplierUI();
                
                asteroids.forEach(a => a.spawn(Math.random() * 500));
                meteors.forEach(m => m.spawn(Math.random() * 1500)); 
                diamonds.forEach(d => d.spawn(Math.random() * 1000));
                particles.length = 0; trailParticles.length = 0; bullets.length = 0; droppedPowerups.length = 0; enemies.length = 0; bosses.length = 0; floatingTexts.length = 0;
                
                gameActive = true;
            } catch(e) { console.error("Launch Error: ", e); }
        }

        function triggerGameOver(cause) {
            gameActive = false; document.getElementById('ui').style.display = 'none'; document.getElementById('hud-abilities').style.display = 'none'; document.body.style.cursor = 'default';
            createExplosion(mouse.x, mouse.y, 100, 0, 40, 100, 50, 15); triggerShake(20); playSound('explosion');
            
            setTimeout(() => {
                document.getElementById('death-cause').innerText = cause;
                const finalScoreEl = document.getElementById('ds-final-score');
                const breakdownCont = document.getElementById('ds-credits-breakdown');
                const creditsEl = document.getElementById('ds-credits');
                
                document.getElementById('death-screen').style.display = 'flex';
                document.getElementById('ds-menu-btn').disabled = true;
                document.getElementById('play-again-btn').disabled = true;
                document.getElementById('ds-hangar-btn').disabled = true;

                finalScoreEl.innerText = score;

                if (prestigeCount > 0) {
                    breakdownCont.style.display = 'flex';
                    document.getElementById('ds-base-credits').innerText = roundCredits.toFixed(2);
                    document.getElementById('ds-prestige-mult').innerText = prestigeMult.toFixed(1);
                    
                    let targetCredits = roundCredits * prestigeMult;
                    let currentAnimCredits = roundCredits;
                    
                    creditsEl.innerText = currentAnimCredits.toFixed(2);
                    
                    let steps = 40;
                    let stepCount = 0;
                    
                    setTimeout(() => {
                        playSound('powerup');
                        let animInterval = setInterval(() => {
                            stepCount++;
                            currentAnimCredits += (targetCredits - roundCredits) / steps;
                            creditsEl.innerText = currentAnimCredits.toFixed(2);
                            creditsEl.style.transform = `scale(${1 + Math.sin(stepCount * 0.2) * 0.1})`;
                            
                            if (stepCount >= steps) {
                                clearInterval(animInterval);
                                creditsEl.innerText = targetCredits.toFixed(2);
                                creditsEl.style.transform = 'scale(1)';
                                creditsEl.style.color = '#33ff88';
                                creditsEl.style.textShadow = "0 0 20px #33ff88";
                                playSound('achievement');
                                
                                finalizeSave();
                            }
                        }, 25);
                    }, 500);
                } else {
                    breakdownCont.style.display = 'none';
                    creditsEl.innerText = roundCredits.toFixed(2);
                    finalizeSave();
                }
                
                function finalizeSave() {
                    totalXP += score; localStorage.setItem('stellar_xp', totalXP);
                    if (score > savedHighScore) { savedHighScore = score; localStorage.setItem('stellar_highscore', savedHighScore); }
                    updateDisplays();
                    document.getElementById('ds-menu-btn').disabled = false;
                    document.getElementById('play-again-btn').disabled = false;
                    document.getElementById('ds-hangar-btn').disabled = false;
                }
            }, 1500);
        }

        // --- BUTTON LISTENER BINDINGS REPAIRED ---
        document.getElementById('play-btn').addEventListener('click', startGame);
        document.getElementById('play-again-btn').addEventListener('click', startGame);
        document.getElementById('ds-menu-btn').addEventListener('click', () => { document.getElementById('death-screen').style.display = 'none'; document.getElementById('menu').style.display = 'flex'; });
        document.getElementById('ds-hangar-btn').addEventListener('click', () => { document.getElementById('death-screen').style.display = 'none'; document.getElementById('shop').style.display = 'flex'; updateDisplays(); });
        document.getElementById('in-game-menu-btn').addEventListener('click', () => { gameActive = false; document.getElementById('ui').style.display = 'none'; document.getElementById('hud-abilities').style.display = 'none'; document.getElementById('menu').style.display = 'flex'; document.body.style.cursor = 'default'; updateDisplays(); });
        document.getElementById('open-shop-btn').addEventListener('click', () => { document.getElementById('menu').style.display = 'none'; document.getElementById('shop').style.display = 'flex'; updateDisplays(); });
        document.getElementById('close-shop-btn').addEventListener('click', () => { document.getElementById('shop').style.display = 'none'; document.getElementById('menu').style.display = 'flex'; updateDisplays(); });

        class FloatingText {
            constructor(x, y, text, color) { this.x = x; this.y = y; this.text = text; this.color = color; this.life = 1.0; }
            update() { 
                this.y -= 1.5; this.life -= 0.02; ctx.globalAlpha = Math.max(0, this.life); 
                ctx.font = "bold 24px Orbitron"; ctx.textAlign = "center";
                ctx.lineWidth = 3; ctx.strokeStyle = "#000"; ctx.strokeText(this.text, this.x, this.y);
                ctx.fillStyle = this.color; ctx.fillText(this.text, this.x, this.y); 
                ctx.globalAlpha = 1.0; ctx.textAlign = "left"; 
            }
        }

        class Particle {
            constructor(x, y, vx, vy, color, isTrail = false) { 
                this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.color = color; this.life = 1.0; 
                this.decay = isTrail ? (Math.random() * 0.05 + 0.05) : (Math.random() * 0.03 + 0.02); 
                this.size = isTrail ? (Math.random() * 3 + 1.5) : (Math.random() * 2 + 1); 
            }
            update() { this.x += this.vx; this.y += this.vy; this.life -= this.decay; ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color; ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1.0; }
        }

        class GravityWell {
            constructor(x, y) { this.x = x; this.y = y; this.life = 180; this.radius = 0; }
            update(index) {
                this.life--; this.radius = Math.min(200, this.radius + 10);
                
                ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
                ctx.fillStyle = `rgba(136, 170, 255, ${Math.max(0, this.life/180 * 0.2)})`; ctx.fill();
                
                ctx.beginPath(); ctx.arc(this.x, this.y, 25 + Math.sin(Date.now()/100)*5, 0, Math.PI*2);
                ctx.fillStyle = '#050011'; ctx.shadowBlur = 30; ctx.shadowColor = '#88aaff'; ctx.fill(); ctx.shadowBlur = 0;

                const pull = (obj) => {
                    let dx = this.x - obj.x; let dy = this.y - obj.y; let dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist > 0 && dist < this.radius + 100) { obj.x += (dx/dist) * 4; obj.y += (dy/dist) * 4; }
                };
                enemies.forEach(pull); asteroids.forEach(pull); meteors.forEach(pull);
                
                if (this.life <= 0) {
                    createExplosion(this.x, this.y, 100, 220, 40, 100, 70, 15);
                    triggerShake(35); playSound('explosion');
                    enemies.forEach(e => { if(Math.sqrt((this.x-e.x)**2 + (this.y-e.y)**2) < 250) e.hp -= 35; });
                    bosses.forEach(b => { if(Math.sqrt((this.x-b.x)**2 + (this.y-b.y)**2) < 350) b.hp -= 60; });
                    asteroids.forEach(a => { if(Math.sqrt((this.x-a.x)**2 + (this.y-a.y)**2) < 250) a.detonate(); });
                    gravityWells.splice(index, 1);
                }
            }
        }

        class Bullet {
            constructor(x, y, vx, vy, isEnemy = false, isLaser = false, isDrone = false, dmgMult = 1.0) { 
                this.x = x; this.y = y; this.vx = vx; this.vy = vy; this.isEnemy = isEnemy; this.life = 100; 
                this.isLaser = isLaser; this.isDrone = isDrone;
                this.damage = isEnemy ? 1 : (1.0 + weaponDamageLvl * 0.5) * dmgMult; 
                if (isLaser) this.damage *= (5 + laserLvl * 1.5); 
                if (isDrone) this.damage *= 0.5;
            }
            update() { 
                this.x += this.vx; this.y += this.vy; this.life--; 
                if (this.isLaser) {
                    ctx.fillStyle = this.isEnemy ? '#ff3300' : '#ff00ff'; 
                    ctx.shadowBlur = 10; ctx.shadowColor = this.isEnemy ? '#ff3300' : '#ff00ff';
                    ctx.fillRect(this.x - 2, this.y - 15, 4, 30); ctx.shadowBlur = 0;
                } else {
                    ctx.fillStyle = this.isEnemy ? '#ff3300' : (this.isDrone ? '#00ffaa' : '#00ffff'); 
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.isDrone ? 3 : 4, 0, Math.PI * 2); ctx.fill(); 
                }
            }
        }

        function createExplosion(x, y, count, hueBase, hueRange, sat, lit, speedMult = 5) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2; const speed = Math.random() * speedMult;
                particles.push(new Particle(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, `hsl(${hueBase + Math.random() * hueRange}, ${sat}%, ${lit}%)`));
            }
        }

        for(let i = 0; i < 150; i++) stars.push({ x: Math.random() * width, y: Math.random() * height, size: Math.random() * 1.5, speed: (Math.random() * 0.5) + 0.1 });

        let gridOffset = 0;
        function drawBackground() {
            if (equippedBG === 'crimson') ctx.fillStyle = '#11050a'; 
            else if (equippedBG === 'neon') ctx.fillStyle = '#050011';
            else if (equippedBG === 'matrix') ctx.fillStyle = '#001100';
            else ctx.fillStyle = '#050510';
            ctx.clearRect(0, 0, width, height);
            
            if (equippedBG === 'crimson') {
                let grad = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width);
                grad.addColorStop(0, 'rgba(42, 10, 24, 0.4)'); grad.addColorStop(1, 'rgba(10, 0, 5, 0)');
                ctx.clearRect(0, 0, width, height);
            } else if (equippedBG === 'grid') {
                ctx.strokeStyle = 'rgba(51, 255, 136, 0.15)'; ctx.lineWidth = 1; gridOffset = (gridOffset + globalSpeed * 2) % 50;
                ctx.beginPath();
                for (let x = 0; x < width; x += 50) { ctx.moveTo(x, 0); ctx.lineTo(x, height); }
                for (let y = gridOffset - 50; y < height; y += 50) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
                ctx.stroke();
            } else if (equippedBG === 'core') {
                let grad = ctx.createRadialGradient(width/2, height, 10, width/2, height, width);
                grad.addColorStop(0, '#331100'); grad.addColorStop(1, '#050510');
                ctx.clearRect(0, 0, width, height);
            } else if (equippedBG === 'matrix') {
                ctx.fillStyle = '#00ff00'; gridOffset = (gridOffset + globalSpeed * 2) % 200;
                for(let i=0; i<30; i++) { ctx.fillRect((i*80 + gridOffset*2)%width, (i*150 + gridOffset*5)%height, 2, 25); }
            } else if (equippedBG === 'neon') {
                ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)'; ctx.lineWidth = 2; gridOffset = (gridOffset + globalSpeed * 2) % 40;
                ctx.beginPath();
                for(let y = gridOffset; y < height; y+=40) { ctx.moveTo(0, y); ctx.lineTo(width, y); }
                ctx.stroke();
            }

            ctx.fillStyle = equippedBG === 'warp' ? '#b066ff' : (equippedBG === 'crimson' ? '#ff88aa' : (equippedBG === 'core' ? '#ffaa00' : (equippedBG === 'neon' ? '#00ffff' : '#ffffff')));
            stars.forEach(star => {
                if (gameActive) star.y += star.speed * (1 + (globalSpeed - 1) * 0.5); else star.y += star.speed;
                if (star.y > height) { star.y = 0; star.x = Math.random() * width; }
                if (equippedBG === 'warp' && gameActive) { ctx.beginPath(); ctx.moveTo(star.x, star.y); ctx.lineTo(star.x, star.y - (star.speed * globalSpeed * 10)); ctx.strokeStyle = '#b066ff'; ctx.lineWidth = star.size; ctx.stroke(); } 
                else { ctx.beginPath(); ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); ctx.fill(); }
            });
        }

        function drawShip(type) {
            ctx.lineWidth = 2; let thrust = mouse.clicked ? (Math.random() * 10 + 5) : 0; let shipBaseColor = '#00ffff';
            
            if (equippedShip === 'basic') shipBaseColor = '#00ffff';
            else if (equippedShip === 'striker') shipBaseColor = '#ff0044';
            else if (equippedShip === 'juggernaut') shipBaseColor = '#ffaa00';
            else if (equippedShip === 'valkyrie') shipBaseColor = '#33ff88';
            else if (equippedShip === 'titan') shipBaseColor = '#ffaa00';
            else if (equippedShip === 'wraith') shipBaseColor = '#b066ff';
            else if (equippedShip === 'phantom') shipBaseColor = '#111122';
            else if (equippedShip === 'void') shipBaseColor = '#ff00ff';

            if (gameActive && Math.random() > 0.3) {
                let tColor = equippedShip === 'phantom' ? '#00ffff' : shipBaseColor;
                trailParticles.push(new Particle(mouse.x + (Math.random()*10-5), mouse.y + 15, 0, 3 + Math.random()*2, tColor, true));
            }

            if (type === 'striker') {
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#110005';
                if(thrust) { ctx.beginPath(); ctx.moveTo(-6, 12); ctx.lineTo(0, 12+thrust); ctx.lineTo(6, 12); ctx.strokeStyle='#ff8800'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-15, 15); ctx.lineTo(-5, 10); ctx.lineTo(0, 15); ctx.lineTo(5, 10); ctx.lineTo(15, 15); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = 'rgba(0, 255, 255, 0.8)'; ctx.ellipse(0, -5, 3, 8, 0, 0, Math.PI*2); ctx.fill();
            } else if (type === 'juggernaut') {
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#1a1100';
                if(thrust) { ctx.beginPath(); ctx.moveTo(-10, 15); ctx.lineTo(-10, 15+thrust); ctx.moveTo(10, 15); ctx.lineTo(10, 15+thrust); ctx.strokeStyle='#ff8800'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.moveTo(-15, -10); ctx.lineTo(-20, 15); ctx.lineTo(-5, 15); ctx.lineTo(-5, 20); ctx.lineTo(5, 20); ctx.lineTo(5, 15); ctx.lineTo(20, 15); ctx.lineTo(15, -10); ctx.lineTo(10, -20); ctx.lineTo(-10, -20); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = 'rgba(255, 0, 0, 0.6)'; ctx.fillRect(-8, -15, 16, 5);
            } else if (type === 'valkyrie') {
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#001a00';
                if(thrust) { ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(0, 5+thrust); ctx.strokeStyle='#00ff00'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-25, 5); ctx.lineTo(-10, 15); ctx.lineTo(-15, 5); ctx.lineTo(0, 10); ctx.lineTo(15, 5); ctx.lineTo(10, 15); ctx.lineTo(25, 5); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = '#33ff88'; ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
            } else if (type === 'titan') {
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#221100';
                if(thrust) { ctx.beginPath(); ctx.moveTo(-15, 15); ctx.lineTo(-15, 15+thrust); ctx.moveTo(15, 15); ctx.lineTo(15, 15+thrust); ctx.strokeStyle='#ff4400'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(-20, 15); ctx.lineTo(20, 15); ctx.lineTo(20, -10); ctx.lineTo(10, -20); ctx.lineTo(-10, -20); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.fillStyle = '#ffaa00'; ctx.fillRect(-10, -10, 20, 10);
            } else if (type === 'phantom') {
                ctx.strokeStyle = '#00ffff'; ctx.fillStyle = '#050505';
                if(thrust) { ctx.beginPath(); ctx.moveTo(0, 15); ctx.lineTo(0, 15+thrust); ctx.strokeStyle='#00ffff'; ctx.stroke(); ctx.strokeStyle = '#00ffff';}
                ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(-20, 20); ctx.lineTo(0, 10); ctx.lineTo(20, 20); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = '#00ffff'; ctx.arc(0, -5, 3, 0, Math.PI*2); ctx.fill();
            } else if (type === 'wraith') {
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#10051a';
                if(thrust) { ctx.beginPath(); ctx.moveTo(0, 5); ctx.lineTo(0, 5+thrust); ctx.strokeStyle='#ff00ff'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.arc(0, 0, 18, Math.PI, 0); ctx.lineTo(25, 20); ctx.quadraticCurveTo(0, 5, -25, 20); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = '#ff00ff'; ctx.arc(0, -5, 5, 0, Math.PI*2); ctx.fill();
            } else if (type === 'void') {
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#000';
                if(thrust) { ctx.beginPath(); ctx.moveTo(0, 15); ctx.lineTo(0, 15+thrust*1.5); ctx.strokeStyle='#00ffff'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(-10, -5); ctx.lineTo(-25, 0); ctx.lineTo(-10, 15); ctx.lineTo(0, 5); ctx.lineTo(10, 15); ctx.lineTo(25, 0); ctx.lineTo(10, -5); ctx.closePath();
                ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = '#00ffff'; ctx.arc(0, 0, 4, 0, Math.PI*2); ctx.fill();
            } else { 
                ctx.strokeStyle = shipBaseColor; ctx.fillStyle = '#050510';
                if(thrust) { ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo((Math.random()-0.5)*10, 10+thrust); ctx.strokeStyle='#ff8800'; ctx.stroke(); ctx.strokeStyle = shipBaseColor;}
                ctx.beginPath(); ctx.moveTo(-10, 5); ctx.lineTo(-20, 20); ctx.lineTo(0, 15); ctx.lineTo(10, 5); ctx.moveTo(10, 5); ctx.lineTo(20, 20); ctx.lineTo(0, 15); ctx.lineTo(-10, 5);
                ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(-10, 10); ctx.lineTo(-10, -5); ctx.lineTo(0, -20); ctx.lineTo(10, -5); ctx.lineTo(10, 10); ctx.closePath(); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.fillStyle = 'rgba(0, 255, 255, 0.6)'; ctx.ellipse(0, -5, 4, 6, 0, 0, Math.PI*2); ctx.fill();
            }
        }

        function updateMultiplierUI() {
            multiplierEl.innerText = 'x' + comboMultiplier.toFixed(1); multiplierEl.classList.remove('mult-flash'); void multiplierEl.offsetWidth; multiplierEl.classList.add('mult-flash');
            if (comboMultiplier >= 7.5) multiplierEl.style.color = '#ff00ff'; else if (comboMultiplier >= 4.0) multiplierEl.style.color = '#ffaa00'; else multiplierEl.style.color = '#88aaff'; 
        }
        function flashScoreBoard() { scoreEl.innerText = score; scoreEl.classList.remove('score-flash'); void scoreEl.offsetWidth; scoreEl.classList.add('score-flash'); }

        class FallingObject {
            constructor() { this.spawn(); }
            spawn(delay = 0) { this.x = Math.random() * (width - 100) + 50; this.y = -50 - (Math.random() * 300) - delay; this.rot = 0; this.rotSpeed = (Math.random() - 0.5) * 0.1; }
            move() {
                if (gameActive) {
                    let moveX = this.baseVx * globalSpeed; let moveY = this.baseVy * globalSpeed;
                    let magnetRange = 100 + (magnetLvl * 40);
                    if (magnetRange > 100 && !(this instanceof Meteor)) {
                        const dx = mouse.x - this.x; const dy = mouse.y - this.y; const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance > 0 && distance < magnetRange) { const force = 400 / Math.max(distance, 10); moveX += (dx / distance) * force; moveY += (dy / distance) * force; }
                    }
                    this.x += moveX; this.y += moveY; this.rot += this.rotSpeed * globalSpeed;
                    if (this.x < 30 || this.x > width - 30) this.baseVx *= -1;
                }
            }
            checkPlayerCollision() { if (!gameActive) return false; return Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)) < (this.radius + 15); }
            checkBulletCollision() {
                for (let i = bullets.length - 1; i >= 0; i--) {
                    if (!bullets[i].isEnemy && Math.sqrt(Math.pow(bullets[i].x - this.x, 2) + Math.pow(bullets[i].y - this.y, 2)) < this.radius + 10) {
                        if(!bullets[i].isLaser) { bullets.splice(i, 1); return true; }
                        return Math.random() > 0.8; 
                    }
                }
                return false;
            }
        }

        class Asteroid extends FallingObject {
            spawn(delay = 0) {
                super.spawn(delay);
                this.radius = 20 + Math.random() * 15; this.baseVx = (Math.random() - 0.5) * 2; this.baseVy = (Math.random() * 1.5) + 1.0; 
                this.vertices = []; let points = 6 + Math.floor(Math.random() * 4);
                for(let i = 0; i < points; i++) { let angle = (i / points) * Math.PI * 2; let r = this.radius * (0.7 + Math.random() * 0.3); this.vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r }); }
            }
            update() {
                this.move();
                if (gameActive && this.y > height + 50) { this.spawn(Math.random() * 500); if (comboMultiplier > 1.0) { comboMultiplier = Math.max(1.0, Math.round((comboMultiplier - 0.1) * 10) / 10); updateMultiplierUI(); } }
                if (this.checkPlayerCollision() || this.checkBulletCollision()) this.detonate();
                ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.beginPath(); ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
                for(let i = 1; i < this.vertices.length; i++) ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
                ctx.closePath(); ctx.fillStyle = '#5D4037'; ctx.strokeStyle = '#3E2723'; ctx.lineWidth = 3; ctx.fill(); ctx.stroke(); ctx.restore();
            }
            detonate() {
                createExplosion(this.x, this.y, 20, 20, 30, 80, 50, 4); playSound('explosion'); triggerShake(3);
                let dropChance = 0.95 - (luckLvl * 0.02);
                if (Math.random() > dropChance) {
                    let types = ['spread', 'rapid', 'laser', 'nuke', 'repair'];
                    droppedPowerups.push({ x: this.x, y: this.y, type: types[Math.floor(Math.random()*types.length)], vy: 2 });
                }
                comboMultiplier = Math.min(10.0, Math.round((comboMultiplier + 0.1) * 10) / 10);
                
                let pointsGained = Math.floor(Math.random() * 40) + 30;
                score += pointsGained; uiRoundXp.innerText = score;
                
                let bountyMult = unlockedUpgrades.includes('bounty_hunter') ? 1.25 : 1.0;
                let cashEarnedBase = ((Math.random() * 1.5) + 0.5 + (forgeLvl * 0.5)) * comboMultiplier * bountyMult;
                let cashEarnedTotal = cashEarnedBase * prestigeMult;
                
                savedCredits = parseFloat((savedCredits + cashEarnedTotal).toFixed(2)); 
                roundCredits += cashEarnedBase;
                
                uiRoundCredits.innerText = roundCredits.toFixed(2); localStorage.setItem('stellar_credits', savedCredits); 
                
                floatingTexts.push(new FloatingText(this.x, this.y, "+" + pointsGained, "#ffaa00"));
                floatingTexts.push(new FloatingText(this.x, this.y + 20, "+$" + cashEarnedBase.toFixed(2), "#00ffff"));
                
                updateMultiplierUI(); flashScoreBoard(); this.spawn(Math.random() * 800 + 200); 
            }
        }

        class Meteor extends FallingObject {
            spawn(delay = 500) {
                super.spawn(delay);
                this.radius = 18 + Math.random() * 10; this.baseVx = (Math.random() - 0.5) * 2; this.baseVy = (Math.random() * 1.0) + 1.0; 
                this.vertices = []; let points = 5 + Math.floor(Math.random() * 3);
                for(let i = 0; i < points; i++) { let angle = (i / points) * Math.PI * 2; let r = this.radius * (0.6 + Math.random() * 0.5); this.vertices.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r }); }
            }
            update() {
                this.move();
                if (gameActive && this.y > height + 50) this.spawn(Math.random() * 3000 + 1000); 
                if (this.checkBulletCollision() && Math.random() > 0.8) { createExplosion(this.x, this.y + this.radius, 5, 0, 20, 100, 50, 2); playSound('explosion'); }
                if (this.checkPlayerCollision()) {
                    if (shieldActive) { shieldActive = false; document.getElementById('shield-indicator').style.display = 'none'; createExplosion(this.x, this.y, 40, 160, 40, 100, 50, 8); triggerShake(10); playSound('explosion'); this.spawn(2000); } 
                    else { triggerGameOver("CRUSHED BY METEOR"); this.spawn(2000); }
                }
                ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.beginPath(); ctx.moveTo(this.vertices[0].x, this.vertices[0].y);
                for(let i = 1; i < this.vertices.length; i++) ctx.lineTo(this.vertices[i].x, this.vertices[i].y);
                ctx.closePath(); ctx.fillStyle = '#220000'; ctx.strokeStyle = '#ff3300'; ctx.lineWidth = 3; ctx.fill(); ctx.stroke(); ctx.restore();
            }
        }

        class Diamond extends FallingObject {
            spawn(delay = 1000) { super.spawn(delay); this.radius = 15; this.baseVx = (Math.random() - 0.5) * 4; this.baseVy = (Math.random() * 1.0) + 1.5; }
            update() {
                this.move();
                if (gameActive && this.y > height + 50) this.spawn(Math.random() * 1500 + 500);
                if (this.checkPlayerCollision() || this.checkBulletCollision()) this.detonate();
                ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.beginPath(); ctx.moveTo(0, -this.radius); ctx.lineTo(this.radius, 0); ctx.lineTo(0, this.radius); ctx.lineTo(-this.radius, 0); ctx.closePath();
                ctx.fillStyle = 'rgba(0, 255, 255, 0.3)'; ctx.strokeStyle = '#00ffff'; ctx.lineWidth = 2; ctx.fill(); ctx.stroke(); ctx.restore();
            }
            detonate() {
                createExplosion(this.x, this.y, 30, 180, 20, 100, 80, 6); playSound('powerup'); triggerShake(5);
                
                let pts = Math.floor(Math.random() * 400) + 100;
                score += pts; uiRoundXp.innerText = score;
                
                let bountyMult = unlockedUpgrades.includes('bounty_hunter') ? 1.25 : 1.0;
                let cashFoundBase = (Math.floor(Math.random() * 50) + 50 + (forgeLvl * 5)) * Math.min(10.0, comboMultiplier) * bountyMult;
                let cashFoundTotal = cashFoundBase * prestigeMult;
                
                savedCredits = parseFloat((savedCredits + cashFoundTotal).toFixed(2)); 
                roundCredits += cashFoundBase;
                
                uiRoundCredits.innerText = roundCredits.toFixed(2); localStorage.setItem('stellar_credits', savedCredits); 
                
                floatingTexts.push(new FloatingText(this.x, this.y, "+$" + cashFoundBase.toFixed(2), "#00ffff"));
                flashScoreBoard(); this.spawn(Math.random() * 2000 + 1000); 
            }
        }

        class AlienShip {
            constructor() { this.x = -50; this.y = Math.random() * 150 + 50; this.vx = 3; this.radius = 20; this.hp = 5.0; }
            update(index) {
                this.x += this.vx * globalSpeed;
                if (gameActive && Math.random() > 0.5) trailParticles.push(new Particle(this.x + 20, this.y, Math.random()*2, (Math.random()-0.5), '#33ff33', true));
                if (Math.random() > 0.98) bullets.push(new Bullet(this.x, this.y, 0, 5, true));
                
                for (let i = bullets.length - 1; i >= 0; i--) {
                    if (!bullets[i].isEnemy && Math.sqrt(Math.pow(bullets[i].x - this.x, 2) + Math.pow(bullets[i].y - this.y, 2)) < this.radius) {
                        let dmg = bullets[i].damage; 
                        if(!bullets[i].isLaser) { bullets.splice(i, 1); this.hp -= dmg; createExplosion(this.x, this.y, 10, 100, 50, 100, 50, 3); playSound('explosion'); } 
                        else { this.hp -= dmg * 0.15; if(Math.random() > 0.8) { createExplosion(this.x, this.y, 5, 100, 50, 100, 50, 3); playSound('explosion'); } }
                    }
                }
                if (this.hp <= 0) {
                    createExplosion(this.x, this.y, 40, 100, 50, 100, 50, 6); playSound('explosion'); triggerShake(8);
                    
                    let pts = 500; score += pts; uiRoundXp.innerText = score; flashScoreBoard(); 
                    
                    let bountyMult = unlockedUpgrades.includes('bounty_hunter') ? 1.25 : 1.0;
                    let cashFoundBase = (Math.floor(Math.random() * 40) + 30 + (forgeLvl*2)) * bountyMult; 
                    let cashFoundTotal = cashFoundBase * prestigeMult;
                    
                    savedCredits = parseFloat((savedCredits + cashFoundTotal).toFixed(2)); 
                    roundCredits += cashFoundBase;
                    
                    uiRoundCredits.innerText = roundCredits.toFixed(2); localStorage.setItem('stellar_credits', savedCredits); 
                    
                    floatingTexts.push(new FloatingText(this.x, this.y - 15, "+" + pts, "#33ff33"));
                    floatingTexts.push(new FloatingText(this.x, this.y + 15, "+$" + cashFoundBase.toFixed(2), "#00ffff"));
                    let reward = dailyMissions.progressMission(1, 1); if (reward > 0) { savedCredits += reward; floatingTexts.push(new FloatingText(this.x, this.y, "MISSION COMPLETED! +$" + reward, "#ffff00")); localStorage.setItem("stellar_credits", savedCredits); } enemies.splice(index, 1); return;
                }
                if (this.x > width + 50) enemies.splice(index, 1);
                ctx.fillStyle = '#113311'; ctx.strokeStyle = '#33ff33'; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.ellipse(this.x, this.y, 30, 15, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
                ctx.beginPath(); ctx.arc(this.x, this.y - 5, 12, Math.PI, 0); ctx.fillStyle = 'rgba(51, 255, 51, 0.4)'; ctx.fill(); ctx.stroke();
            }
        }

        class Boss {
            constructor() { 
                this.x = width/2; this.y = -100; 
                this.type = phase < 3 ? 'interceptor' : (phase < 5 ? 'dreadnought' : 'mothership');
                let baseHp = this.type === 'interceptor' ? 150 : (this.type === 'dreadnought' ? 400 : 750);
                this.hp = baseHp + (phase * 50); 
                this.maxHp = this.hp; 
                this.radius = this.type === 'interceptor' ? 40 : (this.type === 'dreadnought' ? 70 : 100); 
            }
            update(index) {
                if (this.y < 120) this.y += 2; else this.x += Math.sin(Date.now() / (this.type==='interceptor'?400:600)) * (this.type==='interceptor'?5:3);
                this.x = Math.max(this.radius, Math.min(width - this.radius, this.x));

                let fireChance = this.type === 'interceptor' ? 0.96 : (this.type === 'dreadnought' ? 0.94 : 0.92);
                if (Math.random() > fireChance) {
                    if (this.type === 'interceptor') { bullets.push(new Bullet(this.x, this.y+this.radius/2, 0, 7, true)); } 
                    else if (this.type === 'dreadnought') { bullets.push(new Bullet(this.x - 30, this.y+this.radius/2, 0, 6, true, true)); bullets.push(new Bullet(this.x + 30, this.y+this.radius/2, 0, 6, true, true)); } 
                    else { 
                        // Mothership bullet hell
                        if (!this.angleOffset) this.angleOffset = 0;
                        this.angleOffset += 0.2;
                        for(let i=0; i<8; i++) {
                            let ang = this.angleOffset + (i * Math.PI / 4);
                            bullets.push(new Bullet(this.x, this.y, Math.cos(ang)*5, Math.sin(ang)*5, true));
                        }
                    }
                }

                for (let i = bullets.length - 1; i >= 0; i--) {
                    if (!bullets[i].isEnemy && Math.sqrt(Math.pow(bullets[i].x - this.x, 2) + Math.pow(bullets[i].y - this.y, 2)) < this.radius) {
                        let dmg = bullets[i].damage; 
                        if(!bullets[i].isLaser) { bullets.splice(i, 1); this.hp -= dmg; createExplosion(this.x, this.y + this.radius/2, 5, 200, 50, 100, 50, 2); playSound('explosion'); } 
                        else { this.hp -= dmg * 0.15; if(Math.random() > 0.8) { createExplosion(this.x, this.y + this.radius/2, 5, 200, 50, 100, 50, 2); playSound('explosion'); } }
                    }
                }
                
                if (this.hp <= 0) {
                    createExplosion(this.x, this.y, 150, 200, 50, 100, 50, 12); triggerShake(30); playSound('explosion');
                    
                    if (unlockedUpgrades.includes('overdrive')) { overdriveStacks++; floatingTexts.push(new FloatingText(this.x, this.y - 40, "OVERDRIVE!", "#ffaa00")); }

                    let pts = Math.floor(5000 * (phase/2)); score += pts; 
                    
                    let bountyMult = unlockedUpgrades.includes('bounty_hunter') ? 1.25 : 1.0;
                    let cshBase = (this.type==='interceptor'?500:(this.type==='dreadnought'?1000:2500)) * bountyMult; 
                    let cshTotal = cshBase * prestigeMult;
                    
                    savedCredits += cshTotal; 
                    roundCredits += cshBase;
                    
                    uiRoundCredits.innerText = roundCredits.toFixed(2); uiRoundXp.innerText = score; flashScoreBoard();
                    floatingTexts.push(new FloatingText(this.x, this.y, "BOSS DEFEATED +$" + cshBase.toFixed(2), "#ff00ff"));
                    
                    let maxP = parseInt(localStorage.getItem('stellar_max_phase')) || 0;
                    if(phase > maxP) { localStorage.setItem('stellar_max_phase', phase); }
                    checkAchievements();
                    
                    phase++; phaseTimer = 180; phaseFramesRemaining = 3600; 
                    let reward = dailyMissions.progressMission(3, 1); if (reward > 0) { savedCredits += reward; floatingTexts.push(new FloatingText(this.x, this.y - 20, "MISSION COMPLETED! +$" + reward, "#ffff00")); localStorage.setItem("stellar_credits", savedCredits); } bosses.splice(index, 1); return;
                }

                ctx.lineWidth = 4;
                if (this.type === 'interceptor') {
                    ctx.fillStyle = '#220022'; ctx.strokeStyle = '#ff00ff';
                    ctx.beginPath(); ctx.moveTo(this.x, this.y + this.radius); ctx.lineTo(this.x - this.radius, this.y - this.radius/2); ctx.lineTo(this.x + this.radius, this.y - this.radius/2); ctx.closePath(); ctx.fill(); ctx.stroke();
                } else if (this.type === 'dreadnought') {
                    ctx.fillStyle = '#330000'; ctx.strokeStyle = '#ff3300';
                    ctx.fillRect(this.x - this.radius, this.y - this.radius/2, this.radius*2, this.radius); ctx.strokeRect(this.x - this.radius, this.y - this.radius/2, this.radius*2, this.radius);
                } else {
                    ctx.fillStyle = '#002222'; ctx.strokeStyle = '#00ffaa';
                    ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI, true); ctx.lineTo(this.x - this.radius, this.y + this.radius/2); ctx.lineTo(this.x + this.radius, this.y + this.radius/2); ctx.closePath(); ctx.fill(); ctx.stroke();
                }
                
                ctx.fillStyle = 'red'; ctx.fillRect(this.x - 50, this.y - this.radius - 15, 100, 8);
                ctx.fillStyle = '#00ffff'; ctx.fillRect(this.x - 50, this.y - this.radius - 15, Math.max(0,(this.hp/this.maxHp)) * 100, 8);
            }
        }

        for (let i = 0; i < 4; i++) asteroids.push(new Asteroid());
        for (let i = 0; i < 2; i++) meteors.push(new Meteor());
        for (let i = 0; i < 1; i++) diamonds.push(new Diamond()); 


        function animate() {
    if (gameActive) { frameCount++; if(frameCount % 60 === 0) { let reward = dailyMissions.progressMission(2, 1); if (reward > 0) { savedCredits += reward; floatingTexts.push(new FloatingText(width/2, 100, "MISSION COMPLETED! +$" + reward, "#ffff00")); localStorage.setItem("stellar_credits", savedCredits); } } }
            // GAMEPAD LOGIC
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            const gp = gamepads[0];
            
            if (gp) {
                // Left Stick controls movement or virtual cursor
                if (Math.abs(gp.axes[0]) > 0.1 || Math.abs(gp.axes[1]) > 0.1) {
                    mouse.x += gp.axes[0] * 10;
                    mouse.y += gp.axes[1] * 10;
                    mouse.x = Math.max(0, Math.min(window.innerWidth, mouse.x));
                    mouse.y = Math.max(0, Math.min(window.innerHeight, mouse.y));
                }
                
                // HTML Virtual Cursor (Draws above everything)
                let cursor = document.getElementById('gamepad-cursor');
                if (!cursor) {
                    cursor = document.createElement('div');
                    cursor.id = 'gamepad-cursor';
                    cursor.style.position = 'fixed';
                    cursor.style.width = '16px';
                    cursor.style.height = '16px';
                    cursor.style.borderRadius = '50%';
                    cursor.style.backgroundColor = '#00ffff';
                    cursor.style.border = '2px solid #fff';
                    cursor.style.boxShadow = '0 0 10px #00ffff';
                    cursor.style.pointerEvents = 'none'; // CRITICAL: so it doesn't block elementFromPoint
                    cursor.style.zIndex = '999999';
                    document.body.appendChild(cursor);
                }
                
                if (!gameActive) {
                    cursor.style.display = 'block';
                    cursor.style.left = (mouse.x - 8) + 'px';
                    cursor.style.top = (mouse.y - 8) + 'px';
                } else {
                    cursor.style.display = 'none';
                }
                
                let isPressingA = gp.buttons[0].pressed || gp.buttons[7].pressed;
                if (isPressingA && !mouse.clicked) {
                    mouse.clicked = true;
                    if (gameActive) {
                        document.dispatchEvent(new Event('mousedown'));
                    } else {
                        // Simulate click on DOM element under virtual cursor
                        let el = document.elementFromPoint(mouse.x, mouse.y);
                        if (el && typeof el.click === 'function') el.click();
                    }
                } else if (!isPressingA && mouse.clicked) {
                    mouse.clicked = false;
                    if (gameActive) {
                        document.dispatchEvent(new Event('mouseup'));
                    }
                }
                
                if (gameActive) {
                    if (gp.buttons[1].pressed) {
                        const empBtn = document.getElementById('btn-emp');
                        if (empBtn && empBtn.style.display !== 'none' && !empBtn.classList.contains('cooldown')) empBtn.click();
                    }
                    if (gp.buttons[2].pressed) {
                        const phaseBtn = document.getElementById('btn-phase');
                        if (phaseBtn && phaseBtn.style.display !== 'none' && !phaseBtn.classList.contains('cooldown')) phaseBtn.click();
                    }
                    if (gp.buttons[3].pressed) {
                        const gravBtn = document.getElementById('btn-grav');
                        if (gravBtn && gravBtn.style.display !== 'none' && !gravBtn.classList.contains('cooldown')) gravBtn.click();
                    }
                }
            }
            ctx.save();
            if (screenShake > 0) { ctx.translate(Math.random() * screenShake - screenShake/2, Math.random() * screenShake - screenShake/2); screenShake *= 0.9; if(screenShake < 0.5) screenShake = 0; }

            drawBackground();

            let bossActive = bosses.length > 0;

            if (gameActive) {
                globalSpeed = Math.min(3.5, globalSpeed + 0.0004); 
                
                if (unlockedUpgrades.includes('nano_bots') && playerHP < maxHP) playerHP = Math.min(maxHP, playerHP + 0.05);
                if (playerArmor < maxArmor) playerArmor = Math.min(maxArmor, playerArmor + 0.15); 

                if (!bossActive) {
                    phaseFramesRemaining--;
                    if (phaseFramesRemaining <= 0) { bosses.push(new Boss()); }
                }
                
                if (Math.random() > 0.995 && enemies.length < 2) enemies.push(new AlienShip());

                let now = Date.now();
                if (unlockedUpgrades.includes('emp')) {
                    let pct = Math.max(0, 30000 - (now - empCooldown)) / 30000 * 100;
                    document.getElementById('cd-emp').style.height = pct + '%';
                    if(pct === 0) document.getElementById('btn-emp').classList.add('ready'); else document.getElementById('btn-emp').classList.remove('ready');
                }
                if (unlockedUpgrades.includes('gravity_well')) {
                    let pct = Math.max(0, 45000 - (now - gravCooldown)) / 45000 * 100;
                    document.getElementById('cd-grav').style.height = pct + '%';
                    if(pct === 0) document.getElementById('btn-grav').classList.add('ready'); else document.getElementById('btn-grav').classList.remove('ready');
                }
                if (unlockedUpgrades.includes('phase_shift')) {
                    let pct = Math.max(0, 40000 - (now - phaseCooldown)) / 40000 * 100;
                    document.getElementById('cd-phase').style.height = pct + '%';
                    if(pct === 0) document.getElementById('btn-phase').classList.add('ready'); else document.getElementById('btn-phase').classList.remove('ready');
                }

                if (droneActive) {
                    droneAngle += 0.04;
                    let numDrones = 1 + droneCountLvl; 
                    let droneDelay = Math.max(200, 800 - (droneFireLvl * 80));
                    
                    for(let d=0; d<numDrones; d++) {
                        let offset = (Math.PI * 2 / numDrones) * d;
                        let drX = mouse.x + Math.cos(droneAngle + offset) * 60; 
                        let drY = mouse.y + Math.sin(droneAngle + offset) * 60;
                        ctx.shadowBlur = 10; ctx.shadowColor = '#00ffaa'; ctx.fillStyle = '#00ffaa'; ctx.beginPath(); ctx.arc(drX, drY, 6, 0, Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
                        
                        if (Date.now() - droneLastShot > droneDelay) { 
                            bullets.push(new Bullet(drX, drY, 0, -12, false, false, true, 1.0)); 
                            if(d === numDrones - 1) droneLastShot = Date.now(); 
                        }
                    }
                }

                let odBonus = Math.min(10, overdriveStacks) * 0.15;
                let baseRate = 150 - (fireRateLvl * 12); 
                let rapidDelay = Math.max(10, 40 - (rapidLvl * 4)); 
                let fireRate = (activePowerup === 'rapid' ? rapidDelay : Math.max(50, baseRate)) / (1 + odBonus);
                
                if (mouse.clicked && Date.now() - lastShotTime > fireRate) {
                    playSound(activePowerup === 'laser' ? 'laser' : 'shoot'); lastShotTime = Date.now();
                    let spreadDmg = 1.0 + (spreadLvl * 0.3);
                    
                    if (activePowerup === 'spread') {
                        bullets.push(new Bullet(mouse.x, mouse.y - 15, -4, -12, false, false, false, spreadDmg)); 
                        bullets.push(new Bullet(mouse.x, mouse.y - 15, 0, -12, false, false, false, spreadDmg)); 
                        bullets.push(new Bullet(mouse.x, mouse.y - 15, 4, -12, false, false, false, spreadDmg));
                    } else if (activePowerup === 'laser') {
                        bullets.push(new Bullet(mouse.x, mouse.y - 15, 0, -30, false, true, false, 1.0));
                    } else {
                        bullets.push(new Bullet(mouse.x, mouse.y - 15, 0, -15, false, false, false, 1.0));
                    }
                }

                if (activePowerup) {
                    powerupTimer--;
                    if (powerupTimer <= 0) { activePowerup = null; document.getElementById('powerup-indicator').style.display = 'none'; }
                }
            }

            for (let i = trailParticles.length - 1; i >= 0; i--) { trailParticles[i].update(); if (trailParticles[i].life <= 0) trailParticles.splice(i, 1); }
            for (let i = particles.length - 1; i >= 0; i--) { particles[i].update(); if (particles[i].life <= 0) particles.splice(i, 1); }
            for (let i = floatingTexts.length - 1; i >= 0; i--) { floatingTexts[i].update(); if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1); }
            for (let i = gravityWells.length - 1; i >= 0; i--) { gravityWells[i].update(i); }
            
            for (let i = bullets.length - 1; i >= 0; i--) { 
                bullets[i].update(); 
                if (bullets[i].isEnemy && gameActive && !phaseShiftActive && Math.sqrt(Math.pow(bullets[i].x - mouse.x, 2) + Math.pow(bullets[i].y - mouse.y, 2)) < 15) {
                    bullets.splice(i, 1); triggerShake(8); playSound('explosion');
                    
                    if (shieldActive) { 
                        shieldActive = false; document.getElementById('shield-indicator').style.display = 'none'; 
                        floatingTexts.push(new FloatingText(mouse.x, mouse.y, "SHIELD BROKEN!", "#33ff88"));
                    } else {
                        playerArmor -= 35;
                        if(playerArmor < 0) {
                            playerHP += playerArmor; playerArmor = 0;
                            floatingTexts.push(new FloatingText(mouse.x, mouse.y - 20, "HULL DAMAGE!", "#ff3300"));
                        } else {
                            floatingTexts.push(new FloatingText(mouse.x, mouse.y - 20, "ARMOR HIT", "#00ffff"));
                        }
                        if (playerHP <= 0) triggerGameOver("DESTROYED BY ENEMY FIRE"); 
                    }
                } else if (bullets[i].y < 0 || bullets[i].y > height) bullets.splice(i, 1); 
            }

            for (let i = droppedPowerups.length - 1; i >= 0; i--) {
                let p = droppedPowerups[i]; p.y += p.vy;
                ctx.save(); ctx.translate(p.x, p.y); let scale = 1 + Math.sin(Date.now() / 150) * 0.15; ctx.scale(scale, scale);
                ctx.beginPath(); ctx.arc(0, 0, 15, 0, Math.PI*2); ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; ctx.fill();
                
                let pColor = '#ffff00', pChar = '?';
                if(p.type === 'spread') { pColor = '#ff00ff'; pChar = 'S'; }
                else if(p.type === 'rapid') { pColor = '#ffff00'; pChar = 'R'; }
                else if(p.type === 'laser') { pColor = '#ff0000'; pChar = 'L'; }
                else if(p.type === 'repair') { pColor = '#33ff88'; pChar = 'H'; }
                else if(p.type === 'nuke') { pColor = '#ffaa00'; pChar = 'N'; }

                ctx.lineWidth = 3; ctx.strokeStyle = pColor; ctx.stroke();
                ctx.fillStyle = pColor; ctx.font = "bold 18px Orbitron"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(pChar, 0, 0); ctx.restore();

                if (gameActive && Math.sqrt(Math.pow(p.x - mouse.x, 2) + Math.pow(p.y - mouse.y, 2)) < 30) {
                    if (p.type === 'repair') {
                        playerHP = maxHP; playerArmor = maxArmor; floatingTexts.push(new FloatingText(mouse.x, mouse.y, "HULL REPAIRED!", "#33ff88")); playSound('powerup');
                    } else if (p.type === 'nuke') {
                        triggerEMP();
                    } else {
                        activePowerup = p.type; powerupTimer = 400; playSound('powerup');
                        document.getElementById('powerup-indicator').innerText = (p.type === 'spread' ? "SPREAD SHOT ACTIVE" : (p.type === 'laser' ? "LASER BEAM ACTIVE" : "RAPID FIRE ACTIVE")); 
                        document.getElementById('powerup-indicator').style.display = 'block';
                    }
                    droppedPowerups.splice(i, 1);
                } else if (p.y > height) droppedPowerups.splice(i, 1);
            }
            
            enemies.forEach((e, i) => e.update(i)); bosses.forEach((b, i) => b.update(i)); asteroids.forEach(a => a.update()); diamonds.forEach(d => d.update()); meteors.forEach(m => m.update()); 

            if (gameActive) {
                ctx.save(); ctx.translate(mouse.x, mouse.y); 
                if (phaseShiftActive) { ctx.globalAlpha = 0.4; ctx.shadowBlur = 15; ctx.shadowColor = '#00ffff'; }
                drawShip(equippedShip); 
                ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
                ctx.restore();

                if (playerArmor > 0 || playerHP > 0) {
                    let barY = mouse.y + 40;
                    ctx.fillStyle = 'rgba(51, 255, 136, 0.2)'; ctx.fillRect(mouse.x - 30, barY, 60, 4);
                    ctx.fillStyle = '#33ff88'; ctx.fillRect(mouse.x - 30, barY, 60 * Math.max(0, (playerHP/maxHP)), 4);
                    ctx.strokeStyle = '#33ff88'; ctx.lineWidth = 1; ctx.strokeRect(mouse.x - 30, barY, 60, 4);
                    
                    ctx.fillStyle = 'rgba(0, 255, 255, 0.2)'; ctx.fillRect(mouse.x - 30, barY - 6, 60, 4);
                    ctx.fillStyle = '#00ffff'; ctx.fillRect(mouse.x - 30, barY - 6, 60 * Math.max(0, (playerArmor/maxArmor)), 4);
                    ctx.strokeStyle = '#00ffff'; ctx.strokeRect(mouse.x - 30, barY - 6, 60, 4);
                }

                if (phaseTimer > 0) {
                    phaseTimer--; ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, phaseTimer / 30)})`;
                    ctx.font = "bold 60px Orbitron"; ctx.textAlign = "center";
                    ctx.fillText("PHASE " + phase, width/2, height/2 - 100); ctx.textAlign = "left"; 
                } 
                
                ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; ctx.font = "bold 24px Orbitron"; ctx.textAlign = "left";
                ctx.fillText("PHASE " + phase, 20, height - 30);

                if (!bossActive) {
                    let sec = Math.ceil(phaseFramesRemaining / 60);
                    phaseCountdownEl.innerText = "BOSS IN: " + sec + "s";
                    phaseCountdownEl.style.color = "#ffaa00";
                } else {
                    phaseCountdownEl.innerText = "WARNING: BOSS ACTIVE";
                    phaseCountdownEl.style.color = "#ff3333";
                }
            }

            ctx.restore(); requestAnimationFrame(animate);
        }

        updateDisplays(); animate();
        silentAchievementUnlock = false;
    