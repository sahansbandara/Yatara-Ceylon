'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';

interface TicketReplyFormProps {
    ticketId: string;
}

export default function TicketReplyForm({ ticketId }: TicketReplyFormProps) {
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/tickets/${ticketId}/reply`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: body.trim(), byName: 'Staff' }),
            });

            if (res.ok) {
                setBody('');
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.message || 'Failed to send reply'}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to send reply');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="liquid-glass-stat rounded-2xl p-6 mt-4">
            <h3 className="text-sm font-semibold text-off-white uppercase tracking-wider mb-4">Reply to Ticket</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                    placeholder="Type your reply here..."
                    className="min-h-[120px] bg-white/[0.04] border-white/[0.08] text-white focus-visible:ring-antique-gold/20 placeholder:text-white/20 rounded-xl resize-none"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={loading} className="bg-antique-gold hover:bg-antique-gold/90 text-[#020b08] shadow-[0_0_20px_rgba(212,175,55,0.2)] rounded-xl h-10 px-6 font-semibold transition-all">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#020b08]/60" /> : <Send className="mr-2 h-4 w-4" />}
                        Send Reply
                    </Button>
                </div>
            </form>
        </div>
    );
}
