
/**
 * @fileoverview A service for managing all audio in the application.
 * This service loads and plays pre-recorded audio files for sound effects
 * and background music, sourced from a free asset manifest.
 */

import { audioAssets, MusicTheme } from '../audioAssets';

type SfxType = keyof typeof audioAssets.sfx;

export class AudioService {
    private audioContext: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private isInitialized = false;
    private isMuted = false;
    private volume = 0.7;

    private musicAudio1: HTMLAudioElement;
    private musicAudio2: HTMLAudioElement;
    private activeMusicElement: HTMLAudioElement;
    private crossfadeDuration = 2.0; // seconds for crossfade

    constructor() {
        this.musicAudio1 = new Audio();
        this.musicAudio2 = new Audio();
        this.musicAudio1.crossOrigin = "anonymous";
        this.musicAudio2.crossOrigin = "anonymous";
        this.musicAudio1.loop = true;
        this.musicAudio2.loop = true;
        this.activeMusicElement = this.musicAudio1;
        this.initialize();
    }

    private initialize() {
        if (typeof window !== 'undefined' && !this.isInitialized) {
            console.log("[AudioService] Ready to initialize on user interaction.");
        }
    }

    private async ensureContext(): Promise<boolean> {
        if (this.isInitialized && this.audioContext?.state === 'running') {
            return true;
        }
        try {
            if (!this.audioContext || this.audioContext.state === 'closed') {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.connect(this.audioContext.destination);

                const source1 = this.audioContext.createMediaElementSource(this.musicAudio1);
                const source2 = this.audioContext.createMediaElementSource(this.musicAudio2);
                source1.connect(this.masterGain);
                source2.connect(this.masterGain);
            }
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            this.setVolume(this.volume, true); // Apply initial volume
            this.isInitialized = true;
            console.log("[AudioService] AudioContext initialized successfully.");
            return true;
        } catch (e) {
            console.error("[AudioService] Error initializing AudioContext:", e);
            this.isInitialized = false;
            return false;
        }
    }

    public async playSound(type: SfxType): Promise<void> {
        if (!audioAssets.sfx[type]) {
            console.warn(`[AudioService] SFX type "${type}" not found in audioAssets.`);
            return;
        }
        
        // Don't wait for context for SFX if it's not ready, just fire and forget
        if (!this.isInitialized) {
             await this.ensureContext();
        }
        if (!this.isInitialized || !this.audioContext) return;


        const sfxUrl = audioAssets.sfx[type];
        const sfx = new Audio(sfxUrl);
        sfx.crossOrigin = "anonymous";
        const source = this.audioContext.createMediaElementSource(sfx);
        const gainNode = this.audioContext.createGain();
        
        // Lower volume for subtle UI clicks
        if (type === 'UI_CLICK_SUBTLE' || type === 'CHOICE_HOVER') {
             gainNode.gain.value = 0.3 * this.volume;
        } else {
             gainNode.gain.value = 0.8 * this.volume;
        }
        
        source.connect(gainNode);
        gainNode.connect(this.masterGain!);
        
        sfx.play().catch(e => console.error(`[AudioService] Error playing SFX "${type}":`, e));
    }
    
    private selectThemeFromSoundscape(soundscapePrompt: string): MusicTheme {
        const lowerCasePrompt = soundscapePrompt.toLowerCase();
        if (lowerCasePrompt.includes('dissonance') || lowerCasePrompt.includes('tense') || lowerCasePrompt.includes('danger') || lowerCasePrompt.includes('urgent') || lowerCasePrompt.includes('chaotic') || lowerCasePrompt.includes('fearful') ) {
            return 'TENSE';
        }
        if (lowerCasePrompt.includes('shrine') || lowerCasePrompt.includes('serene') || lowerCasePrompt.includes('calm') || lowerCasePrompt.includes('peaceful') || lowerCasePrompt.includes('hopeful')) {
            return 'CALM';
        }
         if (lowerCasePrompt.includes('mystery') || lowerCasePrompt.includes('ancient') || lowerCasePrompt.includes('lore') || lowerCasePrompt.includes('discovery') || lowerCasePrompt.includes('contemplative')) {
            return 'MYSTERY';
        }
        return 'AMBIENT'; // Default theme
    }


    public async playMusic(soundscapePrompt: string): Promise<void> {
        if (!await this.ensureContext()) {
            console.warn("[AudioService] Cannot play music, AudioContext not available.");
            return;
        }
        
        const theme = this.selectThemeFromSoundscape(soundscapePrompt);
        const musicUrl = audioAssets.music[theme];

        if (!musicUrl) {
            console.warn(`[AudioService] Music theme "${theme}" not found.`);
            return;
        }

        const inactiveMusicElement = this.activeMusicElement === this.musicAudio1 ? this.musicAudio2 : this.musicAudio1;

        if (this.activeMusicElement.src === musicUrl && !this.activeMusicElement.paused) {
            return; // Already playing the correct track
        }
        
        // Set up the new track on the inactive element
        inactiveMusicElement.src = musicUrl;
        
        try {
            await inactiveMusicElement.play();
            if (!this.isInitialized) return; // a check just in case

            // Crossfade
            const now = this.audioContext!.currentTime;
            this.activeMusicElement.volume = 1; // Ensure start volume is correct
            inactiveMusicElement.volume = 0;

            // Fade out the old track
            this.fade(this.activeMusicElement, 1, 0, this.crossfadeDuration);
            
            // Fade in the new track
            this.fade(inactiveMusicElement, 0, 1, this.crossfadeDuration);

            setTimeout(() => {
                this.activeMusicElement.pause();
                this.activeMusicElement.currentTime = 0;
            }, this.crossfadeDuration * 1000);

            this.activeMusicElement = inactiveMusicElement;

        } catch (e) {
            console.error(`[AudioService] Error playing music track ${musicUrl}:`, e);
        }
    }
    
    private fade(element: HTMLAudioElement, from: number, to: number, duration: number) {
        let start = performance.now();
        element.volume = from;

        const frame = (time: number) => {
            let elapsed = time - start;
            let progress = Math.min(elapsed / (duration * 1000), 1);
            element.volume = from + (to - from) * progress;

            if (progress < 1) {
                requestAnimationFrame(frame);
            }
        };
        requestAnimationFrame(frame);
    }


    public setVolume(newVolume: number, force = false): void {
        this.volume = Math.max(0, Math.min(1, newVolume));
        if (this.isMuted && !force) {
            this.musicAudio1.volume = 0;
            this.musicAudio2.volume = 0;
        } else {
             this.activeMusicElement.volume = this.volume;
        }
    }

    public toggleMute(shouldMute?: boolean): void {
        this.isMuted = shouldMute !== undefined ? shouldMute : !this.isMuted;
        console.log(`[AudioService] Mute toggled to: ${this.isMuted}`);
        const newGain = this.isMuted ? 0 : this.volume;
        this.setVolume(newGain, true);
    }

    public disconnect(): void {
        console.log("[AudioService] Disconnecting and cleaning up audio resources.");
        this.musicAudio1.pause();
        this.musicAudio2.pause();
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
    }
}
