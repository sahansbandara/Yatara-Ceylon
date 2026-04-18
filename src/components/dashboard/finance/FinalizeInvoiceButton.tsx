'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';

interface FinalizeInvoiceButtonProps {
    invoiceId: string;
}

export default function FinalizeInvoiceButton({ invoiceId }: FinalizeInvoiceButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFinalize = async () => {
        if (!confirm('Are you sure you want to finalize this invoice? It cannot be changed back to Draft.')) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'FINAL' })
            });

            if (!res.ok) throw new Error('Failed to finalize invoice');
            router.refresh();
        } catch (error) {
            console.error(error);
            alert('Failed to finalize invoice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleFinalize}
            disabled={loading}
            title="Finalize Invoice"
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all disabled:opacity-50"
        >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
        </button>
    );
}
