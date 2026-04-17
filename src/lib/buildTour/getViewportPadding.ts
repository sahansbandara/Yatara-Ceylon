export function getViewportPadding() {
    if (typeof window === 'undefined') {
        return {
            left: 0, right: 0, top: 0, bottom: 0
        };
    }

    const width = window.innerWidth;

    if (width >= 1280) {
        return {
            left: 350, top: 80,      // reduced from 380/120 to allow 20% larger map
            right: 340, bottom: 60,   // reduced from 360/80
        };
    }

    if (width >= 1024) {
        return {
            left: 310, top: 70,
            right: 310, bottom: 50,
        };
    }

    if (width >= 768) {
        return {
            left: 20, top: 40,
            right: 20, bottom: 20,
        };
    }

    // Mobile
    return {
        left: 20, top: 40,
        right: 20, bottom: 20, // Reduced from 300 because map is now 45vh tall and not overlaid by a bottom panel
    };
}
