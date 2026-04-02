import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type StatCardVariant = 'glass' | 'gold';
export type StatChartType = 'none' | 'line' | 'progress';

export interface StatCardProps {
    title: string;
    value: ReactNode;
    icon?: LucideIcon;
    trend?: { value: string; positive: boolean };
    accentColor?: string;
    variant?: StatCardVariant;
    chartType?: StatChartType;
    progressValue?: number;
}

export function StatCard({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    accentColor = 'text-antique-gold',
    variant = 'glass',
    chartType = 'none',
    progressValue = 0
}: StatCardProps) {
    const isGold = variant === 'gold';

    const cardClasses = isGold
        ? "relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E2C373] via-[#D4AF37] to-[#B08920] p-5 shadow-[0_8px_32px_-8px_rgba(212,175,55,0.4)] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]"
        : "relative overflow-hidden rounded-2xl bg-[#1A1D21]/80 backdrop-blur-md border border-white/[0.04] p-5 shadow-2xl transition-all hover:bg-[#1A1D21]";

    const titleClasses = isGold ? "text-[#08110d]/80 font-medium font-outfit" : "text-white/60 font-medium";
    const valueClasses = isGold ? "text-3xl font-bold tracking-tight text-[#08110d] font-outfit" : "text-3xl font-bold tracking-tight text-white";
    
    return (
        <div className={cardClasses}>
            <div className="flex justify-between items-start mb-6">
                <p className={titleClasses}>{title}</p>

                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isGold 
                            ? 'text-emerald-700 bg-emerald-500/20' 
                            : trend.positive 
                                ? 'text-emerald-400 bg-emerald-400/10' 
                                : 'text-red-400 bg-red-400/10'
                    }`}>
                        <span>{trend.positive ? '▲' : '▼'}</span> {trend.value}
                    </div>
                )}
                
                {(!trend && Icon) && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        isGold ? 'bg-black/10 border border-black/5' : 'bg-white/[0.04] border border-white/[0.08]'
                    }`}>
                        <Icon className={`h-4.5 w-4.5 opacity-80 ${isGold ? 'text-black' : accentColor}`} />
                    </div>
                )}
            </div>

            <div className={`flex justify-between items-end ${chartType === 'progress' && 'h-[calc(100%-2.5rem)]'}`}>
                {chartType === 'progress' ? (
                    <div className="flex flex-col justify-end h-full">
                        <h3 className={valueClasses}>{value}</h3>
                    </div>
                ) : (
                    <h3 className={valueClasses}>{value}</h3>
                )}
                
                {chartType === 'line' && (
                    <div className={`w-24 h-10 ${isGold ? 'opacity-60' : 'opacity-80'}`}>
                        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                            <path 
                                d="M0,30 C20,30 30,10 50,20 C70,30 80,5 100,10" 
                                fill="none" 
                                stroke={isGold ? "#08110d" : "#D4AF37"} 
                                strokeWidth="2.5" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                            />
                            <path 
                                d="M0,30 C20,30 30,10 50,20 C70,30 80,5 100,10 L100,40 L0,40 Z" 
                                fill={isGold ? "url(#darkGradientCard)" : "url(#goldGradientCard)"} 
                                opacity="0.1" 
                            />
                            <defs>
                                <linearGradient id="goldGradientCard" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="darkGradientCard" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#08110d" stopOpacity="1" />
                                    <stop offset="100%" stopColor="#08110d" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                )}

                {chartType === 'progress' && (
                    <div className="relative w-16 h-16 flex-shrink-0 -mt-8">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle 
                                cx="50" cy="50" r="40" 
                                fill="none" 
                                stroke={isGold ? "#08110d" : "rgba(255,255,255,0.1)"} 
                                strokeWidth="8" 
                                strokeOpacity="0.2"
                            />
                            <circle 
                                cx="50" cy="50" r="40" 
                                fill="none" 
                                stroke={isGold ? "#10b981" : "#10b981"} 
                                strokeWidth="8" 
                                strokeLinecap="round"
                                strokeDasharray={`${251 * (progressValue / 100)} 251`} 
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className={`text-sm font-bold ${isGold ? 'text-[#08110d]' : 'text-white'}`}>{progressValue}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
