'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Loader2, Plus, CreditCard, Landmark, Banknote } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

interface RecordPaymentModalProps {
    bookingId: string;
    remainingBalance: number;
}

export default function RecordPaymentModal({ bookingId, remainingBalance }: RecordPaymentModalProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [form, setForm] = useState({
        amount: remainingBalance || 0,
        method: 'CASH',
        reference: '',
        notes: '',
        paidAt: new Date().toISOString().slice(0, 16)
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    bookingId,
                    type: 'PAYMENT',
                    amount: Number(form.amount)
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to record payment');
            }

            setOpen(false);
            router.refresh(); // Refresh the page to show new totals
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
                    <Plus className="h-4 w-4" /> Record Payment
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" />
                <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-2xl liquid-glass-panel p-8 shadow-2xl z-50 overflow-y-auto text-off-white border border-white/10">
                    <Dialog.Title className="text-xl font-display font-bold text-white mb-1">
                        Record Manual Payment
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-white/50 mb-6">
                        Log a payment received outside of the automated online gateway.
                    </Dialog.Description>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Amount (LKR)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">LKR</span>
                                    <Input
                                        type="number"
                                        min="1"
                                        step="0.01"
                                        required
                                        className="pl-12"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Payment Date/Time</Label>
                                <Input
                                    type="datetime-local"
                                    required
                                    value={form.paidAt}
                                    onChange={e => setForm({ ...form, paidAt: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {['CASH', 'BANK', 'CARD_OTHER'].map((method) => (
                                    <button
                                        type="button"
                                        key={method}
                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${form.method === method ? 'border-antique-gold bg-antique-gold/10 text-antique-gold' : 'border-white/10 hover:border-white/20 text-white/60 bg-white/5'}`}
                                        onClick={() => setForm({ ...form, method })}
                                    >
                                        {method === 'CASH' && <Banknote className="h-5 w-5 mb-1" />}
                                        {method === 'BANK' && <Landmark className="h-5 w-5 mb-1" />}
                                        {method === 'CARD_OTHER' && <CreditCard className="h-5 w-5 mb-1" />}
                                        <span className="text-[10px] font-semibold tracking-wider">
                                            {method === 'CARD_OTHER' ? 'CARD / OTHER' : method}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Reference ID (Optional)</Label>
                            <Input
                                placeholder="e.g. Bank Transfer Receipt #"
                                value={form.reference}
                                onChange={e => setForm({ ...form, reference: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Notes (Optional)</Label>
                            <Input
                                placeholder="Any additional details..."
                                value={form.notes}
                                onChange={e => setForm({ ...form, notes: e.target.value })}
                            />
                        </div>

                        <div className="flex gap-3 justify-end pt-4 border-t border-white/10 mt-6">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={saving} className="border-antique-gold/40 text-antique-gold hover:bg-antique-gold/10">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-medium">
                                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin text-deep-emerald" /> Saving...</> : 'Record Payment'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
