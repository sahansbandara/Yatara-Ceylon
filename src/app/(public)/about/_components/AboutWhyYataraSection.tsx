'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { Plane, Phone, Clock, Shield, CheckCircle } from "lucide-react";
import { motion, useInView as useFramerInView, useAnimation } from "framer-motion";

type Stat = { value: number; suffix?: string; label: string; start?: number };
type Benefit = { text: string; icon: React.ReactNode };

/* Reduced Motion Hook as a fallback */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/* Number Counting Animation Component */
function CountUp({
  value,
  suffix = "+",
  durationMs = 2000,
  start = 0,
  play,
}: {
  value: number;
  suffix?: string;
  durationMs?: number;
  start?: number;
  play: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    if (!play) {
      setCurrent(start);
      return;
    }
    if (reduced) {
      setCurrent(value);
      return;
    }
    let raf = 0;
    let t0: number | null = null;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 4); // Quartic ease out
      setCurrent(Math.round(start + (value - start) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, reduced, value, durationMs, start]);

  return (
    <span className="tabular-nums">
      {current}
      {suffix}
    </span>
  );
}

export default function AboutWhyYataraSection() {
  const stats: Stat[] = useMemo(
    () => [
      { value: 12, suffix: "+", label: "Years of Industry Experience", start: 1 },
      { value: 50, suffix: "+", label: "Staff Members", start: 5 },
      { value: 100, suffix: "+", label: "Chauffeur Guides", start: 10 },
      { value: 200, suffix: "+", label: "Vehicles", start: 20 },
    ],
    []
  );

  const benefits: Benefit[] = useMemo(
    () => [
      { icon: <Plane className="w-5 h-5" strokeWidth={1.5} />, text: 'A 24/7 operating travel counter at Bandaranaike Airport' },
      { icon: <Phone className="w-5 h-5" strokeWidth={1.5} />, text: '24/7 concierge call center for on-trip support' },
      { icon: <Shield className="w-5 h-5" strokeWidth={1.5} />, text: 'Hassle-free, secure, and seamless online booking' },
      { icon: <Clock className="w-5 h-5" strokeWidth={1.5} />, text: 'Free cancellation up to 24 hours on all transport services' },
      { icon: <CheckCircle className="w-5 h-5" strokeWidth={1.5} />, text: 'We partner with over 200 hotels, all vetted by our quality team' },
    ],
    []
  );

  /* Framer Motion Integration for Viewport Triggering */
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useFramerInView(sectionRef, { amount: 0.2 });
  const controls = useAnimation();
  
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useFramerInView(statsRef, { amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [isInView, controls]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <section className="py-28 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left — Features */}
          <div className="flex flex-col">
            <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-display text-deep-emerald mb-4 leading-tight">
              Why Book with<br />Yatara Ceylon?
            </motion.h2>
            <motion.div variants={itemVariants} className="h-px w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mt-6 mb-12" />

            <div className="space-y-6">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-start gap-5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-deep-emerald/5 border border-deep-emerald/10 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/20 transition-all">
                    <div className="text-deep-emerald/60 group-hover:text-[#D4AF37] transition-colors">
                      {b.icon}
                    </div>
                  </div>
                  <p className="text-gray-600 font-light text-[15px] leading-relaxed pt-2.5 group-hover:text-deep-emerald transition-colors">
                    {b.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — Stats */}
          <div className="flex flex-col pt-0">
            <motion.p variants={itemVariants} className="text-gray-500 font-light leading-relaxed mb-12 text-[15px] max-w-md">
              At Yatara Ceylon, we customize each itinerary to fit your preferences, ensuring a unique and unforgettable experience across the island.
            </motion.p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-10" ref={statsRef}>
              {stats.map((s, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col group">
                  <div className="text-5xl md:text-6xl font-display text-deep-emerald group-hover:text-[#D4AF37] transition-colors duration-500 mb-2">
                    <CountUp
                      value={s.value}
                      suffix={s.suffix ?? "+"}
                      start={s.start ?? 0}
                      play={statsInView}
                      durationMs={2000}
                    />
                  </div>
                  <p className="text-xs tracking-[0.15em] uppercase text-gray-400 group-hover:text-gray-500 font-medium transition-colors duration-500">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
