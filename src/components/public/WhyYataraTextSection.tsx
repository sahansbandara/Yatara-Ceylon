"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MoveRight, Star, ShieldCheck, MapPinned, SmilePlus } from "lucide-react";
import { motion, useInView as useFramerInView, useAnimation } from "framer-motion";

type Stat = { value: number; suffix?: string; label: string };
type Benefit = { title: string; detail?: string; icon: React.ReactNode };

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
  durationMs = 2000, // Very slow and majestic
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
    if (!play) return;
    if (reduced) {
      setCurrent(value);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - p, 4); // Quartic ease out for super smooth ending
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

export default function WhyYataraTextSection() {
  const stats: Stat[] = useMemo(
    () => [
      { value: 15, suffix: "+", label: "Years of Luxury" },
      { value: 400, suffix: "+", label: "Estates Audited" },
      { value: 24, suffix: "/7", label: "Private Concierge" },
      { value: 100, suffix: "%", label: "Bespoke Routes" },
    ],
    []
  );

  const benefits: Benefit[] = useMemo(
    () => [
      { icon: <Star className="w-6 h-6 text-[#CFB53B]" strokeWidth={1.5} />, title: "A dedicated travel concierge orchestrating your journey" },
      { icon: <MapPinned className="w-6 h-6 text-[#CFB53B]" strokeWidth={1.5} />, title: "Private VIP logistics with elite, seasoned driver-guides" },
      { icon: <ShieldCheck className="w-6 h-6 text-[#CFB53B]" strokeWidth={1.5} />, title: "Bank-level secure booking and uncompromised privacy" },
      { icon: <SmilePlus className="w-6 h-6 text-[#CFB53B]" strokeWidth={1.5} />, title: "Curated sanctuaries chosen for exclusivity, not volume" },
      { icon: <MoveRight className="w-6 h-6 text-[#CFB53B]" strokeWidth={1.5} />, title: "Flexible cancellation up to 24 hours on all transfers" },
    ],
    []
  );

  /* Framer Motion Integration for Viewport Triggering */
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useFramerInView(sectionRef, { amount: 0.2 });
  const controls = useAnimation();

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
        staggerChildren: 0.15, // Majestic slow stagger
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
    <section className="relative bg-white pb-16 md:pb-20 lg:pb-24" ref={sectionRef}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">

        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className="flex flex-col lg:flex-row justify-between lg:gap-24"
        >

          {/* ── Left: Huge Headline & List ── */}
          {/* Added h-full and justify-between to align bottom with the right container */}
          <div className="w-full lg:w-[45%] flex flex-col justify-between mb-16 lg:mb-0">
            {/* 👉 ADJUST TITLE MARGIN BELOW: mb-8 to mb-14 */}
            <motion.h2 variants={itemVariants} className="font-serif leading-[1.05] tracking-tight mb-8">
              {/* 👉 ADJUST TITLE TOP TEXT SIZE BELOW */}
              <span className="block text-[2rem] md:text-[2.5rem] lg:text-[3rem] text-neutral-900 font-medium mb-1">
                Why Journey With
              </span>
              {/* 👉 ADJUST TITLE BOTTOM TEXT SIZE BELOW */}
              <span className="block text-[2.75rem] md:text-[3.5rem] lg:text-[4.5rem] font-bold text-[#CFB53B]">
                Yatara Ceylon?
              </span>
            </motion.h2>

            <div className="flex flex-col border-t border-neutral-200">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="flex items-center gap-6 py-7 border-b border-neutral-200 group"
                >
                  <div className="shrink-0 flex items-center justify-center p-3 rounded-full bg-neutral-50 group-hover:bg-[#113d33]/5 transition-colors duration-500">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-[17px] md:text-[19px] text-neutral-800 font-medium group-hover:text-[#113d33] transition-colors duration-500">{b.title}</h4>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: Intro Text & Massive Stats Container ── */}
          {/* Added justify-between to align bottom with the left container */}
          <div className="w-full lg:w-[50%] flex flex-col justify-between pt-0 lg:pt-4">
            {/* 👉 ADJUST INTRO TEXT MARGIN BELOW: mb-12 or mb-16 */}
            <motion.p variants={itemVariants} className="text-[1.1rem] md:text-[1.25rem] text-neutral-600 leading-[1.6] font-light mb-12 max-w-[90%]">
              At Yatara Ceylon, we customize each itinerary to fit your precise preferences, ensuring an absolutely flawless and elite luxury experience.
            </motion.p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-16 lg:gap-y-24">
              {stats.map((s, i) => (
                <motion.div key={i} variants={itemVariants} className="flex flex-col">
                  {/* Huge Walker-Style numbers in deep emerald */}
                  {/* 👉 ADJUST NUMBERS TEXT SIZE BELOW */}
                  <div className="text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] font-bold leading-none text-[#113d33] tracking-tighter mb-4">
                    <CountUp
                      value={s.value}
                      suffix={s.suffix ?? "+"}
                      play={isInView}
                      durationMs={2000}
                    />
                  </div>
                  {/* Small tracking caps label */}
                  <p className="text-[12px] md:text-[13px] tracking-[0.2em] font-bold text-neutral-500 uppercase max-w-[200px]">
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
