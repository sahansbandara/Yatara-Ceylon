'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FinalizePricingModal({ bookingId, currentTotalCost }: { bookingId: string; currentTotalCost: number }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [totalCost, setTotalCost] = useState(currentTotalCost || 0);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}/finalize-pricing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ totalCost: Number(totalCost) }),
            });
            if (res.ok) {
                setIsOpen(false);
                router.refresh();
            } else {
                const data = await res.json();
                alert(data.error || 'Failed to finalize pricing');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full mt-2 bg-antique-gold/10 hover:bg-antique-gold/20 text-antique-gold font-medium py-2 px-4 rounded-lg transition-colors border border-antique-gold/30 text-sm"
            >
                Finalize Pricing
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f1115] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                <h3 className="text-lg font-display font-semibold text-off-white mb-4">Finalize Pricing</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Total Cost (LKR)</label>
                        <input
                            type="number"
                            value={totalCost}
                            onChange={e => setTotalCost(Number(e.target.value))}
                            className="w-full bg-black/40 border border-white/[0.12] rounded-xl px-4 py-3 text-off-white focus:outline-none focus:ring-2 focus:ring-antique-gold/30 focus:border-antique-gold/30"
                            placeholder="Enter final cost"
                        />
                    </div>
                    {totalCost > 0 && (
                        <div className="bg-antique-gold/5 border border-antique-gold/20 rounded-xl p-3 text-center">
                            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">20% Advance Required</p>
                            <p className="text-lg font-bold text-antique-gold">LKR {Math.round(totalCost * 0.2).toLocaleString()}</p>
                            <p className="text-[10px] text-white/30 mt-1">Customer will be notified via email</p>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex gap-3 justify-end">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white/70 hover:bg-white/5 transition-colors"
                        disabled={saving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || totalCost <= 0}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-antique-gold text-black hover:bg-yellow-600 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Processing...' : 'Finalize & Notify Customer'}
                    </button>
                </div>
            </div>
        </div>
    );
}
