import { GameObject } from './GameObject.js';

export class Enemy extends GameObject {
    constructor(x, y, type = 'basic') {
        super(x, y, 30, 30);
        this.type = type;
        this.speed = 150;
        this.hp = 20;
        this.scoreValue = 100;
        
        // AI State
        this.state = 'spawning'; // spawning, pursuing, attacking
        this.target = null;
    }

    init(targetPlayer) {
        this.target = targetPlayer;
        this.state = 'pursuing';
    }

    update(dt) {
        if (!this.target) return;

        // Basic Pursuit AI
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.vx = (dx / distance) * this.speed;
            this.vy = (dy / distance) * this.speed;
        }

        super.update(dt);
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw enemy placeholder
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff4444';
        ctx.shadowColor = '#ff4444';
        ctx.shadowBlur = 10;
        ctx.fill();
        
        ctx.restore();
    }
}
