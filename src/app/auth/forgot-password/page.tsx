'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2, Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ForgotPasswordContent() {
    const searchParams = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || 'Unable to send password reset email.');
                return;
            }

            setMessage(data.message || 'If that email exists, a password reset link has been sent.');
        } catch {
            setError('Unable to send password reset email right now.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#08110d] text-white flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-black/30 backdrop-blur-md p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                <Link href="/auth/login" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45 hover:text-antique-gold transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Sign In
                </Link>

                <div className="mt-6 mb-6">
                    <h1 className="text-3xl font-serif text-antique-gold">Reset Password</h1>
                    <p className="mt-2 text-sm text-white/55">Enter your account email and we&apos;ll send you a one-time reset link.</p>
                </div>

                {message ? <div className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div> : null}
                {error ? <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div> : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/35" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Email Address"
                            className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 h-12 text-white placeholder:text-white/35 focus:outline-none focus:border-antique-gold/60"
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-antique-gold text-[#0a1f15] hover:bg-antique-gold/90 uppercase tracking-[0.15em] text-xs font-bold">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#08110d]" />}>
            <ForgotPasswordContent />
        </Suspense>
    );
}
