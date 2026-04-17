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
    const isInView = useInView(ref, { amount: 0.2, once: false });
    const reduced = usePrefersReducedMotion();

    const rawStr = value.replace(/,/g, "");
    const match = rawStr.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/);
    
    const prefix = match ? (match[1] || "") : "";
    const targetNum = match ? Number(match[2]) : 0;
    const suffix = match ? (match[3] || "") : "";
    const hasComma = value.includes(",");
    
    const emptyState = match ? `${prefix}0${suffix}` : value;

    const [current, setCurrent] = useState(emptyState);

    useEffect(() => {
        if (!isInView) {
            setCurrent(emptyState);
            return;
        }

        if (!match || reduced) {
            setCurrent(value);
            return;
        }

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

    // Initial render or reduced motion: just show the current value
    return (
        <span ref={ref} className="tabular-nums">
            {current} 
        </span>
    );
}
