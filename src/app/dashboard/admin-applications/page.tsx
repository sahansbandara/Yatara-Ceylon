'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, XCircle, Building2, Car, ExternalLink, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/partner-requests');
            if (res.ok) {
                const data = await res.json();
                setApplications(data.data);
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
                // Remove it from the live UI if approved or rejected so it clears the queue (optional: or just update status)
                setApplications(prev => prev.map(app => app._id === id ? { ...app, status } : app));
            } else {
                alert('Action failed. Please try again.');
            }
        } catch (error) {
            console.error('Failed rule execution', error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <Loader2 className="w-8 h-8 text-antique-gold animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-antique-gold tracking-wide mb-1">Partner Applications</h1>
                    <p className="text-sm text-white/50">Review incoming requests to join the Yatara network</p>
                </div>
                <Button
                    onClick={fetchApplications}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 shrink-0 gap-2 h-10 px-4 rounded-xl"
                >
                    <RefreshCcw className="w-4 h-4" /> Refresh List
                </Button>
            </div>

            {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                    <p className="text-white/40 text-sm">No applications in the queue.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app._id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-antique-gold/20 transition-all duration-300">

                            {/* Header row */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 border-b border-white/5 pb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${app.requestType === 'VEHICLE_OWNER' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {app.requestType === 'VEHICLE_OWNER' ? <Car className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">{app.businessName}</h3>
                                        <div className="flex items-center gap-2 text-xs text-white/40 mt-1">
                                            <span className="font-medium text-antique-gold">{app.requestType === 'VEHICLE_OWNER' ? 'Fleet' : 'Hotel'} Request</span>
                                            <span>•</span>
                                            <span>Submitted {new Date(app.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between md:justify-end gap-3">
                                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border
                                        ${app.status === 'PENDING' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            app.status === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                    >
                                        {app.status}
                                    </div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                {/* Applicant Data */}
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Original Applicant</p>
                                    <p className="text-sm text-white/90">{app.userId.name}</p>
                                    <p className="text-xs text-white/60">{app.userId.email}</p>
                                    <p className="text-xs text-white/60">{app.userId.phone || 'No direct DB phone attached'}</p>
                                </div>

                                {/* Form Provided Data */}
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Business Connectivity</p>
                                    <p className="text-sm text-white/90">Contact: {app.contactNumber}</p>
                                    {app.verificationLink && (
                                        <a href={app.verificationLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors w-fit">
                                            <ExternalLink className="w-3.5 h-3.5" /> Check Digital Profile
                                        </a>
                                    )}
                                </div>

                                {/* Type Specific Data */}
                                <div className="space-y-1">
                                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold mb-2">Technical Specifics</p>
                                    {app.requestType === 'VEHICLE_OWNER' && app.vehicleDetails ? (
                                        <>
                                            <p className="text-sm text-white/90">{app.vehicleDetails.brand} {app.vehicleDetails.model}</p>
                                            <p className="text-xs text-white/50 tracking-wider">Reg: {app.vehicleDetails.vehicleNumber}</p>
                                        </>
                                    ) : app.requestType === 'HOTEL_OWNER' && app.hotelDetails ? (
                                        <p className="text-sm text-white/90 truncate pr-4" title={app.hotelDetails.location}>{app.hotelDetails.location}</p>
                                    ) : (
                                        <p className="text-xs text-white/40 italic">Incomplete submission data</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons (Only if pending) */}
                            {app.status === 'PENDING' && (
                                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                                    <Button
                                        onClick={() => handleAction(app._id, 'APPROVED')}
                                        disabled={actionLoading === app._id}
                                        className="flex-1 sm:flex-none bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 h-10 px-6 rounded-xl font-bold text-xs tracking-wider transition-all"
                                    >
                                        {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                        Approve Elevation
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(app._id, 'REJECTED')}
                                        disabled={actionLoading === app._id}
                                        className="flex-1 sm:flex-none bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 h-10 px-6 rounded-xl font-bold text-xs tracking-wider transition-all"
                                    >
                                        {actionLoading === app._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                                        Reject Request
                                    </Button>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
