import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene, maxParticles = 5000) {
        this.scene = scene;
        this.maxParticles = maxParticles;
        this.activeCount = 0;

        // Using InstancedMesh for extreme GPU performance
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.mesh = new THREE.InstancedMesh(geometry, material, this.maxParticles);
        this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.mesh);

        this.particles = [];
        const dummy = new THREE.Object3D();

        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                active: false,
                life: 0,
                maxLife: 1,
                x: 0, y: 0, z: 0,
                vx: 0, vy: 0, vz: 0,
                scale: 1,
                color: new THREE.Color()
            });
            // Initialize instances out of view
            dummy.position.set(9999, 9999, 9999);
            dummy.updateMatrix();
            this.mesh.setMatrixAt(i, dummy.matrix);
        }
        
        this.mesh.instanceMatrix.needsUpdate = true;
    }

    spawn(x, y, z, vx, vy, vz, life, colorHex, scale) {
        for (let i = 0; i < this.maxParticles; i++) {
            if (!this.particles[i].active) {
                const p = this.particles[i];
                p.active = true;
                p.x = x; p.y = y; p.z = z;
                p.vx = vx; p.vy = vy; p.vz = vz;
                p.life = life;
                p.maxLife = life;
                p.scale = scale;
                p.color.setHex(colorHex);
                
                if(this.mesh.instanceColor) {
                   this.mesh.setColorAt(i, p.color);
                   this.mesh.instanceColor.needsUpdate = true;
                }
                
                this.activeCount++;
                return;
            }
        }
    }

    update(dt) {
        if (this.activeCount === 0) return;

        const dummy = new THREE.Object3D();
        this.activeCount = 0;

        for (let i = 0; i < this.maxParticles; i++) {
            const p = this.particles[i];
            if (p.active) {
                p.life -= dt;
                
                if (p.life <= 0) {
                    p.active = false;
                    dummy.position.set(9999, 9999, 9999);
                    dummy.updateMatrix();
                    this.mesh.setMatrixAt(i, dummy.matrix);
                } else {
                    p.x += p.vx * dt;
                    p.y += p.vy * dt;
                    p.z += p.vz * dt;
                    
                    const progress = p.life / p.maxLife;
                    const currentScale = p.scale * progress; // Shrink over time
                    
                    dummy.position.set(p.x, p.y, p.z);
                    dummy.scale.set(currentScale, currentScale, currentScale);
                    dummy.updateMatrix();
                    this.mesh.setMatrixAt(i, dummy.matrix);
                    
                    this.activeCount++;
                }
            }
        }

        this.mesh.instanceMatrix.needsUpdate = true;
    }
}
