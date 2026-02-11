'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ContactForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

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
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Subject</label>
                <Input
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Inquiry about..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we help you?"
                    className="min-h-[150px]"
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-bold bg-ocean-600 hover:bg-ocean-700">
                {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                Send Message
            </Button>
        </form>
    );
}
