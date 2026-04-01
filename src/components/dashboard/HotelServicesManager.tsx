'use client';

import { useMemo, useState } from 'react';
import { DollarSign, Loader2, Pencil, Save, Tag, Trash2, X } from 'lucide-react';
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
        <div className="grid gap-3 md:grid-cols-2">
            {services.map((service) => {
                const serviceName = service.serviceName || service.name || 'Service';
                const serviceBlocks = blockMap[service._id] || [];
                const isEditing = editingId === service._id;

                return (
                    <div key={service._id} className="px-4 py-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] transition-all duration-300">
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
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/55 hover:text-white/75 transition-all"
                                    >
                                        <X className="h-3.5 w-3.5" />
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleSave(service._id)}
                                        disabled={saving}
                                        className="inline-flex items-center gap-1 rounded-lg border border-antique-gold/25 bg-antique-gold/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-antique-gold hover:bg-antique-gold/15 transition-all disabled:opacity-60"
                                    >
                                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Tag className="h-3.5 w-3.5 text-white/30" />
                                        <p className="text-sm font-medium text-white/85">{serviceName}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-antique-gold/10 px-2.5 py-1 rounded-lg border border-antique-gold/20">
                                            <DollarSign className="h-3 w-3 text-antique-gold" />
                                            <span className="text-sm font-bold text-antique-gold">{service.rate}</span>
                                        </div>
                                        <span className={`status-pill ${service.isActive === false ? 'status-pill-warning' : 'status-pill-success'}`}>
                                            {service.isActive === false ? 'Inactive' : 'Active'}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] text-white/40 mb-2">
                                    {service.unit} · {(service.partnerId as { name?: string })?.name || 'Partner'}
                                </p>
                                {service.description ? (
                                    <p className="text-xs text-white/50 mb-4">{service.description}</p>
                                ) : null}

                                <div className="mb-4 flex items-center justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => startEditing(service)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-antique-gold transition-all"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(service._id)}
                                        disabled={deletingId === service._id}
                                        className="inline-flex items-center gap-1 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-red-300 hover:bg-red-500/15 transition-all disabled:opacity-60"
                                    >
                                        {deletingId === service._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        Delete
                                    </button>
                                </div>

                                <div className="pt-4 border-t border-white/[0.06]">
                                    <ServiceBlockManager serviceId={service._id} initialBlocks={serviceBlocks as any} hideTitle={true} />
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
