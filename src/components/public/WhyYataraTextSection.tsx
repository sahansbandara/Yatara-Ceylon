"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
      { title: "Pace-first itineraries", detail: "Routes built around comfort\u2014no rushed checklist travel." },
      { title: "On-trip support", detail: "Real-time adjustments when conditions or preferences change." },
    ],
    []
  );

  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section className="bg-white">
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:items-start">
          {/* Left: text benefits */}
          <div className="lg:col-span-6">
            <p className="text-xs tracking-[0.28em] text-neutral-500">
              WHY TRAVEL WITH YATARA
            </p>

            <h2 className="mt-4 text-4xl leading-tight text-neutral-900">
              A private journey, executed quietly well.
            </h2>

            <p className="mt-4 max-w-xl text-neutral-700">
              We tailor each itinerary to your pace—combining refined stays,
              curated access, and seamless logistics across Sri Lanka.
            </p>

            <div className="mt-10 space-y-6">
              {benefits.map((b, i) => (
                <div key={i} className="border-l border-neutral-200 pl-5">
                  <p className="text-neutral-900">{b.title}</p>
                  {b.detail ? (
                    <p className="mt-1 text-sm text-neutral-600">{b.detail}</p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-10 flex items-center gap-6">
              <a
                href="/about"
                className="rounded-full bg-neutral-900 px-6 py-3 text-sm text-white"
              >
                About Yatara
              </a>
              <a
                href="/inquire"
                className="text-sm text-neutral-900 underline underline-offset-4"
              >
                Inquire →
              </a>
            </div>
          </div>

          {/* Right: text stats */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="border-t border-neutral-200 pt-6">
                  <div className="text-5xl font-semibold leading-none text-neutral-900">
                    <CountUp
                      value={s.value}
                      suffix={s.suffix ?? "+"}
                      play={inView}
                      durationMs={1100}
                    />
                  </div>
                  <p className="mt-3 text-xs tracking-[0.22em] text-neutral-600">
                    {s.label.toUpperCase()}
                  </p>
                </div>
              ))}
            </div>

            <p className="mt-10 max-w-md text-sm text-neutral-600">
              Prefer zero statistics? Remove the right column and keep only the
              benefits—luxury brands often do.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
