'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Loader2, MessageCircle } from 'lucide-react';

interface BookingWhatsAppCardProps {
    bookingId: string;
}

export default function BookingWhatsAppCard({ bookingId }: BookingWhatsAppCardProps) {
    const [loading, setLoading] = useState(true);
    const [configured, setConfigured] = useState(false);
    const [whatsAppLink, setWhatsAppLink] = useState<string | null>(null);

    useEffect(() => {
        const loadLink = async () => {
            try {
                const response = await fetch(`/api/bookings/${bookingId}/whatsapp`, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to load WhatsApp shortcut');
                }

                const data = await response.json();
                setConfigured(Boolean(data.configured));
                setWhatsAppLink(data.whatsAppLink || null);
            } catch (error) {
                console.error(error);
                setConfigured(false);
                setWhatsAppLink(null);
            } finally {
                setLoading(false);
            }
        };

        loadLink();
    }, [bookingId]);

    return (
        <div className="rounded-3xl p-6 bg-gradient-to-br from-[#111A16] to-[#0A100D] border border-white/[0.05] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center gap-2 mb-4 relative z-10">
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-display font-semibold text-off-white uppercase tracking-wider">
                    WhatsApp Concierge
                </h3>
            </div>

            {loading ? (
                <div className="flex items-center gap-3 text-sm text-white/40 h-[76px] relative z-10">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                    Preparing shortcut...
                </div>
            ) : configured && whatsAppLink ? (
                <div className="space-y-4 relative z-10">
                    <p className="text-xs text-white/50 leading-relaxed">
                        Open a prefilled concierge message with this booking’s key details.
                    </p>
                    <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 px-4 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:scale-[1.02] shadow-[0_0_15px_rgba(16,185,129,0.05)] hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open WhatsApp Message
                    </a>
                </div>
            ) : (
                <div className="space-y-3">
                    <p className="text-sm text-white/45">
                        WhatsApp dispatch is not configured for this environment yet.
                    </p>
                    <p className="text-xs text-white/30">
                        Set <code>WHATSAPP_NUMBER</code> or <code>NEXT_PUBLIC_WHATSAPP_NUMBER</code> to enable the concierge shortcut safely.
                    </p>
                </div>
            )}
        </div>
    );
}
