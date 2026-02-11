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
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Reply</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                        placeholder="Type your reply..."
                        className="min-h-[120px]"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading} className="bg-ocean-600 hover:bg-ocean-700">
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            Send Reply
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
