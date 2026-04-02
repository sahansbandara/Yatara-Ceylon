export const playPopSound = () => {
    if (typeof window !== 'undefined') {
        try {
            // A very gentle popup sound using Web Audio API
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.type = 'sine';
            // Start at a higher pitch and quickly drop
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
            
            // Fast attack, fast decay
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.1);
            
            // Clean up
            setTimeout(() => {
                try { ctx.close(); } catch (e) {}
            }, 200);
        } catch (error) {
            // Ignore Audio context errors (e.g., if user hasn't interacted with document)
        }
    }
};

export const playClickSound = () => {
    if (typeof window !== 'undefined') {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
            
            setTimeout(() => {
                try { ctx.close(); } catch (e) {}
            }, 100);
        } catch (error) {
            // Ignore Audio context errors
        }
    }
};
