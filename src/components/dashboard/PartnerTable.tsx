'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { PartnerStatus } from '@/lib/constants';

interface Partner {
    _id: string;
    type: string;
    name: string;
    contactPerson?: string;
    phone: string;
    email?: string;
    status: string;
}

interface PartnerTableProps {
    initialPartners: Partner[];
}

export default function PartnerTable({ initialPartners }: PartnerTableProps) {
    const [partners, setPartners] = useState<Partner[]>(initialPartners);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this partner?')) return;
        try {
            const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPartners(partners.filter((p) => p._id !== id));
                router.refresh();
            } else {
                alert('Failed to delete partner');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting partner');
        }
    };

    const handleApprove = async (id: string) => {
        if (!confirm('Approve this partner? It will become active immediately.')) return;
        try {
            const res = await fetch(`/api/partners/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: PartnerStatus.ACTIVE })
            });
            if (res.ok) {
                setPartners(partners.map(p => p._id === id ? { ...p, status: PartnerStatus.ACTIVE } : p));
                router.refresh();
            } else {
                alert('Failed to approve partner');
            }
        } catch (error) {
            console.error(error);
            alert('Error approving partner');
        }
    };

    const getTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            GUIDE: 'status-pill-purple',
            HOTEL: 'status-pill-info',
            DRIVER: 'status-pill-info',
            RESTAURANT: 'status-pill-gold',
            OTHER: 'status-pill-neutral',
        };
        return colors[type] || 'status-pill-neutral';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case PartnerStatus.ACTIVE: return 'status-pill-success';
            case PartnerStatus.INACTIVE: return 'status-pill-neutral';
            case PartnerStatus.PENDING_APPROVAL: return 'status-pill-warning';
            case PartnerStatus.REJECTED: return 'status-pill-danger';
            default: return 'status-pill-neutral';
        }
    };

    return (
        <div className="dashboard-table-glass overflow-hidden rounded-2xl w-full">
            <div className="overflow-x-auto w-full">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-white/[0.03] border-b border-white/[0.06]">
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Name</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Type</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Contact</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Phone</th>
                            <th className="text-left px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Status</th>
                            <th className="text-right px-5 py-3.5 text-[10px] tracking-[0.15em] uppercase text-white/30 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.length > 0 ? (
                            partners.map((partner) => (
                                <tr key={partner._id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-antique-gold/[0.03] transition-colors">
                                    <td className="px-5 py-3.5 font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-white/85 text-xs">{partner.name}</span>
                                            {partner.email && (
                                                <span className="text-[10px] text-white/35 mt-0.5">{partner.email}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`status-pill ${getTypeColor(partner.type)}`}>
                                            {partner.type}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/60 text-xs">{partner.contactPerson || '—'}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-white/70 text-xs">{partner.phone}</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`status-pill ${getStatusColor(partner.status)}`}>
                                            {partner.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex justify-end gap-2">
                                            {partner.status === 'PENDING_APPROVAL' && (
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 transition-colors"
                                                    onClick={() => handleApprove(partner._id)}
                                                    title="Approve Partner"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-antique-gold hover:bg-white/10 transition-colors"
                                                onClick={() => router.push(`/dashboard/partners/${partner._id}`)}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-8 w-8 text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                                onClick={() => handleDelete(partner._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-5 py-12 text-center text-white/40 text-sm">
                                    No partners found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
