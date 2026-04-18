'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Pencil, Save, Trash2, X } from 'lucide-react';
import { formatLKR } from '@/lib/currency';
import ServiceBlockManager from '@/components/dashboard/ServiceBlockManager';

interface ServiceRecord {
    _id: string;
    serviceName?: string;
    name?: string;
    rate: number;
    unit: string;
    description?: string;
    isActive?: boolean;
    partnerId?: { name?: string } | string;
}

interface BlockRecord {
    _id: string;
    serviceId: string;
    from: string;
    to: string;
    reason: string;
}

const UNIT_LABELS: Record<string, string> = {
    PER_DAY: 'per day',
    PER_NIGHT: 'per night',
    PER_TRIP: 'per trip',
    PER_PERSON: 'per person',
    FLAT: 'flat',
};

export default function HotelServicesManager({
    initialServices,
    initialBlocks,
}: {
    initialServices: ServiceRecord[];
    initialBlocks: BlockRecord[];
}) {
    const [services, setServices] = useState(initialServices);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [saveError, setSaveError] = useState('');
    const [draft, setDraft] = useState({
        serviceName: '',
        rate: '',
        unit: 'PER_NIGHT',
        description: '',
        isActive: 'true',
    });

    const blockMap = useMemo(() => {
        return initialBlocks.reduce<Record<string, BlockRecord[]>>((acc, block) => {
            if (!acc[block.serviceId]) acc[block.serviceId] = [];
            acc[block.serviceId].push(block);
            return acc;
        }, {});
    }, [initialBlocks]);

    const startEditing = (service: ServiceRecord) => {
        setEditingId(service._id);
        setSaveError('');
        setDraft({
            serviceName: service.serviceName || service.name || '',
            rate: String(service.rate || 0),
            unit: service.unit || 'PER_NIGHT',
            description: service.description || '',
            isActive: service.isActive === false ? 'false' : 'true',
        });
    };

    const handleSave = async (serviceId: string) => {
        const rateNum = Number(draft.rate);
        if (!draft.serviceName.trim()) { setSaveError('Service name is required.'); return; }
        if (isNaN(rateNum) || rateNum < 0) { setSaveError('Enter a valid rate (LKR).'); return; }

        setSaving(true);
        setSaveError('');
        try {
            const response = await fetch(`/api/partner-services/${serviceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceName: draft.serviceName.trim(),
                    rate: rateNum,
                    unit: draft.unit,
                    description: draft.description.trim(),
                    isActive: draft.isActive === 'true',
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                setSaveError(data.error || 'Unable to update this service right now.');
                return;
            }

            setServices((current) =>
                current.map((service) =>
                    service._id === serviceId ? { ...service, ...data.service } : service
                )
            );
            setEditingId(null);
        } catch {
            setSaveError('Network error — changes were not saved.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Delete this service and hide it from future assignments?')) return;
        setDeletingId(serviceId);
        try {
            const response = await fetch(`/api/partner-services/${serviceId}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                alert(data.error || 'Unable to delete this service right now.');
                return;
            }
            setServices((current) => current.filter((service) => service._id !== serviceId));
        } catch {
            alert('Network error — service was not deleted.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => {
                const serviceName = service.serviceName || service.name || 'Service';
                const serviceBlocks = blockMap[service._id] || [];
                const isEditing = editingId === service._id;
                const isActive = service.isActive !== false;

                return (
                    <div
                        key={service._id}
                        className="flex flex-col rounded-2xl border border-white/[0.05] bg-white/[0.03] hover:bg-white/[0.045] overflow-hidden transition-all"
                    >
                        {/* Card header */}
                        <div className="px-5 pt-5">
                            {isEditing ? (
                                /* ── Edit Mode ────────────────────────────── */
                                <div className="space-y-3">
                                    {/* Service name */}
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Service Name</label>
                                        <input
                                            value={draft.serviceName}
                                            onChange={(e) => setDraft((d) => ({ ...d, serviceName: e.target.value }))}
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-antique-gold/40 focus:outline-none"
                                            placeholder="e.g. Deluxe Room, Airport Transfer"
                                        />
                                    </div>

                                    {/* Rate + Unit */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Rate (LKR)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={draft.rate}
                                                onChange={(e) => setDraft((d) => ({ ...d, rate: e.target.value }))}
                                                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-antique-gold/40 focus:outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Unit</label>
                                            <select
                                                value={draft.unit}
                                                onChange={(e) => setDraft((d) => ({ ...d, unit: e.target.value }))}
                                                className="w-full rounded-lg border border-white/10 bg-[#0f1a14] px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                            >
                                                {Object.entries(UNIT_LABELS).map(([key, label]) => (
                                                    <option key={key} value={key} className="bg-[#0f1a14] text-white">{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Description</label>
                                        <textarea
                                            value={draft.description}
                                            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                                            className="min-h-[72px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/20 focus:border-antique-gold/40 focus:outline-none resize-none"
                                            placeholder="Brief description of this service…"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-wider font-medium mb-1 block">Status</label>
                                        <select
                                            value={draft.isActive}
                                            onChange={(e) => setDraft((d) => ({ ...d, isActive: e.target.value }))}
                                            className="w-full rounded-lg border border-white/10 bg-[#0f1a14] px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                        >
                                            <option value="true" className="bg-[#0f1a14] text-white">Active</option>
                                            <option value="false" className="bg-[#0f1a14] text-white">Inactive</option>
                                        </select>
                                    </div>

                                    {/* Error */}
                                    {saveError && (
                                        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-[11px] text-red-400">
                                            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                                            {saveError}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pb-5 mt-1">
                                        <button
                                            type="button"
                                            onClick={() => { setEditingId(null); setSaveError(''); }}
                                            className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.15em] text-white/60 hover:text-white hover:bg-white/5 transition-all"
                                        >
                                            <X className="h-3.5 w-3.5" />
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleSave(service._id)}
                                            disabled={saving}
                                            className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-3 py-2 text-[11px] uppercase font-bold tracking-[0.15em] text-[#08110d] hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all disabled:opacity-60"
                                        >
                                            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                            Save
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* ── View Mode ────────────────────────────── */
                                <div>
                                    {/* Name + status badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <h3 className="text-base font-bold text-white tracking-tight leading-tight">{serviceName}</h3>
                                        <div
                                            className={`ml-3 flex-shrink-0 flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-widest ${
                                                isActive
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}
                                        >
                                            <span className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                            {isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-baseline gap-1.5 mb-2">
                                        <span className="text-xl font-bold text-antique-gold">{formatLKR(service.rate)}</span>
                                        <span className="text-[10px] text-white/40 uppercase tracking-widest">
                                            {UNIT_LABELS[service.unit] ?? service.unit}
                                        </span>
                                    </div>

                                    {/* Partner label */}
                                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2 font-medium">
                                        {(service.partnerId as { name?: string })?.name || 'Hotel Partner'}
                                    </p>

                                    {/* Description */}
                                    {service.description && (
                                        <p className="text-[12px] text-white/55 line-clamp-2 mb-4 leading-relaxed">
                                            {service.description}
                                        </p>
                                    )}

                                    {/* Action buttons */}
                                    <div className="flex gap-2 mb-5">
                                        <button
                                            type="button"
                                            onClick={() => startEditing(service)}
                                            className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-white/15 text-white/70 hover:text-white hover:bg-white/[0.04] hover:border-white/30 h-9 transition-all text-[11px] font-medium uppercase tracking-widest"
                                        >
                                            <Pencil className="h-3 w-3" />
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(service._id)}
                                            disabled={deletingId === service._id}
                                            className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 h-9 text-[11px] font-medium text-red-400/80 hover:text-red-400 transition-all uppercase tracking-widest disabled:opacity-60"
                                        >
                                            {deletingId === service._id
                                                ? <Loader2 className="h-3 w-3 animate-spin" />
                                                : <Trash2 className="h-3 w-3" />
                                            }
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Service block sub-panel (always visible) */}
                        {!isEditing && (
                            <div className="border-t border-white/[0.05] bg-black/10 px-5 py-4">
                                {serviceBlocks.length > 0 && (
                                    <div className="flex items-center gap-1.5 mb-3">
                                        <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-400">
                                            {serviceBlocks.length} Block{serviceBlocks.length > 1 ? 's' : ''} Active
                                        </span>
                                    </div>
                                )}
                                <ServiceBlockManager
                                    serviceId={service._id}
                                    initialBlocks={serviceBlocks as any}
                                    hideTitle={true}
                                />
                            </div>
                        )}

                        {/* Success indicator when not editing */}
                        {!isEditing && serviceBlocks.length === 0 && (
                            <div className="px-5 pb-4 -mt-2">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-400/50" />
                                    <span className="text-[10px] text-white/25">Fully available</span>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
