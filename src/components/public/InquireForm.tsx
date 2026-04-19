'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import Image from 'next/image';
import TurnstileField from '@/components/public/TurnstileField';

const INTEREST_OPTIONS = ['Heritage', 'Wildlife', 'Tea Country', 'Beach', 'Wellness', 'Photography', 'Adventure', 'Culinary'];
const PACE_OPTIONS = ['Relaxed', 'Balanced', 'Active'];
const BUDGET_OPTIONS = ['Flexible', 'Under $2,000', '$2,000–$5,000', '$5,000–$10,000', '$10,000+'];

interface InquireFormProps {
    inquiryType?: string;
    journeySlug?: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    travelDates?: string;
    partySize?: string;
}

function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string) {
    // Accepts: +94 70 423 9802, +1-234-567-8900, 0704239802, etc.
    const cleaned = phone.replace(/[\s\-()]/g, '');
    return /^\+?\d{7,15}$/.test(cleaned);
}

export default function InquireForm({ inquiryType = 'proposal', journeySlug = '' }: InquireFormProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
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

    // ─── Validation ───
    const validateField = useCallback((field: keyof FormErrors, value: string): string | undefined => {
        switch (field) {
            case 'name':
                if (!value.trim()) return 'Full name is required';
                if (value.trim().length < 2) return 'Name must be at least 2 characters';
                if (!/^[a-zA-Z\s\-']+$/.test(value.trim())) return 'Name must contain only letters';
                return undefined;
            case 'email':
                if (!value.trim()) return 'Email address is required';
                if (!validateEmail(value.trim())) return 'Please enter a valid email address';
                return undefined;
            case 'phone':
                if (!value.trim()) return 'Phone number is required';
                if (!validatePhone(value.trim())) return 'Please enter a valid phone number (e.g., +94 70 423 9802)';
                return undefined;
            case 'travelDates':
                if (!value.trim()) return 'Travel dates are required';
                return undefined;
            case 'partySize':
                if (!value.trim()) return 'Party size is required';
                return undefined;
            default:
                return undefined;
        }
    }, []);

    const handleFieldChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error on change if field was touched
        if (touched[field]) {
            const error = validateField(field as keyof FormErrors, value);
            setErrors(prev => ({ ...prev, [field]: error }));
        }
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const value = formData[field as keyof typeof formData];
        const error = validateField(field as keyof FormErrors, typeof value === 'string' ? value : '');
        setErrors(prev => ({ ...prev, [field]: typeof error === 'string' ? error : undefined }));
    };

    const validateStep1 = (): boolean => {
        const nameError = validateField('name', formData.name);
        const emailError = validateField('email', formData.email);
        const phoneError = validateField('phone', formData.phone);
        const datesError = validateField('travelDates', formData.travelDates);
        const partyError = validateField('partySize', formData.partySize);

        const newErrors: FormErrors = {};
        if (nameError) newErrors.name = nameError;
        if (emailError) newErrors.email = emailError;
        if (phoneError) newErrors.phone = phoneError;
        if (datesError) newErrors.travelDates = datesError;
        if (partyError) newErrors.partySize = partyError;

        setErrors(newErrors);
        setTouched({ name: true, email: true, phone: true, travelDates: true, partySize: true });
        return Object.keys(newErrors).length === 0;
    };

    const canProceedStep1 = formData.name.trim() && formData.email.trim() && formData.phone.trim() && formData.travelDates.trim() && formData.partySize.trim();

    const handleStep1Continue = () => {
        if (validateStep1()) {
            setStep(2);
        }
    };

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
            `--- ${inquiryType === 'concierge' ? 'CONCIERGE CALL REQUEST' : 'PROPOSAL REQUEST'} FROM WEBSITE ---`,
            journeySlug ? `Journey: ${journeySlug}` : '',
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
        return parts.filter(Boolean).join('\n');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep1()) {
            setStep(1);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch('/api/public/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    email: formData.email,
                    subject: `${inquiryType === 'concierge' ? 'Concierge Call' : 'Proposal Request'}${journeySlug ? ` [${journeySlug}]` : ''} — ${formData.name}`,
                    message: composeMessage(),
                    priority: 'HIGH',
                    turnstileToken,
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

    // ─── INPUT CLASS BUILDER ───
    const inputClass = (field: string, hasError: boolean) =>
        `h-13 border bg-white/40 backdrop-blur-sm font-light transition-all duration-300 focus:bg-white/70
        ${hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-200/80 focus:border-antique-gold focus:ring-antique-gold/20 hover:border-gray-300'
        }`;

    // ═══════ SUCCESS STATE ═══════
    if (submitted) {
        return (
            <div className="relative bg-white/60 backdrop-blur-2xl border border-white/80 p-10 md:p-14 text-center shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
                {/* Decorative orbs */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-antique-gold/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-deep-emerald/10 to-transparent rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

                <div className="relative max-w-md mx-auto">
                    <div className="h-20 w-20 rounded-full bg-gradient-to-br from-deep-emerald/10 to-antique-gold/10 flex items-center justify-center mx-auto mb-8 border border-deep-emerald/10">
                        <CheckCircle2 className="h-10 w-10 text-deep-emerald" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-3xl font-serif text-deep-emerald mb-4">Request Received</h3>
                    <p className="text-gray-500 font-light leading-relaxed mb-2">
                        Your concierge will respond within <strong className="text-deep-emerald font-medium">2 hours</strong> with a curated proposal tailored to your journey.
                    </p>
                    <p className="text-gray-400 font-light text-sm mb-8">
                        We&apos;ve sent a confirmation to {formData.email}
                    </p>

                    <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-deep-emerald/5 border border-deep-emerald/10 text-deep-emerald text-xs tracking-wider uppercase mb-8">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Ticket Created Successfully
                    </div>

                    <div className="border-t border-gray-100 pt-6">
                        <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-3">Need us sooner?</p>
                        <a
                            href="https://wa.me/94704239802"
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

    // ═══════ FORM STATE ═══════
    return (
        <form onSubmit={handleSubmit} className="relative bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col md:flex-row">
            
            {/* ─── LEFT IMAGE COLUMN ─── */}
            <div className="hidden md:block md:w-2/5 relative min-h-full">
                <Image 
                    src="/images/inquire/form-side.webp" 
                    alt="Luxury Travel Ceylon"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/40 to-transparent" />
                <div className="absolute bottom-10 left-8 right-8">
                    <Sparkles className="text-antique-gold w-6 h-6 mb-3" />
                    <p className="text-white font-serif text-lg leading-snug">
                        &quot;Luxury is in each detail.&quot;
                    </p>
                </div>
            </div>

            {/* ─── RIGHT FORM COLUMN ─── */}
            <div className="flex-1 p-8 md:p-10 relative">
                {/* Decorative glass orbs */}
                <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-antique-gold/8 to-transparent rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-44 h-44 bg-gradient-to-tr from-deep-emerald/8 to-transparent rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

                {/* Step indicator */}
            <div className="flex items-center gap-4 mb-10 relative z-10">
                <div className="flex items-center gap-2 flex-1">
                    <div className={`h-8 w-8 flex items-center justify-center text-xs font-medium border transition-all duration-500 ${step >= 1 ? 'bg-deep-emerald text-white border-deep-emerald' : 'bg-white text-gray-400 border-gray-200'}`}>
                        1
                    </div>
                    <span className={`text-[10px] tracking-[0.15em] uppercase hidden sm:block ${step >= 1 ? 'text-deep-emerald' : 'text-gray-400'}`}>Your Details</span>
                </div>
                <div className={`h-px flex-1 max-w-16 transition-colors duration-500 ${step >= 2 ? 'bg-deep-emerald' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2 flex-1">
                    <div className={`h-8 w-8 flex items-center justify-center text-xs font-medium border transition-all duration-500 ${step >= 2 ? 'bg-deep-emerald text-white border-deep-emerald' : 'bg-white text-gray-400 border-gray-200'}`}>
                        2
                    </div>
                    <span className={`text-[10px] tracking-[0.15em] uppercase hidden sm:block ${step >= 2 ? 'text-deep-emerald' : 'text-gray-400'}`}>Your Preferences</span>
                </div>
            </div>

            <div className="relative z-10">
                {/* ═══════ STEP 1 ═══════ */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="mb-2">
                            <h3 className="text-2xl md:text-3xl font-serif text-deep-emerald mb-1">Tell us about you</h3>
                            <p className="text-gray-400 text-sm font-light">Just the essentials to get started.</p>
                        </div>

                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Full Name *</label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                placeholder="Your full name"
                                className={inputClass('name', !!errors.name && touched.name)}
                            />
                            {errors.name && touched.name && (
                                <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Email *</label>
                            <Input
                                required
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleFieldChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                                placeholder="name@example.com"
                                className={inputClass('email', !!errors.email && touched.email)}
                            />
                            {errors.email && touched.email && (
                                <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">WhatsApp / Phone *</label>
                            <Input
                                required
                                value={formData.phone}
                                onChange={(e) => handleFieldChange('phone', e.target.value)}
                                onBlur={() => handleBlur('phone')}
                                placeholder="+94 70 423 9802"
                                className={inputClass('phone', !!errors.phone && touched.phone)}
                            />
                            {errors.phone && touched.phone && (
                                <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Travel Dates + Party Size */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Travel Dates *</label>
                                <Input
                                    required
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.travelDates}
                                    onChange={(e) => handleFieldChange('travelDates', e.target.value)}
                                    onBlur={() => handleBlur('travelDates')}
                                    className={inputClass('travelDates', !!errors.travelDates && touched.travelDates)}
                                />
                                {errors.travelDates && touched.travelDates && (
                                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        {errors.travelDates}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Party Size *</label>
                                <Input
                                    required
                                    type="number"
                                    min="1"
                                    value={formData.partySize}
                                    onChange={(e) => handleFieldChange('partySize', e.target.value)}
                                    onBlur={() => handleBlur('partySize')}
                                    placeholder="e.g. 2"
                                    className={inputClass('partySize', !!errors.partySize && touched.partySize)}
                                />
                                {errors.partySize && touched.partySize && (
                                    <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        {errors.partySize}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Continue Button */}
                        <Button
                            type="button"
                            disabled={!canProceedStep1}
                            onClick={handleStep1Continue}
                            className="w-full h-14 bg-deep-emerald hover:bg-deep-emerald/90 text-white disabled:opacity-40 disabled:cursor-not-allowed uppercase font-semibold tracking-[0.2em] text-[11px] transition-all duration-300 mt-4 flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <p className="text-center text-gray-300 text-[11px] tracking-wider">
                            * Required fields · Step 2 is optional
                        </p>
                    </div>
                )}

                {/* ═══════ STEP 2 ═══════ */}
                {step === 2 && (
                    <div className="space-y-7 animate-in fade-in duration-500">
                        <div className="mb-2">
                            <h3 className="text-2xl md:text-3xl font-serif text-deep-emerald mb-1">Shape your journey</h3>
                            <p className="text-gray-400 text-sm font-light">Optional — helps us curate faster.</p>
                        </div>

                        {/* Interests chips */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Interests</label>
                            <div className="flex flex-wrap gap-2">
                                {INTEREST_OPTIONS.map((interest) => (
                                    <button
                                        key={interest}
                                        type="button"
                                        onClick={() => toggleInterest(interest)}
                                        className={`px-4 py-2.5 text-[11px] tracking-wider uppercase border transition-all duration-300
                                            ${formData.interests.includes(interest)
                                                ? 'bg-deep-emerald text-white border-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
                                                : 'bg-white/60 backdrop-blur-sm text-gray-500 border-gray-200/80 hover:border-antique-gold hover:text-deep-emerald hover:bg-white/80'
                                            }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pace */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Preferred Pace</label>
                            <div className="grid grid-cols-3 gap-3">
                                {PACE_OPTIONS.map((pace) => (
                                    <button
                                        key={pace}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, pace })}
                                        className={`py-3.5 text-[11px] tracking-wider uppercase border transition-all duration-300
                                            ${formData.pace === pace
                                                ? 'bg-deep-emerald text-white border-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
                                                : 'bg-white/60 backdrop-blur-sm text-gray-500 border-gray-200/80 hover:border-antique-gold hover:bg-white/80'
                                            }`}
                                    >
                                        {pace}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Budget Range (per person)</label>
                            <div className="flex flex-wrap gap-2">
                                {BUDGET_OPTIONS.map((budget) => (
                                    <button
                                        key={budget}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, budget })}
                                        className={`px-4 py-2.5 text-[11px] tracking-wider border transition-all duration-300
                                            ${formData.budget === budget
                                                ? 'bg-deep-emerald text-white border-deep-emerald shadow-[0_2px_12px_rgba(0,0,0,0.15)]'
                                                : 'bg-white/60 backdrop-blur-sm text-gray-500 border-gray-200/80 hover:border-antique-gold hover:bg-white/80'
                                            }`}
                                    >
                                        {budget}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.15em]">Anything else?</label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Special occasions, dietary requirements, must-see places, accessibility needs..."
                                className="min-h-[120px] border-gray-200/80 focus:border-antique-gold focus:ring-antique-gold/20 font-light resize-none bg-white/40 backdrop-blur-sm hover:border-gray-300 transition-all duration-300"
                            />
                        </div>

                        <TurnstileField token={turnstileToken} onTokenChange={setTurnstileToken} />

                        {/* Action buttons */}
                        <div className="flex gap-3 mt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="h-14 px-6 border-gray-200 text-gray-500 hover:text-deep-emerald hover:border-deep-emerald tracking-[0.2em] text-[11px] uppercase transition-all duration-300"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="flex-1 h-14 bg-gradient-to-r from-antique-gold to-[#c9a84c] hover:from-[#c9a84c] hover:to-antique-gold text-deep-emerald uppercase font-semibold tracking-[0.2em] text-[11px] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(183,157,64,0.3)] hover:shadow-[0_8px_32px_rgba(183,157,64,0.4)]"
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
            </div>
        </form>
    );
}
