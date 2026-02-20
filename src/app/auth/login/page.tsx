'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function EliteLoginPage() {
    const [role, setRole] = useState('ADMIN');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/mock-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            });

            if (res.ok) {
                // Route directly to the appropriate allowed dashboard section
                if (role === 'ADMIN' || role === 'STAFF') window.location.href = '/dashboard';
                else if (role === 'VEHICLE_OWNER') window.location.href = '/dashboard/vehicles';
                else if (role === 'HOTEL_OWNER') window.location.href = '/dashboard/partners';
                else window.location.href = '/dashboard/my-journeys';
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
            >
                <source src="/videos/hero-bg.mp4" type="video/mp4" />
                {/* Fallback to misty landscape if video not found */}
            </video>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
            <div className="absolute inset-0 bg-gradient-to-t from-deep-emerald/90 via-transparent to-black/40" />

            {/* Glassmorphic Login Card */}
            <div className="relative z-10 w-full max-w-md p-10 rounded-2xl backdrop-blur-lg bg-black/20 border border-white/20 shadow-2xl">

                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/logo.svg"
                        alt="Yatara Ceylon Logo"
                        width={200}
                        height={60}
                        className="priority drop-shadow-lg"
                    />
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif text-antique-gold tracking-wide mb-2">Exclusive Access</h1>
                    <p className="text-off-white/80 font-light text-sm tracking-widest text-shadow-sm">
                        ENTER YOUR CREDENTIALS TO CONTINUE
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-xs font-serif uppercase tracking-widest text-antique-gold/80 block">
                            Privilege Level
                        </label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 text-white h-12 px-4 rounded-none focus:outline-none focus:border-antique-gold font-light tracking-wide backdrop-blur-sm appearance-none"
                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right .7em top 50%', backgroundSize: '.65em auto' }}
                        >
                            <option value="ADMIN" className="bg-emerald-950 text-white">Administrator (Finance & Master)</option>
                            <option value="STAFF" className="bg-emerald-950 text-white">Concierge Staff</option>
                            <option value="USER" className="bg-emerald-950 text-white">Guest / User</option>
                            <option value="VEHICLE_OWNER" className="bg-emerald-950 text-white">Fleet Partner</option>
                            <option value="HOTEL_OWNER" className="bg-emerald-950 text-white">Hotel Partner</option>
                        </select>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-deep-emerald hover:bg-deep-emerald/90 text-antique-gold font-serif text-lg tracking-widest h-14 rounded-none shadow-[0_0_15px_rgba(212,175,55,0.2)] border border-transparent hover:border-antique-gold/60 transition-all duration-300"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Enter the Journey
                    </Button>
                </form>

                {/* Footer Links */}
                <div className="mt-8 text-center">
                    <Link
                        href="https://wa.me/94771234567?text=I%20am%20having%20trouble%20with%20my%20Private%20Access%20Code.%20Please%20assist."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-antique-gold font-light text-sm tracking-wide transition-colors duration-300 inline-flex border-b border-transparent hover:border-antique-gold pb-1"
                    >
                        Forgot Access Code?
                    </Link>
                </div>
            </div>
        </div>
    );
}
