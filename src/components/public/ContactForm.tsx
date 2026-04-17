'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TurnstileField from '@/components/public/TurnstileField';

export default function ContactForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [turnstileToken, setTurnstileToken] = useState('');

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
                    subject: formData.subject,
                    message: formData.message,
                    priority: 'MEDIUM', // Default priority
                    turnstileToken,
                })
            });

            if (res.ok) {
                alert("Message sent successfully! Your ticket ID has been created.");
                setFormData({ name: '', email: '', subject: '', message: '' });
                router.refresh(); // Refresh to potentially show new state?
            } else {
                alert("Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form id="booking-form" onSubmit={handleSubmit} className="space-y-6 bg-white p-8 md:p-12 shadow-2xl border border-off-white/20 rounded-none relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-deep-emerald/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <h3 className="text-3xl font-serif text-deep-emerald mb-8">Craft Your Journey</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your Name"
                    className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Bespoke Honeymoon Planning"
                    className="h-12 rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share the details of your dream getaway..."
                    className="min-h-[150px] rounded-none border-gray-200 focus:border-antique-gold focus:ring-antique-gold font-light resize-none"
                />
            </div>

            <TurnstileField token={turnstileToken} onTokenChange={setTurnstileToken} />

            <Button type="submit" disabled={loading} className="w-full h-14 bg-deep-emerald hover:bg-antique-gold text-antique-gold hover:text-deep-emerald rounded-none uppercase font-semibold tracking-widest text-[11px] transition-all duration-500 mt-4">
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Submit Request
            </Button>
        </form>
    );
}
