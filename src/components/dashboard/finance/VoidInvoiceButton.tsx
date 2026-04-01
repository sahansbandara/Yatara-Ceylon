'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2 } from 'lucide-react';

interface VoidInvoiceButtonProps {
    invoiceId: string;
}

export default function VoidInvoiceButton({ invoiceId }: VoidInvoiceButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleVoid = async () => {
        const reason = prompt('Reason for voiding this invoice (optional):');
        if (reason === null) return; // User cancelled

        if (!confirm('Are you sure you want to void this invoice? This action cannot be undone.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'VOID', reason: reason || undefined })
            });

            if (!res.ok) throw new Error('Failed to void invoice');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to void invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleVoid}
            disabled={loading}
            className="h-6 text-[10px] px-2 ml-2 bg-red-500/10 hover:bg-red-500/20 text-red-400"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
            Void
        </Button>
    );
}
