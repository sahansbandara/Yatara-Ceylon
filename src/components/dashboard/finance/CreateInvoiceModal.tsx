'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Loader2, Plus, Trash2 } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface CreateInvoiceModalProps {
    bookingId: string;
}

export default function CreateInvoiceModal({ bookingId }: CreateInvoiceModalProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [items, setItems] = useState([{ label: '', qty: 1, unitPrice: 0 }]);
    const [discount, setDiscount] = useState(0);
    const [advanceRequired, setAdvanceRequired] = useState(0);
    const [notes, setNotes] = useState('');

    const subtotal = items.reduce((acc, item) => acc + (item.qty * item.unitPrice), 0);
    const total = Math.max(0, subtotal - discount);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate items
        if (items.some(i => !i.label || i.unitPrice <= 0)) {
            setError('Please complete all line items with valid descriptions and prices.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/invoices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    items,
                    discount,
                    advanceRequired,
                    notes
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create invoice');
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
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0a1f15] font-semibold text-xs tracking-widest rounded-xl transition-all hover:scale-105 gap-2">
                    <Plus className="h-4 w-4" />
                    Create Invoice
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-2xl liquid-glass-panel p-8 shadow-2xl z-50 overflow-y-auto text-off-white border border-white/10">
                    <Dialog.Title className="text-xl font-display font-bold text-white mb-1">
                        Generate Invoice
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-white/50 mb-6">
                        Build a new draft invoice with line items for this booking.
                    </Dialog.Description>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
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
                                    className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-2"
                                >
                                    <Plus className="h-3 w-3 mr-1" /> Add Item
                                </Button>
                            </div>

                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-2 items-start">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Description (e.g. Airport Transfer)"
                                            value={item.label}
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
                                        className="text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
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
                                    onChange={e => setAdvanceRequired(parseFloat(e.target.value) || 0)}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (Internal / Customer facing)</Label>
                            <Input
                                placeholder="Payment terms or additional notes..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>

                        <div className="bg-black/20 border border-white/10 rounded-xl p-4 flex justify-between items-center">
                            <span className="text-white/60 font-medium text-sm">Total Invoice Value:</span>
                            <span className="text-xl font-bold text-antique-gold">LKR {total.toLocaleString()}</span>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10 relative z-50">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-medium">
                                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin text-deep-emerald" /> Saving...</> : 'Generate Invoice'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
