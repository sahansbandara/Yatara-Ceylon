'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function BuildTourParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    const bgY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
    const fgY = useTransform(scrollYProgress, [0, 1], ['15%', '-20%']);

    return (
        <section
            ref={containerRef}
            className="relative h-[60vh] sm:h-[80vh] min-h-[500px] overflow-hidden bg-off-white flex items-center justify-center"
        >
            {/* Parallax Background Layer */}
            <motion.div
                className="absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/images/parallax/parallax-bg.webp)',
                    y: bgY
                }}
            />

            {/* Blend Gradients — fade to off-white */}
            <div className="absolute inset-0 bg-gradient-to-b from-off-white via-transparent to-off-white z-10" />

            {/* Parallax Foreground Layer */}
            <motion.div
                className="absolute bottom-0 right-0 sm:right-[10%] w-[300px] sm:w-[550px] h-[500px] sm:h-[800px] bg-contain bg-no-repeat bg-bottom z-20"
                style={{
                    backgroundImage: 'url(/images/parallax/parallax-woman.webp)',
                    y: fgY
                }}
            />

            {/* Text Content Layer */}
            <div className="relative z-30 section-container flex flex-col items-start w-full">
                <div className="max-w-xl text-left bg-white/70 backdrop-blur-xl p-8 rounded-2xl border border-deep-emerald/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-deep-emerald mb-6 leading-tight">
                        Find Yourself <br />
                        <span className="italic text-antique-gold">Beyond the Map</span>
                    </h2>
                    <p className="text-deep-emerald/60 text-sm sm:text-base font-light leading-relaxed">
                        Every great journey is a story waiting to be told. Let the misty tea trails, wild jungle paths, and golden shores of Sri Lanka rewrite your expectations of luxury.
                    </p>
                </div>
            </div>
        </section>
    );
}
