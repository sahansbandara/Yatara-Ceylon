'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle2, User, Mail, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TRAVEL_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const PROOF_CHIPS = [
    'Uncompromising Privacy',
    'Curated Mastery',
    'Instant Gratification',
];

export default function FinalCTA() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        travelMonth: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // If they entered some details, attempt to send a background trace of it, but don't block navigation
        if (formData.name.trim() || formData.email.trim()) {
            try {
                await fetch('/api/public/tickets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customerName: formData.name || 'Anonymous Guest',
                        email: formData.email || 'no-email@yatara.com',
                        subject: `Elite Registration — ${formData.name || 'Anonymous'}`,
                        message: [
                            '--- ELITE REGISTRATION (Homepage CTA) ---',
                            `Name: ${formData.name}`,
                            `Email / WhatsApp: ${formData.email}`,
                            formData.travelMonth ? `Anticipated Month: ${formData.travelMonth}` : '',
                        ].filter(Boolean).join('\n'),
                        priority: 'HIGH',
                    }),
                });
            } catch (error) {
                console.error('Failed to submit pre-registration data', error);
            }
        }

        setLoading(false);
        // Show success state correctly instead of hard-navigating immediately
        setSubmitted(true);
    };

    return (
        <section className="relative w-full h-[100dvh] min-h-[700px] max-h-[900px] flex flex-col items-center justify-center overflow-hidden font-sans border-t border-black/5 bg-[#F9F9F8]">

            {/* Background Image - White Overlay */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <Image
                    src="/images/home/cta-backdrop.webp"
                    alt="Yatara Atmosphere"
                    fill
                    sizes="100vw"
                    className="object-cover opacity-80 rounded-b-3xl"
                    priority
                />
                {/* Elegant white overlay so the image is visible faintly */}
                <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#F9F9F8] via-transparent to-white opacity-90" />
            </div>

            <div className="max-w-[1200px] w-full mx-auto px-6 relative z-10 flex flex-col items-center justify-center text-center">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-10 w-full flex flex-col items-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/70 backdrop-blur-md rounded-full border border-black/5 mb-5 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#043927] animate-pulse shadow-[0_0_8px_rgba(4,57,39,0.5)]" />
                        <span className="text-[9px] font-nav font-bold tracking-[0.25em] text-[#043927] uppercase">
                            Private Commission
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-black leading-[1.05] mb-4 tracking-tight drop-shadow-sm">
                        A World Formed <br className="hidden md:block" />
                        <span className="italic font-light text-[#043927]">Around You</span>
                    </h2>

                    <p className="text-slate-600 font-serif text-base md:text-lg leading-relaxed max-w-xl mx-auto drop-shadow-sm">
                        There are journeys you take, and journeys that become a part of you. Register your interest to unearth Sri Lanka’s best-kept secrets.
                    </p>
                </motion.div>

                {/* Central Form Container - Light Glass */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-full relative z-20"
                >
                    {/* The Transparent Glass Card */}
                    <div className="relative rounded-[2.5rem] bg-white/50 backdrop-blur-2xl border border-white p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.06)] max-w-[1000px] mx-auto">

                        <div className="relative z-10 w-full">
                            {submitted ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-6 px-4 md:px-12 flex flex-col items-center justify-center min-h-[300px] w-full max-w-[800px] mx-auto bg-white/70 rounded-3xl"
                                >
                                    <div className="h-[52px] w-[52px] rounded-full bg-[#F5F7F6] flex items-center justify-center mx-auto mb-6 border border-[#E5E9E7] shadow-sm">
                                        <CheckCircle2 className="h-6 w-6 text-[#043927]" strokeWidth={1.5} />
                                    </div>
                                    <h3 className="text-[32px] font-display text-[#043927] mb-4 tracking-wide font-medium">Request Received</h3>
                                    <p className="text-slate-500 font-sans text-[15px] font-light leading-relaxed mb-6 max-w-md mx-auto tracking-wide">
                                        A travel designer will reach out within <strong className="text-black font-medium">24-48 hours</strong> with a tailored proposal.
                                    </p>
                                    <div className="text-[#A4ABAA] font-sans text-[11px] uppercase tracking-widest mb-10">
                                        Confirmation sent to {(formData.email && formData.email.trim() !== '') ? formData.email : 'your email'}
                                    </div>

                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit}>

                                    {/* Separate Input Fields - Transparent with borders */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10 mb-10">

                                        {/* Input 1: Name */}
                                        <div className="col-span-1 group/input">
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043927]/60 group-focus-within/input:text-[#043927] transition-colors z-20">
                                                    <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                                </div>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Name"
                                                    className="h-[52px] rounded-xl border border-black/20 bg-transparent hover:bg-white/40 focus:bg-white/60 focus:border-[#043927]/50 focus:ring-0 pl-11 pr-4 text-black placeholder:text-black/40 text-[15px] font-sans font-light transition-all w-full shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Input 2: Email */}
                                        <div className="col-span-1 group/input">
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043927]/60 group-focus-within/input:text-[#043927] transition-colors z-20">
                                                    <Mail className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                                </div>
                                                <Input
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="Email / WhatsApp"
                                                    className="h-[52px] rounded-xl border border-black/20 bg-transparent hover:bg-white/40 focus:bg-white/60 focus:border-[#043927]/50 focus:ring-0 pl-11 pr-4 text-black placeholder:text-black/40 text-[15px] font-sans font-light transition-all w-full shadow-sm"
                                                />
                                            </div>
                                        </div>

                                        {/* Input 3: Travel Month */}
                                        <div className="col-span-1 group/input relative">
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#043927]/60 group-focus-within/input:text-[#043927] transition-colors z-20">
                                                    <Calendar className="w-[18px] h-[18px]" strokeWidth={1.5} />
                                                </div>
                                                <select
                                                    value={formData.travelMonth}
                                                    onChange={(e) => setFormData({ ...formData, travelMonth: e.target.value })}
                                                    className="w-full h-[52px] rounded-xl border border-black/20 bg-transparent hover:bg-white/40 focus:bg-white/60 focus:border-[#043927]/50 focus:ring-0 pl-11 pr-4 text-black text-[15px] font-sans font-light outline-none appearance-none cursor-pointer transition-all relative z-10 shadow-sm"
                                                >
                                                    <option value="" className="text-black/40">Travel Month</option>
                                                    {TRAVEL_MONTHS.map((month) => (
                                                        <option key={month} value={month} className="text-black bg-white">{month}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black/30 group-focus-within/input:text-black/60 transition-colors z-20">
                                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center justify-center">
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="h-[52px] px-12 bg-transparent hover:bg-black/5 border border-black/30 hover:border-black/60 text-black rounded-xl font-nav font-medium tracking-[0.15em] text-[12px] uppercase transition-all duration-300 backdrop-blur-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin mx-auto text-current" />
                                            ) : (
                                                <span className="flex items-center justify-center gap-3">
                                                    Request A Proposal
                                                    <ArrowRight className="w-[14px] h-[14px] transition-transform duration-300 group-hover/btn:translate-x-1" strokeWidth={1.5} />
                                                </span>
                                            )}
                                        </Button>

                                        <div className="mt-8 text-center">
                                            <span className="text-[9px] font-sans text-black/40 tracking-[0.1em] uppercase block">
                                                Custom proposal delivered within 24 hours
                                            </span>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Subfooter Badges */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="mt-8 flex flex-col items-center gap-6"
                >
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                        {PROOF_CHIPS.map((chip, i) => (
                            <div key={chip} className="flex items-center gap-3 group">
                                {i > 0 && <span className="hidden sm:block w-1 h-1 bg-black/10 rounded-full" />}
                                <span className="text-[8.5px] font-nav text-black/50 tracking-[0.2em] uppercase font-bold transition-colors duration-300 group-hover:text-black">
                                    {chip}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
