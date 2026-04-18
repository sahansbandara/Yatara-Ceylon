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
        <div className="liquid-glass-stat rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-display font-semibold text-deep-emerald uppercase tracking-wider">
                    WhatsApp Concierge
                </h3>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-white/45">
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
                    Preparing concierge shortcut...
                </div>
            ) : configured && whatsAppLink ? (
                <div className="space-y-3">
                    <p className="text-sm text-white/55">
                        Open a prefilled concierge message with this booking’s key details.
                    </p>
                    <a
                        href={whatsAppLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-300 transition-colors hover:bg-emerald-500/15"
                    >
                        <ExternalLink className="h-4 w-4" />
                        Open WhatsApp
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
