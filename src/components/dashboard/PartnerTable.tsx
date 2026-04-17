'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, CheckCircle, Search, UserCheck, Handshake, Building2, Compass, Car, UtensilsCrossed } from 'lucide-react';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<string>('ALL');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this partner?')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/partners/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setPartners((prev) => prev.filter((p) => p._id !== id));
                router.refresh();
            } else {
                alert('Failed to delete partner');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting partner');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Approve this partner? It will become active immediately.')) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/partners/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: PartnerStatus.ACTIVE })
            });
            if (res.ok) {
                setPartners((prev) => prev.map(p => p._id === id ? { ...p, status: PartnerStatus.ACTIVE } : p));
                router.refresh();
            } else {
                alert('Failed to approve partner');
            }
        } catch (error) {
            console.error(error);
            alert('Error approving partner');
        } finally {
            setLoading(false);
        }
    };

    const filteredPartners = useMemo(() => {
        return partners.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.contactPerson && p.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (p.email && p.email.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesType = selectedType === 'ALL' || p.type === selectedType;
            return matchesSearch && matchesType;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [partners, searchQuery, selectedType]);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'GUIDE': return <Compass className="w-5 h-5 text-purple-400" />;
            case 'HOTEL': return <Building2 className="w-5 h-5 text-blue-400" />;
            case 'DRIVER': return <Car className="w-5 h-5 text-blue-400" />;
            case 'RESTAURANT': return <UtensilsCrossed className="w-5 h-5 text-gold-400" />;
            default: return <Handshake className="w-5 h-5 text-white/50" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case PartnerStatus.ACTIVE: return 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30';
            case PartnerStatus.PENDING_APPROVAL: return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
            case PartnerStatus.REJECTED: return 'text-red-300 bg-red-500/15 border-red-500/30';
            default: return 'text-white/60 bg-white/10 border-white/20';
        }
    };

    const tabs = [
        { label: 'All Partners', value: 'ALL' },
        { label: 'Guides', value: 'GUIDE' },
        { label: 'Hotels', value: 'HOTEL' },
        { label: 'Drivers', value: 'DRIVER' },
        { label: 'Restaurants', value: 'RESTAURANT' },
    ];

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Toolbar: Search and Filter Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 liquid-glass-panel p-4 rounded-2xl border border-white/[0.05]">
                <div className="relative w-full lg:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                        type="text"
                        placeholder="Search partners by name, contact, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/20 border border-white/[0.08] text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-antique-gold/20 transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSelectedType(tab.value)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${selectedType === tab.value
                                    ? 'bg-antique-gold/20 border-antique-gold/40 text-antique-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                                    : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Partner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPartners.length > 0 ? (
                    filteredPartners.map((partner) => (
                        <div
                            key={partner._id}
                            className="group relative overflow-hidden rounded-3xl h-[260px] bg-[#0A0F11] border border-white/[0.08] hover:border-antique-gold/30 transition-all duration-500 shadow-xl"
                        >
                            {/* Abstract gradient background based on type */}
                            <div className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-antique-gold/30 to-transparent blur-3xl rounded-full translate-x-10 -translate-y-10" />
                                <div className="absolute left-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/20 to-transparent blur-2xl rounded-full -translate-x-5 translate-y-5" />
                            </div>

                            <div className="relative p-6 h-full flex flex-col justify-between z-10">
                                {/* Top Header: Icon & Status */}
                                <div className="flex items-start justify-between">
                                    <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                                        {getTypeIcon(partner.type)}
                                    </div>
                                    <span className={`inline-flex px-3 py-1.5 text-[9px] tracking-[0.15em] shadow-sm uppercase font-medium rounded-full border ${getStatusStyle(partner.status)}`}>
                                        {partner.status.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Main Info */}
                                <div className="mt-4 flex-1">
                                    <h3 className="text-xl font-serif text-white mb-1 group-hover:text-antique-gold transition-colors duration-300 line-clamp-1">
                                        {partner.name}
                                    </h3>
                                    {partner.contactPerson && (
                                        <p className="text-xs text-white/50 font-medium flex items-center gap-1.5 mt-2">
                                            <UserCheck className="w-3.5 h-3.5" />
                                            {partner.contactPerson}
                                        </p>
                                    )}
                                    {(partner.email || partner.phone) && (
                                        <div className="flex flex-col gap-1 mt-3">
                                            {partner.email && (
                                                <p className="text-[11px] text-white/40 truncate">
                                                    {partner.email}
                                                </p>
                                            )}
                                            {partner.phone && (
                                                <p className="text-[11px] text-white/40 font-mono">
                                                    {partner.phone}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hover Actions Panel */}
                            <div className="absolute top-0 right-0 h-full w-16 bg-black/80 backdrop-blur-md border-l border-white/10 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0 transition-all duration-300 z-20">
                                {partner.status === 'PENDING_APPROVAL' && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-10 w-10 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/20 rounded-full shrink-0"
                                        onClick={(e) => handleApprove(partner._id, e)}
                                        title="Approve Partner"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 text-white hover:text-blue-400 hover:bg-white/10 rounded-full shrink-0"
                                    onClick={() => router.push(`/dashboard/partners/${partner._id}`)}
                                    title="Edit Partner"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-10 w-10 text-white hover:text-red-400 hover:bg-red-400/20 rounded-full shrink-0"
                                    onClick={(e) => handleDelete(partner._id, e)}
                                    title="Delete Partner"
                                    disabled={loading}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center flex flex-col items-center justify-center liquid-glass-panel rounded-3xl border border-white/[0.05]">
                        <div className="h-20 w-20 mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                            <Handshake className="h-8 w-8 text-white/30" />
                        </div>
                        <h3 className="text-xl font-serif text-white/90 mb-2">No partners found</h3>
                        <p className="text-sm text-white/40 max-w-md">
                            {searchQuery.trim() || selectedType !== 'ALL'
                                ? `We couldn't find any partners matching your criteria. Try adjusting your search or filters.`
                                : 'You haven\'t added any partners yet. Click "Add Partner" to get started.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
