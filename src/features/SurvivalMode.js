export class SurvivalMode {
    constructor(engine, renderer) {
        this.engine = engine;
        this.renderer = renderer;
        this.active = false;
        
        // Survival Rules
        this.difficultyMultiplier = 1.0;
        this.waveTimer = 0;
        this.waveDuration = 30; // seconds per wave
    }

    start() {
        this.active = true;
        this.difficultyMultiplier = 1.0;
        this.waveTimer = 0;
        console.log("Survival Mode Initiated");
    }

    update(dt) {
        if (!this.active) return;
        
        this.waveTimer += dt;
        if (this.waveTimer >= this.waveDuration) {
            this.waveTimer = 0;
            this.difficultyMultiplier += 0.5;
            this.triggerNextWave();
        }
    }

    triggerNextWave() {
        // Trigger visual effects
        this.renderer.shake(15, 1.0);
        
        // Spawn more aggressive enemies based on this.difficultyMultiplier
        console.log("Wave Complete. Difficulty is now x" + this.difficultyMultiplier);
    }
}
