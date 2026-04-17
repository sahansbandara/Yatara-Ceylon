'use client';

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center opacity-40">
                <div>
                    <div className="h-8 w-48 bg-white/10 rounded-md animate-pulse mb-2"></div>
                    <div className="h-4 w-64 bg-white/5 rounded-md animate-pulse"></div>
                </div>
            </div>

            <div className="space-y-4 mt-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="liquid-glass-panel relative overflow-hidden rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6"
                    >
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
                        <div className="w-16 h-16 md:w-32 md:h-24 rounded-xl bg-white/5 animate-pulse flex-shrink-0"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-5 w-3/4 bg-white/10 rounded animate-pulse"></div>
                            <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse"></div>
                        </div>
                        <div className="w-24 h-10 bg-white/5 rounded-lg animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
