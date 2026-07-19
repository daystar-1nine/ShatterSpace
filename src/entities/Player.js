import { GameObject } from './GameObject.js';

export class Player extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 40); // 40x40 hitbox
        this.speed = 400; // pixels per second
        
        // Stats
        this.hp = 100;
        this.maxHp = 100;
        this.armor = 50;
        this.maxArmor = 50;
        
        // Weapons
        this.fireRate = 0.2; // seconds between shots
        this.lastFireTime = 0;
        this.damage = 10;
        
        // Visuals
        this.tilt = 0;
    }

    update(dt, input) {
        // Momentum and Movement
        this.vx = 0;
        this.vy = 0;

        if (input.keys['w'] || input.keys['arrowup']) this.vy -= this.speed;
        if (input.keys['s'] || input.keys['arrowdown']) this.vy += this.speed;
        if (input.keys['a'] || input.keys['arrowleft']) this.vx -= this.speed;
        if (input.keys['d'] || input.keys['arrowright']) this.vx += this.speed;

        // Diagonal normalization
        if (this.vx !== 0 && this.vy !== 0) {
            const length = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            this.vx = (this.vx / length) * this.speed;
            this.vy = (this.vy / length) * this.speed;
        }

        // Tilt effect based on movement
        this.tilt = (this.vx / this.speed) * 15; // Max 15 degrees tilt

        super.update(dt);
        
        // Bounds checking
        this.x = Math.max(0, Math.min(this.x, window.innerWidth));
        this.y = Math.max(0, Math.min(this.y, window.innerHeight));
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.tilt * Math.PI / 180);
        
        // Draw spaceship (placeholder until Three.js model migration)
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(15, 15);
        ctx.lineTo(0, 5);
        ctx.lineTo(-15, 15);
        ctx.closePath();
        
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.restore();
    }
}
