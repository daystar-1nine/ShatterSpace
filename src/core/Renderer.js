import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ParticleSystem } from '../systems/ParticleSystem.js';

class Renderer {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) {
            console.error('Three.js canvas not found');
            return;
        }

        this.scene = new THREE.Scene();
        // Add a subtle dark space color
        this.scene.background = new THREE.Color(0x050510);
        
        // Setup Camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 100;

        // Setup Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Post Processing (Bloom)
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);

        // Add Infinite Starfield
        this.createStars();

        // Add Nebula Effects
        this.createNebula();
        
        // Initialize GPU Particle System
        this.particles = new ParticleSystem(this.scene, 5000);

        // Resize handler
        window.addEventListener('resize', this.onWindowResize.bind(this));

        // Start internal loop
        this.clock = new THREE.Clock();
        
        // Screen Shake properties
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        
        this.render();
    }

    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 3000;
        const starPositions = new Float32Array(starCount * 3);

        for(let i = 0; i < starCount * 3; i++) {
            starPositions[i] = (Math.random() - 0.5) * 2000;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 2,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    createNebula() {
        // Placeholder for more complex volumetric nebula, currently simple colored particles
        const nebulaGeo = new THREE.BufferGeometry();
        const nebCount = 500;
        const nebPos = new Float32Array(nebCount * 3);

        for(let i = 0; i < nebCount * 3; i++) {
            nebPos[i*3] = (Math.random() - 0.5) * 500;
            nebPos[i*3+1] = (Math.random() - 0.5) * 500;
            nebPos[i*3+2] = (Math.random() - 0.5) * 200 - 100; // Push back
        }

        nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebPos, 3));
        const nebMat = new THREE.PointsMaterial({
            color: 0x8800ff,
            size: 40,
            transparent: true,
            opacity: 0.05,
            blending: THREE.AdditiveBlending
        });

        this.nebula = new THREE.Points(nebulaGeo, nebMat);
        this.scene.add(this.nebula);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
    }

    render() {
        requestAnimationFrame(this.render.bind(this));
        
        const delta = this.clock.getDelta();
        
        // Handle Screen Shake
        if (this.shakeDuration > 0) {
            this.shakeDuration -= delta;
            this.camera.position.x = (Math.random() - 0.5) * this.shakeIntensity;
            this.camera.position.y = (Math.random() - 0.5) * this.shakeIntensity;
        } else {
            this.camera.position.x = 0;
            this.camera.position.y = 0;
        }
        
        // Gentle rotation for stars
        if (this.stars) {
            this.stars.rotation.y += 0.02 * delta;
            this.stars.rotation.x += 0.01 * delta;
        }

        if (this.nebula) {
            this.nebula.rotation.z += 0.05 * delta;
        }

        // Update GPU Particles
        if (this.particles) {
            this.particles.update(delta);
        }

        // Render scene
        this.composer.render();
    }
}

export const rendererInstance = new Renderer();

window.rendererInstance = rendererInstance;
