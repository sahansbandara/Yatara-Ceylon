'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

interface DeleteInvoiceButtonProps {
    invoiceId: string;
    invoiceNo: string;
}

export default function DeleteInvoiceButton({ invoiceId, invoiceNo }: DeleteInvoiceButtonProps) {
    const [deleting, setDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || 'Failed to delete invoice');
                return;
            }
            router.refresh();
        } catch (err: any) {
            alert(err.message || 'An error occurred');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
                <button
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all disabled:opacity-50"
                    title="Delete Invoice"
                    disabled={deleting}
                >
                    {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
                <AlertDialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                    <AlertDialog.Content className="pointer-events-auto w-full max-w-md rounded-2xl bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-2xl p-8 outline-none text-off-white">
                        <AlertDialog.Title className="text-lg font-display font-semibold text-red-400 mb-2">
                            Delete Invoice {invoiceNo}?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="text-sm text-white/50 mb-8 leading-relaxed">
                            This will permanently remove this draft invoice. This action cannot be undone. Are you sure you want to continue?
                        </AlertDialog.Description>

                        <div className="flex gap-4 justify-end">
                            <AlertDialog.Cancel asChild>
                                <button className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/20 text-white/80 hover:bg-white/10 transition-colors">
                                    Cancel
                                </button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action asChild>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-8 py-2.5 rounded-xl text-sm font-semibold bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.1)] disabled:opacity-50 flex items-center gap-2"
                                >
                                    {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    Delete Invoice
                                </button>
                            </AlertDialog.Action>
                        </div>
                    </AlertDialog.Content>
                </div>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
