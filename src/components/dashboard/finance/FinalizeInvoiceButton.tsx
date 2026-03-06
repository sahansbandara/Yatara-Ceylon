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
        <Button
            variant="ghost"
            size="sm"
            onClick={handleFinalize}
            disabled={loading}
            className="h-6 text-[10px] px-2 ml-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
        >
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <CheckCircle2 className="h-3 w-3 mr-1" />}
            Finalize
        </Button>
    );
}
