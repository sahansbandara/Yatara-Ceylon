'use client';

import { useMemo, useState } from 'react';
import { Loader2, Pencil, Save, Tag, Trash2, X } from 'lucide-react';
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
        setDraft({
            serviceName: service.serviceName || service.name || '',
            rate: String(service.rate || 0),
            unit: service.unit || 'PER_NIGHT',
            description: service.description || '',
            isActive: service.isActive === false ? 'false' : 'true',
        });
    };

    const handleSave = async (serviceId: string) => {
        setSaving(true);
        try {
            const response = await fetch(`/api/partner-services/${serviceId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceName: draft.serviceName,
                    rate: Number(draft.rate),
                    unit: draft.unit,
                    description: draft.description,
                    isActive: draft.isActive === 'true',
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Unable to update this service right now.');
                return;
            }

            setServices((current) => current.map((service) => (
                service._id === serviceId
                    ? { ...service, ...data.service }
                    : service
            )));
            setEditingId(null);
        } catch (error) {
            console.error(error);
            alert('Unable to update this service right now.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('Delete this service and hide it from future assignments?')) return;
        setDeletingId(serviceId);

        try {
            const response = await fetch(`/api/partner-services/${serviceId}`, {
                method: 'DELETE',
            });
            const data = await response.json();

            if (!response.ok) {
                alert(data.error || 'Unable to delete this service right now.');
                return;
            }

            setServices((current) => current.filter((service) => service._id !== serviceId));
        } catch (error) {
            console.error(error);
            alert('Unable to delete this service right now.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
                const serviceName = service.serviceName || service.name || 'Service';
                const serviceBlocks = blockMap[service._id] || [];
                const isEditing = editingId === service._id;

                return (
                    <div key={service._id} className="px-5 py-6 rounded-2xl liquid-glass-card-dark h-full flex flex-col focus-within:ring-1 focus-within:ring-antique-gold/30">
                        {isEditing ? (
                            <div className="space-y-3">
                                <input
                                    value={draft.serviceName}
                                    onChange={(event) => setDraft((current) => ({ ...current, serviceName: event.target.value }))}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                    placeholder="Service name"
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="number"
                                        min="0"
                                        value={draft.rate}
                                        onChange={(event) => setDraft((current) => ({ ...current, rate: event.target.value }))}
                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                        placeholder="Rate"
                                    />
                                    <select
                                        value={draft.unit}
                                        onChange={(event) => setDraft((current) => ({ ...current, unit: event.target.value }))}
                                        className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                    >
                                        {['PER_DAY', 'PER_TRIP', 'PER_PERSON', 'PER_NIGHT', 'FLAT'].map((unit) => (
                                            <option key={unit} value={unit} className="bg-[#08110d]">{unit}</option>
                                        ))}
                                    </select>
                                </div>
                                <textarea
                                    value={draft.description}
                                    onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                                    className="min-h-[84px] w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                    placeholder="Description"
                                />
                                <select
                                    value={draft.isActive}
                                    onChange={(event) => setDraft((current) => ({ ...current, isActive: event.target.value }))}
                                    className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white focus:border-antique-gold/40 focus:outline-none"
                                >
                                    <option value="true" className="bg-[#08110d]">Active</option>
                                    <option value="false" className="bg-[#08110d]">Inactive</option>
                                </select>
                                <div className="flex items-center justify-end gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-white hover:bg-white/5 transition-all"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSave(service._id)}
                                        disabled={saving}
                                        className="flex-1 inline-flex justify-center items-center gap-1 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] px-3 py-2 text-[11px] uppercase font-bold tracking-[0.18em] text-[#08110d] hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all disabled:opacity-60"
                                    >
                                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{serviceName}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg font-bold text-antique-gold">{formatLKR(service.rate)}</span>
                                            <span className="text-[10px] text-white/50 uppercase tracking-widest">/{service.unit.replace('PER_', '')}</span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${service.isActive === false ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${service.isActive === false ? 'bg-amber-500' : 'bg-emerald-400'}`}></span>
                                            {service.isActive === false ? 'Inactive' : 'Active'}
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-[11px] text-white/40 mb-2 uppercase tracking-wide font-medium">
                                    {(service.partnerId as { name?: string })?.name || 'Hotel Partner'}
                                </p>
                                {service.description && (
                                    <p className="text-[13px] text-white/60 mb-5 line-clamp-2 min-h-[39px]">{service.description}</p>
                                )}

                                <div className="flex gap-3 w-full mb-6 mt-auto">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(service)}
                                        className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-white/20 text-white/80 hover:text-white hover:bg-white/5 hover:border-white/40 h-9 transition-all text-[11px] font-medium uppercase tracking-widest"
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Edit Details
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(service._id)}
                                        disabled={deletingId === service._id}
                                        className="flex-1 inline-flex justify-center items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500/30 h-9 text-[11px] font-medium text-red-400 hover:text-red-300 transition-all uppercase tracking-widest disabled:opacity-60"
                                    >
                                        {deletingId === service._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                                        Remove 
                                    </button>
                                </div>

                                <div className="pt-5 border-t border-white/[0.06] mt-auto">
                                    <ServiceBlockManager serviceId={service._id} initialBlocks={serviceBlocks as any} hideTitle={true} />
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
