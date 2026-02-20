'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, User, Building2, Car, Shield, Users, Mail, Lock, Phone, ArrowRight, Eye, EyeOff } from 'lucide-react';

type AuthMode = 'login' | 'signup';

const PARTNER_ROLES = [
    { id: 'ADMIN', label: 'Administrator', icon: Shield, description: 'Full system access & finance' },
    { id: 'VEHICLE_OWNER', label: 'Fleet Partner', icon: Car, description: 'Manage your vehicles' },
    { id: 'HOTEL_OWNER', label: 'Hotel Partner', icon: Building2, description: 'Manage your properties' },
    { id: 'STAFF', label: 'Concierge Staff', icon: Users, description: 'Operations & bookings' },
];

export default function EliteLoginPage() {
    const [authMode, setAuthMode] = useState<AuthMode>('login');
    const [role, setRole] = useState('USER');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPartnerOptions, setShowPartnerOptions] = useState(false);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (role === 'USER' && authMode === 'login') {
                // Real login
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || 'Login failed');
                    return;
                }
                window.location.href = '/dashboard/my-journeys';
            } else {
                // Mock login for roles
                const res = await fetch('/api/auth/mock-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role })
                });

                if (res.ok) {
                    if (role === 'ADMIN' || role === 'STAFF') window.location.href = '/dashboard';
                    else if (role === 'VEHICLE_OWNER') window.location.href = '/dashboard/vehicles';
                    else if (role === 'HOTEL_OWNER') window.location.href = '/dashboard/partners';
                    else window.location.href = '/dashboard/my-journeys';
                } else {
                    setError('Login failed. Please try again.');
                }
            }
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
            // Auto-login after signup
            setAuthMode('login');
            setError('');
            alert('Account created successfully! Please sign in.');
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-12 px-4">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/Hero-Section.mp4" type="video/mp4" />
            </video>

            {/* Overlays */}
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-transparent to-black/40" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-lg">
                {/* Glassmorphic Card */}
                <div className="p-8 md:p-10 rounded-lg backdrop-blur-xl bg-black/25 border border-white/15 shadow-2xl">

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/images/yatara-brand-block.svg"
                            alt="Yatara Ceylon Logo"
                            width={200}
                            height={50}
                            className="object-contain drop-shadow-lg brightness-0 invert opacity-90"
                        />
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-serif text-antique-gold tracking-wide mb-2">
                            {authMode === 'login' ? 'Welcome Back' : 'Join Yatara Ceylon'}
                        </h1>
                        <p className="text-off-white/70 font-light text-xs tracking-[0.15em] uppercase">
                            {authMode === 'login'
                                ? 'Sign in to access your journeys'
                                : 'Create your exclusive account'}
                        </p>
                    </div>

                    {/* Auth Mode Toggle */}
                    <div className="flex mb-6 bg-white/5 border border-white/10 rounded-sm overflow-hidden">
                        <button
                            onClick={() => { setAuthMode('login'); setRole('USER'); setShowPartnerOptions(false); }}
                            className={`flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 ${authMode === 'login'
                                ? 'bg-antique-gold/20 text-antique-gold border-b-2 border-antique-gold'
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setAuthMode('signup'); setRole('USER'); setShowPartnerOptions(false); }}
                            className={`flex-1 py-2.5 text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 ${authMode === 'signup'
                                ? 'bg-antique-gold/20 text-antique-gold border-b-2 border-antique-gold'
                                : 'text-white/60 hover:text-white/80'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-500/15 border border-red-400/30 text-red-300 text-xs rounded-sm p-3 mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    {authMode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-antique-gold/50" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/8 border border-white/15 text-white h-12 pl-10 pr-4 rounded-sm focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm placeholder:text-white/40 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-antique-gold/50" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/8 border border-white/15 text-white h-12 pl-10 pr-12 rounded-sm focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm placeholder:text-white/40 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-deep-emerald font-serif text-base tracking-[0.15em] h-12 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.25)] border border-transparent hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Enter Your Journey
                            </Button>
                        </form>
                    )}

                    {/* Signup Form */}
                    {authMode === 'signup' && (
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-antique-gold/50" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full bg-white/8 border border-white/15 text-white h-12 pl-10 pr-4 rounded-sm focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm placeholder:text-white/40 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-antique-gold/50" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-white/8 border border-white/15 text-white h-12 pl-10 pr-4 rounded-sm focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm placeholder:text-white/40 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-antique-gold/50" />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-white/8 border border-white/15 text-white h-12 pl-10 pr-4 rounded-sm focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm placeholder:text-white/40 text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-antique-gold/50" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Create Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-white/8 border border-white/15 text-white h-12 pl-10 pr-12 rounded-sm focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm placeholder:text-white/40 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A028] text-deep-emerald font-serif text-base tracking-[0.15em] h-12 rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.25)] border border-transparent hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all duration-300"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                Create Your Account
                            </Button>
                        </form>
                    )}

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase">
                            <span className="bg-transparent px-3 text-white/40 tracking-[0.2em]">
                                Or join as a partner
                            </span>
                        </div>
                    </div>

                    {/* Partner Roles Toggle */}
                    <button
                        onClick={() => setShowPartnerOptions(!showPartnerOptions)}
                        className="w-full text-center text-xs text-antique-gold/70 hover:text-antique-gold tracking-[0.15em] uppercase transition-colors duration-300 flex items-center justify-center gap-2 py-2"
                    >
                        <span>{showPartnerOptions ? 'Hide' : 'Show'} Partner Access</span>
                        <ArrowRight className={`h-3 w-3 transition-transform duration-300 ${showPartnerOptions ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Partner Role Cards */}
                    {showPartnerOptions && (
                        <div className="mt-4 grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {PARTNER_ROLES.map((partnerRole) => {
                                const Icon = partnerRole.icon;
                                return (
                                    <button
                                        key={partnerRole.id}
                                        onClick={() => {
                                            setRole(partnerRole.id);
                                            setAuthMode('login');
                                        }}
                                        className={`p-3 border rounded-sm transition-all duration-300 text-left group
                                            ${role === partnerRole.id
                                                ? 'border-antique-gold/60 bg-antique-gold/10'
                                                : 'border-white/10 bg-white/3 hover:border-antique-gold/30 hover:bg-white/5'
                                            }`}
                                    >
                                        <Icon className={`h-5 w-5 mb-2 ${role === partnerRole.id ? 'text-antique-gold' : 'text-white/50 group-hover:text-antique-gold/70'}`} />
                                        <p className={`text-xs font-medium tracking-wider ${role === partnerRole.id ? 'text-antique-gold' : 'text-white/80'}`}>
                                            {partnerRole.label}
                                        </p>
                                        <p className="text-[10px] text-white/40 mt-0.5">{partnerRole.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer Links */}
                    <div className="mt-6 text-center">
                        <Link
                            href="https://wa.me/94771234567?text=I%20need%20assistance%20with%20my%20Yatara%20Ceylon%20account."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white/50 hover:text-antique-gold font-light text-xs tracking-wide transition-colors duration-300 inline-flex border-b border-transparent hover:border-antique-gold pb-1"
                        >
                            Need Help? Contact Concierge
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
