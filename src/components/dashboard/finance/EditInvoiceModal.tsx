'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface InvoiceItem {
    label: string;
    qty: number;
    unitPrice: number;
}

interface EditInvoiceModalProps {
    invoiceId: string;
    currentItems: InvoiceItem[];
    currentDiscount: number;
    currentAdvanceRequired: number;
    currentNotes: string;
}

export default function EditInvoiceModal({
    invoiceId,
    currentItems,
    currentDiscount,
    currentAdvanceRequired,
    currentNotes,
}: EditInvoiceModalProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [items, setItems] = useState<InvoiceItem[]>(currentItems);
    const [discount, setDiscount] = useState(currentDiscount);
    const [advanceRequired, setAdvanceRequired] = useState(currentAdvanceRequired);
    const [notes, setNotes] = useState(currentNotes || '');

    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    const total = Math.max(0, subtotal - discount);

    // Reset form to current values when opening
    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setItems([...currentItems]);
            setDiscount(currentDiscount);
            setAdvanceRequired(currentAdvanceRequired);
            setNotes(currentNotes || '');
            setError('');
        }
        setOpen(isOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.some(i => !i.label || i.unitPrice <= 0)) {
            setError('Please complete all line items with valid descriptions and prices.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/invoices/${invoiceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, discount, advanceRequired, notes }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update invoice');
            }

            setOpen(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <button
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all"
                    title="Edit Invoice"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <Dialog.Content className="pointer-events-auto relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2rem] bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-2xl p-8 outline-none text-off-white scrollbar-glass-dark">
                    <Dialog.Title className="text-xl font-display font-semibold text-antique-gold mb-1 tracking-wide">
                        Edit Invoice
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-white/40 mb-8 font-light">
                        Modify line items, discount, and notes for this draft invoice.
                    </Dialog.Description>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Line Items */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center mb-2">
                                <Label>Line Items</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setItems([...items, { label: '', qty: 1, unitPrice: 0 }])}
                                    className="h-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-2"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Add Item
                                </Button>
                            </div>

                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Description"
                                            value={item.label}
                                            className="bg-black/20 border-white/10 text-white"
                                            onChange={e => {
                                                const newItems = [...items];
                                                newItems[idx].label = e.target.value;
                                                setItems(newItems);
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="w-20">
                                        <Input
                                            type="number"
                                            min="1"
                                            placeholder="Qty"
                                            value={item.qty}
                                            className="bg-black/20 border-white/10 text-white"
                                            onChange={e => {
                                                const newItems = [...items];
                                                newItems[idx].qty = parseInt(e.target.value) || 1;
                                                setItems(newItems);
                                            }}
                                            required
                                        />
                                    </div>
                                    <div className="w-32">
                                        <Input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            placeholder="Price"
                                            value={item.unitPrice || ''}
                                            className="bg-black/20 border-white/10 text-white"
                                            onChange={e => {
                                                const newItems = [...items];
                                                newItems[idx].unitPrice = parseFloat(e.target.value) || 0;
                                                setItems(newItems);
                                            }}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-white/40 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                                        onClick={() => {
                                            if (items.length > 1) {
                                                setItems(items.filter((_, i) => i !== idx));
                                            }
                                        }}
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Financial Summaries */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="space-y-2">
                                <Label>Discount (LKR)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={discount || ''}
                                    className="bg-black/20 border-white/10 text-white"
                                    onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Required Advance (LKR)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={advanceRequired || ''}
                                    className="bg-black/20 border-white/10 text-white"
                                    onChange={e => setAdvanceRequired(parseFloat(e.target.value) || 0)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Input
                                placeholder="Payment terms or additional notes..."
                                value={notes}
                                className="bg-black/20 border-white/10 text-white"
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="bg-antique-gold/10 border border-antique-gold/20 rounded-2xl p-5 flex justify-between items-center mt-4">
                            <span className="text-antique-gold/70 font-display font-semibold text-sm uppercase tracking-wider">Updated Total</span>
                            <span className="text-2xl font-bold text-antique-gold drop-shadow-sm">LKR {total.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-4 justify-end pt-6">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={saving} className="rounded-xl px-6 bg-transparent border border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="rounded-xl px-10 bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-semibold shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin text-deep-emerald" /> Saving...</> : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
