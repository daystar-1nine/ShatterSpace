import { Howl, Howler } from 'howler';

export class AudioEngine {
    constructor() {
        // Stub paths as requested
        this.tracks = {
            sfx_shoot: new Howl({ src: ['/audio/sfx_shoot.mp3'], volume: 0.5 }),
            sfx_laser: new Howl({ src: ['/audio/sfx_shoot.mp3'], volume: 0.5 }), // alias
            sfx_explosion: new Howl({ src: ['/audio/sfx_explosion.mp3'], volume: 0.7 }),
            sfx_hit: new Howl({ src: ['/audio/sfx_hit.mp3'], volume: 0.8 }),
            sfx_powerup: new Howl({ src: ['/audio/sfx_powerup.mp3'], volume: 0.6 }),
            sfx_emp: new Howl({ src: ['/audio/sfx_explosion.mp3'], volume: 1.0 }), // alias
            sfx_achievement: new Howl({ src: ['/audio/sfx_powerup.mp3'], volume: 0.8 }), // alias
            bgm_menu: new Howl({ src: ['/audio/bgm_menu.mp3'], loop: true, volume: 0.4 }),
            bgm_combat: new Howl({ src: ['/audio/bgm_combat.mp3'], loop: true, volume: 0.4 })
        };
        
        this.currentBgm = null;
        this.masterVolume = 1.0;
        this.musicVolume = 1.0;
        this.sfxVolume = 1.0;
    }
    
    playSfx(name) {
        if (this.tracks[name]) {
            this.tracks[name].volume(this.sfxVolume * this.masterVolume);
            this.tracks[name].play();
        } else {
            console.warn(`SFX ${name} not found`);
        }
    }
    
    playBgm(name) {
        if (this.currentBgm === name) return;
        
        if (this.currentBgm && this.tracks[this.currentBgm]) {
            // Crossfade out over 1s
            const oldTrack = this.tracks[this.currentBgm];
            oldTrack.fade(oldTrack.volume(), 0, 1000);
            setTimeout(() => oldTrack.stop(), 1000);
        }
        
        if (this.tracks[name]) {
            const newTrack = this.tracks[name];
            newTrack.volume(0);
            newTrack.play();
            newTrack.fade(0, this.musicVolume * this.masterVolume * 0.4, 1000); // fade in
            this.currentBgm = name;
        }
    }
    
    setMasterVolume(vol) {
        this.masterVolume = vol;
        Howler.volume(vol); // Global howler volume
    }
}

export const audio = new AudioEngine();
