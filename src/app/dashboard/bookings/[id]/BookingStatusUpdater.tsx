'use client';

import { useState } from 'react';

const STATUSES = ['NEW', 'PAYMENT_PENDING', 'CONTACTED', 'ADVANCE_PAID', 'CONFIRMED', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

export default function BookingStatusUpdater({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [saving, setSaving] = useState(false);

    const handleUpdate = async (newStatus: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setStatus(newStatus);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={status}
                onChange={e => handleUpdate(e.target.value)}
                disabled={saving}
                className="text-xs border border-white/[0.12] rounded-lg px-3 py-2 bg-white/[0.06] text-white/80 focus:outline-none focus:ring-2 focus:ring-antique-gold/30 focus:border-antique-gold/30 disabled:opacity-50 appearance-none"
            >
                {STATUSES.map(s => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
            </select>
            {saving && <span className="text-[10px] text-gray-400">Saving...</span>}
        </div>
    );
}
