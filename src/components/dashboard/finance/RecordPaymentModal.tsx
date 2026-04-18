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
                    paymentStage: 'FINAL',
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
                <Button className="w-full bg-antique-gold/10 hover:bg-antique-gold/20 border border-antique-gold/30 text-antique-gold font-semibold text-[11px] tracking-widest rounded-xl transition-all hover:scale-[1.02] py-5 gap-2 uppercase shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                    <Plus className="h-4 w-4" /> Record Payment
                </Button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                <Dialog.Content className="pointer-events-auto relative w-full max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[2rem] bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-[0_0_40px_rgba(212,175,55,0.05)] p-8 outline-none text-off-white scrollbar-glass-dark">
                    <Dialog.Title className="text-xl font-display font-semibold text-antique-gold mb-1 tracking-wide">
                        Record Manual Payment
                    </Dialog.Title>
                    <Dialog.Description className="text-sm text-white/40 mb-8 font-light">
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

                        <div className="flex gap-4 justify-end pt-6 border-t border-white/10 mt-8">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={saving} className="rounded-xl px-6 bg-transparent border border-white/20 text-white/80 hover:bg-white/10 hover:text-white">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving} className="rounded-xl px-8 bg-antique-gold hover:bg-antique-gold/90 text-deep-emerald font-semibold shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                                {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin text-deep-emerald" /> Saving...</> : 'Record Payment'}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
