'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Building2, Car, ExternalLink, RefreshCcw, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHero } from '@/components/dashboard/DashboardHero';
import { StatCard } from '@/components/dashboard/StatCard';
import { GlassPanel } from '@/components/dashboard/GlassPanel';

interface LocationObject {
    location?: string;
}

interface VehicleObject {
    brand?: string;
    model?: string;
    vehicleNumber?: string;
}

interface Application {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    requestType: 'VEHICLE_OWNER' | 'HOTEL_OWNER';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    businessName: string;
    contactNumber: string;
    verificationLink?: string;
    vehicleDetails?: VehicleObject;
    hotelDetails?: LocationObject;
    createdAt: string;
}

// Skeleton Card for loading state
function ApplicationSkeleton() {
    return (
        <div className="liquid-glass-stat-dark p-6 rounded-2xl animate-pulse">
            <div className="h-6 bg-white/10 rounded w-1/3 mb-4" />
            <div className="h-4 bg-white/10 rounded w-1/2 mb-3" />
            <div className="grid grid-cols-3 gap-4">
                <div className="h-4 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded" />
                <div className="h-4 bg-white/10 rounded" />
            </div>
        </div>
    );
}

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/partner-requests');
            if (res.ok) {
                const data = await res.json();
                setApplications(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch applications', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        if (!confirm(`Are you sure you want to ${status.toLowerCase()} this application? This action cannot be undone.`)) return;

        setActionLoading(id);
        try {
            const res = await fetch(`/api/partner-requests/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
            } else {
                alert('Action failed. Please try again.');
            }
        } catch (error) {
            console.error('Failed to update application', error);
            alert('Error updating application');
        } finally {
            setActionLoading(null);
        }
    };

    // Calculate stats
    const stats = {
        pending: applications.filter(a => a.status === 'PENDING').length,
        approved: applications.filter(a => a.status === 'APPROVED').length,
        rejected: applications.filter(a => a.status === 'REJECTED').length,
    };

    // Filter applications
    const filteredApplications = applications.filter(app => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'pending') return app.status === 'PENDING';
        if (statusFilter === 'approved') return app.status === 'APPROVED';
        if (statusFilter === 'rejected') return app.status === 'REJECTED';
        return true;
    });

    return (
        <div className="flex flex-col gap-6 p-6">
            <DashboardHero
                title="Partner Applications"
                subtitle="Review incoming requests to join the Yatara network"
                action={
                    <Button
                        variant="glass-outline"
                        onClick={fetchApplications}
                        disabled={loading}
                        className="font-semibold text-antique-gold"
                    >
                        <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                }
            />

            {/* KPI Stats Row */}
            {!loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Pending Review"
                        value={String(stats.pending)}
                        icon={Inbox}
                        accentColor="text-amber-400"
                    />
                    <StatCard
                        title="Approved"
                        value={String(stats.approved)}
                        icon={CheckCircle2}
                        accentColor="text-emerald-400"
                    />
                    <StatCard
                        title="Rejected"
                        value={String(stats.rejected)}
                        icon={XCircle}
                        accentColor="text-red-400"
                    />
                </div>
            )}

            {/* Status Tabs */}
            {!loading && (
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            statusFilter === 'all'
                                ? 'bg-antique-gold/10 border border-antique-gold/20 text-antique-gold'
                                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        All ({applications.length})
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            statusFilter === 'pending'
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        Pending ({stats.pending})
                    </button>
                    <button
                        onClick={() => setStatusFilter('approved')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            statusFilter === 'approved'
                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        Approved ({stats.approved})
                    </button>
                    <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            statusFilter === 'rejected'
                                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                                : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                    >
                        Rejected ({stats.rejected})
                    </button>
                </div>
            )}

            {/* Content Section */}
            <GlassPanel noPadding>
                {loading ? (
                    <div className="p-6 space-y-4">
                        <ApplicationSkeleton />
                        <ApplicationSkeleton />
                        <ApplicationSkeleton />
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <Inbox className="w-12 h-12 text-white/20 mb-4" />
                        <p className="text-white/50 text-sm">
                            {statusFilter === 'all'
                                ? 'No applications in the queue.'
                                : `No ${statusFilter} applications.`}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {filteredApplications.map((app) => (
                            <div key={app._id} className="p-6 hover:bg-white/[0.01] transition-colors duration-300">

                                {/* Header row */}
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl flex-shrink-0 ${app.requestType === 'VEHICLE_OWNER' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {app.requestType === 'VEHICLE_OWNER' ? <Car className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="text-base font-display font-semibold text-white tracking-tight">{app.businessName}</h3>
                                            <div className="flex items-center gap-2 text-xs text-white/40 mt-1 flex-wrap">
                                                <span className="font-medium text-antique-gold">{app.requestType === 'VEHICLE_OWNER' ? 'Fleet' : 'Hotel'} Request</span>
                                                <span>•</span>
                                                <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border flex-shrink-0 whitespace-nowrap
                                        ${app.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            app.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                    >
                                        {app.status}
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 pb-6 border-b border-white/5">
                                    {/* Applicant Data */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Applicant</p>
                                        <p className="text-sm text-white/90">{app.userId.name}</p>
                                        <p className="text-xs text-white/60">{app.userId.email}</p>
                                        {app.userId.phone && (
                                            <p className="text-xs text-white/60">{app.userId.phone}</p>
                                        )}
                                    </div>

                                    {/* Contact Data */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Business Contact</p>
                                        <p className="text-sm text-white/90">{app.contactNumber}</p>
                                        {app.verificationLink && (
                                            <a href={app.verificationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-2 transition-colors w-fit">
                                                <ExternalLink className="w-3.5 h-3.5" /> View Profile
                                            </a>
                                        )}
                                    </div>

                                    {/* Type Specific Data */}
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Details</p>
                                        {app.requestType === 'VEHICLE_OWNER' && app.vehicleDetails ? (
                                            <>
                                                <p className="text-sm text-white/90">{app.vehicleDetails.brand} {app.vehicleDetails.model}</p>
                                                <p className="text-xs text-white/50 tracking-wider">Reg: {app.vehicleDetails.vehicleNumber}</p>
                                            </>
                                        ) : app.requestType === 'HOTEL_OWNER' && app.hotelDetails ? (
                                            <p className="text-sm text-white/90 truncate" title={app.hotelDetails.location}>{app.hotelDetails.location}</p>
                                        ) : (
                                            <p className="text-xs text-white/40 italic">No details provided</p>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons (Only if pending) */}
                                {app.status === 'PENDING' && (
                                    <div className="flex flex-col sm:flex-row items-center gap-3">
                                        <Button
                                            onClick={() => handleAction(app._id, 'APPROVED')}
                                            disabled={actionLoading === app._id}
                                            className="flex-1 sm:flex-none bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 h-10 px-6 rounded-xl font-bold text-xs tracking-wider transition-all disabled:opacity-50"
                                        >
                                            {actionLoading === app._id ? (
                                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Approving...</>
                                            ) : (
                                                <><CheckCircle2 className="w-4 h-4 mr-2" /> Approve</>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => handleAction(app._id, 'REJECTED')}
                                            disabled={actionLoading === app._id}
                                            className="flex-1 sm:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 h-10 px-6 rounded-xl font-bold text-xs tracking-wider transition-all disabled:opacity-50"
                                        >
                                            {actionLoading === app._id ? (
                                                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Rejecting...</>
                                            ) : (
                                                <><XCircle className="w-4 h-4 mr-2" /> Reject</>
                                            )}
                                        </Button>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}
            </GlassPanel>
        </div>
    );
}
