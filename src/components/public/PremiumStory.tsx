'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
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
    },
    {
        question: "Can bespoke culinary and cultural immersions be arranged?",
        answer: "Absolutely. We orchestrate private dining in extraordinary venues—from candlelit temple ruins to secluded shores—curated by Michelin-caliber chefs, alongside private audiences with local artisans, scholars, and spiritual leaders."
    },
    {
        question: "How do you handle spontaneous itinerary changes?",
        answer: "Your dedicated concierge and chauffeur form an agile team, granting you the liberty to alter plans on a whim, ensuring your journey fluidly adapts to your desires without a moment's hesitation."
    }
];

export default function PremiumStory() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const sectionRef = useRef<HTMLElement>(null);

    // Parallax scroll effect for the image
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Add smooth spring to the scroll progress for that silky feel
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20,
        restDelta: 0.001
    });

    const y = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);

    return (
        <section ref={sectionRef} className="relative w-full py-20 lg:py-32 bg-[#F9F8F6] flex items-center justify-center overflow-hidden font-sans">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <Image
                    src="/images/backgrounds/elite-bg.webp"
                    alt="Premium Background"
                    fill
                    className="object-cover opacity-30"
                    quality={90}
                />
            </div>
            
            <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-12 xl:px-20 relative z-10 flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">

                {/* Left side: Parallax Image Box with Frame Motion */}
                <div className="w-full lg:w-[45%] lg:sticky lg:top-32 relative z-10 shrink-0 self-start">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-[50dvh] lg:h-[75vh] min-h-[500px] max-h-[700px] relative rounded-2xl overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] border border-white/50 flex items-center justify-center isolate bg-black"
                    >
                        {/* Parallax Image inside overflow-hidden box */}
                        <motion.div
                            style={{ y }}
                            className="absolute -top-[35%] -bottom-[35%] -left-[10%] -right-[10%] -z-10 transition-transform duration-[2s] ease-out group-hover:scale-105"
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

                    {/* Subtle vignette overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 group-hover:bg-black/20 transition-colors duration-1000 -z-10" />

                    {/* Centered Image Typography */}
                    <div className="text-center px-8 z-10 w-full transform transition-transform duration-1000 group-hover:-translate-y-2 pointer-events-none">
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="block text-[9px] md:text-[11px] tracking-[0.4em] font-nav text-white/80 uppercase mb-4 drop-shadow-md"
                        >
                            The Yatara Standard
                        </motion.span>
                    </div>

                    {/* Elite Button anchored at bottom - Always Visible */}
                    <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 z-10">
                        <Link href="/the-masterpiece" className="block">
                            <motion.button 
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-4 backdrop-blur-md bg-black/25 hover:bg-black/40 border border-white/20 hover:border-white/40 text-white px-5 py-2.5 rounded-full transition-all duration-500 text-[9px] md:text-[10px] font-nav tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(0,0,0,0.3)] group/btn"
                            >
                                Discover The Masterpiece
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 text-white transition-colors duration-500 group-hover/btn:bg-white group-hover/btn:text-black">
                                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:rotate-45 transition-transform duration-500" strokeWidth={1.5} />
                                </span>
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </div>

                {/* Right side: Accordion FAQ List */}
                <div className="w-full lg:w-[55%] flex flex-col justify-center pt-4 lg:pt-0">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="mb-8 lg:mb-12"
                    >
                        <span className="block text-[10px] tracking-[0.3em] text-[#043927] font-nav uppercase mb-4 font-semibold">Curated Inquiries</span>
                        {/* Liquid Glass Title */}
                        <motion.h3 
                            whileHover={{ scale: 1.01 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-display text-black mt-2 font-light hidden lg:inline-block bg-white/40 backdrop-blur-sm border border-white/60 px-8 py-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                        >
                            Clarity in <span className="italic">Excellence</span>
                        </motion.h3>
                    </motion.div>

                    <div className="w-full flex flex-col">
                        {inquiries.map((faq, index) => {
                            const isOpen = openIndex === index;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: 0.05 * index }}
                                    key={index}
                                    className={`relative group border-b border-black/10 transition-colors duration-500 ${isOpen ? 'border-black/30' : 'hover:border-black/20'}`}
                                >
                                    <motion.button
                                        onClick={() => setOpenIndex(isOpen ? null : index)}
                                        className="w-full py-6 flex items-center text-left focus:outline-none"
                                    >
                                        <div className="flex-1 pr-6">
                                            <h3 className={`text-[15px] md:text-[17px] font-display transition-colors duration-500 leading-snug tracking-wide ${isOpen ? 'text-[#043927]' : 'text-[#2a2a2a] group-hover:text-black'} font-light`}>
                                                {faq.question}
                                            </h3>
                                        </div>

                                        {/* Elegant plus/minus text symbol instead of heavy circles */}
                                        <motion.div 
                                            className="shrink-0 relative flex items-center justify-center w-6 h-6 transition-transform duration-500"
                                        >
                                            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-180 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'}`}>
                                                <Plus className="w-4 h-4 text-black/40 font-light" strokeWidth={1} />
                                            </div>
                                            <div className={`absolute transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] ${isOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-50'}`}>
                                                <Minus className="w-4 h-4 text-[#043927]" strokeWidth={1} />
                                            </div>
                                        </motion.div>
                                    </motion.button>

                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} 
                                            >
                                                <div className="pb-8 pr-12 pt-0">
                                                    <p className="text-[#6a6a6a] font-sans font-light leading-[1.8] text-[13px] md:text-[14px]">
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
                        className="mt-8 pt-6 lg:mt-10 lg:pt-8"
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

