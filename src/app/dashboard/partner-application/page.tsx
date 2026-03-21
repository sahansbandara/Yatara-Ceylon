'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Building2, Car, FileText, Link as LinkIcon, Loader2, Phone, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

type RequestType = 'VEHICLE_OWNER' | 'HOTEL_OWNER';

export default function PartnerApplicationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [requestType, setRequestType] = useState<RequestType | null>(null);
    const [businessName, setBusinessName] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [verificationLink, setVerificationLink] = useState('');

    // Specific Details
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [hotelLocation, setHotelLocation] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!requestType) {
            setError('Please select a partnership type');
            setLoading(false);
            return;
        }

        try {
            const payload: any = {
                requestType,
                businessName,
                contactNumber,
                verificationLink,
                documents: [] // Expand to file uploads later if needed
            };

            if (requestType === 'VEHICLE_OWNER') {
                payload.vehicleDetails = { brand, model, vehicleNumber };
            } else {
                payload.hotelDetails = { location: hotelLocation };
            }

            const res = await fetch('/api/partner-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to submit application');

            setSuccess(true);
            setTimeout(() => router.push('/dashboard/profile'), 4000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-emerald-600/20 blur-xl animate-pulse rounded-full" />
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-serif text-antique-gold">Application Submitted</h2>
                    <p className="text-white/60 max-w-md mx-auto text-sm">
                        Thank you for applying to join the Yatara Ceylon network. Our administration team will review your credentials shortly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-serif text-antique-gold tracking-wide mb-3">Partner Application</h1>
                <p className="text-white/50 text-sm max-w-lg mx-auto">
                    Elevate your business by joining our exclusive network. Please provide verifiable credentials for our review board.
                </p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 text-sm text-center font-medium">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Partnership Type */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold tracking-widest text-white/40 uppercase pl-1 flex items-center gap-2">
                        <span className="w-6 h-px bg-antique-gold/40"></span>
                        Partnership Type
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setRequestType('VEHICLE_OWNER')}
                            className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-300 group
                                ${requestType === 'VEHICLE_OWNER' ? 'bg-antique-gold/10 border-antique-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-white/[0.02] border-white/10 hover:border-antique-gold/30 hover:bg-white/5'}`}
                        >
                            <Car className={`w-8 h-8 mb-4 transition-transform duration-300 ${requestType === 'VEHICLE_OWNER' ? 'text-antique-gold scale-110' : 'text-white/40 group-hover:text-antique-gold/60'}`} />
                            <span className={`text-sm font-semibold tracking-wide ${requestType === 'VEHICLE_OWNER' ? 'text-antique-gold' : 'text-white/70'}`}>Fleet Partner</span>
                            <span className="text-[11px] text-white/40 mt-2">Rent your luxury vehicles</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setRequestType('HOTEL_OWNER')}
                            className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-300 group
                                ${requestType === 'HOTEL_OWNER' ? 'bg-antique-gold/10 border-antique-gold/50 shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'bg-white/[0.02] border-white/10 hover:border-antique-gold/30 hover:bg-white/5'}`}
                        >
                            <Building2 className={`w-8 h-8 mb-4 transition-transform duration-300 ${requestType === 'HOTEL_OWNER' ? 'text-antique-gold scale-110' : 'text-white/40 group-hover:text-antique-gold/60'}`} />
                            <span className={`text-sm font-semibold tracking-wide ${requestType === 'HOTEL_OWNER' ? 'text-antique-gold' : 'text-white/70'}`}>Hotel Partner</span>
                            <span className="text-[11px] text-white/40 mt-2">List your accommodations</span>
                        </button>
                    </div>
                </div>

                {requestType && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                        {/* 2. Core Business Detail */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-widest text-white/40 uppercase pl-1 flex items-center gap-2">
                                <span className="w-6 h-px bg-antique-gold/40"></span>
                                Primary Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[11px] text-white/60 font-medium tracking-wide uppercase ml-1">Business / Agency Name</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-visited:text-antique-gold transition-colors" />
                                        <input
                                            required
                                            type="text"
                                            value={businessName}
                                            onChange={(e) => setBusinessName(e.target.value)}
                                            placeholder="e.g. Royal Fleet Pvt Ltd"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-antique-gold/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[11px] text-white/60 font-medium tracking-wide uppercase ml-1">Direct Contact Number</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-visited:text-antique-gold transition-colors" />
                                        <input
                                            required
                                            type="tel"
                                            value={contactNumber}
                                            onChange={(e) => setContactNumber(e.target.value)}
                                            placeholder="+94 77 123 4567"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-antique-gold/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Dynamic Section based on Request Type */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-widest text-white/40 uppercase pl-1 flex items-center gap-2">
                                <span className="w-6 h-px bg-antique-gold/40"></span>
                                {requestType === 'VEHICLE_OWNER' ? 'Primary Vehicle Specifics' : 'Property Specifics'}
                            </h3>

                            <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01]">
                                {requestType === 'VEHICLE_OWNER' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Registration No.</label>
                                            <input
                                                required
                                                value={vehicleNumber}
                                                onChange={e => setVehicleNumber(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-antique-gold/50"
                                                placeholder="CBB-1234"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Make / Brand</label>
                                            <input
                                                required
                                                value={brand}
                                                onChange={e => setBrand(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-antique-gold/50"
                                                placeholder="Toyota"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] text-white/40 uppercase">Model</label>
                                            <input
                                                required
                                                value={model}
                                                onChange={e => setModel(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-antique-gold/50"
                                                placeholder="Premio"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[10px] text-white/40 uppercase ml-1">Full Google Maps / Physical Address</label>
                                        <input
                                            required
                                            value={hotelLocation}
                                            onChange={e => setHotelLocation(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg h-10 px-3 text-sm text-white focus:outline-none focus:border-antique-gold/50"
                                            placeholder="123 Galle Road, Colombo 03"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Verification */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold tracking-widest text-white/40 uppercase pl-1 flex items-center gap-2">
                                <span className="w-6 h-px bg-antique-gold/40"></span>
                                Credentials
                            </h3>
                            <div className="space-y-2">
                                <label className="text-[11px] text-white/60 font-medium tracking-wide uppercase ml-1">Proof of Operation (Link)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                    <input
                                        type="url"
                                        value={verificationLink}
                                        onChange={(e) => setVerificationLink(e.target.value)}
                                        placeholder="Facebook Page, Google Business Profile, or Website URL"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-antique-gold/50 focus:bg-white/10 transition-all placeholder:text-white/20"
                                    />
                                </div>
                                <p className="text-[10px] text-white/30 ml-2 mt-1">Providing a valid link dramatically speeds up your approval process.</p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-xl bg-antique-gold hover:bg-antique-gold/90 text-black font-bold uppercase tracking-widest text-sm shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Submit Execution <ChevronRight className="w-4 h-4 ml-1" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
