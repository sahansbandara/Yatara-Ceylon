'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function BuildTourParallax() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress purely relative to the viewport
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start end', 'end start'],
    });

    // Background moves upwards slightly
    const bgY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

    // Foreground element moves downwards slightly to create depth
    const fgY = useTransform(scrollYProgress, [0, 1], ['15%', '-20%']);

    return (
        <section
            ref={containerRef}
            className="relative h-[60vh] sm:h-[80vh] min-h-[500px] overflow-hidden bg-[#050B08] flex items-center justify-center"
        >
            {/* Parallax Background Layer */}
            <motion.div
                className="absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/images/parallax/parallax-bg.webp)',
                    y: bgY
                }}
            />

            {/* Blend Gradients for smooth transition to adjacent sections */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0f0d] via-transparent to-[#0a0f0d] z-10" />

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
                <div className="max-w-xl text-left bg-black/10 backdrop-blur-sm p-8 rounded-2xl border border-white/5">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-xl">
                        Find Yourself <br />
                        <span className="italic text-antique-gold drop-shadow-md">Beyond the Map</span>
                    </h2>
                    <p className="text-white/90 text-sm sm:text-base font-light leading-relaxed drop-shadow-md">
                        Every great journey is a story waiting to be told. Let the misty tea trails, wild jungle paths, and golden shores of Sri Lanka rewrite your expectations of luxury.
                    </p>
                </div>
            </div>
        </section>
    );
}
