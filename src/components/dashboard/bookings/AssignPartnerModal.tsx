"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AssignPartnerModal({
    bookingId,
    partners,
    partnerServices,
}: {
    bookingId: string;
    partners: any[];
    partnerServices: any[];
}) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedPartner, setSelectedPartner] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [agreedRate, setAgreedRate] = useState("");
    const [notes, setNotes] = useState("");

    const availableServices = partnerServices.filter(s => s.partnerId === selectedPartner);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedPartner) {
            setError("Please select a partner");
            return;
        }

        if (!agreedRate || isNaN(Number(agreedRate))) {
            setError("Please enter a valid agreed rate");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/booking-partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId,
                    partnerId: selectedPartner,
                    serviceId: selectedService || undefined,
                    agreedRate: Number(agreedRate),
                    notes: notes || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to assign partner");

            setIsOpen(false);
            setSelectedPartner("");
            setSelectedService("");
            setAgreedRate("");
            setNotes("");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 bg-antique-gold/10 hover:bg-antique-gold/20 text-antique-gold text-sm font-semibold rounded-xl border border-antique-gold/20 transition-all">
                    <UserPlus className="h-4 w-4" /> Assign Partner
                </button>
            </DialogTrigger>
            <DialogContent className="bg-[#0A100D] border-white/[0.05] text-off-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-display text-antique-gold">Assign Partner to Booking</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-start gap-2">
                            <X className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>{error}</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Partner</label>
                        <select
                            value={selectedPartner}
                            onChange={(e) => {
                                setSelectedPartner(e.target.value);
                                setSelectedService("");
                            }}
                            className="w-full bg-[#111A16] border border-white/10 rounded-xl px-4 py-3 text-sm text-off-white focus:outline-none focus:border-antique-gold/50"
                            required
                        >
                            <option value="">Select a partner</option>
                            {partners.map(p => (
                                <option key={p._id} value={p._id}>{p.name} ({p.type})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Service (Optional)</label>
                        <select
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                            disabled={!selectedPartner || availableServices.length === 0}
                            className="w-full bg-[#111A16] border border-white/10 rounded-xl px-4 py-3 text-sm text-off-white focus:outline-none focus:border-antique-gold/50 disabled:opacity-50"
                        >
                            <option value="">Select a service</option>
                            {availableServices.map(s => (
                                <option key={s._id} value={s._id}>{s.serviceName} - {s.rate} LKR / {s.unit}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Agreed Rate (LKR)</label>
                        <input
                            type="number"
                            value={agreedRate}
                            onChange={(e) => setAgreedRate(e.target.value)}
                            className="w-full bg-[#111A16] border border-white/10 rounded-xl px-4 py-3 text-sm text-off-white focus:outline-none focus:border-antique-gold/50"
                            placeholder="e.g. 15000"
                            min="0"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-[#111A16] border border-white/10 rounded-xl px-4 py-3 text-sm text-off-white focus:outline-none focus:border-antique-gold/50 h-24 resize-none"
                            placeholder="Any specific arrangements..."
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-antique-gold hover:bg-antique-gold/90 text-forest-green font-semibold rounded-xl text-sm transition-all disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Assignment'}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
