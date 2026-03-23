'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AssignVehicleModal({ 
    bookingId, 
    currentVehicleId,
    vehicles 
}: { 
    bookingId: string; 
    currentVehicleId?: string;
    vehicles: { _id: string; model: string; type: string; seats: number }[];
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(currentVehicleId || '');
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!selectedVehicle) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignedVehicleId: selectedVehicle }),
            });
            if (res.ok) {
                // Update status to ASSIGNED if changing assignment or something, 
                // but the API assigning vehicle updates assignedVehicleId
                await fetch(`/api/bookings/${bookingId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'ASSIGNED' }),
                });

                setIsOpen(false);
                router.refresh();
            } else {
                alert('Failed to assign vehicle');
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
                className="w-full mt-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium py-2 px-4 rounded-lg transition-colors border border-emerald-500/30 text-sm"
            >
                Assign Vehicle
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0f1115] border border-white/[0.08] rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                <h3 className="text-lg font-display font-semibold text-off-white mb-4">Assign Vehicle</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Vehicle</label>
                        <select
                            value={selectedVehicle}
                            onChange={e => setSelectedVehicle(e.target.value)}
                            className="w-full bg-black/40 border border-white/[0.12] rounded-xl px-4 py-3 text-off-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 appearance-none"
                        >
                            <option value="">-- Choose a vehicle --</option>
                            {vehicles.map(v => (
                                <option key={v._id} value={v._id}>
                                    {v.model} ({v.type}, {v.seats} seats)
                                </option>
                            ))}
                        </select>
                    </div>
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
                        disabled={saving || !selectedVehicle}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Assign'}
                    </button>
                </div>
            </div>
        </div>
    );
}
