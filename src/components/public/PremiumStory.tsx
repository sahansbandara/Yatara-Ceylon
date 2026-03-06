'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Minus, Plus, ArrowUpRight } from 'lucide-react';

const inquiries = [
    {
        question: "When is the optimal time for a Yatara journey?",
        answer: "Sri Lanka's landscape commands a year-round allure. The southwest coast and ancient highlands bask in magnificence from December to April, while the pristine eastern shores gleam from May to October. Our concierges artfully curate your itinerary to ensure absolute perfection in timing."
    },
    {
        question: "How is absolute exclusivity guaranteed?",
        answer: "We sidestep conventional routes to grant you private access. Our enduring relationships open doors to early-morning or after-hours viewing at sacred archaeological sites, seamless private charter flights, and boutique sanctuaries that promise total seclusion."
    },
    {
        question: "Do you facilitate expedited arrival services?",
        answer: "Indisputably. We orchestrate your Electronic Travel Authorization beforehand. Upon landing, you are met at the aerobridge, escorted swiftly through VIP silk-route immigration, and guided immediately to your awaiting private chauffeur."
    },
    {
        question: "What caliber of support defines the experience?",
        answer: "A dedicated 24/7 personal concierge serves as your invisible maestro. From securing highly sought-after private dining to preemptively adjusting logistics, every detail is handled with absolute discretion, ensuring your peace of mind remains undisturbed."
    }
];

export default function PremiumStory() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parallax scroll effect for the image
    const { scrollYProgress } = useScroll({
        target: containerRef,
        // Start intersection when top of container hits bottom of viewport
        // End intersection when bottom of container hits top of viewport
        offset: ["start end", "end start"]
    });

    // Y-axis movement: image moves much slower than scroll speed for a deep premium feel
    // Expanding the range provides a much more noticeable scroll effect
    const y = useTransform(scrollYProgress, [0, 1], ["-35%", "35%"]);

    return (
        <section className="relative w-full h-auto min-h-screen lg:h-[100dvh] bg-white border-b border-black/[0.05] flex items-center justify-center overflow-hidden font-sans">

            {/* Elegant two-tone desktop split background */}
            <div className="absolute inset-0 pointer-events-none hidden lg:flex w-full h-full text-[#F9F8F6]">
                <div className="w-[45%] h-full bg-white" />
                <div className="w-[55%] h-full bg-current" />
            </div>

            {/* Mobile soft stone background */}
            <div className="absolute inset-0 pointer-events-none lg:hidden bg-[#F9F8F6]" />

            <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 xl:px-20 relative z-10 h-full lg:max-h-[880px] flex flex-col lg:flex-row gap-16 lg:gap-24 items-center py-24 lg:py-16">

                {/* Left side: Parallax Image Box */}
                <div
                    ref={containerRef}
                    className="w-full lg:w-[45%] h-[55dvh] lg:h-[85%] relative rounded-[2px] lg:rounded-[4px] overflow-hidden group shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-black/5 flex items-center justify-center isolate bg-black"
                >
                    {/* Parallax Image inside overflow-hidden box - very slow scale on hover */}
                    {/* Increased negative inset to give the parallax plenty of room to travel without showing edges */}
                    <motion.div
                        style={{ y }}
                        className="absolute -inset-[40%] -z-10 transition-transform duration-[2.5s] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                    >
                        <Image
                            src="/images/home/faq-luxury-experience.webp"
                            alt="Yatara Luxury Experience"
                            fill
                            sizes="(max-width: 1024px) 100vw, 45vw"
                            className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-1000 mix-blend-luminosity hover:mix-blend-normal"
                            priority
                            quality={100}
                        />
                    </motion.div>

                    {/* Subtle vignette/gradient overlay to draw eye to center */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 group-hover:bg-black/20 transition-colors duration-1000 -z-10" />

                    {/* Centered Image Typography */}
                    <div className="text-center px-8 z-10 w-full transform transition-transform duration-1000 group-hover:-translate-y-2">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="block text-[9px] md:text-[11px] tracking-[0.4em] font-nav text-white/70 uppercase mb-5 md:mb-8"
                        >
                            The Yatara Standard
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display text-white leading-[1.1] drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                        >
                            Essential <br />
                            <span className="italic font-light text-white/90">Insight</span>
                        </motion.h2>
                    </div>

                    {/* Elite Button anchored at bottom */}
                    <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 translate-y-4 group-hover:translate-y-0 text-center lg:text-right w-full lg:w-auto flex justify-center lg:justify-end">
                        <button className="flex items-center gap-4 backdrop-blur-md bg-white/10 border border-white/30 hover:bg-white text-white hover:text-black px-6 py-3 rounded-full transition-all duration-500 text-[9px] md:text-[10px] font-nav tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(0,0,0,0.3)] group/btn">
                            Discover The Masterpiece
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-black transition-transform duration-500 group-hover/btn:bg-black group-hover/btn:text-white">
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform duration-500" strokeWidth={2} />
                            </span>
                        </button>
                    </div>
                </div>

                {/* Right side: Accordion FAQ List */}
                <div className="w-full lg:w-[55%] flex flex-col justify-center h-full pt-4 lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-10 lg:mb-14"
                    >
                        <span className="block text-[10px] tracking-[0.3em] text-[#043927] font-nav uppercase mb-4">Curated Inquiries</span>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-display text-black mt-2 font-light hidden lg:block">
                            Clarity in <span className="italic">Excellence</span>
                        </h3>
                    </motion.div>

                    <div className="w-full relative">
                        {/* Elite left connecting line - adapted for light theme */}
                        <div className="absolute left-[11px] top-6 bottom-6 w-[1px] bg-gradient-to-b from-black/0 via-black/10 to-black/0 hidden md:block" />

                        {inquiries.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.1 * index }}
                                    key={index}
                                    className="border-b border-black/[0.08] overflow-hidden last:border-b-0 relative group"
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full py-6 md:py-8 flex items-start text-left focus:outline-none"
                                    >
                                        {/* Status indicator (elite bullet) - light theme */}
                                        <div className="shrink-0 mt-1.5 mr-6 hidden md:flex items-center justify-center w-6 h-6 relative z-10 bg-[#F9F8F6]">
                                            <div className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${isOpen ? 'bg-[#043927] shadow-[0_0_8px_rgba(4,57,39,0.4)]' : 'bg-black/20 group-hover:bg-black/50'}`} />
                                        </div>

                                        <div className="flex-1 pr-6 lg:pr-12">
                                            {/* Question Color: Slate/brown-black that shifts to primary green on active */}
                                            <h3 className={`text-base md:text-lg lg:text-xl font-display transition-colors duration-500 leading-snug tracking-wide ${isOpen ? 'text-[#043927]' : 'text-[#2a2a2a] group-hover:text-black'}`}>
                                                {faq.question}
                                            </h3>
                                        </div>

                                        {/* Elegant plus/minus icon - light theme */}
                                        <div className="shrink-0 mt-0.5 relative flex items-center justify-center w-8 h-8 rounded-full border border-black/10 group-hover:border-black/30 transition-colors duration-500">
                                            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                                                <Plus className="w-4 h-4 text-black/40 group-hover:text-black" strokeWidth={1.5} />
                                            </div>
                                            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50'}`}>
                                                <Minus className="w-4 h-4 text-[#043927]" strokeWidth={1.5} />
                                            </div>
                                        </div>
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // smooth ease out
                                            >
                                                <div className="pb-8 md:pb-10 pl-0 md:pl-12 pr-4 md:pr-16">
                                                    {/* Answer Color: A distinctly softer charcoal gray for hierarchy, not too wild */}
                                                    <p className="text-[#4a4a4a] font-sans font-normal leading-[1.8] text-[15px] md:text-[17px]">
                                                        {faq.answer}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Bottom contact CTA */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="mt-10 pt-6 border-t border-black/10 lg:mt-14 lg:pt-8"
                    >
                        <p className="text-[10px] tracking-[0.15em] text-black/50 font-nav uppercase">
                            Demand an unparalleled itinerary?
                            <a href="/contact" className="text-[#043927] font-semibold ml-2 hover:text-black transition-colors duration-300 relative inline-block group">
                                Consult our masters
                                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#043927]/40 transform origin-left transition-transform duration-300 group-hover:scale-x-0" />
                            </a>
                        </p>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
