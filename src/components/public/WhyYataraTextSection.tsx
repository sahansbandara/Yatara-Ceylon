"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";

type Stat = { value: number; suffix?: string; label: string };
type Benefit = { title: string; detail?: string };

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

function useInView<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function CountUp({
  value,
  suffix = "+",
  durationMs = 1200,
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
      const eased = 1 - Math.pow(1 - p, 3);
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
      { value: 24, suffix: "/7", label: "Concierge support" },
      { value: 100, suffix: "+", label: "Curated routes & experiences" },
      { value: 1, suffix: "", label: "Single point of contact" },
      { value: 0, suffix: "", label: "Hidden service fees" },
    ],
    []
  );

  const benefits: Benefit[] = useMemo(
    () => [
      { title: "Concierge-led planning", detail: "One specialist plans, books, and manages your journey." },
      { title: "Private logistics", detail: "Seamless transfers with vetted driver-guides." },
      { title: "Curated stays", detail: "Boutique and luxury properties chosen for experience, not volume." },
      { title: "Pace-first itineraries", detail: "Routes built around comfort—no rushed checklist travel." },
      { title: "On-trip support", detail: "Real-time adjustments when conditions or preferences change." },
    ],
    []
  );

  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section className="bg-[#FCFBF9]">
      <div ref={ref} className="mx-auto max-w-[1440px] px-6 md:px-12 lg:px-16 xl:px-24 py-32 lg:py-48">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">

          {/* ── Left: Headlines & Benefits List ── */}
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-[2.5rem] md:text-[3.5rem] font-semibold text-neutral-900 leading-tight mb-12">
              Why Book with<br />Yatara Ceylon?
            </h2>

            <div className="flex flex-col">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4 py-5 border-b border-neutral-200/80 last:border-0 group">
                  <div className="mt-1">
                    {/* Consistent branding icon style */}
                    <CheckCircle2 className="w-5 h-5 text-neutral-400 group-hover:text-[#1A365D] transition-colors" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="text-base text-neutral-900 font-medium mb-1 group-hover:text-[#1A365D] transition-colors">{b.title}</h4>
                    {b.detail && (
                      <p className="text-sm text-neutral-500 font-light leading-relaxed">{b.detail}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <a
                href="/inquire"
                className="rounded-full bg-[#1A365D] px-8 py-3.5 text-sm font-bold tracking-[0.1em] text-white hover:bg-deep-emerald transition-colors inline-block"
              >
                START PLANNING
              </a>
            </div>
          </div>

          {/* ── Right: Intro Text & Massive Stats ── */}
          <div className="lg:col-span-6 lg:col-start-7 lg:mt-6">

            <p className="text-xl md:text-2xl text-neutral-700 leading-[1.6] font-light mb-20 max-w-2xl">
              At Yatara Ceylon, we meticulously customize each itinerary to fit your exact preferences, ensuring a flawless and unique private journey.
            </p>

            <div className="grid grid-cols-2 gap-x-8 gap-y-16">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  {/* Huge Walker-Style numbers */}
                  <div className="text-[4rem] md:text-[5rem] font-bold leading-none text-[#1A365D] tracking-tight mb-4">
                    <CountUp
                      value={s.value}
                      suffix={s.suffix ?? "+"}
                      play={inView}
                      durationMs={1100}
                    />
                  </div>
                  {/* Small tracking caps label */}
                  <p className="text-xs md:text-sm tracking-[0.15em] font-medium text-neutral-600 uppercase w-2/3">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
