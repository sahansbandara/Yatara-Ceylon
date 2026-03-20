"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

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

export function AnimatedStat({ value }: { value: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { amount: 0.2, once: true });
    const reduced = usePrefersReducedMotion();

    const [current, setCurrent] = useState("");

    useEffect(() => {
        if (!isInView) {
            return;
        }

        const rawStr = value.replace(/,/g, "");
        const match = rawStr.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
        
        if (!match || reduced) {
            setCurrent(value);
            return;
        }

        const prefix = match[1] || "";
        const targetNum = Number(match[2]);
        const suffix = match[3] || "";
        const hasComma = value.includes(",");

        let raf = 0;
        let startTimestamp: number | null = null;
        const durationMs = 2000;

        const tick = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(1, (timestamp - startTimestamp) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 4);
            
            let currentNum = Math.round(targetNum * eased);
            let currentStr = currentNum.toString();
            if (hasComma) {
                currentStr = currentNum.toLocaleString("en-US");
            }

            setCurrent(prefix + currentStr + suffix);

            if (progress < 1) {
                raf = requestAnimationFrame(tick);
            } else {
                setCurrent(value);
            }
        };
        raf = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(raf);
    }, [isInView, value, reduced]);

    // Initial render or reduced motion: just show the final value
    return (
        <span ref={ref} className="tabular-nums">
            {current || "0"} 
        </span>
    );
}
