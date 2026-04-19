import { BookingDetailService } from '@/services/crud.service';
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BuildTourClient from "@/app/(public)/build-tour/_components/BuildTourClient";

export default async function BookingCustomPlanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await BookingDetailService.getBookingDetail(id);
    if (!data || !data.booking || data.booking.type !== 'CUSTOM' || !data.booking.customPlanId) {
        notFound();
    }

    const { booking } = data;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)]">
            <div className="flex items-center justify-between mb-4 px-4">
                <Link href={`/dashboard/bookings/${booking._id}`} className="flex items-center gap-2 text-sm text-white/50 hover:text-antique-gold transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Booking {booking.bookingNo}
                </Link>
                <div className="text-right">
                    <h2 className="font-display text-lg font-bold text-off-white">Bespoke Tour Itinerary</h2>
                    <p className="text-xs text-white/50">Update the route map to refine the price calculation.</p>
                </div>
            </div>

            <div className="flex-1 w-full bg-[#f4f1eb] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
                <BuildTourClient initialPlanId={String(booking.customPlanId)} />
            </div>
        </div>
    );
}
