'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { Loader2, Bus } from 'lucide-react';

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
                // Optionally update status
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

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger asChild>
                <button className="w-full mt-4 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-[11px] uppercase tracking-widest py-3 px-4 rounded-xl transition-all border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <Bus className="h-4 w-4" />
                    Assign Vehicle
                </button>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 transition-opacity" />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
                    <Dialog.Content className="pointer-events-auto relative w-full max-w-[450px] max-h-[90vh] overflow-y-auto rounded-[2rem] bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-[0_0_40px_rgba(16,185,129,0.05)] p-8 outline-none text-off-white scrollbar-glass-dark">
                        <Dialog.Title className="text-xl font-display font-semibold text-emerald-500 mb-1 tracking-wide">
                            Assign Vehicle
                        </Dialog.Title>
                        <Dialog.Description className="text-sm text-white/40 mb-8 font-light">
                            Select an available vehicle from the fleet to assign to this booking.
                        </Dialog.Description>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Available Vehicles</label>
                                <select
                                    value={selectedVehicle}
                                    onChange={e => setSelectedVehicle(e.target.value)}
                                    className="w-full bg-black/20 border border-white/[0.12] rounded-xl px-4 py-3 text-off-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/30 appearance-none"
                                >
                                    <option value="" className="bg-[#0f1115] text-white/50">-- Choose a vehicle --</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id} className="bg-[#0f1115] text-white">
                                            {v.model} ({v.type}, {v.seats} seats)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-end pt-8 mt-2">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-6 py-2.5 rounded-xl text-sm font-medium border border-white/20 text-white/80 hover:bg-white/10 transition-colors"
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !selectedVehicle}
                                className="px-8 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                            >
                                {saving ? <><Loader2 className="h-4 w-4 animate-spin mr-2"/> Saving</> : 'Confirm Assignment'}
                            </button>
                        </div>
                    </Dialog.Content>
                </div>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
