'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, MessageCircle } from 'lucide-react';

const INTEREST_OPTIONS = ['Heritage', 'Wildlife', 'Tea Country', 'Beach', 'Wellness', 'Photography', 'Adventure', 'Culinary'];
const PACE_OPTIONS = ['Relaxed', 'Balanced', 'Active'];
const BUDGET_OPTIONS = ['Flexible', 'Under $2,000', '$2,000–$5,000', '$5,000–$10,000', '$10,000+'];

export default function InquireForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        travelDates: '',
        partySize: '',
        interests: [] as string[],
        pace: '',
        budget: '',
        notes: '',
    });

    const canProceedStep1 = formData.name.trim() && formData.email.trim() && formData.phone.trim();

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const composeMessage = () => {
        const parts = [
            `--- INQUIRY FROM WEBSITE ---`,
            `Name: ${formData.name}`,
            `Email: ${formData.email}`,
            `Phone/WhatsApp: ${formData.phone}`,
        ];
        if (formData.travelDates) parts.push(`Travel Dates: ${formData.travelDates}`);
        if (formData.partySize) parts.push(`Party Size: ${formData.partySize}`);
        if (formData.interests.length > 0) parts.push(`Interests: ${formData.interests.join(', ')}`);
        if (formData.pace) parts.push(`Pace: ${formData.pace}`);
        if (formData.budget) parts.push(`Budget: ${formData.budget}`);
        if (formData.notes) parts.push(`\nAdditional Notes:\n${formData.notes}`);
        return parts.join('\n');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/public/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    email: formData.email,
                    subject: `Inquiry: Curated Proposal Request — ${formData.name}`,
                    message: composeMessage(),
                    priority: 'HIGH',
                }),
            });

            if (res.ok) {
                setSubmitted(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Success state
    if (submitted) {
        return (
            <div className="bg-white/80 backdrop-blur-xl border border-deep-emerald/10 p-10 md:p-14 text-center shadow-lg">
                <div className="max-w-md mx-auto">
                    <div className="h-16 w-16 rounded-full bg-deep-emerald/10 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="h-8 w-8 text-deep-emerald" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-serif text-deep-emerald mb-4">Request Received</h3>
                    <p className="text-gray-500 font-light leading-relaxed mb-2">
                        Your concierge will respond within <strong className="text-deep-emerald font-medium">2 hours</strong> with a curated proposal tailored to your journey.
                    </p>
                    <p className="text-gray-400 font-light text-sm mb-8">
                        We&apos;ve sent a confirmation to {formData.email}
                    </p>

                    <div className="border-t border-gray-100 pt-6">
                        <p className="text-xs tracking-[0.15em] uppercase text-gray-400 mb-3">Need us sooner?</p>
                        <a
                            href="https://wa.me/94771234567"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-deep-emerald hover:text-antique-gold transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat on WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-deep-emerald/10 p-8 md:p-12 shadow-lg relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-antique-gold/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-deep-emerald/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-deep-emerald' : 'bg-gray-200'}`} />
                <div className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-deep-emerald' : 'bg-gray-200'}`} />
            </div>

            <div className="relative z-10">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div>
                            <h3 className="text-2xl font-serif text-deep-emerald mb-1">Tell us about you</h3>
                            <p className="text-gray-400 text-sm font-light">Just the essentials to get started.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Full Name *</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your full name"
                                className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light bg-white/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Email *</label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="name@example.com"
                                className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light bg-white/50"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">WhatsApp / Phone *</label>
                            <Input
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+1 234 567 8900"
                                className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light bg-white/50"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Travel Dates</label>
                                <Input
                                    value={formData.travelDates}
                                    onChange={(e) => setFormData({ ...formData, travelDates: e.target.value })}
                                    placeholder="e.g. March 2026"
                                    className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light bg-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Party Size</label>
                                <Input
                                    value={formData.partySize}
                                    onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                                    placeholder="e.g. 2 adults"
                                    className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light bg-white/50"
                                />
                            </div>
                        </div>

                        <Button
                            type="button"
                            disabled={!canProceedStep1}
                            onClick={() => setStep(2)}
                            className="w-full h-14 bg-deep-emerald hover:bg-deep-emerald/90 text-white disabled:opacity-40 disabled:cursor-not-allowed rounded-none uppercase font-semibold tracking-widest text-[11px] transition-all duration-300 mt-2 flex items-center justify-center gap-2"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <p className="text-center text-gray-300 text-[11px] tracking-wider">
                            * Required fields · Step 2 is optional
                        </p>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div>
                            <h3 className="text-2xl font-serif text-deep-emerald mb-1">Shape your journey</h3>
                            <p className="text-gray-400 text-sm font-light">Optional — helps us curate faster.</p>
                        </div>

                        {/* Interests chips */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Interests</label>
                            <div className="flex flex-wrap gap-2">
                                {INTEREST_OPTIONS.map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2 text-xs tracking-wider uppercase border transition-all duration-200
                                            ${formData.interests.includes(interest)
                                                ? 'bg-deep-emerald text-white border-deep-emerald'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-antique-gold hover:text-deep-emerald'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pace */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Preferred Pace</label>
                            <div className="flex gap-3">
                                {PACE_OPTIONS.map((pace) => (
                                    <button
                                        key={pace}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, pace })}
                                        className={`flex-1 py-3 text-xs tracking-wider uppercase border transition-all duration-200
                                            ${formData.pace === pace
                                                ? 'bg-deep-emerald text-white border-deep-emerald'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-antique-gold'
                                            }`}
                                    >
                                        {pace}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="space-y-3">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Budget Range (per person)</label>
                            <div className="flex flex-wrap gap-2">
                                {BUDGET_OPTIONS.map((budget) => (
                                    <button
                                        key={budget}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, budget })}
                                        className={`px-4 py-2 text-xs tracking-wider border transition-all duration-200
                                            ${formData.budget === budget
                                                ? 'bg-deep-emerald text-white border-deep-emerald'
                                                : 'bg-white text-gray-500 border-gray-200 hover:border-antique-gold'
                                            }`}
                                    >
                                        {budget}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600 uppercase tracking-wider">Anything else?</label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Special occasions, dietary requirements, must-see places, accessibility needs..."
                                className="min-h-[100px] rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light resize-none bg-white/50"
                            />
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="h-14 px-6 rounded-none border-gray-200 text-gray-500 hover:text-deep-emerald hover:border-deep-emerald tracking-widest text-[11px] uppercase"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-14 bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald rounded-none uppercase font-semibold tracking-widest text-[11px] transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : null}
                                Get My Curated Proposal
                            </Button>
                        </div>
                        <p className="text-center text-gray-300 text-[11px] tracking-wider">
                            No obligation · Response within 2 hours
                        </p>
                    </div>
                )}
            </div>
        </form>
    );
}
