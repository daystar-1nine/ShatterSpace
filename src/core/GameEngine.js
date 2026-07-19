export class GameEngine {
    constructor() {
        this.lastTime = performance.now();
        this.deltaTime = 0;
        this.isRunning = false;
        
        // Systems
        this.systems = [];
        this.entities = [];
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    stop() {
        this.isRunning = false;
    }

    addSystem(system) {
        this.systems.push(system);
    }

    addEntity(entity) {
        this.entities.push(entity);
    }

    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index > -1) {
            this.entities.splice(index, 1);
        }
    }

    loop(currentTime) {
        if (!this.isRunning) return;

        // Calculate delta time in seconds, capped to prevent huge jumps (e.g. tab unfocused)
        this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        this.update(this.deltaTime);
        this.render();

        requestAnimationFrame(this.loop.bind(this));
    }

    update(dt) {
        // Update all registered systems (e.g. CollisionSystem, WaveManager)
        for (const system of this.systems) {
            if (system.update) system.update(dt);
        }

        // Update all entities
        for (const entity of this.entities) {
            if (entity.update) entity.update(dt);
        }
    }

    render() {
        // The Three.js Renderer handles its own loop, but we can sync here if needed.
        // 2D Canvas entities will render here.
        for (const entity of this.entities) {
            if (entity.render) entity.render();
        }
    }
}
