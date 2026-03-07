'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Loader2, User, Building2, Car, Shield, Users, Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

export default function EliteLoginPage() {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('USER');
    const [showPartnerAccess, setShowPartnerAccess] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Role-based redirect mapping
    const getRoleRedirect = (role: string) => {
        switch (role) {
            case 'ADMIN': return '/dashboard';
            case 'STAFF': return '/dashboard';
            case 'VEHICLE_OWNER': return '/dashboard/fleet';
            case 'HOTEL_OWNER': return '/dashboard/hotel';
            case 'USER': return '/dashboard/my-bookings';
            default: return '/dashboard';
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                // If it's a 403 due to pending approval, show specific message
                setError(data.error || 'Login failed');
                return;
            }
            // Redirect based on actual user role from DB
            const userRole = data.user?.role || 'USER';
            window.location.href = getRoleRedirect(userRole);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMsg('');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, role }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Registration failed');
                return;
            }

            if (role === 'USER') {
                setSuccessMsg('Account created successfully! Please sign in.');
            } else {
                setSuccessMsg('Application submitted! Pending admin approval before sign in.');
            }
            setAuthMode('login');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-8 px-4">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="https://raw.githubusercontent.com/sahansbandara/Yatara-Ceylon/main/public/Hero-Section.mp4" type="video/mp4" />
            </video>

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-transparent to-black/40" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[500px]">
                {/* Liquid Glass Card */}
                <div className="p-8 md:p-10 rounded-3xl backdrop-blur-md bg-black/30 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/yatara-brand-block.svg"
                            alt="Yatara Ceylon Logo"
                            width={160}
                            height={40}
                            className="object-contain drop-shadow-lg brightness-0 invert opacity-90"
                        />
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-serif text-antique-gold tracking-wide mb-1.5">
                            {authMode === 'login' ? 'Welcome Back' : 'Join Yatara Ceylon'}
                        </h1>
                        <p className="text-off-white/70 font-light text-[10px] md:text-xs tracking-[0.15em] uppercase">
                            {authMode === 'login'
                                ? 'Sign in to access your journeys'
                                : 'Create your exclusive account'}
                        </p>
                    </div>

                    {/* Auth Mode Toggle */}
                    <div className="flex mb-6 gap-3">
                        <button
                            type="button"
                            onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 py-3 text-xs tracking-[0.1em] uppercase font-semibold transition-all duration-300 rounded-xl border ${authMode === 'login'
                                ? 'border-antique-gold text-antique-gold bg-black/40 shadow-inner'
                                : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/30 bg-transparent'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setAuthMode('signup'); setError(''); setSuccessMsg(''); }}
                            className={`flex-1 py-3 text-xs tracking-[0.1em] uppercase font-semibold transition-all duration-300 rounded-xl border ${authMode === 'signup'
                                ? 'border-antique-gold text-antique-gold bg-black/40 shadow-inner'
                                : 'border-white/10 text-white/50 hover:text-white/80 hover:border-white/30 bg-transparent'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Notification Messages */}
                    {error && (
                        <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-xs rounded-md p-3 mb-5 text-center">
                            {error}
                        </div>
                    )}
                    {successMsg && (
                        <div className="bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs rounded-md p-3 mb-5 text-center">
                            {successMsg}
                        </div>
                    )}

                    {/* Login Form */}
                    {authMode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-hover:text-antique-gold transition-colors duration-300" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white h-12 pl-11 pr-4 rounded-xl focus:outline-none focus:border-antique-gold/70 focus:bg-white/10 placeholder:text-white/40 hover:bg-white/10 transition-all duration-300"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-hover:text-antique-gold transition-colors duration-300" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white h-12 pl-11 pr-12 rounded-xl focus:outline-none focus:border-antique-gold/70 focus:bg-white/10 placeholder:text-white/40 hover:bg-white/10 transition-all duration-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-antique-gold transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-4 bg-transparent border border-white/20 hover:border-white/40 text-white hover:text-white font-medium text-xs tracking-[0.15em] h-12 rounded-xl shadow-lg hover:bg-white/5 transition-all duration-300 group flex items-center justify-center gap-2 uppercase"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                    <>
                                        ENTER YOUR JOURNEY
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Signup Form */}
                    {authMode === 'signup' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">

                            <form onSubmit={handleSignup} className="space-y-3">
                                {/* Reduced input heights from h-14 to h-11 to fit 13inch screens easily */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative group">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40 group-hover:text-antique-gold transition-colors duration-300" />
                                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-white/10 text-white text-[13px] h-11 pl-10 pr-3 rounded-xl focus:border-antique-gold focus:outline-none placeholder:text-white/40" />
                                    </div>
                                    <div className="relative group">
                                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40 group-hover:text-antique-gold transition-colors duration-300" />
                                        <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white text-[13px] h-11 pl-10 pr-3 rounded-xl focus:border-antique-gold focus:outline-none placeholder:text-white/40" />
                                    </div>
                                </div>
                                <div className="relative group">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40 group-hover:text-antique-gold transition-colors duration-300" />
                                    <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-white/10 text-white text-[13px] h-11 pl-10 pr-3 rounded-xl focus:border-antique-gold focus:outline-none placeholder:text-white/40" />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/40 group-hover:text-antique-gold transition-colors duration-300" />
                                    <input type={showPassword ? 'text' : 'password'} placeholder="Create Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 text-white text-[13px] h-11 pl-10 pr-10 rounded-xl focus:border-antique-gold focus:outline-none placeholder:text-white/40" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-antique-gold">
                                        {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                    </button>
                                </div>



                                <Button type="submit" disabled={loading} className="w-full bg-antique-gold hover:bg-antique-gold/90 text-[#0a1f15] font-bold text-xs tracking-[0.15em] h-11 mt-2 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all duration-300 flex items-center justify-center gap-2 uppercase">
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                        <>CREATE ACCOUNT <ArrowRight className="h-3.5 w-3.5" /></>
                                    )}
                                </Button>

                                {/* Partner Access Foldout */}
                                <div className="pt-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-[1px] flex-1 bg-white/10"></div>
                                        <span className="text-[9px] uppercase tracking-[0.2em] text-white/40">OR JOIN AS A PARTNER</span>
                                        <div className="h-[1px] flex-1 bg-white/10"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setRole(role === 'VEHICLE_OWNER' ? 'USER' : 'VEHICLE_OWNER')}
                                            className={`flex flex-col items-start gap-2 p-3 text-left transition-all duration-300 rounded-xl border ${role === 'VEHICLE_OWNER' ? 'border-antique-gold text-antique-gold bg-antique-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Car className="h-4 w-4" />
                                                <span className="text-[12px] tracking-wider font-semibold">Fleet Partner</span>
                                            </div>
                                            <span className="text-[10px] tracking-wide opacity-70 font-light">Manage your vehicles</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole(role === 'HOTEL_OWNER' ? 'USER' : 'HOTEL_OWNER')}
                                            className={`flex flex-col items-start gap-2 p-3 text-left transition-all duration-300 rounded-xl border ${role === 'HOTEL_OWNER' ? 'border-antique-gold text-antique-gold bg-antique-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-white/10 text-white/50 hover:border-white/30 hover:text-white/80 bg-white/5'}`}
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <Building2 className="h-4 w-4" />
                                                <span className="text-[12px] tracking-wider font-semibold">Hotel Partner</span>
                                            </div>
                                            <span className="text-[10px] tracking-wide opacity-70 font-light">Manage your properties</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="mt-5 text-center">
                        <Link
                            href="https://wa.me/94771234567?text=I%20need%20assistance%20with%20my%20Yatara%20Ceylon%20account."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/40 hover:text-antique-gold font-light text-[10px] tracking-wide transition-colors duration-300 inline-flex border-b border-transparent hover:border-antique-gold pb-0.5"
                        >
                            Need Help? Contact Concierge
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
