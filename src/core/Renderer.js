import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js';
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
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;

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

        // --- PHASE 1: Post-Processing ---
        this.filmPass = new FilmPass(0.35, 0.025, 648, false);
        this.composer.addPass(this.filmPass);

        this.rgbShiftPass = new ShaderPass(RGBShiftShader);
        this.rgbShiftPass.uniforms['amount'].value = 0.0015;
        this.composer.addPass(this.rgbShiftPass);

        this.vignettePass = new ShaderPass(VignetteShader);
        this.vignettePass.uniforms['offset'].value = 1.0;
        this.vignettePass.uniforms['darkness'].value = 1.2;
        this.composer.addPass(this.vignettePass);
        
        this.setQuality('high');



        // Add Infinite Starfield
        this.createStars();

        // Add Nebula Effects
        this.createNebula();
        
        // --- PHASE 1 SPIKE: WebGL Compositing ---
        this.canvas2D = document.getElementById('canvas');
        if (this.canvas2D) {
            this.canvas2D.width = window.innerWidth;
            this.canvas2D.height = window.innerHeight;
            this.canvas2D.style.opacity = '0';
            
            this.canvasTexture = new THREE.CanvasTexture(this.canvas2D);
            this.canvasTexture.minFilter = THREE.LinearFilter;
            
            this.fgScene = new THREE.Scene();
            this.fgCamera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );
            this.fgCamera.position.z = 0.5;
            
            const fgMaterial = new THREE.MeshBasicMaterial({ map: this.canvasTexture, transparent: true });
            const fgPlane = new THREE.PlaneGeometry(2, 2);
            this.fgMesh = new THREE.Mesh(fgPlane, fgMaterial);
            this.fgScene.add(this.fgMesh);
            
            // Add a second render pass for the foreground so composer applies bloom to both
            this.fgRenderPass = new RenderPass(this.fgScene, this.fgCamera);
            this.fgRenderPass.clear = false;
            // Insert it BEFORE bloom pass
            this.composer.insertPass(this.fgRenderPass, 1);
        }

        
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
        if (this.starLayers) {
            this.starLayers.forEach(l => this.scene.remove(l.points));
        }
        this.starLayers = [];
        
        const createLayer = (count, size, zPos, color) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            for(let i=0; i<count*3; i+=3) {
                pos[i] = (Math.random() - 0.5) * 3000;
                pos[i+1] = (Math.random() - 0.5) * 3000;
                pos[i+2] = zPos + (Math.random() * 50);
            }
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({ color: color, size: size, transparent: true, opacity: 0.8 });
            const points = new THREE.Points(geo, mat);
            this.scene.add(points);
            this.starLayers.push({ points, speed: Math.abs(zPos) * 0.0001 });
        };

        createLayer(1500, 1.5, -200, 0xaaaaaa); // Far
        createLayer(1000, 2.0, -100, 0xddddff); // Mid
        createLayer(500,  2.5, -50,  0xffffff); // Near
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


    setQuality(level) {
        if (level === 'low') {
            if (this.filmPass) this.filmPass.enabled = false;
            if (this.rgbShiftPass) this.rgbShiftPass.enabled = false;
            if (this.vignettePass) this.vignettePass.enabled = false;
            this.renderer.setPixelRatio(1);
            if (this.particles) this.particles.maxParticles = 1000;
        } else if (level === 'medium') {
            if (this.filmPass) this.filmPass.enabled = false;
            if (this.rgbShiftPass) this.rgbShiftPass.enabled = true;
            if (this.vignettePass) this.vignettePass.enabled = true;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            if (this.particles) this.particles.maxParticles = 3000;
        } else { // high
            if (this.filmPass) this.filmPass.enabled = true;
            if (this.rgbShiftPass) this.rgbShiftPass.enabled = true;
            if (this.vignettePass) this.vignettePass.enabled = true;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            if (this.particles) this.particles.maxParticles = 5000;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
        if (this.canvasTexture && this.canvas2D) {
            this.canvasTexture.dispose();
            this.canvasTexture = new THREE.CanvasTexture(this.canvas2D);
            this.canvasTexture.minFilter = THREE.LinearFilter;
            this.fgMesh.material.map = this.canvasTexture;
        }
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
        
        // Gentle rotation for parallax star layers
        if (this.starLayers) {
            this.starLayers.forEach(layer => {
                layer.points.rotation.y += layer.speed * delta * 50;
                layer.points.rotation.x += layer.speed * delta * 25;
            });
        }

        if (this.nebula) {
            this.nebula.rotation.z += 0.05 * delta;
        }


        // Update GPU Particles
        if (this.particles) {
            this.particles.update(delta);
        }

        // --- PHASE 1 SPIKE: Profiling ---
        if (this.canvasTexture && this.canvas2D) {
            const t0 = performance.now();
            this.canvasTexture.needsUpdate = true;
            const t1 = performance.now();
            

        }


        // Render scene
        this.composer.render();
    }
}

export const rendererInstance = new Renderer();

window.rendererInstance = rendererInstance;
