import Image from 'next/image';

export default function ParallaxDivider() {
    return (
        <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
            {/* Fixed background image */}
            <div
                className="absolute inset-0 bg-fixed bg-cover bg-center"
                style={{ backgroundImage: "url('/images/home/signature-ceylon.png')" }}
            />
            <div className="absolute inset-0 bg-deep-emerald/30" />
            <div className="absolute inset-0 bg-gradient-to-b from-off-white via-transparent to-off-white" />

            {/* Centered content */}
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xs tracking-[0.4em] font-medium text-white/80 uppercase mb-4 drop-shadow-lg">
                        Begin Your Journey
                    </p>
                    <h3 className="text-3xl md:text-5xl font-display text-white drop-shadow-lg">
                        Where Will <span className="italic text-antique-gold">Ceylon</span> Take You?
                    </h3>
                </div>
            </div>
        </div>
    );
}
